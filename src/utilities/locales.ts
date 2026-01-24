export const SUPPORTED_LOCALES = ['es', 'ca', 'en'] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: SupportedLocale = 'ca'

export const isSupportedLocale = (value?: string | null): value is SupportedLocale =>
  Boolean(value && SUPPORTED_LOCALES.includes(value as SupportedLocale))
