import { describe, it, expect } from 'vitest'
import { validateValue, Rule } from '../src/index.js'

describe('index exports', () => {
  it('exports validateValue', () => {
    expect(typeof validateValue).toBe('function')
  })

  it('exports Rule type (dummy type check)', () => {
    const rule: Rule = { type: 'string', required: true }
    expect(rule.type).toBe('string')
  })
})
