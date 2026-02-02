import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Dishes: CollectionConfig = {
  slug: 'dishes',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'available'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Nombre del plato',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Descripción',
      admin: {
        description: 'Descripción del plato',
      },
    },
    {
      name: 'price',
      type: 'text',
      required: true,
      label: 'Precio',
      admin: {
        description: 'Ej: 16,50€',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Entrantes',
          value: 'starters',
        },
        {
          label: 'Platos Principales',
          value: 'mains',
        },
        {
          label: 'Postres',
          value: 'desserts',
        },
        {
          label: 'Bebidas',
          value: 'drinks',
        },
      ],
      label: 'Categoría',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen del plato',
      admin: {
        description: 'Imagen opcional del plato',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Destacado',
      admin: {
        description: 'Marcar como recomendación del chef',
      },
    },
    {
      name: 'allergens',
      type: 'array',
      localized: true,
      label: 'Alérgenos',
      admin: {
        description: 'Lista de alérgenos presentes en el plato',
      },
      fields: [
        {
          name: 'allergen',
          type: 'text',
          required: true,
          label: 'Alérgeno',
          admin: {
            description: 'Ej: Gluten, Lácteos, Frutos secos',
          },
        },
      ],
    },
    {
      name: 'available',
      type: 'checkbox',
      defaultValue: true,
      label: 'Disponible',
      admin: {
        description: 'Indica si el plato está disponible actualmente',
      },
    },
  ],
  timestamps: true,
}
