export function validateEnum(
  key: string,
  value: string | undefined,
  options: string[]
): string {
  if (value === undefined)
    throw new Error(
      `${key} is required and must be one of: ${options.join(', ')}`
    )
  if (!options.includes(value)) {
    throw new Error(`${key} must be one of: ${options.join(', ')}`)
  }
  return value
}
