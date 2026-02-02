'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState, useMemo } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { fields, layoutFields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import { cn } from '@/utilities/ui'
import type { ExtendedFormFieldBlock } from './types'
import { isLayoutBlock } from './types'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  backgroundColor?: 'none' | 'pastel' | 'olive' | 'accent'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
  locale?: string
}

// Check if form has a stepper at the top level
const hasTopLevelStepper = (formFields: ExtendedFormFieldBlock[]): boolean => {
  return formFields.some((field) => field.blockType === 'stepper')
}

export const FormBlock: React.FC<
  {
    id?: string
    locale?: string
  } & FormBlockType
> = (props) => {
  const {
    backgroundColor = 'none',
    enableIntro,
    form: formFromProps,
    form: {
      id: formID,
      confirmationMessage,
      confirmationType,
      redirect,
      submitButtonLabel,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = {} as any,
    introContent,
    locale = 'ca',
  } = props

  // Get validation error message from form (extended field)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validationErrorMessage = (formFromProps as any)?.validationErrorMessage

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  // Check if form uses stepper (hides submit button since stepper handles it)
  const formHasStepper = useMemo(() => {
    return formFromProps?.fields ? hasTopLevelStepper(formFromProps.fields) : false
  }, [formFromProps?.fields])

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  const getBackgroundClass = () => {
    switch (backgroundColor) {
      case 'pastel':
        return 'bg-pastel'
      case 'olive':
        return 'bg-olive'
      case 'accent':
        return 'bg-accent'
      default:
        return ''
    }
  }

  const getFieldKey = useCallback((field: ExtendedFormFieldBlock, index: number): string => {
    const withId = 'id' in field ? field.id : undefined
    if (withId) return String(withId)
    if ('name' in field && field.name) {
      return `${field.blockType}-${field.name}`
    }
    if (field.blockName) {
      return `${field.blockType}-${field.blockName}-${index}`
    }
    return `${field.blockType}-${index}`
  }, [])

  // Recursive field renderer
  const renderField = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (field: ExtendedFormFieldBlock, index: number, formProps: any): React.ReactNode => {
      const blockType = field.blockType
      const fieldKey = getFieldKey(field, index)

      // Handle layout fields (row, stepper)
      if (isLayoutBlock(field)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const LayoutField: React.FC<any> = layoutFields[blockType as keyof typeof layoutFields]
        if (LayoutField) {
          return (
            <div key={fieldKey}>
              <LayoutField
                {...field}
                {...formProps}
                form={formFromProps}
                control={control}
                errors={errors}
                register={register}
                renderField={renderField}
                validationErrorMessage={validationErrorMessage}
                submitButtonLabel={submitButtonLabel}
              />
            </div>
          )
        }
      }

      // Handle regular data fields
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Field: React.FC<any> = fields?.[blockType as keyof typeof fields]
      if (Field) {
        return (
          <div key={fieldKey}>
            <Field
              form={formFromProps}
              {...field}
              {...formProps}
              control={control}
              errors={errors}
              register={register}
              locale={locale}
            />
          </div>
        )
      }

      return null
    },
    [formFromProps, control, errors, register, validationErrorMessage, submitButtonLabel, getFieldKey, locale],
  )

  return (
    <section className={cn('py-16', getBackgroundClass())}>
      <div className="container max-w-4xl">
        {/* Intro Content - Centered with block richtext pattern */}
        {enableIntro && introContent && !hasSubmitted && (
          <div className="mb-12 max-w-2xl mx-auto">
            <RichText
              className="block-richtext text-center"
              data={introContent}
              enableGutter={false}
              enableProse={false}
            />
          </div>
        )}

        {/* Form Container */}
        <div className="w-full max-w-3xl mx-auto">
          <FormProvider {...formMethods}>
            {/* Success Message */}
            {!isLoading && hasSubmitted && confirmationType === 'message' && (
              <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
                <RichText
                  className="text-primary text-center"
                  data={confirmationMessage}
                  enableGutter={false}
                  enableProse={false}
                />
              </div>
            )}

            {/* Loading State */}
            {isLoading && !hasSubmitted && (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <p className="text-primary font-sans font-light text-lg">
                  Processant la teva sol·licitud...
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-error/10 border border-error/30 p-6 rounded-lg mb-8 text-center">
                <p className="text-error font-sans font-normal">
                  {error.message || 'Hi ha hagut un error. Si us plau, torna-ho a intentar.'}
                </p>
              </div>
            )}

            {/* Form */}
            {!hasSubmitted && (
              <form id={formID} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {formFromProps &&
                  formFromProps.fields &&
                  (formFromProps.fields as ExtendedFormFieldBlock[])?.map((field, index) =>
                    renderField(field, index, {
                      ...formMethods,
                      control,
                      errors,
                      register,
                    }),
                  )}

                {/* Submit Button - Centered (hidden when stepper is used) */}
                {!formHasStepper && (
                  <div className="flex justify-center pt-4">
                    <Button form={formID} type="submit" variant="default" size="lg">
                      {submitButtonLabel || 'Enviar'}
                    </Button>
                  </div>
                )}
              </form>
            )}
          </FormProvider>
        </div>
      </div>
    </section>
  )
}
