'use client'
import React from 'react'

interface MenuPricingItemProps {
  label: string
  price: string
  perPriceLabel: string
}

export const MenuPricingItem: React.FC<MenuPricingItemProps> = ({
  label,
  price,
  perPriceLabel,
}) => {
  return (
    <div className="space-y-1.5">
      <p className="font-sans text-sm font-medium text-gray-600 md:text-base">{label}</p>
      <p className="font-sans text-xl font-semibold text-gray-900 md:text-2xl">
        {price}
        <span className="ml-1 text-sm font-normal text-gray-600 md:text-base">{perPriceLabel}</span>
      </p>
    </div>
  )
}
