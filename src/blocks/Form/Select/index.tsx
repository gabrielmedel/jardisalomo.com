import type { SelectField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'

export const Select: React.FC<
  SelectField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
  }
> = ({ name, control, errors, label, options, required, width, defaultValue }) => {
  return (
    <Width width={width}>
      <Label
        htmlFor={name}
        className="block mb-2 text-sm font-sans font-normal text-primary tracking-normal"
      >
        {label}
        {required && (
          <span className="text-accent ml-1">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>
      <Controller
        control={control}
        defaultValue={defaultValue}
        name={name}
        render={({ field: { onChange, value } }) => {
          const controlledValue = options.find((t) => t.value === value)

          return (
            <SelectComponent onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
              <SelectTrigger
                className="w-full h-12 px-4 py-3 bg-white border-2 border-accent/30 rounded-sm text-base font-sans font-light text-primary focus:border-primary focus:ring-0 transition-colors"
                id={name}
              >
                <SelectValue
                  placeholder={label}
                  className="uppercase tracking-wider text-primary/40"
                />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-accent/30">
                {options.map(({ label, value }) => {
                  return (
                    <SelectItem
                      key={value}
                      value={value}
                      className="font-sans font-light text-base text-primary hover:bg-pastel"
                    >
                      {label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </SelectComponent>
          )
        }}
        rules={{ required }}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
