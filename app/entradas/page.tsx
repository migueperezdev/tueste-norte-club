type EntradaWordPress = {
  id: number;
  title: {
    rendered: string;
  };
};

export default async function PaginaEntradas() {
  // Retardo artificial desactivado: se utilizó para probar loading.tsx.
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  // Esta petición a WordPress no aparece como una petición directa
  // a su API en Network del navegador: la ejecuta el servidor de Next.js.
  // El navegador recibe de Next.js el HTML y los datos de React.
  const res = await fetch(
    "http://localhost/tueste-norte-wp/wp-json/wp/v2/posts?per_page=5",
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      `No se pudieron obtener las entradas. Estado HTTP: ${res.status}`
    );
  }

  const entradas: EntradaWordPress[] = await res.json();

  return (
    <main className="mx-auto max-w-3xl space-y-6 bg-stone-50 p-6 text-stone-900">
      <h1 className="text-2xl font-bold">
        Últimas entradas del blog
      </h1>

      <p>Publicaciones de nuestro WordPress.</p>

      {entradas.length === 0 ? (
        <p>Todavía no hay entradas publicadas.</p>
      ) : (
        <ul className="space-y-3">
          {entradas.map((entrada) => (
            <li
              key={entrada.id}
              className="rounded-lg border border-stone-200 bg-white p-4"
            >
              {entrada.title.rendered}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}