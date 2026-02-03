# Configuración de Coolify para Payload CMS

Esta guía detalla cómo configurar y desplegar Payload CMS en Coolify con PostgreSQL y MinIO.

## 📋 Prerrequisitos

- Servidor Coolify configurado y funcionando
- Dominio(s) apuntando a tu servidor Coolify
- Acceso SSH al servidor (para verificaciones si es necesario)

---

## 1. Crear PostgreSQL en Coolify

### Opción A: PostgreSQL como Servicio

1. En Coolify, ve a **Resources** > **+ Add New** > **Database**
2. Selecciona **PostgreSQL**
3. Configuración:
   - **Name**: `payloadcms-postgres` (o el que prefieras)
   - **Database Name**: `{{DB_NAME}}` (ej: `jardisalomo`)
   - **Username**: `{{DB_USER}}` (ej: `payload`)
   - **Password**: Generar una contraseña segura
   - **Port**: `5432` (por defecto)
4. Click **Deploy**

### Guardar la URL de Conexión

Una vez desplegado, Coolify te dará la `DATABASE_URL`:

```
postgresql://{{DB_USER}}:{{DB_PASSWORD}}@{{DB_HOST}}:5432/{{DB_NAME}}
```

Ejemplo:
```
postgresql://payload:SecureP@ss123@postgres-payloadcms:5432/jardisalomo
```

---

## 2. Desplegar la Aplicación Payload CMS

### Crear Nuevo Proyecto

1. En Coolify, ve a **Resources** > **+ Add New** > **Application**
2. Selecciona **Git Repository**
3. Conecta tu repositorio (GitHub, GitLab, etc.)
4. Configuración básica:
   - **Build Pack**: `Dockerfile`
   - **Port**: `3000`
   - **Domain**: `{{APP_DOMAIN}}` (ej: `jardisalomo.com`)

### Configurar Dockerfile

Coolify usará el `Dockerfile` en la raíz del proyecto. Verifica que:
- Tenga `output: 'standalone'` en `next.config.js` ✅ (ya configurado)
- El Dockerfile expone el puerto `3000`

---

## 3. Variables de Entorno

En Coolify, ve a la configuración de tu aplicación > **Environment Variables**

### Variables Requeridas

#### Base Configuration

```bash
# Database
DATABASE_URL={{DATABASE_URL_FROM_STEP_1}}

# Payload Secret (mínimo 32 caracteres)
PAYLOAD_SECRET={{GENERATE_SECURE_SECRET}}

# Server URL
NEXT_PUBLIC_SERVER_URL={{APP_DOMAIN_WITH_HTTPS}}
```

#### MinIO Storage (Producción)

```bash
S3_ENDPOINT={{MINIO_API_URL}}
S3_BUCKET={{BUCKET_NAME}}
S3_ACCESS_KEY_ID={{MINIO_ACCESS_KEY}}
S3_SECRET_ACCESS_KEY={{MINIO_SECRET_KEY}}
S3_REGION=us-east-1
```

#### Opcionales

```bash
# Email (si usas Resend)
RESEND_API_KEY={{YOUR_RESEND_KEY}}
RESEND_DEFAULT_EMAIL={{YOUR_EMAIL}}

# OpenAI (para traducciones)
OPENAI_API_KEY={{YOUR_OPENAI_KEY}}

# Cron Jobs
CRON_SECRET={{GENERATE_SECURE_SECRET}}
```

### Ejemplo con Valores Reales

```bash
# Base
DATABASE_URL=postgresql://payload:SecureP@ss123@postgres-payloadcms:5432/jardisalomo
PAYLOAD_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
NEXT_PUBLIC_SERVER_URL=https://jardisalomo.com

# MinIO
S3_ENDPOINT=https://minio.jardisalomo.com
S3_BUCKET=jardisalomo-media
S3_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
S3_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
S3_REGION=us-east-1
```

### ⚠️ Build Variables

**IMPORTANTE**: Las variables que comienzan con `NEXT_PUBLIC_` deben marcarse como **Build Variables**:

1. Busca la variable `NEXT_PUBLIC_SERVER_URL`
2. Marca el checkbox **"Is Build Variable"**

Esto es necesario porque Next.js necesita estas variables en tiempo de compilación.

---

## 4. Build Configuration

### Build Command

