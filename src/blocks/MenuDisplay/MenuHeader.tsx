'use client'
import React from 'react'
import RichText from '@/components/RichText'

interface MenuHeaderProps {
  preTitle?: string | null
  title: any
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({ preTitle, title }) => {
  return (
    <div className="w-full">
      {preTitle && <p className="pretitle pretitle--secondary font-sans">{preTitle}</p>}
      {title && (
        <RichText
          className="block-richtext font-sans"
          data={title}
          enableGutter={false}
          enableProse={false}
        />
      )}
    </div>
  )
}
