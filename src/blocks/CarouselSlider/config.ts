import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const CarouselSlider: Block = {
  slug: 'carouselSlider',
  interfaceName: 'CarouselSliderBlock',
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
      label: 'Título y contenido',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Imagen de fondo',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: 'Título',
        },
        {
          name: 'subtitle',
          type: 'text',
          required: true,
          localized: true,
          label: 'Subtítulo',
        },
        link({
          appearances: ['link'],
          overrides: {
            required: true,
          },
        }),
      ],
      label: 'Elementos del carrusel',
    },
  ],
  labels: {
    singular: 'Carousel Slider',
    plural: 'Carousel Sliders',
  },
}
