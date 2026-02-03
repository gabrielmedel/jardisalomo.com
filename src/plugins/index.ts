import { formBuilderPlugin, fields as formFields } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'
import { Block, Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { aiTranslationPlugin } from './ai-translation'
import { formActionsPlugin } from './formActionsPlugin'
import { restaurantReservationsPlugin } from './restaurant-reservations'

import { Page } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { Chatbot } from '@/globals/chatbot'
import { payloadAiPlugin } from '@ai-stack/payloadcms'

const s3Enabled =
  process.env.NODE_ENV === 'production' &&
  Boolean(process.env.S3_ENDPOINT) &&
  Boolean(process.env.S3_BUCKET) &&
  Boolean(process.env.S3_ACCESS_KEY_ID) &&
  Boolean(process.env.S3_SECRET_ACCESS_KEY)

const s3StoragePlugin: Plugin | undefined = s3Enabled
  ? s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        region: process.env.S3_REGION || 'us-east-1',
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true, // Required for MinIO
      },
    })
  : undefined

// Get all available form field blocks for nested layouts
const getFormFieldBlocks = (): Block[] => {
  const fieldBlocks: Block[] = []

  // Add all standard form fields
  const standardFields = [
    'text',
    'textarea',
    'select',
    'email',
    'state',
    'country',
    'checkbox',
    'number',
    'message',
  ] as const

  standardFields.forEach((fieldName) => {
    const field = formFields[fieldName]
    if (field) {
      fieldBlocks.push(field as Block)
    }
  })

  return fieldBlocks
}

// ReservationField block for form builder (defined early to be used in getFormFieldBlocksWithReservation)
const reservationFieldBlock: Block = {
  slug: 'reservationField',
  interfaceName: 'FormReservationFieldBlock',
  labels: {
    singular: 'Reservation Field',
    plural: 'Reservation Fields',
  },
  fields: [
    {
      name: 'reservationType',
      type: 'relationship',
      relationTo: 'reservation-types',
      required: true,
      admin: {
        description: 'Tipo de reserva a utilizar para este campo',
      },
    },
    {
      name: 'defaultPeople',
      type: 'number',
      defaultValue: 2,
      min: 1,
      admin: {
        description: 'Número predeterminado de personas',
      },
    },
    {
      name: 'maxPeople',
      type: 'number',
      defaultValue: 10,
      min: 1,
      admin: {
        description: 'Número máximo de personas permitido',
      },
    },
  ],
}

// Get all form field blocks including custom reservation field
const getFormFieldBlocksWithReservation = (): Block[] => {
  const fieldBlocks = getFormFieldBlocks()
  fieldBlocks.push(reservationFieldBlock)
  return fieldBlocks
}

// Row block for grouping fields in columns
const rowBlock: Block = {
  slug: 'row',
  interfaceName: 'FormRowBlock',
  labels: {
    singular: 'Fila (Columnas)',
    plural: 'Filas (Columnas)',
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Columnas',
      minRows: 1,
      maxRows: 4,
      admin: {
        description:
          'Añade columnas a esta fila. Los campos dentro de cada columna se mostrarán lado a lado.',
      },
      fields: [
        {
          name: 'width',
          type: 'select',
          label: 'Ancho de columna',
          defaultValue: 'half',
          options: [
            { label: 'Completo (100%)', value: 'full' },
            { label: 'Mitad (50%)', value: 'half' },
            { label: 'Tercio (33%)', value: 'third' },
            { label: 'Cuarto (25%)', value: 'quarter' },
            { label: 'Dos tercios (66%)', value: 'twoThirds' },
            { label: 'Tres cuartos (75%)', value: 'threeQuarters' },
          ],
        },
        {
          name: 'fields',
          type: 'blocks',
          label: 'Campos',
          blocks: getFormFieldBlocksWithReservation(),
        },
      ],
    },
  ],
}

// Stepper block for multi-step forms
const stepperBlock: Block = {
  slug: 'stepper',
  interfaceName: 'FormStepperBlock',
  labels: {
    singular: 'Stepper (Pasos)',
    plural: 'Steppers (Pasos)',
  },
  fields: [
    {
      name: 'steps',
      type: 'array',
      label: 'Pasos',
      minRows: 2,
      admin: {
        description:
          'Configura los pasos del formulario. El usuario navegará entre pasos antes de enviar.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Título del paso',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción (opcional)',
          admin: {
            description: 'Texto descriptivo que aparece debajo del título del paso.',
          },
        },
        {
          name: 'fields',
          type: 'blocks',
          label: 'Campos del paso',
          blocks: [...getFormFieldBlocksWithReservation(), rowBlock], // Allow rows inside steps
        },
      ],
    },
    // Navigation labels
    {
      type: 'collapsible',
      label: 'Textos de navegación',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'previousButtonLabel',
          type: 'text',
          label: 'Botón Anterior',
          defaultValue: 'Anterior',
        },
        {
          name: 'nextButtonLabel',
          type: 'text',
          label: 'Botón Siguiente',
          defaultValue: 'Següent',
        },
      ],
    },
  ],
}

