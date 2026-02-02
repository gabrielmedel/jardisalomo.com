import type { FormActionHandler, FormActionType } from './types'
import { logToConsole } from './actions/logToConsole'
import { createReservation } from './actions/createReservation'

/**
 * Registry global de handlers de action.
 * Solo estos tipos están permitidos en el schema de formularios.
 * Para agregar un nuevo action type:
 * 1. Importar el handler
 * 2. Registrarlo aquí
 * 3. Extender el type literal FormActionType en types.ts
 * 4. Crear el campo condicional en el schema del formulario si aplica
 */
export const formActionRegistry = {
  logToConsole,
  createReservation,
} as Record<FormActionType, FormActionHandler>

/**
 * Validar que un type es válido (existe en el registry).
 */
export function isValidFormActionType(type: unknown): type is FormActionType {
  return typeof type === 'string' && type in formActionRegistry
}

/**
 * Obtener un handler de action.
 * Lanza error si el tipo no existe en el registry.
 */
export function getFormActionHandler(type: FormActionType): FormActionHandler {
  const handler = formActionRegistry[type]
  if (!handler) {
    throw new Error(`Unknown form action type: ${type}`)
  }
  return handler
}

/**
 * Listar todos los tipos de action disponibles.
 */
export function getAllFormActionTypes(): FormActionType[] {
  return Object.keys(formActionRegistry) as FormActionType[]
}
