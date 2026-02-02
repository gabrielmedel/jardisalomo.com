'use client'

import * as React from 'react'
import { useFormContext } from 'react-hook-form'

export const Error = ({ name }: { name: string }) => {
  const {
    formState: { errors },
  } = useFormContext()
  return (
    <div className="mt-2 text-destructive text-sm font-sans font-light">
      {(errors[name]?.message as string) || 'Aquest camp és obligatori'}
    </div>
  )
}
