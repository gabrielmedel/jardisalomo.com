import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Menu: Block = {
  slug: 'menu',
  interfaceName: 'MenuBlock',
  fields: [
    // Menu Selection
    {
      name: 'menu',
      type: 'relationship',
      relationTo: 'menus',
      required: true,
      label: 'Carta',
      admin: {
        description: 'Selecciona qué carta mostrar',
      },
    },

    // Section Background Color
    {
      name: 'sectionBackgroundColor',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'Sin fondo', value: 'none' },
        { label: 'Pastel (beige claro)', value: 'pastel' },
        { label: 'Olive (verde oliva)', value: 'olive' },
        { label: 'Accent (marrón/tan)', value: 'accent' },
      ],
      required: true,
      label: 'Color de fondo de la sección',
      admin: {
        description: 'Color de fondo para toda la sección del bloque',
      },
    },

    // Header Section
    {
      type: 'collapsible',
      label: 'Encabezado',
      fields: [
        {
          name: 'preTitle',
          type: 'text',
          localized: true,
          label: 'Pre-título',
          admin: {
            description: 'Texto pequeño sobre el título principal',
          },
        },
        {
          name: 'title',
          type: 'richText',
          localized: true,
          label: 'Título',
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
          admin: {
            description: 'Título principal (sobrescribe el nombre de la carta si se proporciona)',
          },
        },
        {
          name: 'description',
          type: 'richText',
          localized: true,
          label: 'Descripción',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
          admin: {
            description: 'Descripción adicional (complementa la descripción de la carta)',
          },
        },
      ],
    },

    // Display Options
    {
      type: 'collapsible',
      label: 'Opciones de visualización',
      fields: [
        {
          name: 'showImages',
          type: 'checkbox',
          defaultValue: true,
          label: 'Mostrar imágenes',
          admin: {
            description: 'Mostrar imágenes de los platos si están disponibles',
          },
        },
        {
          name: 'showAllergens',
          type: 'checkbox',
          defaultValue: true,
          label: 'Mostrar alérgenos',
          admin: {
            description: 'Mostrar información de alérgenos de cada plato',
          },
        },
        {
          name: 'groupByCategory',
          type: 'checkbox',
          defaultValue: true,
          label: 'Agrupar por categorías',
          admin: {
            description:
              'Agrupar platos por categoría (Entrantes, Principales, etc.) o mostrar lista única',
          },
        },
        {
          name: 'onlyFeatured',
          type: 'checkbox',
          defaultValue: false,
          label: 'Solo destacados',
          admin: {
            description: 'Mostrar solo los platos marcados como destacados',
          },
        },
      ],
    },
  ],
  labels: {
    singular: 'Carta',
    plural: 'Cartas',
  },
}
