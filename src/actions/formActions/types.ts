import type { FormSubmission } from '@/payload-types'
import type { Payload, PayloadRequest } from 'payload'

/**
 * Form extendido con soporte para actions.
 * Extiende el tipo generado de Payload con el campo `actions`.
 */
export interface FormWithActions {
  id: number
  title: string
  fields?: any
  confirmationType?: 'message' | 'redirect'
  confirmationMessage?: any
  redirect?: { url: string }
  emails?: any
  updatedAt: string
  createdAt: string
  // Nuestro campo personalizado
  actions?: FormActionConfig[]
}

/**
 * Lista blanca de tipos de action disponibles para formularios.
 * Extiende según necesites: 'logToConsole' | 'webhook' | 'sendEmail' | etc.
 */
export type FormActionType = 'logToConsole' | 'createReservation'

/**
 * Contexto que se pasa a cada handler de action.
 * Contiene todo lo necesario para ejecutar la lógica del action.
 */
export interface FormActionContext {
  req: PayloadRequest
  submission: FormSubmission
  form: FormWithActions
  payload: Payload
  locale?: string
}

/**
 * Resultado de la ejecución de un action.
 * Permite reportar éxito/error de forma uniforme.
 */
export interface FormActionResult {
  status: 'success' | 'error'
  message?: string
  fieldErrors?: Record<string, string>
  metadata?: Record<string, unknown>
}

/**
 * Configuración base para un action. Extiende según sea necesario.
 */
export interface FormActionConfig extends Record<string, unknown> {
  type: FormActionType
  enabled?: boolean
}

/**
 * Tipo para un handler de action.
 * Implementa la lógica específica de cada tipo de action.
 */
export type FormActionHandler<TConfig extends FormActionConfig = FormActionConfig> = (
  context: FormActionContext,
  config: TConfig,
) => Promise<FormActionResult>
