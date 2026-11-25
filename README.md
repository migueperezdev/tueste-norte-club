# Club Tueste Norte

Área de socios del Club Tueste Norte, desarrollada durante las semanas 6, 7, 8 y 9 de las prácticas de CODE NODE.

El proyecto permite descubrir los cafés del mes, consultar sus notas de cata y simular el precio de una suscripción según el número de bolsas. Los socios pueden crear una cuenta, elegir un plan, consultar sus propios pedidos y pausar o reanudar su suscripción desde el perfil.

[Ver Club Tueste Norte en producción](https://tueste-norte-club.migueperezdev.workers.dev/)

## Tecnologías

- Next.js 16.4.6 con App Router.
- React, TypeScript y Tailwind CSS.
- Better Auth para el registro y las sesiones.
- Drizzle ORM y Cloudflare D1 para los datos del club. En la semana 7 se utilizó SQLite en un archivo local.
- Cloudflare Workers, OpenNext y Wrangler para el despliegue.
- API REST de WordPress para las entradas del blog.
- Git para el control de versiones.

## Cómo arrancar el proyecto

Los siguientes pasos corresponden a la rama `feature/pausa-suscripcion` de la semana 9. Se necesita Node.js compatible con Next.js 16 y npm. Durante el desarrollo se utilizó Node.js 24.19.0 y npm 11.17.0.

1. Desde la raíz del proyecto, instala las dependencias.

   ```cmd
   npm ci
   ```

2. Crea un archivo `.env.local` en la raíz con estas variables. Sustituye el valor de ejemplo por un secreto generado para tu entorno local.

   ```dotenv
   BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_SECRET=TU_SECRETO_LOCAL
   ```

   Puedes generar el secreto con este comando.

   ```cmd
   node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
   ```

   `.env.local` queda fuera de Git.

3. Aplica las migraciones, carga los dos planes y arranca el servidor.

   ```cmd
   npx wrangler d1 migrations apply DB --local

   npx wrangler d1 execute DB --local --command "INSERT INTO planes (nombre, precio_mensual, gramos_mes) VALUES ('Descubrimiento', 19, 500), ('Cafetero', 35, 1000) ON CONFLICT(nombre) DO NOTHING"

   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000). Si arrancas en otro puerto, ajusta `BETTER_AUTH_URL` a la dirección que indica la terminal y reinicia el servidor.

El D1 local empieza con el catálogo de planes. Para probar el área de socios, crea una cuenta en `/registro` y elige un plan en `/club/alta`. Una cuenta recién creada verá «Sin pedidos por ahora» hasta que tenga pedidos asociados.

### WordPress para las entradas de la semana 6

Para mostrar las entradas del blog en local se necesita la instalación de WordPress de las semanas anteriores, con Apache y MySQL arrancados desde XAMPP.

```text
http://localhost/tueste-norte-wp/wp-json/wp/v2/posts?per_page=5
```

Si tu instalación utiliza otra dirección, modifica la URL del `fetch` en `app/entradas/page.tsx`. La consulta solicita como máximo las cinco entradas más recientes. Si WordPress no está disponible, el segmento muestra su pantalla de error. Para que `/entradas` funcione también en Cloudflare, el Worker tendría que consultar una URL de WordPress accesible desde Internet.

## Rutas

| Ruta | Contenido |
| --- | --- |
| `/` | Demostración pública con el plan Descubrimiento, el selector de bolsas y un envío ficticio. |
| `/cafes` | Catálogo de los cafés del mes. |
| `/cafes/[slug]` | Ficha de un café con descripción, origen, tueste, notas de cata y proceso. |
| `/ejercicios/componentes` | Ejercicio 1 de la semana 6 con etiquetas de tueste y botón de favoritos. |
| `/metodos` | Ejercicio 2 de la semana 6 con el listado de métodos de preparación. |
| `/metodos/[slug]` | Detalle de cada método de preparación. |
| `/entradas` | Ejercicio 3 de la semana 6 con entradas obtenidas desde WordPress. |
| `/registro` | Creación de una cuenta del club. |
| `/login` | Inicio de sesión. |
| `/club/perfil` | Perfil de la cuenta autenticada, estado de la suscripción, pausa, reanudación y cierre de sesión. |
| `/club/alta` | Elección de un plan o consulta de la suscripción actual. |
| `/club/pedidos` | Pedidos del socio autenticado, agrupados por mes. |
| `/api/pedidos` | Consulta `GET` de los pedidos del socio autenticado en JSON. |
| `/api/suscripciones/[id]` | Operación `PATCH` para pausar o reanudar una suscripción propia. |

Las rutas dinámicas de cafés y métodos leen `params` con `await params`. Si el slug no existe, llaman a `notFound()`.

El layout raíz mantiene la navegación con `next/link`. Muestra **Entrar** cuando no hay sesión y el nombre del socio cuando la hay.

## Fuente de datos del club

Cloudflare D1 guarda los planes, clientes y pedidos, además de las tablas de Better Auth. `src/db/schema.ts` define el esquema de Drizzle y `src/db/d1.ts` conecta la aplicación con el binding `DB` de Cloudflare.

La portada consulta en D1 el precio y los gramos del plan **Descubrimiento**. El saludo a Álex y los datos del envío forman parte de la demostración pública.

- `data/cafes.ts` contiene el catálogo de cafés.
- `data/socio.ts` aporta el número de socio, las bolsas iniciales y la fecha de envío de la demostración.
- `data/metodos.ts` contiene los métodos de preparación.

## Server Components y Client Components

Las páginas que consultan D1, el layout raíz, `TarjetaCafe` y `EtiquetaTueste` son Server Components. `EtiquetaTueste` recibe el nivel de tueste como prop y muestra la etiqueta correspondiente.

Entre los Client Components están:

- `components/SelectorBolsas.tsx`, que usa `useState` y `onChange` para actualizar el número de bolsas y el precio mensual.
- `app/ejercicios/componentes/BotonFavorito.tsx`, que usa `useState` y `onClick` para alternar el estado de favorito.
- `app/entradas/error.tsx`, que muestra el error del segmento y permite reintentar la carga.
- `app/club/alta/formulario.tsx`, que usa `useActionState` para mostrar el resultado del alta.
- `app/club/perfil/gestion-suscripcion.tsx`, que confirma la acción, envía el `PATCH`, bloquea los envíos dobles, muestra errores y solicita la actualización del perfil.

Las props están tipadas con TypeScript.

## Semana 6 · Entradas, carga y errores

`app/entradas/page.tsx` es un Server Component asíncrono. Hace la petición a WordPress con `await`, comprueba `res.ok` y utiliza `cache: "no-store"`.

El segmento incluye `loading.tsx` para el estado de carga y `error.tsx` para mostrar el error y ofrecer el botón **Reintentar**. La petición a WordPress sale del servidor de Next.js. En la pestaña **Network** del navegador se ven las solicitudes a Next.js.

### Cómo comprobar la carga

En `app/entradas/page.tsx` hay una línea comentada con un retardo de dos segundos. Descoméntala temporalmente, navega a **Entradas** desde otra sección y observa el estado de carga. Después vuelve a comentar la línea.

### Cómo comprobar el error

1. Abre `/entradas` con WordPress funcionando.
2. Detén Apache desde XAMPP y recarga con `Ctrl + F5`.
3. Comprueba que aparece la pantalla de error.
4. Arranca Apache de nuevo, comprueba que MySQL sigue funcionando y pulsa **Reintentar**.

Durante el desarrollo también puede aparecer el panel de depuración de Next.js con el error provocado.

## Semana 7 · Base de datos del club

En la semana 7 se creó la base SQLite original con tres tablas relacionadas.

- `planes` guarda el precio y los gramos mensuales de cada plan.
- `clientes` guarda la ficha del socio, con un correo único y una referencia a su plan.
- `pedidos` guarda el cliente, el café, el mes y el estado de cada pedido.

El flujo original creaba las tablas con Drizzle Kit y cargaba datos con `src/db/seed.ts`. El seed incorporaba dos planes, dos clientes ficticios y cuatro pedidos sin duplicarlos al repetirlo. La base original se guardaba en `data/sqlite/club.db`. La carpeta `data/sqlite/` queda excluida de Git. Drizzle Studio se utilizó para comprobar los registros en la base SQLite configurada.

El formulario original de alta validaba el nombre, el correo y la existencia del plan. Se probaron el alta correcta, el aviso de correo repetido y el rechazo de un nombre formado solo por espacios. El listado agrupaba los pedidos por mes y la API los devolvía en JSON con los datos básicos del cliente.

## Semana 8 · Autenticación, pedidos privados y despliegue

Better Auth gestiona el registro, el inicio y el cierre de sesión. El servidor lee la sesión a partir de las cabeceras de la petición. Las rutas bajo `/club` requieren una sesión y redirigen a `/login` cuando falta.

El alta valida el plan elegido y usa los datos de la cuenta autenticada para vincular la ficha del socio mediante `clientes.user_id`. Tras guardar, la Server Action llama a `revalidatePath("/club/alta")` para que la página vuelva a consultar la suscripción.

La página `/club/pedidos` y la API `/api/pedidos` filtran los pedidos por la ficha vinculada a la cuenta de la sesión. La página muestra «Sin pedidos por ahora» cuando la cuenta no tiene pedidos. La API devuelve un array JSON con el café, el mes, el estado y un objeto `cliente` con su identificador y nombre. Una solicitud sin sesión recibe `401` y el mensaje «Debes iniciar sesión».

Puedes comprobar la respuesta sin sesión desde CMD con el servidor local arrancado.

```cmd
curl.exe -i http://localhost:3000/api/pedidos
```

### Cloudflare Workers y D1

`wrangler.jsonc` define el Worker, los archivos estáticos y el binding `DB`. Las migraciones SQL están en `drizzle/`. Las bases D1 local y remota se preparan con `--local` y `--remote`, respectivamente.

Para compilar y probar en el entorno local de Workers, detén primero `npm run dev` si está usando el puerto `3000`.

```cmd
npx opennextjs-cloudflare build

npx wrangler dev --port 3000
```

La versión pública usa el D1 remoto. En Cloudflare, `BETTER_AUTH_URL` apunta a la URL pública y `BETTER_AUTH_SECRET` se configura como secreto del Worker. Los valores privados quedan fuera del repositorio.

## Semana 9 · Pausa y reanudación

La funcionalidad se desarrolla en la rama `feature/pausa-suscripcion`. Las comprobaciones descritas en esta sección corresponden al entorno local.

La especificación del encargo está en [specs/pausa-suscripcion.md](specs/pausa-suscripcion.md), el plan y la matriz CA01–CA16 en [specs/plan-pausa-suscripcion.md](specs/plan-pausa-suscripcion.md), y la especificación del ejercicio en [ejercicios/spec-pausa.md](ejercicios/spec-pausa.md).

Cada cuenta tiene cero o una ficha de suscripción en `clientes`. Su identificador es `clientes.id`, su propietario es `clientes.user_id` y su plan es `clientes.plan_id`. La pausa es inmediata y dura hasta que el socio reanuda.

### Estados y controles del perfil

| Situación | Contenido del perfil | Control disponible |
| --- | --- | --- |
| Activa | Plan y estado actual. | Pausar suscripción. |
| Pausada | Plan, estado y aviso «Suscripción pausada hasta que la reanudes». | Reanudar suscripción. |
| Cancelada | Plan y estado actual. | Sin controles de pausa o reanudación. |
| Cuenta sin ficha | «No tienes ninguna suscripción». | Sin controles de gestión. |

El enlace al historial propio permanece disponible. Pausar o reanudar conserva el plan y los pedidos anteriores. La reanudación no crea pedidos automáticamente. La cancelación no tiene una operación pública.

`app/club/perfil/page.tsx` comprueba la sesión y consulta D1 con `clientes.user_id = session.user.id`. El componente cliente `gestion-suscripcion.tsx` pide confirmación, bloquea los envíos dobles y deshabilita el botón durante el envío y la actualización. Tras recibir un `200` con el identificador y el estado esperados, solicita una nueva lectura del perfil con `router.refresh()`.

### Migraciones y protección de pedidos

| Migración | Función |
| --- | --- |
| `drizzle/0003_estado_suscripcion.sql` | Añade `clientes.estado` con `NOT NULL DEFAULT 'activa'` y un `CHECK` para `activa`, `pausada` y `cancelada`. |
| `drizzle/0004_protege_pedidos_en_pausa.sql` | Añade el trigger `pedidos_rechaza_suscripcion_pausada`, que rechaza inserciones de pedidos para una ficha pausada. |

Las fichas existentes comienzan activas y mantienen sus identificadores, propietarios, planes y pedidos. Las migraciones anteriores se conservan.

Aplica las migraciones locales con el comando indicado en «Cómo arrancar el proyecto». El endpoint `/api/pedidos` ofrece `GET`. Las pruebas de inserción se realizan directamente en D1 local; la creación de pedidos desde la aplicación queda fuera del alcance de esta funcionalidad.

### Contrato de la API

`PATCH /api/suscripciones/[id]` recibe el identificador de la ficha de suscripción, un entero positivo seguro. Las acciones admitidas son:

```json
{ "accion": "pausar" }
```

```json
{ "accion": "reanudar" }
```

El servidor comprueba primero la sesión y después exige un `Origin` que coincida exactamente con el origen autorizado configurado en el servidor, incluidos esquema, host y puerto. La comprobación del origen se basa en esa configuración.

La actualización se realiza con una sola operación `UPDATE … WHERE … RETURNING` que filtra por identificador, propietario de la sesión y estado de origen. Con cero filas actualizadas, una consulta por identificador y propietario distingue entre ficha ajena o inexistente y estado incompatible.

| Código | Situación |
| --- | --- |
| `200` | Cambio guardado: `activa → pausada` o `pausada → activa`. La respuesta incluye `id` y `estado`. |
| `400` | ID inválido, JSON malformado, acción ausente o acción desconocida. |
| `401` | Falta una sesión válida. Esta comprobación precede a la del origen. |
| `403` | Hay sesión, pero el `Origin` falta o no está autorizado. |
| `404` | La ficha no existe o pertenece a otra cuenta. |
| `409` | El estado no admite la acción: pausar una pausada, reanudar una activa o gestionar una cancelada. |
| `500` | Fallo de escritura. Se devuelve un mensaje de error y se conserva el estado previo. |

El perfil muestra los mensajes de error recibidos. Ante un fallo de conexión muestra un aviso para recargar el perfil antes de volver a intentarlo.

### Comprobación HTTP desde Windows CMD

Usa una cuenta de prueba registrada y con un plan elegido. Sustituye `CORREO_DE_PRUEBA`, `CONTRASENA_DE_PRUEBA` y el valor de `ID_FICHA` por los datos de esa cuenta. El identificador corresponde a su fila en `clientes`.

Con el servidor arrancado, define el origen y un archivo temporal de cookies fuera del repositorio:

```cmd
set "ORIGEN=http://localhost:3000"
set "ID_FICHA=1"
set "JAR=%TEMP%\tueste-norte-pausa-%RANDOM%-%RANDOM%.cookies"
```

Inicia una sesión HTTP independiente de la del navegador y continúa cuando el resultado sea `HTTP 200`:

```cmd
curl.exe -sS -o NUL -w "HTTP %{http_code}\n" "%ORIGEN%/api/auth/sign-in/email" ^
  -H "Origin: %ORIGEN%" ^
  -H "Content-Type: application/json" ^
  -c "%JAR%" ^
  --data-raw "{\"email\":\"CORREO_DE_PRUEBA\",\"password\":\"CONTRASENA_DE_PRUEBA\"}"
```

Con la ficha activa, confirma la pausa:

```cmd
curl.exe -i -X PATCH "%ORIGEN%/api/suscripciones/%ID_FICHA%" ^
  -H "Origin: %ORIGEN%" ^
  -H "Content-Type: application/json" ^
  -b "%JAR%" ^
  --data-raw "{\"accion\":\"pausar\"}"
```

Con la ficha pausada, confirma la reanudación:

```cmd
curl.exe -i -X PATCH "%ORIGEN%/api/suscripciones/%ID_FICHA%" ^
  -H "Origin: %ORIGEN%" ^
  -H "Content-Type: application/json" ^
  -b "%JAR%" ^
  --data-raw "{\"accion\":\"reanudar\"}"
```

Al terminar, cierra esa sesión HTTP de prueba y elimina su archivo temporal de cookies:

```cmd
curl.exe -sS -o NUL -w "HTTP %{http_code}\n" "%ORIGEN%/api/auth/sign-out" ^
  -X POST ^
  -H "Origin: %ORIGEN%" ^
  -H "Content-Type: application/json" ^
  -b "%JAR%" ^
  --data-raw "{}"
```

Cuando el cierre devuelva `HTTP 200`, elimina el archivo temporal:

```cmd
del "%JAR%"
```

Para probar una segunda cuenta, usa otro archivo de cookies. Si tu servidor utiliza otro puerto, ajusta la configuración del origen y `ORIGEN` a la misma dirección.

### Comprobación en el navegador

1. Inicia sesión con una cuenta que tenga una suscripción activa y abre `/club/perfil`.
2. Cancela la confirmación de pausa y comprueba en Red que no se envía ningún `PATCH`.
3. Confirma la pausa. Comprueba el `200`, el estado Pausada, el aviso y la conservación del plan.
4. Recarga el perfil y vuelve a iniciar sesión. El estado guardado debe persistir.
5. Abre el historial propio y comprueba los pedidos anteriores.
6. Cancela la confirmación de reanudación y después confírmala. Comprueba el `200` y el estado Activa.
7. Con una respuesta demorada, comprueba que el control permanece deshabilitado durante el envío.
8. Con una ficha pausada y la página abierta, selecciona Sin conexión en Red e intenta reanudar. Comprueba el error visible, la conservación del estado y la recuperación del botón.
9. Restablece Sin limitaciones y recarga. Debe conservarse el estado guardado y desaparecer el mensaje de conexión.
10. Registra otra cuenta y abre el perfil antes de elegir un plan. Debe aparecer «No tienes ninguna suscripción» sin controles de pausa o reanudación.
11. Tras cerrar sesión, abre `/club/perfil` y comprueba la redirección a `/login`.

CA14 requiere provocar un fallo de escritura en D1 local mientras siguen funcionando la sesión y las lecturas. La respuesta debe ser `500` y el perfil debe mostrar el error conservando el estado previo.

### Registro de verificación · 25 de noviembre de 2026

La API quedó registrada en el commit `a6c9699` y el perfil en `7c4de78`. La matriz completa y los resultados esperados se encuentran en el plan.

| Criterio | Evidencia registrada |
| --- | --- |
| CA01–CA03 | Pausa y reanudación con `200`, cancelación de ambas confirmaciones sin `PATCH` y control deshabilitado durante el envío. Verificados en navegador. |
| CA04 | Conservación del plan Cafetero y del estado Pausada tras recargar y volver a iniciar sesión con la cuenta de prueba. |
| CA05 | Perfil e historial accesibles durante la pausa; comprobado el pedido previo en el historial. |
| CA06 | Comparados los pedidos 1, 2 y 3 antes y después de pausar: se conservan todas las filas, identificadores, datos y estados, y la ficha mantiene el plan 2. |
| CA07 | El trigger rechazó inserciones durante la pausa en las pruebas de D1 local. |
| CA08 | Reanudación con el plan 2 y los pedidos 1 y 2 intactos, sin pedidos automáticos. Inserción posterior del pedido temporal 3 permitida en D1 local. |
| CA09 | `401` sin sesión verificado en la API. Redirección a `/login` comprobada en navegador al abrir el perfil tras cerrar sesión. |
| CA10–CA12 | `404` para fichas ajenas o inexistentes, `409` por estados incompatibles y `400` por entradas inválidas, verificados en el entorno temporal de la API. |
| CA13 | Cuenta sin ficha comprobada en navegador: mensaje previsto y ausencia de controles de gestión. |
| CA14 | Fallo de escritura provocado en D1 local: respuesta `500`, mensaje «No se pudo actualizar la suscripción» visible en el perfil, plan Cafetero y estado Pausada conservados. |
| CA15–CA16 | Concurrencia `200 + 409` y comprobaciones de origen y orden de autenticación, verificadas en el entorno temporal de la API. |

Además, se comprobó el fallo de conexión en el navegador y la conservación del estado después de restablecer la conexión y recargar. La ocultación de controles para una ficha cancelada se revisó en el código del perfil.

El pedido temporal 3 se retiró después de las pruebas, conservando los pedidos originales 1 y 2. El trigger de prueba `prueba_ca14_estado_cliente_1` también se retiró: la consulta de comprobación devolvió `triggers_prueba = 0`. La ficha 1 quedó con el plan 2 y el estado `pausada`.

## Diseño responsive

- Las tarjetas del panel se apilan en ventanas estrechas.
- El catálogo muestra una, dos o tres columnas según el espacio disponible.
- Los enlaces de navegación pueden pasar a otra línea.

El selector de bolsas simula el precio mensual. Al recargar la portada, vuelve a la selección inicial de la demostración.

## Comprobaciones

Para revisar el proyecto en local puedes ejecutar:

```cmd
npm run lint

npx tsc --noEmit

npm run build
```

Durante las semanas 6–8 se comprobaron manualmente:

- La navegación, el selector de bolsas y el retorno a la selección inicial al recargar.
- Las fichas de cafés y métodos, el 404 para slugs inexistentes y los estados de carga, error y recuperación de las entradas.
- La adaptación del panel y del catálogo al reducir el ancho de la ventana.
- En D1 local, dos cuentas con pedidos distintos vieron únicamente sus propios pedidos, tanto en la página como en la API.
- En el Worker local compilado, se comprobó el acceso a los pedidos con sesión y el bloqueo al cerrarla.
- En producción, se comprobó el registro, la persistencia del plan al recargar, la vista sin pedidos y la vuelta a `/login` tras cerrar sesión.

<!-- semana9-revision-produccion-2026-11-25 -->
## Revisión y despliegue de la semana 9

### Mejoras realizadas tras la revisión

Se incorporaron dos mejoras al componente de gestión de la suscripción:

| Commit | Problema observado | Mejora aplicada |
| --- | --- | --- |
| `1c1e3bc` | El botón se deshabilitaba, pero conservaba su etiqueta habitual durante la operación. | Se añadieron los textos «Guardando…» y «Actualizando…», junto con `aria-busy` para comunicar el progreso. |
| `1e43935` | Una sesión caducada o un conflicto podían dejar al usuario trabajando con un perfil desactualizado. | Ante un 401 se navega a `/login`; ante un 409 se muestra un aviso y se refresca el perfil para recuperar el estado actual. |

Estas mejoras mantienen la confirmación previa y el bloqueo de peticiones repetidas.

### Comprobaciones adicionales en local

- Conflicto entre dos pestañas con la misma cuenta: la petición desde el perfil desactualizado devuelve 409. Se muestra el aviso y el perfil recupera el estado actual.
- Sesión cerrada desde otra pestaña: la siguiente operación devuelve 401 y conduce automáticamente a `/login`.
- ESLint del componente de gestión: superado.
- Compilación de Next.js y generación del Worker mediante `npx opennextjs-cloudflare build`: completadas después de las dos mejoras.

Las pruebas detalladas de errores, concurrencia y protección de pedidos en D1 corresponden a las comprobaciones locales documentadas anteriormente.

### Despliegue y comprobación en producción

Aplicación pública:

https://tueste-norte-club.migueperezdev.workers.dev

El 25 de noviembre de 2026:

- Se exportó un respaldo de D1 remoto antes de aplicar las migraciones.
- Se aplicaron correctamente `0003_estado_suscripcion.sql` y `0004_protege_pedidos_en_pausa.sql` en D1 remoto.
- Se publicó el Worker con OpenNext y Cloudflare.
- Se creó la cuenta de prueba «Prueba producción semana 9», con correo `semana9-produccion@example.com`.
- Se comprobó el perfil con el plan Cafetero y la suscripción activa.
- Se confirmó la pausa: apareció el estado «Pausada», el aviso correspondiente y el botón «Reanudar suscripción».
- Se confirmó la reanudación: volvió el estado «Activa», desapareció el aviso y apareció «Pausar suscripción».
- Se comprobó la conservación del estado al recargar y del plan Cafetero durante el recorrido.

La comprobación pública cubre el flujo básico de alta, consulta del perfil, pausa y reanudación. La matriz detallada de casos negativos se verificó en local.

Las cuentas y los datos de D1 local y remoto son independientes. Las contraseñas, cookies y respaldos de la base de datos quedan fuera del repositorio.