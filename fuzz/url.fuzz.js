import { isIPv6 } from 'node:net'
import fc from 'fast-check'
import { validators } from '../dist/index.js'

const isUrl = validators.url()

const literal = fc.oneof(
  fc.ipV6(),
  fc.string({
    unit: fc.constantFrom(...'0123456789abcdefABCDEFg:.'),
    maxLength: 45,
  })
)

fc.assert(
  fc.property(literal, (value) => {
    const ours = !/^v/i.test(value) && isUrl(`http://[${value}]/`) === true
    if (ours !== isIPv6(value))
      throw new Error(
        `IPv6 mismatch for ${JSON.stringify(value)}: valitype ${ours}, node ${!ours}`
      )
  }),
  { numRuns: 20000 }
)

fc.assert(
  fc.property(
    fc.webUrl({ withQueryParameters: true, withFragments: true }),
    (url) => {
      if (isUrl(url) !== true)
        throw new Error(`Rejected ${JSON.stringify(url)}`)
    }
  ),
  { numRuns: 10000 }
)

fc.assert(
  fc.property(fc.string({ maxLength: 2000 }), (value) => {
    const result = isUrl(value)
    if (result !== true && typeof result !== 'string')
      throw new Error('validators.url returned an unexpected value')
  }),
  { numRuns: 10000 }
)
