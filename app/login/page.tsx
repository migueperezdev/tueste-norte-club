"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "../../src/lib/auth-client";

const estiloCampo = "rounded-md border px-3 py-2";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const datos = new FormData(event.currentTarget);

    setError("");
    setEnviando(true);

    try {
      const { error: errorLogin } = await authClient.signIn.email({
        email: String(datos.get("email") ?? "").trim(),
        password: String(datos.get("password") ?? ""),
      });

      if (errorLogin) {
        setError(errorLogin.message || "No se pudo iniciar sesión.");
        return;
      }

      window.location.replace("/club/perfil");
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-2xl font-semibold">Entrar al club</h1>

      <form className="mt-6 grid gap-4" method="post" onSubmit={entrar}>
        <label className="grid gap-1">
          Correo electrónico
          <input
            className={estiloCampo}
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>

        <label className="grid gap-1">
          Contraseña
          <input
            className={estiloCampo}
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>

        <button
          className="rounded-md bg-amber-900 px-4 py-2 text-white disabled:opacity-60"
          type="submit"
          disabled={enviando}
        >
          {enviando ? "Entrando…" : "Entrar"}
        </button>

        {error && <p role="alert">{error}</p>}
      </form>

      <Link className="mt-4 inline-block underline" href="/registro">
        Crear una cuenta
      </Link>
    </main>
  );
}