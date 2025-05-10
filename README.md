# valitype

[![tests](https://github.com/fontebasso/valitype/actions/workflows/tests.yml/badge.svg)](https://github.com/fontebasso/valitype/actions/workflows/tests.yml)
[![npm](https://img.shields.io/npm/v/valitype)](https://www.npmjs.com/package/valitype)
[![npm audit signatures](https://img.shields.io/badge/npm%20audit-signed%20%26%20attested-brightgreen?logo=npm)](https://docs.npmjs.com/generating-provenance-statements)
[![license](https://img.shields.io/npm/l/valitype)](LICENSE)

**Lightweight validator for simple runtime types like string, number, boolean, URL, and enums.**

valitype is a small and focused library that validates primitive values like strings, numbers, booleans, URLs, and enums. It was designed to be used in tools like build-time env validators but can be used in any JavaScript/TypeScript project where runtime type validation is required.

## Features

- Supports string, number, boolean, url, and enum
- Clear error messages with context
- Optional required and default handling
- Fully typed
- Zero dependencies

## Installation

```bash
npm install valitype
```

## Basic Usage

### Validate a required number

```ts
import { validateValue } from 'valitype'
import type { Rule } from 'valitype'

const rule: Rule = { type: 'number', required: true }

const port = validateValue('PORT', process.env.PORT, rule)
// port: number
```

### Validate with default and enum

```ts
const rule: Rule = {
  type: { enum: ['dev', 'staging', 'prod'] },
  default: 'dev'
}

const env = validateValue('NODE_ENV', process.env.NODE_ENV, rule)
// env: 'dev' | 'staging' | 'prod'
```

### Validate multiple values with a schema

```ts
const schema: Record<string, Rule> = {
  API_URL: { type: 'url', required: true },
  DEBUG: { type: 'boolean', default: false },
  VERSION: { type: 'string', default: '1.0.0' },
}

const config = Object.fromEntries(
  Object.entries(schema).map(([key, rule]) => [
    key,
    validateValue(key, process.env[key], rule)
  ])
)

console.log(config)
/*
{
  API_URL: 'https://api.example.com',
  DEBUG: false,
  VERSION: '1.0.0'
}
*/
```

## Types

Supported `Rule` definitions

```ts
type Rule =
  | { type: 'string'; required?: boolean; default?: string }
  | { type: 'number'; required?: boolean; default?: number }
  | { type: 'boolean'; required?: boolean; default?: boolean }
  | { type: 'url'; required?: boolean; default?: string }
  | { type: { enum: string[] }; required?: boolean; default?: string }
```

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This library is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
