import type { Field } from 'payload'

export type SocialPlatform = 'facebook' | 'instagram'

export const socialPlatformOptions: Array<{ label: string; value: SocialPlatform }> = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'Facebook', value: 'facebook' },
]

/**
 * Helper de fields para usar dentro de un `type: 'array'`.
 *
 * Ejemplo:
 * {
 *   name: 'socials',
 *   type: 'array',
 *   fields: socialFields(),
 * }
 */
export const socialFields = (): Field[] => [
  {
    name: 'platform',
    type: 'select',
    required: true,
    options: socialPlatformOptions,
  },
  {
    name: 'label',
    type: 'text',
    localized: true,
    required: true,
    admin: {
      description: 'Texto accesible (aria-label). Ej: "Instagram", "Facebook".',
    },
  },
  {
    name: 'url',
    type: 'text',
    label: 'URL',
    required: true,
    admin: {
      placeholder: 'https://...',
    },
  },
]

