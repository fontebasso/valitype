const DECIMAL_RE = /^-?\d+(\.\d+)?$/

export function validateNumber(key: string, value: string | undefined): number {
  if (value === undefined)
    throw new Error(`${key} is required and must be a number`)
  if (!DECIMAL_RE.test(value))
    throw new Error(`${key} must be a valid number`)
  return Number(value)
}
