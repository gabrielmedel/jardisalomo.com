# Documentación de Despliegue

Este directorio contiene las guías técnicas para desplegar Payload CMS en producción con Coolify.

## 📚 Guías Disponibles

### 1. [BEFORE-FIRST-DEPLOY.md](./BEFORE-FIRST-DEPLOY.md)
**Checklist completo de preparación y despliegue**

Sigue esta guía paso a paso antes de tu primer despliegue. Incluye:
- ✅ Fase 1: Preparación local (migraciones, export DB)
- ✅ Fase 2: Configuración en Coolify (PostgreSQL, MinIO, App)
- ✅ Fase 3: Migración de datos (import DB, subir media)
- ✅ Fase 4: Verificación y tests

**Empieza aquí si es tu primer despliegue.**

---

### 2. [MINIO-SETUP.md](./MINIO-SETUP.md)
**Configuración detallada de MinIO (S3 compatible)**

Guía técnica completa para configurar MinIO en Coolify:
- Docker Compose para despliegue
- Configuración de buckets y políticas
- Comandos `mc` (MinIO Client)
- Migración de media existente
- Scripts SQL para actualizar URLs
- Troubleshooting común

---

### 3. [COOLIFY-CONFIG.md](./COOLIFY-CONFIG.md)
**Configuración de Coolify y variables de entorno**

Referencia detallada para configurar la aplicación en Coolify:
- Variables de entorno requeridas y opcionales
- Build Variables vs Environment Variables
- Configuración de PostgreSQL
- Health checks
- Dominios y SSL
- Comandos útiles

---

## 🚀 Flujo de Despliegue Recomendado

```
1. Lee BEFORE-FIRST-DEPLOY.md
   └── Sigue el checklist de Fase 1 (Local)

2. Consulta MINIO-SETUP.md
   └── Configura MinIO en Coolify

3. Consulta COOLIFY-CONFIG.md
   └── Configura variables y despliegue

4. Vuelve a BEFORE-FIRST-DEPLOY.md
   └── Completa Fase 2, 3 y 4
```

---

## ⚙️ Configuración del Proyecto

### Variables de Entorno

Ver el archivo [`.env.example`](../.env.example) en la raíz del proyecto para todas las variables disponibles.

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev                  # Servidor de desarrollo

# Migraciones
pnpm migrate:create       # Crear nueva migración
pnpm migrate:status       # Ver estado de migraciones
pnpm migrate              # Ejecutar migraciones

# Build
pnpm build                # Build para producción
pnpm ci                   # Migrar + Build (para CI/CD)

# Producción
pnpm start                # Iniciar servidor de producción
```

---

## 🔗 Recursos Externos

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Coolify Documentation](https://coolify.io/docs)
- [MinIO Documentation](https://min.io/docs/minio/linux/index.html)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)

---

## ⚠️ Notas Importantes

### Sobre S3 Storage

Debido a una incompatibilidad de versiones entre `@payloadcms/storage-s3@3.74.0` y `payload@3.70.0`, el plugin S3 está preparado pero comentado en el código.

**Para habilitar S3 en producción:**

1. Actualiza Payload a la versión 3.74.0+ cuando esté disponible:
   ```bash
   pnpm add payload@latest @payloadcms/db-postgres@latest @payloadcms/ui@latest
   ```

2. Descomenta el código S3 en `src/plugins/index.ts`

3. Configura las variables de entorno S3 en Coolify

**Mientras tanto:** En desarrollo, los archivos se guardan en `public/media/` localmente.

---

## 🆘 Ayuda

Si encuentras problemas:

1. Revisa la sección de **Troubleshooting** en cada guía
2. Verifica los logs en Coolify
3. Consulta la documentación oficial de Payload CMS

---

*Última actualización: Febrero 2026*
