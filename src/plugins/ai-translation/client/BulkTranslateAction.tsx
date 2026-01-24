'use client'

import { useState } from 'react'
import { useConfig, useSelection, Button } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { CustomModal } from './CustomModal'
import styles from './BulkTranslateAction.module.scss'

export default function BulkTranslateAction() {
  const [isTranslating, setIsTranslating] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [targetLocale, setTargetLocale] = useState('')
  const { config } = useConfig()
  const { selectedIDs } = useSelection()
  const pathname = usePathname()

  // Extraer collection slug del pathname (/admin/collections/pages -> pages)
  const collectionSlug = pathname?.split('/collections/')?.[1]?.split('/')?.[0]

  const defaultLocale =
    config.localization && typeof config.localization !== 'boolean'
      ? config.localization.defaultLocale
      : undefined
  const availableLocales =
    config.localization && typeof config.localization !== 'boolean'
      ? config.localization.locales
      : []

  // Usar directamente selectedIDs que ya es un array
  const selectedIds = selectedIDs || []

  // No mostrar nada si no hay elementos seleccionados
  if (selectedIds.length === 0) {
    return null
  }

  // Filtrar locales disponibles (excluir el default)
  const targetLocales = availableLocales
    .filter((l: any) => {
      const code = typeof l === 'string' ? l : l.code
      return code !== defaultLocale
    })
    .map((l: any) => {
      if (typeof l === 'string') {
        return { code: l, label: l }
      }
      return { code: l.code, label: l.label || l.code }
    })

  const handleOpenModal = () => {
    setTargetLocale(targetLocales[0]?.code || '')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleBulkTranslate = async () => {
    if (!targetLocale || targetLocale === defaultLocale) {
      return
    }

    setIsModalOpen(false)
    setIsTranslating(true)

    try {
      const response = await fetch('/api/translate-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: collectionSlug,
          ids: selectedIds,
          fromLocale: defaultLocale,
          toLocale: targetLocale,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Bulk translation failed')
      }

      window.location.reload()
    } catch (error) {
      alert(
        `Error en la traducción: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      )
      console.error(error)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <>
      <div className={styles.buttonWrapper}>
        <Button
          onClick={handleOpenModal}
          disabled={isTranslating}
          buttonStyle="primary"
          icon="translate"
          size="small"
        >
          {isTranslating ? 'Traduciendo...' : `Traducir ${selectedIds.length} documento(s)`}
        </Button>
      </div>

      <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`Traducir ${selectedIds.length} documento(s)`}
      >
        <div className={styles.formGroup}>
          <label htmlFor="target-locale" className={styles.label}>
            Idioma destino
          </label>
          <select
            id="target-locale"
            value={targetLocale}
            onChange={(e) => setTargetLocale(e.target.value)}
            className={styles.select}
          >
            {targetLocales.map((locale) => (
              <option key={locale.code} value={locale.code}>
                {locale.label}
              </option>
            ))}
          </select>
          <p className={styles.hint}>
            Los documentos se traducirán de <strong>{defaultLocale}</strong> a{' '}
            <strong>{targetLocale}</strong>
          </p>
        </div>

        <div className={styles.actions}>
          <Button onClick={handleCloseModal} buttonStyle="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleBulkTranslate}
            disabled={isTranslating || !targetLocale}
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
