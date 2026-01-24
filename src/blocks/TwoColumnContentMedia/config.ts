import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const TwoColumnContentMedia: Block = {
  slug: 'twoColumnContentMedia',
  interfaceName: 'TwoColumnContentMediaBlock',
  dbName: 'two_col_content_media',
  fields: [
    {
      name: 'contentPosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Contenido a la izquierda', value: 'left' },
        { label: 'Contenido a la derecha', value: 'right' },
      ],
      required: true,
      admin: {
        description: 'Posición del contenido de texto en relación a las imágenes',
      },
    },
    {
      name: 'mediaLayout',
      type: 'select',
      defaultValue: 'single',
      options: [
        { label: 'Una imagen', value: 'single' },
        { label: 'Dos imágenes (overlap)', value: 'dual' },
      ],
      required: true,
      admin: {
        description: 'Usar una sola imagen o dos imágenes con efecto de superposición',
      },
    },
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
      name: 'mediaPrimary',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Imagen principal',
      admin: {
        description: 'Imagen principal (siempre visible)',
      },
    },
    {
      name: 'mediaSecondary',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen secundaria',
      admin: {
        condition: (data, siblingData) => siblingData?.mediaLayout === 'dual',
        description: 'Segunda imagen que se superpone con la principal',
      },
    },
  ],
  labels: {
    singular: 'Two Column Content + Media',
    plural: 'Two Column Content + Media',
  },
}
