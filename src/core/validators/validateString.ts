import { ValidationError } from '../ValidationError.js'

export function validateString(key: string, value: string | undefined): string {
  if (value === undefined)
    throw new ValidationError({
      key,
      value,
      code: 'REQUIRED',
      message: `${key} is required and must be a string`,
    })
  return value
}
