export type Cafe = {
  slug: string;
  nombre: string;
  origen: string;
  tueste: "claro" | "medio" | "oscuro";
  notasCata: string[];
  proceso: string;
  descripcion: string;
};

export const cafes: Cafe[] = [
  {
    slug: "colombia-huila",
    nombre: "Colombia Huila",
    origen: "Huila, Colombia",
    tueste: "medio",
    notasCata: ["Caramelo", "Chocolate", "Naranja"],
    proceso: "Lavado",
    descripcion:
      "Un café equilibrado, con dulzor de caramelo y un final suave. Una propuesta para acompañar las mañanas del club.",
  },
  {
    slug: "etiopia-sidamo",
    nombre: "Etiopía Sidamo",
    origen: "Sidamo, Etiopía",
    tueste: "claro",
    notasCata: ["Flores", "Limón", "Miel"],
    proceso: "Lavado",
    descripcion:
      "Una propuesta aromática y delicada, con notas florales y un toque cítrico. Ideal para descubrir nuevos matices en cada taza.",
  },
  {
    slug: "brasil-cerrado",
    nombre: "Brasil Cerrado",
    origen: "Cerrado, Brasil",
    tueste: "oscuro",
    notasCata: ["Chocolate", "Avellana", "Panela"],
    proceso: "Natural",
    descripcion:
      "Un café de cuerpo intenso y perfil dulce, con notas de chocolate y frutos secos. Una selección para quienes disfrutan de sabores más profundos.",
  },
];