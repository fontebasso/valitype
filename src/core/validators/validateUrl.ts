import { ValidationError } from '../ValidationError.js'

export function validateUrl(key: string, value: string | undefined): string {
  if (value === undefined)
    throw new ValidationError({ key, value, code: 'REQUIRED', message: `${key} is required and must be a URL` })
  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new ValidationError({ key, value, code: 'INVALID_URL', message: `${key} must be a valid URL` })
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:')
    throw new ValidationError({ key, value, code: 'INVALID_URL', message: `${key} must be a valid URL` })
  return value
}
