import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
  },
  auth: true,
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // If this is the first user being created, make them an admin
        if (operation === 'create' && (!data.roles || data.roles.length === 0)) {
          try {
            const { totalDocs } = await req.payload.count({
              collection: 'users',
            })

            if (totalDocs === 0) {
              data.roles = ['admin']
            }
          } catch (error) {
            // If count fails, just use default roles
            console.error('[Users hook] Error checking user count:', error)
          }
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      required: true,
      saveToJWT: true, // Important for fast access checks
      access: {
        // Only admins can modify roles
        update: ({ req: { user } }) => {
          if (!user) return false
          return Boolean((user as any)?.roles?.includes('admin'))
        },
      },
    },
  ],
  timestamps: true,
}
