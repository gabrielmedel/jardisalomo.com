'use client'
import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

import type { TwoColumnContentMediaBlock as BlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export const TwoColumnContentMediaBlock: React.FC<BlockProps & { locale?: string }> = ({
  contentPosition = 'left',
  mediaLayout = 'single',
  backgroundColor = 'none',
  mediaBackgroundColor = 'none',
  rectangleWidth = 30,
  rectangleOffsetTop = 0,
  rectangleHeight = 100,
  preTitle,
  richText,
  links,
  mediaPrimary,
  mediaSecondary,
  locale,
}) => {
  const isContentLeft = contentPosition === 'left'
  const isDualMedia = mediaLayout === 'dual'
  const hasBackgroundColor = backgroundColor !== 'none'
  const hasMediaBackgroundColor = mediaBackgroundColor !== 'none'
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  const isInView = useInView(mediaRef, { once: true, amount: 0.3 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Parallax: start aligned (no initial drop) and move up on scroll
  // Use px values for consistent animation across layouts
  const baseParallaxRange: [number, number] = hasMediaBackgroundColor ? [220, -160] : [160, -120]

  // In dual-media mode, the primary image should move less than in single-media mode
  const primaryParallaxMultiplier = isDualMedia ? 0.8 : 1
  const primaryParallaxRange: [number, number] = [
    baseParallaxRange[0] * primaryParallaxMultiplier,
    baseParallaxRange[1] * primaryParallaxMultiplier,
  ]

  const yPrimary = useTransform(scrollYProgress, [0, 1], primaryParallaxRange)

  // Secondary image should move "more" than primary (stronger parallax)
  const secondaryParallaxMultiplier = 1.35
  const secondaryParallaxRange: [number, number] = [
    baseParallaxRange[0] * secondaryParallaxMultiplier,
    baseParallaxRange[1] * secondaryParallaxMultiplier,
  ]
  const ySecondary = useTransform(scrollYProgress, [0, 1], secondaryParallaxRange)

  // Get background color class
  const getBackgroundClass = () => {
    switch (backgroundColor) {
      case 'pastel':
        return 'bg-pastel'
      case 'olive':
        return 'bg-olive'
      case 'accent':
        return 'bg-accent'
      default:
        return ''
    }
  }

  // Get media background color class
  const getMediaBackgroundClass = () => {
    switch (mediaBackgroundColor) {
      case 'pastel':
        return 'bg-pastel'
      case 'olive':
        return 'bg-olive'
      case 'accent':
        return 'bg-accent'
      default:
        return ''
    }
  }

  // Reveal animation variants
  const revealVariants = {
    hidden: { clipPath: 'inset(0 100% 0 0)' },
    visible: {
      clipPath: 'inset(0 0% 0 0)',
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo - very smooth
        delay: 0.3,
      },
    },
  }

  const revealVariantsSecondary = {
    hidden: { clipPath: 'inset(0 100% 0 0)' },
    visible: {
      clipPath: 'inset(0 0% 0 0)',
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo - very smooth
        delay: 0.5, // Stagger delay (0.3 + 0.2)
      },
    },
  }

  return (
    <section ref={sectionRef} className="relative py-8 md:py-12 lg:py-20 overflow-hidden">
      {/* Background behind content - extends to screen edge (no parallax) */}
      {hasBackgroundColor && (
        <div
          className={cn(
            'absolute top-0 bottom-0 w-screen z-0',
            isContentLeft ? 'right-0' : 'left-0',
            getBackgroundClass(),
          )}
        />
      )}

      {/* Desktop decorative rectangle - aligned to screen edge (compensates container padding) */}
      {hasMediaBackgroundColor && (
        <div
          className={cn('hidden lg:block absolute z-0', getMediaBackgroundClass())}
          style={{
            width: `${rectangleWidth}vw`,
            height: `${rectangleHeight}%`,
            top: `calc(50% + ${rectangleOffsetTop}%)`,
            transform: 'translateY(-50%)',
            [isContentLeft ? 'right' : 'left']: 'calc(-1 * (100vw - 100%) / 2)',
          }}
        />
      )}

      <div className="container relative z-10">
        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 items-start justify-between',
            // Invertir orden visual en desktop cuando contenido va a la derecha
            !isContentLeft && 'lg:[&>*:first-child]:order-2',
          )}
        >
          {/* Content Column */}
          <div className={cn('flex flex-col text-left pt-0 lg:pt-20')}>
            {preTitle && <p className="pretitle">{preTitle}</p>}
            {richText && (
              <RichText
                className="two-column-richtext mb-[var(--space-hero-cta)]"
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

          {/* Media Column */}
          <div
            ref={mediaRef}
            className="relative lg:flex lg:flex-col lg:justify-center lg:items-end"
          >
            {/* Mobile decorative rectangle - inside media column */}
            {hasMediaBackgroundColor && (
              <div
                className={cn('block lg:hidden absolute z-0', getMediaBackgroundClass())}
                style={{
                  width: `${Math.min((rectangleWidth ?? 0) * 1.8, 80)}vw`,
                  height: '80%',
                  top: '10%',
                  [isContentLeft ? 'right' : 'left']: 'calc(-1 * (100vw - 100%) / 2)',
                }}
              />
            )}
            {isDualMedia ? (
              // Dual Media Layout - Overlap effect
              <div className={cn('relative z-10', hasMediaBackgroundColor ? 'w-[85%]' : 'w-full')}>
                {/* Primary Image - Bottom Layer with Reveal and Parallax */}
                <motion.div
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  variants={revealVariants}
                  style={{ y: yPrimary }}
                  className="relative aspect-[4/3] w-3/4 ml-auto lg:aspect-[3/4] lg:w-full lg:ml-0 max-w-lg lg:max-w-md will-change-transform"
                >
                  {mediaPrimary && typeof mediaPrimary === 'object' && (
                    <Media
                      resource={mediaPrimary}
                      className="rounded-lg shadow-lg"
                      imgClassName="object-cover rounded-lg"
                      fill
                    />
                  )}
                </motion.div>

                {/* Secondary Image - Overlapping Top Layer with Parallax and Reveal */}
                {mediaSecondary && typeof mediaSecondary === 'object' && (
                  <motion.div
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    variants={revealVariantsSecondary}
                    style={{ y: ySecondary }}
                    className={cn(
                      'absolute top-1/4 aspect-[4/3] shadow-xl rounded-lg will-change-transform',
                      'w-1/2 left-0 translate-y-6',
                      'lg:w-1/2 lg:bottom-0',
                      // Alineación según posición del contenido (solo desktop)
                      isContentLeft ? 'lg:left-[2%]' : 'lg:right-[15%] lg:left-auto',
                    )}
                  >
                    <Media
                      resource={mediaSecondary}
                      className="rounded-lg"
                      imgClassName="object-cover rounded-lg"
                      fill
                    />
                  </motion.div>
                )}
              </div>
            ) : (
              // Single Media Layout with Reveal and Parallax
              <motion.div
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={revealVariants}
                style={{ y: yPrimary }}
                className={cn(
                  'relative aspect-[4/3] will-change-transform z-10',
                  hasMediaBackgroundColor ? 'w-[85%]' : 'w-full',
                )}
              >
                {mediaPrimary && typeof mediaPrimary === 'object' && (
                  <Media
                    resource={mediaPrimary}
                    className="rounded-lg shadow-lg"
                    imgClassName="object-cover rounded-lg"
                    fill
                  />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