Si usas el script `ci` (recomendado para ejecutar migraciones antes del build):

1. Ve a **Build** > **Build Command**
2. Cambia de `pnpm build` a:
   ```bash
   pnpm ci
   ```

Esto ejecutará:
1. `payload migrate` - Ejecuta migraciones pendientes
2. `pnpm build` - Compila la aplicación

### Start Command

Coolify usa automáticamente el `CMD` del Dockerfile:
```dockerfile
CMD HOSTNAME="0.0.0.0" node server.js
```

No necesitas cambiar nada aquí.

---

## 5. Health Checks

El Dockerfile ya incluye un healthcheck configurado que Coolify detectará automáticamente:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api || exit 1
```

**Parámetros del Healthcheck:**
- **Endpoint**: `/api` (Payload API endpoint)
- **Intervalo**: Cada 30 segundos
- **Timeout**: 5 segundos de espera por respuesta
- **Start Period**: 40 segundos antes del primer check (permite que la app inicie)
- **Retries**: 3 intentos fallidos antes de marcar como unhealthy

### Configuración Opcional en Coolify

Si necesitas ajustar el healthcheck en Coolify (opcional):

1. Ve a **Health Check** en la configuración de la app
2. Configuración recomendada:
   - **Method**: `GET`
   - **Path**: `/api`
   - **Port**: `3000`
   - **Interval**: `30s`
   - **Timeout**: `5s`
   - **Retries**: `3`

**Nota**: Coolify respetará el healthcheck del Dockerfile automáticamente, pero puedes sobrescribirlo aquí si es necesario.

---

## 6. Dominios y SSL

### Configurar Dominio Principal

1. En **Domains**, añade tu dominio: `{{APP_DOMAIN}}`
2. Ejemplo: `jardisalomo.com`
3. Coolify generará automáticamente el certificado SSL con Let's Encrypt

### Añadir Subdominios Adicionales (Opcional)

Si quieres `www.jardisalomo.com`:

1. Click **+ Add Domain**
2. Añade: `www.{{APP_DOMAIN}}`
3. Configura un redirect de `www` a tu dominio principal (opcional)

### Verificar DNS

Asegúrate de que tu dominio apunte a la IP de Coolify:

```bash
# Verificar registro A
dig {{APP_DOMAIN}} +short

# Debe devolver la IP de tu servidor Coolify
```

---

## 7. Desplegar la Aplicación

1. Una vez configuradas todas las variables, click **Deploy**
2. Coolify:
   - Clonará el repositorio
   - Ejecutará `pnpm install`
   - Ejecutará `pnpm ci` (migraciones + build)
   - Iniciará el contenedor
3. Monitorea los logs en tiempo real para detectar errores

---

## 8. Conectarse a la Base de Datos (Desde Local)

Si necesitas ejecutar migraciones o queries manualmente:

### Usando psql

```bash
psql "{{DATABASE_URL}}"
```

### Port Forwarding con SSH (si la DB no es accesible públicamente)

```bash
# En una terminal, crea un túnel SSH
ssh -L 5433:{{DB_HOST}}:5432 {{YOUR_SERVER_USER}}@{{YOUR_SERVER_IP}}

# En otra terminal, conéctate vía localhost
psql "postgresql://{{DB_USER}}:{{DB_PASSWORD}}@localhost:5433/{{DB_NAME}}"
```

---

## 9. Configuración de Backups

### Backups Automáticos en Coolify

1. Ve al servicio PostgreSQL
2. **Settings** > **Backup**
3. Configuración:
   - **Frequency**: Diario, cada 3am (ajusta según necesites)
   - **Retention**: 7 días (o más)
4. Click **Save**

### Backup Manual

```bash
# Desde tu servidor Coolify
docker exec {{POSTGRES_CONTAINER_NAME}} pg_dump -U {{DB_USER}} {{DB_NAME}} > backup.sql

# Restaurar
docker exec -i {{POSTGRES_CONTAINER_NAME}} psql -U {{DB_USER}} {{DB_NAME}} < backup.sql
```

---

## 10. Monitoreo y Logs

### Ver Logs en Tiempo Real

En Coolify:
1. Ve a tu aplicación
2. **Logs** > Selecciona el contenedor
3. Los logs se actualizan en tiempo real

### Logs Específicos

```bash
# SSH al servidor
ssh {{YOUR_SERVER_USER}}@{{YOUR_SERVER_IP}}

