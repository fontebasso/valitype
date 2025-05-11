import { describe, it, expect } from 'vitest'
import { validateString } from '../src/core/validators/validateString'

describe('validateString', () => {
  it('should return the value when it is a string', () => {
    expect(validateString('TEST', 'value')).toBe('value')
  })

  it('should return empty string when value is empty string', () => {
    expect(validateString('TEST', '')).toBe('')
  })

  it('should throw error when value is undefined', () => {
    expect(() => validateString('TEST', undefined)).toThrow(
      'TEST is required and must be a string'
    )
  })
})
