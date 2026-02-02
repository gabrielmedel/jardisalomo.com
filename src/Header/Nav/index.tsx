'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

export const HeaderNav: React.FC<{
  data: HeaderType
  locale: string
  isDarkMode?: boolean
  className?: string
  orientation?: 'row' | 'column'
  onNavItemClick?: () => void
  animateItems?: boolean
}> = ({
  data,
  locale,
  isDarkMode = false,
  className,
  orientation = 'row',
  onNavItemClick,
  animateItems = false,
}) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  type NavLink = {
    type?: 'custom' | 'reference' | null
    url?: string | null
    reference?: {
      value?: { slug?: string | null } | string | number | null
    } | null
  }

  // Función para determinar si un link está activo
  const isActiveLink = (link: NavLink) => {
    const currentPath = (pathname || '').replace(/\/$/, '')
    if (link?.type === 'reference' && typeof link.reference?.value === 'object') {
      const slug = link.reference.value?.slug
      // En este proyecto la home es "inici" y vive en `/${locale}`
      const linkPath = `/${locale}${slug === 'inici' ? '' : `/${slug}`}`.replace(/\/$/, '')
      return currentPath === linkPath
    }
    if (link?.type === 'custom' && link?.url) {
      const linkPath = String(link.url).replace(/\/$/, '')
      return currentPath === linkPath
    }
    return false
  }

  const listVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.12,
      },
    },
  } as const

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.22, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      y: 8,
      transition: { duration: 0.15, ease: 'easeOut' },
    },
  } as const

  const darkHoverClass =
    orientation === 'column' ? 'text-white hover:text-[#F6E7D9]' : 'text-white hover:text-white/80'

  return (
    <motion.nav
      className={cn(
        'flex',
        orientation === 'row' ? 'gap-6 items-center' : 'flex-col items-start gap-10',
        className,
      )}
      variants={animateItems ? listVariants : undefined}
      initial={animateItems ? 'hidden' : undefined}
      animate={animateItems ? 'show' : undefined}
      exit={animateItems ? 'hidden' : undefined}
    >
      {navItems.map(({ link }, i) => {
        const isActive = isActiveLink(link)
        return (
          <motion.div
            key={i}
            className="relative flex items-center gap-2"
            variants={animateItems ? itemVariants : undefined}
          >
            {isActive && (
              <span
                aria-hidden="true"
                className={cn('w-1.5 h-1.5 rotate-45 inline-block', isDarkMode ? 'bg-white' : 'bg-primary')}
              />
            )}
            <CMSLink
              {...link}
              locale={locale}
              appearance="link"
              onClick={onNavItemClick}
              className={cn(
                'font-serif text-sm uppercase tracking-[0.1em] transition-colors font-medium',
                orientation === 'column' && 'text-4xl font-light tracking-[0.12em] leading-[1.05]',
                isDarkMode ? darkHoverClass : 'text-foreground hover:text-primary',
                isActive && (isDarkMode ? 'text-white' : 'text-primary'),
              )}
            />
          </motion.div>
        )
      })}
    </motion.nav>
  )
}
