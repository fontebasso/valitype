export type ValidationErrorCode =
  | 'REQUIRED'
  | 'INVALID_NUMBER'
  | 'INVALID_BOOLEAN'
  | 'INVALID_URL'
  | 'INVALID_ENUM'
  | 'INVALID_CUSTOM'
  | 'UNKNOWN_RULE'

export class ValidationError extends Error {
  readonly key: string
  readonly value: string | undefined
  readonly code: ValidationErrorCode

  constructor(params: {
    key: string
    value: string | undefined
    code: ValidationErrorCode
    message: string
  }) {
    super(params.message)
    this.name = 'ValidationError'
    this.key = params.key
    this.value = params.value
    this.code = params.code
  }
}