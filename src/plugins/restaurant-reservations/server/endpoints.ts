import type { Endpoint } from 'payload'
import { APIError } from 'payload'
import { calculateAvailability } from './availability'
import { resolveReservationTypeConfig } from '../utils/inheritance'
import type { ReservationType } from '../types'

/**
 * GET /api/reservations/availability
 * Returns availability for a reservation type on a specific date
 */
export const availabilityEndpoint: Endpoint = {
  path: '/availability',
  method: 'get',
  handler: async (req) => {
    try {
      const { reservationTypeId, date } = req.query

      if (!reservationTypeId) {
        throw new APIError('reservationTypeId is required', 400)
      }

      if (!date) {
        throw new APIError('date is required (format: YYYY-MM-DD)', 400)
      }

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(date as string)) {
        throw new APIError('Invalid date format. Use YYYY-MM-DD', 400)
      }

      const slots = await calculateAvailability(
        req.payload,
        reservationTypeId as string | number,
        date as string,
      )

      const available = slots.some((slot) => slot.available > 0)

      return Response.json({
        available,
        timeSlots: slots,
      })
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }

      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error('[availabilityEndpoint] Error:', message)
      throw new APIError(`Failed to calculate availability: ${message}`, 500)
    }
  },
}

/**
 * GET /api/reservations/config
 * Returns resolved configuration for a reservation type (with inheritance)
 */
export const configEndpoint: Endpoint = {
  path: '/config',
  method: 'get',
  handler: async (req) => {
    try {
      const { reservationTypeId } = req.query

      if (!reservationTypeId) {
        throw new APIError('reservationTypeId is required', 400)
      }

      // Fetch reservation type
      const reservationType = (await req.payload.findByID({
        collection: 'reservation-types',
        id: reservationTypeId as string | number,
        depth: 1,
      })) as unknown as ReservationType

      // Resolve inheritance
      const resolved = await resolveReservationTypeConfig(req.payload, reservationType)

      return Response.json(resolved)
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }

      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error('[configEndpoint] Error:', message)
      throw new APIError(`Failed to fetch config: ${message}`, 500)
    }
  },
}

export const endpoints = [availabilityEndpoint, configEndpoint]
