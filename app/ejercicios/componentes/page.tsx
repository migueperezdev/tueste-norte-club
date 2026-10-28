import EtiquetaTueste from "@/components/EtiquetaTueste";
import BotonFavorito from "./BotonFavorito";

export default function PaginaComponentes() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 bg-stone-50 p-6 text-stone-900">
      <h1 className="text-2xl font-bold">
        Ejercicio 1: componentes React
      </h1>

      <p>Un mismo componente con tres niveles de tueste.</p>

      <div className="flex flex-wrap gap-3">
        <EtiquetaTueste nivel="claro" />
        <EtiquetaTueste nivel="medio" />
        <EtiquetaTueste nivel="oscuro" />
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">
          Botón de favoritos
        </h2>

        <BotonFavorito favoritoInicial={false} />
      </div>
    </section>
  );
}