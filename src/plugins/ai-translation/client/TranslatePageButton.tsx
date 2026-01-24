'use client'

import { useState } from 'react'
import { useLocale, useDocumentInfo, useConfig, Button } from '@payloadcms/ui'
import { CustomModal } from './CustomModal'
import styles from './TranslatePageButton.module.scss'

const TranslatePageButton = () => {
  const [isTranslating, setIsTranslating] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sourceLocale, setSourceLocale] = useState('')
  const { code: currentLocale } = useLocale()
  const { id, collectionSlug, globalSlug } = useDocumentInfo()
  const { config } = useConfig()

  const defaultLocale =
    config.localization && typeof config.localization !== 'boolean'
      ? config.localization.defaultLocale
      : undefined

  const availableLocales =
    config.localization && typeof config.localization !== 'boolean'
      ? (config.localization.locales as Array<string | { code: string; label?: string }>)
      : []

  // Solo mostrar si no estamos en el idioma por defecto y hay un documento o global
  if (!defaultLocale || currentLocale === defaultLocale || (!id && !globalSlug)) {
    return null
  }

  // Preparar opciones de idiomas origen (excluir el current)
  const sourceLocales = availableLocales
    .filter((locale) => {
      const code = typeof locale === 'string' ? locale : locale.code
      return code !== currentLocale
    })
    .map((locale) => {
      if (typeof locale === 'string') {
        return { code: locale, label: locale }
      }
      return { code: locale.code, label: locale.label || locale.code }
    })

  const handleOpenModal = () => {
    setSourceLocale(defaultLocale)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleTranslate = async () => {
    if (!sourceLocale) {
      return
    }

    setIsModalOpen(false)
    setIsTranslating(true)

    try {
      const response = await fetch('/api/translate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: collectionSlug,
          global: globalSlug,
          ...(id ? { id } : {}),
          fromLocale: sourceLocale,
          toLocale: currentLocale,
        }),
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      globalThis.location.reload()
    } catch (error) {
      alert('Error al traducir. Por favor intenta de nuevo.')
      console.error(error)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <>
      <div>
        <Button
          onClick={handleOpenModal}
          disabled={isTranslating}
          buttonStyle="secondary"
          icon="translate"
        >
          {isTranslating ? 'Traduciendo...' : 'Traducir página'}
        </Button>
      </div>

      <CustomModal isOpen={isModalOpen} onClose={handleCloseModal} title="Traducir página">
        <div className={styles.formGroup}>
          <label htmlFor="source-locale" className={styles.label}>
            Traducir desde
          </label>
          <select
            id="source-locale"
            value={sourceLocale}
            onChange={(e) => setSourceLocale(e.target.value)}
            className={styles.select}
          >
            {sourceLocales.map((locale) => (
              <option key={locale.code} value={locale.code}>
                {locale.label}
              </option>
            ))}
          </select>
          <p className={styles.hint}>
            La página se traducirá de <strong>{sourceLocale}</strong> a{' '}
            <strong>{currentLocale}</strong>
          </p>
        </div>

        <div className={styles.actions}>
          <Button onClick={handleCloseModal} buttonStyle="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleTranslate}
            disabled={isTranslating || !sourceLocale}
            buttonStyle="primary"
            icon="translate"
          >
            {isTranslating ? 'Traduciendo...' : 'Traducir'}
          </Button>
        </div>
      </CustomModal>
    </>
  )
}

export default TranslatePageButton
