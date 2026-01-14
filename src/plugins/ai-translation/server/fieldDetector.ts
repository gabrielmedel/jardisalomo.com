import type { Field, CollectionConfig, GlobalConfig } from 'payload'
import { FieldAffectingData } from 'payload'
import {
  fieldAffectsData,
  fieldHasSubFields,
  fieldIsArrayType,
  fieldIsBlockType,
} from 'payload/shared'

export interface LocalizedFieldInfo {
  path: string
  type: string
  field: FieldAffectingData
}

/**
 * Obtiene todos los campos localizados de una collection/global
 * Filtra según la configuración del plugin (si existe)
 */
export function getLocalizedFields(
  config: CollectionConfig | GlobalConfig,
  allowedFields?: string[],
): LocalizedFieldInfo[] {
  const localizedFields: LocalizedFieldInfo[] = []

  function traverseFields(fields: Field[], pathPrefix = '') {
    for (const field of fields) {
      // Procesar tabs (no afectan datos pero contienen campos)
      if (field.type === 'tabs' && 'tabs' in field) {
        for (const tab of field.tabs as any[]) {
          if ('fields' in tab) {
            traverseFields(tab.fields, pathPrefix)
          }
        }
        continue
      }

      // Solo procesar campos que afectan datos
      if (!fieldAffectsData(field)) continue

      const fieldPath = pathPrefix ? `${pathPrefix}.${field.name}` : field.name

      // Si el campo es localizado
      if ('localized' in field && field.localized) {
        // Si hay allowedFields, verificar si está permitido
        if (!allowedFields || allowedFields.includes(fieldPath)) {
          localizedFields.push({
            path: fieldPath,
            type: field.type,
            field,
          })
        }
      }

      // Procesar campos con sub-fields
      if (fieldHasSubFields(field)) {
        traverseFields(field.fields, fieldPath)
      }

      // Procesar arrays
      if (fieldIsArrayType(field)) {
        traverseFields(field.fields, fieldPath)
      }

      // Procesar blocks
      if (fieldIsBlockType(field)) {
        for (const block of field.blocks) {
          traverseFields(block.fields, `${fieldPath}.${block.slug}`)
        }
      }
    }
  }

  traverseFields(config.fields)
  return localizedFields
}

/**
 * Extrae el valor de un campo desde un documento usando path
 */
export function getFieldValue(doc: any, fieldPath: string): any {
  const parts = fieldPath.split('.')
  let value = doc

  for (const part of parts) {
    if (value == null) return undefined
    value = value[part]
  }

  return value
}

/**
 * Establece el valor de un campo en un documento usando path
 */
export function setFieldValue(doc: any, fieldPath: string, value: any): void {
  const parts = fieldPath.split('.')
  const lastPart = parts.pop()!
  let current = doc

  for (const part of parts) {
    if (!(part in current)) {
      current[part] = {}
    }
    current = current[part]
  }

  current[lastPart] = value
}
