import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './utilities/locales'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for api, admin, static files, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/next') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) {
    // Extract locale and set cookie
    const locale = pathname.split('/')[1]
    const response = NextResponse.next()
    response.cookies.set('payload-locale', locale, {
      path: '/',
      sameSite: 'lax',
    })
    return response
  }

  // Get locale from cookie or use default
  const cookieLocale = request.cookies.get('payload-locale')?.value
  const locale =
    cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as any)
      ? cookieLocale
      : DEFAULT_LOCALE

  // Redirect to path with locale
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  newUrl.search = request.nextUrl.search
  
  const response = NextResponse.redirect(newUrl)
  response.cookies.set('payload-locale', locale, {
    path: '/',
    sameSite: 'lax',
  })
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - admin (Payload admin)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|admin|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
