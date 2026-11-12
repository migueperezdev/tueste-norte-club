import { redirect } from "next/navigation";
import { CerrarSesion } from "../../../components/cerrar-sesion";
import { getSession } from "../../../src/lib/session";

export default async function PerfilPage() {
  const sesion = await getSession();

  if (!sesion) {
    redirect("/login");
  }

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

      <CerrarSesion />
    </main>
  );
}