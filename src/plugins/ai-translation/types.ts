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
  // Configuración de fields por collection/global
  // Si no se especifica para una collection, traduce TODOS los campos localizados
  // Si se especifica, solo traduce esos fields
  // Soporta wildcards: "layout.*.richText", "hero.links.*.link.label"
  fields?: {
    [collectionOrGlobalSlug: string]: string[]
  }
}

export interface TranslateDocumentRequest {
  collection?: string
  global?: string
  id?: string
  fromLocale: string
  toLocale: string
  // Campos específicos a traducir (override de la config del plugin)
  // Soporta wildcards: "layout.*.richText"
  fields?: string[]
}

export interface BulkTranslateRequest {
  collection: string
  ids: string[]
  fromLocale: string
  toLocale: string
  // Campos específicos a traducir
  fields?: string[]
}
