import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'
import { SUPPORTED_LOCALES } from '@/utilities/locales'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      // Revalidar para todos los locales
      SUPPORTED_LOCALES.forEach((locale) => {
        const path = doc.slug === 'inici' ? `/${locale}` : `/${locale}/${doc.slug}`
        payload.logger.info(`Revalidating page at path: ${path}`)
        revalidatePath(path)
      })

      // También revalidar cache tags por colección y slug
      revalidateTag(`pages_${doc.slug}`)
      revalidateTag('pages-sitemap')
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      SUPPORTED_LOCALES.forEach((locale) => {
        const oldPath =
          previousDoc.slug === 'inici' ? `/${locale}` : `/${locale}/${previousDoc.slug}`
        payload.logger.info(`Revalidating old page at path: ${oldPath}`)
        revalidatePath(oldPath)
      })

      revalidateTag(`pages_${previousDoc.slug}`)
      revalidateTag('pages-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    // Revalidar para todos los locales
    SUPPORTED_LOCALES.forEach((locale) => {
      const path = doc?.slug === 'inici' ? `/${locale}` : `/${locale}/${doc?.slug}`
      revalidatePath(path)
    })

    revalidateTag(`pages_${doc?.slug}`)
    revalidateTag('pages-sitemap')
  }

  return doc
}
