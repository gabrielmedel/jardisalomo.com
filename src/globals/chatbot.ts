import type { GlobalConfig } from 'payload'
import { defaultLexical, defaultLexicalWithAllFeatures } from '@/fields/defaultLexical'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { PayloadAiPluginLexicalEditorFeature } from '@ai-stack/payloadcms'

export const Chatbot: GlobalConfig = {
  slug: 'chatbot',
  access: {
    read: () => true,
  },
  admin: {
    components: {
      elements: {
        beforeDocumentControls: ['@/plugins/ai-translation/client/TranslatePageButton'],
      },
    },
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'context',
      label: 'Contexto general',
      type: 'textarea',
      localized: true,
      admin: {
        description:
          'Contexto general para responder (no se muestra al usuario, sirve para orientar las respuestas).',
      },
    },
    {
      name: 'welcome',
      label: 'Bienvenida',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Título',
          type: 'text',
          localized: true,
        },
        {
          name: 'message',
          label: 'Mensaje',
          type: 'richText',
          localized: true,
          editor: defaultLexical,
        },
        {
          name: 'quickReplies',
          label: 'Preguntas frecuentes (botones)',
          type: 'array',
          localized: true,
          fields: [
            {
              name: 'value',
              label: 'Texto',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            initCollapsed: true,
          },
        },
      ],
    },
    {
      name: 'ui',
      label: 'UI',
      type: 'group',
      fields: [
        {
          name: 'inputPlaceholder',
          label: 'Placeholder del input',
          type: 'text',
          localized: true,
          defaultValue: 'Escribe tu mensaje...',
          admin: {
            description: 'Texto que se muestra en el campo de entrada cuando está vacío.',
          },
        },
      ],
    },
    {
      name: 'fallback',
      label: 'Fallback',
      type: 'group',
      fields: [
        {
          name: 'message',
          label: 'Mensaje',
          type: 'richText',
          localized: true,
          editor: defaultLexicalWithAllFeatures,
        },
      ],
    },
    {
      name: 'faqs',
      label: 'Preguntas y respuestas',
      type: 'array',
      fields: [
        {
          name: 'question',
          label: 'Pregunta',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'answer',
          label: 'Respuesta',
          type: 'richText',
          required: true,
          localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
                PayloadAiPluginLexicalEditorFeature(),
              ]
            },
          }),
        },
        {
          name: 'keywords',
          label: 'Keywords',
          type: 'array',
          localized: true,
          fields: [
            {
              name: 'value',
              label: 'Keyword',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Palabras clave para detectar la intención.',
            initCollapsed: true,
          },
        },
        {
          name: 'patterns',
          label: 'Patrones RegExp',
          type: 'array',
          localized: true,
          fields: [
            {
              name: 'value',
              label: 'Patrón',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Patrones RegExp (ej: "\\\\bhorario(s)?\\\\b").',
            initCollapsed: true,
          },
        },
        {
          name: 'quickReplies',
          label: 'Respuestas rápidas',
          type: 'array',
          localized: true,
          fields: [
            {
              name: 'value',
              label: 'Texto',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            initCollapsed: true,
          },
        },
        {
          name: 'priority',
          label: 'Prioridad',
          type: 'number',
          admin: {
            description: 'Mayor prioridad resuelve empates de matching.',
          },
        },
      ],
      admin: {
        initCollapsed: true,
      },
    },
  ],
}
