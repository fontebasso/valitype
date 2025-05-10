export function validateBoolean(
  key: string,
  value: string | undefined
): boolean {
  if (value === undefined)
    throw new Error(`${key} is required and must be a boolean`)
  if (value === 'true') return true
  if (value === 'false') return false
  throw new Error(`${key} must be either "true" or "false"`)
}
