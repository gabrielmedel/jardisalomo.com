'use client'
import { motion } from 'motion/react'
import { type ReactNode } from 'react'

interface StaggerRevealProps {
  children: ReactNode[]
  staggerDelay?: number // Delay entre cada elemento en segundos
  animation?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale'
  className?: string
}

export function StaggerReveal({
  children,
  staggerDelay = 0.1,
  animation = 'slideUp',
  className,
}: StaggerRevealProps) {
  // Configurar variantes según el tipo de animación
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slideUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    },
    slideDown: {
      hidden: { opacity: 0, y: -30 },
      visible: { opacity: 1, y: 0 },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0 },
    },
    slideRight: {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={variants[animation]}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
