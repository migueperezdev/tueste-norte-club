# Club Tueste Norte

Área de socios del Club Tueste Norte, desarrollada durante las semanas 6, 7 y 8 de las prácticas de CODE NODE.

El proyecto permite descubrir los cafés del mes, consultar sus notas de cata y simular el precio de una suscripción según el número de bolsas. Los socios pueden crear una cuenta, elegir un plan y consultar sus propios pedidos.

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

Los siguientes pasos corresponden a la rama `semana-8`. Se necesita Node.js compatible con Next.js 16 y npm. Durante el desarrollo se utilizó Node.js 24.19.0 y npm 11.17.0.

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
| `/club/perfil` | Perfil de la cuenta autenticada y cierre de sesión. |
| `/club/alta` | Elección de un plan o consulta de la suscripción actual. |
| `/club/pedidos` | Pedidos del socio autenticado, agrupados por mes. |
| `/api/pedidos` | Consulta `GET` de los pedidos del socio autenticado en JSON. |

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

Durante la práctica se comprobaron manualmente:

- La navegación, el selector de bolsas y el retorno a la selección inicial al recargar.
- Las fichas de cafés y métodos, el 404 para slugs inexistentes y los estados de carga, error y recuperación de las entradas.
- La adaptación del panel y del catálogo al reducir el ancho de la ventana.
- En D1 local, dos cuentas con pedidos distintos vieron únicamente sus propios pedidos, tanto en la página como en la API.
- En el Worker local compilado, se comprobó el acceso a los pedidos con sesión y el bloqueo al cerrarla.
- En producción, se comprobó el registro, la persistencia del plan al recargar, la vista sin pedidos y la vuelta a `/login` tras cerrar sesión.