export function validateEnum(
  key: string,
  value: string | undefined,
  options: string[]
): string {
  if (!options.includes(value ?? '')) {
    throw new Error(`${key} must be one of: ${options.join(', ')}`)
  }
  
  return value as string
}
