import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const CenteredWithMedia: Block = {
  slug: 'centeredWithMedia',
  interfaceName: 'CenteredWithMediaBlock',
  fields: [
    {
      name: 'preTitle',
      type: 'text',
      localized: true,
      label: 'Pre-título',
    },
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Contenido',
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Imagen o Video de fondo',
    },
  ],
  labels: {
    singular: 'Centered with Media',
    plural: 'Centered with Media',
  },
}
