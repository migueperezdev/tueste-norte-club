export type Metodo = {
  slug: string;
  nombre: string;
  descripcion: string;
};

export const metodos: Metodo[] = [
  {
    slug: "v60",
    nombre: "V60",
    descripcion: "Método de filtrado manual con filtro de papel.",
  },
  {
    slug: "prensa-francesa",
    nombre: "Prensa francesa",
    descripcion: "Método de inmersión que utiliza una jarra con émbolo.",
  },
  {
    slug: "espresso",
    nombre: "Espresso",
    descripcion: "Preparación de café concentrado mediante agua a presión.",
  },
  {
    slug: "aeropress",
    nombre: "AeroPress",
    descripcion: "Preparación que combina inmersión y presión manual.",
  },
];