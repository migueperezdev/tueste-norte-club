# Plan de pausa y reanudación · Semana 9

## Decisiones acordadas

- Cada cuenta tiene cero o una suscripción. La ficha es `clientes.id`, su propietario es `clientes.user_id` y el plan es `clientes.plan_id`.
- Las fichas existentes empiezan activas y conservan identificadores, propietarios, planes y pedidos. La pausa es inmediata e indefinida hasta que el socio reanude. La cancelación carece de operación pública.
- Un trigger de D1 protege las inserciones mientras la ficha está pausada. `app/api/pedidos/route.ts` solo ofrece GET. Los criterios de inserción se verifican directamente en D1. Crear pedidos desde la aplicación queda fuera de alcance.

## Etapas revisables y archivos previstos

1. **Estado.** Añadir `clientes.estado` en `src/db/schema.ts` y generar `drizzle/0003_estado_suscripcion.sql` con Drizzle Kit. Usar `NOT NULL DEFAULT 'activa'` y un `CHECK` para `activa`, `pausada` y `cancelada`. Revisar que la migración añada la columna sin reconstruir tablas y que el snapshot y el journal de `drizzle/meta/` encadenen con `0002`.

2. **Protección de pedidos.** Generar `drizzle/0004_protege_pedidos_en_pausa.sql` con el modo de migración personalizada de Drizzle Kit y revisar los metadatos que genere. El trigger `BEFORE INSERT` sobre `pedidos` consulta la ficha por `NEW.cliente_id` y aborta la inserción si está pausada. Mantener el trigger en SQL. Comprobar con Wrangler y D1 local la secuencia desde una base vacía y desde `0002` con datos de prueba. Las migraciones anteriores quedan intactas.

3. **API.** Crear `app/api/suscripciones/[id]/route.ts`. El PATCH reutiliza `getSession()` de `src/lib/session.ts`. Primero comprueba la sesión (401) y después exige un `Origin` que coincida exactamente con el origen autorizado configurado en servidor para el entorno (403 si falta o no coincide). Comparar esquema, host y puerto usando la configuración del servidor, sin tomar el encabezado `Host` recibido como fuente de confianza. Validar como entero positivo seguro el ID y como JSON el cuerpo, con `accion` igual a `pausar` o `reanudar` (400). Usar un solo `UPDATE … WHERE … RETURNING` que filtre por ID, propietario obtenido de la sesión y estado de origen. Responder 200 tras guardar. Con cero filas actualizadas, consultar por ID y propietario para distinguir ficha ajena o inexistente (404) de estado incompatible (409). Devolver 500 con un mensaje comprensible si falla la escritura.

4. **Perfil.** En `app/club/perfil/page.tsx`, consultar ficha y plan desde D1 filtrando por `clientes.user_id = session.user.id`. Un componente cliente en el mismo directorio pide confirmación, deshabilita el control durante el envío, muestra errores y refresca el perfil tras el 200. Mostrar el estado de la ficha, los botones y avisos de la spec, o «No tienes ninguna suscripción» si no existe. Las fichas canceladas carecen de controles. Verificar que el historial propio sigue disponible.

5. **Verificación y documentación.** Revisar la matriz con cuentas y datos de prueba en local. Para CA14, provocar un fallo de escritura manteniendo operativas la sesión y las lecturas. Documentar el contrato y la comprobación local en `README.md` cuando se implemente.

## Ejemplos para Windows CMD

Estos ejemplos se utilizarán para verificar la funcionalidad cuando esté implementada.

Crea una cuenta desechable en `/registro`, elige un plan en `/club/alta` y anota el ID de su ficha en D1 local.

Sustituye el ID `1` y los marcadores `CORREO_DE_PRUEBA` y `CONTRASENA_DE_PRUEBA` por los datos de esa cuenta de prueba.

El primer comando de curl inicia una sesión independiente mediante Better Auth y guarda las cookies en un archivo temporal de Windows fuera del repositorio. Continúa tras comprobar que el inicio de sesión devuelve 200.

