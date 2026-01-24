'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'

import type { CarouselSliderBlock as BlockProps } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

import './styles.css'

const AUTOPLAY_DELAY = 4000

export const CarouselSliderBlock: React.FC<BlockProps & { locale?: string }> = ({
  preTitle,
  richText,
  items,
  locale,
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const pausedElapsedRef = useRef(0)
  const animationFrameIdRef = useRef<number | null>(null)
  const wasInViewRef = useRef(false)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  })

  const [progress, setProgress] = useState(0)

  const handlePrevious = useCallback(() => {
    if (!emblaApi) return
    if (!emblaApi.canScrollPrev()) {
      emblaApi.scrollTo(emblaApi.slideNodes().length - 1)
      return
    }
    emblaApi.scrollPrev()
  }, [emblaApi])

  const handleNext = useCallback(() => {
    if (!emblaApi) return
    if (!emblaApi.canScrollNext()) {
      emblaApi.scrollTo(0)
      return
    }
    emblaApi.scrollNext()
  }, [emblaApi])

  // Intersection Observer to detect when section is in viewport
  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        threshold: 0.3, // Start when 30% visible
      }
    )

    observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [])

  // Progress bar animation + autoplay sync
  useEffect(() => {
    if (!emblaApi || !isInView) {
      setProgress(0)
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
        animationFrameIdRef.current = null
      }
      return
    }

    const resetProgress = () => {
      startTimeRef.current = null
      pausedElapsedRef.current = 0
      setProgress(0)
    }

    const updateProgress = (currentTime: number) => {
      if (!isInView || isHovered) return

      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime - pausedElapsedRef.current
      }

      const elapsed = currentTime - startTimeRef.current
      const newProgress = Math.min(elapsed / AUTOPLAY_DELAY, 1)
      setProgress(newProgress)

      if (newProgress >= 1) {
        resetProgress()
        if (!emblaApi.canScrollNext()) {
          emblaApi.scrollTo(0)
        } else {
          emblaApi.scrollNext()
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(updateProgress)
    }

    const onSelect = () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
        animationFrameIdRef.current = null
      }
      resetProgress()
      if (!isHovered) {
        animationFrameIdRef.current = requestAnimationFrame(updateProgress)
      }
    }

    emblaApi.on('select', onSelect)
    onSelect()

    if (isHovered) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
        animationFrameIdRef.current = null
      }
      if (startTimeRef.current !== null) {
        pausedElapsedRef.current = Math.min(
          performance.now() - startTimeRef.current,
          AUTOPLAY_DELAY
        )
      }
    } else if (animationFrameIdRef.current === null) {
      if (startTimeRef.current === null) {
        startTimeRef.current = performance.now() - pausedElapsedRef.current
      }
      animationFrameIdRef.current = requestAnimationFrame(updateProgress)
    }

    if (!wasInViewRef.current) {
      resetProgress()
    }
    wasInViewRef.current = isInView

    return () => {
      emblaApi.off('select', onSelect)
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
        animationFrameIdRef.current = null
      }
    }
  }, [emblaApi, isInView, isHovered])


  if (!items || items.length === 0) return null

  return (
    <section ref={sectionRef} className="carousel-slider-section py-16">
      <div className="container">
        {/* Header */}
        <div className="carousel-slider-header mb-12">
          {preTitle && <p className="pretitle">{preTitle}</p>}
          {richText && (
            <RichText
              className="block-richtext"
              data={richText}
              enableGutter={false}
              enableProse={false}
            />
          )}
        </div>

        {/* Carousel Container */}
        <div className="carousel-slider-wrapper">
          <div
            className="embla"
            ref={emblaRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            onTouchCancel={() => setIsHovered(false)}
          >
            <div className="embla__container">
              {items.map((item, index) => {
                const itemMedia = typeof item.media === 'object' ? item.media : null

                return (
                  <div key={index} className="embla__slide">
                    <div className="carousel-slide">
                      {/* Background Image */}
                      <div className="carousel-slide__image-wrapper">
                        {itemMedia && (
                          <>
                            <Media
                              fill
                              imgClassName="object-cover object-center"
                              priority={index === 0}
                              resource={itemMedia}
                            />
                            <div className="carousel-slide__overlay" />
                          </>
                        )}
                      </div>

                      {/* Content */}
                      <div className="carousel-slide__content">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <h3 className="carousel-slide__title">{item.title}</h3>
                          <p className="carousel-slide__subtitle">{item.subtitle}</p>

                          {item.link && (
                            <div className="carousel-slide__cta">
                              <CMSLink
                                {...item.link}
                                locale={locale}
                                className="carousel-slide__link"
                              >
                                <ArrowRight size={16} />
                              </CMSLink>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Controls and Progress Bar */}
        <div className="carousel-slider-footer">
          <div className="carousel-slider-progress-wrapper">
            <motion.div
              className="carousel-slider-progress-bar"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress }}
              transition={{ duration: 0.05, ease: 'linear' }}
            />
          </div>

          <div className="carousel-slider-controls">
            <button
              className="carousel-slider-btn carousel-slider-btn--prev"
              onClick={handlePrevious}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="carousel-slider-btn carousel-slider-btn--next"
              onClick={handleNext}
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
