import type { FormFieldBlock } from '@payloadcms/plugin-form-builder/types'

// Extended form field types to include layout blocks
export type RowColumnWidth =
  | 'full'
  | 'half'
  | 'third'
  | 'quarter'
  | 'twoThirds'
  | 'threeQuarters'

export interface FormRowBlock {
  blockType: 'row'
  blockName?: string
  columns?: {
    fields?: ExtendedFormFieldBlock[]
    width?: RowColumnWidth
  }[]
}

export interface FormStepperBlock {
  blockType: 'stepper'
  blockName?: string
  steps?: {
    title: string
    description?: string
    fields?: ExtendedFormFieldBlock[]
  }[]
  // Navigation labels (only prev/next, submit comes from form)
  previousButtonLabel?: string
  nextButtonLabel?: string
}

// Union of all field types including layout
export type ExtendedFormFieldBlock = FormFieldBlock | FormRowBlock | FormStepperBlock

// Type guard for row blocks
export const isRowBlock = (field: ExtendedFormFieldBlock): field is FormRowBlock => {
  return field.blockType === 'row'
}

// Type guard for stepper blocks
export const isStepperBlock = (field: ExtendedFormFieldBlock): field is FormStepperBlock => {
  return field.blockType === 'stepper'
}

// Type guard for layout blocks
export const isLayoutBlock = (field: ExtendedFormFieldBlock): field is FormRowBlock | FormStepperBlock => {
  return field.blockType === 'row' || field.blockType === 'stepper'
}

// Type guard for data fields (non-layout)
export const isDataField = (field: ExtendedFormFieldBlock): field is FormFieldBlock => {
  return !isLayoutBlock(field)
}
