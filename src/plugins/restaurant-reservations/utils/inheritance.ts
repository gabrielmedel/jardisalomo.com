import type { Payload } from 'payload'
import type { ReservationType, ResolvedReservationType } from '../types'

/**
 * Resolves a reservation type configuration by applying inheritance.
 * Only supports 1 level of inheritance (not recursive).
 *
 * @param payload - Payload instance
 * @param reservationType - The reservation type to resolve
 * @returns The resolved configuration with inheritance applied
 */
export async function resolveReservationTypeConfig(
  payload: Payload,
  reservationType: ReservationType,
): Promise<ResolvedReservationType> {
  // If no inheritance, return as-is
  if (!reservationType.inheritsFrom) {
    return {
      ...reservationType,
      availableDays: (reservationType.availableDays || []).map(Number) as number[],
      dateRange: {
        startDate: reservationType.dateRange?.startDate || undefined,
        endDate: reservationType.dateRange?.endDate || undefined,
      },
      inheritsFrom: null,
    }
  }

  try {
    // Get parent ID
    const parentId =
      typeof reservationType.inheritsFrom === 'object' && reservationType.inheritsFrom !== null
        ? reservationType.inheritsFrom.id
        : reservationType.inheritsFrom

    // Validate parentId is a valid number or string
    if (!parentId || (typeof parentId !== 'string' && typeof parentId !== 'number')) {
      console.warn('[resolveReservationTypeConfig] Invalid parentId, skipping inheritance')
      return {
        ...reservationType,
        inheritsFrom: null,
      }
    }

    // Fetch parent configuration
    const parent = await payload.findByID({
      collection: 'reservation-types',
      id: parentId,
      depth: 0, // Don't populate relationships
    })

    // Merge configurations (child overrides parent)
    return {
      id: reservationType.id,
      slug: reservationType.slug,
      name: reservationType.name,
      // Use child's availableDays if defined, otherwise use parent's
      availableDays:
        reservationType.availableDays && reservationType.availableDays.length > 0
          ? (reservationType.availableDays.map(Number) as number[])
          : ((parent.availableDays || []).map(Number) as number[]),
      // Use child's dateRange if defined, otherwise use parent's
      dateRange:
        reservationType.dateRange?.startDate || reservationType.dateRange?.endDate
          ? {
              startDate: reservationType.dateRange.startDate || undefined,
              endDate: reservationType.dateRange.endDate || undefined,
            }
          : {
              startDate: parent.dateRange?.startDate || undefined,
              endDate: parent.dateRange?.endDate || undefined,
            },
      // Use child's timeSlots if defined, otherwise use parent's
      timeSlots:
        reservationType.timeSlots && reservationType.timeSlots.length > 0
          ? reservationType.timeSlots.map((slot) => ({
              startTime: slot.startTime,
              endTime: slot.endTime,
              maxCapacity: slot.maxCapacity,
              id: slot.id || undefined,
            }))
          : (parent.timeSlots || []).map((slot: any) => ({
              startTime: slot.startTime,
              endTime: slot.endTime,
              maxCapacity: slot.maxCapacity,
              id: slot.id || undefined,
            })),
      inheritsFrom: null, // Clear inheritance after resolution
      updatedAt: reservationType.updatedAt,
      createdAt: reservationType.createdAt,
    }
  } catch (error) {
    console.error('[resolveReservationTypeConfig] Error resolving inheritance:', error)
    // Fallback to current config without inheritance if error
    return {
      ...reservationType,
      inheritsFrom: null,
    }
  }
}

/**
 * Validates that a reservation type doesn't create a circular inheritance.
 *
 * @param payload - Payload instance
 * @param typeId - ID of the type being checked
 * @param parentId - ID of the parent type
 * @returns true if valid (no circular inheritance), false otherwise
 */
export async function validateNoCircularInheritance(
  payload: Payload,
  typeId: string | number,
  parentId: string | number,
): Promise<boolean> {
  // Can't inherit from itself
  if (typeId === parentId) {
    return false
  }

  try {
    // Check if parent inherits from the child (would create circular)
    const parent = await payload.findByID({
      collection: 'reservation-types',
      id: parentId,
      depth: 1,
    })

    if (!parent.inheritsFrom) {
      return true
    }

    const grandParentId =
      typeof parent.inheritsFrom === 'object' && parent.inheritsFrom !== null
        ? parent.inheritsFrom.id
        : parent.inheritsFrom

    // With 1 level max, grandparent shouldn't be our type
    return grandParentId !== typeId
  } catch (error) {
    console.error('[validateNoCircularInheritance] Error:', error)
    return false
  }
}
