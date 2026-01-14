'use client'

import { useState } from 'react'
import { useConfig, useSelection, Button } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'

export default function BulkTranslateAction() {
  const [isTranslating, setIsTranslating] = useState(false)
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

  const handleBulkTranslate = async () => {
    // Selector de idioma destino
    const localeOptions = availableLocales
      .filter((l: any) => {
        const code = typeof l === 'string' ? l : l.code
        return code !== defaultLocale
      })
      .map((l: any) => (typeof l === 'string' ? l : l.code))
      .join(', ')

    const targetLocale = prompt(
      `Traducir ${selectedIds.length} documento(s) a qué idioma? (${localeOptions})`,
    )

    if (!targetLocale || targetLocale === defaultLocale) {
      return
    }

    if (
      !confirm(
        `¿Traducir ${selectedIds.length} documento(s) de ${defaultLocale} a ${targetLocale}?`,
      )
    ) {
      return
    }

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

      alert('Traducción completada exitosamente')
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
    <div style={{ padding: '1rem', borderBottom: '1px solid var(--theme-elevation-200)' }}>
      <Button
        onClick={handleBulkTranslate}
        disabled={isTranslating}
        buttonStyle="primary"
        icon="translate"
        size="small"
      >
        {isTranslating ? 'Traduciendo...' : `Traducir ${selectedIds.length} documento(s)`}
      </Button>
    </div>
  )
}
