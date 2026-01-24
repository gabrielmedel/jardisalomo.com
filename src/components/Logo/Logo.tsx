import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  /**
   * Qué logo usar en función del color de fondo.
   * - onDark: para fondos oscuros (negro)
   * - onLight: para fondos claros (blanco)
   */
  variant?: 'onDark' | 'onLight'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className, variant = 'onLight' } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  // Determinar qué logo mostrar
  const logoSrc = variant === 'onDark' ? '/images/logoJardiWeb-dark.svg' : '/images/logoJardiWeb-light.svg'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Logo"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
      src={logoSrc}
    />
  )
}
