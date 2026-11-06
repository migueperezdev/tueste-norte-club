# Club Tueste Norte

Área de socios del Club Tueste Norte, desarrollada durante las semanas 6 y 7 de las prácticas de CODE NODE.

Permite darse de alta, consultar los pedidos de cada mes, simular el número de bolsas de una suscripción de ejemplo y descubrir los cafés del mes con sus notas de cata.

## Tecnologías

- Next.js 16.4.3 con App Router.
- React y TypeScript.
- Tailwind CSS.
- Drizzle ORM y SQLite.
- REST API de WordPress para las entradas.
- Git para el control de versiones.

## Cómo arrancar el proyecto

Se necesita Node.js compatible con Next.js 16 y npm. El entorno utilizado durante el desarrollo fue Node.js 24.19.0 y npm 11.17.0.

En un clon nuevo, ejecuta estos comandos en orden desde la raíz del proyecto.

```cmd
npm install
npx drizzle-kit push
npx tsx src/db/seed.ts
npm run dev
```

Abre http://localhost:3000 en el navegador. Si ese puerto está ocupado, utiliza la dirección indicada por la terminal.

### WordPress para las entradas de la semana 6

Para mostrar las entradas del blog se necesita la instalación local de WordPress de las semanas anteriores, con Apache y MySQL arrancados desde XAMPP.

La dirección utilizada es:

```text
http://localhost/tueste-norte-wp/wp-json/wp/v2/posts?per_page=5
```

Si tu instalación utiliza otra dirección, modifica la URL del fetch en `app/entradas/page.tsx`.

Se solicitan como máximo las cinco entradas más recientes. Si WordPress no está disponible, la ruta muestra su pantalla de error.

## Rutas

El proyecto conserva las rutas de la semana 6 e incorpora el alta, el listado de pedidos y la API del club.

| Ruta | Contenido |
| --- | --- |
| `/` | Panel del socio: plan, selector de bolsas y próximo envío. |
| `/cafes` | Catálogo de los cafés del mes. |
| `/cafes/[slug]` | Ficha de un café con descripción, origen, tueste, notas de cata y proceso. |
| `/ejercicios/componentes` | Ejercicio 1: etiquetas de tueste y botón de favoritos. |
| `/metodos` | Ejercicio 2: listado de métodos de preparación. |
| `/metodos/[slug]` | Ejercicio 2: detalle de cada método. |
| `/entradas` | Ejercicio 3: entradas obtenidas desde WordPress. |
| `/club/alta` | Formulario de alta con los planes disponibles en SQLite. |
| `/club/pedidos` | Pedidos del club agrupados por mes. |
| `/api/pedidos` | Consulta GET de los pedidos en JSON. |

Las rutas dinámicas leen `params` con `await params`. Cuando el slug no existe, llaman a `notFound()`.

El layout raíz mantiene una navegación común con enlaces de `next/link`.

## Fuente de datos del Club

Inicio lee de SQLite el nombre del socio de demostración y su plan, con el precio y los gramos mensuales. La misma base guarda los clientes y los pedidos del club.

Estos archivos TypeScript completan los datos de ejemplo.

- `data/cafes.ts` contiene el catálogo de cafés.
- `data/socio.ts` aporta el número de socio, las bolsas iniciales y la fecha de envío de la demostración.
- `data/metodos.ts` contiene los métodos de preparación.

## Server Components y Client Components

Las páginas, el layout, `TarjetaCafe` y `EtiquetaTueste` permanecen como Server Components.

`EtiquetaTueste` solo necesita recibir un nivel de tueste y mostrar una etiqueta: no utiliza estado ni eventos del navegador.

Los Client Components son:

- `components/SelectorBolsas.tsx`: utiliza `useState` y `onChange` para cambiar el número de bolsas y actualizar el precio mensual.
- `app/ejercicios/componentes/BotonFavorito.tsx`: utiliza `useState` y `onClick` para alternar el estado de favorito.
- `app/entradas/error.tsx`: es el componente de error del segmento y permite volver a solicitar las entradas mediante `retry()`.
- `app/club/alta/formulario.tsx` usa `useActionState` para mostrar el resultado del alta.

Los componentes que reciben props las tienen tipadas con TypeScript.

## Semana 6 — Entradas, carga y errores

`app/entradas/page.tsx` es un Server Component async que realiza el fetch directamente con await y comprueba `res.ok`.

