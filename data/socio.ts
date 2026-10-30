export type Socio = {
  nombre: string;
  numero: string;
};

export type Suscripcion = {
  plan: string;
  bolsas: number;
  gramosPorBolsa: number;
  precioPorBolsa: number;
  proximoEnvio: string;
};

export const socio: Socio = {
  nombre: "Álex",
  numero: "TN-024",
};

export const suscripcion: Suscripcion = {
  plan: "Descubrimiento",
  bolsas: 2,
  gramosPorBolsa: 250,
  precioPorBolsa: 9.5,
  proximoEnvio: "5 de noviembre de 2026",
};