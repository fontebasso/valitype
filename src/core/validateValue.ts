import { Rule, ValidatedValue, EnumRule, CustomRule } from './rules.js'

import { validateBoolean } from './validators/validateBoolean.js'
import { validateCustom } from './validators/validateCustom.js'
import { validateEnum } from './validators/validateEnum.js'
import { validateNumber } from './validators/validateNumber.js'
import { validateString } from './validators/validateString.js'
import { validateUrl } from './validators/validateUrl.js'

function dispatchRule(key: string, value: string, rule: Rule): unknown {
  if (rule.type === 'string') return validateString(key, value)
  if (rule.type === 'number') return validateNumber(key, value)
  if (rule.type === 'boolean') return validateBoolean(key, value)
  if (rule.type === 'url') return validateUrl(key, value)
  if (typeof rule.type === 'object' && 'enum' in rule.type)
    return validateEnum(key, value, rule.type.enum)
  if (rule.type === 'custom')
    return validateCustom(key, value, rule.validator, rule.errorMessage)
  const _exhaustive: never = rule
  throw new Error(`${key} has an unknown rule type: ${JSON.stringify((_exhaustive as Rule).type)}`)
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
      throw new Error(`${key} is required and must be one of: ${enumRule.type.enum.join(', ')}`)
    }
    throw new Error(`${key} is required`)
  }

  if (value === undefined) {
    return undefined as unknown as ValidatedValue<T>
  }

  return dispatchRule(key, value, rule as Rule) as ValidatedValue<T>
}