La petición utiliza `cache: "no-store"`.

El segmento incluye:

- `loading.tsx`: muestra el estado de carga.
- `error.tsx`: muestra un mensaje de error y el botón «Reintentar».

La petición directa a la API de WordPress se ejecuta en el servidor de Next.js. En Network del navegador aparecen las solicitudes a Next.js, pero no esa petición del servidor a WordPress. Esta explicación también está incluida como comentario en el código.

### Cómo comprobar la carga

En `app/entradas/page.tsx` hay una línea comentada con un retardo artificial de dos segundos.

Descoméntala temporalmente y navega desde otra sección a «Entradas» para observar `loading.tsx`. Después vuelve a dejarla comentada.

### Cómo comprobar el error

1. Abre `/entradas` con WordPress funcionando.
2. Detén Apache desde XAMPP.
3. Recarga la página con Ctrl + F5.
4. Comprueba que aparece la pantalla de error.
5. Arranca Apache de nuevo, comprueba que MySQL sigue funcionando y pulsa «Reintentar».

Durante el desarrollo también puede aparecer el panel de depuración de Next.js con el error provocado.

## Diseño responsive

El diseño utiliza flex y grid de Tailwind con breakpoints:

- Las tarjetas del panel se apilan en ventanas estrechas.
- El catálogo muestra una, dos o tres columnas según el espacio disponible.
- La navegación permite que los enlaces pasen a otra línea.

## Comprobaciones

```bash
npm run lint
npm run build
```

Ambas comprobaciones han finalizado correctamente durante la preparación de la práctica.

También se han comprobado manualmente:

- La navegación entre páginas.
- El cambio de bolsas y la actualización del precio.
- El retorno al plan inicial al recargar.
- Las fichas de los cafés y de los métodos.
- El 404 para slugs inexistentes.
- Los estados de carga, error y recuperación de las entradas.
- La adaptación del panel y del catálogo al estrechar la ventana.

## Alcance del prototipo

El selector de bolsas simula el precio mensual y vuelve a su selección inicial al recargar la página.

## Semana 7 — Base de datos del club

El club utiliza Drizzle ORM y SQLite con tres tablas relacionadas.

- `planes` guarda los precios mensuales y los gramos de cada plan.
- `clientes` guarda los socios, con email único y una referencia a su plan.
- `pedidos` guarda el cliente, el café, el mes y el estado de cada pedido.

### Instalación y preparación

Para crear las tablas y cargar los datos de ejemplo, sigue los pasos de [Cómo arrancar el proyecto](#cómo-arrancar-el-proyecto).

El seed carga dos planes, dos clientes ficticios y cuatro pedidos.
Puede ejecutarse varias veces sin duplicar esos registros.

La base de datos se guarda en `data/sqlite/club.db`. La carpeta
`/data/sqlite/` queda excluida de Git mediante `.gitignore`.

### Consultar los datos con Studio

```cmd
npx drizzle-kit studio
```

### Alta de suscripción

La página `/club/alta` carga los planes desde la base de datos.

El formulario utiliza una Server Action que valida el nombre, el email
y la existencia del plan elegido. El email se guarda en minúsculas y
su restricción de unicidad evita altas duplicadas.

Tras guardar el cliente, se llama a `revalidatePath("/club/alta")`.

Se han comprobado el alta correcta, el aviso de email repetido y
la validación del nombre formado solo por espacios. También se ha
verificado el registro guardado mediante Drizzle Studio.

### Listado de pedidos

`/club/pedidos` agrupa por mes los pedidos guardados en SQLite. La consulta
de Drizzle incluye el cliente de cada pedido mediante `with`. Cuando la
consulta devuelve cero filas, la página muestra «Sin pedidos por ahora».

### API de pedidos

`GET http://localhost:3000/api/pedidos` devuelve un array de pedidos en JSON.
Cada pedido contiene su café, mes y estado, junto con el identificador y el
nombre del cliente en el objeto `cliente`.

Con el servidor arrancado, ejecuta este comando.

```cmd
curl.exe -i http://localhost:3000/api/pedidos
```

Ejemplo de respuesta con un pedido.

```json
[
  {
    "id": 2,
    "clienteId": 1,
    "cafe": "Guatemala Antigua",
    "mes": "2026-11",
    "estado": "pendiente",
    "cliente": {
      "id": 1,
      "nombre": "Álex"
    }
  }
]
```