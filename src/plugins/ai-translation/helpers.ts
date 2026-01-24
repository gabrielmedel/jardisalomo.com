import type { Field, UIField } from 'payload'

/**
 * Crea un campo UI con botón de traducción para un campo específico
 * 
 * @param fieldPath - El path del campo a traducir (ej: 'title', 'hero.richText')
 * @returns Un campo UI configurado con el botón de traducción
 * 
 * @example
 * // En la definición de fields de una collection:
 * fields: [
 *   { name: 'title', type: 'text', localized: true },
 *   translateFieldButton('title'),
 *   
 *   { name: 'description', type: 'textarea', localized: true },
 *   translateFieldButton('description'),
 * ]
 * 
 * @example
 * // Dentro de un grupo:
 * {
 *   name: 'hero',
 *   type: 'group',
 *   fields: [
 *     { name: 'richText', type: 'richText', localized: true },
 *     translateFieldButton('hero.richText'), // Usa el path completo
 *   ]
 * }
 * 
 * @example
 * // Dentro de un array (usa el índice dinámico):
 * // Para arrays, el path será relativo al item actual
 * {
 *   name: 'items',
 *   type: 'array',
 *   fields: [
 *     { name: 'text', type: 'text', localized: true },
 *     // El componente detectará el índice automáticamente
 *     translateFieldButton('items.*.text'),
 *   ]
 * }
 */
export function translateFieldButton(fieldPath: string): UIField {
  // Generar un nombre único basado en el path
  const safeName = fieldPath.replace(/[.\*\[\]]/g, '_')
  
  return {
    name: `translate_${safeName}`,
    type: 'ui',
    admin: {
      components: {
        Field: '@/plugins/ai-translation/client/TranslateFieldUI',
      },
      custom: {
        translateFieldPath: fieldPath,
      },
    },
  }
}

/**
 * Envuelve un array de fields añadiendo botones de traducción después de cada campo localizado
 * 
 * @param fields - Array de fields a procesar
 * @param pathPrefix - Prefijo de path para campos anidados
 * @returns Array de fields con botones de traducción añadidos
 * 
 * @example
 * // Automáticamente añade botones después de cada campo localizado:
 * fields: withTranslateButtons([
 *   { name: 'title', type: 'text', localized: true },
 *   { name: 'slug', type: 'text' }, // No localizado, no tendrá botón
 *   { name: 'description', type: 'textarea', localized: true },
 * ])
 */
export function withTranslateButtons(fields: Field[], pathPrefix = ''): Field[] {
  const result: Field[] = []
  
  for (const field of fields) {
    result.push(field)
    
    // Solo añadir botón para campos localizados que afectan datos
    if ('name' in field && 'localized' in field && field.localized) {
      const fieldPath = pathPrefix ? `${pathPrefix}.${field.name}` : field.name
      result.push(translateFieldButton(fieldPath))
    }
  }
  
  return result
}

/**
 * Helper para crear un Label component con botón de traducción integrado
 * Útil cuando quieres el botón junto al label en lugar de como campo separado
 * 
 * @param fieldPath - El path del campo a traducir
 * @returns Path al componente de label con el fieldPath como prop
 * 
 * @example
 * {
 *   name: 'title',
 *   type: 'text',
 *   localized: true,
 *   admin: {
 *     components: {
 *       Label: translatableLabel('title'),
 *     }
 *   }
 * }
 */
export function translatableLabelConfig(fieldPath: string): {
  path: string
  clientProps: { fieldPath: string }
} {
  return {
    path: '@/plugins/ai-translation/client/TranslatableLabel',
    clientProps: { fieldPath },
  }
}
