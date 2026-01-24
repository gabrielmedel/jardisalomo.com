import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { ChatbotWidgetClient } from './ChatbotWidget.client'
import type { ChatbotConfig } from '@/lib/chatbot/types'
import { getRequestLocale } from '@/utilities/getRequestLocale'

export async function ChatbotWidget() {
  const locale = await getRequestLocale()
  const chatbotData = (await getCachedGlobal('chatbot', 0, locale)()) as ChatbotConfig

  if (!chatbotData?.enabled) return null

  return <ChatbotWidgetClient data={chatbotData} locale={locale} />
}
