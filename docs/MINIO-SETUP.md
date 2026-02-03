# Configuración de MinIO en Coolify para Payload CMS

Esta guía te ayudará a configurar MinIO (almacenamiento S3 compatible) en Coolify para gestionar los archivos media de Payload CMS.

## 📋 Prerrequisitos

- Acceso a Coolify con permisos para crear servicios
- Dominios configurados (necesitarás 2 subdominios para MinIO)
- Cliente `mc` (MinIO Client) instalado localmente

---

## 1. Desplegar MinIO en Coolify

### Docker Compose para MinIO

1. En Coolify, ve a **Resources** > **+ Add New** > **Docker Compose**
2. Copia y pega el siguiente docker-compose.yml:

```yaml
services:
  minio:
    image: quay.io/minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ROOT_USER={{MINIO_ROOT_USER}}
      - MINIO_ROOT_PASSWORD={{MINIO_ROOT_PASSWORD}}
      - MINIO_SERVER_URL={{MINIO_API_URL}}
      - MINIO_BROWSER_REDIRECT_URL={{MINIO_CONSOLE_URL}}
    volumes:
      - minio-data:/data
    healthcheck:
      test: ["CMD", "mc", "ready", "local"]
      interval: 5s
      timeout: 20s
      retries: 10
    ports:
      - "9000:9000"
      - "9001:9001"

volumes:
  minio-data:
```

### Placeholders a reemplazar:

- `{{MINIO_ROOT_USER}}`: Usuario admin (ej: `minioadmin`)
- `{{MINIO_ROOT_PASSWORD}}`: Contraseña segura (ej: `P@ssw0rd123!`)
- `{{MINIO_API_URL}}`: URL de la API (ej: `https://minio.tudominio.com`)
- `{{MINIO_CONSOLE_URL}}`: URL de la consola (ej: `https://minio-console.tudominio.com`)

### Configurar dominios en Coolify

En la configuración del servicio MinIO en Coolify:

1. **Puerto 9000 (API)**: Asignar dominio `{{MINIO_DOMAIN}}` (ej: `minio.tudominio.com`)
2. **Puerto 9001 (Console)**: Asignar dominio `{{MINIO_CONSOLE_DOMAIN}}` (ej: `minio-console.tudominio.com`)
3. Habilitar **SSL** automático con Let's Encrypt

---

## 2. Configurar Bucket y Políticas

### Acceder a la Consola Web

1. Navega a `{{MINIO_CONSOLE_URL}}`
2. Login con las credenciales:
   - **Username**: `{{MINIO_ROOT_USER}}`
   - **Password**: `{{MINIO_ROOT_PASSWORD}}`

### Crear Bucket

1. Ve a **Buckets** > **Create Bucket**
2. **Bucket Name**: `{{BUCKET_NAME}}` (ej: `jardisalomo-media`)
3. **Versioning**: Deshabilitado (opcional)
4. **Object Locking**: Desmarcar
5. Click **Create Bucket**

### Configurar Acceso Público para Lectura

#### Opción A: Desde la Consola Web

1. Selecciona el bucket `{{BUCKET_NAME}}`
2. Ve a **Access** > **Anonymous**
3. Click **Add Access Rule**
4. **Prefix**: Dejar vacío o `*` (para todo el bucket)
5. **Access**: Seleccionar **readonly** o **download**
6. Click **Save**

#### Opción B: Usando MinIO Client (mc)

```bash
# Configurar alias para tu MinIO
mc alias set myminio {{MINIO_API_URL}} {{MINIO_ROOT_USER}} {{MINIO_ROOT_PASSWORD}}

# Configurar acceso público de lectura
mc anonymous set download myminio/{{BUCKET_NAME}}

# Verificar
mc anonymous get myminio/{{BUCKET_NAME}}
```

### Configurar CORS (si es necesario)

Si vas a acceder a las imágenes desde el navegador:

```bash
mc admin config set myminio api cors_allow_origin="{{YOUR_WEBSITE_URL}}"
mc admin service restart myminio
```

Reemplaza `{{YOUR_WEBSITE_URL}}` con tu dominio (ej: `https://jardisalomo.com`)

---

## 3. Crear Access Keys para la Aplicación

