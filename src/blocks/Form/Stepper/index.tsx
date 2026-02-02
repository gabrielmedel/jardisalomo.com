'use client'
import type { Control, FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'
import React, { useState, useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/utilities/ui'
import { buttonVariants } from '@/components/ui/button'
import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { ExtendedFormFieldBlock, FormStepperBlock } from '../types'
import { isRowBlock } from '../types'

// Helper to get step indicator class based on position and error state
const getStepIndicatorClass = (
  index: number,
  currentStep: number,
  hasError: boolean,
): string => {
  // Error state takes priority for visual feedback
  if (hasError) {
    if (index === currentStep) {
      return 'border-destructive bg-destructive text-white'
    }
    return 'border-destructive bg-destructive/10 text-destructive cursor-pointer hover:bg-destructive/20'
  }

  if (index === currentStep) {
    return 'border-primary bg-primary text-white'
  }
  if (index < currentStep) {
    return 'border-primary bg-primary/10 text-primary cursor-pointer hover:bg-primary/20'
  }
  return 'border-accent/30 bg-white text-primary/40'
}

// Error icon component
const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={cn('w-5 h-5', className)} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
)

type StepperProps = FormStepperBlock & {
  control: Control
  errors: Partial<FieldErrorsImpl>
  register: UseFormRegister<FieldValues>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderField: (field: ExtendedFormFieldBlock, index: number, props: any) => React.ReactNode
  // Global validation error message from form config (RichText)
  validationErrorMessage?: DefaultTypedEditorState
  // Submit button label from form (global)
  submitButtonLabel?: string
}

// Default navigation labels (fallbacks)
const DEFAULT_LABELS = {
  previousButtonLabel: 'Anterior',
  nextButtonLabel: 'Següent',
  submitButtonLabel: 'Enviar',
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  control,
  errors,
  register,
  form,
  renderField,
  // Configurable labels from stepper block (prev/next only)
  previousButtonLabel,
  nextButtonLabel,
  // Submit button label from form (global)
  submitButtonLabel,
  // Global validation error message from form (RichText)
  validationErrorMessage,
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const {
    trigger,
    formState: { errors: formErrors },
  } = useFormContext()

  const totalSteps = steps?.length || 0

  // Use configured values or fallback to defaults
  const labels = {
    previous: previousButtonLabel || DEFAULT_LABELS.previousButtonLabel,
    next: nextButtonLabel || DEFAULT_LABELS.nextButtonLabel,
    submit: submitButtonLabel || DEFAULT_LABELS.submitButtonLabel,
  }

  // Get all field names in a step for validation
  const getStepFieldNames = useCallback(
    (stepIndex: number): string[] => {
      const step = steps?.[stepIndex]
      if (!step?.fields) return []

      const names: string[] = []
      const extractFieldNames = (fields: ExtendedFormFieldBlock[]) => {
        fields.forEach((field) => {
          if ('name' in field && field.name) {
            names.push(field.name)
          }
          // Handle nested fields in row blocks
          if (isRowBlock(field) && field.columns) {
            field.columns.forEach((col) => {
              if (col.fields) {
                extractFieldNames(col.fields)
              }
            })
          }
        })
      }
      extractFieldNames(step.fields ?? [])
      return names
    },
    [steps],
  )

  // Check if a step has any validation errors
  const stepHasErrors = useCallback(
    (stepIndex: number): boolean => {
      const fieldNames = getStepFieldNames(stepIndex)
      return fieldNames.some((name) => !!formErrors[name])
    },
    [getStepFieldNames, formErrors],
  )

  // Memoized array of steps with errors for efficient rendering
  const stepsWithErrors = useMemo(() => {
    if (!steps) return []
    return steps.map((_, index) => stepHasErrors(index))
  }, [steps, stepHasErrors])

  // Render step indicator content based on state
  const renderStepContent = (index: number, hasError: boolean): React.ReactNode => {
    if (hasError) {
      return <ErrorIcon />
    }
    if (index < currentStep) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )
    }
    return index + 1
  }

  const advanceStep = useCallback(async () => {
    const fieldNames = getStepFieldNames(currentStep)
    // Validate only the fields in the current step
    const isValid = await trigger(fieldNames)
    if (isValid && currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }, [currentStep, totalSteps, trigger, getStepFieldNames])

  const handleNext = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      e?.preventDefault()
      e?.stopPropagation()
      void advanceStep()
    },
    [advanceStep],
  )

  const handlePrevious = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (currentStep > 0) {
        setCurrentStep((prev) => prev - 1)
      }
    },
    [currentStep],
  )

  const goToStep = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>, stepIndex: number) => {
      e.preventDefault()
      e.stopPropagation()

      // Allow going to previous steps without validation
      if (stepIndex < currentStep) {
        setCurrentStep(stepIndex)
        return
      }

      // Validate all steps up to the target step
      for (let i = currentStep; i < stepIndex; i++) {
        const fieldNames = getStepFieldNames(i)
        const isValid = await trigger(fieldNames)
        if (!isValid) {
          setCurrentStep(i)
          return
        }
      }
      setCurrentStep(stepIndex)
    },
    [currentStep, trigger, getStepFieldNames],
  )

  const isLastStep = currentStep === totalSteps - 1

  const handleKeyDownCapture = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== 'Enter') return
      const target = e.target as HTMLElement | null
      if (!target) return

      // Allow Enter in textareas or contenteditable (for multiline)
      if (target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      if (!isLastStep) {
        e.preventDefault()
        e.stopPropagation()
        void advanceStep()
      }
    },
    [advanceStep, isLastStep],
  )

  if (!steps || steps.length === 0) {
    return null
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="stepper-container" onKeyDownCapture={handleKeyDownCapture}>
      {/* Step Indicators */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const hasError = stepsWithErrors[index]
          return (
            <React.Fragment key={index}>
              <button
                type="button"
                onClick={(e) => goToStep(e, index)}
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all font-sans relative',
                  getStepIndicatorClass(index, currentStep, hasError),
                )}
                aria-current={index === currentStep ? 'step' : undefined}
                aria-label={hasError ? `${step.title} - Error` : step.title}
                title={step.title}
              >
                {renderStepContent(index, hasError)}
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-12 md:w-24 h-0.5 mx-2',
                    index < currentStep ? 'bg-primary' : 'bg-accent/30',
                    hasError && 'bg-destructive/30',
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Step Title and Description */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-serif font-normal text-primary mb-2">
          {currentStepData.title}
        </h3>
        {currentStepData.description && (
          <p className="text-sm font-sans font-light text-primary/60">
            {currentStepData.description}
          </p>
        )}
        {/* Error message for current step (RichText from form config) */}
        {stepsWithErrors[currentStep] && validationErrorMessage && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-md">
            <RichText
              className="text-destructive text-sm [&_p]:mb-0"
              data={validationErrorMessage}
              enableGutter={false}
              enableProse={false}
            />
          </div>
        )}
      </div>

      {/* Step Fields */}
      <div className="space-y-6">
        {currentStepData.fields?.map((field, fieldIndex) =>
          renderField(field, fieldIndex, {
            form,
            control,
            errors,
            register,
          }),
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-accent/20">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            currentStep === 0 && 'invisible',
          )}
        >
          {labels.previous}
        </button>

        {isLastStep ? (
          <button type="submit" className={cn(buttonVariants({ variant: 'default' }))}>
            {labels.submit}
          </button>
        ) : (
          <button type="button" className={cn(buttonVariants({ variant: 'default' }))} onClick={handleNext}>
            {labels.next}
          </button>
        )}
      </div>
    </div>
  )
}
