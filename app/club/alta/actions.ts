"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "../../../src/db";
import { clientes, planes } from "../../../src/db/schema";

export type EstadoAlta = {
  mensaje: string;
  correcto: boolean;
};

export async function registrarCliente(
  _estadoAnterior: EstadoAlta,
  formData: FormData,
): Promise<EstadoAlta> {
  const nombreRecibido = formData.get("nombre");
  const emailRecibido = formData.get("email");
  const planRecibido = formData.get("planId");

  if (
    typeof nombreRecibido !== "string" ||
    typeof emailRecibido !== "string" ||
    typeof planRecibido !== "string"
  ) {
    return {
      mensaje: "Completa el nombre, el email y el plan.",
      correcto: false,
    };
  }

  const nombre = nombreRecibido.trim();
  const email = emailRecibido.trim().toLowerCase();
  const planId = Number(planRecibido);

  if (!nombre || !email) {
    return {
      mensaje: "Escribe tu nombre y tu email.",
      correcto: false,
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      mensaje: "Escribe un email válido.",
      correcto: false,
    };
  }

  if (!Number.isSafeInteger(planId) || planId < 1) {
    return {
      mensaje: "Selecciona un plan válido.",
      correcto: false,
    };
  }

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

    const cliente = db
      .insert(clientes)
      .values({ nombre, email, planId })
      .onConflictDoNothing({ target: clientes.email })
      .returning({ id: clientes.id })
      .get();

    if (!cliente) {
      return {
        mensaje: "Este email ya está registrado en el club.",
        correcto: false,
      };
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
    mensaje: "¡Tu suscripción ha quedado registrada!",
    correcto: true,
  };
}