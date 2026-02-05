'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Button, Banner, useDocumentInfo, useAuth, useTranslation } from '@payloadcms/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import type { Media } from '@/payload-types'
import type { MonthlyMenuTranslationsObject, MonthlyMenuTranslationsKeys } from './translations'
import styles from '../DailyMenuView/DailyMenuView.module.scss'

export const MonthlyMenuView = () => {
  const { globalSlug } = useDocumentInfo()
  const { user } = useAuth()
  const { t } = useTranslation<MonthlyMenuTranslationsObject, MonthlyMenuTranslationsKeys>()
  const [isUploading, setIsUploading] = useState(false)
  const [currentFile, setCurrentFile] = useState<Media | null>(null)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // URL fija para el menú - nunca cambia
  const getFixedMenuUrl = () => {
    if (globalThis.window === undefined) {
      return '/api/menu/monthly'
    }
    return `${globalThis.location.origin}/api/menu/monthly`
  }
  const fixedMenuUrl = getFixedMenuUrl()

  // Cargar el archivo actual
  const loadCurrentFile = useCallback(async () => {
    try {
      const response = await fetch(`/api/globals/${globalSlug}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('No se pudo cargar el menú actual')
      }

      const data = await response.json()

      if (data.menuFile) {
        // Si menuFile es un objeto, ya tenemos el media completo
        if (typeof data.menuFile === 'object') {
          setCurrentFile(data.menuFile as Media)
        } else {
          // Si es un string (ID), necesitamos obtener el media
          const mediaResponse = await fetch(`/api/media/${data.menuFile}`, {
            credentials: 'include',
          })

          if (mediaResponse.ok) {
            const mediaData = await mediaResponse.json()
            setCurrentFile(mediaData)
          }
        }
      }
    } catch (err) {
      console.error('Error loading current file:', err)
    }
  }, [globalSlug])

  // Cargar el archivo cuando se monta el componente
  useEffect(() => {
    void loadCurrentFile()
  }, [loadCurrentFile])

  // Subir archivo
  const handleFileUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      // Subir a la colección Media
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/media', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Error al subir el archivo')
      }

      const uploadedMedia = await uploadResponse.json()

      // Actualizar el Global con la nueva referencia
      const updateResponse = await fetch(`/api/globals/${globalSlug}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menuFile: uploadedMedia.doc.id,
        }),
      })

      if (!updateResponse.ok) {
        throw new Error(t('monthlyMenu:updateError') || 'Error updating menu')
      }

      // Recargar el archivo actual
      await loadCurrentFile()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('monthlyMenu:unknownError') || 'Unknown error',
      )
    } finally {
      setIsUploading(false)
    }
  }

  // Manejar selección de archivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  // Manejar drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  // Copiar URL fija al portapapeles
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fixedMenuUrl).then(() => {
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    })
  }

  // Reemplazar archivo
  const handleReplaceFile = () => {
    fileInputRef.current?.click()
  }

  // Verificar si es imagen
  const isImage = currentFile?.mimeType?.startsWith('image/')

  if (!user) {
    return (
      <div className={styles.container}>
        <Banner type="error">
          <p>{t('monthlyMenu:loginRequired')}</p>
        </Banner>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{t('monthlyMenu:title')}</h1>
        <p className={styles.description}>{t('monthlyMenu:description')}</p>
      </div>

      {error && (
        <Banner type="error" className={styles.banner}>
          <p>{error}</p>
        </Banner>
      )}

      {currentFile ? (
        <div className={styles.currentFile}>
          <div className={styles.fileCard}>
            <div className={styles.fileInfo}>
              <div className={styles.fileIcon}>
                {isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getMediaUrl(currentFile.url)}
                    alt={currentFile.alt || 'Menú del mes'}
                    className={styles.filePreview}
                  />
                ) : (
                  <div className={styles.fileIconPlaceholder}>
                    <span className={styles.fileExtension}>
                      {currentFile.filename?.split('.').pop()?.toUpperCase() || 'FILE'}
                    </span>
                  </div>
                )}
              </div>
              <div className={styles.fileDetails}>
                <h3>{currentFile.filename}</h3>
                <p className={styles.fileMeta}>
                  {currentFile.mimeType} • {formatFileSize(currentFile.filesize)}
                </p>
              </div>
            </div>

            <div className={styles.urlSection}>
              <label htmlFor="menu-url" className={styles.urlLabel}>
                {t('monthlyMenu:publicUrl')}
              </label>
              <div className={styles.urlInput}>
                <input
                  id="menu-url"
                  type="text"
                  value={fixedMenuUrl}
                  readOnly
                  className={styles.urlField}
                />
                <Button onClick={handleCopyUrl} buttonStyle="secondary" size="small">
                  {copiedUrl ? t('monthlyMenu:copied') : t('monthlyMenu:copy')}
                </Button>
              </div>
              <p className={styles.urlHint}>{t('monthlyMenu:urlHint')}</p>
            </div>

            <div className={styles.actions}>
              <Button
                onClick={handleReplaceFile}
                disabled={isUploading}
                buttonStyle="primary"
                icon="edit"
              >
                {isUploading ? t('monthlyMenu:uploading') : t('monthlyMenu:replace')}
              </Button>
              <a href={fixedMenuUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadLink}>
                <Button buttonStyle="secondary" icon="download">
                  {t('monthlyMenu:download')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className={styles.uploadIcon}>📄</div>
          <h3>{t('monthlyMenu:dragOrClick')}</h3>
          <p>{t('monthlyMenu:anyFormat')}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className={styles.fileInput}
        accept="*/*"
      />
    </div>
  )
}

function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
