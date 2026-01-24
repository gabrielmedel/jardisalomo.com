'use client'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

interface ParallaxWrapperProps {
  children: ReactNode
  speed?: number // Velocidad del parallax: valores negativos = más lento, positivos = más rápido
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}

export function ParallaxWrapper({
  children,
  speed = 0.5,
  direction = 'up',
  className,
}: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Calcular el rango de movimiento basado en la velocidad
  const range = 100 * speed

  // Configurar transformaciones según la dirección
  const transforms = {
    up: useTransform(scrollYProgress, [0, 1], [-range, range]),
    down: useTransform(scrollYProgress, [0, 1], [range, -range]),
    left: useTransform(scrollYProgress, [0, 1], [-range, range]),
    right: useTransform(scrollYProgress, [0, 1], [range, -range]),
  }

  const isHorizontal = direction === 'left' || direction === 'right'
  const transform = transforms[direction]

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          [isHorizontal ? 'x' : 'y']: transform,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
