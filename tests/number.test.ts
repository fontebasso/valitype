import { describe, it, expect } from 'vitest'
import { validateNumber } from '../src/core/validators/validateNumber.js'

describe('validateNumber', () => {
  it('throws if value is undefined', () => {
    expect(() => validateNumber('PORT', undefined)).toThrow(
      'PORT is required and must be a number'
    )
  })

  it('throws if value is not a number', () => {
    expect(() => validateNumber('PORT', 'abc')).toThrow(
      'PORT must be a valid number'
    )
  })

  it('throws for empty string', () => {
    expect(() => validateNumber('PORT', '')).toThrow('PORT must be a valid number')
  })

  it('throws for hexadecimal notation', () => {
    expect(() => validateNumber('PORT', '0x10')).toThrow('PORT must be a valid number')
  })

  it('throws for scientific notation', () => {
    expect(() => validateNumber('PORT', '1e5')).toThrow('PORT must be a valid number')
  })

  it('throws for value with leading whitespace', () => {
    expect(() => validateNumber('PORT', ' 8080')).toThrow('PORT must be a valid number')
  })

  it('parses valid integer strings', () => {
    expect(validateNumber('PORT', '8080')).toBe(8080)
  })

  it('parses negative integers', () => {
    expect(validateNumber('OFFSET', '-42')).toBe(-42)
  })

  it('parses decimal numbers', () => {
    expect(validateNumber('RATIO', '3.14')).toBe(3.14)
  })
})
