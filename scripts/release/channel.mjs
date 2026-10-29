const VERSION = /^(\d+)\.(\d+)\.(\d+)$/

function parse(version) {
  const match = VERSION.exec(version)
  if (!match) throw new Error(`Invalid version: ${version}`)
  return match.slice(1).map(Number)
}

function isNewer(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] > b[i]
  }
  return false
}

export function releaseChannel(version, currentLatest) {
  const next = parse(version)
  if (currentLatest === '') return { latest: true, npmTag: 'latest' }
  if (isNewer(next, parse(currentLatest)))
    return { latest: true, npmTag: 'latest' }
  return { latest: false, npmTag: `release-${next[0]}` }
}
