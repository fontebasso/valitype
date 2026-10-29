# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0] - 2026-10-29

### BREAKING

* `required: true` now also rejects an empty string with `REQUIRED`, including when the empty string comes from `default`.
* `type: 'url'` now follows RFC 3986 with RFC 3987 international characters and requires `scheme://`: any scheme is accepted (`postgres://`, `redis://`, `file://`…), while values the WHATWG parser tolerated, such as unencoded spaces, are rejected.
* `validators.date(format)` now rejects dates that do not exist, such as `2023-02-30`, when the format has `YYYY`, `MM` and `DD`.
* `errorMessage` on custom rules was renamed to `message`.

### Added

* String constraints `pattern`, `minLength`, `maxLength` and `format` (`json`, `date`), with the codes `PATTERN_MISMATCH`, `TOO_SHORT`, `TOO_LONG` and `INVALID_FORMAT`.
* Number constraints `min` and `max`, with the codes `BELOW_MIN` and `ABOVE_MAX`.
* `message` on every rule, replacing the message of any failure while keeping the `code`.
* `pattern` and `validators.regex` accept any `Matcher` (`{ test(value): boolean }`), so a linear-time engine such as RE2 can be plugged in.
* `validators.url()`.

### Fixed

* `validators.date(format)` now accepts valid dates in non-ISO formats such as `DD/MM/YYYY`, which were always rejected.

### Security

* Updated the development dependency `brace-expansion` to `5.0.12`, which fixes GHSA-3jxr-9vmj-r5cp and GHSA-q2hr-2g5m-vwhr. It is not shipped in the package, which still has no runtime dependencies.

### Maintenance

* Updated `typescript` to `6.0.3`, `vitest` and `@vitest/coverage-v8` to `5.0.5`, `eslint` to `10.13.0`, `@typescript-eslint/*` to `8.72.1`, `prettier` to `3.9.10`, `typedoc` to `0.28.20` and `esbuild` to `0.28.2`.
* Updated GitHub Actions pins (`actions/checkout` `7.0.1`, `actions/setup-node` `7.1.0`).
* TypeScript 7.0 updates are held until `@typescript-eslint` and `typedoc` support it.
* Test coverage is now 100% and enforced in CI.
* The documentation site keeps its `valitype.js.org` domain when the docs are regenerated.
* The npm package no longer ships `README.typedoc.md`; the typedoc readme is now `typedoc-readme.md`, outside the package.
* Release and coverage workflows now run on Node.js 26.
* The ESM build targets Node.js 22, the minimum supported version, instead of Node.js 18.
* Added a changelog, CODEOWNERS, Renovate, coverage upload to Coveralls, fuzz tests in CI and a release preflight with npm dist-tag channels.

## [3.0.0] - 2026-06-28

### BREAKING

* Node.js 20 is no longer supported; the minimum is Node.js 22.

### Added

* Node.js 26 support. `engines` is now `^22.0.0 || ^24.0.0 || ^26.0.0`.
* Monthly Node.js version audit workflow that opens an issue when the supported matrix drifts from endoflife.date.

### Changed

* Updated the package description, npm keywords and README.

### Maintenance

* No changes to the validation API.

## [2.0.2] - 2026-06-28

### Maintenance

* Published with npm Trusted Publishing (OIDC) instead of a long-lived token. No changes to the package.

## [2.0.1] - 2026-06-28

2.0.0 was never published.

### BREAKING

* Node.js 18 is no longer supported.
* `validateValue` throws `ValidationError` instead of a generic `Error`.
* Numbers accept only decimal values, URLs require `http` or `https`, and `validators.date('YYYY-MM-DD')` checks the string format.

### Added

* `ValidationError` with `key`, `value` and `code`.
* `validators.awsArn` supports the `aws-cn` and `aws-us-gov` partitions.

### Changed

* `validators.all()` ignores entries that are not functions.

### Maintenance

* Build moved from `tsup` to `esbuild` and `tsc`; GitHub Actions pinned by commit SHA; CI on Node.js 20, 22 and 24.

## [1.1.0] - 2025-05-11

### Added

* Custom rules with `type: 'custom'` and the `validators` helpers (`regex`, `range`, `oneOf`, `date`, `json`, `awsArn`, `all`).

## [1.0.3] - 2025-05-10

### Fixed

* Added the `.js` extension to ESM exports for Node.js compatibility.

## [1.0.2] - 2025-05-10

### Fixed

* Added the `.js` extension to ESM exports for Node.js compatibility.

## [1.0.1] - 2025-05-10

### Fixed

* Added the `.js` extension to ESM exports for Node.js compatibility.

## [1.0.0] - 2025-05-10

### Added

* Initial release: runtime validation for strings, numbers, booleans, URLs and enums, with no dependencies.
