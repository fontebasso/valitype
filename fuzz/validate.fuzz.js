import fc from 'fast-check'
import { validateValue, ValidationError } from '../dist/index.js'

const CODES = new Set([
  'REQUIRED',
  'INVALID_NUMBER',
  'INVALID_BOOLEAN',
  'INVALID_URL',
  'INVALID_ENUM',
  'INVALID_CUSTOM',
  'TOO_SHORT',
  'TOO_LONG',
  'PATTERN_MISMATCH',
  'INVALID_FORMAT',
  'BELOW_MIN',
  'ABOVE_MAX',
])

const RULES = [
  { type: 'string', required: true },
  {
    type: 'string',
    pattern: /^[A-Za-z0-9]+$/,
    minLength: 8,
    maxLength: 32,
  },
  { type: 'string', format: 'json' },
  { type: 'string', format: 'date' },
  { type: 'number', min: 1, max: 65535 },
  { type: 'boolean', required: true },
  { type: 'url', required: true },
  { type: { enum: ['development', 'production', 'test'] }, required: true },
  { type: 'string', required: true, message: 'custom message' },
]

const value = fc.oneof(
  fc.constant(undefined),
  fc.string({ maxLength: 300 }),
  fc.string({ unit: 'grapheme', maxLength: 100 }),
  fc
    .uint8Array({ maxLength: 300 })
    .map((bytes) => Buffer.from(bytes).toString('latin1'))
)

fc.assert(
  fc.property(fc.constantFrom(...RULES), value, (rule, raw) => {
    try {
      validateValue('KEY', raw, rule)
    } catch (err) {
      if (!(err instanceof ValidationError)) throw err
      if (!CODES.has(err.code)) throw new Error(`Unexpected code ${err.code}`)
      if (err.key !== 'KEY') throw new Error(`Unexpected key ${err.key}`)
      if (typeof err.message !== 'string' || err.message === '')
        throw new Error('Empty message')
      if (rule.message !== undefined && err.message !== rule.message)
        throw new Error('message was not applied')
    }
  }),
  { numRuns: 10000 }
)
