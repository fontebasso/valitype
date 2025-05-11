import { describe, it, expect } from 'vitest'
import { validateValue, validators } from '../src/index.js'

describe('Custom validators', () => {
  describe('basic custom validation', () => {
    it('should validate with custom validator', () => {
      const rule = {
        type: 'custom' as const,
        validator: (value: string | undefined) => value === 'valid' ? true : 'Must be valid',
        required: true
      }

      expect(() => validateValue('TEST', 'valid', rule)).not.toThrow()
      expect(() => validateValue('TEST', 'invalid', rule)).toThrow('Must be valid')
      expect(() => validateValue('TEST', undefined, rule)).toThrow('TEST is required')
    })

    it('should use errorMessage when validator returns false', () => {
      const rule = {
        type: 'custom' as const,
        validator: (value: string | undefined) => value === 'valid',
        errorMessage: 'Custom error message',
        required: true
      }

      expect(() => validateValue('TEST', 'invalid', rule)).toThrow('Custom error message')
    })
  })

  describe('regex validator', () => {
    it('should validate regex patterns correctly', () => {
      const rule = {
        type: 'custom' as const,
        validator: validators.regex(/^[A-Z]{3}$/),
        required: true
      }

      expect(() => validateValue('CODE', 'ABC', rule)).not.toThrow()
      expect(() => validateValue('CODE', 'abc', rule)).toThrow()
      expect(() => validateValue('CODE', 'ABCD', rule)).toThrow()
    })

    it('should use custom error message', () => {
      const rule = {
        type: 'custom' as const,
        validator: validators.regex(/^[A-Z]{3}$/, 'Must be 3 uppercase letters'),
        required: true
      }

      expect(() => validateValue('CODE', 'abc', rule)).toThrow('Must be 3 uppercase letters')
    })
  })

  describe('range validator', () => {
    it('should validate numeric ranges correctly', () => {
      const rule = {
        type: 'custom' as const,
        validator: validators.range(1, 100),
        required: true
      }

      expect(() => validateValue('NUMBER', '50', rule)).not.toThrow()
      expect(() => validateValue('NUMBER', '0', rule)).toThrow()
      expect(() => validateValue('NUMBER', '101', rule)).toThrow()
      expect(() => validateValue('NUMBER', 'abc', rule)).toThrow()
    })
  })

  describe('oneOf validator', () => {
    it('should validate allowed values correctly', () => {
      const rule = {
        type: 'custom' as const,
        validator: validators.oneOf(['apple', 'banana', 'orange']),
        required: true
      }

      expect(() => validateValue('FRUIT', 'apple', rule)).not.toThrow()
      expect(() => validateValue('FRUIT', 'grape', rule)).toThrow()
    })
  })

  describe('date validator', () => {
    it('should validate date strings correctly', () => {
      const rule = {
        type: 'custom' as const,
        validator: validators.date(),
        required: true
      }

      expect(() => validateValue('DATE', '2023-05-10', rule)).not.toThrow()
      expect(() => validateValue('DATE', 'not-a-date', rule)).toThrow('Value must be a valid date')
    })

    it('should handle undefined values', () => {
      const rule = {
        type: 'custom' as const,
        validator: validators.date(),
        required: false
      }

      expect(() => validateValue('DATE', undefined, rule)).not.toThrow()
    })

    it('should use custom error message with format', () => {
      const rule = {
        type: 'custom' as const,
        validator: validators.date('YYYY-MM-DD', 'Must be a valid date in YYYY-MM-DD format'),
        required: true
      }

      expect(() => validateValue('DATE', 'invalid', rule)).toThrow('Must be a valid date in YYYY-MM-DD format')
    })

    it('should include format in default error message', () => {
      const rule = {
        type: 'custom' as const,
        validator: validators.date('YYYY-MM-DD'),
        required: true
      }

      expect(() => validateValue('DATE', 'invalid', rule)).toThrow('Value must be a valid date in format YYYY-MM-DD')
    })
  })

  describe('json validator', () => {
    it('should validate JSON strings correctly', () => {
      const rule = {
        type: 'custom' as const,
        validator: validators.json(),
        required: true
      }

      expect(() => validateValue('CONFIG', '{"name":"test"}', rule)).not.toThrow()
      expect(() => validateValue('CONFIG', '{invalid}', rule)).toThrow()
    })
  })

  describe('awsArn validator', () => {
    it('should validate AWS ARNs correctly', () => {
      const rule = {
        type: 'custom' as const,
        validator: validators.awsArn(),
        required: true
      }

      expect(() => validateValue('RESOURCE', 'arn:aws:lambda:us-east-1:123456789012:function:my-function', rule)).not.toThrow()
      expect(() => validateValue('RESOURCE', 'invalid-arn', rule)).toThrow()
    })

    it('should validate specific AWS service ARNs', () => {
      const rule = {
        type: 'custom' as const,
        validator: validators.awsArn('lambda'),
        required: true
      }

      expect(() => validateValue('RESOURCE', 'arn:aws:lambda:us-east-1:123456789012:function:my-function', rule)).not.toThrow()
      expect(() => validateValue('RESOURCE', 'arn:aws:s3:us-east-1:123456789012:bucket:my-bucket', rule)).toThrow()
    })
  })

  describe('combined validators', () => {
    it('should validate with multiple conditions', () => {
      const rule = {
        type: 'custom' as const,
        validator: validators.all(
          validators.regex(/^[A-Z]/),
          validators.oneOf(['Alpha', 'Beta', 'Gamma'])
        ),
        required: true
      }

      expect(() => validateValue('VERSION', 'Alpha', rule)).not.toThrow()
      expect(() => validateValue('VERSION', 'alpha', rule)).toThrow() // fails regex
      expect(() => validateValue('VERSION', 'Delta', rule)).toThrow() // fails oneOf
    })
  })
})
