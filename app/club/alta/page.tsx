import { asc } from "drizzle-orm";
import Link from "next/link";
import { db } from "../../../src/db";
import { planes } from "../../../src/db/schema";
import FormularioAlta from "./formulario";

export const dynamic = "force-dynamic";

export default function AltaPage() {
  const listaPlanes = db
    .select()
    .from(planes)
    .orderBy(asc(planes.precioMensual))
    .all();

  return (
    <section className="mx-auto max-w-2xl space-y-6 rounded bg-white p-6 text-stone-900">
      <h1 className="text-3xl font-bold">Apúntate al club</h1>

      <p>
        Elige tu plan de café y completa tus datos para registrar tu
        suscripción.
      </p>

      {listaPlanes.length === 0 ? (
        <p>No hay planes disponibles en este momento.</p>
      ) : (
        <FormularioAlta planes={listaPlanes} />
      )}

      <Link href="/" className="inline-block underline">
        Volver al inicio
      </Link>
    </section>
  );
}