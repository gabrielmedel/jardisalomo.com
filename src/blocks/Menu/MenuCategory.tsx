'use client'
import React from 'react'
import { DishCard } from './DishCard'

interface Dish {
  id: string
  name: string
  description?: string
  price: string
  image?: any
  featured?: boolean
  allergens?: Array<{ allergen: string }>
  available: boolean
}

interface MenuCategoryProps {
  categoryName: string
  dishes: Dish[]
  showImages: boolean
  showAllergens: boolean
}

export const MenuCategory: React.FC<MenuCategoryProps> = ({
  categoryName,
  dishes,
  showImages,
  showAllergens,
}) => {
  if (!dishes || dishes.length === 0) return null

  return (
    <div className="w-full mb-12 md:mb-16">
      <h3 className="font-serif text-2xl md:text-3xl font-bold text-center uppercase tracking-wider mb-8 text-primary">
        {categoryName}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {dishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            showImage={showImages}
            showAllergens={showAllergens}
          />
        ))}
      </div>
    </div>
  )
}
