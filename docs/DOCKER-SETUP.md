# Docker Configuration for Production

Esta guía explica la configuración Docker del proyecto y cómo está optimizado para despliegue en Coolify.

## 📋 Resumen

El proyecto usa un Dockerfile multi-stage optimizado para Next.js con:
- ✅ Build optimizado con `output: 'standalone'`
- ✅ Healthcheck configurado
- ✅ Imágenes Alpine (ligeras)
- ✅ Usuario no-root para seguridad
- ✅ Optimización de capas de cache

---

## 🐳 Dockerfile Explicado

### Stage 1: Base

```dockerfile
FROM node:22.17.0-alpine AS base
```

Usa Node.js 22 en Alpine Linux (imagen ligera).

### Stage 2: Dependencies

```dockerfile
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN ... # Instala dependencias
```

**Optimización**: Solo copia lockfiles y `package.json`, instala deps. Si estos archivos no cambian, Docker reutiliza esta capa del cache.

### Stage 3: Builder

```dockerfile
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ... # Build de la aplicación
```

**Copia node_modules** de la stage anterior y ejecuta `pnpm run build` (o el comando según tu package manager).

### Stage 4: Runner (Producción)

```dockerfile
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Crea usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Instala curl para healthcheck
RUN apk add --no-cache curl

# Copia solo lo necesario
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api || exit 1

CMD ["node", "server.js"]
```

**Optimizaciones**:
- Solo copia archivos necesarios (standalone + static + public)
- Usa usuario no-root (`nextjs:nodejs`)
- Instala `curl` para healthcheck
- Healthcheck configurado para `/api` endpoint

---

## 🏥 Healthcheck

### Configuración

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api || exit 1
```

### Parámetros

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| `--interval` | `30s` | Ejecuta check cada 30 segundos |
| `--timeout` | `5s` | Espera máximo 5 segundos por respuesta |
| `--start-period` | `40s` | Espera 40s antes del primer check (permite inicialización) |
| `--retries` | `3` | Falla después de 3 intentos consecutivos |

### Endpoint

- **Path**: `/api`
- **Razón**: Endpoint de Payload que responde rápidamente sin overhead
- **Alternativa**: Puedes usar `/` pero es más pesado (renderiza página)

### Verificar Healthcheck Localmente

```bash
# Build la imagen
docker build -t jardisalomo:test .

# Run el contenedor
docker run -p 3000:3000 --env-file .env jardisalomo:test

# Verificar estado del healthcheck
docker ps
# Columna "STATUS" mostrará "healthy" después de 40s
```

---

## 📦 .dockerignore

El archivo `.dockerignore` evita copiar archivos innecesarios al contexto de build:

```
node_modules
.next/
.env*.local
.git
.vscode
docs/
*.log
```

**Beneficios**:
- ⚡ Build más rápido
- 💾 Imágenes más pequeñas
- 🔒 No copia secrets accidentalmente

---

## 🚀 Build y Deploy en Coolify

### 1. Coolify detecta el Dockerfile automáticamente

Coolify buscará el `Dockerfile` en la raíz del proyecto y lo usará automáticamente.

### 2. Variables de Entorno

Asegúrate de configurar todas las variables en Coolify **antes** del primer deploy:

```bash
DATABASE_URL=postgresql://...
PAYLOAD_SECRET=...
NEXT_PUBLIC_SERVER_URL=https://...
S3_ENDPOINT=https://...
S3_BUCKET=...
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
```

Ver [`docs/COOLIFY-CONFIG.md`](./COOLIFY-CONFIG.md) para la lista completa.

### 3. Build Command (Opcional)

Si quieres ejecutar migraciones antes del build:

**En Coolify > Build Command:**
```bash
pnpm ci
```

Esto ejecuta:
1. `payload migrate` - Ejecuta migraciones
2. `pnpm build` - Compila la app

### 4. Deploy

Click **Deploy** en Coolify. El proceso:

1. Clone del repositorio
2. Build de la imagen Docker
3. Push de la imagen al registro interno
4. Deploy del contenedor
5. Healthcheck inicia después de 40s
6. Aplicación marcada como "healthy" y lista

---

## 🔍 Troubleshooting

### Build falla: "Lockfile not found"

**Causa**: No hay `pnpm-lock.yaml` en el repo.

**Solución**:
```bash
git add pnpm-lock.yaml
git commit -m "Add lockfile"
git push
```

### Healthcheck falla: "unhealthy"

**Causa 1**: La app no responde en `/api`

**Solución**: Verifica logs:
```bash
docker logs <container-id>
```

**Causa 2**: La app tarda más de 40s en iniciar

**Solución**: Aumenta `--start-period`:
```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/api || exit 1
```

**Causa 3**: Variables de entorno faltantes

**Solución**: Verifica que `DATABASE_URL`, `PAYLOAD_SECRET`, etc. estén configuradas.

### Imagen muy grande

**Causa**: `.dockerignore` no está funcionando.

**Solución**: Verifica que `.dockerignore` exista y contenga:
```
node_modules
.next/
.git
```

---

## 📊 Métricas de la Imagen

### Tamaños Esperados

- **Imagen final (runner)**: ~300-400 MB
- **Builder stage (no se incluye en la imagen final)**: ~1-2 GB

### Ver tamaño de la imagen

```bash
docker images jardisalomo
```

### Reducir tamaño (si es necesario)

1. **Usa Alpine base** (ya configurado)
2. **Multi-stage build** (ya configurado)
3. **Limpia cache de APK**:
   ```dockerfile
   RUN apk add --no-cache curl && rm -rf /var/cache/apk/*
   ```

---

## 🔐 Seguridad

### Usuario No-Root

El contenedor corre como usuario `nextjs` (UID 1001), no como `root`:

```dockerfile
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
```

**Beneficio**: Si hay una vulnerabilidad, el atacante no tiene permisos de root.

### Permisos de Archivos

```dockerfile
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
```

Los archivos pertenecen a `nextjs:nodejs`, no a `root`.

---

## 🧪 Testing Local

### Build y Run

```bash
# Build
docker build -t jardisalomo:local .

# Run con .env
docker run -p 3000:3000 --env-file .env jardisalomo:local

# Run con variables inline
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e PAYLOAD_SECRET="..." \
  -e NEXT_PUBLIC_SERVER_URL="http://localhost:3000" \
  jardisalomo:local
```

### Verificar Healthcheck

```bash
# Ver estado
docker ps

# Inspeccionar health
docker inspect --format='{{json .State.Health}}' <container-id> | jq
```

### Logs

```bash
# Seguir logs en tiempo real
docker logs -f <container-id>

# Últimas 100 líneas
docker logs --tail 100 <container-id>
```

---

## 📚 Referencias

- [Next.js Docker Documentation](https://nextjs.org/docs/app/building-your-application/deploying/docker)
- [Docker HEALTHCHECK Reference](https://docs.docker.com/engine/reference/builder/#healthcheck)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Coolify Documentation](https://coolify.io/docs)

---

## ✅ Checklist Pre-Deploy

- [ ] `output: 'standalone'` configurado en `next.config.js`
- [ ] `.dockerignore` existe y está configurado
- [ ] `pnpm-lock.yaml` está en el repositorio
- [ ] Variables de entorno configuradas en Coolify
- [ ] Healthcheck endpoint `/api` funciona localmente
- [ ] Build local exitoso: `docker build -t test .`
- [ ] Test local exitoso: `docker run -p 3000:3000 --env-file .env test`

---

*Última actualización: Febrero 2026*
