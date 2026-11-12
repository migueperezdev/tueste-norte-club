"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "../../src/lib/auth-client";

const estiloCampo = "rounded-md border px-3 py-2";

export default function RegistroPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [cuentaCreada, setCuentaCreada] = useState(false);

  async function registrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const datos = new FormData(event.currentTarget);
    const nombre = String(datos.get("nombre") ?? "").trim();

    if (!nombre) {
      setError("Escribe tu nombre.");
      return;
    }

    setError("");
    setEnviando(true);

    try {
      const { error: errorRegistro } = await authClient.signUp.email({
        name: nombre,
        email: String(datos.get("email") ?? "").trim(),
        password: String(datos.get("password") ?? ""),
      });

      if (errorRegistro) {
        setError(errorRegistro.message || "No se pudo crear la cuenta.");
        return;
      }

      setCuentaCreada(true);
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-2xl font-semibold">Crea tu cuenta del club</h1>

      {cuentaCreada ? (
        <p className="mt-4" role="status">
          Cuenta creada. Ya has iniciado sesión.
        </p>
      ) : (
        <form className="mt-6 grid gap-4" method="post" onSubmit={registrar}>
          <label className="grid gap-1">
            Nombre
            <input className={estiloCampo} name="nombre" autoComplete="name" required />
          </label>

          <label className="grid gap-1">
            Correo electrónico
            <input className={estiloCampo} name="email" type="email" autoComplete="email" required />
          </label>

          <label className="grid gap-1">
            Contraseña
            <input
              className={estiloCampo}
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
            />
          </label>

          <button
            className="rounded-md bg-amber-900 px-4 py-2 text-white disabled:opacity-60"
            type="submit"
            disabled={enviando}
          >
            {enviando ? "Creando cuenta…" : "Registrarme"}
          </button>

          {error && <p role="alert">{error}</p>}
        </form>
      )}
    </main>
  );
}