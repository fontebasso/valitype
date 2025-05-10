# Security Policy

## Usage Guidelines

`valitype` is a lightweight runtime validator for primitive values such as strings, numbers, booleans, URLs, and enums. While its implementation is minimal and dependency-free, security ultimately depends on how it's used in consuming applications.

- Do not use `valitype` to validate untrusted input without additional context-aware validation (e.g. email format, SQL injection).
- `valitype` is designed for configuration validation (e.g. environment variables), not for form or API input sanitization.
- Never embed secrets or credentials in validation rules or fallback values.
- Ensure that any values being passed into `valitype` are appropriately scoped and sourced from trusted contexts.
- Use more comprehensive validation frameworks (e.g. Zod, Joi) when handling complex or deeply nested objects.

## Reporting Vulnerabilities

If you discover a security issue, please do **not** open a GitHub issue. Instead, contact:

**[samuel.txd@gmail.com](mailto:samuel.txd@gmail.com)**

We will respond promptly and handle disclosures responsibly.
