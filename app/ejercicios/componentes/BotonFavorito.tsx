"use client";

import { useState } from "react";

type BotonFavoritoProps = {
  favoritoInicial: boolean;
};

export default function BotonFavorito({
  favoritoInicial,
}: BotonFavoritoProps) {
  const [favorito, setFavorito] = useState(favoritoInicial);

  return (
    <button
      type="button"
      aria-pressed={favorito}
      onClick={() => setFavorito(!favorito)}
      className="min-h-11 rounded-lg border border-stone-300 bg-white px-4 py-2 font-medium text-stone-900 hover:bg-amber-50"
    >
      {favorito ? "★ En favoritos" : "☆ Añadir a favoritos"}
    </button>
  );
}