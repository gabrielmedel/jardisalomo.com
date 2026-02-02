import type { CheckboxField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { useFormContext } from 'react-hook-form'

import { Checkbox as CheckboxUi } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Checkbox: React.FC<
  CheckboxField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  const props = register(name, { required: required })
  const { setValue } = useFormContext()

  return (
    <Width width={width}>
      <div className="flex items-start gap-3 p-4 bg-white border-2 border-accent/30 rounded-sm hover:border-primary transition-colors">
        <CheckboxUi
          defaultChecked={defaultValue}
          id={name}
          className="mt-1 border-2 border-accent data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          {...props}
          onCheckedChange={(checked) => {
            setValue(props.name, checked)
          }}
        />
        <Label
          htmlFor={name}
          className="flex-1 text-sm font-sans font-light text-primary leading-relaxed cursor-pointer"
        >
          {required && (
            <span className="text-accent mr-1">
              * <span className="sr-only">(required)</span>
            </span>
          )}
          {label}
        </Label>
      </div>
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
