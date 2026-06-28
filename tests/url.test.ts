import { describe, it, expect } from 'vitest'
import { validateUrl } from '../src/core/validators/validateUrl.js'

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

  it('throws for file:// scheme', () => {
    expect(() => validateUrl('API_URL', 'file:///etc/passwd')).toThrow(
      'API_URL must be a valid URL'
    )
  })

  it('throws for ftp:// scheme', () => {
    expect(() => validateUrl('API_URL', 'ftp://example.com')).toThrow(
      'API_URL must be a valid URL'
    )
  })

  it('passes for https:// URL', () => {
    expect(validateUrl('API_URL', 'https://example.com')).toBe(
      'https://example.com'
    )
  })

  it('passes for http:// URL', () => {
    expect(validateUrl('API_URL', 'http://localhost:3000')).toBe(
      'http://localhost:3000'
    )
  })
})
