import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_noStore as noStore } from 'next/cache'

import { ChatbotWidgetClient } from './ChatbotWidget.client'
import type { ChatbotConfig } from '@/lib/chatbot/types'
import { getRequestLocale } from '@/utilities/getRequestLocale'

export async function ChatbotWidget() {
  // Opt out of caching for this component
  noStore()
  
  const locale = await getRequestLocale()
  
  // Fetch data directly without caching to ensure real-time updates
  const payload = await getPayload({ config: configPromise })
  const chatbotData = (await payload.findGlobal({
    slug: 'chatbot',
    depth: 0,
    locale: locale as any,
  })) as ChatbotConfig

  if (!chatbotData?.enabled) return null

  return <ChatbotWidgetClient data={chatbotData} locale={locale} />
}
