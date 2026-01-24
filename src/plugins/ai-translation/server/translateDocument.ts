import type { Payload, Field } from 'payload'
import type { AITranslationPluginConfig } from '../types'
import { TranslationService } from './translateService'
import {
  fieldAffectsData,
  fieldHasSubFields,
  fieldIsArrayType,
  fieldIsBlockType,
} from 'payload/shared'

/**
 * Verifica si un path está permitido para traducción
 * Soporta wildcards: "layout.*.richText", "hero.links.*.link.label"
 */
function isPathAllowed(path: string, allowedFields?: string[]): boolean {
  if (!allowedFields) return true

  return allowedFields.some((pattern) => {
    const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '\\d+')
    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(path)
  })
}

/**
 * Establece un valor en un objeto usando un path con puntos
 * Modifica el objeto in-place
 * Ej: setByPath(obj, "faqs.0.question", "value")
 */
function setByPath(obj: unknown, path: string, value: unknown): void {
  const parts = path.split('.')
  let current: unknown = obj

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    const nextPart = parts[i + 1]
    const isCurrentIndex = /^\d+$/.test(part)
    const isNextIndex = /^\d+$/.test(nextPart)

    const key = isCurrentIndex ? parseInt(part, 10) : part

    if (current === null || current === undefined || typeof current !== 'object') {
      return
    }

    const currentObj = current as Record<string | number, unknown>

    // Si el siguiente nivel no existe, crearlo
    if (currentObj[key] === undefined || currentObj[key] === null) {
      currentObj[key] = isNextIndex ? [] : {}
    }

    current = currentObj[key]
  }

  // Establecer el valor final
  const lastPart = parts[parts.length - 1]
  const lastKey = /^\d+$/.test(lastPart) ? parseInt(lastPart, 10) : lastPart

  if (current !== null && current !== undefined && typeof current === 'object') {
    ;(current as Record<string | number, unknown>)[lastKey] = value
  }
}

/**
 * Extrae todos los campos localizados de un documento con sus paths y valores
 */
function extractLocalizedFields(
  data: Record<string, unknown>,
  fields: Field[],
  pathPrefix = '',
): Map<string, { value: unknown; type: string }> {
  const result = new Map<string, { value: unknown; type: string }>()

  for (const field of fields) {
    // Procesar tabs
    if (field.type === 'tabs' && 'tabs' in field) {
      for (const tab of field.tabs) {
        if ('fields' in tab) {
          const tabValues = extractLocalizedFields(data, tab.fields, pathPrefix)
          tabValues.forEach((v, k) => result.set(k, v))
        }
      }
      continue
    }

    // Procesar rows
    if (field.type === 'row' && 'fields' in field) {
      const rowValues = extractLocalizedFields(data, field.fields, pathPrefix)
      rowValues.forEach((v, k) => result.set(k, v))
      continue
    }

    // Procesar collapsibles
    if (field.type === 'collapsible' && 'fields' in field) {
      const values = extractLocalizedFields(data, field.fields, pathPrefix)
      values.forEach((v, k) => result.set(k, v))
      continue
    }

    if (!fieldAffectsData(field)) continue

    const fieldPath = pathPrefix ? `${pathPrefix}.${field.name}` : field.name
    const value = data?.[field.name]

    if (value === undefined || value === null) continue

    // Campo localizado
    if ('localized' in field && field.localized) {
      // Campos simples traducibles
      if (field.type === 'text' || field.type === 'textarea' || field.type === 'richText') {
        result.set(fieldPath, { value, type: field.type })
        continue
      }

      // Arrays localizados - el array entero es localizado, traducir sus campos de texto
      if (fieldIsArrayType(field) && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item && typeof item === 'object') {
            const itemPath = `${fieldPath}.${index}`
            // Buscar campos de texto dentro del array localizado
            for (const subField of field.fields) {
              if (
                fieldAffectsData(subField) &&
                (subField.type === 'text' ||
                  subField.type === 'textarea' ||
                  subField.type === 'richText')
              ) {
                const subValue = (item as Record<string, unknown>)[subField.name]
                if (subValue !== undefined && subValue !== null) {
                  result.set(`${itemPath}.${subField.name}`, {
                    value: subValue,
                    type: subField.type,
                  })
                }
              }
            }
          }
        })
        continue
      }

      // Blocks localizados
      if (fieldIsBlockType(field) && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item && typeof item === 'object') {
            const blockItem = item as Record<string, unknown>
            const blockType = blockItem.blockType as string
            const blockConfig = field.blocks.find((b) => b.slug === blockType)
            if (blockConfig) {
              const itemPath = `${fieldPath}.${index}`
              for (const subField of blockConfig.fields) {
                if (
                  fieldAffectsData(subField) &&
                  (subField.type === 'text' ||
                    subField.type === 'textarea' ||
                    subField.type === 'richText')
                ) {
                  const subValue = blockItem[subField.name]
                  if (subValue !== undefined && subValue !== null) {
                    result.set(`${itemPath}.${subField.name}`, {
                      value: subValue,
                      type: subField.type,
                    })
                  }
                }
              }
            }
          }
        })
        continue
      }

      // Groups localizados
      if (fieldHasSubFields(field) && typeof value === 'object') {
        const groupValues = extractLocalizedFields(
          value as Record<string, unknown>,
          field.fields,
          fieldPath,
        )
        groupValues.forEach((v, k) => result.set(k, v))
        continue
      }
    }

    // Campo NO localizado pero puede contener campos localizados dentro

    // Arrays no localizados
    if (fieldIsArrayType(field) && Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item && typeof item === 'object') {
          const itemPath = `${fieldPath}.${index}`
          const itemValues = extractLocalizedFields(
            item as Record<string, unknown>,
            field.fields,
            itemPath,
          )
          itemValues.forEach((v, k) => result.set(k, v))
        }
      })
      continue
    }

    // Blocks no localizados
    if (fieldIsBlockType(field) && Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item && typeof item === 'object') {
          const blockItem = item as Record<string, unknown>
          const blockType = blockItem.blockType as string
          const blockConfig = field.blocks.find((b) => b.slug === blockType)
          if (blockConfig) {
            const itemPath = `${fieldPath}.${index}`
            const itemValues = extractLocalizedFields(blockItem, blockConfig.fields, itemPath)
            itemValues.forEach((v, k) => result.set(k, v))
          }
        }
      })
      continue
    }

    // Groups no localizados
    if (fieldHasSubFields(field) && typeof value === 'object') {
      const groupValues = extractLocalizedFields(
        value as Record<string, unknown>,
        field.fields,
        fieldPath,
      )
      groupValues.forEach((v, k) => result.set(k, v))
    }
  }

  return result
}

