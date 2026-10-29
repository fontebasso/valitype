import { describe, it, expect } from 'vitest'
import { validateValue, validators, ValidationError } from '../src/index.js'
import type { Matcher, Rule } from '../src/index.js'

function failure(key: string, raw: string | undefined, rule: Rule) {
  try {
    validateValue(key, raw, rule)
  } catch (err) {
    if (err instanceof ValidationError)
      return { code: err.code, message: err.message }
    throw err
  }
  throw new Error('expected a ValidationError')
}

describe('required rejects the empty string', () => {
  it.each<Rule>([
    { type: 'string', required: true },
    { type: 'number', required: true },
    { type: 'boolean', required: true },
    { type: 'url', required: true },
    { type: { enum: ['a', ''] }, required: true },
    { type: 'custom', validator: () => true, required: true },
  ])('%j', (rule) => {
    expect(failure('KEY', '', rule).code).toBe('REQUIRED')
  })

  it('also when the empty string comes from the default', () => {
    expect(
      failure('KEY', undefined, { type: 'string', required: true, default: '' })
        .code
    ).toBe('REQUIRED')
  })

  it('keeps the empty string when not required', () => {
    expect(validateValue('KEY', '', { type: 'string' })).toBe('')
    expect(failure('KEY', '', { type: 'number' }).code).toBe('INVALID_NUMBER')
    expect(failure('KEY', '', { type: { enum: ['a'] } }).code).toBe(
      'INVALID_ENUM'
    )
  })
})

describe('url accepts any scheme', () => {
  it.each([
    'postgres://user:pass@db:5432/app',
    'redis://:pw@localhost:6379/0',
    'ftp://example.com',
    'https://例え.テスト/',
  ])('accepts %s', (value) => {
    expect(validateValue('URL', value, { type: 'url' })).toBe(value)
  })

  it.each(['localhost:8080', 'mailto:ops@example.com', 'https://a b'])(
    'rejects %s with INVALID_URL',
    (value) => {
      expect(failure('URL', value, { type: 'url' })).toEqual({
        code: 'INVALID_URL',
        message: 'URL must be a valid URL',
      })
    }
  )
})

describe('string constraints', () => {
  it('minLength and maxLength count code points and are inclusive', () => {
    expect(validateValue('K', '😀😀😀', { type: 'string', minLength: 3 })).toBe(
      '😀😀😀'
    )
    expect(validateValue('K', '😀😀', { type: 'string', maxLength: 2 })).toBe(
      '😀😀'
    )
    expect(
      validateValue('K', 'abc', { type: 'string', minLength: 3, maxLength: 3 })
    ).toBe('abc')
  })

  it('fails minLength with TOO_SHORT', () => {
    expect(failure('K', 'ab', { type: 'string', minLength: 3 })).toEqual({
      code: 'TOO_SHORT',
      message: 'K must be at least 3 characters long',
    })
  })

  it('fails maxLength with TOO_LONG', () => {
    expect(failure('K', 'abc', { type: 'string', maxLength: 2 })).toEqual({
      code: 'TOO_LONG',
      message: 'K must be at most 2 characters long',
    })
  })

  it('pattern searches without implicit anchors', () => {
    expect(validateValue('K', 'xax', { type: 'string', pattern: /a/ })).toBe(
      'xax'
    )
    expect(failure('K', 'xax', { type: 'string', pattern: /^a$/ })).toEqual({
      code: 'PATTERN_MISMATCH',
      message: 'K must match the pattern /^a$/',
    })
  })

  it('pattern accepts a Matcher', () => {
    const matcher: Matcher = { test: (value) => value.startsWith('sk_') }
    expect(
      validateValue('K', 'sk_1', { type: 'string', pattern: matcher })
    ).toBe('sk_1')
    expect(failure('K', 'pk_1', { type: 'string', pattern: matcher })).toEqual({
      code: 'PATTERN_MISMATCH',
      message: 'K must match the pattern',
    })
  })

  it('format json fails with INVALID_FORMAT', () => {
    expect(
      validateValue('K', '{"a":1}', { type: 'string', format: 'json' })
    ).toBe('{"a":1}')
    expect(failure('K', '{a', { type: 'string', format: 'json' })).toEqual({
      code: 'INVALID_FORMAT',
      message: 'K must be valid JSON',
    })
  })

  it('format date checks the calendar', () => {
    expect(
      validateValue('K', '2024-02-29', { type: 'string', format: 'date' })
    ).toBe('2024-02-29')
    for (const value of ['2023-02-29', '2023-13-01', '2023-2-1'])
      expect(failure('K', value, { type: 'string', format: 'date' })).toEqual({
        code: 'INVALID_FORMAT',
        message: 'K must be a valid date in YYYY-MM-DD format',
      })
  })

  it('checks pattern, minLength, maxLength and format in that order', () => {
    const rule: Rule = {
      type: 'string',
      pattern: /^\d+$/,
      minLength: 5,
      maxLength: 1,
      format: 'date',
    }
    expect(failure('K', 'ab', rule).code).toBe('PATTERN_MISMATCH')
    expect(failure('K', '12', rule).code).toBe('TOO_SHORT')
    expect(failure('K', '123456', rule).code).toBe('TOO_LONG')
  })
})

