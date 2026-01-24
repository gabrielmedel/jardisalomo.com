'use client'

import { useLocale, useDocumentInfo, useConfig } from '@payloadcms/ui'
import { TranslateFieldButton } from './TranslateFieldButton'
import styles from './TranslateFieldButton.module.scss'

interface TranslatableLabelProps {
  label: string
  required?: boolean
  fieldPath: string
}

/**
 * Componente de Label que incluye el label original + botón de traducir
 * 
 * Uso en config de campo:
 * {
 *   name: 'title',
 *   type: 'text',
 *   localized: true,
 *   admin: {
 *     components: {
 *       Label: {
 *         path: '@/plugins/ai-translation/client/TranslatableLabel',
 *         clientProps: { fieldPath: 'title' }
 *       }
 *     }
 *   }
 * }
 */
const TranslatableLabel = ({ label, required, fieldPath }: TranslatableLabelProps) => {
  const { code: currentLocale } = useLocale()
  const { id, globalSlug } = useDocumentInfo()
  const { config } = useConfig()

  const defaultLocale =
    config.localization && typeof config.localization !== 'boolean'
      ? config.localization.defaultLocale
      : undefined

  // Determinar si mostrar el botón
  const showButton =
    defaultLocale && currentLocale !== defaultLocale && (id || globalSlug)

  return (
    <div className={styles.translatableLabel}>
      <span>
        {label}
        {required && <span className={styles.required}> *</span>}
      </span>
      {showButton && <TranslateFieldButton fieldPath={fieldPath} />}
    </div>
  )
}

export default TranslatableLabel
