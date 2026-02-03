# Checklist: Antes del Primer Despliegue

Esta guía te proporciona un checklist paso a paso de todas las acciones manuales necesarias para preparar y desplegar Payload CMS en producción con Coolify.

---

## 📝 Resumen de Fases

1. **Fase 1 - Local**: Preparar migraciones y exportar datos
2. **Fase 2 - Coolify**: Configurar servicios (PostgreSQL, MinIO, App)
3. **Fase 3 - Migración de Datos**: Importar DB y media
4. **Fase 4 - Verificación**: Tests y validación

---

## ✅ Fase 1: Preparación Local (Antes de Desplegar)

### 1.1 Crear Migración Inicial de Payload

```bash
# En el directorio del proyecto
pnpm migrate:create initial

# Esto creará un archivo en src/migrations/YYYYMMDDHHMMSS_initial.ts
# Verifica que se haya creado correctamente
ls src/migrations/
```

**¿Qué hace esto?**
- Genera un archivo de migración con el estado actual de tu esquema de base de datos
- Este archivo se usará en producción para crear las tablas necesarias

### 1.2 Commit de Archivos de Migración

```bash
# Añadir archivos de migración al repo
git add src/migrations/

# Commit
git commit -m "Add initial database migration for production"

# Push al repositorio
git push origin main
```

### 1.3 Exportar Base de Datos Local

```bash
# Exportar la base de datos actual (con todos los datos)
pg_dump -h localhost -U postgres -d payloadcms-jardisalomo -F c -f backup-local.dump

# Verificar que se creó el archivo
ls -lh backup-local.dump
```

**Placeholders a reemplazar:**
- `-d payloadcms-jardisalomo`: Nombre de tu base de datos local
- `-U postgres`: Tu usuario de PostgreSQL local
- `-h localhost`: Host (puede ser diferente)

**Nota**: Si tu base de datos local requiere contraseña, te la pedirá o puedes usar `PGPASSWORD`:
```bash
PGPASSWORD=tupassword pg_dump -h localhost -U postgres -d payloadcms-jardisalomo -F c -f backup-local.dump
```

### 1.4 Instalar MinIO Client (mc)

#### macOS
```bash
brew install minio/stable/mc
```

#### Linux
```bash
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/
```

#### Windows
```powershell
choco install minio-client
```

#### Verificar Instalación
```bash
mc --version
```

---

## ✅ Fase 2: Configuración en Coolify

### 2.1 Desplegar PostgreSQL

1. En Coolify: **Resources** > **+ Add New** > **Database** > **PostgreSQL**
2. Configuración:
   - **Name**: `payloadcms-postgres`
   - **Database Name**: `{{DB_NAME}}` (ej: `jardisalomo`)
   - **Username**: `{{DB_USER}}` (ej: `payload`)
   - **Password**: Generar contraseña segura
3. Click **Deploy**
4. **Guardar la `DATABASE_URL`** que te proporciona Coolify

### 2.2 Desplegar MinIO

Sigue la guía completa en [`docs/MINIO-SETUP.md`](./MINIO-SETUP.md):

1. Crear servicio Docker Compose en Coolify con MinIO
2. Configurar dominios:
   - API (puerto 9000): `minio.tudominio.com`
   - Console (puerto 9001): `minio-console.tudominio.com`
3. Deploy

### 2.3 Configurar Bucket y Políticas en MinIO

1. Acceder a MinIO Console: `https://minio-console.tudominio.com`
2. Login con credenciales de MinIO
3. Crear bucket: `{{BUCKET_NAME}}` (ej: `jardisalomo-media`)
4. Configurar acceso público de lectura:
   ```bash
   mc alias set prod https://minio.tudominio.com {{ACCESS_KEY}} {{SECRET_KEY}}
   mc anonymous set download prod/{{BUCKET_NAME}}
   ```

### 2.4 Crear Access Keys para la Aplicación

1. En MinIO Console: **Access Keys** > **Create Access Key**
2. **Guardar Access Key y Secret Key**
3. Asignar política `readwrite`

