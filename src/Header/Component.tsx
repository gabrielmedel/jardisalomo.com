import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'
import { getRequestLocale } from '@/utilities/getRequestLocale'

export async function Header() {
  const locale = await getRequestLocale()
  const headerData: Header = await getCachedGlobal('header', 2, locale)()

  return <HeaderClient data={headerData} locale={locale} />
}
