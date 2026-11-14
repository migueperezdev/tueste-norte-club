"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "../../../src/db";
import { clientes, planes } from "../../../src/db/schema";
import { getSession } from "../../../src/lib/session";

export type EstadoAlta = {
  mensaje: string;
  correcto: boolean;
};

export async function registrarCliente(
  _estadoAnterior: EstadoAlta,
  formData: FormData,
): Promise<EstadoAlta> {
  const sesion = await getSession();

  if (!sesion) {
    return {
      mensaje: "Debes iniciar sesión para apuntarte al club.",
      correcto: false,
    };
  }

  const planRecibido = formData.get("planId");
  const planId = typeof planRecibido === "string" ? Number(planRecibido) : NaN;

  if (!Number.isSafeInteger(planId) || planId < 1) {
    return {
      mensaje: "Selecciona un plan válido.",
      correcto: false,
    };
  }

  const { id: userId, name: nombre, email } = sesion.user;

  try {
    const plan = db
      .select({ id: planes.id })
      .from(planes)
      .where(eq(planes.id, planId))
      .get();

    if (!plan) {
      return {
        mensaje: "El plan seleccionado ya no está disponible.",
        correcto: false,
      };
    }

    const clienteCreado = db
      .insert(clientes)
      .values({ userId, nombre, email: email.trim().toLowerCase(), planId })
      .onConflictDoNothing()
      .returning({ id: clientes.id })
      .get();

    if (!clienteCreado) {
      const clienteExistente = db
        .select({ id: clientes.id })
        .from(clientes)
        .where(eq(clientes.userId, userId))
        .get();

      if (!clienteExistente) {
        return {
          mensaje: "Ese correo ya está asociado a una ficha del club.",
          correcto: false,
        };
      }
    }
  } catch (error) {
    console.error("Error al registrar el cliente:", error);

    return {
      mensaje: "No se ha podido guardar el alta. Inténtalo de nuevo.",
      correcto: false,
    };
  }

  revalidatePath("/club/alta");

  return {
    mensaje: "Tu suscripción está registrada.",
    correcto: true,
  };
}