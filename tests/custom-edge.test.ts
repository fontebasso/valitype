import { describe, it, expect } from 'vitest'
import { validateCustom } from '../src/core/validators/validateCustom'

describe('validateCustom edge cases', () => {
  it('should handle validator returning false with no error message', () => {
    const validator = () => false
    expect(() => validateCustom('TEST', 'value', validator)).toThrow('TEST failed custom validation')
  })

  it('should handle validator returning false with custom error message', () => {
    const validator = () => false
    expect(() => validateCustom('TEST', 'value', validator, 'Custom error')).toThrow('Custom error')
  })
})
