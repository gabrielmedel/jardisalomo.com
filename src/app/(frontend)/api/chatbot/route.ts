import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

// Rate limiting por IP (en memoria - para producción usar Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hora
const RATE_LIMIT_MAX = 10 // Máximo 10 peticiones por IP por hora

function getRateLimitKey(ip: string): string {
  return `chatbot:${ip}`
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const key = getRateLimitKey(ip)
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 }
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI not configured' },
        { status: 503 }
      )
    }

    // Rate limiting por IP
    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ip = forwardedFor?.split(',')[0] ?? 'unknown'
    
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', fallback: true },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
          }
        }
      )
    }

    // Parsear body
    const body = await request.json()
    const { message, locale = 'es' } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Limitar longitud del mensaje
    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Message too long', fallback: true },
        { status: 400 }
      )
    }

    // Obtener contexto del chatbot desde Payload
    const payload = await getPayload({ config })
    const chatbot = await payload.findGlobal({
      slug: 'chatbot',
      locale: locale as 'es' | 'ca' | 'en',
    })

    const context = chatbot.context || ''
    
    if (!context) {
      // Sin contexto configurado, usar fallback
      return NextResponse.json(
        { error: 'No context configured', fallback: true },
        { status: 400 }
      )
    }

    // Mapear locale a instrucciones de idioma
    const localeInstructions: Record<string, { name: string; instruction: string }> = {
      es: {
        name: 'español',
        instruction: 'Responde en español (castellano).',
      },
      ca: {
        name: 'catalán',
        instruction: 'Respon en català. NO responguis en castellà, NOMÉS en català.',
      },
      en: {
        name: 'English',
        instruction: 'Reply in English only.',
      },
    }
    const langConfig = localeInstructions[locale] || localeInstructions.es

    // Llamar a OpenAI
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `${context}

---
IDIOMA OBLIGATORIO: ${langConfig.name}
${langConfig.instruction}
---

Reglas:
- Responde de forma breve y concisa (máximo 2-3 frases)
- Sé amable y profesional
- Si no sabes algo, sugiere contactar directamente
- No inventes información que no esté en el contexto`,
        },
        {
          role: 'user',
          content: `[Idioma: ${langConfig.name}] ${message}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.5, // Reducido para respuestas más consistentes
    })

    const reply = completion.choices[0]?.message?.content || null

    if (!reply) {
      return NextResponse.json(
        { error: 'No response from AI', fallback: true },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { reply },
      {
        headers: {
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    )
  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { error: 'Internal error', fallback: true },
      { status: 500 }
    )
  }
}
