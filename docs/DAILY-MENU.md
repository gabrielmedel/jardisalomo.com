# Menú Diario - Sistema de Gestión

## Descripción

Sistema para gestionar el menú diario del restaurante de forma sencilla. Permite subir un archivo (PDF, imagen, etc.) que se reemplaza automáticamente al subir uno nuevo, y obtener una URL pública para compartir.

## Ubicación

Accede desde el panel de administración de Payload CMS:

```
/admin/globals/daily-menu
```

## Cómo Usar

### 1. Subir el Menú Diario

1. Inicia sesión en el panel de administración
2. Ve a **Globals > Daily Menu**
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
   - **URL:** Pega la URL copiada del menú diario
   - **Label:** "Descargar Menú" (o el texto que prefieras)
   - **Appearance:** Selecciona el estilo del botón

#### En un CallToAction Block:

Similar al Hero, usa el campo `link` y pega la URL del menú diario.

#### En cualquier otro bloque con campos de Link:

Todos los bloques que tengan campos `link` o `linkGroup` pueden usar la URL del menú diario.

### 4. Reemplazar el Menú

Cuando necesites actualizar el menú:

1. Ve a **Globals > Daily Menu**
2. Haz clic en **"Reemplazar archivo"**
3. Selecciona el nuevo archivo
4. El archivo anterior se eliminará automáticamente
5. La URL permanece igual, pero ahora apunta al nuevo archivo

## Características

- ✅ **Automático:** El archivo anterior se elimina al subir uno nuevo
- ✅ **Flexible:** Acepta cualquier formato (PDF, PNG, JPG, etc.)
- ✅ **Seguro:** Solo usuarios autenticados pueden gestionar el menú
- ✅ **Público:** La URL de descarga es accesible sin autenticación
- ✅ **Compatible:** Funciona con S3/MinIO en producción y local en desarrollo

## Formatos Recomendados

- **PDF:** Ideal para menús con múltiples páginas
- **PNG/JPG:** Ideal para menús de una sola página con diseño visual
- **WebP:** Formato moderno con buena compresión

## Notas Técnicas

### Arquitectura

- **Global:** `daily-menu` en Payload CMS
- **Collection:** Usa la colección `media` existente para almacenar archivos
- **Storage:** S3/MinIO en producción, sistema de archivos local en desarrollo
- **Vista Personalizada:** Componente React con UI personalizada

### Limpieza Automática

El sistema incluye un hook `afterChange` que automáticamente:
1. Detecta cuando se sube un nuevo archivo
2. Elimina el archivo anterior de la colección Media
3. Libera espacio de almacenamiento

### URL Pública

La URL generada:
- En producción: `https://minio-api.tudominio.com/jardisalomo-media/archivo.pdf`
- En desarrollo: `http://localhost:3000/media/archivo.pdf`

## Solución de Problemas

### No puedo subir archivos

- Verifica que hayas iniciado sesión
- Comprueba que tengas permisos de usuario autenticado
- Revisa el tamaño del archivo (límite configurado en Payload)

### La URL no funciona

- Verifica que el archivo se haya subido correctamente
- Comprueba la configuración de S3/MinIO en producción
- Asegúrate de que el bucket sea público (solo lectura)

### El archivo anterior no se elimina

- Revisa los logs del servidor para errores
- El hook `afterChange` intentará eliminar el archivo anterior
- Si falla, el error se registra pero no interrumpe el proceso

## Mantenimiento

### Verificar archivos huérfanos

Si por alguna razón quedaran archivos antiguos sin eliminar:

1. Ve a **Collections > Media**
2. Busca archivos de menús anteriores
3. Elimínalos manualmente si es necesario

### Backup del menú actual

El archivo actual siempre está disponible en:
- **Producción:** S3/MinIO bucket
- **Desarrollo:** `public/media/` directory

## Roadmap Futuro (Opcional)

Posibles mejoras:

- [ ] Historial de menús anteriores
- [ ] Preview del PDF en el admin panel
- [ ] Programar menús para fechas específicas
- [ ] Notificaciones cuando se actualiza el menú
- [ ] Multi-idioma (menú diferente por locale)
