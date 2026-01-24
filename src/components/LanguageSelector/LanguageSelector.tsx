'use client'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'

import type { Header, Media } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { SUPPORTED_LOCALES } from '@/utilities/locales'
import { getMediaUrl } from '@/utilities/getMediaUrl'

type LanguageConfig = NonNullable<Header['languageSelector']>['languages']
type NormalizedLanguage = {
  code: string
  label: string
  flag: number | Media | null
}

interface LanguageSelectorProps {
  locale: string
  languages?: LanguageConfig
  isDarkMode?: boolean
  showLabel?: boolean
  showIcon?: boolean
}

export const LanguageSelector = ({
  locale,
  languages,
  isDarkMode = false,
  showLabel = true,
  showIcon = true,
}: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLocaleChange = (newLocale: string) => {
    document.cookie = `payload-locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    setIsOpen(false)

    // Cambiar la URL manteniendo el path actual
    const pathWithoutLocale = pathname.replace(/^\/(ca|es|en)/, '')
    globalThis.location.href = `/${newLocale}${pathWithoutLocale || ''}`
  }

  const getDefaultLabelForLocale = (loc: string) => {
    if (loc === 'en') return 'Language'
    return 'Idioma'
  }

  // Usar la configuración del CMS o fallback
  const availableLanguages: NormalizedLanguage[] =
    languages && languages.length > 0
      ? languages.map((lang) => ({
          code: String(lang.code),
          label: lang.label,
          flag: lang.flag ?? null,
        }))
      : SUPPORTED_LOCALES.map((loc) => ({
          code: loc,
          label: getDefaultLabelForLocale(loc),
          flag: null,
        }))

  const currentLanguage = availableLanguages.find((lang) => lang.code === locale)
  const otherLanguages = availableLanguages.filter((lang) => lang.code !== locale)

  if (!currentLanguage) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-serif transition-colors',
          isDarkMode
            ? 'border-white/30 text-white hover:border-white/50'
            : 'border-foreground/30 text-foreground hover:border-foreground/50',
          !showLabel && 'px-3',
        )}
      >
        {showIcon && (
          <>
            <span className="sr-only">{currentLanguage.label}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className={cn('h-4 w-4', isDarkMode ? 'text-white' : 'text-foreground')}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.5-2.2 4-5.4 4-9s-1.5-6.8-4-9c-2.5 2.2-4 5.4-4 9s1.5 6.8 4 9Zm-8.5-9h17M12 3c3.6 0 6.7 1.4 8.5 3.5M12 21c3.6 0 6.7-1.4 8.5-3.5"
              />
            </svg>
          </>
        )}

        {showLabel && <span>{currentLanguage.label}</span>}

        {showLabel && currentLanguage.flag && typeof currentLanguage.flag === 'object' && (
          <Image
            src={getMediaUrl(currentLanguage.flag.url)}
            alt={currentLanguage.code}
            width={20}
            height={15}
            className="rounded-sm object-cover"
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && otherLanguages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute top-full right-0 mt-2 py-2 rounded-lg shadow-lg border min-w-[140px] backdrop-blur-sm',
              isDarkMode ? 'bg-gray-900/95 border-white/20' : 'bg-background/95 border-border',
            )}
          >
            {otherLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLocaleChange(lang.code)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors justify-between',
                  isDarkMode ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-black/5',
                )}
              >
                <span className="font-serif">{lang.label}</span>
                {lang.flag && typeof lang.flag === 'object' && (
                  <Image
                    src={getMediaUrl(lang.flag.url)}
                    alt={lang.code}
                    width={20}
                    height={15}
                    className="rounded-sm object-cover"
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
