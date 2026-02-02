'use client'

import * as React from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface TimeSlot {
  startTime: string
  endTime: string
  maxCapacity: number
  currentOccupancy?: number
  available?: number
}

interface TimeRangePickerProps {
  slots: TimeSlot[]
  selectedStart?: string
  selectedEnd?: string
  onSelect: (startTime: string, endTime: string) => void
  disabled?: boolean
  className?: string
  numberOfPeople?: number
  labels?: {
    none: string
    available: string
    availableFew: (count: number) => string
    full: string
    selectedPrefix: string
  }
}

export function TimeRangePicker({
  slots,
  selectedStart,
  selectedEnd,
  onSelect,
  disabled = false,
  className,
  numberOfPeople = 1,
  labels,
}: TimeRangePickerProps) {
  const availabilityLabels = labels || {
    none: 'No hay franjas horarias disponibles',
    available: 'Disponible',
    availableFew: (count: number) => `${count} lugares disponibles`,
    full: 'Completo',
    selectedPrefix: 'Horario seleccionado:',
  }
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    return `${hours}:${minutes}`
  }

  const isSlotDisabled = (slot: TimeSlot) => {
    if (disabled) return true
    // Disable if not enough capacity
    if (slot.available !== undefined && slot.available < numberOfPeople) {
      return true
    }
    return false
  }

  const isSlotSelected = (slot: TimeSlot) => {
    return slot.startTime === selectedStart && slot.endTime === selectedEnd
  }

  const getAvailabilityLabel = (slot: TimeSlot) => {
    if (slot.available === undefined) return null

    if (slot.available === 0) {
      return availabilityLabels.full
    }

    if (slot.available < 5) {
      return availabilityLabels.availableFew(slot.available)
    }

    return availabilityLabels.available
  }

  const getAvailabilityColor = (slot: TimeSlot) => {
    if (slot.available === undefined) return 'text-muted-foreground'

    if (slot.available === 0) {
      return 'text-red-600'
    }

    if (slot.available < 5) {
      return 'text-orange-600'
    }

    return 'text-green-600'
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="mx-auto h-12 w-12 mb-2 opacity-50" />
        <p>{availabilityLabels.none}</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {slots.map((slot, index) => {
          const slotDisabled = isSlotDisabled(slot)
          const selected = isSlotSelected(slot)

          return (
            <button
              key={index}
              type="button"
              disabled={slotDisabled}
              onClick={() => onSelect(slot.startTime, slot.endTime)}
              className={cn(
                'relative flex flex-col items-center justify-center p-4 border-2 rounded-full transition-all',
                'hover:scale-105 active:scale-95',
                selected
                  ? 'border-primary bg-primary/10 ring-2 ring-primary'
                  : 'border-accent/30 hover:border-primary/50',
                slotDisabled && 'opacity-50 cursor-not-allowed hover:scale-100',
              )}
            >
              <div className="flex items-center gap-2 text-lg font-normal">
                <Clock className="h-5 w-5" />
                <span>
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </span>
              </div>

              {slot.available !== undefined && (
                <div className={cn('text-sm mt-2', getAvailabilityColor(slot))}>
                  {getAvailabilityLabel(slot)}
                </div>
              )}

              {selected && (
                <div className="absolute top-2 right-2">
                  <div className="h-3 w-3 bg-primary rounded-full" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selectedStart && selectedEnd && (
        <div className="mt-4 p-4 bg-primary/5 border-2 border-primary/20 rounded-lg">
          <p className="text-sm font-normal text-center">
            {availabilityLabels.selectedPrefix} {formatTime(selectedStart)} - {formatTime(selectedEnd)}
          </p>
        </div>
      )}
    </div>
  )
}
