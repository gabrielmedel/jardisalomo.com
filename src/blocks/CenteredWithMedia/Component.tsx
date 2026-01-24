'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import type { CenteredWithMediaBlock as BlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const CenteredWithMediaBlock: React.FC<BlockProps & { locale?: string }> = ({
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
    // Animate while the section enters/leaves the viewport
    offset: ['start end', 'end start'],
  })

  // More intense parallax
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])

  useEffect(() => {
    setHeaderTheme('dark')
    return () => {
      setHeaderTheme(null)
    }
  }, [setHeaderTheme])

  return (
    <section
      ref={sectionRef}
      className="relative py-16 flex items-center justify-center text-white overflow-hidden"
      data-theme="dark"
    >
      {/* Background media (image or video) with parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Less overscan on mobile to avoid excessive cropping */}
        <motion.div
          className="absolute -top-1/4 -bottom-1/4 md:-top-1/2 md:-bottom-1/2 left-0 right-0 will-change-transform"
          style={{ y }}
        >
          {media && typeof media === 'object' && (
            <>
              {media.mimeType?.startsWith('video/') ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover object-center"
                >
                  <source src={media.url || ''} type={media.mimeType || ''} />
                </video>
              ) : (
                <Media fill imgClassName="object-cover object-center" priority resource={media} />
              )}
            </>
          )}
        </motion.div>
        {/* Overlay oscuro del 50% */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="container relative z-10 flex items-center justify-center">
        <div className="w-full max-w-5xl text-center py-16">
          {preTitle && <p className="pretitle--secondary">{preTitle}</p>}
          {richText && (
            <RichText
              className="block-richtext text-center mb-[var(--space-hero-cta)]"
              data={richText}
              enableGutter={false}
              enableProse={false}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <div className="flex gap-4 flex-wrap justify-center">
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
