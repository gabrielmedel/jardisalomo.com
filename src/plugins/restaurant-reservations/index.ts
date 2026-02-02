import type { Config, Plugin } from 'payload'
import { ReservationTypes } from './collections/reservationTypes'
import { Reservations } from './collections/reservations'
import { endpoints } from './server/endpoints'
import { createReservationOnSubmission } from './server/formSubmissionHook'
import type { RestaurantReservationsPluginConfig } from './types'
import { setReservationTranslations } from './translations'

/**
 * Restaurant Reservations Plugin
 *
 * Provides a complete reservation system for restaurants with:
 * - Configurable reservation types with inheritance
 * - Time slot management with capacity
 * - Availability checking
 * - Form integration via reservationField
 * - Automatic reservation creation via form actions
 */
export const restaurantReservationsPlugin =
  (pluginConfig?: RestaurantReservationsPluginConfig): Plugin =>
  (incomingConfig: Config): Config => {
    const enabled = pluginConfig?.enabled !== false

    if (!enabled) {
      return incomingConfig
    }

    setReservationTranslations(pluginConfig?.translations)

    const collections =
      incomingConfig.collections?.map((collection) => {
        if (collection.slug === 'form-submissions') {
          return {
            ...collection,
            hooks: {
              ...collection.hooks,
              afterChange: [
                ...(collection.hooks?.afterChange || []),
                createReservationOnSubmission,
              ],
            },
          }
        }
        return collection
      }) || []

    return {
      ...incomingConfig,
      collections: [...collections, ReservationTypes, Reservations],
      endpoints: [
        ...(incomingConfig.endpoints || []),
        ...endpoints.map((endpoint) => ({
          ...endpoint,
          path: `/restaurant-reservations${endpoint.path}`,
        })),
      ],
    }
  }

export * from './types'
export { ReservationTypes } from './collections/reservationTypes'
export { Reservations } from './collections/reservations'
