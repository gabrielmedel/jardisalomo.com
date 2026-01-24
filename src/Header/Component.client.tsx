'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll } from 'motion/react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { LanguageSelector } from '@/components/LanguageSelector/LanguageSelector'
import { HeaderNav } from './Nav'
import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'

interface HeaderClientProps {
  data: Header
  locale: string
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, locale }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      const viewportHeight = globalThis.window?.innerHeight
      const scrollThreshold = viewportHeight ? viewportHeight * 0.8 : 600
      setHasScrolled(latest > scrollThreshold)
    })

    return () => unsubscribe()
  }, [scrollY])

  useEffect(() => {
    setHeaderTheme(null)
    setIsMenuOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    // Keep local state in sync, including when headerTheme is cleared (null)
    setTheme(headerTheme ?? null)
  }, [headerTheme])

  useEffect(() => {
    if (!isMenuOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isMenuOpen])

  // Determinar si estamos en theme dark basado en headerTheme
  const isDarkTheme = theme === 'dark'

  // Logo en función del color de fondo (oscuro vs claro)
  const logoVariant = isDarkTheme && !hasScrolled ? 'onDark' : 'onLight'
  const isHeroMode = isDarkTheme && !hasScrolled
  const languageSelectorEnabled = Boolean(data?.languageSelector?.enabled)

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-colors duration-300',
        hasScrolled && isDarkTheme ? 'bg-white' : 'bg-transparent',
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="py-6 flex items-center justify-between gap-3 sm:gap-6">
          <Link href={`/${locale}`} className="shrink-0">
            <Logo
              loading="eager"
              priority="high"
              variant={logoVariant}
              className="h-10 max-w-[10rem] min-[360px]:h-11 min-[360px]:max-w-[11rem] sm:h-[52px] sm:max-w-[14rem]"
            />
          </Link>

          <div className="hidden lg:flex flex-1 justify-center">
            <HeaderNav data={data} locale={locale} isDarkMode={isHeroMode} />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {languageSelectorEnabled && (
              <>
                {/* Mobile: sin label, con icono */}
                <div className="sm:hidden">
                  <LanguageSelector
                    locale={locale}
                    languages={data.languageSelector?.languages}
                    isDarkMode={isHeroMode}
                    showLabel={false}
                    showIcon
                  />
                </div>

                {/* Tablet + desktop: con label */}
                <div className="hidden sm:block">
                  <LanguageSelector
                    locale={locale}
                    languages={data.languageSelector?.languages}
                    isDarkMode={isHeroMode}
                    showLabel
                    showIcon={false}
                  />
                </div>
              </>
            )}

            {/* Hamburger: solo < lg */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                'lg:hidden rounded-full border',
                isHeroMode
                  ? 'border-white/30 text-white hover:border-white/50 hover:bg-white/10'
                  : 'border-foreground/30 text-foreground hover:border-foreground/50',
              )}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((v) => !v)}
            >
              <span className="sr-only">{isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="h-5 w-5"
              >
                {isMenuOpen ? (
                  <>
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </>
                ) : (
                  <>
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </>
                )}
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-x-0 top-0 lg:hidden bg-[#686A53] text-white overflow-x-hidden overflow-y-auto overscroll-contain"
            initial={{ height: 0 }}
            animate={{ height: '100dvh' }}
            exit={{ height: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
            transition={{ duration: 1.5, ease: [0.1, 1, 0.2, 1] }}
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              className="container h-full"
              initial={false}
              animate={{}}
              exit={{}}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-8 flex flex-col gap-10 min-h-dvh">
                <div className="flex items-center justify-between gap-4">
                  <Link href={`/${locale}`} onClick={() => setIsMenuOpen(false)} className="shrink-0">
                    <Logo
                      loading="eager"
                      priority="high"
                      variant="onDark"
                      className="h-10 max-w-[10rem]"
                    />
                  </Link>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full border border-white/40 text-white hover:border-white/70 hover:bg-white/10"
                    aria-label="Cerrar menú"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className="h-5 w-5"
                    >
                      <path d="M6 6l12 12" />
                      <path d="M18 6L6 18" />
                    </svg>
                  </Button>
                </div>

                <HeaderNav
                  data={data}
                  locale={locale}
                  isDarkMode
                  orientation="column"
                  animateItems
                  onNavItemClick={() => setIsMenuOpen(false)}
                  className="pt-2"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
