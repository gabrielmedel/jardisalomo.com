import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { isSupportedLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/utilities/locales'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  
  const params: { locale: string; slug: string }[] = []
  
  for (const locale of SUPPORTED_LOCALES) {
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      locale: locale as any,
      select: {
        slug: true,
      },
    })

    pages.docs
      ?.filter((doc) => doc.slug !== 'inici')
      .forEach(({ slug }) => {
        params.push({ locale, slug: slug! })
      })
  }

  return params
}

type Args = {
  params: Promise<{
    locale: string
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale: localeParam, slug = 'inici' } = await paramsPromise
  
  const locale = isSupportedLocale(localeParam) ? localeParam : DEFAULT_LOCALE
  
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = `/${locale}/${decodedSlug}`
  
  const page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({
    slug: decodedSlug,
    locale,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page
  const hasHero = hero && hero.type && hero.type !== 'none'

  return (
    <article className={hasHero ? 'pb-24' : 'pt-24 pb-24'}>
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} locale={locale} />
      <RenderBlocks blocks={layout} locale={locale} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: localeParam, slug = 'inici' } = await paramsPromise
  const locale = isSupportedLocale(localeParam) ? localeParam : DEFAULT_LOCALE
  
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  
  const page = await queryPageBySlug({
    slug: decodedSlug,
    locale,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug, locale }: { slug: string; locale: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    depth: 2,
    pagination: false,
    overrideAccess: draft,
    locale: locale as 'all' | 'ca' | 'en' | 'es',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
