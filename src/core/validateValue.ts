import { Rule, ValidatedValue, EnumRule } from './rules.js'
import { ValidationError } from './ValidationError.js'

import { validateBoolean } from './validators/validateBoolean.js'
import { validateCustom } from './validators/validateCustom.js'
import { validateEnum } from './validators/validateEnum.js'
import { validateNumber } from './validators/validateNumber.js'
import { validateString } from './validators/validateString.js'
import { validateUrl } from './validators/validateUrl.js'

function dispatchRule(key: string, value: string, rule: Rule): unknown {
  if (typeof rule.type === 'object' && 'enum' in rule.type)
    return validateEnum(key, value, rule.type.enum)

  const r = rule as Exclude<Rule, EnumRule>
  if (r.type === 'string') return validateString(key, value)
  if (r.type === 'number') return validateNumber(key, value)
  if (r.type === 'boolean') return validateBoolean(key, value)
  if (r.type === 'url') return validateUrl(key, value)
  if (r.type === 'custom') return validateCustom(key, value, r.validator, r.errorMessage)

  const _exhaustive: never = r
  throw new ValidationError({
    key,
    value,
    code: 'UNKNOWN_RULE',
    message: `${key} has an unknown rule type: ${JSON.stringify((_exhaustive as Rule).type)}`,
  })
}

export function validateValue<T extends Rule>(
  key: string,
  raw: string | undefined,
  rule: T
): ValidatedValue<T> {
  const value =
    raw ?? (rule.default !== undefined ? String(rule.default) : undefined)

  if (rule.required && value === undefined) {
    if (typeof rule.type === 'object' && 'enum' in rule.type) {
      const enumRule = rule as EnumRule
      throw new ValidationError({
        key,
        value: raw,
        code: 'REQUIRED',
        message: `${key} is required and must be one of: ${enumRule.type.enum.join(', ')}`,
      })
    }
    throw new ValidationError({ key, value: raw, code: 'REQUIRED', message: `${key} is required` })
  }

  if (value === undefined) {
    return undefined as unknown as ValidatedValue<T>
  }

  return dispatchRule(key, value, rule as Rule) as ValidatedValue<T>
}
