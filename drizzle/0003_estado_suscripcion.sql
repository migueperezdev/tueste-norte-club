ALTER TABLE "clientes"
ADD COLUMN "estado" text NOT NULL DEFAULT 'activa'
CONSTRAINT "clientes_estado_valido"
CHECK ("estado" IN ('activa', 'pausada', 'cancelada'));
