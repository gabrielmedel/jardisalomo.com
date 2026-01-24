'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

const PageClient: React.FC = () => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    // Default header theme for pages; heroes can override (e.g. HighImpactHero sets 'dark')
    setHeaderTheme(null)
  }, [setHeaderTheme])
  return null
}

export default PageClient