### 2.5 Configurar Variables de Entorno en Coolify

En tu aplicación Payload en Coolify:

**Variables Requeridas:**

```bash
# Database (de paso 2.1)
DATABASE_URL={{DATABASE_URL_FROM_POSTGRESQL}}

# Payload
PAYLOAD_SECRET={{GENERATE_32_CHAR_SECRET}}
NEXT_PUBLIC_SERVER_URL=https://{{YOUR_DOMAIN}}

# MinIO (de pasos 2.2-2.4)
S3_ENDPOINT=https://minio.{{YOUR_DOMAIN}}
S3_BUCKET={{BUCKET_NAME}}
S3_ACCESS_KEY_ID={{MINIO_ACCESS_KEY}}
S3_SECRET_ACCESS_KEY={{MINIO_SECRET_KEY}}
S3_REGION=us-east-1
```

**⚠️ IMPORTANTE**: Marca `NEXT_PUBLIC_SERVER_URL` como **Build Variable**

**Generar `PAYLOAD_SECRET`:**
```bash
openssl rand -base64 32
```

### 2.6 Configurar Build Command

En Coolify, configuración de la app:
1. **Build** > **Build Command**: Cambiar a `pnpm ci`
2. Esto ejecutará migraciones antes del build

### 2.7 Desplegar la Aplicación

1. Click **Deploy** en Coolify
2. Monitorear logs para ver el progreso
3. Las migraciones se ejecutarán automáticamente con `pnpm ci`

**Logs a observar:**
```
✓ Running database migrations...
✓ Migration 20260202120000_initial.ts completed
✓ All migrations completed
✓ Building application...
```

---

## ✅ Fase 3: Migración de Datos

### 3.1 Importar Base de Datos en Producción

#### Opción A: Desde Local (Con Acceso Directo)

```bash
# Importar el dump a producción
pg_restore -h {{PROD_DB_HOST}} -U {{PROD_DB_USER}} -d {{PROD_DB_NAME}} -c backup-local.dump
```

**Ejemplo:**
```bash
pg_restore -h postgres-payloadcms -U payload -d jardisalomo -c backup-local.dump
```

**Nota**: Es posible que necesites contraseña:
```bash
PGPASSWORD={{PROD_DB_PASSWORD}} pg_restore -h {{PROD_DB_HOST}} -U {{PROD_DB_USER}} -d {{PROD_DB_NAME}} -c backup-local.dump
```

#### Opción B: Via SSH Port Forwarding

Si la base de datos no es accesible directamente:

```bash
# Terminal 1: Crear túnel SSH
ssh -L 5433:{{PROD_DB_HOST}}:5432 {{SERVER_USER}}@{{SERVER_IP}}

# Terminal 2: Importar via localhost
pg_restore -h localhost -p 5433 -U {{PROD_DB_USER}} -d {{PROD_DB_NAME}} -c backup-local.dump
```

### 3.2 Subir Media Existente a MinIO

```bash
# Configurar alias (si no lo hiciste antes)
mc alias set prod https://minio.tudominio.com {{ACCESS_KEY}} {{SECRET_KEY}}

# Subir todos los archivos media
mc cp --recursive --progress ./public/media/ prod/{{BUCKET_NAME}}/

# Verificar que se subieron correctamente
mc ls prod/{{BUCKET_NAME}}/

# Ver cuántos archivos se subieron
mc du prod/{{BUCKET_NAME}}/
```

**Ejemplo:**
```bash
mc alias set prod https://minio.jardisalomo.com AKIAIOSFODNN7 wJalrXUtnFEMI...
mc cp --recursive --progress ./public/media/ prod/jardisalomo-media/
```

### 3.3 Actualizar URLs de Media en la Base de Datos

Conéctate a la base de datos de producción y ejecuta:

