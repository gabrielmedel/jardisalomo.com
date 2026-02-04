# Menú del Mes - Sistema de Gestión

## Descripción

Sistema para gestionar el menú del mes del restaurante de forma sencilla. Similar al menú diario, permite subir un archivo (PDF, imagen, etc.) que se reemplaza automáticamente al subir uno nuevo, y obtener una URL pública para compartir.

## Ubicación

Accede desde el panel de administración de Payload CMS:

```
/admin/globals/monthly-menu
```

## Cómo Usar

### 1. Subir el Menú del Mes

1. Inicia sesión en el panel de administración
2. Ve a **Globals > Monthly Menu**
3. Arrastra el archivo del menú o haz clic para seleccionarlo
4. El sistema subirá el archivo automáticamente

### 2. Obtener la URL Pública

Una vez subido el archivo:

1. La URL pública se muestra automáticamente en el campo de texto
2. Haz clic en **"Copiar"** para copiar la URL al portapapeles
3. Pega esta URL donde necesites usar el enlace de descarga

### 3. Usar la URL en el Sitio Web

Para agregar un enlace de descarga del menú en cualquier parte del sitio:

#### En un Hero Block:

1. Ve a la página donde quieres agregar el enlace
2. En el bloque Hero, agrega un nuevo link en `links` o `linkGroup`
3. Configura el link:
   - **Type:** Custom URL
   - **URL:** Pega la URL copiada del menú mensual
   - **Label:** "Descargar Menú del Mes" (o el texto que prefieras)
   - **Appearance:** Selecciona el estilo del botón

#### En un CallToAction Block:

Similar al Hero, usa el campo `link` y pega la URL del menú mensual.

### 4. Reemplazar el Menú

Cuando necesites actualizar el menú:

1. Ve a **Globals > Monthly Menu**
2. Haz clic en **"Reemplazar archivo"**
3. Selecciona el nuevo archivo
4. El archivo anterior se eliminará automáticamente
5. La URL permanece igual, pero ahora apunta al nuevo archivo

## Diferencias con el Menú Diario

- **Menú Diario** (`/admin/globals/daily-menu`): Para el menú que cambia cada día
- **Menú del Mes** (`/admin/globals/monthly-menu`): Para el menú mensual o de temporada

Ambos son independientes y pueden coexistir en el sitio web.

## Características

- ✅ **Automático:** El archivo anterior se elimina al subir uno nuevo
- ✅ **Flexible:** Acepta cualquier formato (PDF, PNG, JPG, etc.)
- ✅ **Seguro:** Solo usuarios autenticados pueden gestionar el menú
- ✅ **Público:** La URL de descarga es accesible sin autenticación
- ✅ **Compatible:** Funciona con S3/MinIO en producción y local en desarrollo
- ✅ **Multiidioma:** Interfaz traducida en inglés, español y catalán

## Formatos Recomendados

- **PDF:** Ideal para menús con múltiples páginas
- **PNG/JPG:** Ideal para menús de una sola página con diseño visual
- **WebP:** Formato moderno con buena compresión

## Ejemplo de Uso

Puedes tener ambos menús activos simultáneamente:

```typescript
// En un Hero block
links: [
  {
    type: 'custom',
    url: 'https://tudominio.com/media/menu-diario.pdf',
    label: 'Menú del Día',
    appearance: 'primary'
  },
  {
    type: 'custom',
    url: 'https://tudominio.com/media/menu-mes.pdf',
    label: 'Menú del Mes',
    appearance: 'secondary'
  }
]
```

## Notas Técnicas

### Arquitectura

- **Global:** `monthly-menu` en Payload CMS
- **Collection:** Usa la colección `media` existente para almacenar archivos
- **Storage:** S3/MinIO en producción, sistema de archivos local en desarrollo
- **Vista Personalizada:** Componente React con UI personalizada
- **Estilos:** Reutiliza los estilos del componente de menú diario

### Limpieza Automática

El sistema incluye un hook `afterChange` que automáticamente:
1. Detecta cuando se sube un nuevo archivo
2. Elimina el archivo anterior de la colección Media
3. Libera espacio de almacenamiento

## Solución de Problemas

Ver la documentación principal de menús: [DAILY-MENU.md](./DAILY-MENU.md)

Los problemas y soluciones son los mismos para ambos tipos de menú.
