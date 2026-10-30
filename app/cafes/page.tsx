import TarjetaCafe from "@/components/TarjetaCafe";
import { cafes } from "@/data/cafes";

export default function PaginaCafes() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 rounded-2xl bg-stone-50 p-6 text-stone-900 sm:p-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Cafés del mes
        </h1>

        <p className="leading-relaxed text-stone-600">
          Descubre nuestra selección y las notas de cata de cada café.
        </p>
      </header>

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cafes.map((cafe) => (
          <li key={cafe.slug}>
            <TarjetaCafe cafe={cafe} />
          </li>
        ))}
      </ul>

      <p className="text-sm text-stone-600">
        Selección de demostración con datos ficticios.
      </p>
    </main>
  );
}