import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Menus: CollectionConfig = {
  slug: 'menus',
  access: {
    create: authenticated,
    delete: authenticated,
    read: ({ req: { user } }) => {
      // Authenticated users can read all
      if (user) return true
      // Public can only read active menus
      return {
        active: { equals: true },
      }
    },
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'active', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Nombre de la carta',
      admin: {
        description: 'Ej: Carta Principal, Carta de Vinos, Carta de Postres',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug',
      admin: {
        description: 'Identificador único para la carta',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Descripción',
      admin: {
        description: 'Descripción de la carta',
      },
    },
    {
      name: 'dishes',
      type: 'relationship',
      relationTo: 'dishes',
      hasMany: true,
      required: true,
      label: 'Platos',
      admin: {
        description: 'Selecciona los platos que forman parte de esta carta',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Activa',
      admin: {
        description: 'Si la carta está activa y visible',
      },
    },
  ],
  timestamps: true,
}
