import type { Endpoint } from 'payload'

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

      // Redirect to the actual file URL
      return Response.redirect(media.url, 302)
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

      // Redirect to the actual file URL
      return Response.redirect(media.url, 302)
    } catch (error) {
      console.error('Error fetching monthly menu:', error)
      return new Response('Internal server error', { status: 500 })
    }
  },
}
