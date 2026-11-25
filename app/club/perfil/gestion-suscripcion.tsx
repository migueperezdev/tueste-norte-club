"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

export function GestionSuscripcion({
  id,
  accion,
}: {
  id: number;
  accion: "pausar" | "reanudar";
}) {
  const router = useRouter();
  const peticionEnCurso = useRef(false);
  const [enviando, setEnviando] = useState(false);
  const [actualizando, iniciarActualizacion] = useTransition();
  const [error, setError] = useState("");
  const etiqueta = accion === "pausar" ? "Pausar suscripción" : "Reanudar suscripción";
  const estadoEsperado = accion === "pausar" ? "pausada" : "activa";

  async function gestionar() {
    if (peticionEnCurso.current || actualizando) return;
    if (!window.confirm(`¿Quieres ${accion} tu suscripción?`)) return;

    peticionEnCurso.current = true;
    setEnviando(true);
    setError("");

    try {
      const respuesta = await fetch(`/api/suscripciones/${id}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion }),
      });
      const datos: unknown = await respuesta.json().catch(() => null);

      if (
        !respuesta.ok &&
        datos &&
        typeof datos === "object" &&
        "error" in datos &&
        typeof datos.error === "string" &&
        datos.error.trim()
      ) {
        setError(datos.error);
        return;
      }

      if (
        respuesta.status !== 200 ||
        !datos ||
        typeof datos !== "object" ||
        !("id" in datos) ||
        datos.id !== id ||
        !("estado" in datos) ||
        datos.estado !== estadoEsperado
      ) {
        setError("No se pudo confirmar el cambio. Recarga el perfil antes de volver a intentarlo.");
        return;
      }

      iniciarActualizacion(() => router.refresh());
    } catch {
      setError("No se pudo conectar con el servidor. Recarga el perfil antes de volver a intentarlo.");
    } finally {
      peticionEnCurso.current = false;
      setEnviando(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={enviando || actualizando}
        onClick={gestionar}
        className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {etiqueta}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