Usa un nombre de archivo diferente para una segunda cuenta. Al terminar, cierra las sesiones de prueba y elimina sus archivos temporales.

Los ejemplos contienen marcadores y no incluyen credenciales ni cookies reales.

```cmd
set "ORIGEN=http://localhost:3000"
set "JAR=%TEMP%\tueste-norte-pausa-%RANDOM%-%RANDOM%.cookies"

curl.exe -sS -o NUL -w "HTTP %{http_code}" "%ORIGEN%/api/auth/sign-in/email" ^
  -H "Origin: %ORIGEN%" -H "Content-Type: application/json" ^
  -c "%JAR%" --data-raw "{\"email\":\"CORREO_DE_PRUEBA\",\"password\":\"CONTRASENA_DE_PRUEBA\"}"

curl.exe -i -X PATCH "%ORIGEN%/api/suscripciones/1" ^
  -H "Origin: %ORIGEN%" -H "Content-Type: application/json" ^
  -b "%JAR%" --data-raw "{\"accion\":\"pausar\"}"

curl.exe -i -X PATCH "%ORIGEN%/api/suscripciones/1" ^
  -H "Origin: %ORIGEN%" -H "Content-Type: application/json" ^
  -b "%JAR%" --data-raw "{\"accion\":\"reanudar\"}"
```

## Matriz de pruebas

| Criterio | Prueba | Resultado esperado |
| --- | --- | --- |
| CA01 | Confirmar pausa de una ficha activa propia. | 200, estado `pausada`, aviso «Suscripción pausada hasta que la reanudes» y botón «Reanudar suscripción». |
| CA02 | Confirmar reanudación de una ficha pausada propia. | 200, estado `activa` y botón «Pausar suscripción». |
| CA03 | Cancelar ambas confirmaciones. Después, confirmar con respuesta demorada. | Al cancelar no sale PATCH y el estado se conserva. Durante el envío confirmado, el botón está deshabilitado. |
| CA04 | Recargar tras guardar y volver a iniciar sesión. | Persiste el último estado guardado. |
| CA05 | Abrir perfil e historial con una ficha pausada. | Ambos siguen accesibles para el propietario. |
| CA06 | Comparar los pedidos previos antes y después de pausar. | Se conservan todas las filas, datos y estados. |
| CA07 | Intentar insertar un pedido válido durante la pausa en D1. | El trigger rechaza la escritura y el pedido no se guarda. |
| CA08 | Comparar plan y pedidos al reanudar e insertar después un pedido de prueba. | El plan y los pedidos previos se conservan. La reanudación no genera pedidos y la nueva inserción se guarda. |
| CA09 | Abrir el perfil sin sesión y llamar al PATCH sin sesión con origen autorizado. | Redirección a `/login` y 401, respectivamente. |
| CA10 | Con sesión y origen autorizado, solicitar un ID ajeno y uno inexistente. | Ambos devuelven 404 sin cambios. |
| CA11 | Pausar una pausada, reanudar una activa y probar ambas acciones sobre una cancelada. | 409 en todos los casos, sin cambios. |
| CA12 | Enviar ID inválido, JSON malformado, acción ausente y acción desconocida con sesión y origen válidos. | 400 en todos los casos, sin cambios. |
| CA13 | Abrir el perfil de una cuenta sin ficha. | Mensaje «No tienes ninguna suscripción» y ausencia de controles. |
| CA14 | Provocar un fallo de escritura en D1 local con sesión y origen válidos. | 500, mensaje visible y estado previo conservado, sin confirmación de éxito. |
| CA15 | Enviar dos pausas concurrentes sobre una ficha activa con sesión y origen válidos. | Un 200 y un 409. Una sola ficha queda pausada y no se crean registros duplicados. |
| CA16 | Probar el PATCH con origen ausente, no autorizado y autorizado con sesión. Repetir los dos primeros casos sin sesión. | Con sesión, 403 sin cambios en los dos primeros casos y 200 en el tercero para una acción válida propia. Sin sesión, 401 en ambos casos. |