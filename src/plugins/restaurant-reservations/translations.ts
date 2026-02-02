export type ReservationTranslations = {
  labels: {
    reservation: string
    reservationType: string
    date: string
    time: string
    people: string
    contactInfo: string
    guestName: string
    email: string
    phone: string
    selectType: string
    selectedTimePrefix: string
  }
  placeholders: {
    date: string
  }
  validation: {
    required: string
    invalidDate: string
    pastDate: string
    dateUnavailable: string
    dateOutOfRange: string
    timeUnavailable: string
    timeNoCapacity: string
    emailInvalid: string
    minPeople: string
    maxPeople: (max: number) => string
  }
  availability: {
    none: string
    available: string
    availableFew: (count: number) => string
    full: string
  }
  errors: {
    loadConfig: string
    loadAvailability: string
    unknown: string
  }
}

export type ReservationTranslationMap = Record<string, Partial<ReservationTranslations>>

const defaultTranslations: Record<string, ReservationTranslations> = {
  es: {
    labels: {
      reservation: 'Reserva',
      reservationType: 'Tipo de reserva',
      date: 'Fecha',
      time: 'Horario',
      people: 'Número de personas',
      contactInfo: 'Información de contacto',
      guestName: 'Nombre completo',
      email: 'Email',
      phone: 'Teléfono',
      selectType: 'Selecciona un tipo',
      selectedTimePrefix: 'Horario seleccionado:',
    },
    placeholders: {
      date: 'Selecciona una fecha',
    },
    validation: {
      required: 'Campo requerido',
      invalidDate: 'Fecha inválida',
      pastDate: 'No puedes seleccionar una fecha pasada',
      dateUnavailable: 'Fecha no disponible para este tipo de reserva',
      dateOutOfRange: 'Fecha fuera del rango permitido',
      timeUnavailable: 'Horario no disponible',
      timeNoCapacity: 'No hay disponibilidad para ese horario',
      emailInvalid: 'Email inválido',
      minPeople: 'Mínimo 1 persona',
      maxPeople: (max) => `Máximo ${max} personas`,
    },
    availability: {
      none: 'No hay franjas horarias disponibles',
      available: 'Disponible',
      availableFew: (count) => `${count} lugares disponibles`,
      full: 'Completo',
    },
    errors: {
      loadConfig: 'Error al cargar la configuración',
      loadAvailability: 'Error al verificar disponibilidad',
      unknown: 'Error desconocido',
    },
  },
  ca: {
    labels: {
      reservation: 'Reserva',
      reservationType: 'Tipus de reserva',
      date: 'Data',
      time: 'Horari',
      people: 'Nombre de persones',
      contactInfo: 'Informació de contacte',
      guestName: 'Nom complet',
      email: 'Email',
      phone: 'Telèfon',
      selectType: 'Selecciona un tipus',
      selectedTimePrefix: 'Horari seleccionat:',
    },
    placeholders: {
      date: 'Selecciona una data',
    },
    validation: {
      required: 'Camp requerit',
      invalidDate: 'Data invàlida',
      pastDate: 'No pots seleccionar una data passada',
      dateUnavailable: 'Data no disponible per a aquest tipus de reserva',
      dateOutOfRange: 'Data fora del rang permès',
      timeUnavailable: 'Horari no disponible',
      timeNoCapacity: 'No hi ha disponibilitat per a aquest horari',
      emailInvalid: 'Email invàlid',
      minPeople: 'Mínim 1 persona',
      maxPeople: (max) => `Màxim ${max} persones`,
    },
    availability: {
      none: 'No hi ha franges horàries disponibles',
      available: 'Disponible',
      availableFew: (count) => `${count} places disponibles`,
      full: 'Complet',
    },
    errors: {
      loadConfig: 'Error en carregar la configuració',
      loadAvailability: 'Error en verificar disponibilitat',
      unknown: 'Error desconegut',
    },
  },
  en: {
    labels: {
      reservation: 'Reservation',
      reservationType: 'Reservation type',
      date: 'Date',
      time: 'Time',
      people: 'Number of people',
      contactInfo: 'Contact information',
      guestName: 'Full name',
      email: 'Email',
      phone: 'Phone',
      selectType: 'Select a type',
      selectedTimePrefix: 'Selected time:',
    },
    placeholders: {
      date: 'Select a date',
    },
    validation: {
      required: 'Required field',
      invalidDate: 'Invalid date',
      pastDate: 'You cannot select a past date',
      dateUnavailable: 'Date not available for this reservation type',
      dateOutOfRange: 'Date out of allowed range',
      timeUnavailable: 'Time not available',
      timeNoCapacity: 'No availability for this time',
      emailInvalid: 'Invalid email',
      minPeople: 'Minimum 1 person',
      maxPeople: (max) => `Maximum ${max} people`,
    },
    availability: {
      none: 'No available time slots',
      available: 'Available',
      availableFew: (count) => `${count} spots available`,
      full: 'Full',
    },
    errors: {
      loadConfig: 'Error loading configuration',
      loadAvailability: 'Error checking availability',
      unknown: 'Unknown error',
    },
  },
}

let customTranslations: ReservationTranslationMap = {}

const mergeTranslations = (
  base: ReservationTranslations,
  overrides?: Partial<ReservationTranslations>,
): ReservationTranslations => {
  if (!overrides) return base

  return {
    labels: { ...base.labels, ...overrides.labels },
    placeholders: { ...base.placeholders, ...overrides.placeholders },
    validation: { ...base.validation, ...overrides.validation },
    availability: { ...base.availability, ...overrides.availability },
    errors: { ...base.errors, ...overrides.errors },
  }
}

export const setReservationTranslations = (translations?: ReservationTranslationMap) => {
  customTranslations = translations || {}
}

export const getReservationTranslations = (locale?: string): ReservationTranslations => {
  const normalized = locale && locale in defaultTranslations ? locale : 'es'
  const base = defaultTranslations[normalized]
  const overrides = customTranslations[normalized]
  return mergeTranslations(base, overrides)
}
