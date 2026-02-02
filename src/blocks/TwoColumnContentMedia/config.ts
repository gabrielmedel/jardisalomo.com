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
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'Sin fondo', value: 'none' },
        { label: 'Pastel (beige claro)', value: 'pastel' },
        { label: 'Olive (verde oliva)', value: 'olive' },
        { label: 'Accent (marrón/tan)', value: 'accent' },
      ],
      required: true,
      admin: {
        description: 'Color de fondo para el bloque de contenido',
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
    {
      name: 'mediaBackgroundColor',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'Sin rectángulo', value: 'none' },
        { label: 'Pastel (beige claro)', value: 'pastel' },
        { label: 'Olive (verde oliva)', value: 'olive' },
        { label: 'Accent (marrón/tan)', value: 'accent' },
      ],
      admin: {
        description: 'Rectángulo decorativo detrás de la imagen',
      },
    },
    {
      name: 'rectangleWidth',
      type: 'number',
      defaultValue: 30,
      min: 20,
      max: 60,
      admin: {
        condition: (data, siblingData) => siblingData?.mediaBackgroundColor !== 'none',
        description: 'Ancho del rectángulo en % del viewport (20-60)',
      },
    },
    {
      name: 'rectangleOffsetTop',
      type: 'number',
      defaultValue: 0,
      min: -20,
      max: 40,
      admin: {
        condition: (data, siblingData) => siblingData?.mediaBackgroundColor !== 'none',
        description: 'Offset vertical del rectángulo en % (-20 a 40, negativo sube, positivo baja)',
      },
    },
    {
      name: 'rectangleHeight',
      type: 'number',
      defaultValue: 100,
      min: 60,
      max: 140,
      admin: {
        condition: (data, siblingData) => siblingData?.mediaBackgroundColor !== 'none',
        description: 'Altura del rectángulo en % del contenedor (60-140)',
      },
    },
  ],
  labels: {
    singular: 'Two Column Content + Media',
    plural: 'Two Column Content + Media',
  },
}
