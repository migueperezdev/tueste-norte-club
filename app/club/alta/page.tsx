import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb } from "../../../src/db/d1";
import { clientes, planes } from "../../../src/db/schema";
import { getSession } from "../../../src/lib/session";
import FormularioAlta from "./formulario";

export const dynamic = "force-dynamic";

export default async function AltaPage() {
  const sesion = await getSession();

  if (!sesion) {
    redirect("/login");
  }

  const db = getDb();
  const suscripcion = await db.query.clientes.findFirst({
    where: eq(clientes.userId, sesion.user.id),
    with: { plan: true },
  });

  const listaPlanes = suscripcion
    ? []
    : await db.select().from(planes).orderBy(asc(planes.precioMensual)).all();

  return (
    <section className="mx-auto max-w-2xl space-y-6 rounded bg-white p-6 text-stone-900">
      <h1 className="text-3xl font-bold">
        {suscripcion ? "Tu suscripción al club" : "Apúntate al club"}
      </h1>

      {suscripcion ? (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Tu plan actual</h2>
          <p>{suscripcion.plan.nombre}</p>
          <p>
            {suscripcion.plan.gramosMes} g/mes ·{" "}
            {suscripcion.plan.precioMensual.toLocaleString("es-ES", {
              style: "currency",
              currency: "EUR",
            })}
            /mes
          </p>
          <Link href="/club/pedidos" className="inline-block underline">
            Ver mis pedidos
          </Link>
        </div>
      ) : listaPlanes.length === 0 ? (
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