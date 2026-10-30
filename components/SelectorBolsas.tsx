"use client";

import { useState } from "react";

type SelectorBolsasProps = {
  bolsasIniciales: number;
  gramosPorBolsa: number;
  precioPorBolsa: number;
};

const opcionesBolsas = [1, 2, 3, 4];

export default function SelectorBolsas({
  bolsasIniciales,
  gramosPorBolsa,
  precioPorBolsa,
}: SelectorBolsasProps) {
  const [bolsas, setBolsas] = useState(bolsasIniciales);

  const precioMensual = bolsas * precioPorBolsa;

  const precioFormateado = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(precioMensual);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="bolsas-plan"
          className="block font-medium"
        >
          Bolsas al mes
        </label>

        <select
          id="bolsas-plan"
          value={bolsas}
          onChange={(evento) =>
            setBolsas(Number(evento.currentTarget.value))
          }
          className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-stone-900"
        >
          {opcionesBolsas.map((cantidad) => (
            <option key={cantidad} value={cantidad}>
              {cantidad} {cantidad === 1 ? "bolsa" : "bolsas"}
            </option>
          ))}
        </select>
      </div>

      <div aria-live="polite" className="space-y-1">
        <p className="text-sm text-stone-600">
          {bolsas} {bolsas === 1 ? "bolsa" : "bolsas"} de{" "}
          {gramosPorBolsa} g al mes.
        </p>

        <p className="text-3xl font-bold text-amber-900">
          {precioFormateado}
          <span className="text-base font-normal text-stone-600">
            {" "}/ mes
          </span>
        </p>
      </div>

      <p className="text-sm text-stone-600">
        Simulación: la selección se reinicia al recargar la página.
      </p>
    </div>
  );
}