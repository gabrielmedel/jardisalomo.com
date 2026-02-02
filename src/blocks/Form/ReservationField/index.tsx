'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { DatePicker } from './DatePicker'
import { TimeRangePicker } from './TimeRangePicker'
import { getReservationTranslations, type ReservationTranslations } from '@/plugins/restaurant-reservations/translations'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { Width } from '../Width'
import { Error } from '../Error'

interface ReservationFieldProps {
  name?: string
  label?: string
  required?: boolean
  width?: number
  blockName?: string
  id?: string | number
  reservationType: string | number
  defaultPeople?: number
  maxPeople?: number
  locale?: string
}

interface ResolvedConfig {
  id: string | number
  slug: string
  name: string
  availableDays?: number[]
  dateRange?: {
    startDate?: string
    endDate?: string
  }
  timeSlots?: Array<{
    startTime: string
    endTime: string
    maxCapacity: number
  }>
}

interface TimeSlotAvailability {
  startTime: string
  endTime: string
  maxCapacity: number
  currentOccupancy: number
  available: number
}

interface ReservationTypeOption {
  id: string | number
  name: string
}

const normalizeDate = (value: string) => {
  const dateValue = new Date(value)
  if (Number.isNaN(dateValue.getTime())) {
    return null
  }
  dateValue.setHours(0, 0, 0, 0)
  return dateValue
}

const getPastDateError = (selected: Date, translations: ReservationTranslations) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return selected < today ? translations.validation.pastDate : null
}

const getAvailableDayError = (
  selected: Date,
  config: ResolvedConfig,
  translations: ReservationTranslations,
) => {
  if (!Array.isArray(config.availableDays) || config.availableDays.length === 0) {
    return null
  }
  const day = selected.getDay()
  return config.availableDays.includes(day)
    ? null
    : translations.validation.dateUnavailable
}

const getDateRangeError = (
  selected: Date,
  config: ResolvedConfig,
  translations: ReservationTranslations,
) => {
  if (config.dateRange?.startDate) {
    const start = normalizeDate(config.dateRange.startDate)
    if (start && selected < start) {
      return translations.validation.dateOutOfRange
    }
  }

  if (config.dateRange?.endDate) {
    const end = normalizeDate(config.dateRange.endDate)
    if (end && selected > end) {
      return translations.validation.dateOutOfRange
    }
  }

  return null
}

const validateReservationDate = (
  value: string,
  config: ResolvedConfig | null,
  required: boolean,
  translations: ReservationTranslations,
) => {
  if (!value) return required ? translations.validation.required : true
  if (!config) return true

  const selected = normalizeDate(value)
  if (!selected) {
    return translations.validation.invalidDate
  }

  return (
    getPastDateError(selected, translations) ||
    getAvailableDayError(selected, config, translations) ||
    getDateRangeError(selected, config, translations) ||
    true
  )
}

const validateTimeSelection = (
  value: string,
  availableSlots: TimeSlotAvailability[],
  pairedTime: string | undefined,
  numberOfPeople: number,
  required: boolean,
  isStartTime: boolean,
  translations: ReservationTranslations,
) => {
  if (!value) return required ? translations.validation.required : true

  if (!pairedTime) {
    return true
  }

  const matchingSlot = availableSlots.find((slot) =>
    isStartTime
      ? slot.startTime === value && slot.endTime === pairedTime
      : slot.startTime === pairedTime && slot.endTime === value,
  )
  if (!matchingSlot) {
    return translations.validation.timeUnavailable
  }

  if (matchingSlot.available !== undefined && matchingSlot.available < numberOfPeople) {
    return translations.validation.timeNoCapacity
  }

  return true
}

