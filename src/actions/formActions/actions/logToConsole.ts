import type { FormActionHandler, FormActionResult, FormActionConfig } from '../types'

interface LogToConsoleConfig extends FormActionConfig {
  type: 'logToConsole'
  enabled?: boolean
  maskFields?: Array<{ field: string }>
  maxValueLength?: number
}

/**
 * Action que loguea el submission en la consola (terminal).
 * Úsalo para debugging en desarrollo.
 *
 * Características:
 * - Solo loguea si NODE_ENV !== 'production' o FORM_ACTIONS_LOG_TO_CONSOLE=true
 * - Sanitiza campos sensibles (password, token, secret, etc.)
 * - Trunca valores largos para mantener logs legibles
 */
export const logToConsole: FormActionHandler<LogToConsoleConfig> = async (context, config) => {
  const { submission, form, payload } = context

  // Gating: no loguear en producción a menos que se habilite explícitamente
  const shouldLog =
    process.env.NODE_ENV !== 'production' || process.env.FORM_ACTIONS_LOG_TO_CONSOLE === 'true'

  if (!shouldLog) {
    return {
      status: 'success',
      message: 'Logging disabled in production',
    }
  }

  try {
    const maxValueLength = config.maxValueLength ?? 500
    const configMaskFields = config.maskFields ?? []
    // Incluir campos sensibles por defecto
    const maskFieldsDefault = ['password', 'token', 'secret', 'apiKey']
    const maskFieldsFromConfig = configMaskFields.map((item) => item.field?.toLowerCase() || '')
    const allMaskFields = [...maskFieldsDefault, ...maskFieldsFromConfig]

    // Construir un objeto seguro para loguear
    const sanitizedData = (submission.submissionData || []).map((item) => {
      const field = item.field || 'unknown'
      let value = item.value

      // Sanitizar campos sensibles
      if (allMaskFields.some((maskField) => field.toLowerCase().includes(maskField))) {
        value = '***MASKED***'
      }
      // Truncar valores largos
      else if (typeof value === 'string' && value.length > maxValueLength) {
        value = `${value.substring(0, maxValueLength)}... (truncated)`
      }

      return { field, value }
    })

    // Estructura del log
    const logData = {
      timestamp: new Date().toISOString(),
      formId: form.id,
      submissionId: submission.id,
      formTitle: form.title,
      dataCount: sanitizedData.length,
      data: sanitizedData,
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 FORM SUBMISSION LOGGED')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(JSON.stringify(logData, null, 2))
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    return {
      status: 'success',
      message: `Logged submission #${submission.id} to console`,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`[FormAction:logToConsole] Error: ${errorMessage}`)

    return {
      status: 'error',
      message: `Failed to log: ${errorMessage}`,
    }
  }
}
