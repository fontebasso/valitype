export function validateUrl(key: string, value: string | undefined): string {
  if (value === undefined)
    throw new Error(`${key} is required and must be a URL`)
  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new Error(`${key} must be a valid URL`)
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:')
    throw new Error(`${key} must be a valid URL`)
  return value
}
