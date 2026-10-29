const UNRESERVED = 'A-Za-z0-9\\-._~'
const SUB_DELIMS = "!$&'()*+,;="
const UCSCHAR =
  '\\u{A0}-\\u{D7FF}\\u{F900}-\\u{FDCF}\\u{FDF0}-\\u{FFEF}' +
  '\\u{10000}-\\u{1FFFD}\\u{20000}-\\u{2FFFD}\\u{30000}-\\u{3FFFD}\\u{40000}-\\u{4FFFD}' +
  '\\u{50000}-\\u{5FFFD}\\u{60000}-\\u{6FFFD}\\u{70000}-\\u{7FFFD}\\u{80000}-\\u{8FFFD}' +
  '\\u{90000}-\\u{9FFFD}\\u{A0000}-\\u{AFFFD}\\u{B0000}-\\u{BFFFD}\\u{C0000}-\\u{CFFFD}' +
  '\\u{D0000}-\\u{DFFFD}\\u{E1000}-\\u{EFFFD}'
const IPRIVATE =
  '\\u{E000}-\\u{F8FF}\\u{F0000}-\\u{FFFFD}\\u{100000}-\\u{10FFFD}'
const PCT_ENCODED = '%[0-9A-Fa-f]{2}'

function component(extra: string): RegExp {
  return new RegExp(
    `^(?:[${UNRESERVED}${UCSCHAR}${SUB_DELIMS}${extra}]|${PCT_ENCODED})*$`,
    'u'
  )
}

const SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*$/
const USERINFO = component(':')
const REG_NAME = component('')
const PATH = component(':@/')
const QUERY = component(`:@/?${IPRIVATE}`)
const FRAGMENT = component(':@/?')
const PORT = /^[0-9]*$/
const IP_FUTURE = new RegExp(`^v[0-9A-Fa-f]+\\.[${UNRESERVED}${SUB_DELIMS}:]+$`)
const H16 = /^[0-9A-Fa-f]{1,4}$/
const DEC_OCTET = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/

const PARTS =
  /^([^:/?#]+):\/\/([^/?#]*)((?:\/[^?#]*)?)(?:\?([^#]*))?(?:#(.*))?$/u

export function isUrl(value: string): boolean {
  const parts = PARTS.exec(value)
  if (!parts) return false
  const [, scheme, authority, path, query = '', fragment = ''] = parts
  return (
    SCHEME.test(scheme) &&
    isAuthority(authority) &&
    PATH.test(path) &&
    QUERY.test(query) &&
    FRAGMENT.test(fragment)
  )
}

function isAuthority(authority: string): boolean {
  const at = authority.indexOf('@')
  const userinfo = at === -1 ? '' : authority.slice(0, at)
  const hostport = at === -1 ? authority : authority.slice(at + 1)
  return USERINFO.test(userinfo) && isHostPort(hostport)
}

function isHostPort(hostport: string): boolean {
  if (hostport.startsWith('[')) {
    const close = hostport.indexOf(']')
    if (close === -1) return false
    const rest = hostport.slice(close + 1)
    return (
      isIpLiteral(hostport.slice(1, close)) &&
      (rest === '' || (rest[0] === ':' && PORT.test(rest.slice(1))))
    )
  }
  const colon = hostport.indexOf(':')
  const host = colon === -1 ? hostport : hostport.slice(0, colon)
  const port = colon === -1 ? '' : hostport.slice(colon + 1)
  return REG_NAME.test(host) && PORT.test(port)
}

function isIpLiteral(literal: string): boolean {
  return IP_FUTURE.test(literal) || isIPv6(literal)
}

function isIPv6(literal: string): boolean {
  const halves = literal.split('::')
  if (halves.length > 2) return false
  if (halves.length === 1) return countGroups(literal, true) === 8
  const head = countGroups(halves[0], false)
  const tail = countGroups(halves[1], true)
  return head !== -1 && tail !== -1 && head + tail <= 7
}

function countGroups(part: string, allowIPv4: boolean): number {
  if (part === '') return 0
  const pieces = part.split(':')
  let count = 0
  for (const [index, piece] of pieces.entries()) {
    if (allowIPv4 && index === pieces.length - 1 && piece.includes('.')) {
      if (!isIPv4(piece)) return -1
      count += 2
    } else if (H16.test(piece)) {
      count += 1
    } else {
      return -1
    }
  }
  return count
}

function isIPv4(value: string): boolean {
  const octets = value.split('.')
  return octets.length === 4 && octets.every((octet) => DEC_OCTET.test(octet))
}
