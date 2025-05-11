export type CustomValidatorFn = (value: string | undefined) => boolean | string

export const validators = {
  regex: (pattern: RegExp, errorMsg?: string): CustomValidatorFn => (value) => {
    if (value === undefined) return true
    return pattern.test(value) ? true : (errorMsg || `Value does not match pattern ${pattern}`)
  },

  range: (min: number, max: number, errorMsg?: string): CustomValidatorFn => (value) => {
    if (value === undefined) return true
    const num = Number(value)
    return (!isNaN(num) && num >= min && num <= max) ? 
      true : 
      (errorMsg || `Value must be between ${min} and ${max}`)
  },
  
  oneOf: (allowedValues: unknown[], errorMsg?: string): CustomValidatorFn => (value) => {
    if (value === undefined) return true
    return allowedValues.includes(value) ? 
      true : 
      (errorMsg || `Value must be one of: ${allowedValues.join(', ')}`)
  },

  date: (format?: string, errorMsg?: string): CustomValidatorFn => (value) => {
    if (value === undefined) return true
    const date = new Date(value)
    return !isNaN(date.getTime()) ? 
      true : 
      (errorMsg || `Value must be a valid date${format ? ` in format ${format}` : ''}`)
  },

  json: (errorMsg?: string): CustomValidatorFn => (value) => {
    if (value === undefined) return true
    try {
      JSON.parse(value)
      return true
    } catch {
      return errorMsg || 'Value must be valid JSON'
    }
  },

  awsArn: (service?: string, errorMsg?: string): CustomValidatorFn => (value) => {
    if (value === undefined) return true
    const arnPattern = /^arn:aws:[a-z0-9-]+:[a-z0-9-]*:\d{12}:.+$/
    if (!arnPattern.test(value)) {
      return errorMsg || 'Value must be a valid AWS ARN'
    }
    if (service) {
      const parts = value.split(':')
      if (parts[2] !== service) {
        return errorMsg || `ARN must be for service: ${service}`
      }
    }
    return true
  },

  all: (...validators: CustomValidatorFn[]): CustomValidatorFn => (value) => {
    for (const validator of validators) {
      const result = validator(value)
      if (result !== true) return result
    }
    return true
  }
}
