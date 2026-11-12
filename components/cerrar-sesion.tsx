"use client";

import { useState } from "react";
import { authClient } from "../src/lib/auth-client";

export function CerrarSesion() {
  const [cerrando, setCerrando] = useState(false);
  const [error, setError] = useState("");

  async function cerrarSesion() {
    setError("");
    setCerrando(true);

    try {
      const { error: errorSalida } = await authClient.signOut();

      if (errorSalida) {
        setError("No se pudo cerrar la sesión. Inténtalo de nuevo.");
        return;
      }

      window.location.replace("/login");
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCerrando(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        className="rounded-md border px-4 py-2 disabled:opacity-60"
        type="button"
        onClick={cerrarSesion}
        disabled={cerrando}
      >
        {cerrando ? "Cerrando sesión…" : "Cerrar sesión"}
      </button>

      {error && <p className="mt-2" role="alert">{error}</p>}
    </div>
  );
}