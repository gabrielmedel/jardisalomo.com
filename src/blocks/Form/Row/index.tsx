'use client'
import type { Control, FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'
import React from 'react'
import { cn } from '@/utilities/ui'
import type { ExtendedFormFieldBlock, FormRowBlock } from '../types'

type RowProps = FormRowBlock & {
  control: Control
  errors: Partial<FieldErrorsImpl>
  register: UseFormRegister<FieldValues>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderField: (field: ExtendedFormFieldBlock, index: number, props: any) => React.ReactNode
}

const getColumnWidthClass = (width?: string): string => {
  switch (width) {
    case 'full':
      return 'w-full'
    case 'half':
      return 'w-full md:w-1/2'
    case 'third':
      return 'w-full md:w-1/3'
    case 'quarter':
      return 'w-full md:w-1/4'
    case 'twoThirds':
      return 'w-full md:w-2/3'
    case 'threeQuarters':
      return 'w-full md:w-3/4'
    default:
      return 'w-full md:flex-1' // default to equal width columns
  }
}

export const Row: React.FC<RowProps> = ({
  columns,
  control,
  errors,
  register,
  form,
  renderField,
}) => {
  if (!columns || columns.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-4 -mx-2">
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={cn('px-2', getColumnWidthClass(column.width))}
        >
          <div className="space-y-4">
            {column.fields?.map((field, fieldIndex) =>
              renderField(field, fieldIndex, {
                form,
                control,
                errors,
                register,
              }),
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
