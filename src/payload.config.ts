import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'node:path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'node:url'
import { es } from 'payload/i18n/es'

import { Dishes } from './collections/Dishes'
import { Media } from './collections/Media'
import { Menus } from './collections/Menus'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { Chatbot } from './globals/chatbot'
import { allPlugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { emailAdapter } from './email.config'
import { testEmailEndpoint } from './endpoints/test-email'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    theme: 'light',
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  email: emailAdapter,
  // i18n controls the UI language of the admin panel
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: 'es',
  },
  localization: {
    locales: ['es', 'ca', 'en'],
    defaultLocale: 'ca',
    fallback: true,
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: process.env.NODE_ENV === 'development', // Auto-sync en desarrollo
  }),
  collections: [Pages, Media, Users, Dishes, Menus],
  cors: [getServerSideURL()].filter(Boolean),
  endpoints: [testEmailEndpoint],
  globals: [Header, Footer, Chatbot],
  plugins: allPlugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
