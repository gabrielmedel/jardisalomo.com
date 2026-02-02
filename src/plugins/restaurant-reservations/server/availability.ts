import type { Payload } from 'payload'
import type { ReservationType, TimeSlotAvailability, Reservation } from '../types'
import { resolveReservationTypeConfig } from '../utils/inheritance'

/**
 * Calculate availability for time slots on a given date
 *
 * @param payload - Payload instance
 * @param reservationTypeId - ID of the reservation type
 * @param date - Date to check (YYYY-MM-DD format)
 * @returns Array of time slots with availability information
 */
export async function calculateAvailability(
  payload: Payload,
  reservationTypeId: string | number,
  date: string,
): Promise<TimeSlotAvailability[]> {
  try {
    // Fetch reservation type
    const reservationType = (await payload.findByID({
      collection: 'reservation-types',
      id: reservationTypeId,
      depth: 1,
    })) as unknown as ReservationType

    // Resolve inheritance
    const resolved = await resolveReservationTypeConfig(payload, reservationType)

    if (!resolved.timeSlots || resolved.timeSlots.length === 0) {
      return []
    }

    // Fetch all confirmed reservations for this type and date
    const { docs: reservations } = await payload.find({
      collection: 'reservations',
      where: {
        and: [
          {
            reservationType: {
              equals: reservationTypeId,
            },
          },
          {
            date: {
              equals: date,
            },
          },
          {
            status: {
              equals: 'confirmed',
            },
          },
        ],
      },
      limit: 1000, // Get all reservations for the day
    })

    // Calculate occupancy for each time slot
    const slotsWithAvailability: TimeSlotAvailability[] = resolved.timeSlots.map((slot) => {
      // Count people in overlapping reservations
      const overlappingReservations = (reservations as unknown as Reservation[]).filter(
        (reservation) => {
          // Check if reservation overlaps with this slot
          return timeRangesOverlap(
            slot.startTime,
            slot.endTime,
            reservation.startTime,
            reservation.endTime,
          )
        },
      )

      const currentOccupancy = overlappingReservations.reduce(
        (sum, res) => sum + (res.numberOfPeople || 0),
        0,
      )

      const available = Math.max(0, slot.maxCapacity - currentOccupancy)

      return {
        ...slot,
        currentOccupancy,
        available,
      }
    })

    return slotsWithAvailability
  } catch (error) {
    console.error('[calculateAvailability] Error:', error)
    throw error
  }
}

/**
 * Check if two time ranges overlap
 *
 * @param start1 - Start time of first range (HH:mm)
 * @param end1 - End time of first range (HH:mm)
 * @param start2 - Start time of second range (HH:mm)
 * @param end2 - End time of second range (HH:mm)
 * @returns true if ranges overlap
 */
function timeRangesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
  const start1Minutes = timeToMinutes(start1)
  const end1Minutes = timeToMinutes(end1)
  const start2Minutes = timeToMinutes(start2)
  const end2Minutes = timeToMinutes(end2)

  // Ranges overlap if one starts before the other ends
  return start1Minutes < end2Minutes && start2Minutes < end1Minutes
}

/**
 * Convert time string to minutes since midnight
 *
 * @param time - Time string in HH:mm format
 * @returns Minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}
