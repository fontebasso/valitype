import { Rule, ValidatedValue, CustomRule, EnumRule } from './rules.js'

import { validateBoolean } from './validators/validateBoolean.js'
import { validateCustom } from './validators/validateCustom.js'
import { validateEnum } from './validators/validateEnum.js'
import { validateNumber } from './validators/validateNumber.js'
import { validateString } from './validators/validateString.js'
import { validateUrl } from './validators/validateUrl.js'

export function validateValue<T extends Rule>(
  key: string,
  raw: string | undefined,
  rule: T
): ValidatedValue<T> {
  const value =
    raw ?? (rule.default !== undefined ? String(rule.default) : undefined)

  if (rule.required && value === undefined) {
    if (typeof rule.type === 'object' && 'enum' in rule.type) {
      const enumRule = rule as EnumRule;
      throw new Error(`${key} is required and must be one of: ${enumRule.type.enum.join(', ')}`);
    }
    throw new Error(`${key} is required`);
  }

  if (value === undefined) {
    return undefined as unknown as ValidatedValue<T>
  }

  if (rule.type === 'string')
    return validateString(key, value) as ValidatedValue<T>
  if (rule.type === 'number')
    return validateNumber(key, value) as ValidatedValue<T>
  if (rule.type === 'boolean')
    return validateBoolean(key, value) as ValidatedValue<T>
  if (rule.type === 'url') return validateUrl(key, value) as ValidatedValue<T>
  if (typeof rule.type === 'object' && 'enum' in rule.type) {
    return validateEnum(key, value, rule.type.enum) as ValidatedValue<T>
  }
  if (rule.type === 'custom') {
    const customRule = rule as CustomRule
    return validateCustom(
      key, 
      value, 
      customRule.validator, 
      customRule.errorMessage
    ) as ValidatedValue<T>
  }

  throw new Error(`${key} has an unknown rule type`)
}
