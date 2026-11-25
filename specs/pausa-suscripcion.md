# Spec: Pausar y reanudar la suscripción del club

## Contexto

El club Tueste Norte permite a los socios acceder a su área privada.
Algunos socios necesitan dejar de recibir café temporalmente por vacaciones
o porque todavía tienen existencias. Actualmente solicitan estas pausas
manualmente y el cliente quiere que puedan gestionarlas desde la web.

## Objetivo

Permitir que un socio con sesión iniciada pause y reanude su propia
suscripción conservando su cuenta, su plan y su historial.

## Requisitos

1. Cada cuenta puede tener cero o una suscripción, representada por
   su ficha en `clientes`. El identificador es `clientes.id` y su
   propietario es la cuenta vinculada por `clientes.user_id`. El servidor
   obtiene la identidad de la sesión y comprueba la propiedad de la ficha.

2. Los estados posibles son `activa`, `pausada` y `cancelada`.
   Una suscripción activa puede pasar a pausada. Una suscripción pausada
   puede volver a activa. Una suscripción cancelada no puede reactivarse
   mediante esta funcionalidad. Las fichas existentes pasan a activas
   por defecto y conservan sus identificadores, planes, propietarios
   y pedidos. La cancelación queda fuera de las operaciones públicas.

3. La pausa no tiene una duración máxima ni una fecha de finalización.
   Se mantiene hasta que el socio la reanuda manualmente.

4. La pausa tiene efecto inmediato cuando el servidor confirma que el
   cambio se ha guardado. No se permiten fechas de inicio futuras.

5. Un trigger `BEFORE INSERT` en D1 rechaza cualquier inserción en
   `pedidos` asociada a una ficha pausada. Durante la pausa, una inserción
   de prueba con datos válidos debe fallar y no guardar el pedido.
   Después de reanudar, una inserción válida debe poder guardarse.
   La prueba se realiza directamente en D1 y no exige un código de
   respuesta HTTP.

6. Los pedidos creados antes de la pausa conservan sus datos y su estado.
   La pausa no los cancela ni los modifica.

7. La reanudación tiene efecto inmediato y permite volver a insertar
   pedidos en D1. Conserva el mismo plan y no genera pedidos para
   compensar el tiempo que la suscripción estuvo pausada.

8. En `/club/perfil` se muestra el estado de la suscripción del socio,
   si tiene una.
   Una suscripción activa muestra el botón "Pausar suscripción".
   Una pausada muestra el aviso "Suscripción pausada hasta que la reanudes"
   y el botón "Reanudar suscripción".
   Una cancelada muestra su estado sin botones de gestión.

9. Antes de pausar o reanudar se solicita confirmación. Cancelar esa
   confirmación conserva el estado actual y no envía ninguna petición
   de modificación. Durante la petición confirmada se deshabilita el
   botón para evitar envíos repetidos.

10. Un socio pausado puede seguir entrando en el club y consultar su
    perfil y su historial. Una cuenta sin suscripción muestra
    "No tienes ninguna suscripción" y no presenta botones de gestión.

11. `PATCH /api/suscripciones/{id}` recibe un cuerpo JSON con el campo
    `accion`, que admite `pausar` o `reanudar`.

    El servidor verifica primero la sesión y, si es válida, exige un
    `Origin` autorizado antes de validar la entrada o guardar.
    El origen debe coincidir exactamente en esquema, host y puerto con
    el autorizado en la configuración del servidor para ese entorno.
    El encabezado `Host` recibido no se utiliza como fuente de confianza.

    El identificador debe ser un entero positivo seguro. Los ejemplos
    de `curl` con sesión incluyen el `Origin` autorizado del entorno.

    - Sin sesión: error 401.
    - Con sesión y `Origin` ausente o no autorizado: error 403.
    - JSON inválido, `accion` ausente o inválida, o identificador con
      formato inválido: error 400.
    - Suscripción inexistente o perteneciente a otra cuenta: error 404.
    - Operación incompatible con el estado actual: error 409.
    - Fallo al guardar: error 500 con un mensaje comprensible.

    Una operación válida devuelve 200 después de guardar el cambio.

