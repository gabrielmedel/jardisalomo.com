import React from 'react'
import type { FeaturesBlock as FeaturesProps } from '@/payload-types'
import { Media } from '@/components/Media'

export const FeaturesBlock: React.FC<FeaturesProps & { locale?: string }> = ({
  items,
  locale,
}) => {
  if (!items || items.length === 0) return null

  return (
    <div className="container my-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8">
        {items.map((item, index) => {
          const { icon, heading, description } = item

          return (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Icono con fondo circular */}
              <div className="mb-6 relative w-24 h-24 flex items-center justify-center">
                {typeof icon === 'object' && icon !== null && (
                  <Media
                    resource={icon}
                    className="w-full h-full object-contain"
                    imgClassName="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Título */}
              {heading && (
                <h3 className="text-lg font-normal text-primary uppercase tracking-wider mb-4">
                  {heading}
                </h3>
              )}

              {/* Descripción */}
              {description && (
                <p className="text-sm font-light text-black leading-relaxed max-w-xs">
                  {description}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
