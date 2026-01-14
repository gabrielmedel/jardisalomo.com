import type { Payload } from 'payload'
import type { AITranslationPluginConfig } from '../types'
import { TranslationService } from './translateService'
import { getLocalizedFields, getFieldValue, setFieldValue } from './fieldDetector'

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

  // Obtener campos localizados permitidos
  const allowedFields = config.fields?.[collection || global!]
  const localizedFields = getLocalizedFields(entityConfig, allowedFields)

  if (localizedFields.length === 0) {
    throw new Error('No localized fields found')
  }

  // Obtener documento en el idioma origen
  const sourceDoc = collection
    ? await payload.findByID({
        collection: collection as any,
        id,
        locale: fromLocale as any,
        depth: 0,
      })
    : await payload.findGlobal({
        slug: global! as any,
        locale: fromLocale as any,
        depth: 0,
      })

  // Obtener documento en el idioma destino (o usar origen como base)
  let targetDoc
  try {
    targetDoc = collection
      ? await payload.findByID({
          collection: collection as any,
          id,
          locale: toLocale as any,
          depth: 0,
        })
      : await payload.findGlobal({
          slug: global! as any,
          locale: toLocale as any,
          depth: 0,
        })
  } catch (e) {
    // Si no existe en el locale destino, usar el documento origen como base
    targetDoc = { ...sourceDoc }
  }

  // Traducir cada campo
  const translations: Record<string, any> = {}

  for (const { path, type } of localizedFields) {
    const sourceValue = getFieldValue(sourceDoc, path)

    if (sourceValue != null) {
      const translatedValue = await translationService.translateFieldValue(
        sourceValue,
        type,
        fromLocale,
        toLocale,
      )
      translations[path] = translatedValue
    }
  }

  // Hacer merge de las traducciones sobre el documento destino
  const updateData: any = { ...targetDoc }
  for (const [path, value] of Object.entries(translations)) {
    setFieldValue(updateData, path, value)
  }

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
      depth: 0,
    })
  } else if (global) {
    await payload.updateGlobal({
      slug: global as any,
      data: updateData,
      locale: toLocale as any,
      depth: 0,
    })
  }
}
