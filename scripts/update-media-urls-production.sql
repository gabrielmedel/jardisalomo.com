-- Script SQL para actualizar URLs de media a MinIO
-- Ejecutar DESPUÉS de importar la base de datos en producción

-- 1. Verificar URLs actuales
SELECT id, url, filename FROM media LIMIT 5;

-- 2. Actualizar URL principal de media
UPDATE media
SET url = REPLACE(url, '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/')
WHERE url LIKE '/media/%';

-- 3. Actualizar URLs de tamaños de imagen generados
UPDATE media
SET 
  "sizes_thumbnail_url" = REPLACE("sizes_thumbnail_url", '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/'),
  "sizes_small_url" = REPLACE("sizes_small_url", '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/'),
  "sizes_medium_url" = REPLACE("sizes_medium_url", '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/'),
  "sizes_large_url" = REPLACE("sizes_large_url", '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/'),
  "sizes_xlarge_url" = REPLACE("sizes_xlarge_url", '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/'),
  "sizes_og_url" = REPLACE("sizes_og_url", '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/'),
  "sizes_square_url" = REPLACE("sizes_square_url", '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/')
WHERE url LIKE 'https://minio-api.coolify.eljardisalomo.com%';

-- 4. Verificar cambios
SELECT id, url, filename FROM media LIMIT 10;

-- 5. Contar URLs actualizadas
SELECT COUNT(*) as total_media FROM media WHERE url LIKE 'https://minio-api.coolify.eljardisalomo.com%';
