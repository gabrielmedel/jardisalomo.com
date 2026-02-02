'use client'
import type { MenuDisplayBlock as BlockProps } from '@/payload-types'
import React, { useRef } from 'react'
import { Media } from '@/components/Media'
import { MenuContainer } from './MenuContainer'
import { MenuHeader } from './MenuHeader'
import { MenuInfoItems } from './MenuInfoItems'
import { MenuItems } from './MenuItems'
import { MenuPricingItems } from './MenuPricingItems'

export const MenuDisplayBlock: React.FC<BlockProps & { locale?: string }> = ({
  sectionBackgroundColor,
  backgroundImage,
  preTitle,
  title,
  infoItems,
  menuItems,
  pricingItems,
  locale,
}) => {
  const sectionRef = useRef<HTMLElement>(null)

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

  return (
    <section
      ref={sectionRef}
      className={`relative w-full pb-32 overflow-hidden ${getBackgroundClass()}`}
    >
      {/* Background image section */}
      {backgroundImage && typeof backgroundImage === 'object' && (
        <div className="relative h-64 w-full overflow-hidden md:h-80">
          <Media
            fill
            imgClassName="object-cover object-center"
            priority
            resource={backgroundImage as any}
          />
        </div>
      )}

      {/* Container with overlap effect */}
      <div className="container relative z-10 mx-auto -mt-24 flex justify-center px-4 md:-mt-32">
        <MenuContainer>
          {/* Content inside container */}
          <div className="flex w-full max-w-2xl flex-col gap-8 md:gap-10">
            {/* Header */}
            {title && <MenuHeader preTitle={preTitle} title={title} />}

            {/* Info Items */}
            {infoItems && infoItems.length > 0 && (
              <div className="border-y-2 border-gray-400 py-6 md:py-8">
                <MenuInfoItems infoItems={infoItems} />
              </div>
            )}

            {/* Menu Items */}
            {menuItems && menuItems.length > 0 && <MenuItems menuItems={menuItems as any} />}

            {/* Pricing Items */}
            {pricingItems && pricingItems.length > 0 && (
              <div className="mt-4 border-t-2 border-gray-400 pt-8">
                <MenuPricingItems pricingItems={pricingItems} />
              </div>
            )}
          </div>
        </MenuContainer>
      </div>
    </section>
  )
}
