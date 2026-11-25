CREATE TRIGGER "pedidos_rechaza_suscripcion_pausada"
BEFORE INSERT ON "pedidos"
FOR EACH ROW
WHEN EXISTS (
  SELECT 1
  FROM "clientes"
  WHERE "id" = NEW."cliente_id" AND "estado" = 'pausada'
)
BEGIN
  SELECT RAISE(ABORT, 'suscripcion_pausada');
END;
