'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

// Get direct MinIO URL for videos (required for iOS Range request support)
function getVideoUrl(media: Page['hero']['media']): string {
  if (!media || typeof media !== 'object' || !media.filename) return ''

  // Use direct MinIO URL if configured (for iOS compatibility)
  const s3Endpoint = process.env.NEXT_PUBLIC_S3_PUBLIC_ENDPOINT
  const s3Bucket = process.env.NEXT_PUBLIC_S3_BUCKET

  if (s3Endpoint && s3Bucket) {
    return `${s3Endpoint}/${s3Bucket}/${media.filename}`
  }

  // Fallback to Payload URL
  return media.url || ''
}

export const HighImpactHero: React.FC<Page['hero'] & { locale?: string }> = ({
  links,
  media,
  richText,
  preTitle,
  locale,
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])

  // Get direct video URL for iOS compatibility
  const videoUrl = useMemo(() => {
    if (media && typeof media === 'object' && media.mimeType?.startsWith('video/')) {
      return getVideoUrl(media)
    }
    return ''
  }, [media])

  useEffect(() => {
    setHeaderTheme('dark')
    return () => {
      setHeaderTheme(null)
    }
  }, [setHeaderTheme])

  // Force video play on mount (iOS workaround)
  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Video autoplay prevented:', error)
        })
      }
    }
  }, [videoUrl])

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
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                webkit-playsinline="true"
                preload="auto"
                poster={media.thumbnailURL || undefined}
                className="w-full h-full object-cover"
                style={{ objectFit: 'cover' }}
              >
                <source src={videoUrl} type={media.mimeType || ''} />
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
