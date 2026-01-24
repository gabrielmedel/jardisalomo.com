import React from 'react'

import { cn } from '@/utilities/ui'

type Props = {
  title: React.ReactNode
  subtitle?: React.ReactNode
  className?: string
  titleClassName?: string
  subtitleClassName?: string
  as?: 'h1' | 'h2' | 'h3'
  variant?: 'hero' | 'default'
}

export function TitleSubtitle({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
  as: HeadingTag = 'h1',
  variant = 'hero',
}: Props) {
  return (
    <div className={cn('title-subtitle', className)}>
      <HeadingTag
        className={cn('gambetta-title', variant === 'hero' && 'gambetta-title--hero', titleClassName)}
      >
        {title}
      </HeadingTag>
      {subtitle ? (
        <p className={cn('roboto-subtitle', variant === 'hero' && 'roboto-subtitle--hero', subtitleClassName)}>
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}

