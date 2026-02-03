# Instrucciones de Importación de Base de Datos a Producción

## ✅ Estado Actual

- **Backup creado**: `backup-production-20260203-032236.sql` (1.4 MB)
- **Media subida a MinIO**: 99 archivos (38.32 MiB) ✅
- **Bucket configurado**: `jardisalomo` con acceso público de lectura ✅

---

## 📋 Pasos para Importar la Base de Datos

### Opción 1: Desde tu Máquina Local (via SSH tunnel)

Si la base de datos no es accesible públicamente, necesitas crear un túnel SSH:

```bash
# 1. Crear túnel SSH (en una terminal separada)
ssh root@188.245.184.148 -L 5433:localhost:5432

# 2. En otra terminal, importar el backup
PGPASSWORD=6Wl8352oY71pW4u1CO11TIhLb22tsJYoDjFehTDXNiJ77b9eD8JgLDa41QGnnQB9 \
  psql -h localhost -p 5433 -U postgres -d postgres \
  -f backup-production-20260203-032236.sql
```

### Opción 2: Desde el Servidor de Coolify (Recomendado)

```bash
# 1. Conectar al servidor via SSH
ssh root@188.245.184.148

# 2. Subir el archivo (desde tu máquina local, en otra terminal)
scp backup-production-20260203-032236.sql root@188.245.184.148:/tmp/

# 3. De vuelta en el servidor, importar
PGPASSWORD=6Wl8352oY71pW4u1CO11TIhLb22tsJYoDjFehTDXNiJ77b9eD8JgLDa41QGnnQB9 \
  psql -h localhost -U postgres -d postgres \
  -f /tmp/backup-production-20260203-032236.sql

# 4. Limpiar
rm /tmp/backup-production-20260203-032236.sql
```

### Opción 3: Via Docker (si PostgreSQL está en contenedor)

```bash
# 1. SSH al servidor
ssh root@188.245.184.148

# 2. Subir archivo
scp backup-production-20260203-032236.sql root@188.245.184.148:/tmp/

# 3. Copiar al contenedor de PostgreSQL
docker cp /tmp/backup-production-20260203-032236.sql <postgres-container-id>:/tmp/

# 4. Ejecutar dentro del contenedor
docker exec -i <postgres-container-id> psql -U postgres -d postgres \
  -f /tmp/backup-production-20260203-032236.sql

# 5. Limpiar
rm /tmp/backup-production-20260203-032236.sql
```

---

## 🔄 Actualizar URLs de Media a MinIO

Después de importar la base de datos, ejecuta el script SQL para actualizar las URLs:

```bash
# Conectar a la base de datos
PGPASSWORD=6Wl8352oY71pW4u1CO11TIhLb22tsJYoDjFehTDXNiJ77b9eD8JgLDa41QGnnQB9 \
  psql -h localhost -U postgres -d postgres

# O si es via SSH tunnel
PGPASSWORD=6Wl8352oY71pW4u1CO11TIhLb22tsJYoDjFehTDXNiJ77b9eD8JgLDa41QGnnQB9 \
  psql -h localhost -p 5433 -U postgres -d postgres
```

Luego ejecuta las queries del archivo `scripts/update-media-urls-production.sql`:

```sql
-- Actualizar URL principal
UPDATE media
SET url = REPLACE(url, '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/')
WHERE url LIKE '/media/%';

-- Actualizar URLs de tamaños
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

-- Verificar
SELECT id, url, filename FROM media LIMIT 10;
```

---

## ✅ Verificación

### 1. Verificar que la DB se importó correctamente

```bash
PGPASSWORD=6Wl8352oY71pW4u1CO11TIhLb22tsJYoDjFehTDXNiJ77b9eD8JgLDa41QGnnQB9 \
  psql -h localhost -U postgres -d postgres -c "SELECT COUNT(*) FROM users;"
```

Debería devolver el número de usuarios que tienes.

### 2. Verificar migración está registrada

```bash
PGPASSWORD=6Wl8352oY71pW4u1CO11TIhLb22tsJYoDjFehTDXNiJ77b9eD8JgLDa41QGnnQB9 \
  psql -h localhost -U postgres -d postgres -c "SELECT * FROM payload_migrations;"
```

Debería mostrar:
```
 id |           name              | batch | updated_at | created_at
----+-----------------------------+-------+------------+------------
  1 | 20260203_021428_initial     |     1 | ...        | ...
```

### 3. Verificar media en MinIO

```bash
curl -I https://minio-api.coolify.eljardisalomo.com/jardisalomo/logo.png
```

Debería devolver `200 OK` si el archivo existe y es accesible públicamente.

---

## 🚨 Troubleshooting

### Error: "password authentication failed"

Verifica que la contraseña sea correcta:
```bash
PGPASSWORD=6Wl8352oY71pW4u1CO11TIhLb22tsJYoDjFehTDXNiJ77b9eD8JgLDa41QGnnQB9
```

### Error: "Connection refused" o "timeout"

La base de datos no es accesible externamente. Usa SSH tunnel (Opción 1) o ejecuta desde el servidor (Opción 2).

### Error: "relation already exists"

Normal si la base de datos ya tiene tablas. El script tiene `DROP` statements que limpiarán todo antes de crear.

Si quieres evitar perder datos existentes:
```bash
# Hacer backup de producción primero
PGPASSWORD=6Wl8352oY71pW4u1CO11TIhLb22tsJYoDjFehTDXNiJ77b9eD8JgLDa41QGnnQB9 \
  pg_dump -h localhost -U postgres -d postgres > backup-prod-before-import.sql
```

---

## 📊 Archivos Creados

- ✅ `backup-production-20260203-032236.sql` - Backup completo de la DB local
- ✅ `scripts/update-media-urls-production.sql` - Script para actualizar URLs
- ✅ Media subida a MinIO (38.32 MiB en 99 archivos)

---

## 🔗 Credenciales y URLs

### Base de Datos Producción
```
Host: 188.245.184.148 (o localhost desde el servidor)
Port: 5432
User: postgres
Password: 6Wl8352oY71pW4u1CO11TIhLb22tsJYoDjFehTDXNiJ77b9eD8JgLDa41QGnnQB9
Database: postgres
```

### MinIO Producción
```
API URL: https://minio-api.coolify.eljardisalomo.com
Bucket: jardisalomo
Admin User: 4uWg20mUFBd9oux4
Admin Password: 9n9DQQf4Tabpa9VC7iprLozmvdRIX5uZ
```

**Acceso público configurado**: ✅
Los archivos son accesibles en:
```
https://minio-api.coolify.eljardisalomo.com/jardisalomo/<filename>
```

---

## ⏭️ Próximos Pasos

Después de importar la DB y actualizar las URLs:

1. Configurar variables de entorno en Coolify (ver `docs/COOLIFY-CONFIG.md`)
2. Desplegar la aplicación
3. Verificar que las imágenes cargan correctamente
4. Test completo de funcionalidad

---

✨ ¡Listo para desplegar!