describe('number constraints', () => {
  it('min and max are inclusive', () => {
    expect(validateValue('N', '1', { type: 'number', min: 1, max: 1 })).toBe(1)
  })

  it('fails min with BELOW_MIN', () => {
    expect(failure('N', '0', { type: 'number', min: 1 })).toEqual({
      code: 'BELOW_MIN',
      message: 'N must be greater than or equal to 1',
    })
  })

  it('fails max with ABOVE_MAX', () => {
    expect(failure('N', '-0.5', { type: 'number', max: -1 })).toEqual({
      code: 'ABOVE_MAX',
      message: 'N must be less than or equal to -1',
    })
  })

  it('checks the type before the bounds', () => {
    expect(failure('N', '0x10', { type: 'number', min: 1 }).code).toBe(
      'INVALID_NUMBER'
    )
  })
})

describe('message overrides every failure of the rule', () => {
  it.each<[Rule, string | undefined, string]>([
    [
      { type: 'string', required: true, message: 'custom' },
      undefined,
      'REQUIRED',
    ],
    [{ type: 'string', required: true, message: 'custom' }, '', 'REQUIRED'],
    [{ type: 'string', minLength: 2, message: 'custom' }, 'a', 'TOO_SHORT'],
    [{ type: 'number', message: 'custom' }, 'x', 'INVALID_NUMBER'],
    [{ type: 'number', max: 1, message: 'custom' }, '2', 'ABOVE_MAX'],
    [{ type: 'boolean', message: 'custom' }, 'yes', 'INVALID_BOOLEAN'],
    [{ type: 'url', message: 'custom' }, 'x', 'INVALID_URL'],
    [{ type: { enum: ['a'] }, message: 'custom' }, 'b', 'INVALID_ENUM'],
    [
      { type: 'custom', validator: () => 'from validator', message: 'custom' },
      'x',
      'INVALID_CUSTOM',
    ],
  ])('%j with %j keeps code %s', (rule, raw, code) => {
    expect(failure('K', raw, rule)).toEqual({ code, message: 'custom' })
  })

  it('custom uses message when the validator returns false', () => {
    expect(
      failure('K', 'x', {
        type: 'custom',
        validator: () => false,
        message: 'm',
      }).message
    ).toBe('m')
  })
})

describe('validators', () => {
  it('regex accepts a Matcher', () => {
    const fn = validators.regex({ test: (value) => value === 'ok' }, 'bad')
    expect(fn('ok')).toBe(true)
    expect(fn('no')).toBe('bad')
  })

  it('url validates any scheme', () => {
    const fn = validators.url('bad url')
    expect(fn('redis://:pw@localhost:6379/0')).toBe(true)
    expect(fn('localhost:8080')).toBe('bad url')
    expect(fn(undefined)).toBe(true)
    expect(validators.url()('x')).toBe('Value must be a valid URL')
  })

  it('url composes with regex to restrict the scheme', () => {
    const fn = validators.all(
      validators.url(),
      validators.regex(/^https?:\/\//i, 'http(s) only')
    )
    expect(fn('https://example.com')).toBe(true)
    expect(fn('ftp://example.com')).toBe('http(s) only')
  })

  it.each([
    ['YYYY-MM-DD', '2024-02-29'],
    ['DD/MM/YYYY', '29/02/2024'],
    ['YYYYMMDD', '00230101'],
  ])('date(%s) accepts %s', (format, value) => {
    expect(validators.date(format)(value)).toBe(true)
  })

  it.each([
    ['YYYY-MM-DD', '2023-02-29'],
    ['YYYY-MM-DD', '2023-02-30'],
    ['YYYY-MM-DD', '2023-13-01'],
    ['YYYY-MM-DD', '2023-00-10'],
    ['DD/MM/YYYY', '31/04/2024'],
  ])('date(%s) rejects the impossible date %s', (format, value) => {
    expect(validators.date(format)(value)).toBe(
      `Value must be a valid date in format ${format}`
    )
  })

  it('date escapes regex metacharacters in the format', () => {
    const fn = validators.date('YYYY.MM.DD')
    expect(fn('2024.02.29')).toBe(true)
    expect(fn('2024x02x29')).toBe(
      'Value must be a valid date in format YYYY.MM.DD'
    )
  })

  it('date treats a single Y, M or D as one digit', () => {
    const fn = validators.date('YYYY-M-D')
    expect(fn('2024-2-9')).toBe(true)
    expect(fn('2024-02-09')).toBe(
      'Value must be a valid date in format YYYY-M-D'
    )
  })

  it('date falls back to Date parsing when the format lacks YYYY, MM or DD', () => {
    const fn = validators.date('YYYY-MM')
    expect(fn('2024-02')).toBe(true)
    expect(fn('2024-13')).toBe('Value must be a valid date in format YYYY-MM')
  })
})