```sql
-- Conectar a la base de datos
psql "{{DATABASE_URL}}"

-- Actualizar URLs principales de media
UPDATE media
SET url = REPLACE(url, '/media/', 'https://minio.{{YOUR_DOMAIN}}/{{BUCKET_NAME}}/')
WHERE url LIKE '/media/%';

-- Actualizar URLs de tamaños de imagen generados
UPDATE media
SET 
  "sizes_thumbnail_url" = REPLACE("sizes_thumbnail_url", '/media/', 'https://minio.{{YOUR_DOMAIN}}/{{BUCKET_NAME}}/'),
  "sizes_small_url" = REPLACE("sizes_small_url", '/media/', 'https://minio.{{YOUR_DOMAIN}}/{{BUCKET_NAME}}/'),
  "sizes_medium_url" = REPLACE("sizes_medium_url", '/media/', 'https://minio.{{YOUR_DOMAIN}}/{{BUCKET_NAME}}/'),
  "sizes_large_url" = REPLACE("sizes_large_url", '/media/', 'https://minio.{{YOUR_DOMAIN}}/{{BUCKET_NAME}}/'),
  "sizes_xlarge_url" = REPLACE("sizes_xlarge_url", '/media/', 'https://minio.{{YOUR_DOMAIN}}/{{BUCKET_NAME}}/'),
  "sizes_og_url" = REPLACE("sizes_og_url", '/media/', 'https://minio.{{YOUR_DOMAIN}}/{{BUCKET_NAME}}/'),
  "sizes_square_url" = REPLACE("sizes_square_url", '/media/', 'https://minio.{{YOUR_DOMAIN}}/{{BUCKET_NAME}}/')
WHERE url LIKE 'https://minio%';

-- Verificar cambios
SELECT id, url FROM media LIMIT 5;
```

**Ejemplo:**
```sql
UPDATE media
SET url = REPLACE(url, '/media/', 'https://minio.jardisalomo.com/jardisalomo-media/')
WHERE url LIKE '/media/%';
```

---

## ✅ Fase 4: Verificación y Tests

### 4.1 Health Check de la Aplicación

```bash
# Verificar que la app responde
curl https://{{YOUR_DOMAIN}}/api

# Debe devolver algo como:
# {"message":"Payload API"}
```

### 4.2 Test de Login en Admin Panel

1. Navega a `https://{{YOUR_DOMAIN}}/admin`
2. Intenta hacer login con tus credenciales
3. Verifica que puedes acceder al dashboard

### 4.3 Test de Subida de Nueva Imagen

1. En el admin panel, ve a **Media**
2. Click **Upload New**
3. Sube una imagen de prueba
4. Verifica:
   - La imagen se sube correctamente
   - La URL apunta a MinIO: `https://minio.{{YOUR_DOMAIN}}/{{BUCKET_NAME}}/...`
   - Puedes abrir la imagen en el navegador

### 4.4 Verificar Imágenes Migradas

1. En el admin panel, abre cualquier media existente (migrada)
2. Click en la imagen o "View"
3. Verifica que la imagen carga correctamente desde MinIO
4. Prueba con varias imágenes migradas

### 4.5 Test del Frontend

1. Navega a `https://{{YOUR_DOMAIN}}`
2. Verifica que:
   - La página carga correctamente
   - Las imágenes se muestran (tanto nuevas como migradas)
   - Los links funcionan
   - No hay errores de consola

### 4.6 Verificar Logs

En Coolify:
1. Ve a tu aplicación > **Logs**
2. Verifica que no haya errores críticos
3. Busca líneas como:
   ```
   ✓ Database connected successfully
   ✓ Server running on port 3000
   ```

---

## 🔧 Troubleshooting Durante el Despliegue

### Build falla en "payload migrate"

**Problema**: Las migraciones fallan durante el build.

**Solución**:
- Verifica que `DATABASE_URL` es correcta en las variables de entorno
- Verifica que PostgreSQL está ejecutándose y accesible
- Revisa los logs del build para el error específico

### Imágenes migradas no cargan (404)

**Problema**: Las URLs no apuntan correctamente a MinIO.

