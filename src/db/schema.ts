import { relations, sql } from "drizzle-orm";
import { check, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export const planes = sqliteTable("planes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  precioMensual: real("precio_mensual").notNull(),
  gramosMes: integer("gramos_mes").notNull(),
});

export const clientes = sqliteTable("clientes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  email: text("email").notNull().unique(),
  userId: text("user_id").unique().references(() => user.id),
  planId: integer("plan_id").notNull().references(() => planes.id),
  fechaAlta: integer("fecha_alta", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const pedidos = sqliteTable(
  "pedidos",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    clienteId: integer("cliente_id").notNull().references(() => clientes.id),
    cafe: text("cafe").notNull(),
    mes: text("mes").notNull(),
    estado: text("estado", {
      enum: ["pendiente", "tostando", "enviado", "entregado"],
    }).notNull().default("pendiente"),
  },
  (tabla) => [
    check(
      "pedidos_estado_valido",
      sql`${tabla.estado} IN ('pendiente', 'tostando', 'enviado', 'entregado')`,
    ),
  ],
);

export const planesRelations = relations(planes, ({ many }) => ({
  clientes: many(clientes),
}));

export const clientesRelations = relations(clientes, ({ one, many }) => ({
  plan: one(planes, {
    fields: [clientes.planId],
    references: [planes.id],
  }),
  pedidos: many(pedidos),
}));

export const pedidosRelations = relations(pedidos, ({ one }) => ({
  cliente: one(clientes, {
    fields: [pedidos.clienteId],
    references: [clientes.id],
  }),
}));

export * from "./auth-schema";