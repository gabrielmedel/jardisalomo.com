'use client'
import type { MenuDisplayBlock } from '@/payload-types'
import React from 'react'
import { MenuPricingItem } from './MenuPricingItem'

interface MenuPricingItemsProps {
  pricingItems?: MenuDisplayBlock['pricingItems']
}

export const MenuPricingItems: React.FC<MenuPricingItemsProps> = ({ pricingItems }) => {
  if (!pricingItems || pricingItems.length === 0) {
    return null
  }

  return (
    <div className="w-full space-y-5 md:space-y-6">
      {pricingItems.map((item, index) => (
        <MenuPricingItem
          key={index}
          label={item.label || ''}
          price={item.price || ''}
          perPriceLabel={item.perPriceLabel || ''}
        />
      ))}
    </div>
  )
}
