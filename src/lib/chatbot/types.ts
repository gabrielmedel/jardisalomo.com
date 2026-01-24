import type { Chatbot } from '@/payload-types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export type ChatbotQuickReply = {
  value?: string | null
}

export type ChatbotFAQ = NonNullable<Chatbot['faqs']>[number]
export type ChatbotConfig = Chatbot

export type ChatbotMatchResult = {
  answer: string | DefaultTypedEditorState
  matchedFAQ?: ChatbotFAQ
  quickReplies: string[]
  score: number
}
