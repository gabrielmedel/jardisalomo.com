import React from 'react'
import { isSupportedLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/utilities/locales'

import { Header } from '@/Header/Component'
import { Footer } from '@/Footer/Component'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = isSupportedLocale(localeParam) ? localeParam : DEFAULT_LOCALE

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
  }))
}
