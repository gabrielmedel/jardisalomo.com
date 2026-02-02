import { Checkbox } from './Checkbox'
import { Country } from './Country'
import { Email } from './Email'
import { Message } from './Message'
import { Number } from './Number'
import { Select } from './Select'
import { State } from './State'
import { Text } from './Text'
import { Textarea } from './Textarea'
import { Row } from './Row'
import { Stepper } from './Stepper'
import ReservationField from './ReservationField'

export const fields = {
  checkbox: Checkbox,
  country: Country,
  email: Email,
  message: Message,
  number: Number,
  select: Select,
  state: State,
  text: Text,
  textarea: Textarea,
  reservationField: ReservationField,
}

// Layout components (don't affect data submission)
export const layoutFields = {
  row: Row,
  stepper: Stepper,
}

// All field types combined
export const allFields = {
  ...fields,
  ...layoutFields,
}
