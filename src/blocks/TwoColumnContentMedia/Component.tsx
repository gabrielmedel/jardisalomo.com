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
  preTitle,
  richText,
  links,
  mediaPrimary,
  mediaSecondary,
  locale,
}) => {
  const isContentLeft = contentPosition === 'left'
  const isDualMedia = mediaLayout === 'dual'
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  const isInView = useInView(mediaRef, { once: true, amount: 0.3 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Parallax effect: moves up as you scroll
  const y = useTransform(scrollYProgress, [0, 1], ['40%', '-40%'])

  // Reveal animation variants
  const revealVariants = {
    hidden: { clipPath: 'inset(0 100% 0 0)' },
    visible: {
      clipPath: 'inset(0 0% 0 0)',
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo - very smooth
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
        delay: 0.2, // Stagger delay
      },
    },
  }

  return (
    <section ref={sectionRef} className="py-8 md:py-12 lg:py-20">
      <div className="container">
        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 items-start justify-between',
            // Invertir orden visual en desktop cuando contenido va a la derecha
            !isContentLeft && 'lg:[&>*:first-child]:order-2',
          )}
        >
          {/* Content Column */}
          <div className="flex flex-col text-left pt-0 lg:pt-20">
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
          <div ref={mediaRef} className="relative">
            {isDualMedia ? (
              // Dual Media Layout - Overlap effect
              <div className="relative w-full">
                {/* Primary Image - Bottom Layer with Reveal */}
                <motion.div
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  variants={revealVariants}
                  className="relative aspect-[4/3] w-3/4 ml-auto lg:aspect-[3/4] lg:w-full lg:ml-0 max-w-lg lg:max-w-md"
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
                    style={{ y }}
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
              // Single Media Layout with Reveal
              <motion.div
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={revealVariants}
                className="relative aspect-[4/3] w-full"
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
