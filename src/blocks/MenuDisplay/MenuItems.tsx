'use client'
import type { MenuDisplayBlock } from '@/payload-types'
import React from 'react'
import { MenuItem } from './MenuItem'

interface MenuItemsProps {
  menuItems?: any
}

export const MenuItems: React.FC<MenuItemsProps> = ({ menuItems }) => {
  if (!menuItems || menuItems.length === 0) {
    return null
  }

  return (
    <div className="w-full space-y-8 md:space-y-10">
      {menuItems.map((item: any, index: number) => (
        <MenuItem key={index} content={item.content} />
      ))}
    </div>
  )
}
