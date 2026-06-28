[![tests](https://github.com/fontebasso/valitype/actions/workflows/tests.yml/badge.svg)](https://github.com/fontebasso/valitype/actions/workflows/tests.yml)
[![npm](https://img.shields.io/npm/v/valitype)](https://www.npmjs.com/package/valitype)
[![npm downloads](https://img.shields.io/npm/dw/valitype)](https://www.npmjs.com/package/valitype)
[![bundle size](https://img.shields.io/bundlephobia/minzip/valitype)](https://bundlephobia.com/package/valitype)
[![license](https://img.shields.io/npm/l/valitype)](LICENSE)

Type-safe environment variable validation for TypeScript — zero dependencies, structured errors, and built-in validators for the most common real-world cases.

## Installation

```bash
npm install valitype
```

## Quick start

```typescript
import { validateValue, validators, ValidationError } from 'valitype'

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
- **Strict by design**: numbers reject hex and scientific notation; URLs require `http`/`https`; date formats are actually enforced

## Why not Zod, Joi, or Yup?

Use [Zod](https://zod.dev/), [Joi](https://joi.dev/), or [Yup](https://github.com/jquense/yup) when you need a full schema validation library for complex objects, nested data, forms, API payloads, transformations, or advanced validation flows.

Use `valitype` when you need a small, focused validator for environment variables and runtime config:

* Zero runtime dependencies
* Simple primitive validation
* Strict parsing for numbers, booleans, URLs, dates, enums, and custom rules
* Structured errors for configuration failures
* Designed for `process.env`, package options, feature flags, and app config

`valitype` is not a replacement for Zod, Joi, or Yup. It is a focused alternative when a full schema validation framework would be more than you need.

## Node.js support

`valitype` supports the following Node.js versions:

| Node.js | Status    |
| ------- | --------- |
| 20      | Supported |
| 22      | Supported |
| 24      | Supported |

The test suite runs against all supported Node.js versions to ensure compatibility across the supported runtime matrix.

## Types

| Rule | Returns | Notes |
|---|---|---|
| `{ type: 'string' }` | `string` | |
| `{ type: 'number' }` | `number` | Decimal only — rejects hex, scientific notation |
| `{ type: 'boolean' }` | `boolean` | Accepts `'true'` or `'false'` only |
| `{ type: 'url' }` | `string` | Requires `http` or `https` scheme |
| `{ type: { enum: string[] } }` | `string` | Must be one of the listed values |
| `{ type: 'custom', validator }` | `string` | Bring your own logic |

All types accept `required?: boolean` and `default?: T`.

## Built-in validators

Use these with `{ type: 'custom', validator: ... }`.

```typescript
validators.regex(/^[A-Z]{3}$/, 'Must be 3 uppercase letters')

validators.range(1, 65535, 'Must be a valid port')

validators.oneOf(['us-east-1', 'eu-west-1'], 'Unsupported region')

validators.date('YYYY-MM-DD')

validators.json()

validators.awsArn('lambda')

validators.all(
  validators.regex(/^[A-Z]/),
  validators.oneOf(['Alpha', 'Beta', 'Gamma'])
)
```

`validators.date('YYYY-MM-DD')` enforces the format, not just parseability. `validators.awsArn()` supports all AWS partitions: `aws`, `aws-cn`, and `aws-us-gov`.

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

Available codes: `REQUIRED` · `INVALID_NUMBER` · `INVALID_BOOLEAN` · `INVALID_URL` · `INVALID_ENUM` · `INVALID_CUSTOM` · `UNKNOWN_RULE`

## Security and supply chain

`valitype` is built with a minimal and transparent supply chain:

* Zero runtime dependencies
* Automated tests on GitHub Actions
* Published with npm Trusted Publishing and provenance
* CodeQL code scanning enabled via GitHub default setup
* MIT licensed

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This library is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
