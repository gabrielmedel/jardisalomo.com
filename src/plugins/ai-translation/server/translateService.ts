import OpenAI from 'openai'

export class TranslationService {
  private openai: OpenAI
  private model: string

  constructor(apiKey: string, model = 'gpt-4o-mini') {
    this.openai = new OpenAI({ apiKey })
    this.model = model
  }

  /**
   * Traduce texto simple
   */
  async translateText(text: string, fromLocale: string, toLocale: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate from ${fromLocale} to ${toLocale}. Return ONLY the translated text, no explanations.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
    })

    return response.choices[0]?.message?.content || text
  }

  /**
   * Traduce Lexical JSON (richText) recursivamente
   * Preserva la estructura, solo traduce los nodos de texto
   */
  async translateLexicalJSON(lexicalJSON: any, fromLocale: string, toLocale: string): Promise<any> {
    if (!lexicalJSON || typeof lexicalJSON !== 'object') {
      return lexicalJSON
    }

    // Si es un nodo de texto, traducir preservando espacios
    if (lexicalJSON.type === 'text' && lexicalJSON.text) {
      const originalText = lexicalJSON.text

      // Preservar espacios al inicio y final
      const leadingSpaces = originalText.match(/^\s*/)?.[0] || ''
      const trailingSpaces = originalText.match(/\s*$/)?.[0] || ''
      const trimmedText = originalText.trim()

      // Si el texto es solo espacios, no traducir
      if (!trimmedText) {
        return lexicalJSON
      }

      // Traducir solo el texto sin espacios extras
      const translatedText = await this.translateText(trimmedText, fromLocale, toLocale)

      // Restaurar espacios originales
      return {
        ...lexicalJSON,
        text: leadingSpaces + translatedText + trailingSpaces,
      }
    }

    // Si tiene children, procesar recursivamente
    if (Array.isArray(lexicalJSON.children)) {
      return {
        ...lexicalJSON,
        children: await Promise.all(
          lexicalJSON.children.map((child: any) =>
            this.translateLexicalJSON(child, fromLocale, toLocale),
          ),
        ),
      }
    }

    // Si es la raíz con root
    if (lexicalJSON.root) {
      return {
        ...lexicalJSON,
        root: await this.translateLexicalJSON(lexicalJSON.root, fromLocale, toLocale),
      }
    }

    return lexicalJSON
  }

  /**
   * Router de traducción por tipo de campo
   */
  async translateFieldValue(
    value: any,
    fieldType: string,
    fromLocale: string,
    toLocale: string,
  ): Promise<any> {
    if (!value) return value

    switch (fieldType) {
      case 'text':
      case 'textarea':
        return await this.translateText(String(value), fromLocale, toLocale)

      case 'richText':
        return await this.translateLexicalJSON(value, fromLocale, toLocale)

      default:
        return value
    }
  }
}
