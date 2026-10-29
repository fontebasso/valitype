import type { StringRule } from '../rules.js'
import { ValidationError } from '../ValidationError.js'
import { validators } from './index.js'

const isJson = validators.json()
const isIsoDate = validators.date('YYYY-MM-DD')

export function validateString(
  key: string,
  value: string | undefined,
  rule: Omit<StringRule, 'type'> = {}
): string {
  if (value === undefined)
    throw new ValidationError({
      key,
      value,
      code: 'REQUIRED',
      message: `${key} is required and must be a string`,
    })

  const { pattern, minLength, maxLength, format } = rule
  const fail = (code: ValidationError['code'], message: string): never => {
    throw new ValidationError({ key, value, code, message })
  }

  if (pattern !== undefined && !pattern.test(value))
    fail(
      'PATTERN_MISMATCH',
      pattern instanceof RegExp
        ? `${key} must match the pattern ${pattern}`
        : `${key} must match the pattern`
    )
  const length = [...value].length
  if (minLength !== undefined && length < minLength)
    fail('TOO_SHORT', `${key} must be at least ${minLength} characters long`)
  if (maxLength !== undefined && length > maxLength)
    fail('TOO_LONG', `${key} must be at most ${maxLength} characters long`)
  if (format === 'json' && isJson(value) !== true)
    fail('INVALID_FORMAT', `${key} must be valid JSON`)
  if (format === 'date' && isIsoDate(value) !== true)
    fail('INVALID_FORMAT', `${key} must be a valid date in YYYY-MM-DD format`)

  return value
}
