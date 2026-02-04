import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

export const MonthlyMenu: GlobalConfig = {
  slug: 'monthly-menu',
  label: {
    en: 'Monthly Menu',
    es: 'Menú del Mes',
    ca: 'Menú del Mes',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    components: {
      views: {
        edit: {
          default: {
            Component: '@/components/MonthlyMenuView/MonthlyMenuView#MonthlyMenuView',
          },
        },
      },
    },
  },
  fields: [
    {
      name: 'menuFile',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: {
        en: 'Menu File',
        es: 'Archivo del Menú',
        ca: 'Arxiu del Menú',
      },
      admin: {
        description: {
          en: 'Upload the monthly menu here. It will be automatically replaced when uploading a new one.',
          es: 'Sube el menú del mes aquí. Se reemplazará automáticamente al subir uno nuevo.',
          ca: 'Puja el menú del mes aquí. Es reemplaçarà automàticament en pujar-ne un de nou.',
        },
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, previousDoc }) => {
        // Si hay un archivo anterior y es diferente al nuevo, eliminarlo
        if (
          previousDoc?.menuFile &&
          doc.menuFile &&
          previousDoc.menuFile !== doc.menuFile
        ) {
          try {
            await req.payload.delete({
              collection: 'media',
              id:
                typeof previousDoc.menuFile === 'string'
                  ? previousDoc.menuFile
                  : previousDoc.menuFile.id,
              req,
            })
          } catch (error) {
            console.error('Error deleting old menu file:', error)
            // No lanzar error para no interrumpir el flujo
          }
        }
        return doc
      },
    ],
  },
}
