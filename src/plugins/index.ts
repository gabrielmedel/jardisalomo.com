import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { aiTranslationPlugin } from './ai-translation'

import { Page } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { Chatbot } from '@/globals/chatbot'
import { payloadAiPlugin } from '@ai-stack/payloadcms'
import { Pages } from '@/collections/Pages'

const generateTitle: GenerateTitle<Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  payloadAiPlugin({
    collections: {},
    globals: {
      [Chatbot.slug]: true,
    },
    debugging: false,
    options: {
      enabledLanguages: ['en-US', 'zh-SG', 'zh-CN', 'en'],
    },
  }),
  redirectsPlugin({
    collections: ['pages'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
]

// AI Translation plugin - DEBE IR AL FINAL para no ser sobrescrito
export const aiTranslationPluginInstance = process.env.OPENAI_API_KEY
  ? aiTranslationPlugin({
      enabled: true,
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-4o-mini',
      },
      collections: ['pages'], // Qué collections traducir
      globals: ['header', 'footer', 'chatbot'], // Qué globals traducir
      // Opcional: especificar qué fields traducir por collection/global
      // Si no se especifica, traduce TODOS los campos localizados
      // Soporta wildcards con * para arrays/blocks:
      // Ejemplos:
      //   'title' - campo simple
      //   'hero.richText' - campo anidado en grupo
      //   'layout.*.richText' - campo richText en TODOS los items del array layout
      //   'hero.links.*.link.label' - campo label en cada link del array links
      fields: {
        // pages: ['title', 'hero.richText', 'layout.*.richText'],
        // header: ['navItems.*.link.label'],
        // Si no especificas una collection aquí, traduce TODOS los campos localizados
      },
    })
  : undefined

export const allPlugins = aiTranslationPluginInstance
  ? [...plugins, aiTranslationPluginInstance]
  : plugins
