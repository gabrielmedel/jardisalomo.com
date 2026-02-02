'use client'
import React from 'react'
import RichText from '@/components/RichText'

interface MenuItemProps {
  content?: any
}

export const MenuItem: React.FC<MenuItemProps> = ({ content }) => {
  if (!content) {
    return null
  }

  return (
    <div className="w-full">
      <RichText
        data={content as any}
        enableGutter={false}
        enableProse={false}
        className="prose prose-sm mx-auto text-center prose-headings:font-bold prose-headings:text-gray-900 prose-h3:mb-2 prose-h3:text-xl prose-h3:uppercase prose-h3:tracking-wide prose-p:text-gray-600 md:prose-base"
      />
    </div>
  )
}