### Desde la Consola Web

1. Ve a **Access Keys** > **Create Access Key**
2. **Access Key**: Se generará automáticamente (guárdala)
3. **Secret Key**: Se generará automáticamente (guárdala)
4. **Policy**: Seleccionar `readwrite` o crear una custom (ver abajo)
5. Click **Create**

⚠️ **IMPORTANTE**: Guarda estas credenciales inmediatamente. No podrás verlas después.

### Política Personalizada (Opcional)

Si quieres restringir los permisos solo al bucket específico:

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
        "arn:aws:s3:::{{BUCKET_NAME}}",
        "arn:aws:s3:::{{BUCKET_NAME}}/*"
      ]
    }
  ]
}
```

---

## 4. Configurar Variables de Entorno en Payload CMS

Añade estas variables en Coolify para tu aplicación Payload:

```bash
S3_ENDPOINT={{MINIO_API_URL}}
S3_BUCKET={{BUCKET_NAME}}
S3_ACCESS_KEY_ID={{ACCESS_KEY_FROM_STEP_3}}
S3_SECRET_ACCESS_KEY={{SECRET_KEY_FROM_STEP_3}}
S3_REGION=us-east-1
```

### Ejemplo con valores reales:

```bash
S3_ENDPOINT=https://minio.tudominio.com
S3_BUCKET=jardisalomo-media
S3_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
S3_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
S3_REGION=us-east-1
```

---

## 5. Instalar MinIO Client (mc) localmente

Para migrar archivos necesitarás el cliente `mc`:

### macOS

```bash
brew install minio/stable/mc
```

### Linux

```bash
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/
```

### Windows

```powershell
choco install minio-client
```

### Configurar Alias Local

```bash
mc alias set prod {{MINIO_API_URL}} {{ACCESS_KEY}} {{SECRET_KEY}}
```

Ejemplo:
```bash
mc alias set prod https://minio.tudominio.com AKIAIOSFODNN7EXAMPLE wJalrXUtnFEMI...
```

---

## 6. Migrar Media Existente de Local a MinIO

### Subir todos los archivos

```bash
# Desde el directorio raíz del proyecto
mc cp --recursive ./public/media/ prod/{{BUCKET_NAME}}/

# Verificar que se subieron correctamente
mc ls prod/{{BUCKET_NAME}}/
```

### Ver progreso detallado

```bash
mc cp --recursive --progress ./public/media/ prod/{{BUCKET_NAME}}/
```

---

## 7. Actualizar URLs en la Base de Datos

Después de subir los archivos a MinIO, necesitas actualizar las URLs en PostgreSQL:

```sql
-- Conectar a tu base de datos de producción
psql {{DATABASE_URL}}

-- Actualizar URLs principales
UPDATE media
SET url = REPLACE(url, '/media/', '{{MINIO_API_URL}}/{{BUCKET_NAME}}/')
WHERE url LIKE '/media/%';

-- Actualizar URLs de tamaños de imagen
UPDATE media
SET 
  "sizes_thumbnail_url" = REPLACE("sizes_thumbnail_url", '/media/', '{{MINIO_API_URL}}/{{BUCKET_NAME}}/'),
  "sizes_small_url" = REPLACE("sizes_small_url", '/media/', '{{MINIO_API_URL}}/{{BUCKET_NAME}}/'),
  "sizes_medium_url" = REPLACE("sizes_medium_url", '/media/', '{{MINIO_API_URL}}/{{BUCKET_NAME}}/'),
  "sizes_large_url" = REPLACE("sizes_large_url", '/media/', '{{MINIO_API_URL}}/{{BUCKET_NAME}}/'),
  "sizes_xlarge_url" = REPLACE("sizes_xlarge_url", '/media/', '{{MINIO_API_URL}}/{{BUCKET_NAME}}/'),
  "sizes_og_url" = REPLACE("sizes_og_url", '/media/', '{{MINIO_API_URL}}/{{BUCKET_NAME}}/'),
  "sizes_square_url" = REPLACE("sizes_square_url", '/media/', '{{MINIO_API_URL}}/{{BUCKET_NAME}}/')
WHERE url LIKE '{{MINIO_API_URL}}%';

