import type { Field } from 'payload'

/**
 * Reservation field configuration for form builder
 * The reservation type is selected dynamically via URL searchParams (reservationType)
 */
export const reservationField: Field = {
  name: 'reservationField',
  type: 'group',
  admin: {
    description: 'Campo compuesto para reservas de restaurante. El tipo de reserva se selecciona dinámicamente mediante URL searchParams.',
  },
  fields: [
    {
      name: 'defaultPeople',
      type: 'number',
      defaultValue: 2,
      min: 1,
      admin: {
        description: 'Número predeterminado de personas',
      },
    },
    {
      name: 'maxPeople',
      type: 'number',
      defaultValue: 10,
      min: 1,
      admin: {
        description: 'Número máximo de personas permitido',
      },
    },
  ],
}
