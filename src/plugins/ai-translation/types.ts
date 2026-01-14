import type { Field, PayloadRequest } from 'payload'

export interface AITranslationPluginConfig {
  enabled?: boolean
  openai: {
    apiKey: string
    model?: string // Default: 'gpt-4o-mini'
  }
  // Collections a traducir (si no se especifica, traduce todas)
  collections?: string[]
  // Globals a traducir
  globals?: string[]
  // Configuración de fields por collection
  // Si no se especifica para una collection, traduce TODOS los campos localizados
  // Si se especifica, solo traduce esos fields
  fields?: {
    [collectionOrGlobalSlug: string]: string[]
  }
}

export interface TranslateDocumentRequest {
  collection?: string
  global?: string
  id: string
  fromLocale: string
  toLocale: string
}

export interface BulkTranslateRequest {
  collection: string
  ids: string[]
  fromLocale: string
  toLocale: string
}
