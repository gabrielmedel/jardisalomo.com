import type { SupportedLocale } from './locales'

interface CalendarLocale {
  days: string[]
  months: string[]
}

const locales: Record<SupportedLocale, CalendarLocale> = {
  es: {
    days: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    months: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
  },
  ca: {
    days: ['dg', 'dl', 'dt', 'dc', 'dj', 'dv', 'ds'],
    months: [
      'Gener',
      'Febrer',
      'Març',
      'Abril',
      'Maig',
      'Juny',
      'Juliol',
      'Agost',
      'Setembre',
      'Octubre',
      'Novembre',
      'Desembre',
    ],
  },
  en: {
    days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  },
}

export function getCalendarLocale(locale: string): CalendarLocale {
  return locales[locale as SupportedLocale] || locales.ca
}
