'use client'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  animation?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'blur'
  delay?: number // Delay en segundos
  duration?: number // Duración en segundos
  threshold?: number // Cuándo activar (0-1, donde 0.5 = 50% visible)
  className?: string
}

export function ScrollReveal({
  children,
  animation = 'fade',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`start ${1 - threshold}`, 'start start'],
  })

  // Configurar animaciones según el tipo
  const animations = {
    fade: {
      opacity: useTransform(scrollYProgress, [0, 0.5], [0, 1]),
    },
    slideUp: {
      opacity: useTransform(scrollYProgress, [0, 0.5], [0, 1]),
      y: useTransform(scrollYProgress, [0, 0.5], [50, 0]),
    },
    slideDown: {
      opacity: useTransform(scrollYProgress, [0, 0.5], [0, 1]),
      y: useTransform(scrollYProgress, [0, 0.5], [-50, 0]),
    },
    slideLeft: {
      opacity: useTransform(scrollYProgress, [0, 0.5], [0, 1]),
      x: useTransform(scrollYProgress, [0, 0.5], [50, 0]),
    },
    slideRight: {
      opacity: useTransform(scrollYProgress, [0, 0.5], [0, 1]),
      x: useTransform(scrollYProgress, [0, 0.5], [-50, 0]),
    },
    scale: {
      opacity: useTransform(scrollYProgress, [0, 0.5], [0, 1]),
      scale: useTransform(scrollYProgress, [0, 0.5], [0.8, 1]),
    },
    blur: {
      opacity: useTransform(scrollYProgress, [0, 0.5], [0, 1]),
      filter: useTransform(scrollYProgress, [0, 0.5], ['blur(10px)', 'blur(0px)']),
    },
  }

  const style = animations[animation]

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={style}
        transition={{
          duration,
          delay,
          ease: 'easeOut',
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
