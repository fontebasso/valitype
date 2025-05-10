export function validateUrl(key: string, value: string | undefined): string {
  if (value === undefined)
    throw new Error(`${key} is required and must be a URL`)
  try {
    new URL(value)
    return value
  } catch {
    throw new Error(`${key} must be a valid URL`)
  }
}