/**
 * Traduce un documento completo de un idioma a otro
 * Solo traduce campos LOCALIZADOS, preservando toda la estructura existente
 */
export async function translateDocument(
  payload: Payload,
  config: AITranslationPluginConfig,
  translationService: TranslationService,
  options: {
    collection?: string
    global?: string
    id?: string
    fromLocale: string
    toLocale: string
    fields?: string[]
  },
): Promise<void> {
  const { collection, global, id, fromLocale, toLocale, fields: overrideFields } = options

  if (collection && !id) {
    throw new Error('Missing id for collection translation')
  }

  // Obtener configuración de la collection/global
  let entityConfig
  if (collection) {
    entityConfig = payload.config.collections?.find((c) => c.slug === collection)
  } else if (global) {
    entityConfig = payload.config.globals?.find((g) => g.slug === global)
  }

  if (!entityConfig) {
    throw new Error('Collection or global not found')
  }

  const allowedFields = overrideFields ?? config.fields?.[collection || global!]
  const hasDrafts = 'versions' in entityConfig && entityConfig.versions?.drafts

  // 1. Obtener documento en el idioma ORIGEN (de donde traducir)

  const sourceDoc = collection
    ? await payload.findByID({
        collection: collection as any,
        id: id as string,
        locale: fromLocale as any,
        depth: 0,
        ...(hasDrafts ? { draft: true } : {}),
      })
    : await payload.findGlobal({
        slug: global as any,
        locale: fromLocale as any,
        depth: 0,
        ...(hasDrafts ? { draft: true } : {}),
      })

  // 2. Extraer campos localizados del documento origen
  const localizedFields = extractLocalizedFields(
    sourceDoc as unknown as Record<string, unknown>,
    entityConfig.fields,
  )

  console.log(`Found ${localizedFields.size} localized fields:`, Array.from(localizedFields.keys()))

  // 4. Construir objeto de update SOLO con campos traducidos
  // NO enviamos todo el documento, solo los campos que realmente tradujimos
  const updateData: Record<string, unknown> = {}
  const translatedPaths: string[] = []

  for (const [path, { value, type }] of localizedFields) {
    if (!isPathAllowed(path, allowedFields)) {
      continue
    }

    // Traducir el valor
    const translatedValue = await translationService.translateFieldValue(
      value,
      type,
      fromLocale,
      toLocale,
    )

    // Aplicar la traducción al objeto de update
    setByPath(updateData, path, translatedValue)
    translatedPaths.push(path)
  }

  if (translatedPaths.length === 0) {
    console.log('No fields to translate')
    return
  }

  console.log(`Translated ${translatedPaths.length} fields:`, translatedPaths)
  console.log('Update data:', JSON.stringify(updateData, null, 2))

  // 5. Actualizar documento - solo enviamos los campos traducidos

  if (collection) {
    await payload.update({
      collection: collection as any,
      id: id as string,
      data: updateData as any,
      locale: toLocale as any,
      ...(hasDrafts ? { draft: true } : {}),
    })
  } else if (global) {
    await payload.updateGlobal({
      slug: global as any,
      data: updateData as any,
      locale: toLocale as any,
      ...(hasDrafts ? { draft: true } : {}),
    })
  }
}
