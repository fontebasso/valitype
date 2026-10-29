export type Matcher = { test(value: string): boolean }

export type StringRule = {
  type: 'string'
  required?: boolean
  default?: string
  message?: string
  minLength?: number
  maxLength?: number
  pattern?: RegExp | Matcher
  format?: 'json' | 'date'
}

export type NumberRule = {
  type: 'number'
  required?: boolean
  default?: number
  message?: string
  min?: number
  max?: number
}

export type BooleanRule = {
  type: 'boolean'
  required?: boolean
  default?: boolean
  message?: string
}

export type UrlRule = {
  type: 'url'
  required?: boolean
  default?: string
  message?: string
}

export type EnumRule = {
  type: { enum: string[] }
  required?: boolean
  default?: string
  message?: string
}

export type CustomValidatorFn = (value: string | undefined) => boolean | string

export type CustomRule = {
  type: 'custom'
  validator: CustomValidatorFn
  required?: boolean
  default?: string
  message?: string
}

export type Rule =
  | StringRule
  | NumberRule
  | BooleanRule
  | UrlRule
  | EnumRule
  | CustomRule
export type RuleTypeToValue<T extends Rule['type']> = T extends 'string'
  ? string
  : T extends 'number'
    ? number
    : T extends 'boolean'
      ? boolean
      : T extends 'url'
        ? string
        : T extends { enum: readonly string[] }
          ? string
          : T extends 'custom'
            ? string
            : never

export type RuleWithValue<T extends Rule> = T & {
  type: T['type']
  default?: RuleTypeToValue<T['type']>
}

export type ValidatedValue<T extends Rule> = RuleTypeToValue<T['type']>
