import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { socialFields } from '@/fields/socials'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'introText',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Texto debajo del logo (columna izquierda).',
      },
    },
    {
      name: 'socials',
      type: 'array',
      localized: true,
      minRows: 2,
      maxRows: 2,
      fields: socialFields(),
      admin: {
        initCollapsed: true,
      },
    },
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
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'address',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Una línea por renglón.',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
