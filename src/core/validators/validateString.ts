export function validateString(key: string, value: string | undefined): string {
  if (value === undefined)
    throw new Error(`${key} is required and must be a string`)
  return value
}
