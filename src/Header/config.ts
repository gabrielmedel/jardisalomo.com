import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      localized: true,
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'languageSelector',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Habilitar selector de idioma',
        },
        {
          name: 'languages',
          type: 'array',
          label: 'Idiomas disponibles',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
          },
          fields: [
            {
              name: 'code',
              type: 'select',
              required: true,
              label: 'Código del idioma',
              options: [
                { label: 'ca - Català', value: 'ca' },
                { label: 'es - Español', value: 'es' },
                { label: 'en - English', value: 'en' },
              ],
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Etiqueta (ej: Idioma, Language)',
              admin: {
                description: 'Texto que se muestra en el botón (ej: "Idioma", "Language")',
              },
            },
            {
              name: 'flag',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Bandera',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
