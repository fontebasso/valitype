# valitype

[![tests](https://github.com/fontebasso/valitype/actions/workflows/tests.yml/badge.svg)](https://github.com/fontebasso/valitype/actions/workflows/tests.yml)
[![npm](https://img.shields.io/npm/v/valitype)](https://www.npmjs.com/package/valitype)
[![npm audit signatures](https://img.shields.io/badge/npm%20audit-signed%20%26%20attested-brightgreen?logo=npm)](https://docs.npmjs.com/generating-provenance-statements)
[![license](https://img.shields.io/npm/l/valitype)](LICENSE)

A lightweight TypeScript validation library for environment variables and configuration.

## Features

- Validate values against predefined types (string, number, boolean, url, enum)
- Support for custom validators with helpful utilities
- Required field validation
- Default values
- Clear error messages

## Installation

```bash
npm install valitype
```

## Usage

```typescript
import { validateValue, validators } from 'valitype';

// Basic type validation
validateValue('PORT', '8080', { type: 'number', required: true }); // returns 8080 as number
validateValue('DEBUG', 'true', { type: 'boolean' }); // returns true as boolean
validateValue('API_URL', 'https://api.example.com', { type: 'url', required: true }); // validates URL format

// Enum validation
validateValue('NODE_ENV', 'development', { 
  type: { enum: ['development', 'production', 'test'] },
  default: 'development'
});

// Custom validation
validateValue('API_KEY', 'abc123', {
  type: 'custom',
  validator: validators.regex(/^[a-z0-9]{6}$/),
  errorMessage: 'API_KEY must be 6 alphanumeric characters',
  required: true
});
```

## Validation Types

### String
```typescript
{ type: 'string', required?: boolean, default?: string }
```

### Number
```typescript
{ type: 'number', required?: boolean, default?: number }
```

### Boolean
```typescript
{ type: 'boolean', required?: boolean, default?: boolean }
```

### URL
```typescript
{ type: 'url', required?: boolean, default?: string }
```

### Enum
```typescript
{ type: { enum: string[] }, required?: boolean, default?: string }
```

### Custom
```typescript
{ 
  type: 'custom', 
  validator: (value: string | undefined) => boolean | string,
  required?: boolean, 
  default?: string,
  errorMessage?: string 
}
```

## Custom Validators

The library includes several built-in validator utilities:

### Regex Validator
```typescript
validators.regex(/^[A-Z]{3}$/, 'Must be 3 uppercase letters')
```

### Range Validator
```typescript
validators.range(1, 100, 'Value must be between 1 and 100')
```

### OneOf Validator
```typescript
validators.oneOf(['apple', 'banana', 'orange'], 'Must be a valid fruit')
```

### Date Validator
```typescript
validators.date('YYYY-MM-DD', 'Must be a valid date')
```

### JSON Validator
```typescript
validators.json('Must be valid JSON')
```

### AWS ARN Validator
```typescript
validators.awsArn('lambda', 'Must be a valid Lambda ARN')
```

### Combining Validators
```typescript
validators.all(
  validators.regex(/^[A-Z]/),
  validators.oneOf(['Alpha', 'Beta', 'Gamma'])
)
```

## Error Handling

The library throws descriptive errors when validation fails:

```typescript
try {
  validateValue('PORT', 'abc', { type: 'number', required: true });
} catch (error) {
  console.error(error.message); // "PORT must be a number"
}
```

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This library is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
