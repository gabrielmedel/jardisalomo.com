'use client'
import React from 'react'
import { Calendar, Clock } from 'lucide-react'

interface MenuInfoItemProps {
  type: 'date' | 'time'
  label: string
}

export const MenuInfoItem: React.FC<MenuInfoItemProps> = ({ type, label }) => {
  const icon =
    type === 'date' ? (
      <Calendar className="h-6 w-6 md:h-7 md:w-7" />
    ) : (
      <Clock className="h-6 w-6 md:h-7 md:w-7" />
    )

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-gray-700">{icon}</div>
      <p className="font-sans text-sm font-medium text-gray-700 md:text-base">{label}</p>
    </div>
  )
}
