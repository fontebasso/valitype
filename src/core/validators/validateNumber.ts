import { ValidationError } from '../ValidationError.js'

const DECIMAL_RE = /^-?\d+(\.\d+)?$/

export function validateNumber(key: string, value: string | undefined): number {
  if (value === undefined)
    throw new ValidationError({
      key,
      value,
      code: 'REQUIRED',
      message: `${key} is required and must be a number`,
    })
  if (!DECIMAL_RE.test(value))
    throw new ValidationError({
      key,
      value,
      code: 'INVALID_NUMBER',
      message: `${key} must be a valid number`,
    })
  return Number(value)
}
