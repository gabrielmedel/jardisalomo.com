'use client'

import { useState } from 'react'
import { useLocale, useDocumentInfo, useConfig } from '@payloadcms/ui'
import { Button } from '@payloadcms/ui'

export default function TranslatePageButton() {
  const [isTranslating, setIsTranslating] = useState(false)
  const locale = useLocale()
  const documentInfo = useDocumentInfo()
  const { config } = useConfig()

  const currentLocale = locale?.code
  const { id, collectionSlug, globalSlug } = documentInfo || {}

  const defaultLocale =
    config.localization && typeof config.localization !== 'boolean'
      ? config.localization.defaultLocale
      : undefined

  // DEBUG: siempre mostrar el botón para verificar
  console.log('TranslatePageButton render:', { currentLocale, defaultLocale, id, collectionSlug })

  // Solo mostrar si no estamos en el idioma por defecto
  if (!defaultLocale || currentLocale === defaultLocale || !id) {
    return (
      <div style={{ padding: '1rem', background: '#f0f0f0', marginBottom: '1rem' }}>
        <p style={{ fontSize: '12px', color: '#666' }}>
          Botón de traducción (solo visible en idiomas no por defecto)
        </p>
        <p style={{ fontSize: '10px' }}>
          Current: {currentLocale || 'N/A'}, Default: {defaultLocale || 'N/A'}, ID: {id || 'N/A'}
        </p>
      </div>
    )
  }

  const handleTranslate = async () => {
    if (!confirm(`¿Traducir toda la página de ${defaultLocale} a ${currentLocale}?`)) {
      return
    }

    setIsTranslating(true)
    try {
      const payload = {
        collection: collectionSlug,
        global: globalSlug,
        id: String(id),
        fromLocale: defaultLocale,
        toLocale: currentLocale,
      }

      console.log('Sending translation request:', payload)

      const response = await fetch('/api/translate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      alert('Traducción completada exitosamente')
      // Recargar la página para mostrar las traducciones
      window.location.reload()
    } catch (error) {
      alert('Error al traducir. Por favor intenta de nuevo.')
      console.error(error)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <Button
        onClick={handleTranslate}
        disabled={isTranslating}
        buttonStyle="primary"
        icon="translate"
      >
        {isTranslating ? 'Traduciendo...' : `Traducir desde ${defaultLocale}`}
      </Button>
    </div>
  )
}
