import { describe, it, expect } from 'vitest'
import { validateValue, ValidationError } from '../src/index.js'
import { Rule } from '../src/core/rules.js'

describe('ValidationError', () => {
  it('is thrown as a ValidationError instance', () => {
    const rule: Rule = { type: 'string', required: true }
    try {
      validateValue('API_KEY', undefined, rule)
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError)
    }
  })

  it('exposes key, value, and code on REQUIRED error', () => {
    const rule: Rule = { type: 'string', required: true }
    try {
      validateValue('API_KEY', undefined, rule)
    } catch (err) {
      const e = err as ValidationError
      expect(e.key).toBe('API_KEY')
      expect(e.value).toBeUndefined()
      expect(e.code).toBe('REQUIRED')
      expect(e.message).toBe('API_KEY is required')
    }
  })

  it('exposes INVALID_NUMBER code and original value', () => {
    const rule: Rule = { type: 'number' }
    try {
      validateValue('PORT', '0x10', rule)
    } catch (err) {
      const e = err as ValidationError
      expect(e.code).toBe('INVALID_NUMBER')
      expect(e.key).toBe('PORT')
      expect(e.value).toBe('0x10')
    }
  })

  it('exposes INVALID_BOOLEAN code', () => {
    const rule: Rule = { type: 'boolean' }
    try {
      validateValue('DEBUG', 'yes', rule)
    } catch (err) {
      const e = err as ValidationError
      expect(e.code).toBe('INVALID_BOOLEAN')
      expect(e.key).toBe('DEBUG')
      expect(e.value).toBe('yes')
    }
  })

  it('exposes INVALID_URL code', () => {
    const rule: Rule = { type: 'url' }
    try {
      validateValue('ENDPOINT', 'file:///etc/passwd', rule)
    } catch (err) {
      const e = err as ValidationError
      expect(e.code).toBe('INVALID_URL')
      expect(e.key).toBe('ENDPOINT')
      expect(e.value).toBe('file:///etc/passwd')
    }
  })

  it('exposes INVALID_ENUM code', () => {
    const rule: Rule = { type: { enum: ['dev', 'prod'] } }
    try {
      validateValue('NODE_ENV', 'staging', rule)
    } catch (err) {
      const e = err as ValidationError
      expect(e.code).toBe('INVALID_ENUM')
      expect(e.key).toBe('NODE_ENV')
      expect(e.value).toBe('staging')
    }
  })

  it('exposes INVALID_CUSTOM code', () => {
    const rule: Rule = {
      type: 'custom',
      validator: () => 'Must be valid',
      required: true,
    }
    try {
      validateValue('TOKEN', 'bad', rule)
    } catch (err) {
      const e = err as ValidationError
      expect(e.code).toBe('INVALID_CUSTOM')
      expect(e.key).toBe('TOKEN')
      expect(e.value).toBe('bad')
    }
  })

  it('exposes UNKNOWN_RULE code for unrecognized rule types', () => {
    const rule = { type: 'unknown' } as unknown as Rule
    try {
      validateValue('FOO', 'bar', rule)
    } catch (err) {
      const e = err as ValidationError
      expect(e.code).toBe('UNKNOWN_RULE')
      expect(e.key).toBe('FOO')
    }
  })

  it('name is ValidationError', () => {
    const rule: Rule = { type: 'number' }
    try {
      validateValue('PORT', 'abc', rule)
    } catch (err) {
      expect((err as Error).name).toBe('ValidationError')
    }
  })
})