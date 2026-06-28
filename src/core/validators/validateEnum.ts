import { ValidationError } from '../ValidationError.js'

export function validateEnum(key: string, value: string | undefined, options: string[]): string {
  if (!options.includes(value ?? ''))
    throw new ValidationError({ key, value, code: 'INVALID_ENUM', message: `${key} must be one of: ${options.join(', ')}` })
  return value as string
}
