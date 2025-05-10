import { validateBoolean } from '../src/core/validators/validateBoolean'

import { describe, it, expect } from 'vitest'
describe('validateBoolean', () => {
  it('throws if value is undefined', () => {
    expect(() => validateBoolean('DEBUG', undefined)).toThrow(
      'DEBUG is required and must be a boolean'
    )
  })

  it('returns true when value is "true"', () => {
    expect(validateBoolean('DEBUG', 'true')).toBe(true)
  })

  it('returns false when value is "false"', () => {
    expect(validateBoolean('DEBUG', 'false')).toBe(false)
  })

  it('throws on invalid boolean string', () => {
    expect(() => validateBoolean('DEBUG', 'yes')).toThrow(
      'DEBUG must be either "true" or "false"'
    )
  })
})