const generateTitle: GenerateTitle<Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  payloadAiPlugin({
    collections: {},
    globals: {
      [Chatbot.slug]: true,
    },
    debugging: false,
    options: {
      enabledLanguages: ['en-US', 'zh-SG', 'zh-CN', 'en'],
    },
  }),
  redirectsPlugin({
    collections: ['pages'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  ...(s3StoragePlugin ? [s3StoragePlugin] : []),
  formBuilderPlugin({
    fields: {
      payment: false,
      // Add layout blocks
      row: rowBlock,
      stepper: stepperBlock,
      // Add reservationField
      reservationField: reservationFieldBlock,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return [
          ...defaultFields.map((field) => {
            if ('name' in field && field.name === 'confirmationMessage') {
              return {
                ...field,
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      FixedToolbarFeature(),
                      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    ]
                  },
                }),
              }
            }
            return field
          }),
          // Global validation error message (RichText like confirmationMessage)
          {
            name: 'validationErrorMessage',
            type: 'richText',
            label: 'Mensaje de error de validación',
            admin: {
              description:
                'Mensaje que se muestra cuando hay errores de validación en el formulario (campos obligatorios, formato incorrecto, etc.).',
            },
            editor: lexicalEditor({
              features: ({ rootFeatures }) => {
                return [
                  ...rootFeatures,
                  FixedToolbarFeature(),
                  HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                ]
              },
            }),
          },
          {
            name: 'actions',
            type: 'array',
            label: 'Form Actions',
            admin: {
              description: 'Configure actions to execute when this form is submitted.',
            },
            fields: [
              {
                name: 'type',
                type: 'select',
                required: true,
                options: [
                  {
                    label: 'Log to Console',
                    value: 'logToConsole',
                  },
                  {
                    label: 'Create Reservation',
                    value: 'createReservation',
                  },
                ],
                admin: {
                  description: 'Type of action to execute.',
                },
              },
              {
                name: 'enabled',
                type: 'checkbox',
                defaultValue: true,
                admin: {
                  description: 'Enable or disable this action.',
                },
              },
              {
                name: 'maskFields',
                type: 'array',
                interfaceName: 'LogToConsoleActionMaskField',
                label: 'Fields to Mask',
                admin: {
                  condition: (_, { type }) => type === 'logToConsole',
                  description:
                    'Field names that should be masked in console logs (case-insensitive).',
                },
                fields: [
                  {
                    name: 'field',
                    type: 'text',
                    label: 'Field Name',
                    placeholder: 'e.g., password, token, secret',
                  },
                ],
              },
              {
                name: 'maxValueLength',
                type: 'number',
                admin: {
                  condition: (_, { type }) => type === 'logToConsole',
                  description:
                    'Maximum length for field values in logs (longer values will be truncated).',
                },
                defaultValue: 500,
              },
              // createReservation action - no additional config needed
              // The reservation type is selected dynamically via URL searchParams
            ],
          },
        ]
      },
      hooks: {
        beforeDelete: [
          // Cascade delete: remove all submissions for this form
          async ({ req, id }) => {
            try {
              await req.payload.delete({
                collection: 'form-submissions',
                where: {
                  form: {
                    equals: id,
                  },
                },
                req,
              })
            } catch (error) {
              console.error(`[formBuilderPlugin] Error deleting submissions for form ${id}:`, error)
              // Don't throw - allow form deletion to continue even if submissions deletion fails
            }
          },
        ],
      },
    },
  }),
  formActionsPlugin,
  restaurantReservationsPlugin({
    enabled: true,
  }),
]

// AI Translation plugin - DEBE IR AL FINAL para no ser sobrescrito
export const aiTranslationPluginInstance = process.env.OPENAI_API_KEY
  ? aiTranslationPlugin({
      enabled: true,
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-4o-mini',
      },
      collections: ['pages'], // Qué collections traducir
      globals: ['header', 'footer', 'chatbot'], // Qué globals traducir
      // Opcional: especificar qué fields traducir por collection/global
      // Si no se especifica, traduce TODOS los campos localizados
      // Soporta wildcards con * para arrays/blocks:
      // Ejemplos:
      //   'title' - campo simple
      //   'hero.richText' - campo anidado en grupo
      //   'layout.*.richText' - campo richText en TODOS los items del array layout
      //   'hero.links.*.link.label' - campo label en cada link del array links
      fields: {
        // pages: ['title', 'hero.richText', 'layout.*.richText'],
        // header: ['navItems.*.link.label'],
        // Si no especificas una collection aquí, traduce TODOS los campos localizados
      },
    })
  : undefined

export const allPlugins = aiTranslationPluginInstance ? [...plugins, aiTranslationPluginInstance] : plugins
