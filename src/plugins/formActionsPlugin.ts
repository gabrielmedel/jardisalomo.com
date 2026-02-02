import type { Plugin } from 'payload'
import { runFormActions } from '@/actions/formActions'
import type { FormWithActions } from '@/actions/formActions/types'

/**
 * Plugin que ejecuta form actions después de crear un form submission.
 * Se ejecuta después de que el plugin form-builder haya registrado la collection.
 */
export const formActionsPlugin: Plugin = (config) => {
  return {
    ...config,
    collections:
      config.collections?.map((collection) => {
        // Encontrar la collection form-submissions
        if (collection.slug === 'form-submissions') {
          return {
            ...collection,
            hooks: {
              ...collection.hooks,
              afterChange: [
                ...(collection.hooks?.afterChange || []),
                async ({ doc, req, operation }) => {
                  // Solo ejecutar al crear
                  if (operation !== 'create') {
                    return doc
                  }

                  try {
                    // Extraer el ID del form de forma segura
                    let formId: any = doc.form

                    // Si es un objeto con propiedades, extraer el id
                    if (typeof formId === 'object' && formId !== null) {
                      formId = formId.id || formId
                    }

                    // Convertir a número si es string
                    if (typeof formId === 'string') {
                      formId = Number.parseInt(formId, 10)
                    }

                    // Cargar el form completo
                    const form = await req.payload.findByID({
                      collection: 'forms',
                      id: formId,
                      req,
                    })

                    // Cast a FormWithActions
                    const formWithActions = form as FormWithActions

                    // Ejecutar actions
                    const results = await runFormActions(doc, formWithActions, req, req.payload)

                    // Log de resultados si hay errores (en dev)
                    if (process.env.NODE_ENV !== 'production' && results.failed.length > 0) {
                      console.warn('[formActionsPlugin] Some actions failed:', results.failed)
                    }

                    // Log de éxito
                    if (results.successful.length > 0) {
                      console.log('[formActionsPlugin] Actions executed:', results.successful.map((r) => r.type))
                    }
                  } catch (error) {
                    // No bloquear el flujo si falla ejecutar actions
                    const errorMessage = error instanceof Error ? error.message : String(error)
                    console.error(`[formActionsPlugin] Error running actions: ${errorMessage}`)
                  }

                  return doc
                },
              ],
            },
          }
        }
        return collection
      }) || [],
  }
}
