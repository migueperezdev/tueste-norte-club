import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../src/db";
import { clientes } from "../../../src/db/schema";
import { getSession } from "../../../src/lib/session";

export async function GET() {
  const sesion = await getSession();
  const headers = { "Cache-Control": "private, no-store" };

  if (!sesion) {
    return NextResponse.json(
      { error: "Debes iniciar sesión." },
      { status: 401, headers },
    );
  }

  const fichasDelUsuario = db
    .select({ id: clientes.id })
    .from(clientes)
    .where(eq(clientes.userId, sesion.user.id));

  const listaPedidos = await db.query.pedidos.findMany({
    where: (tabla) => inArray(tabla.clienteId, fichasDelUsuario),
    with: {
      cliente: {
        columns: {
          id: true,
          nombre: true,
        },
      },
    },
    orderBy: (tabla, { asc, desc }) => [
      desc(tabla.mes),
      asc(tabla.id),
    ],
  });

  return NextResponse.json(listaPedidos, { headers });
}