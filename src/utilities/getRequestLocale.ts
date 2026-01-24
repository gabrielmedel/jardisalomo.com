import { cookies, headers } from 'next/headers'

import { DEFAULT_LOCALE, isSupportedLocale } from './locales'

export const getRequestLocale = async () => {
  // Try to get locale from URL first
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('referer') || ''
  
  const pathSegments = pathname.split('/').filter(Boolean)
  const firstSegment = pathSegments[0]
  
  if (isSupportedLocale(firstSegment)) {
    return firstSegment
  }

  // Fallback to cookie
  const store = await cookies()
  const cookieLocale = store.get('payload-locale')?.value ?? store.get('locale')?.value

  if (isSupportedLocale(cookieLocale)) return cookieLocale

  return DEFAULT_LOCALE
}
