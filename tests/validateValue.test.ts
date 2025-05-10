import { describe, it, expect } from 'vitest'
import { validateValue } from '../src/core/validateValue.js'
import { Rule } from '../src/core/rules.js'

describe('validateValue', () => {
  it('validates string', () => {
    const rule: Rule = { type: 'string', required: true }
    expect(validateValue('FOO', 'abc', rule)).toBe('abc')
  })

  it('uses default for string', () => {
    const rule: Rule = { type: 'string', default: 'fallback' }
    expect(validateValue('FOO', undefined, rule)).toBe('fallback')
  })

  it('throws if required string is missing', () => {
    const rule: Rule = { type: 'string', required: true }
    expect(() => validateValue('FOO', undefined, rule)).toThrow(
      'FOO is required'
    )
  })

  it('validates number', () => {
    const rule: Rule = { type: 'number' }
    expect(validateValue('PORT', '8080', rule)).toBe(8080)
  })

  it('throws on invalid number', () => {
    const rule: Rule = { type: 'number' }
    expect(() => validateValue('PORT', 'abc', rule)).toThrow(
      'PORT must be a valid number'
    )
  })

  it('validates boolean true/false', () => {
    const rule: Rule = { type: 'boolean' }
    expect(validateValue('DEBUG', 'true', rule)).toBe(true)
    expect(validateValue('DEBUG', 'false', rule)).toBe(false)
  })

  it('throws on invalid boolean', () => {
    const rule: Rule = { type: 'boolean' }
    expect(() => validateValue('DEBUG', 'yes', rule)).toThrow(
      'DEBUG must be either "true" or "false"'
    )
  })

  it('validates url', () => {
    const rule: Rule = { type: 'url' }
    expect(validateValue('API', 'https://example.com', rule)).toBe(
      'https://example.com'
    )
  })

  it('throws on invalid url', () => {
    const rule: Rule = { type: 'url' }
    expect(() => validateValue('API', 'notaurl', rule)).toThrow(
      'API must be a valid URL'
    )
  })

  it('validates enum', () => {
    const rule: Rule = { type: { enum: ['dev', 'prod'] } }
    expect(validateValue('NODE_ENV', 'prod', rule)).toBe('prod')
  })

  it('throws on invalid enum', () => {
    const rule: Rule = { type: { enum: ['dev', 'prod'] } }
    expect(() => validateValue('NODE_ENV', 'staging', rule)).toThrow(
      'NODE_ENV must be one of: dev, prod'
    )
  })

  it('throws if enum value is undefined and required', () => {
    const rule: Rule = {
      type: { enum: ['dev', 'prod'] },
      required: true,
    }
    expect(() => validateValue('NODE_ENV', undefined, rule)).toThrow(
      'NODE_ENV is required and must be one of: dev, prod'
    )
  })

  it('throws on unknown rule type', () => {
    const rule = { type: 'unknown' } as unknown as Rule
    expect(() => validateValue('FOO', 'bar', rule)).toThrow(
      'FOO has an unknown rule type'
    )
  })
})
