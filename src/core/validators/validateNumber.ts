import type { NumberRule } from '../rules.js'
import { ValidationError } from '../ValidationError.js'

const DECIMAL_RE = /^-?\d+(\.\d+)?$/

export function validateNumber(
  key: string,
  value: string | undefined,
  rule: Omit<NumberRule, 'type'> = {}
): number {
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
  const num = Number(value)
  if (rule.min !== undefined && num < rule.min)
    throw new ValidationError({
      key,
      value,
      code: 'BELOW_MIN',
      message: `${key} must be greater than or equal to ${rule.min}`,
    })
  if (rule.max !== undefined && num > rule.max)
    throw new ValidationError({
      key,
      value,
      code: 'ABOVE_MAX',
      message: `${key} must be less than or equal to ${rule.max}`,
    })
  return num
}
