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

1. Solo un socio con sesión iniciada puede gestionar sus suscripciones.
   El servidor obtiene su identidad de la sesión y comprueba que la
   suscripción solicitada le pertenece.

2. Una suscripción activa puede pasar a pausada. Una suscripción pausada
   puede volver a activa. Una suscripción cancelada no puede reactivarse
   mediante esta funcionalidad.

3. La pausa no tiene una duración máxima ni una fecha de finalización.
   Se mantiene hasta que el socio la reanuda manualmente.

4. La pausa tiene efecto inmediato cuando el servidor confirma que el
   cambio se ha guardado. No se permiten fechas de inicio futuras.

5. Mientras una suscripción esté pausada, no se pueden crear nuevos
   pedidos asociados a ella. Cualquier mecanismo existente que intente
   crearlos debe rechazar la operación con un error 409.

6. Los pedidos creados antes de la pausa conservan sus datos y su estado.
   La pausa no los cancela ni los modifica.

7. La reanudación tiene efecto inmediato y permite volver a crear pedidos.
   Conserva el mismo plan y no genera pedidos para compensar el tiempo
   que la suscripción estuvo pausada.

8. En /club/perfil se muestra el estado de cada suscripción del socio.
   Una suscripción activa muestra el botón "Pausar suscripción".
   Una pausada muestra el aviso "Suscripción pausada hasta que la reanudes"
   y el botón "Reanudar suscripción".

9. Antes de pausar o reanudar se solicita confirmación. Cancelar esa
   confirmación conserva el estado actual. Durante la petición se
   deshabilita el botón para evitar envíos repetidos.

10. Un socio pausado puede seguir entrando en el club y consultar su
    perfil y su historial. Una cuenta sin suscripciones muestra
    "No tienes ninguna suscripción" y no presenta botones de gestión.

11. El servidor valida las operaciones:
    - Sin sesión: error 401.
    - Suscripción inexistente o perteneciente a otra cuenta: error 404.
    - Operación o identificador con formato inválido: error 400.
    - Operación incompatible con el estado actual: error 409.
    - Fallo al guardar: error 500 con un mensaje comprensible.
    Una operación válida devuelve 200 después de guardar el cambio.

12. Los cambios persisten al recargar la página y al cerrar y volver
    a iniciar sesión. Las peticiones simultáneas deben comprobar el
    estado de forma atómica: una misma transición solo se aplica una vez.

## Criterios de aceptación

- CA01. Si el propietario de una suscripción activa confirma la pausa,
  recibe 200 y el perfil muestra el estado pausado y el botón de reanudar.

- CA02. Si el propietario de una suscripción pausada confirma la
  reanudación, recibe 200 y el perfil muestra el estado activo.

- CA03. Si el socio cancela la confirmación, la suscripción conserva
  su estado y no se envía ninguna petición de modificación.

- CA04. Si el socio recarga la página o vuelve a iniciar sesión,
  sigue viendo el último estado guardado.

- CA05. Si un socio pausado entra en el club, puede consultar su
  perfil y su historial.

- CA06. Si se pausa una suscripción que tiene pedidos anteriores,
  esos pedidos conservan sus datos y su estado.

- CA07. Si se intenta crear un pedido para una suscripción pausada,
  se recibe 409 y el pedido no se guarda.

- CA08. Si se reanuda una suscripción, conserva su plan y permite
  pedidos futuros sin generar pedidos correspondientes a la pausa.

- CA09. Si alguien entra en /club/perfil sin sesión, se le redirige
  a /login. Si intenta modificar una suscripción mediante la API
  sin sesión, recibe 401.

- CA10. Si se solicita una suscripción inexistente o ajena, se recibe
  404 y no se modifica ninguna suscripción.

- CA11. Si se intenta pausar una suscripción ya pausada, reanudar una
  ya activa o modificar una cancelada, se recibe 409 sin cambios.

- CA12. Si se envía una operación desconocida o un identificador
  con formato inválido, se recibe 400 sin cambios.

- CA13. Si la cuenta no tiene suscripciones, aparece el mensaje
  "No tienes ninguna suscripción" y no hay botones de gestión.

- CA14. Si falla el guardado, se recibe 500, se muestra un mensaje
  de error y no se presenta la operación como realizada.

- CA15. Si llegan dos peticiones simultáneas para pausar la misma
  suscripción activa, una recibe 200 y la otra 409. El estado final
  es pausado y no se crean registros duplicados.

## Fuera de alcance

- Cambiar de plan, cantidad de café o precio.
- Cancelar definitivamente una suscripción o eliminar la cuenta.
- Reactivar suscripciones canceladas.
- Programar pausas futuras o reanudaciones automáticas.
- Cancelar pedidos existentes o tramitar devoluciones.
- Integrar pasarelas de pago o sistemas de transporte.
- Crear un sistema de generación automática de pedidos.
- Enviar notificaciones por correo electrónico.