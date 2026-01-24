import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'
import { getRequestLocale } from '@/utilities/getRequestLocale'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

const facebookIconURL = new URL('../fields/socials/icons/facebook.svg', import.meta.url).toString()
const instagramIconURL = new URL('../fields/socials/icons/instagram.svg', import.meta.url).toString()

export async function Footer() {
  const locale = await getRequestLocale()
  const footerData: Footer = await getCachedGlobal('footer', 1, locale)()

  const navItems = footerData?.navItems || []
  const socials = footerData?.socials || []
  const introText = footerData?.introText
  const contactTitle = footerData?.contact?.title
  const contactAddress = footerData?.contact?.address

  const contactLines =
    typeof contactAddress === 'string'
      ? contactAddress
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
      : []

  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
          {/* Columna izquierda: logo + texto + socials */}
          <div className="flex flex-col">
            <Link className="flex items-center" href={`/${locale}`}>
              <Logo variant="onDark" className="max-w-[12rem] h-auto" />
            </Link>

            <div className="mt-6 h-px w-56 bg-primary-foreground/70" />

            {introText ? (
              <p className="mt-8 max-w-sm font-sans font-light text-sm leading-relaxed text-primary-foreground/90">
                {introText}
              </p>
            ) : null}

            {socials?.length ? (
              <div className="mt-8 flex items-center gap-4">
                {socials.map((social, i) => {
                  const href = social?.url
                  if (!href) return null

                  const iconSrc = social?.platform === 'instagram' ? instagramIconURL : facebookIconURL
                  const label = social?.label

                  return (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/30 hover:border-primary-foreground/70 transition-colors"
                      aria-label={label || undefined}
                      title={label || undefined}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={iconSrc} alt="" className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            ) : null}
          </div>

          {/* Columna central: menú */}
          <nav className="flex flex-col gap-6 md:items-center">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  key={i}
                  {...link}
                  className="font-serif uppercase tracking-[0.28em] text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                />
              )
            })}
          </nav>

          {/* Columna derecha: contacto */}
          <div className="md:text-right">
            <div className="flex items-center gap-4 md:justify-end">
              {contactTitle ? (
                <h3 className="font-serif text-xl tracking-[0.06em] text-primary-foreground">{contactTitle}</h3>
              ) : null}
              <div className="h-px w-40 bg-primary-foreground/70 md:w-56" />
            </div>

            {contactLines.length ? (
              <div className="mt-8 space-y-2 font-sans font-light text-sm leading-relaxed text-primary-foreground/90">
                {contactLines.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  )
}
