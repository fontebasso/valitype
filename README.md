# valitype

[![tests](https://github.com/fontebasso/valitype/actions/workflows/tests.yml/badge.svg)](https://github.com/fontebasso/valitype/actions/workflows/tests.yml)
[![CodeQL](https://github.com/fontebasso/valitype/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/fontebasso/valitype/actions/workflows/github-code-scanning/codeql)
[![Coverage Status](https://coveralls.io/repos/github/fontebasso/valitype/badge.svg?branch=main)](https://coveralls.io/github/fontebasso/valitype?branch=main)
[![npm](https://img.shields.io/npm/v/valitype)](https://www.npmjs.com/package/valitype)
[![npm downloads](https://img.shields.io/npm/dw/valitype)](https://www.npmjs.com/package/valitype)
[![bundle size](https://img.shields.io/bundlephobia/minzip/valitype)](https://bundlephobia.com/package/valitype)
[![size](https://img.shields.io/npm/unpacked-size/valitype)](https://www.npmjs.com/package/valitype)
[![stars](https://img.shields.io/github/stars/fontebasso/valitype?style=flat)](https://github.com/fontebasso/valitype/stargazers)
[![license](https://img.shields.io/npm/l/valitype)](LICENSE)

Type-safe environment variable and runtime config validation for TypeScript and JavaScript — zero dependencies, structured errors, and built-in validators for common `process.env` and app config use cases.

## Installation

```bash
npm install valitype
```

## Quick start

```typescript
import { validateValue, validators } from 'valitype'

const config = {
  port: validateValue('PORT', process.env.PORT, { type: 'number', required: true }),
  debug: validateValue('DEBUG', process.env.DEBUG, { type: 'boolean', default: false }),
  apiUrl: validateValue('API_URL', process.env.API_URL, { type: 'url', required: true }),
  env: validateValue('NODE_ENV', process.env.NODE_ENV, {
    type: { enum: ['development', 'production', 'test'] },
    default: 'development',
  }),
  apiKey: validateValue('API_KEY', process.env.API_KEY, {
    type: 'custom',
    validator: validators.regex(/^[a-z0-9]{32}$/),
    required: true,
  }),
}
```

If any value fails, a `ValidationError` is thrown with the field name, the received value, and a machine-readable code. Before your app ever starts.

## Why valitype

- **Zero dependencies**: nothing to audit, nothing to break
- **Type-safe by default**: `validateValue` returns the correct TypeScript type based on the rule
- **Structured errors**: `ValidationError` carries `key`, `value`, and `code` so you can handle failures programmatically
- **Strict by design**: numbers reject hex and scientific notation; URLs follow RFC 3986/3987; dates must exist in the calendar; `required` rejects empty strings

## Why not Zod, Joi, or Yup?

[Zod](https://zod.dev/), [Joi](https://joi.dev/), and [Yup](https://github.com/jquense/yup) are great full schema validation libraries. Use them when you need complex object validation, nested schemas, arrays, forms, API payload validation, transformations, parsing pipelines, or advanced validation flows.

Use `valitype` when you need focused TypeScript and JavaScript validation for environment variables, `process.env`, package options, feature flags, and runtime config:

- Zero runtime dependencies
- Simple primitive validation
- Strict parsing for numbers, booleans, URLs, dates, enums, and custom rules
- Structured errors for configuration failures
- Small API designed for app startup and config validation

`valitype` is not a replacement for Zod, Joi, or Yup. It is a small alternative when a full schema validation framework would be more than you need.

## Node.js support

`valitype` supports the following Node.js versions:

| Node.js | Status    |
| ------- | --------- |
| 22      | Supported |
| 24      | Supported |
| 26      | Supported |

The test suite runs against all supported Node.js versions to ensure compatibility across the supported runtime matrix.

## Types

| Rule | Returns | Notes |
|---|---|---|
| `{ type: 'string' }` | `string` | |
| `{ type: 'number' }` | `number` | Decimal only — rejects hex, scientific notation |
| `{ type: 'boolean' }` | `boolean` | Accepts `'true'` or `'false'` only |
| `{ type: 'url' }` | `string` | RFC 3986 URI with `scheme://`, any scheme, international characters allowed |
| `{ type: { enum: string[] } }` | `string` | Must be one of the listed values |
| `{ type: 'custom', validator }` | `string` | Bring your own logic |

All types accept `required?: boolean`, `default?: T` and `message?: string`.

- `required: true` rejects both a missing value and an empty string.
- `message` replaces the message of every failure of the rule; the `code` is kept.

### String options

```typescript
validateValue('API_KEY', process.env.API_KEY, {
  type: 'string',
  required: true,
  pattern: /^sk_/,
  minLength: 32,
  maxLength: 64,
})

validateValue('FEATURES', process.env.FEATURES, { type: 'string', format: 'json' })
validateValue('LAUNCH_DATE', process.env.LAUNCH_DATE, { type: 'string', format: 'date' })
```

| Option | Code | Notes |
|---|---|---|
| `pattern` | `PATTERN_MISMATCH` | `RegExp` or any `{ test(value): boolean }`, not anchored |
| `minLength` | `TOO_SHORT` | Inclusive, counts code points |
| `maxLength` | `TOO_LONG` | Inclusive, counts code points |
| `format: 'json'` | `INVALID_FORMAT` | |
| `format: 'date'` | `INVALID_FORMAT` | `YYYY-MM-DD`, must exist in the calendar |

Checks run in this order and stop at the first failure.

`pattern` accepts a `Matcher` so you can plug in a linear-time engine such as RE2 for values you do not control:

```typescript
import { RE2JS } from 're2js'

const re = RE2JS.compile('^[a-z0-9]+$')
validateValue('SLUG', process.env.SLUG, {
  type: 'string',
  pattern: { test: (value) => re.matcher(value).find() },
})
```

### Number options

| Option | Code | Notes |
|---|---|---|
| `min` | `BELOW_MIN` | Inclusive |
| `max` | `ABOVE_MAX` | Inclusive |

## Built-in validators

Use these with `{ type: 'custom', validator: ... }`.

```typescript
validators.regex(/^[A-Z]{3}$/, 'Must be 3 uppercase letters')

validators.range(1, 65535, 'Must be a valid port')

validators.oneOf(['us-east-1', 'eu-west-1'], 'Unsupported region')

validators.date('YYYY-MM-DD')

validators.json()

validators.url()

validators.awsArn('lambda')

validators.all(
  validators.regex(/^[A-Z]/),
  validators.oneOf(['Alpha', 'Beta', 'Gamma'])
)

validators.all(
  validators.url(),
  validators.regex(/^https?:\/\//i, 'Must be http or https')
)
```

`validators.date('YYYY-MM-DD')` enforces the format and, when the format has `YYYY`, `MM` and `DD`, that the date exists (`2023-02-30` fails). `validators.awsArn()` supports all AWS partitions: `aws`, `aws-cn`, and `aws-us-gov`.

## Error handling

Every failure throws a `ValidationError`:

```typescript
import { ValidationError } from 'valitype'

try {
  validateValue('PORT', '0xff', { type: 'number', required: true })
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(err.code)    // 'INVALID_NUMBER'
    console.log(err.key)     // 'PORT'
    console.log(err.value)   // '0xff'
    console.log(err.message) // 'PORT must be a valid number'
  }
}
```

Available codes: `REQUIRED` · `INVALID_NUMBER` · `INVALID_BOOLEAN` · `INVALID_URL` · `INVALID_ENUM` · `INVALID_CUSTOM` · `TOO_SHORT` · `TOO_LONG` · `PATTERN_MISMATCH` · `INVALID_FORMAT` · `BELOW_MIN` · `ABOVE_MAX` · `UNKNOWN_RULE`

## Migrating from 3.x

- `required: true` now rejects an empty string with `REQUIRED`. Drop `required` if an empty value is valid.
- `url` accepts any scheme (`postgres://`, `redis://`, `file://`...) and follows RFC 3986/3987 instead of the WHATWG parser. To keep http/https only, use `{ type: 'custom', validator: validators.all(validators.url(), validators.regex(/^https?:\/\//i)) }`.
- `validators.date(format)` rejects dates that do not exist, such as `2023-02-30`.
- `errorMessage` on custom rules is now `message`.

## Security and supply chain

`valitype` is built with a minimal and transparent supply chain:

- Zero runtime dependencies
- Automated tests on GitHub Actions
- Published with npm Trusted Publishing and provenance
- CodeQL code scanning enabled via GitHub default setup
- MIT licensed

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This library is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
