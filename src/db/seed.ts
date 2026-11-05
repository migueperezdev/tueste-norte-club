import { and, eq } from "drizzle-orm";
import { db, sqlite } from "./index";
import { clientes, pedidos, planes } from "./schema";

const ejemplos = [
  {
    plan: {
      nombre: "Descubrimiento",
      precioMensual: 19,
      gramosMes: 500,
    },
    cliente: {
      nombre: "Álex",
      email: "alex@example.com",
    },
    pedidos: [
      {
        cafe: "Colombia Huila",
        mes: "2026-10",
        estado: "entregado",
      },
      {
        cafe: "Guatemala Antigua",
        mes: "2026-11",
        estado: "pendiente",
      },
    ],
  },
  {
    plan: {
      nombre: "Cafetero",
      precioMensual: 35,
      gramosMes: 1000,
    },
    cliente: {
      nombre: "Ana",
      email: "ana@example.com",
    },
    pedidos: [
      {
        cafe: "Etiopía Sidamo",
        mes: "2026-10",
        estado: "enviado",
      },
      {
        cafe: "Brasil Cerrado",
        mes: "2026-11",
        estado: "tostando",
      },
    ],
  },
] as const;

try {
  db.transaction((tx) => {
    for (const ejemplo of ejemplos) {
      tx.insert(planes)
        .values(ejemplo.plan)
        .onConflictDoNothing({ target: planes.nombre })
        .run();

      const plan = tx
        .select()
        .from(planes)
        .where(eq(planes.nombre, ejemplo.plan.nombre))
        .get();

      if (!plan) {
        throw new Error("No se ha podido recuperar el plan del seed.");
      }

      tx.insert(clientes)
        .values({
          ...ejemplo.cliente,
          planId: plan.id,
        })
        .onConflictDoNothing({ target: clientes.email })
        .run();

      const cliente = tx
        .select()
        .from(clientes)
        .where(eq(clientes.email, ejemplo.cliente.email))
        .get();

      if (!cliente) {
        throw new Error("No se ha podido recuperar el cliente del seed.");
      }

      for (const pedido of ejemplo.pedidos) {
        const existente = tx
          .select({ id: pedidos.id })
          .from(pedidos)
          .where(
            and(
              eq(pedidos.clienteId, cliente.id),
              eq(pedidos.mes, pedido.mes),
              eq(pedidos.cafe, pedido.cafe),
            ),
          )
          .get();

        if (!existente) {
          tx.insert(pedidos)
            .values({
              ...pedido,
              clienteId: cliente.id,
            })
            .run();
        }
      }
    }
  });

  console.log("Seed completado.");
  console.log("Planes:", db.select().from(planes).all().length);
  console.log("Clientes:", db.select().from(clientes).all().length);
  console.log("Pedidos:", db.select().from(pedidos).all().length);
} finally {
  sqlite.close();
}