12. Los cambios persisten al recargar la página y al cerrar y volver
    a iniciar sesión. La comprobación del estado de origen y su
    actualización se realizan de forma atómica: una misma transición
    solo se aplica una vez aunque lleguen peticiones simultáneas.

## Criterios de aceptación

Para las pruebas de la API que no comprueban expresamente la ausencia
de sesión o un origen rechazado, se utiliza una sesión válida y un
`Origin` autorizado.

- CA01. Si el propietario de una suscripción activa confirma la pausa,
  recibe 200 y el perfil muestra el estado pausado, el aviso
  "Suscripción pausada hasta que la reanudes" y el botón
  "Reanudar suscripción".

- CA02. Si el propietario de una suscripción pausada confirma la
  reanudación, recibe 200 y el perfil muestra el estado activo y el
  botón "Pausar suscripción".

- CA03. Si el socio cancela la confirmación de cualquiera de las dos
  acciones, la suscripción conserva su estado y no se envía ninguna
  petición de modificación. Si confirma y la respuesta se demora,
  el botón permanece deshabilitado durante el envío.

- CA04. Si el socio recarga la página o vuelve a iniciar sesión,
  sigue viendo el último estado guardado.

- CA05. Si un socio pausado entra en el club, puede consultar su
  perfil y su historial.

- CA06. Si se pausa una suscripción que tiene pedidos anteriores,
  esos pedidos conservan todas sus filas, datos y estados.

- CA07. Si se intenta insertar directamente en D1 un pedido con datos
  válidos para una suscripción pausada, el trigger rechaza la inserción
  y el pedido no se guarda.

- CA08. Si se reanuda una suscripción, conserva su plan y sus pedidos
  anteriores y no genera pedidos correspondientes a la pausa.
  Una inserción válida de prueba en D1 después de reanudar se guarda
  correctamente.

- CA09. Si alguien entra en `/club/perfil` sin sesión, se le redirige
  a `/login`. Si intenta modificar una suscripción mediante la API
  sin sesión, recibe 401.

- CA10. Si se solicita una suscripción inexistente o ajena, se recibe
  404 y no se modifica ninguna suscripción.

- CA11. Si se intenta pausar una suscripción ya pausada, reanudar una
  ya activa o realizar cualquiera de estas acciones sobre una cancelada,
  se recibe 409 sin cambios.

- CA12. Si se envía un identificador inválido, un cuerpo JSON malformado,
  una acción ausente o una acción desconocida, se recibe 400 sin cambios.

- CA13. Si la cuenta no tiene suscripción, aparece el mensaje
  "No tienes ninguna suscripción" y no hay botones de gestión.

- CA14. Si falla el guardado, se recibe 500, se muestra un mensaje
  de error y se conserva el estado anterior. La operación no se
  presenta como realizada.

- CA15. Si llegan dos peticiones simultáneas para pausar la misma
  suscripción activa, una recibe 200 y la otra 409. El estado final
  es pausado y no se crean registros duplicados.

- CA16. Con sesión válida, un PATCH con `Origin` ausente o no
  autorizado devuelve 403 y no cambia la suscripción. Con un
  `Origin` autorizado, una petición válida del propietario puede
  completarse con 200. Sin sesión, devuelve 401 incluso si `Origin`
  está ausente o no está autorizado.

## Fuera de alcance

- Cambiar de plan, cantidad de café o precio.
- Cancelar definitivamente una suscripción o eliminar la cuenta.
- Reactivar suscripciones canceladas.
- Programar pausas futuras o reanudaciones automáticas.
- Cancelar pedidos existentes o tramitar devoluciones.
- Integrar pasarelas de pago o sistemas de transporte.
- Crear una API, un flujo manual o un sistema automático para generar
  pedidos desde la aplicación. Las inserciones directas en D1 se utilizan
  únicamente para verificar la protección durante la pausa.
- Enviar notificaciones por correo electrónico.