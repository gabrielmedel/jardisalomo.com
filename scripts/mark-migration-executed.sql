-- SQL para marcar manualmente la migración inicial como ejecutada
-- Útil cuando ya tienes la base de datos creada con push:true en desarrollo

-- 1. Verificar si la tabla de migraciones existe
SELECT * FROM payload_migrations;

-- 2. Insertar la migración como ejecutada (cambia el nombre si es diferente)
INSERT INTO payload_migrations (name, batch)
VALUES ('20260203_021428_initial', 1);

-- 3. Verificar que se insertó correctamente
SELECT * FROM payload_migrations ORDER BY created_at DESC;
