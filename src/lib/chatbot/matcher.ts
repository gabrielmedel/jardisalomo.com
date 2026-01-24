import type { ChatbotConfig, ChatbotFAQ, ChatbotMatchResult } from './types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

const DEFAULT_FALLBACK = 'Lo siento, no tengo esa información todavía.'
const MIN_SCORE = 2

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const extractValues = (items?: { value?: string | null }[] | null) =>
  (items || [])
    .map((item) => item.value?.trim())
    .filter((value): value is string => Boolean(value))

const scoreFAQ = (input: string, faq: ChatbotFAQ): number => {
  let score = 0
  const normalizedInput = normalizeText(input)

  const question = faq.question ? normalizeText(faq.question) : ''
  if (question && normalizedInput === question) {
    score += 10
  } else if (question && normalizedInput.includes(question)) {
    score += 5
  }

  const keywordValues = extractValues(faq.keywords)
  for (const keyword of keywordValues) {
    const normalizedKeyword = normalizeText(keyword)
    if (!normalizedKeyword) continue
    if (normalizedInput.includes(normalizedKeyword)) {
      score += 2
    }
  }

  const patternValues = extractValues(faq.patterns)
  for (const pattern of patternValues) {
    try {
      const regex = new RegExp(pattern, 'i')
      if (regex.test(input)) {
        score += 4
      }
    } catch {
      // ignore invalid regex patterns
    }
  }

  if (typeof faq.priority === 'number') {
    score += Math.max(0, faq.priority) / 100
  }

  return score
}

export const resolveChatbotReply = (
  input: string,
  config: ChatbotConfig,
): ChatbotMatchResult => {
  const faqs = config.faqs || []
  let bestMatch: ChatbotFAQ | undefined
  let bestScore = 0

  for (const faq of faqs) {
    const score = scoreFAQ(input, faq)
    if (score > bestScore) {
      bestScore = score
      bestMatch = faq
    }
  }

  if (!bestMatch || bestScore < MIN_SCORE) {
    return {
      answer: (config.fallback?.message as string | DefaultTypedEditorState) || DEFAULT_FALLBACK,
      quickReplies: extractValues(config.welcome?.quickReplies),
      score: bestScore,
    }
  }

  return {
    answer:
      (bestMatch.answer as string | DefaultTypedEditorState) ||
      (config.fallback?.message as string | DefaultTypedEditorState) ||
      DEFAULT_FALLBACK,
    matchedFAQ: bestMatch,
    quickReplies: extractValues(bestMatch.quickReplies),
    score: bestScore,
  }
}
