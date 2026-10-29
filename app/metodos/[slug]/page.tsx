import Link from "next/link";
import { notFound } from "next/navigation";
import { metodos } from "@/data/metodos";

type DetalleMetodoProps = {
  params: Promise<{ slug: string }>;
};

export default async function DetalleMetodo({
  params,
}: DetalleMetodoProps) {
  const { slug } = await params;

  const metodo = metodos.find((metodo) => metodo.slug === slug);

  if (!metodo) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 bg-stone-50 p-6 text-stone-900">
      <Link
        href="/metodos"
        className="inline-block font-medium text-amber-800 hover:underline"
      >
        ← Volver a métodos
      </Link>

      <h1 className="text-2xl font-bold">{metodo.nombre}</h1>

      <p className="leading-relaxed">{metodo.descripcion}</p>
    </main>
  );
}