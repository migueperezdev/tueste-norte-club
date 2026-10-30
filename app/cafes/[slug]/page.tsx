import Link from "next/link";
import { notFound } from "next/navigation";
import EtiquetaTueste from "@/components/EtiquetaTueste";
import { cafes } from "@/data/cafes";

type DetalleCafeProps = {
  params: Promise<{ slug: string }>;
};

export default async function DetalleCafe({
  params,
}: DetalleCafeProps) {
  const { slug } = await params;

  const cafe = cafes.find((cafe) => cafe.slug === slug);

  if (!cafe) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 rounded-2xl bg-stone-50 p-6 text-stone-900 sm:p-8">
      <Link
        href="/cafes"
        className="inline-flex min-h-11 items-center font-medium text-amber-800 hover:underline"
      >
        ← Volver al catálogo
      </Link>

      <article className="space-y-8">
        <header className="space-y-4">
          <EtiquetaTueste nivel={cafe.tueste} />

          <h1 className="text-3xl font-bold sm:text-4xl">
            {cafe.nombre}
          </h1>

          <p className="text-lg text-stone-600">
            {cafe.origen}
          </p>
        </header>

        <p className="leading-relaxed text-stone-700">
          {cafe.descripcion}
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">
            Notas de cata
          </h2>

          <ul className="flex flex-wrap gap-3">
            {cafe.notasCata.map((nota) => (
              <li
                key={nota}
                className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-amber-950"
              >
                {nota}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">
            Proceso
          </h2>

          <p className="text-stone-700">
            {cafe.proceso}
          </p>
        </section>
      </article>
    </main>
  );
}