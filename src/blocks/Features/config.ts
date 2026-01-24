import type { Block } from 'payload'

export const Features: Block = {
  slug: 'features',
  interfaceName: 'FeaturesBlock',
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Icono/Imagen',
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          localized: true,
          label: 'Título',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          localized: true,
          label: 'Descripción',
        },
      ],
    },
  ],
  labels: {
    singular: 'Features',
    plural: 'Features',
  },
}
