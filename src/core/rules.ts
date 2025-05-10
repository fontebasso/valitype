export type StringRule = {
  type: 'string'
  required?: boolean
  default?: string
}

export type NumberRule = {
  type: 'number'
  required?: boolean
  default?: number
}

export type BooleanRule = {
  type: 'boolean'
  required?: boolean
  default?: boolean
}

export type UrlRule = {
  type: 'url'
  required?: boolean
  default?: string
}

export type EnumRule = {
  type: { enum: string[] }
  required?: boolean
  default?: string
}

export type Rule = StringRule | NumberRule | BooleanRule | UrlRule | EnumRule
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
          : never

export type RuleWithValue<T extends Rule> = T & {
  type: T['type']
  default?: RuleTypeToValue<T['type']>
}

export type ValidatedValue<T extends Rule> = RuleTypeToValue<T['type']>
