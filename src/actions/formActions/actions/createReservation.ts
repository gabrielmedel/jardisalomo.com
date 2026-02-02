import type { FormActionHandler, FormActionResult, FormActionConfig } from '../types'

interface CreateReservationConfig extends FormActionConfig {
  type: 'createReservation'
  enabled?: boolean
  reservationFieldMapping?: {
    reservationFieldName: string
  }
}

/**
 * Action que crea una reserva a partir de los datos del form submission.
 *
 * Extrae los datos del reservationField y crea una reserva con status 'pending'.
 * Los datos vienen prefijados con el nombre del campo (ej: reservation_date).
 */
export const createReservation: FormActionHandler<CreateReservationConfig> = async (
  context,
  config,
) => {
  const { submission, payload, req } = context

  try {
    // Get field name from config (default: 'reservation')
    let fieldName = config.reservationFieldMapping?.reservationFieldName || 'reservation'

    // Extract submission data
    const submissionData = submission.submissionData || []

    // Helper to get value from submission data
    const getValue = (suffix: string) => {
      const field = submissionData.find((d) => d.field === `${fieldName}_${suffix}`)
      return field?.value
    }

    // If the expected prefix isn't present, try to detect it from submission data
    const hasExpectedPrefix = submissionData.some((item) => item.field === `${fieldName}_reservationType`)
    if (!hasExpectedPrefix) {
      const detected = submissionData.find((item) => item.field?.endsWith('_reservationType'))
      if (detected?.field) {
        fieldName = detected.field.replace(/_reservationType$/, '')
      }
    }

    // Extract all required fields
    const reservationType = getValue('reservationType')
    const date = getValue('date')
    const startTime = getValue('startTime')
    const endTime = getValue('endTime')
    const numberOfPeople = getValue('numberOfPeople')
    const guestName = getValue('guestName')
    const email = getValue('email')
    const phone = getValue('phone')

    // Validate required fields
    if (!reservationType) {
      return {
        status: 'error',
        message: 'Tipo de reserva no especificado',
      }
    }

    if (!date || !startTime || !endTime) {
      return {
        status: 'error',
        message: 'Fecha y horario son requeridos',
      }
    }

    if (!numberOfPeople || !guestName || !email || !phone) {
      return {
        status: 'error',
        message: 'Información de contacto incompleta',
      }
    }

    const reservationTypeId =
      typeof reservationType === 'string' && reservationType.trim() !== ''
        ? Number(reservationType)
        : reservationType

    const normalizedReservationType =
      typeof reservationTypeId === 'number' && Number.isFinite(reservationTypeId)
        ? reservationTypeId
        : reservationType

    // Create the reservation
    const reservation = await payload.create({
      collection: 'reservations',
      data: {
        reservationType: normalizedReservationType as any, // Type will be handled by Payload
        date: date as string,
        startTime: startTime as string,
        endTime: endTime as string,
        numberOfPeople: Number(numberOfPeople),
        guestName: guestName as string,
        email: email as string,
        phone: phone as string,
        status: 'pending',
        formSubmission: submission.id,
      },
      req,
    })

    // Log success
    console.log(`[createReservation] Created reservation #${reservation.id} for ${guestName}`)

    return {
      status: 'success',
      message: `Reserva #${reservation.id} creada exitosamente`,
      metadata: {
        reservationId: reservation.id,
        guestName,
        date,
        startTime,
        endTime,
      },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`[createReservation] Error: ${errorMessage}`)

    return {
      status: 'error',
      message: `Error al crear la reserva: ${errorMessage}`,
    }
  }
}
