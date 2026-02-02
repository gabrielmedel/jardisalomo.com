'use client'
import type { MenuDisplayBlock } from '@/payload-types'
import React from 'react'
import { MenuInfoItem } from './MenuInfoItem'

interface MenuInfoItemsProps {
  infoItems?: MenuDisplayBlock['infoItems']
}

export const MenuInfoItems: React.FC<MenuInfoItemsProps> = ({ infoItems }) => {
  if (!infoItems || infoItems.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      {infoItems.map((item, index) => (
        <MenuInfoItem key={index} type={item.type as 'date' | 'time'} label={item.label || ''} />
      ))}
    </div>
  )
}
