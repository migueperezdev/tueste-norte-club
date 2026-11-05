"use client";

import { useActionState } from "react";
import type { planes } from "../../../src/db/schema";
import { registrarCliente } from "./actions";
import type { EstadoAlta } from "./actions";

type Plan = typeof planes.$inferSelect;

type Props = {
  planes: Plan[];
};

const estadoInicial: EstadoAlta = {
  mensaje: "",
  correcto: false,
};

export default function FormularioAlta({ planes }: Props) {
  const [estado, accion, pendiente] = useActionState(
    registrarCliente,
    estadoInicial,
  );

  return (
    <form action={accion} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="alta-nombre" className="block font-medium">
          Nombre
        </label>

        <input
          id="alta-nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          required
          className="w-full rounded border border-stone-400 bg-white px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="alta-email" className="block font-medium">
          Email
        </label>

        <input
          id="alta-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded border border-stone-400 bg-white px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="alta-plan" className="block font-medium">
          Plan de suscripción
        </label>

        <select
          id="alta-plan"
          name="planId"
          defaultValue=""
          required
          className="w-full rounded border border-stone-400 bg-white px-3 py-2"
        >
          <option value="" disabled>
            Selecciona un plan
          </option>

          {planes.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.nombre} · {plan.gramosMes} g/mes ·{" "}
              {plan.precioMensual.toLocaleString("es-ES", {
                style: "currency",
                currency: "EUR",
              })}
              /mes
            </option>
          ))}
        </select>
      </div>

      <p
        aria-live="polite"
        className={estado.correcto ? "text-green-800" : "text-red-700"}
      >
        {estado.mensaje}
      </p>

      <button
        type="submit"
        disabled={pendiente}
        className="rounded bg-amber-900 px-5 py-3 text-white disabled:opacity-60"
      >
        {pendiente ? "Enviando…" : "Apuntarme al club"}
      </button>
    </form>
  );
}