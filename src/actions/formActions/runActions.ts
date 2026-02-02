import type { FormSubmission } from '@/payload-types'
import type { Payload, PayloadRequest } from 'payload'
import type { FormActionConfig, FormActionContext, FormActionResult, FormWithActions } from './types'
import { getFormActionHandler, isValidFormActionType } from './registry'

/**
 * Ejecutar todas las actions habilitadas para un submission.
 * Si el form tiene un array de actions, las ejecuta en orden.
 * Captura errores para no romper el flujo de creación del submission.
 */
export async function runFormActions(
  submission: FormSubmission,
  form: FormWithActions,
  req: PayloadRequest,
  payload: Payload,
): Promise<{
  successful: Array<{
    type: string
    result: FormActionResult
  }>
  failed: Array<{
    type: string
    error: string
  }>
}> {
  const results = {
    successful: [] as Array<{ type: string; result: FormActionResult }>,
    failed: [] as Array<{ type: string; error: string }>,
  }

  // Si el form no tiene actions, devolver early
  if (!form.actions || !Array.isArray(form.actions) || form.actions.length === 0) {
    return results
  }

  const context: FormActionContext = {
    req,
    submission,
    form,
    payload,
    // locale puede ser pasada si está disponible en req
  }

  for (const actionConfig of form.actions) {
    const config = actionConfig as FormActionConfig

    // Validar que el action está habilitado
    if (config.enabled === false) {
      continue
    }

    // Validar tipo
    if (!isValidFormActionType(config.type)) {
      results.failed.push({
        type: config.type as string,
        error: `Unknown action type: ${config.type}`,
      })
      continue
    }

    try {
      const handler = getFormActionHandler(config.type)
      const result = await handler(context, config)

      results.successful.push({
        type: config.type,
        result,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      results.failed.push({
        type: config.type,
        error: errorMessage,
      })
    }
  }

  return results
}
