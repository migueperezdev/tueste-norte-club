import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../src/db/d1";
import { clientes } from "../../../../src/db/schema";
import { getSession } from "../../../../src/lib/session";

function errorJson(error: string, status: number) {
  return Response.json({ error }, { status });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sesion = await getSession();
    if (!sesion) {
      return errorJson("Debes iniciar sesión.", 401);
    }

    const origen = request.headers.get("Origin");
    const urlConfigurada = URL.parse(process.env.BETTER_AUTH_URL ?? "");
    if (
      !origen ||
      !urlConfigurada ||
      (urlConfigurada.protocol !== "http:" && urlConfigurada.protocol !== "https:") ||
      origen !== urlConfigurada.origin
    ) {
      return errorJson("Origen no autorizado.", 403);
    }

    const { id: parametro } = await params;
    const id = Number(parametro);
    if (/[^0-9]/.test(parametro) || !Number.isSafeInteger(id) || id <= 0) {
      return errorJson("Identificador de suscripción inválido.", 400);
    }

    const cuerpo: unknown = await request.json().catch(() => null);
    if (
      typeof cuerpo !== "object" ||
      cuerpo === null ||
      Array.isArray(cuerpo) ||
      !("accion" in cuerpo) ||
      (cuerpo.accion !== "pausar" && cuerpo.accion !== "reanudar")
    ) {
      return errorJson('Envía un objeto JSON con la acción "pausar" o "reanudar".', 400);
    }

    const [origenEstado, destino] =
      cuerpo.accion === "pausar" ? (["activa", "pausada"] as const) : (["pausada", "activa"] as const);
    const fichaPropia = and(eq(clientes.id, id), eq(clientes.userId, sesion.user.id));
    const db = getDb();
    const [guardada] = await db
      .update(clientes)
      .set({ estado: destino })
      .where(and(fichaPropia, eq(clientes.estado, origenEstado)))
      .returning({ id: clientes.id, estado: clientes.estado });

    if (guardada) {
      return Response.json(guardada);
    }

    const ficha = await db.select({ id: clientes.id }).from(clientes).where(fichaPropia).get();
    if (!ficha) {
      return errorJson("Suscripción no encontrada.", 404);
    }

    return errorJson("La acción no es compatible con el estado de la suscripción.", 409);
  } catch {
    return errorJson("No se pudo actualizar la suscripción.", 500);
  }
}
