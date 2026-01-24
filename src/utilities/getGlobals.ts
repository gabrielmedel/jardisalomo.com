import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import type { SupportedLocale } from './locales'

type Global = keyof Config['globals']
type GlobalData<TSlug extends Global> = Config['globals'][TSlug]

async function getGlobal<TSlug extends Global>(
  slug: TSlug,
  depth = 0,
  locale?: SupportedLocale,
): Promise<GlobalData<TSlug>> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    locale: locale as any,
  })

  return global as GlobalData<TSlug>
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = <TSlug extends Global>(slug: TSlug, depth = 0, locale?: SupportedLocale) =>
  unstable_cache(async () => getGlobal(slug, depth, locale), [slug, locale || 'default'], {
    tags: [`global_${slug}`, locale ? `global_${slug}_${locale}` : `global_${slug}`],
  }) as () => Promise<GlobalData<TSlug>>