-- Verificar cambios
SELECT id, url FROM media LIMIT 5;
```

---

## 8. Verificación

### Test de Subida desde Terminal

```bash
# Crear archivo de prueba
echo "test content" > test.txt

# Subir a MinIO
mc cp test.txt prod/{{BUCKET_NAME}}/test.txt

# Verificar que es accesible públicamente
curl {{MINIO_API_URL}}/{{BUCKET_NAME}}/test.txt

# Limpiar
mc rm prod/{{BUCKET_NAME}}/test.txt
rm test.txt
```

### Test desde Payload Admin

1. Accede al admin panel de Payload
2. Ve a **Media** > **Upload New**
3. Sube una imagen de prueba
4. Verifica que la URL apunte a MinIO: `{{MINIO_API_URL}}/{{BUCKET_NAME}}/...`
5. Abre la URL en el navegador y verifica que la imagen carga

### Test de Imágenes Migradas

1. En el admin panel, abre cualquier media existente
2. Click en "View" o abre la URL
3. Verifica que las imágenes migradas cargan correctamente

---

## 9. Backups

### Backup Manual

```bash
# Hacer backup completo del bucket
mc mirror prod/{{BUCKET_NAME}} ./backup-media-$(date +%Y%m%d)/

# Restaurar desde backup
mc mirror ./backup-media-20260202/ prod/{{BUCKET_NAME}}
```

### Backup Automático con Coolify

Coolify puede hacer backups automáticos de volúmenes Docker:

1. En Coolify, ve al servicio MinIO
2. **Settings** > **Backup**
3. Configura frecuencia y destino

---

## 🔧 Troubleshooting

### Error: "The request signature we calculated does not match"

**Causa**: Problema con la configuración de región o path style.

**Solución**:
- Verifica que `S3_REGION` sea `us-east-1`
- Verifica que `forcePathStyle: true` esté en la config del plugin S3

### Error: "Access Denied" al subir archivos

**Causa**: Credenciales incorrectas o permisos insuficientes.

**Solución**:
- Verifica `S3_ACCESS_KEY_ID` y `S3_SECRET_ACCESS_KEY`
- Verifica que el Access Key tenga permisos de escritura en el bucket
- Revisa la política asignada al Access Key

### Las imágenes no cargan públicamente

**Causa**: El bucket no tiene acceso público configurado.

**Solución**:
```bash
mc anonymous set download myminio/{{BUCKET_NAME}}
mc anonymous get myminio/{{BUCKET_NAME}}  # Debe mostrar "download"
```

### Error de CORS al acceder desde el navegador

**Causa**: CORS no configurado correctamente.

**Solución**:
```bash
mc admin config set myminio api cors_allow_origin="{{YOUR_WEBSITE_URL}}"
mc admin service restart myminio
```

### MinIO no inicia en Coolify

**Causa**: Variables de entorno incorrectas o puerto ocupado.

**Solución**:
- Verifica que `MINIO_SERVER_URL` y `MINIO_BROWSER_REDIRECT_URL` sean correctas
- Verifica que los puertos 9000 y 9001 no estén en uso
- Revisa los logs en Coolify

---

## 📚 Comandos Útiles de `mc`

```bash
# Listar buckets
mc ls prod

# Listar archivos en un bucket
mc ls prod/{{BUCKET_NAME}}/

# Ver tamaño total del bucket
mc du prod/{{BUCKET_NAME}}/

# Buscar archivos
mc find prod/{{BUCKET_NAME}}/ --name "*.jpg"

# Copiar archivo
mc cp local-file.jpg prod/{{BUCKET_NAME}}/images/

# Eliminar archivo
mc rm prod/{{BUCKET_NAME}}/images/old-file.jpg

# Sincronizar (como rsync)
mc mirror --watch ./public/media/ prod/{{BUCKET_NAME}}/
```

---

## 🔗 Referencias

- [MinIO Documentation](https://min.io/docs/minio/linux/index.html)
- [MinIO Client Guide](https://min.io/docs/minio/linux/reference/minio-mc.html)
- [Payload Storage Adapters](https://payloadcms.com/docs/upload/storage-adapters)
- [@payloadcms/storage-s3](https://www.npmjs.com/package/@payloadcms/storage-s3)
