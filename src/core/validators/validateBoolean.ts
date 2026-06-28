import { ValidationError } from '../ValidationError.js'

export function validateBoolean(key: string, value: string | undefined): boolean {
  if (value === undefined)
    throw new ValidationError({ key, value, code: 'REQUIRED', message: `${key} is required and must be a boolean` })
  if (value === 'true') return true
  if (value === 'false') return false
  throw new ValidationError({ key, value, code: 'INVALID_BOOLEAN', message: `${key} must be either "true" or "false"` })
}
