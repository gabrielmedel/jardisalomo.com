# Marcar Migración Inicial como Ejecutada

Esta guía te ayuda a marcar la migración inicial como ejecutada cuando ya tienes la base de datos creada con `push: true` en desarrollo.

## ⚠️ Cuándo Usar Esto

Usa este método cuando:
- Ya tienes tu base de datos de desarrollo funcionando con `push: true`
- Has creado una migración inicial con `pnpm migrate:create initial`
- Quieres marcar esa migración como ejecutada sin ejecutarla (porque la DB ya tiene todas las tablas)

## 🔄 Proceso Automático (Recomendado)

### Opción 1: Usar SQL directo

```bash
# Marcar la migración como ejecutada
psql "$DATABASE_URL" -c "INSERT INTO payload_migrations (name, batch) VALUES ('20260203_021428_initial', 1);"

# Verificar
pnpm migrate:status
```

### Opción 2: Usar el script SQL

```bash
# Ejecutar el script completo
psql "$DATABASE_URL" -f scripts/mark-migration-executed.sql
```

## ✅ Verificar Resultado

```bash
pnpm migrate:status
```

**Output esperado:**
```
┌─────────────────────────┬───────┬─────┐
│                   Name  │ Batch │ Ran │
├─────────────────────────┼───────┼─────┤
│ 20260203_021428_initial │     1 │ Yes │ ← Verde, marcado como ejecutado
└─────────────────────────┴───────┴─────┘
```

## 📋 Paso a Paso Manual

Si prefieres hacerlo paso a paso:

### 1. Conectar a la base de datos

```bash
psql "$DATABASE_URL"
```

O con los valores directamente:
```bash
psql "postgres://postgres:password@127.0.0.1:5432/payloadcms-jardisalomo"
```

### 2. Ver tabla de migraciones

```sql
SELECT * FROM payload_migrations;
```

Debería estar vacía o mostrar otras migraciones.

### 3. Insertar la migración

```sql
INSERT INTO payload_migrations (name, batch)
VALUES ('20260203_021428_initial', 1);
```

**Importante**: Cambia `20260203_021428_initial` por el nombre exacto de tu migración si es diferente.

### 4. Verificar

```sql
SELECT * FROM payload_migrations ORDER BY created_at DESC;
```

### 5. Salir de psql

```
\q
```

### 6. Verificar con Payload

```bash
pnpm migrate:status
```

## 🎯 ¿Por Qué Hacemos Esto?

Cuando usas `push: true` en desarrollo, Payload sincroniza automáticamente tu esquema con la base de datos sin crear migraciones. Esto es perfecto para desarrollo rápido.

Sin embargo, para producción necesitas usar migraciones. El problema es que si creas una migración inicial ahora, intentará crear tablas que ya existen en tu base de datos local.

**Solución**: Marcamos la migración inicial como "ya ejecutada" en desarrollo, para que:
- ✅ La base de datos local no se vea afectada
- ✅ La migración esté lista para ejecutarse en producción
- ✅ El estado de migraciones esté sincronizado

## 🚀 En Producción

En producción, la migración se ejecutará normalmente porque la base de datos estará vacía:

1. Coolify ejecuta `pnpm ci`
2. Esto ejecuta `payload migrate`
3. La migración `20260203_021428_initial` se ejecuta y crea todas las tablas
4. La app inicia correctamente

## 🔍 Troubleshooting

### Error: "relation payload_migrations does not exist"

**Causa**: La tabla de migraciones no existe.

**Solución**: Ejecuta la app una vez en desarrollo para que Payload la cree:
```bash
pnpm dev
# Espera que inicie, luego Ctrl+C
```

### Error: "duplicate key value violates unique constraint"

**Causa**: La migración ya está insertada.

**Solución**: Verifica con:
```bash
pnpm migrate:status
```

Si ya está marcada como ejecutada, no necesitas hacer nada más.

### La migración sigue apareciendo como "No" ejecutada

**Causa**: El nombre de la migración no coincide.

**Solución**:
1. Verifica el nombre exacto en `src/migrations/`
2. Verifica lo que insertaste en la tabla:
   ```sql
   SELECT * FROM payload_migrations;
   ```
3. Si no coincide, elimina e inserta de nuevo:
   ```sql
   DELETE FROM payload_migrations WHERE name = 'nombre-incorrecto';
   INSERT INTO payload_migrations (name, batch) VALUES ('nombre-correcto', 1);
   ```

## 📚 Comandos Útiles

```bash
# Ver estado de migraciones
pnpm migrate:status

# Crear nueva migración (después de cambios en el schema)
pnpm migrate:create nombre-de-la-migracion

# Ejecutar migraciones pendientes
pnpm migrate

# Ver tabla de migraciones en la DB
psql "$DATABASE_URL" -c "SELECT * FROM payload_migrations;"
```

---

✅ **Resultado Final**: Tu migración inicial está marcada como ejecutada en desarrollo, y está lista para ejecutarse en producción.
