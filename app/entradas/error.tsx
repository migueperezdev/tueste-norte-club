"use client";

type ErrorEntradasProps = {
  error: unknown;
  retry: () => void;
};

export default function ErrorEntradas({
  retry,
}: ErrorEntradasProps) {
  return (
    <main className="mx-auto max-w-3xl space-y-6 bg-stone-50 p-6 text-stone-900">
      <h1 className="text-2xl font-bold">
        No hemos podido cargar las entradas
      </h1>

      <p>Vuelve a intentarlo dentro de unos instantes.</p>

      <button
        type="button"
        onClick={() => retry()}
        className="min-h-11 rounded-lg bg-amber-800 px-4 py-2 font-semibold text-white hover:bg-amber-900"
      >
        Reintentar
      </button>
    </main>
  );
}