export default function ReservationField({
  name,
  label,
  required = false,
  width,
  blockName,
  reservationType,
  defaultPeople = 2,
  maxPeople = 10,
  locale = 'ca',
}: ReservationFieldProps) {
  const {
    register,
    getValues,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext()

  const isRequired = true
  const translations = getReservationTranslations(locale)
  const resolvedLabel = label || translations.labels.reservation

  // Normalize reservationType prop - extract ID if it's an object
  const initialReservationType = React.useMemo(() => {
    if (!reservationType) return ''
    
    // If it's an object with id property
    if (typeof reservationType === 'object' && reservationType !== null) {
      const obj = reservationType as Record<string, unknown>
      return String(obj.id || '')
    }
    
    // If it's already a string/number
    return String(reservationType)
  }, [reservationType])

  const [reservationTypes, setReservationTypes] = useState<ReservationTypeOption[]>([])
  const [config, setConfig] = useState<ResolvedConfig | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlotAvailability[]>([])
  const [loadingConfig, setLoadingConfig] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fieldName = name || blockName || 'reservation'

  // Watch form values
  const rawReservationTypeValue = watch(`${fieldName}_reservationType`)
  const selectedReservationTypeValue = React.useMemo(() => {
    // Handle if value is an object with id property
    if (rawReservationTypeValue && typeof rawReservationTypeValue === 'object') {
      const obj = rawReservationTypeValue as Record<string, unknown>
      return String(obj.id || '')
    }
    // Handle if value is already a string/number
    if (rawReservationTypeValue) {
      return String(rawReservationTypeValue)
    }
    // Fallback to initial value
    return initialReservationType || ''
  }, [rawReservationTypeValue, initialReservationType])
  const selectedDate = watch(`${fieldName}_date`)
  const selectedStartTime = watch(`${fieldName}_startTime`)
  const selectedEndTime = watch(`${fieldName}_endTime`)
  const numberOfPeople = watch(`${fieldName}_numberOfPeople`) || defaultPeople

  // Fetch reservation types on mount
  useEffect(() => {
    const fetchReservationTypes = async () => {
      try {
        const response = await fetch('/api/reservation-types?limit=100&depth=0')
        if (!response.ok) {
          setError(translations.errors.loadConfig)
          return
        }
        const data = (await response.json()) as { docs?: Array<{ id: string | number; name: string }> }
        const docs = Array.isArray(data?.docs) ? data.docs : []
        setReservationTypes(
          docs.map((doc) => ({
            id: doc.id,
            name: doc.name,
          })),
        )
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError((err as Error).message)
        } else {
          setError(translations.errors.unknown)
        }
      }
    }

    fetchReservationTypes()
  }, [])

  // Initialize default reservation type value (only once)
  useEffect(() => {
    if (!initialReservationType) return
    const currentValue = getValues(`${fieldName}_reservationType`)
    if (!currentValue) {
      setValue(`${fieldName}_reservationType`, initialReservationType, { shouldValidate: true })
    }
  }, [fieldName, getValues, initialReservationType, setValue])

  // Reset dependent fields when reservation type changes
  useEffect(() => {
    if (!selectedReservationTypeValue) return
    setValue(`${fieldName}_date`, '', { shouldValidate: true })
    setValue(`${fieldName}_startTime`, '', { shouldValidate: true })
    setValue(`${fieldName}_endTime`, '', { shouldValidate: true })
    setAvailableSlots([])
  }, [fieldName, selectedReservationTypeValue, setValue])

  // Fetch reservation type config on mount
  useEffect(() => {
    const fetchConfig = async () => {
      if (!selectedReservationTypeValue) return

      setLoadingConfig(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/restaurant-reservations/config?reservationTypeId=${selectedReservationTypeValue}`,
        )

        if (!response.ok) {
          setError(translations.errors.loadConfig)
          setLoadingConfig(false)
          return
        }

        const data = (await response.json()) as ResolvedConfig
        setConfig(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError((err as Error).message)
        } else {
          setError(translations.errors.unknown)
        }
      } finally {
        setLoadingConfig(false)
      }
    }

    fetchConfig()
  }, [selectedReservationTypeValue])

  // Fetch availability when date changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedReservationTypeValue || !selectedDate) {
        setAvailableSlots([])
        return
      }

      setLoadingSlots(true)
      setError(null)

      try {
        // Format date as YYYY-MM-DD
        const dateObj = typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate
        const formattedDate =
          dateObj instanceof Date ? dateObj.toISOString().split('T')[0] : selectedDate

        const response = await fetch(
          `/api/restaurant-reservations/availability?reservationTypeId=${selectedReservationTypeValue}&date=${formattedDate}`,
        )

        if (!response.ok) {
          setError(translations.errors.loadAvailability)
          setAvailableSlots([])
          setLoadingSlots(false)
          return
        }

        const data = (await response.json()) as { timeSlots?: TimeSlotAvailability[] }
        setAvailableSlots(data.timeSlots || [])
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError((err as Error).message)
        } else {
          setError(translations.errors.unknown)
        }
        setAvailableSlots([])
      } finally {
        setLoadingSlots(false)
      }
    }

    fetchAvailability()
  }, [selectedReservationTypeValue, selectedDate])

  // Handle date selection
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Format date as YYYY-MM-DD in local timezone
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      setValue(`${fieldName}_date`, `${year}-${month}-${day}`, {
        shouldValidate: true,
      })
    } else {
      setValue(`${fieldName}_date`, '', { shouldValidate: true })
    }
    // Clear time selection when date changes
    setValue(`${fieldName}_startTime`, '', { shouldValidate: true })
    setValue(`${fieldName}_endTime`, '', { shouldValidate: true })
  }

  // Handle time slot selection
  const handleTimeSelect = (startTime: string, endTime: string) => {
    setValue(`${fieldName}_startTime`, startTime, { shouldValidate: true })
    setValue(`${fieldName}_endTime`, endTime, { shouldValidate: true })
  }

  // Calculate disabled days based on config
  const disabledDays = useMemo(() => {
    if (!config?.availableDays || config.availableDays.length === 0) {
      return []
    }
    // Return days NOT in availableDays (invert)
    const allDays = [0, 1, 2, 3, 4, 5, 6]
    return allDays.filter((day) => !config.availableDays?.includes(day))
  }, [config])

  // Calculate min/max dates
  const minDate = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (config?.dateRange?.startDate) {
      const configStart = new Date(config.dateRange.startDate)
      return new Date(Math.max(configStart.getTime(), today.getTime()))
    }

    return today
  }, [config])

  const maxDate = useMemo(() => {
    if (config?.dateRange?.endDate) {
      return new Date(config.dateRange.endDate)
    }
    return undefined
  }, [config])

  useEffect(() => {
    if (selectedReservationTypeValue && selectedDate) {
      void trigger([`${fieldName}_startTime`, `${fieldName}_endTime`])
    }
  }, [fieldName, selectedReservationTypeValue, selectedDate, numberOfPeople, availableSlots, trigger])

  if (loadingConfig) {
    return (
      <Width width={width}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Width>
    )
  }

  if (error) {
    return (
      <Width width={width}>
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-800">{error}</div>
      </Width>
    )
  }

  return (
    <Width width={width}>
      <div className="space-y-6">
        {resolvedLabel && (
          <h3 className="text-xl font-normal">
            {resolvedLabel}
            {isRequired && <span className="text-red-600 ml-1">*</span>}
          </h3>
        )}

        {/* Hidden fields for form submission */}
        <input
          type="hidden"
          {...register(`${fieldName}_date`, {
            required: isRequired ? translations.validation.required : false,
            validate: (value) => validateReservationDate(value, config, isRequired, translations),
          })}
        />
        <input
          type="hidden"
          {...register(`${fieldName}_startTime`, {
            required: isRequired ? translations.validation.required : false,
            validate: (value) =>
              validateTimeSelection(
                value,
                availableSlots,
                getValues(`${fieldName}_endTime`),
                numberOfPeople,
                isRequired,
                true,
                translations,
              ),
          })}
        />
        <input
          type="hidden"
          {...register(`${fieldName}_endTime`, {
            required: isRequired ? translations.validation.required : false,
            validate: (value) =>
              validateTimeSelection(
                value,
                availableSlots,
                getValues(`${fieldName}_startTime`),
                numberOfPeople,
                isRequired,
                false,
                translations,
              ),
          })}
        />

        {/* Reservation Type Selector */}
        <div className="space-y-2">
          <Label htmlFor={`${fieldName}_reservationType`}>
            {translations.labels.reservationType} {isRequired && <span className="text-red-600">*</span>}
          </Label>
          <select
            id={`${fieldName}_reservationType`}
            {...register(`${fieldName}_reservationType`, {
              required: isRequired ? translations.validation.required : false,
              onChange: (event) => {
                const value = event.target.value
                setValue(`${fieldName}_reservationType`, value, { shouldValidate: true })
              },
            })}
            value={selectedReservationTypeValue || ''}
            className="h-12 w-full rounded-md border-2 border-accent/30 bg-white px-3 text-sm focus:border-primary focus:outline-none"
          >
            <option value="" disabled>
              {translations.labels.selectType}
            </option>
            {reservationTypes.map((type) => (
              <option key={String(type.id)} value={String(type.id)}>
                {type.name}
              </option>
            ))}
          </select>
          {errors[`${fieldName}_reservationType`] && <Error name={`${fieldName}_reservationType`} />}
        </div>

        {/* Date Picker */}
        <div className="space-y-2">
          <Label htmlFor={`${fieldName}_date`}>
            {translations.labels.date} {isRequired && <span className="text-red-600">*</span>}
          </Label>
          <DatePicker
            value={selectedDate ? new Date(selectedDate) : undefined}
            onChange={handleDateChange}
            disabledDays={disabledDays}
            minDate={minDate}
            maxDate={maxDate}
            locale={locale}
            placeholder={translations.placeholders.date}
          />
          {errors[`${fieldName}_date`] && <Error name={`${fieldName}_date`} />}
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="space-y-2">
            <Label htmlFor={`${fieldName}_time`}>
              {translations.labels.time} {isRequired && <span className="text-red-600">*</span>}
            </Label>
            {loadingSlots ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <TimeRangePicker
                slots={availableSlots}
                selectedStart={selectedStartTime}
                selectedEnd={selectedEndTime}
                onSelect={handleTimeSelect}
                numberOfPeople={numberOfPeople}
                labels={{
                  none: translations.availability.none,
                  available: translations.availability.available,
                  availableFew: translations.availability.availableFew,
                  full: translations.availability.full,
                  selectedPrefix: translations.labels.selectedTimePrefix,
                }}
              />
            )}
            {errors[`${fieldName}_startTime`] && <Error name={`${fieldName}_startTime`} />}
          </div>
        )}

        {/* Number of People */}
        <div className="space-y-2">
          <Label htmlFor={`${fieldName}_numberOfPeople`}>
            {translations.labels.people} {isRequired && <span className="text-red-600">*</span>}
          </Label>
          <Input
            type="number"
            id={`${fieldName}_numberOfPeople`}
            min={1}
            max={maxPeople}
            defaultValue={defaultPeople}
            {...register(`${fieldName}_numberOfPeople`, {
              required: isRequired ? translations.validation.required : false,
              min: { value: 1, message: translations.validation.minPeople },
              max: { value: maxPeople, message: translations.validation.maxPeople(maxPeople) },
            })}
            className="h-12 border-2 border-accent/30 focus:border-primary"
          />
          {errors[`${fieldName}_numberOfPeople`] && <Error name={`${fieldName}_numberOfPeople`} />}
        </div>

        {/* Contact Information */}
        <div className="space-y-4 pt-4 border-t-2 border-accent/30">
          <h4 className="font-normal">{translations.labels.contactInfo}</h4>

          <div className="space-y-2">
            <Label htmlFor={`${fieldName}_guestName`}>
              {translations.labels.guestName} {isRequired && <span className="text-red-600">*</span>}
            </Label>
            <Input
              type="text"
              id={`${fieldName}_guestName`}
              {...register(`${fieldName}_guestName`, {
                required: isRequired ? translations.validation.required : false,
              })}
              className="h-12 border-2 border-accent/30 focus:border-primary"
            />
            {errors[`${fieldName}_guestName`] && <Error name={`${fieldName}_guestName`} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${fieldName}_email`}>
              {translations.labels.email} {isRequired && <span className="text-red-600">*</span>}
            </Label>
            <Input
              type="email"
              id={`${fieldName}_email`}
              {...register(`${fieldName}_email`, {
                required: isRequired ? translations.validation.required : false,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: translations.validation.emailInvalid,
                },
              })}
              className="h-12 border-2 border-accent/30 focus:border-primary"
            />
            {errors[`${fieldName}_email`] && <Error name={`${fieldName}_email`} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${fieldName}_phone`}>
              {translations.labels.phone} {isRequired && <span className="text-red-600">*</span>}
            </Label>
            <Input
              type="tel"
              id={`${fieldName}_phone`}
              {...register(`${fieldName}_phone`, {
                required: isRequired ? translations.validation.required : false,
              })}
              className="h-12 border-2 border-accent/30 focus:border-primary"
            />
            {errors[`${fieldName}_phone`] && <Error name={`${fieldName}_phone`} />}
          </div>
        </div>
      </div>
    </Width>
  )
}
