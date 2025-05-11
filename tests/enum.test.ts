import { describe, it, expect } from 'vitest'
import { validateEnum } from '../src/core/validators/validateEnum'

describe('validateEnum', () => {
  it('should validate when value is in options', () => {
    expect(validateEnum('TEST', 'option1', ['option1', 'option2'])).toBe('option1')
  })

  it('should throw error when value is not in options', () => {
    expect(() => validateEnum('TEST', 'option3', ['option1', 'option2'])).toThrow(
      'TEST must be one of: option1, option2'
    )
  })

  it('should handle empty string value', () => {
    expect(() => validateEnum('TEST', '', ['option1', 'option2'])).toThrow(
      'TEST must be one of: option1, option2'
    )
  })

  it('should handle undefined value', () => {
    expect(() => validateEnum('TEST', undefined, ['option1', 'option2'])).toThrow(
      'TEST must be one of: option1, option2'
    )
  })
})
