import React from 'react'
import type { FeaturesBlock as FeaturesProps } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const FeaturesBlock: React.FC<FeaturesProps & { locale?: string }> = ({ items, locale }) => {
  if (!items || items.length === 0) return null
  const totalItems = items.length

  return (
    <div className="container my-16">
      <div className="grid grid-cols-1 gap-12 md:gap-8 md:grid-cols-4 lg:grid-cols-6">
        {items.map((item, index) => {
          const { icon, heading, description } = item
          const isLast = index === totalItems - 1
          const isSecondLast = index === totalItems - 2

          const mdRemainder = totalItems % 2
          const lgRemainder = totalItems % 3

          const centerWrapClasses = [
            // md: 2 por fila (4 cols, span 2). Si queda 1, centrarlo.
            mdRemainder === 1 && isLast ? 'md:col-start-2' : '',
            // lg: 3 por fila (6 cols, span 2). Si queda 1, centrarlo. Si quedan 2, centrar ambos.
            lgRemainder === 1 && isLast ? 'lg:col-start-3' : '',
            lgRemainder === 2 && isSecondLast ? 'lg:col-start-2' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div
              key={index}
              className={`flex flex-col items-center text-center md:col-span-2 lg:col-span-2 ${centerWrapClasses}`}
            >
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
              {description && description.root && (
                <div className="text-sm font-light text-black leading-relaxed max-w-xs">
                  <RichText data={description} enableGutter={false} enableProse={false} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
