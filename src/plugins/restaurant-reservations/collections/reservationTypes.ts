import type { CollectionConfig } from 'payload'
import { validateNoCircularInheritance } from '../utils/inheritance'

export const ReservationTypes: CollectionConfig = {
  slug: 'reservation-types',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'inheritsFrom', 'updatedAt'],
    group: 'Reservations',
  },
  access: {
    // Only admins can manage reservation types
    create: ({ req: { user } }) => {
      if (!user) return false
      return Boolean((user as any)?.roles?.includes('admin'))
    },
    read: () => true, // Public read for frontend
    update: ({ req: { user } }) => {
      if (!user) return false
      return Boolean((user as any)?.roles?.includes('admin'))
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return Boolean((user as any)?.roles?.includes('admin'))
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description:
          'Nombre descriptivo del tipo de reserva (ej: Terraza, Interior, Evento Privado)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Identificador único para este tipo de reserva',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              // Auto-generate slug from name
              return data.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove accents
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'inheritsFrom',
      type: 'relationship',
      relationTo: 'reservation-types',
      admin: {
        description: 'Heredar configuración de otro tipo de reserva (solo 1 nivel)',
      },
      validate: async (value: any, options: any) => {
        if (!value) return true

        const { data, req, id } = options
        const parentId = typeof value === 'object' ? value.id : value
        const typeId = id || data?.id

        if (!typeId) return true // Allow on create

        const isValid = await validateNoCircularInheritance(req.payload, typeId, parentId)

        if (!isValid) {
          return 'No se puede crear herencia circular'
        }

        return true
      },
    },
    {
      name: 'availableDays',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Domingo', value: '0' },
        { label: 'Lunes', value: '1' },
        { label: 'Martes', value: '2' },
        { label: 'Miércoles', value: '3' },
        { label: 'Jueves', value: '4' },
        { label: 'Viernes', value: '5' },
        { label: 'Sábado', value: '6' },
      ],
      admin: {
        description: 'Días de la semana disponibles para este tipo de reserva',
      },
    },
    {
      name: 'dateRange',
      type: 'group',
      admin: {
        description: 'Rango de fechas disponibles (opcional)',
      },
      fields: [
        {
          name: 'startDate',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
            description: 'Fecha de inicio de disponibilidad',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
            description: 'Fecha de fin de disponibilidad',
          },
        },
      ],
    },
    {
      name: 'timeSlots',
      type: 'array',
      admin: {
        description: 'Franjas horarias y capacidad para cada franja',
      },
      fields: [
        {
          name: 'startTime',
          type: 'text',
          required: true,
          admin: {
            placeholder: '14:00',
            description: 'Hora de inicio (formato HH:mm)',
          },
          validate: (value: any) => {
            if (!value) return true
            const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
            if (!timeRegex.test(value)) {
              return 'Formato inválido. Use HH:mm (ej: 14:00)'
            }
            return true
          },
        },
        {
          name: 'endTime',
          type: 'text',
          required: true,
          admin: {
            placeholder: '16:00',
            description: 'Hora de fin (formato HH:mm)',
          },
          validate: (value: any) => {
            if (!value) return true
            const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
            if (!timeRegex.test(value)) {
              return 'Formato inválido. Use HH:mm (ej: 16:00)'
            }
            return true
          },
        },
        {
          name: 'maxCapacity',
          type: 'number',
          required: true,
          min: 1,
          admin: {
            description: 'Capacidad máxima de personas para esta franja',
          },
        },
      ],
    },
  ],
  timestamps: true,
}
