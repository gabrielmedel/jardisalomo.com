'use client'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

import type { Page } from '@/payload-types'
import { isSupportedLocale, DEFAULT_LOCALE } from '@/utilities/locales'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  locale?: string
  newTab?: boolean | null
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  reference?: {
    relationTo: 'pages'
    value: Page | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    locale: localeProp,
    newTab,
    onClick,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const params = useParams()

  // Usar locale de params o prop, con fallback a default
  const localeFromParams = typeof params?.locale === 'string' ? params.locale : null
  const currentLocale = localeProp || (isSupportedLocale(localeFromParams) ? localeFromParams : DEFAULT_LOCALE)

  // Construir href con locale
  let href = url

  if (type === 'reference' && typeof reference?.value === 'object' && reference.value.slug) {
    const slug = reference.value.slug
    const baseSlug = slug === 'inici' ? '' : slug
    const collectionPath = reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''
    
    // Construir la ruta con locale
    href = `/${currentLocale}${collectionPath}${baseSlug ? `/${baseSlug}` : ''}`
  } else if (url && !url.startsWith('http') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
    // Si es una URL relativa y no tiene locale, añadirlo
    if (!url.match(/^\/(ca|es|en)/)) {
      href = `/${currentLocale}${url.startsWith('/') ? url : `/${url}`}`
    }
  }

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href} onClick={onClick} {...newTabProps}>
        {label ?? null}
        {children ?? null}
      </Link>
    )
  }

  /* Link with underline style */
  if (appearance === 'link') {
    return (
      <Link 
        className={cn('link-underline', className)} 
        href={href} 
        onClick={onClick} 
        {...newTabProps}
      >
        {label ?? null}
        {children ?? null}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href} onClick={onClick} {...newTabProps}>
        {label ?? null}
        {children ?? null}
      </Link>
    </Button>
  )
}
