const metodos = [
  "V60",
  "Prensa francesa",
  "Espresso",
  "AeroPress",
];

export default function PaginaMetodos() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 bg-stone-50 p-6 text-stone-900">
      <h1 className="text-2xl font-bold">
        Métodos de preparación
      </h1>

      <p>Descubre distintas formas de preparar tu café.</p>

      <ul className="grid gap-4 sm:grid-cols-2">
        {metodos.map((metodo) => (
          <li
            key={metodo}
            className="rounded-lg border border-stone-200 bg-white p-4 font-medium"
          >
            {metodo}
          </li>
        ))}
      </ul>
    </main>
  );
}