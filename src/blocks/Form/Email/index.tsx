import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Email: React.FC<
  EmailField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
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
      <Input
        defaultValue={defaultValue}
        id={name}
        type="text"
        className="w-full h-12 px-4 py-3 bg-white border-2 border-accent/30 rounded-sm text-base font-sans font-light text-primary placeholder:text-primary/40 placeholder:lowercase focus:border-primary focus:ring-0 transition-colors"
        {...register(name, { pattern: /^\S[^\s@]*@\S+$/, required })}
      />

      {errors[name] && <Error name={name} />}
    </Width>
  )
}
