import { describe, it, expect } from 'vitest'
import { validateUrl } from '../src/core/validators/validateUrl'

describe('validateUrl', () => {
  it('throws if value is undefined', () => {
    expect(() => validateUrl('API_URL', undefined)).toThrow(
      'API_URL is required and must be a URL'
    )
  })

  it('throws if value is not a valid URL', () => {
    expect(() => validateUrl('API_URL', 'notaurl')).toThrow(
      'API_URL must be a valid URL'
    )
  })

  it('passes if value is a valid URL', () => {
    expect(validateUrl('API_URL', 'https://example.com')).toBe(
      'https://example.com'
    )
  })
})
