'use client'
import React from 'react'
import { Media } from '@/components/Media'

interface Dish {
  id: string
  name: string
  description?: string
  price: string
  image?: any
  featured?: boolean
  allergens?: Array<{ allergen: string }>
}

interface DishCardProps {
  dish: Dish
  showImage: boolean
  showAllergens: boolean
}

export const DishCard: React.FC<DishCardProps> = ({ dish, showImage, showAllergens }) => {
  const hasImage = showImage && dish.image && typeof dish.image === 'object'
  const hasAllergens = showAllergens && dish.allergens && dish.allergens.length > 0

  return (
    <div className="flex gap-4 group">
      {/* Image */}
      {hasImage && (
        <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <Media resource={dish.image} fill imgClassName="object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          {/* Name and Featured Badge */}
          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-lg md:text-xl font-bold text-gray-900 leading-tight">
              {dish.name}
              {dish.featured && (
                <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-accent text-white rounded-full">
                  Recomendado
                </span>
              )}
            </h4>
          </div>

          {/* Price */}
          <div className="flex-shrink-0">
            <p className="font-serif text-lg md:text-xl font-bold text-primary whitespace-nowrap">
              {dish.price}
            </p>
          </div>
        </div>

        {/* Description */}
        {dish.description && (
          <p className="font-sans font-light text-sm md:text-base text-gray-600 leading-relaxed mb-2">
            {dish.description}
          </p>
        )}

        {/* Allergens */}
        {hasAllergens && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {dish.allergens!.map((item, index) => (
              <span
                key={index}
                className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
              >
                {item.allergen}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
