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
 * Traduce recursivamente un documento siguiendo su estructura real
 */
async function translateDocumentRecursive(
  sourceData: any,
  targetData: any,
  fields: Field[],
  translationService: TranslationService,
  fromLocale: string,
  toLocale: string,
  allowedFields?: string[],
  pathPrefix = '',
): Promise<any> {
  const result = { ...targetData }

  for (const field of fields) {
    // Manejar tabs
    if (field.type === 'tabs' && 'tabs' in field) {
      for (const tab of field.tabs as any[]) {
        if ('fields' in tab) {
          const tabResult = await translateDocumentRecursive(
            sourceData,
            result,
            tab.fields,
            translationService,
            fromLocale,
            toLocale,
            allowedFields,
            pathPrefix,
          )
          Object.assign(result, tabResult)
        }
      }
      continue
    }

    if (!fieldAffectsData(field)) continue

    const fieldPath = pathPrefix ? `${pathPrefix}.${field.name}` : field.name
    const sourceValue = sourceData?.[field.name]
    const targetValue = result[field.name]

    // Si el campo es localizado, traducir
    if ('localized' in field && field.localized && sourceValue != null) {
      if (!allowedFields || allowedFields.includes(fieldPath)) {
        result[field.name] = await translationService.translateFieldValue(
          sourceValue,
          field.type,
          fromLocale,
          toLocale,
        )
      }
      continue
    }

    // Procesar campos con sub-fields (group, etc)
    if (fieldHasSubFields(field) && sourceValue != null) {
      result[field.name] = await translateDocumentRecursive(
        sourceValue,
        targetValue || {},
        field.fields,
        translationService,
        fromLocale,
        toLocale,
        allowedFields,
        fieldPath,
      )
      continue
    }

    // Procesar arrays
    if (fieldIsArrayType(field) && Array.isArray(sourceValue)) {
      result[field.name] = await Promise.all(
        sourceValue.map(async (item, index) => {
          const targetItem = Array.isArray(targetValue) ? targetValue[index] : item
          return await translateDocumentRecursive(
            item,
            targetItem || {},
            field.fields,
            translationService,
            fromLocale,
            toLocale,
            allowedFields,
            `${fieldPath}[${index}]`,
          )
        }),
      )
      continue
    }

    // Procesar blocks (son arrays con blockType)
    if (fieldIsBlockType(field) && Array.isArray(sourceValue)) {
      result[field.name] = await Promise.all(
        sourceValue.map(async (item, index) => {
          const blockType = item.blockType
          const blockConfig = field.blocks.find((b: any) => b.slug === blockType)
          if (!blockConfig) return item

          const targetItem = Array.isArray(targetValue) ? targetValue[index] : item
          const translated = await translateDocumentRecursive(
            item,
            targetItem || {},
            blockConfig.fields,
            translationService,
            fromLocale,
            toLocale,
            allowedFields,
            `${fieldPath}[${index}]`,
          )
          return { ...translated, blockType }
        }),
      )
      continue
    }
  }

  return result
}

/**
 * Traduce un documento completo de un idioma a otro
 */
export async function translateDocument(
  payload: Payload,
  config: AITranslationPluginConfig,
  translationService: TranslationService,
  options: {
    collection?: string
    global?: string
    id: string
    fromLocale: string
    toLocale: string
  },
): Promise<void> {
  const { collection, global, id, fromLocale, toLocale } = options

  // Obtener configuración de la collection/global
  let entityConfig
  if (collection) {
    entityConfig = payload.config.collections?.find((c) => c.slug === collection)
  } else if (global) {
    entityConfig = payload.config.globals?.find((g) => g.slug === global)
  }

  if (!entityConfig) {
    throw new Error(`Collection or global not found`)
  }

  // Obtener campos permitidos para traducir (si se especificaron)
  const allowedFields = config.fields?.[collection || global!]

  // Obtener documento en el idioma origen con depth: 2 para obtener bloques completos
  const sourceDoc = collection
    ? await payload.findByID({
        collection: collection as any,
        id,
        locale: fromLocale as any,
        depth: 2, // Necesario para obtener bloques y relaciones anidadas
        draft: false,
      })
    : await payload.findGlobal({
        slug: global! as any,
        locale: fromLocale as any,
        depth: 2,
      })

  // Obtener documento en el idioma destino (o usar origen como base)
  let targetDoc
  try {
    targetDoc = collection
      ? await payload.findByID({
          collection: collection as any,
          id,
          locale: toLocale as any,
          depth: 2, // Mismo depth para mantener estructura
          draft: false,
        })
      : await payload.findGlobal({
          slug: global! as any,
          locale: toLocale as any,
          depth: 2,
        })
  } catch (e) {
    // Si no existe en el locale destino, usar el documento origen como base
    targetDoc = { ...sourceDoc }
  }

  // Traducir recursivamente todo el documento
  const updateData = await translateDocumentRecursive(
    sourceDoc,
    targetDoc,
    entityConfig.fields,
    translationService,
    fromLocale,
    toLocale,
    allowedFields,
  )

  // Limpiar campos de sistema que no deben enviarse en el update
  delete updateData.id
  delete updateData.createdAt
  delete updateData.updatedAt

  // Actualizar documento en el idioma destino
  if (collection) {
    await payload.update({
      collection: collection as any,
      id,
      data: updateData,
      locale: toLocale as any,
      depth: 2, // Mantener consistencia con las queries anteriores
      draft: false,
    })
  } else if (global) {
    await payload.updateGlobal({
      slug: global as any,
      data: updateData,
      locale: toLocale as any,
      depth: 2,
    })
  }
}
