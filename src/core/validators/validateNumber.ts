export function validateNumber(key: string, value: string | undefined): number {
  if (value === undefined)
    throw new Error(`${key} is required and must be a number`)
  const num = Number(value)
  if (isNaN(num)) throw new Error(`${key} must be a valid number`)
  return num
}
