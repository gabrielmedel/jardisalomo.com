# Configuración de MinIO para Jardi Salomó - COMPLETADA

## ✅ Lo Que Ya Está Configurado

### 1. Alias de MinIO Configurado
```bash
mc alias set prod https://minio-api.coolify.eljardisalomo.com 4uWg20mUFBd9oux4 9n9DQQf4Tabpa9VC7iprLozmvdRIX5uZ
```

### 2. Bucket Verificado
- **Bucket**: `jardisalomo` ✅ Existe

### 3. Acceso Público Configurado
```bash
mc anonymous set download prod/jardisalomo
```
✅ El bucket tiene acceso público de lectura

---

## 🔑 CREAR ACCESS KEYS PARA LA APLICACIÓN

**IMPORTANTE**: No uses las credenciales de admin en la aplicación. Debes crear Access Keys específicas.

### Pasos para Crear Access Keys:

1. **Accede a la consola de MinIO**:
   - URL: https://minio-console.coolify.eljardisalomo.com (o el puerto 9001 que configuraste)
   - Usuario: `4uWg20mUFBd9oux4`
   - Password: `9n9DQQf4Tabpa9VC7iprLozmvdRIX5uZ`

2. **Crear Access Keys**:
   - En el menú lateral, ve a **Access Keys**
   - Click en **Create Access Key**
   - Deja el nombre automático o pon: `jardisalomo-app`
   - **Policy**: Selecciona `readwrite` o crea una custom:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:GetObject",
           "s3:PutObject",
           "s3:DeleteObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::jardisalomo",
           "arn:aws:s3:::jardisalomo/*"
         ]
       }
     ]
   }
   ```

3. **Guardar las Credenciales**:
   - ⚠️ **IMPORTANTE**: Guarda inmediatamente el **Access Key** y el **Secret Key**
   - No podrás volver a ver el Secret Key después

---

## 📝 Variables de Entorno para Coolify

Una vez tengas las Access Keys, configura estas variables en Coolify:

```bash
# MinIO Storage (S3 compatible)
S3_ENDPOINT=https://minio-api.coolify.eljardisalomo.com
S3_BUCKET=jardisalomo
S3_ACCESS_KEY_ID=<ACCESS_KEY_DE_PASO_2>
S3_SECRET_ACCESS_KEY=<SECRET_KEY_DE_PASO_2>
S3_REGION=us-east-1
S3_ENABLED=true
```

---

## 🗄️ Importar Base de Datos a Producción

Tu base de datos de producción no es accesible externamente. Debes importarla desde el servidor de Coolify.

### Archivo de Backup Creado

He creado un backup SQL en formato plain:
- **Archivo**: `backup-production-20260203-032236.sql`
- **Tamaño**: 1.4 MB
- ⚠️ **Este archivo ha sido borrado por seguridad**

### Crear Nuevo Backup

```bash
docker exec payloadcms-jardisalomo-postgres pg_dump -U postgres payloadcms-jardisalomo --no-owner --no-acl > backup-prod.sql
```

### Importar en Producción (desde servidor Coolify vía SSH)

```bash
# 1. Sube el archivo SQL al servidor
scp backup-prod.sql user@188.245.184.148:/tmp/

# 2. Conéctate al servidor
ssh user@188.245.184.148

# 3. Importa la base de datos
PGPASSWORD=6Wl8352oY71pW4u1CO11TIhLb22tsJYoDjFehTDXNiJ77b9eD8JgLDa41QGnnQB9 \
  psql -h 188.245.184.148 -U postgres -d postgres -f /tmp/backup-prod.sql

# 4. Verifica que se importó correctamente
PGPASSWORD=6Wl8352oY71pW4u1CO11TIhLb22tsJYoDjFehTDXNiJ77b9eD8JgLDa41QGnnQB9 \
  psql -h 188.245.184.148 -U postgres -d postgres -c "\dt"

# 5. Limpia
rm /tmp/backup-prod.sql
```

---

## 📤 Subir Media a MinIO

Una vez tengas las Access Keys configuradas:

```bash
# Subir todos los archivos de media
mc cp --recursive ./public/media/ prod/jardisalomo/

# Verificar que se subieron
mc ls prod/jardisalomo/

# Ver tamaño total
mc du prod/jardisalomo/
```

---

## 🔄 Actualizar URLs en la Base de Datos

Después de subir la media a MinIO, actualiza las URLs en la base de datos de producción:

```sql
-- Conectar a la base de datos
PGPASSWORD=6Wl8352oY71pW4u1CO11TIhLb22tsJYoDjFehTDXNiJ77b9eD8JgLDa41QGnnQB9 \
  psql -h 188.245.184.148 -U postgres -d postgres

-- Actualizar URLs principales
UPDATE media
SET url = REPLACE(url, '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/')
WHERE url LIKE '/media/%';

-- Actualizar URLs de tamaños de imagen
UPDATE media
SET 
  "sizes_thumbnail_url" = REPLACE("sizes_thumbnail_url", '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/'),
  "sizes_small_url" = REPLACE("sizes_small_url", '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/'),
  "sizes_medium_url" = REPLACE("sizes_medium_url", '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/'),
  "sizes_large_url" = REPLACE("sizes_large_url", '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/'),
  "sizes_xlarge_url" = REPLACE("sizes_xlarge_url", '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/'),
  "sizes_og_url" = REPLACE("sizes_og_url", '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/'),
  "sizes_square_url" = REPLACE("sizes_square_url", '/media/', 'https://minio-api.coolify.eljardisalomo.com/jardisalomo/')
WHERE url LIKE 'https://minio-api%';

-- Verificar cambios
SELECT id, url FROM media LIMIT 5;
```

---

## ✅ Checklist Final

- [x] Alias de MinIO configurado
- [x] Bucket `jardisalomo` verificado
- [x] Acceso público de lectura configurado
- [ ] Access Keys creadas en la consola de MinIO
- [ ] Variables S3_* configuradas en Coolify
- [ ] Base de datos importada en producción
- [ ] Media subida a MinIO
- [ ] URLs actualizadas en la base de datos
- [ ] Aplicación desplegada en Coolify

---

## 📞 Próximos Pasos

1. **Crear Access Keys** en la consola de MinIO
2. **Compartir las credenciales** para configurar en Coolify
3. **Importar la base de datos** desde el servidor
4. **Subir media** a MinIO
5. **Actualizar URLs** en la base de datos
6. **Desplegar** la aplicación en Coolify