**Solución**:
- Verifica que ejecutaste el SQL de actualización de URLs (Fase 3.3)
- Verifica que los archivos se subieron a MinIO (`mc ls prod/{{BUCKET_NAME}}/`)
- Verifica que el bucket tiene acceso público (`mc anonymous get prod/{{BUCKET_NAME}}/`)

### No puedo conectarme a la base de datos desde local

**Problema**: `pg_restore` falla con "Connection refused".

**Solución**:
- Usa SSH port forwarding (ver Fase 3.1 Opción B)
- O importa desde dentro del servidor Coolify con `docker exec`

### La aplicación no inicia después del deploy

**Problema**: El contenedor se reinicia constantemente.

**Solución**:
- Revisa los logs en Coolify
- Verifica que todas las variables de entorno están configuradas
- Verifica que `PAYLOAD_SECRET` tiene al menos 32 caracteres
- Verifica que las migraciones se ejecutaron correctamente

---

## 📊 Checklist Completo

Marca cada ítem a medida que lo completas:

### Fase 1: Local
- [ ] Crear migración inicial: `pnpm migrate:create initial`
- [ ] Verificar archivo de migración en `src/migrations/`
- [ ] Commit y push de migraciones al repo
- [ ] Exportar base de datos local: `pg_dump`
- [ ] Instalar MinIO Client (`mc`)

### Fase 2: Coolify
- [ ] Desplegar PostgreSQL en Coolify
- [ ] Guardar `DATABASE_URL`
- [ ] Desplegar MinIO en Coolify
- [ ] Configurar dominios para MinIO (API + Console)
- [ ] Crear bucket en MinIO
- [ ] Configurar acceso público del bucket
- [ ] Crear Access Keys para la aplicación
- [ ] Configurar todas las variables de entorno en la app
- [ ] Marcar `NEXT_PUBLIC_SERVER_URL` como Build Variable
- [ ] Configurar Build Command a `pnpm ci`
- [ ] Desplegar la aplicación

### Fase 3: Migración de Datos
- [ ] Importar base de datos: `pg_restore`
- [ ] Configurar alias de MinIO: `mc alias set`
- [ ] Subir media a MinIO: `mc cp --recursive`
- [ ] Verificar archivos en MinIO: `mc ls`
- [ ] Ejecutar script SQL para actualizar URLs

### Fase 4: Verificación
- [ ] Health check: `curl https://{{YOUR_DOMAIN}}/api`
- [ ] Login en admin panel
- [ ] Test de subida de nueva imagen
- [ ] Verificar imágenes migradas cargan
- [ ] Test del frontend completo
- [ ] Revisar logs en Coolify (sin errores críticos)

---

## 📚 Comandos de Referencia Rápida

### Generar Secret
```bash
openssl rand -base64 32
```

### Export/Import DB
```bash
# Export
pg_dump -h localhost -U postgres -d dbname -F c -f backup.dump

# Import
pg_restore -h host -U user -d dbname -c backup.dump
```

### MinIO
```bash
# Alias
mc alias set prod https://minio.domain.com ACCESS_KEY SECRET_KEY

# Upload
mc cp --recursive ./public/media/ prod/bucket/

# List
mc ls prod/bucket/

# Set public
mc anonymous set download prod/bucket/
```

---

## 🔗 Documentación Relacionada

- [`MINIO-SETUP.md`](./MINIO-SETUP.md) - Guía completa de MinIO
- [`COOLIFY-CONFIG.md`](./COOLIFY-CONFIG.md) - Configuración detallada de Coolify
- [`.env.example`](../.env.example) - Ejemplo de variables de entorno

---

## ✨ ¡Listo!

Si completaste todos los pasos del checklist, tu aplicación Payload CMS debería estar funcionando en producción con:

✅ Base de datos PostgreSQL  
✅ Almacenamiento MinIO para media  
✅ SSL/HTTPS configurado  
✅ Migraciones ejecutándose automáticamente  
✅ Datos migrados desde local  

**Próximos pasos recomendados:**
- Configurar backups automáticos en Coolify
- Configurar monitoreo/alertas
- Revisar y ajustar recursos (memoria/CPU) según uso
