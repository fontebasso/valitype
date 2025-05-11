import { describe, it, expect } from 'vitest'
import { validators } from '../src/core/validators/index'

describe('Validator utilities', () => {
  describe('regex validator', () => {
    it('should return true for undefined values', () => {
      const validator = validators.regex(/^test$/)
      expect(validator(undefined)).toBe(true)
    })

    it('should return true for matching values', () => {
      const validator = validators.regex(/^test$/)
      expect(validator('test')).toBe(true)
    })

    it('should return error message for non-matching values', () => {
      const validator = validators.regex(/^test$/)
      expect(validator('not-test')).toBe('Value does not match pattern /^test$/')
    })

    it('should return custom error message when provided', () => {
      const validator = validators.regex(/^test$/, 'Custom error')
      expect(validator('not-test')).toBe('Custom error')
    })
  })

  describe('range validator', () => {
    it('should return true for undefined values', () => {
      const validator = validators.range(1, 10)
      expect(validator(undefined)).toBe(true)
    })

    it('should return true for values within range', () => {
      const validator = validators.range(1, 10)
      expect(validator('5')).toBe(true)
    })

    it('should return error message for values below range', () => {
      const validator = validators.range(1, 10)
      expect(validator('0')).toBe('Value must be between 1 and 10')
    })

    it('should return error message for values above range', () => {
      const validator = validators.range(1, 10)
      expect(validator('11')).toBe('Value must be between 1 and 10')
    })

    it('should return error message for non-numeric values', () => {
      const validator = validators.range(1, 10)
      expect(validator('abc')).toBe('Value must be between 1 and 10')
    })

    it('should return custom error message when provided', () => {
      const validator = validators.range(1, 10, 'Custom error')
      expect(validator('11')).toBe('Custom error')
    })
  })

  describe('oneOf validator', () => {
    it('should return true for undefined values', () => {
      const validator = validators.oneOf(['a', 'b', 'c'])
      expect(validator(undefined)).toBe(true)
    })

    it('should return true for values in the allowed list', () => {
      const validator = validators.oneOf(['a', 'b', 'c'])
      expect(validator('b')).toBe(true)
    })

    it('should return error message for values not in the allowed list', () => {
      const validator = validators.oneOf(['a', 'b', 'c'])
      expect(validator('d')).toBe('Value must be one of: a, b, c')
    })

    it('should return custom error message when provided', () => {
      const validator = validators.oneOf(['a', 'b', 'c'], 'Custom error')
      expect(validator('d')).toBe('Custom error')
    })
  })

  describe('date validator', () => {
    it('should return true for undefined values', () => {
      const validator = validators.date()
      expect(validator(undefined)).toBe(true)
    })

    it('should return true for valid date strings', () => {
      const validator = validators.date()
      expect(validator('2023-05-10')).toBe(true)
    })

    it('should return error message for invalid date strings', () => {
      const validator = validators.date()
      expect(validator('not-a-date')).toBe('Value must be a valid date')
    })

    it('should include format in error message when provided', () => {
      const validator = validators.date('YYYY-MM-DD')
      expect(validator('not-a-date')).toBe('Value must be a valid date in format YYYY-MM-DD')
    })

    it('should return custom error message when provided', () => {
      const validator = validators.date('YYYY-MM-DD', 'Custom error')
      expect(validator('not-a-date')).toBe('Custom error')
    })
  })

  describe('json validator', () => {
    it('should return true for undefined values', () => {
      const validator = validators.json()
      expect(validator(undefined)).toBe(true)
    })

    it('should return true for valid JSON strings', () => {
      const validator = validators.json()
      expect(validator('{"name":"test"}')).toBe(true)
    })

    it('should return error message for invalid JSON strings', () => {
      const validator = validators.json()
      expect(validator('{invalid}')).toBe('Value must be valid JSON')
    })

    it('should return custom error message when provided', () => {
      const validator = validators.json('Custom error')
      expect(validator('{invalid}')).toBe('Custom error')
    })
  })

  describe('awsArn validator', () => {
    it('should return true for undefined values', () => {
      const validator = validators.awsArn()
      expect(validator(undefined)).toBe(true)
    })

    it('should return true for valid ARN strings', () => {
      const validator = validators.awsArn()
      expect(validator('arn:aws:lambda:us-east-1:123456789012:function:my-function')).toBe(true)
    })

    it('should return error message for invalid ARN strings', () => {
      const validator = validators.awsArn()
      expect(validator('invalid-arn')).toBe('Value must be a valid AWS ARN')
    })

    it('should return true for valid ARN with matching service', () => {
      const validator = validators.awsArn('lambda')
      expect(validator('arn:aws:lambda:us-east-1:123456789012:function:my-function')).toBe(true)
    })

    it('should return error message for ARN with non-matching service', () => {
      const validator = validators.awsArn('lambda')
      expect(validator('arn:aws:s3:us-east-1:123456789012:bucket:my-bucket')).toBe('ARN must be for service: lambda')
    })

    it('should return custom error message when provided', () => {
      const validator = validators.awsArn('lambda', 'Custom error')
      expect(validator('invalid-arn')).toBe('Custom error')
    })
  })

  describe('all validator', () => {
    it('should return true when all validators pass', () => {
      const validator = validators.all(
        validators.regex(/^[A-Z]/),
        validators.oneOf(['Alpha', 'Beta', 'Gamma'])
      )
      expect(validator('Alpha')).toBe(true)
    })

    it('should return first error message when a validator fails', () => {
      const validator = validators.all(
        validators.regex(/^[A-Z]/, 'Must start with uppercase'),
        validators.oneOf(['Alpha', 'Beta', 'Gamma'], 'Must be a valid option')
      )
      expect(validator('alpha')).toBe('Must start with uppercase')
    })

    it('should check validators in order', () => {
      const validator = validators.all(
        validators.regex(/^[A-Z]/, 'Must start with uppercase'),
        validators.oneOf(['Alpha', 'Beta', 'Gamma'], 'Must be a valid option')
      )
      expect(validator('Delta')).toBe('Must be a valid option')
    })

    it('should return true for undefined values if all validators accept undefined', () => {
      const validator = validators.all(
        validators.regex(/^[A-Z]/),
        validators.oneOf(['Alpha', 'Beta', 'Gamma'])
      )
      expect(validator(undefined)).toBe(true)
    })
  })
})
