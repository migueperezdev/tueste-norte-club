import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CerrarSesion } from "../../../components/cerrar-sesion";
import { getDb } from "../../../src/db/d1";
import { clientes } from "../../../src/db/schema";
import { getSession } from "../../../src/lib/session";
import { GestionSuscripcion } from "./gestion-suscripcion";

export default async function PerfilPage() {
  const sesion = await getSession();

  if (!sesion) {
    redirect("/login");
  }

  const suscripcion = await getDb().query.clientes.findFirst({
    where: eq(clientes.userId, sesion.user.id),
    columns: { id: true, estado: true },
    with: { plan: { columns: { nombre: true } } },
  });

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-2xl font-semibold">Mi perfil</h1>

      <dl className="mt-6 grid gap-4">
        <div>
          <dt className="font-semibold">Nombre</dt>
          <dd>{sesion.user.name}</dd>
        </div>
        <div>
          <dt className="font-semibold">Correo electrónico</dt>
          <dd>{sesion.user.email}</dd>
        </div>
      </dl>

      <section className="mt-6 space-y-3" aria-labelledby="titulo-suscripcion">
        <h2 id="titulo-suscripcion" className="text-xl font-semibold">Mi suscripción</h2>

        {suscripcion ? (
          <>
            <dl className="grid gap-2">
              <div>
                <dt className="font-semibold">Plan</dt>
                <dd>{suscripcion.plan.nombre}</dd>
              </div>
              <div>
                <dt className="font-semibold">Estado</dt>
                <dd className="capitalize">{suscripcion.estado}</dd>
              </div>
            </dl>

            {suscripcion.estado === "pausada" && (
              <p>Suscripción pausada hasta que la reanudes</p>
            )}

            {suscripcion.estado !== "cancelada" && (
              <GestionSuscripcion
                id={suscripcion.id}
                accion={suscripcion.estado === "activa" ? "pausar" : "reanudar"}
              />
            )}
          </>
        ) : (
          <p>No tienes ninguna suscripción</p>
        )}

        <Link href="/club/pedidos" className="inline-block underline">Ver mis pedidos</Link>
      </section>

      <CerrarSesion />
    </main>
  );
}
