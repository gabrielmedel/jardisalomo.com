'use client'
import React from 'react'
import RichText from '@/components/RichText'

interface MenuHeaderProps {
  preTitle?: string | null
  title?: any
  description?: any
  menuName?: string
  menuDescription?: string
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({
  preTitle,
  title,
  description,
  menuName,
  menuDescription,
}) => {
  // Use block title or fallback to menu name
  const displayTitle = title || menuName
  const displayDescription = description || menuDescription

  return (
    <div className="w-full mb-8 md:mb-12">
      {preTitle && <p className="pretitle pretitle--secondary text-center">{preTitle}</p>}

      {displayTitle &&
        (typeof displayTitle === 'string' ? (
          <h2 className="block-title text-center">{displayTitle}</h2>
        ) : (
          <RichText
            className="block-richtext"
            data={displayTitle}
            enableGutter={false}
            enableProse={false}
          />
        ))}

      {displayDescription &&
        (typeof displayDescription === 'string' ? (
          <p className="body-paragraph text-center max-w-2xl mx-auto mt-4">{displayDescription}</p>
        ) : (
          <div className="mt-4">
            <RichText
              className="block-richtext"
              data={displayDescription}
              enableGutter={false}
              enableProse={false}
            />
          </div>
        ))}
    </div>
  )
}
