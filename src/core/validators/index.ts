import type { Matcher } from '../rules.js'
import { isUrl } from '../url.js'

export type CustomValidatorFn = (value: string | undefined) => boolean | string

const DECIMAL_RE = /^-?\d+(\.\d+)?$/

type DatePart = 'YYYY' | 'MM' | 'DD'

function formatToRegex(format: string): { regex: RegExp; parts: DatePart[] } {
  const parts: DatePart[] = []
  const pattern = format.replace(
    /YYYY|MM|DD|[YMD]|[.*+?^${}()|[\]\\]/g,
    (token) => {
      if (token === 'YYYY' || token === 'MM' || token === 'DD') {
        parts.push(token)
        return `(\\d{${token.length}})`
      }
      if (token === 'Y' || token === 'M' || token === 'D') return '\\d'
      return `\\${token}`
    }
  )
  return { regex: new RegExp(`^${pattern}$`), parts }
}

function isCalendarDate(year: number, month: number, day: number) {
  const date = new Date(0)
  date.setUTCFullYear(year, month - 1, day)
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

function matchesDateFormat(format: string, value: string): boolean | null {
  const { regex, parts } = formatToRegex(format)
  const match = regex.exec(value)
  if (!match) return false
  const fields: Partial<Record<DatePart, number>> = {}
  parts.forEach((part, index) => (fields[part] = Number(match[index + 1])))
  const { YYYY, MM, DD } = fields
  if (YYYY === undefined || MM === undefined || DD === undefined) return null
  return isCalendarDate(YYYY, MM, DD)
}

export const validators = {
  regex:
    (pattern: RegExp | Matcher, errorMsg?: string): CustomValidatorFn =>
    (value) => {
      if (value === undefined) return true
      return pattern.test(value)
        ? true
        : errorMsg || `Value does not match pattern ${pattern}`
    },

  range:
    (min: number, max: number, errorMsg?: string): CustomValidatorFn =>
    (value) => {
      if (value === undefined) return true
      if (!DECIMAL_RE.test(value))
        return errorMsg || `Value must be between ${min} and ${max}`
      const num = Number(value)
      return num >= min && num <= max
        ? true
        : errorMsg || `Value must be between ${min} and ${max}`
    },

  oneOf:
    (allowedValues: unknown[], errorMsg?: string): CustomValidatorFn =>
    (value) => {
      if (value === undefined) return true
      return allowedValues.includes(value)
        ? true
        : errorMsg || `Value must be one of: ${allowedValues.join(', ')}`
    },

  date:
    (format?: string, errorMsg?: string): CustomValidatorFn =>
    (value) => {
      if (value === undefined) return true
      const invalid =
        errorMsg ||
        `Value must be a valid date${format ? ` in format ${format}` : ''}`
      if (format) {
        const calendar = matchesDateFormat(format, value)
        if (calendar !== null) return calendar || invalid
      }
      const date = new Date(value)
      return !isNaN(date.getTime()) ? true : invalid
    },

  json:
    (errorMsg?: string): CustomValidatorFn =>
    (value) => {
      if (value === undefined) return true
      try {
        JSON.parse(value)
        return true
      } catch {
        return errorMsg || 'Value must be valid JSON'
      }
    },

  url:
    (errorMsg?: string): CustomValidatorFn =>
    (value) => {
      if (value === undefined) return true
      return isUrl(value) || errorMsg || 'Value must be a valid URL'
    },

  awsArn:
    (service?: string, errorMsg?: string): CustomValidatorFn =>
    (value) => {
      if (value === undefined) return true
      const arnPattern =
        /^arn:(aws|aws-cn|aws-us-gov):[a-z0-9-]+:[a-z0-9-]*:\d{12}:.+$/
      if (!arnPattern.test(value))
        return errorMsg || 'Value must be a valid AWS ARN'
      if (service) {
        const parts = value.split(':')
        if (parts[2] !== service)
          return errorMsg || `ARN must be for service: ${service}`
      }
      return true
    },

  all: (...fns: CustomValidatorFn[]): CustomValidatorFn => {
    const validFns = fns.filter(
      (fn): fn is CustomValidatorFn => typeof fn === 'function'
    )
    return (value) => {
      for (const fn of validFns) {
        const result = fn(value)
        if (result !== true) return result
      }
      return true
    }
  },
}
