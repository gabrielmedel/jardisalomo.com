'use client'

import * as React from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { ca, es, enUS } from 'date-fns/locale'

interface DatePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  disabled?: boolean
  disabledDays?: number[] // 0-6 (Sunday-Saturday)
  minDate?: Date
  maxDate?: Date
  placeholder?: string
  className?: string
  locale?: string
}

export function DatePicker({
  value,
  onChange,
  disabled = false,
  disabledDays = [],
  minDate,
  maxDate,
  placeholder = 'Selecciona una fecha',
  className,
  locale = 'ca',
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Get date-fns locale
  const dateFnsLocale = React.useMemo(() => {
    switch (locale) {
      case 'es':
        return es
      case 'en':
        return enUS
      case 'ca':
      default:
        return ca
    }
  }, [locale])

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return placeholder

    let localeString = 'ca-ES'
    if (locale === 'en') {
      localeString = 'en-US'
    } else if (locale === 'es') {
      localeString = 'es-ES'
    }

    return new Intl.DateTimeFormat(localeString, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  // Disable specific days of the week
  const disableDay = (date: Date) => {
    const dayOfWeek = date.getDay()
    return disabledDays.includes(dayOfWeek)
  }

  // Disable dates outside range
  const disableOutOfRange = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const isDateDisabled = (date: Date) => {
    return disableDay(date) || disableOutOfRange(date)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal h-12 border-2 border-accent/30 rounded-md',
            !value && 'text-muted-foreground',
            className,
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="capitalize">{formatDate(value)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
          }}
          disabled={isDateDisabled}
          locale={dateFnsLocale}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
