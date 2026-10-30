import SelectorBolsas from "@/components/SelectorBolsas";
import { socio, suscripcion } from "@/data/socio";

export default function PaginaInicio() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 rounded-2xl bg-stone-50 p-6 text-stone-900 sm:p-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-800">
          Club Tueste Norte
        </p>

        <h1 className="text-3xl font-bold sm:text-4xl">
          Hola, {socio.nombre}
        </h1>

        <p className="text-stone-600">
          Socio {socio.numero}. Bienvenido a tu espacio de café.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-5 rounded-xl border border-stone-200 bg-white p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">
              Tu plan {suscripcion.plan}
            </h2>

            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
              Suscripción activa
            </span>
          </div>

          <SelectorBolsas
            bolsasIniciales={suscripcion.bolsas}
            gramosPorBolsa={suscripcion.gramosPorBolsa}
            precioPorBolsa={suscripcion.precioPorBolsa}
          />
        </section>

        <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-xl font-bold">
            Tu próximo envío
          </h2>

          <p className="text-2xl font-bold text-amber-900">
            {suscripcion.proximoEnvio}
          </p>

          <p className="leading-relaxed text-stone-600">
            Una nueva selección de cafés de especialidad
            para descubrir en casa.
          </p>

          <p className="text-sm text-stone-600">
            Cada bolsa contiene {suscripcion.gramosPorBolsa} g de café.
          </p>
        </section>
      </div>

      <p className="text-sm text-stone-600">
        Estás viendo una demostración con datos ficticios.
      </p>
    </main>
  );
}