import { NextResponse } from "next/server";
import { db } from "../../../src/db";

export async function GET() {
  const listaPedidos = await db.query.pedidos.findMany({
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

  return NextResponse.json(listaPedidos);
}