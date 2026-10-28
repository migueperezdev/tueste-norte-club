type EtiquetaTuesteProps = {
  nivel: "claro" | "medio" | "oscuro";
};

const estilos = {
  claro: "bg-amber-100 text-amber-950",
  medio: "bg-amber-700 text-white",
  oscuro: "bg-stone-900 text-white",
};

export default function EtiquetaTueste({
  nivel,
}: EtiquetaTuesteProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${estilos[nivel]}`}
    >
      Tueste {nivel}
    </span>
  );
}