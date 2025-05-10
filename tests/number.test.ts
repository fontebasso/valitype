import { describe, it, expect } from 'vitest'
import { validateNumber } from '../src/core/validators/validateNumber'

describe('validateNumber', () => {
  it('throws if value is undefined', () => {
    expect(() => validateNumber('PORT', undefined))
      .toThrow('PORT is required and must be a number')
  })

  it('throws if value is not a number', () => {
    expect(() => validateNumber('PORT', 'abc'))
      .toThrow('PORT must be a valid number')
  })

  it('parses valid numeric strings', () => {
    expect(validateNumber('PORT', '8080')).toBe(8080)
  })
})
