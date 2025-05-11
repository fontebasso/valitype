export function validateCustom(
  key: string,
  value: string | undefined,
  validator: (value: string | undefined) => boolean | string,
  errorMessage?: string
): string {
  const result = validator(value)
  
  if (result !== true) {
    const message = typeof result === 'string' 
      ? result 
      : errorMessage || `${key} failed custom validation`
    
    throw new Error(message)
  }

  return value as string
}
