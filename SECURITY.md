# Security Policy

## Usage Guidelines

`valitype` is a runtime feature flag evaluation library. While designed to be safe by default, its security depends on how it is used in applications.

- Always load flags from trusted, HTTPS sources.
- Do not expose flags that control sensitive logic to untrusted clients.
- Avoid putting any secrets or credentials in flag definitions or traits.
- Ensure `userId` and other traits are validated and sanitized before use.
- Do not rely on `rollout` for access control or entitlements.

## Reporting Vulnerabilities

If you discover a security issue, please do **not** open a GitHub issue. Instead, contact:

**[samuel.txd@gmail.com](mailto:samuel.txd@gmail.com)**

We will respond promptly and handle disclosures responsibly.
