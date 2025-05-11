import { describe, it, expect } from 'vitest'
import { validateEnum } from '../src/core/validators/validateEnum'

describe('validateEnum edge cases', () => {
  it('should handle empty options array', () => {
    expect(() => validateEnum('TEST', 'value', [])).toThrow('TEST must be one of: ')
  })
})
