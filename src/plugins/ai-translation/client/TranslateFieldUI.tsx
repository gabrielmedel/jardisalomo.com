'use client'

import { useLocale, useDocumentInfo, useConfig } from '@payloadcms/ui'
import { TranslateFieldButton } from './TranslateFieldButton'
import styles from './TranslateFieldButton.module.scss'

interface TranslateFieldUIProps {
  // Path del campo UI (ej: "items.0.translate_text")
  // Payload proporciona esto automáticamente
  path?: string
  field?: {
    custom?: {
      translateFieldPath?: string
    }
  }
}

/**
 * Extrae el índice del array del path del campo UI
 * Ej: "layout.0.translate_richText" -> extrae "0" de "layout"
 * Ej: "hero.links.2.translate_label" -> extrae "2" de "hero.links"
 */
function extractArrayIndex(uiFieldPath: string): { arrayPath: string; index: string } | null {
  // Buscar patrones como "something.0.translate_" o "something.12.translate_"
  const match = uiFieldPath.match(/^(.+)\.(\d+)\.translate_/)
  if (match) {
    return { arrayPath: match[1], index: match[2] }
  }
  return null
}

/**
 * Resuelve el path real del campo a traducir
 * Reemplaza wildcards (*) con el índice real basado en el path del UI field
 * 
 * Ej: translateFieldPath="layout.*.richText", uiPath="layout.0.translate_richText"
 *     -> Resultado: "layout.0.richText"
 */
function resolveFieldPath(translateFieldPath: string, uiFieldPath?: string): string {
  if (!translateFieldPath.includes('*') || !uiFieldPath) {
    return translateFieldPath
  }

  const arrayInfo = extractArrayIndex(uiFieldPath)
  if (!arrayInfo) {
    return translateFieldPath
  }

  // Reemplazar el primer * con el índice encontrado
  return translateFieldPath.replace('*', arrayInfo.index)
}

/**
 * Campo UI que muestra un botón para traducir el campo especificado
 * Se coloca como un campo UI después del campo que se quiere traducir
 * 
 * Uso en config:
 * {
 *   name: 'translateTitle',
 *   type: 'ui',
 *   admin: {
 *     components: {
 *       Field: '@/plugins/ai-translation/client/TranslateFieldUI',
 *     },
 *     custom: {
 *       translateFieldPath: 'title',
 *     },
 *   },
 * }
 * 
 * Para arrays, usa wildcards:
 * {
 *   name: 'translate_richText',
 *   type: 'ui',
 *   admin: {
 *     components: {
 *       Field: '@/plugins/ai-translation/client/TranslateFieldUI',
 *     },
 *     custom: {
 *       translateFieldPath: 'layout.*.richText', // El * se reemplaza automáticamente
 *     },
 *   },
 * }
 */
const TranslateFieldUI = ({ path, field }: TranslateFieldUIProps) => {
  const { code: currentLocale } = useLocale()
  const { id, globalSlug } = useDocumentInfo()
  const { config } = useConfig()

  const defaultLocale =
    config.localization && typeof config.localization !== 'boolean'
      ? config.localization.defaultLocale
      : undefined

  // Obtener el path configurado del campo a traducir
  const configuredPath = field?.custom?.translateFieldPath

  // No mostrar si no hay path configurado
  if (!configuredPath) {
    return null
  }

  // Resolver el path real (reemplazar wildcards con índices)
  const resolvedPath = resolveFieldPath(configuredPath, path)

  // No mostrar si estamos en el idioma por defecto, o no hay documento
  if (!defaultLocale || currentLocale === defaultLocale || (!id && !globalSlug)) {
    return null
  }

  return (
    <div className={styles.translateFieldWrapper}>
      <TranslateFieldButton fieldPath={resolvedPath} label="Traducir" />
    </div>
  )
}

export default TranslateFieldUI
