import React from 'react'
import type { MenuBlock as MenuBlockProps } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { MenuHeader } from './MenuHeader'
import { MenuCategory } from './MenuCategory'

// Category names mapping (i18n)
const categoryNames: Record<string, string> = {
  starters: 'Entrantes',
  mains: 'Platos Principales',
  desserts: 'Postres',
  drinks: 'Bebidas',
}

// Category order
const categoryOrder = ['starters', 'mains', 'desserts', 'drinks']

export const MenuBlock: React.FC<MenuBlockProps & { locale?: string }> = async ({
  menu,
  sectionBackgroundColor,
  preTitle,
  title,
  description,
  showImages = true,
  showAllergens = true,
  groupByCategory = true,
  onlyFeatured = false,
  locale,
}) => {
  // Get background color class
  const getBackgroundClass = () => {
    switch (sectionBackgroundColor) {
      case 'pastel':
        return 'bg-pastel'
      case 'olive':
        return 'bg-olive'
      case 'accent':
        return 'bg-accent'
      default:
        return 'bg-white'
    }
  }

  // Fetch menu with dishes
  const payload = await getPayload({ config })

  if (!menu || typeof menu !== 'string') {
    return null
  }

  try {
    const selectedMenu = await payload.findByID({
      collection: 'menus',
      id: menu,
      depth: 1,
      locale: locale as any,
    })

    if (!selectedMenu?.dishes) {
      return null
    }

    // Filter dishes
    let dishes = Array.isArray(selectedMenu.dishes)
      ? selectedMenu.dishes.filter((dish): dish is any => typeof dish === 'object' && dish !== null)
      : []

    // Filter by featured if needed
    if (onlyFeatured) {
      dishes = dishes.filter((dish) => dish.featured === true)
    }

    // Filter only available dishes
    dishes = dishes.filter((dish) => dish.available === true)

    if (dishes.length === 0) {
      return null
    }

    // Group by category if needed
    let content: React.ReactNode

    if (groupByCategory) {
      // Group dishes by category
      const categorizedDishes = dishes.reduce(
        (acc, dish) => {
          const category = dish.category
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(dish)
          return acc
        },
        {} as Record<string, any[]>,
      )

      // Render categories in order
      content = categoryOrder
        .filter((category) => categorizedDishes[category] && categorizedDishes[category].length > 0)
        .map((category) => (
          <MenuCategory
            key={category}
            categoryName={categoryNames[category] || category}
            dishes={categorizedDishes[category]}
            showImages={showImages ?? true}
            showAllergens={showAllergens ?? true}
          />
        ))
    } else {
      // Render all dishes in a single list without category grouping
      content = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {dishes.map((dish) => (
            <div key={dish.id}>
              {/* Use DishCard directly in non-grouped view */}
              <div className="flex gap-4 group">
                {showImages && dish.image && typeof dish.image === 'object' && (
                  <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={dish.image.url}
                      alt={dish.image.alt || dish.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
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
                    <div className="flex-shrink-0">
                      <p className="font-serif text-lg md:text-xl font-bold text-primary whitespace-nowrap">
                        {dish.price}
                      </p>
                    </div>
                  </div>
                  {dish.description && (
                    <p className="font-sans font-light text-sm md:text-base text-gray-600 leading-relaxed mb-2">
                      {dish.description}
                    </p>
                  )}
                  {showAllergens && dish.allergens && dish.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {dish.allergens.map((item: any, index: number) => (
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
            </div>
          ))}
        </div>
      )
    }

    return (
      <section className={`relative w-full py-16 md:py-20 ${getBackgroundClass()}`}>
        <div className="container mx-auto px-4">
          {/* Card container with elegant styling */}
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
            {/* Header */}
            <MenuHeader
              preTitle={preTitle}
              title={title}
              description={description}
              menuName={selectedMenu.name}
              menuDescription={selectedMenu.description ?? undefined}
            />

            {/* Content */}
            <div className="w-full">{content}</div>
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error('Error fetching menu:', error)
    return null
  }
}
