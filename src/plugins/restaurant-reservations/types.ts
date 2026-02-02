/**
 * Time slot configuration for a reservation type
 */
export interface TimeSlot {
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  maxCapacity: number
  id?: string
}

/**
 * Reservation type configuration
 */
export interface ReservationType {
  id: string | number
  slug: string
  name: string
  inheritsFrom?: ReservationType | string | number | null
  availableDays?: number[] // 0-6 (Sunday-Saturday)
  dateRange?: {
    startDate?: string
    endDate?: string
  }
  timeSlots?: TimeSlot[]
  updatedAt: string
  createdAt: string
}

/**
 * Resolved reservation type after inheritance
 */
export interface ResolvedReservationType extends ReservationType {
  inheritsFrom?: null
}

/**
 * Reservation document
 */
export interface Reservation {
  id: string | number
  reservationType: ReservationType | string | number
  date: string
  startTime: string
  endTime: string
  numberOfPeople: number
  guestName: string
  email: string
  phone: string
  status: 'pending' | 'confirmed' | 'cancelled'
  formSubmission?: string | number | null
  updatedAt: string
  createdAt: string
}

/**
 * Time slot with availability info
 */
export interface TimeSlotAvailability extends TimeSlot {
  currentOccupancy: number
  available: number
}

/**
 * Availability response
 */
export interface AvailabilityResponse {
  available: boolean
  timeSlots: TimeSlotAvailability[]
}

/**
 * Plugin configuration
 */
export interface RestaurantReservationsPluginConfig {
  enabled?: boolean
  /**
   * Collections to add restaurant-reservations plugin to
   * Default: adds to form builder
   */
  collections?: string[]
  /**
   * Custom translations keyed by locale.
   */
  translations?: import('./translations').ReservationTranslationMap
}
