import type { CollectionConfig } from 'payload'

export const Reservations: CollectionConfig = {
  slug: 'reservations',
  admin: {
    useAsTitle: 'guestName',
    defaultColumns: ['guestName', 'date', 'startTime', 'status', 'reservationType', 'createdAt'],
    group: 'Reservations',
  },
  access: {
    // Only admins can see all reservations
    create: () => true, // Created via form submission
    read: ({ req: { user } }) => {
      if (!user) return false
      return Boolean((user as any)?.roles?.includes('admin'))
    },
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
      name: 'reservationType',
      type: 'relationship',
      relationTo: 'reservation-types',
      required: true,
      admin: {
        description: 'Tipo de reserva',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'Fecha de la reserva',
      },
    },
    {
      name: 'startTime',
      type: 'text',
      required: true,
      admin: {
        placeholder: '14:00',
        description: 'Hora de inicio (formato HH:mm)',
      },
      validate: (value: any) => {
        if (!value) return 'Hora de inicio es requerida'
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
        if (!value) return 'Hora de fin es requerida'
        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
        if (!timeRegex.test(value)) {
          return 'Formato inválido. Use HH:mm (ej: 16:00)'
        }
        return true
      },
    },
    {
      name: 'numberOfPeople',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        description: 'Número total de personas',
      },
    },
    {
      name: 'guestName',
      type: 'text',
      required: true,
      admin: {
        description: 'Nombre completo del cliente',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Email de contacto',
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      admin: {
        placeholder: '+34 612 345 678',
        description: 'Teléfono de contacto',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pendiente', value: 'pending' },
        { label: 'Confirmada', value: 'confirmed' },
        { label: 'Cancelada', value: 'cancelled' },
      ],
      admin: {
        description: 'Estado de la reserva (solo confirmadas cuentan para el aforo)',
      },
    },
    {
      name: 'formSubmission',
      type: 'relationship',
      relationTo: 'form-submissions',
      admin: {
        description: 'Referencia al formulario de origen',
      },
    },
  ],
  timestamps: true,
}