# Ver logs del contenedor
docker logs {{CONTAINER_NAME}} -f

# Ver últimas 100 líneas
docker logs {{CONTAINER_NAME}} --tail 100
```

---

## 11. Escalado y Performance

### Incrementar Recursos

Si tu app necesita más recursos:

1. Ve a **Resources** en Coolify
2. Ajusta:
   - **Memory Limit**: (ej: `2GB`)
   - **CPU Limit**: (ej: `2 cores`)
3. Redeploy

### Optimizaciones de Next.js

En producción, Next.js automáticamente:
- Minimiza y comprime assets
- Optimiza imágenes
- Habilita caché de páginas estáticas

---

## 🔧 Troubleshooting

### Error: "Cannot connect to database"

**Causa**: `DATABASE_URL` incorrecta o PostgreSQL no accesible.

**Solución**:
- Verifica que PostgreSQL esté ejecutándose en Coolify
- Verifica la `DATABASE_URL` (usuario, contraseña, host, puerto, nombre DB)
- Verifica que la app pueda alcanzar el contenedor PostgreSQL (red interna)

### Error: "PAYLOAD_SECRET is required"

**Causa**: Variable de entorno no configurada.

**Solución**:
- Verifica que `PAYLOAD_SECRET` esté en las variables de entorno
- Debe tener mínimo 32 caracteres
- Genera uno con: `openssl rand -base64 32`

### Build falla con "Module not found"

**Causa**: Dependencias no instaladas correctamente.

**Solución**:
- Verifica que `pnpm-lock.yaml` esté en el repo
- En Coolify, limpia el cache y redeploy:
  - **Settings** > **Clear Build Cache**
  - Deploy nuevamente

### La aplicación no carga después del deploy

**Causa**: Health check fallando o puerto incorrecto.

**Solución**:
- Verifica los logs para ver errores
- Verifica que el puerto expuesto sea `3000`
- Verifica el health check path (`/api` o `/`)

### Imágenes no cargan (404)

**Causa**: MinIO no configurado o URLs incorrectas.

**Solución**:
- Verifica que todas las variables `S3_*` estén configuradas
- Verifica que MinIO esté ejecutándose
- Sigue la guía `MINIO-SETUP.md`

---

## 📚 Comandos Útiles

### Reiniciar la Aplicación

En Coolify:
- **Actions** > **Restart**

Desde terminal:
```bash
docker restart {{CONTAINER_NAME}}
```

### Ver Uso de Recursos

```bash
docker stats {{CONTAINER_NAME}}
```

### Ejecutar Comandos dentro del Contenedor

```bash
# Entrar al shell del contenedor
docker exec -it {{CONTAINER_NAME}} sh

# Ejecutar comando de Payload
docker exec {{CONTAINER_NAME}} pnpm payload migrate:status
```

---

## 🔗 Placeholders Resumen

Reemplaza estos valores con los tuyos:

- `{{DB_NAME}}`: Nombre de la base de datos (ej: `jardisalomo`)
- `{{DB_USER}}`: Usuario de PostgreSQL (ej: `payload`)
- `{{DB_PASSWORD}}`: Contraseña de PostgreSQL
- `{{DB_HOST}}`: Host de PostgreSQL (ej: `postgres-payloadcms`)
- `{{DATABASE_URL}}`: URL completa de conexión
- `{{APP_DOMAIN}}`: Tu dominio (ej: `jardisalomo.com`)
- `{{MINIO_API_URL}}`: URL de MinIO API (ej: `https://minio.jardisalomo.com`)
- `{{BUCKET_NAME}}`: Nombre del bucket (ej: `jardisalomo-media`)
- `{{MINIO_ACCESS_KEY}}`: Access Key de MinIO
- `{{MINIO_SECRET_KEY}}`: Secret Key de MinIO
- `{{YOUR_SERVER_USER}}`: Usuario SSH (ej: `root`)
- `{{YOUR_SERVER_IP}}`: IP del servidor
- `{{CONTAINER_NAME}}`: Nombre del contenedor Docker

---

## 🔗 Referencias

- [Coolify Documentation](https://coolify.io/docs)
- [Next.js Docker Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Payload CMS Production](https://payloadcms.com/docs/production/deployment)
