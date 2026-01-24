'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MessageCircleMore, SendHorizontal, X } from 'lucide-react'

import styles from './ChatbotWidget.module.css'
import { resolveChatbotReply } from '@/lib/chatbot/matcher'
import type { ChatbotConfig } from '@/lib/chatbot/types'
import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

type ChatMessage = {
  id: string
  role: 'bot' | 'user'
  content: string | DefaultTypedEditorState
}

// Configuración de rate limiting por sesión
const AI_SESSION_LIMIT = 3 // Máximo 3 llamadas a AI por sesión
const AI_SESSION_KEY = 'chatbot_ai_count'

const extractQuickReplies = (items?: { value?: string | null }[] | null) =>
  (items || [])
    .map((item) => item.value?.trim())
    .filter((value): value is string => Boolean(value))

// Hook to detect mobile screen
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return isMobile
}

// Hook para rate limiting por sesión
function useSessionAILimit() {
  const getCount = useCallback(() => {
    if (typeof window === 'undefined') return 0
    return parseInt(sessionStorage.getItem(AI_SESSION_KEY) || '0', 10)
  }, [])

  const increment = useCallback(() => {
    if (typeof window === 'undefined') return
    const current = getCount()
    sessionStorage.setItem(AI_SESSION_KEY, String(current + 1))
  }, [getCount])

  const canUseAI = useCallback(() => {
    return getCount() < AI_SESSION_LIMIT
  }, [getCount])

  return { canUseAI, increment, getCount }
}

interface ChatbotWidgetProps {
  data: ChatbotConfig
  locale?: string
}

export function ChatbotWidgetClient({ data, locale = 'es' }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const { canUseAI, increment: incrementAICount } = useSessionAILimit()

  const defaultQuickReplies = useMemo(
    () => extractQuickReplies(data.welcome?.quickReplies),
    [data.welcome?.quickReplies],
  )

  const [quickReplies, setQuickReplies] = useState<string[]>(defaultQuickReplies)
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const welcomeMessage = data.welcome?.message
    if (!welcomeMessage) return []
    return [
      {
        id: 'welcome',
        role: 'bot',
        content: welcomeMessage,
      },
    ]
  })

  // Auto-scroll to bottom when messages or thinking state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSend = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isThinking) return

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: trimmed,
    }

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsThinking(true)

    // Pequeña pausa para que se sienta más natural
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Intentar match con FAQs
    const result = resolveChatbotReply(trimmed, data)
    
    let botContent: string | DefaultTypedEditorState = result.answer
    const newQuickReplies = result.quickReplies

    // Si no hay match (score bajo), intentar con AI si hay créditos disponibles
    const hasMatch = result.matchedFAQ !== undefined
    const hasContext = Boolean(data.context)
    const hasAICredits = canUseAI()
    
    console.log('[Chatbot] Match result:', { 
      hasMatch, 
      score: result.score,
      hasContext,
      hasAICredits,
      willTryAI: !hasMatch && hasAICredits && hasContext
    })
    
    if (!hasMatch && hasAICredits && hasContext) {
      try {
        console.log('[Chatbot] Calling AI API...')
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed, locale }),
        })

        console.log('[Chatbot] AI response status:', response.status)
        
        if (response.ok) {
          const aiResult = await response.json()
          console.log('[Chatbot] AI result:', aiResult)
          if (aiResult.reply) {
            botContent = aiResult.reply
            incrementAICount()
          }
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.log('[Chatbot] AI error:', errorData)
        }
      } catch (error) {
        console.error('[Chatbot] AI request failed:', error)
      }
    }

    const botMessage: ChatMessage = {
      id: `${Date.now()}-bot`,
      role: 'bot',
      content: botContent,
    }

    setMessages((prev) => [...prev, botMessage])
    setQuickReplies(newQuickReplies.length ? newQuickReplies : defaultQuickReplies)
    setIsThinking(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    handleSend(input)
  }

  return (
    <>
      <AnimatePresence>
        {(!isOpen || !isMobile) && (
          <motion.div
            className={styles.wrapper}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <motion.button
              className={styles.button}
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Abrir chatbot"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircleMore size={24} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className={styles.overlay}
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className={styles.sheet}
              initial={isMobile ? { y: '100%' } : { opacity: 0, y: 20, scale: 0.96 }}
              animate={isMobile ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
              exit={isMobile ? { y: '100%' } : { opacity: 0, y: 20, scale: 0.96 }}
              transition={
                isMobile
                  ? { type: 'spring', stiffness: 300, damping: 30 }
                  : { type: 'spring', stiffness: 260, damping: 22 }
              }
            >
              <div className={styles.header}>
                <div className={styles.title}>{data.welcome?.title || 'Chat'}</div>
                <button
                  className={styles.closeButton}
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar chatbot"
                >
                  <X size={20} />
                </button>
              </div>

              <div className={styles.messages}>
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`${styles.message} ${
                        message.role === 'user' ? styles.messageUser : styles.messageBot
                      }`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {typeof message.content === 'string' ? (
                        message.content
                      ) : (
                        <RichText
                          data={message.content}
                          enableGutter={false}
                          enableProse={false}
                          className="text-sm"
                        />
                      )}
                    </motion.div>
                  ))}
                  {isThinking && (
                    <motion.div
                      className={`${styles.message} ${styles.messageBot} ${styles.thinking}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={styles.thinkingDots}>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {quickReplies.length > 0 && (
                <div className={styles.quickReplies}>
                  {quickReplies.map((quickReply) => (
                    <button
                      key={quickReply}
                      className={styles.quickReply}
                      onClick={() => handleSend(quickReply)}
                      disabled={isThinking}
                    >
                      {quickReply}
                    </button>
                  ))}
                </div>
              )}

              <div className={styles.inputRow}>
                <input
                  className={styles.input}
                  placeholder={data.ui?.inputPlaceholder || 'Escribe tu mensaje...'}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isThinking}
                />
                <button
                  className={styles.sendButton}
                  onClick={() => handleSend(input)}
                  aria-label="Enviar mensaje"
                  disabled={isThinking || !input.trim()}
                >
                  <SendHorizontal size={20} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
