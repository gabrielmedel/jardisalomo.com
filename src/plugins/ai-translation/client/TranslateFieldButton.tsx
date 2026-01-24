'use client'

import { useState } from 'react'
import { useLocale, useDocumentInfo, useConfig, useField } from '@payloadcms/ui'
import styles from './TranslateFieldButton.module.scss'

interface TranslateFieldButtonProps {
  // El path del campo a traducir (ej: 'title', 'hero.richText', 'layout.0.richText')
  fieldPath: string
  // Label opcional para el botón
  label?: string
}

/**
 * Botón pequeño para traducir un campo específico
 * Se puede usar como campo UI o dentro de un Label component
 */
export const TranslateFieldButton = ({ fieldPath, label }: TranslateFieldButtonProps) => {
  const [isTranslating, setIsTranslating] = useState(false)
  const { code: currentLocale } = useLocale()
  const { id, collectionSlug, globalSlug } = useDocumentInfo()
  const { config } = useConfig()

  const defaultLocale =
    config.localization && typeof config.localization !== 'boolean'
      ? config.localization.defaultLocale
      : undefined

  // No mostrar si estamos en el idioma por defecto
  if (!defaultLocale || currentLocale === defaultLocale) {
    return null
  }

  const handleTranslate = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isTranslating) return

    setIsTranslating(true)

    try {
      const response = await fetch('/api/translate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: collectionSlug,
          global: globalSlug,
          ...(id ? { id } : {}),
          fromLocale: defaultLocale,
          toLocale: currentLocale,
          fields: [fieldPath], // Solo traducir este campo
        }),
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      // Recargar para ver los cambios
      globalThis.location.reload()
    } catch (error) {
      console.error('Translation error:', error)
      alert('Error al traducir el campo')
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={isTranslating}
      className={styles.translateFieldButton}
      title={`Traducir desde ${defaultLocale}`}
    >
      {isTranslating ? (
        <span className={styles.spinner} />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 8 6 6" />
          <path d="m4 14 6-6 2-3" />
          <path d="M2 5h12" />
          <path d="M7 2h1" />
          <path d="m22 22-5-10-5 10" />
          <path d="M14 18h6" />
        </svg>
      )}
      {label && <span className={styles.label}>{label}</span>}
    </button>
  )
}

/**
 * HOC para crear un Label con botón de traducir integrado
 * Uso: labelWithTranslate('hero.richText')
 */
export const createTranslatableLabel = (fieldPath: string) => {
  const TranslatableLabel = ({ label }: { label: string }) => {
    return (
      <div className={styles.translatableLabel}>
        <span>{label}</span>
        <TranslateFieldButton fieldPath={fieldPath} />
      </div>
    )
  }
  TranslatableLabel.displayName = `TranslatableLabel_${fieldPath}`
  return TranslatableLabel
}

export default TranslateFieldButton
