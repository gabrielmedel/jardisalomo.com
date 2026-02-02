'use client'
import React from 'react'
import Image from 'next/image'

interface MenuContainerProps {
  children: React.ReactNode
}

export const MenuContainer: React.FC<MenuContainerProps> = ({ children }) => {
  return (
    <div
      className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-lg shadow-xl"
      style={{
        clipPath: 'inset(0 round 0.5rem)',
      }}
    >
      {/* Acuarela background - centro - SOLO ESTE ES ABSOLUTE */}
      <div className="absolute inset-0 z-0 bg-white">
        <Image
          src="/images/menu/aquarelaBg.png"
          alt=""
          fill
          className="object-cover object-center opacity-100"
          sizes="(max-width: 768px) 100vw, 896px"
          priority
        />
      </div>

      {/* Content wrapper - flexible height SIN bg para que se vea la acuarela */}
      <div className="relative z-[1] min-h-[500px] px-6 py-12 text-center md:px-12 md:py-16">
        {/* Flower 1 - top right - absolute dentro del contenedor */}
        <div
          className="absolute h-48 w-48 md:h-64 md:w-64 lg:h-80 lg:w-80"
          style={{
            top: '-10%',
            right: '-10%',
          }}
        >
          <Image
            src="/images/menu/flowers_1.png"
            alt=""
            fill
            className="object-contain object-right-top"
            sizes="(max-width: 768px) 192px, (max-width: 1024px) 256px, 320px"
          />
        </div>

        {/* Flower 2 - bottom left - absolute dentro del contenedor */}
        <div
          className="absolute h-48 w-48 md:h-64 md:w-64 lg:h-80 lg:w-80"
          style={{
            bottom: '-10%',
            left: '-5%',
          }}
        >
          <Image
            src="/images/menu/flowers_2.png"
            alt=""
            fill
            className="object-contain object-left-bottom"
            sizes="(max-width: 768px) 192px, (max-width: 1024px) 256px, 320px"
          />
        </div>

        {/* Main content - centrado con z-index para estar por encima de las flores */}
        <div className="relative z-[1]">{children}</div>
      </div>
    </div>
  )
}
