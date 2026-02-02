import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const MenuDisplay: Block = {
  slug: 'menuDisplay',
  interfaceName: 'MenuDisplayBlock',
  dbName: 'menu_display',
  fields: [
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

    // Images Section
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Imagen de fondo (ancho completo)',
      admin: {
        description: 'Imagen que se mostrará en la parte superior del bloque',
      },
    },

    // Content Section
    {
      type: 'collapsible',
      label: 'Contenido',
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
            description: 'Título principal del menú',
          },
        },
      ],
    },

    // Information Items
    {
      name: 'infoItems',
      type: 'array',
      localized: true,
      label: 'Items de información (Fecha y Hora)',
      admin: {
        description: 'Añade información como fechas y horarios con iconos',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          label: 'Tipo',
          options: [
            {
              label: 'Fecha (Calendario)',
              value: 'date',
            },
            {
              label: 'Hora (Reloj)',
              value: 'time',
            },
          ],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Etiqueta/Texto',
          admin: {
            width: '50%',
            description: 'Texto a mostrar junto al icono',
          },
        },
      ],
    },

    // Menu Items
    {
      name: 'menuItems',
      type: 'array',
      localized: true,
      label: 'Items del menú',
      admin: {
        description: 'Añade los platos o secciones del menú con descripciones',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'content',
          type: 'richText',
          required: true,
          localized: true,
          label: 'Contenido del plato',
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
            description:
              'Nombre del plato, descripción y otros detalles usando formato de texto enriquecido',
          },
        },
      ],
    },

    // Pricing Items
    {
      name: 'pricingItems',
      type: 'array',
      localized: true,
      label: 'Precios',
      admin: {
        description: 'Añade categorías de precios (Adultos, Infantil, etc.)',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: 'Etiqueta',
          admin: {
            width: '33.33%',
            description: 'Ej: Adultos, Infantil',
          },
        },
        {
          name: 'price',
          type: 'text',
          required: true,
          label: 'Precio',
          admin: {
            width: '33.33%',
            description: 'Ej: 16,50€',
          },
        },
        {
          name: 'perPriceLabel',
          type: 'text',
          required: true,
          localized: true,
          label: 'Etiqueta por unidad',
          admin: {
            width: '33.33%',
            description: 'Ej: / persona',
          },
        },
      ],
    },
  ],
  labels: {
    singular: 'Menu Display',
    plural: 'Menu Display',
  },
}
