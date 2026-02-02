import type { CollectionAfterChangeHook, PayloadRequest } from 'payload'
import type { FormSubmission } from '@/payload-types'
import { calculateAvailability } from './availability'
import { createReservation } from '@/actions/formActions/actions/createReservation'
import type { FormWithActions } from '@/actions/formActions/types'

type SubmissionField = {
  field?: string
  value?: unknown
}

const reservationTypeSuffix = '_reservationType'

const getSubmissionValue = (submissionData: SubmissionField[], fieldName: string) => {
  const entry = submissionData.find((item) => item?.field === fieldName)
  return entry?.value
}

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

const getReservationFieldNames = (submissionData: SubmissionField[]) => {
  const reservationFieldNames = new Set<string>()

  for (const entry of submissionData) {
    if (typeof entry?.field === 'string' && entry.field.endsWith(reservationTypeSuffix)) {
      reservationFieldNames.add(entry.field.slice(0, -reservationTypeSuffix.length))
    }
  }

  return [...reservationFieldNames]
}

const getReservationPayload = (submissionData: SubmissionField[], fieldName: string) => {
  const reservationType = getSubmissionValue(submissionData, `${fieldName}_reservationType`)
  const date = getSubmissionValue(submissionData, `${fieldName}_date`)
  const startTime = getSubmissionValue(submissionData, `${fieldName}_startTime`)
  const endTime = getSubmissionValue(submissionData, `${fieldName}_endTime`)
  const numberOfPeopleValue = getSubmissionValue(submissionData, `${fieldName}_numberOfPeople`)

  if (!reservationType || !date || !startTime || !endTime || numberOfPeopleValue == null) {
    return null
  }

  const numberOfPeople = toNumber(numberOfPeopleValue)
  if (!numberOfPeople || numberOfPeople < 1) {
    return null
  }

  return { reservationType, date, startTime, endTime, numberOfPeople }
}

const hasExistingReservation = async (
  req: PayloadRequest,
  submissionId: FormSubmission['id'],
  payload: {
    reservationType: unknown
    date: unknown
    startTime: unknown
    endTime: unknown
  },
) => {
  const existing = await req.payload.find({
    collection: 'reservations',
    where: {
      and: [
        { formSubmission: { equals: submissionId } },
        { reservationType: { equals: payload.reservationType as string } },
        { date: { equals: payload.date as string } },
        { startTime: { equals: payload.startTime as string } },
        { endTime: { equals: payload.endTime as string } },
      ],
    },
    limit: 1,
    req,
  })

  return existing.totalDocs > 0
}

const hasAvailability = async (
  req: PayloadRequest,
  payload: {
    reservationType: unknown
    date: unknown
    startTime: unknown
    endTime: unknown
    numberOfPeople: number
  },
) => {
  const availability = await calculateAvailability(
    req.payload,
    payload.reservationType as string,
    payload.date as string,
  )
  const matchingSlot = availability.find(
    (slot) => slot.startTime === payload.startTime && slot.endTime === payload.endTime,
  )

  if (!matchingSlot) {
    return false
  }

  return matchingSlot.available >= payload.numberOfPeople
}

const processReservationField = async (
  fieldName: string,
  submissionData: SubmissionField[],
  doc: FormSubmission,
  req: PayloadRequest,
) => {
  const reservationPayload = getReservationPayload(submissionData, fieldName)
  if (!reservationPayload) {
    return
  }

  const exists = await hasExistingReservation(req, doc.id, reservationPayload)
  if (exists) {
    return
  }

  try {
    const available = await hasAvailability(req, reservationPayload)
    if (!available) {
      console.warn(
        `[createReservationOnSubmission] No availability for ${reservationPayload.date} ${reservationPayload.startTime}-${reservationPayload.endTime}`,
      )
      return
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`[createReservationOnSubmission] Availability check failed: ${errorMessage}`)
    return
  }

  const result = await createReservation(
    {
      submission: doc,
      payload: req.payload,
      req,
      form: {} as FormWithActions,
    },
    {
      type: 'createReservation',
      enabled: true,
      reservationFieldMapping: { reservationFieldName: fieldName },
    },
  )

  if (result.status === 'error') {
    console.error(
      `[createReservationOnSubmission] Error creating reservation: ${result.message || 'unknown error'}`,
    )
  }
}

export const createReservationOnSubmission: CollectionAfterChangeHook<FormSubmission> = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== 'create') return doc

  const submissionData = Array.isArray(doc?.submissionData)
    ? (doc.submissionData as SubmissionField[])
    : []

  if (submissionData.length === 0) {
    return doc
  }

  const reservationFieldNames = getReservationFieldNames(submissionData)

  if (reservationFieldNames.length === 0) {
    return doc
  }

  for (const fieldName of reservationFieldNames) {
    await processReservationField(fieldName, submissionData, doc, req)
  }

  return doc
}
