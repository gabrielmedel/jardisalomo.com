import type { Config, Plugin, UIField } from 'payload'
import type { AITranslationPluginConfig } from './types'
import { TranslationService } from './server/translateService'
import { createTranslateEndpoints } from './server/endpoints'

// Re-export helpers para uso en configs
export { translateFieldButton, withTranslateButtons, translatableLabelConfig } from './helpers'

export const aiTranslationPlugin =
  (pluginConfig: AITranslationPluginConfig): Plugin =>
  (incomingConfig: Config): Config => {
    const translationService = new TranslationService(
      pluginConfig.openai.apiKey,
      pluginConfig.openai.model,
    )

    // Determinar qué collections modificar
    const collectionsToModify = pluginConfig.collections
      ? pluginConfig.collections
      : incomingConfig.collections?.map((c) => c.slug) || []

    // Agregar componentes a collections
    const modifiedCollections = incomingConfig.collections?.map((collection) => {
      if (!collectionsToModify.includes(collection.slug)) {
        return collection
      }

      // Obtener componentes beforeList existentes
      const existingBeforeList = collection.admin?.components?.beforeList || []
      const bulkActionPath = '@/plugins/ai-translation/client/BulkTranslateAction'

      // Solo agregar si no existe ya (para no duplicar)
      const beforeList = existingBeforeList.includes(bulkActionPath)
        ? existingBeforeList
        : [...existingBeforeList, bulkActionPath]

      return {
        ...collection,
        fields: [
          ...collection.fields,
          // Agregar campo UI para el botón de traducción en edit view (sidebar)
          {
            name: 'aiTranslateButton',
            type: 'ui',
            admin: {
              position: 'sidebar',
              components: {
                Field: '@/plugins/ai-translation/client/TranslatePageButton',
              },
            },
          } as UIField,
        ],
        admin: {
          ...collection.admin,
          components: {
            ...collection.admin?.components,
            beforeList,
          },
        },
      }
    })

    // Agregar componentes a globals
    const globalsToModify = pluginConfig.globals || []
    const modifiedGlobals = incomingConfig.globals?.map((global) => {
      if (!globalsToModify.includes(global.slug)) {
        return global
      }

      return {
        ...global,
        admin: {
          ...global.admin,
          components: {
            ...global.admin?.components,
            // Agregar botón de traducción en edit view
            elements: {
              ...global.admin?.components?.elements,
              PreviewButton: '@/plugins/ai-translation/client/TranslatePageButton',
            },
          },
        },
      }
    })

    return {
      ...incomingConfig,
      collections: modifiedCollections,
      globals: modifiedGlobals,
      endpoints: [
        ...(incomingConfig.endpoints || []),
        ...createTranslateEndpoints(pluginConfig, translationService),
      ],
    }
  }

export type { AITranslationPluginConfig }
