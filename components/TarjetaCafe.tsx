import Link from "next/link";
import EtiquetaTueste from "@/components/EtiquetaTueste";
import type { Cafe } from "@/data/cafes";

type TarjetaCafeProps = {
  cafe: Cafe;
};

export default function TarjetaCafe({
  cafe,
}: TarjetaCafeProps) {
  return (
    <article className="flex h-full flex-col gap-5 rounded-xl border border-stone-200 bg-white p-6">
      <div className="space-y-3">
        <EtiquetaTueste nivel={cafe.tueste} />

        <h2 className="text-xl font-bold">
          {cafe.nombre}
        </h2>

        <p className="text-stone-600">
          {cafe.origen}
        </p>
      </div>

      <p className="text-sm leading-relaxed text-stone-600">
        Notas de cata: {cafe.notasCata.join(", ")}.
      </p>

      <Link
        href={`/cafes/${cafe.slug}`}
        className="mt-auto inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-800 px-4 py-2 font-semibold text-white hover:bg-amber-900"
      >
        Ver ficha
        <span className="sr-only"> de {cafe.nombre}</span>
      </Link>
    </article>
  );
}