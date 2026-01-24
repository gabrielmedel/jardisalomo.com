import type { Endpoint } from 'payload'
import type { AITranslationPluginConfig } from '../types'
import { TranslationService } from './translateService'
import { translateDocument } from './translateDocument'
import { APIError } from 'payload'

export function createTranslateEndpoints(
  config: AITranslationPluginConfig,
  translationService: TranslationService,
): Endpoint[] {
  return [
    // Endpoint para traducir un documento completo
    {
      path: '/translate-document',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          throw new APIError('Unauthorized', 401)
        }

        // Leer el body correctamente en Payload 3.x
        let body
        try {
          // In Node environments, req.text() might be undefined, so fallback to req.body if available.
          let text: string | undefined

          if (typeof req.text === 'function') {
            text = await req.text()
          } else if (typeof req.body === 'string') {
            text = req.body
          } else if (typeof req.body === 'object' && req.body !== null) {
            body = req.body
          }

          if (body === undefined) {
            if (!text) throw new Error('No body provided')
            body = JSON.parse(text)
          }
        } catch (e) {
          throw new APIError('Invalid JSON body', 400)
        }

        const { collection, global, id, fromLocale, toLocale, fields } = body

        console.log('Translate document request:', {
          collection,
          global,
          id,
          fromLocale,
          toLocale,
          fields,
        })

        if (!fromLocale || !toLocale) {
          throw new APIError(
            `Missing required fields: fromLocale=${fromLocale}, toLocale=${toLocale}`,
            400,
          )
        }

        if (!collection && !global) {
          throw new APIError('Must specify collection or global', 400)
        }

        if (collection && !id) {
          throw new APIError(`Missing required field: id=${id}`, 400)
        }

        try {
          await translateDocument(req.payload, config, translationService, {
            collection,
            global,
            id,
            fromLocale,
            toLocale,
            fields, // Campos específicos a traducir (opcional)
          })

          return Response.json({ success: true })
        } catch (error) {
          console.error('Translation error:', error)
          throw new APIError('Translation failed', 500)
        }
      },
    },

    // Endpoint para traducción bulk
    {
      path: '/translate-bulk',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          throw new APIError('Unauthorized', 401)
        }

        // Leer el body correctamente en Payload 3.x
        let body
        try {
          let text: string | undefined

          if (typeof req.text === 'function') {
            text = await req.text()
          } else if (typeof req.body === 'string') {
            text = req.body
          } else if (typeof req.body === 'object' && req.body !== null) {
            body = req.body
          }

          if (body === undefined) {
            if (!text) throw new Error('No body provided')
            body = JSON.parse(text)
          }
        } catch (e) {
          throw new APIError('Invalid JSON body', 400)
        }

        const { collection, ids, fromLocale, toLocale, fields } = body

        if (!collection || !ids || !Array.isArray(ids) || !fromLocale || !toLocale) {
          throw new APIError('Invalid request', 400)
        }

        try {
          // Traducir cada documento en serie (podría optimizarse a paralelo)
          for (const id of ids) {
            await translateDocument(req.payload, config, translationService, {
              collection,
              id,
              fromLocale,
              toLocale,
              fields,
            })
          }

          return Response.json({ success: true, count: ids.length })
        } catch (error) {
          console.error('Bulk translation error:', error)
          throw new APIError('Bulk translation failed', 500)
        }
      },
    },
  ]
}
