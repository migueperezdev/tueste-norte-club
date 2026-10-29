import Link from "next/link";
import { metodos } from "@/data/metodos";

export default function PaginaMetodos() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 bg-stone-50 p-6 text-stone-900">
      <h1 className="text-2xl font-bold">
        Métodos de preparación
      </h1>

      <p>Elige un método para conocer sus características.</p>

      <ul className="grid gap-4 sm:grid-cols-2">
        {metodos.map((metodo) => (
          <li key={metodo.slug}>
            <Link
              href={`/metodos/${metodo.slug}`}
              className="block rounded-lg border border-stone-200 bg-white p-4 font-medium hover:border-amber-700 hover:bg-amber-50"
            >
              {metodo.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}