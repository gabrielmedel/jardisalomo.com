'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero'] & { locale?: string }> = ({
  links,
  media,
  richText,
  preTitle,
  locale,
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])

  useEffect(() => {
    setHeaderTheme('dark')
    return () => {
      setHeaderTheme(null)
    }
  }, [setHeaderTheme])

  return (
    <section
      ref={sectionRef}
      className="relative h-[95vh] lg:h-[90vh] flex items-center justify-center text-white overflow-hidden"
      data-theme="dark"
    >
      {/* Background media (image or video) */}
      <motion.div className="absolute inset-0 z-0 will-change-transform" style={{ y }}>
        {media && typeof media === 'object' && (
          <>
            {media.mimeType?.startsWith('video/') ? (
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                <source src={media.url || ''} type={media.mimeType || ''} />
              </video>
            ) : (
              <Media fill imgClassName="object-cover" priority resource={media} />
            )}
          </>
        )}
        {/* Overlay oscuro del 50% */}
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      {/* Content */}
      <div className="container relative z-10 flex items-center justify-start h-full">
        <div className="w-full max-w-5xl text-left pt-20">
          {preTitle && (
            <p className="pretitle hero-pretitle">{preTitle}</p>
          )}
          {richText && (
            <RichText
              className="hero-richtext mb-[var(--space-hero-cta)]"
              data={richText}
              enableGutter={false}
              enableProse={false}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <div className="flex gap-4 flex-wrap">
              {links.map(({ link }, i) => (
                <CMSLink key={i} {...link} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
