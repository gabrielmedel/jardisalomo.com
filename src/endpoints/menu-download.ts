import type { Endpoint, PayloadRequest } from 'payload'

/**
 * Helper to build absolute URL from media URL
 */
const getAbsoluteUrl = (mediaUrl: string, req: PayloadRequest): string => {
  // If already absolute (S3/MinIO URLs), return as is
  if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
    return mediaUrl
  }

  // Build absolute URL from request
  const protocol = req.headers.get('x-forwarded-proto') || 'https'
  const host = req.headers.get('host') || req.headers.get('x-forwarded-host')

  if (!host) {
    // Fallback to NEXT_PUBLIC_SERVER_URL if available
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
    if (serverUrl) {
      return `${serverUrl}${mediaUrl}`
    }
    throw new Error('Could not determine host for redirect')
  }

  return `${protocol}://${host}${mediaUrl}`
}

/**
 * Endpoint para descargar el menú diario
 * URL fija: /api/menu/daily
 */
export const dailyMenuDownload: Endpoint = {
  path: '/menu/daily',
  method: 'get',
  handler: async (req) => {
    try {
      const dailyMenu = await req.payload.findGlobal({
        slug: 'daily-menu',
        depth: 1,
      })

      if (!dailyMenu?.menuFile) {
        return new Response('Menu not found', { status: 404 })
      }

      const media =
        typeof dailyMenu.menuFile === 'object' ? dailyMenu.menuFile : null

      if (!media?.url) {
        return new Response('Menu file not found', { status: 404 })
      }

      // Redirect to the actual file URL (must be absolute)
      const absoluteUrl = getAbsoluteUrl(media.url, req)
      return Response.redirect(absoluteUrl, 302)
    } catch (error) {
      console.error('Error fetching daily menu:', error)
      return new Response('Internal server error', { status: 500 })
    }
  },
}

/**
 * Endpoint para descargar el menú del mes
 * URL fija: /api/menu/monthly
 */
export const monthlyMenuDownload: Endpoint = {
  path: '/menu/monthly',
  method: 'get',
  handler: async (req) => {
    try {
      const monthlyMenu = await req.payload.findGlobal({
        slug: 'monthly-menu',
        depth: 1,
      })

      if (!monthlyMenu?.menuFile) {
        return new Response('Menu not found', { status: 404 })
      }

      const media =
        typeof monthlyMenu.menuFile === 'object' ? monthlyMenu.menuFile : null

      if (!media?.url) {
        return new Response('Menu file not found', { status: 404 })
      }

      // Redirect to the actual file URL (must be absolute)
      const absoluteUrl = getAbsoluteUrl(media.url, req)
      return Response.redirect(absoluteUrl, 302)
    } catch (error) {
      console.error('Error fetching monthly menu:', error)
      return new Response('Internal server error', { status: 500 })
    }
  },
}
