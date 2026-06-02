import { test } from 'node:test'
import assert from 'node:assert/strict'
import redirects from '../redirects.json' with { type: 'json' }

const BASE = process.env.NEXT_PUBLIC_HOST_URL ?? 'http://localhost:3000'

// Next.js decodes `+` in query values to a literal space when emitting the
// Location header, so normalize both sides to compare encoding-agnostic.
const normalize = (s: string): string =>
  s.replace(/\+/g, ' ').replace(/%20/g, ' ')

// Skip entries whose source uses Next.js path-matcher syntax (e.g. `/safenet/:path*`).
// Those are not literal URLs and can't be fetched directly.
const cases = redirects.filter(r => !r.source.includes(':'))

for (const r of cases) {
  test(`${r.source} → ${r.destination}`, async () => {
    const res = await fetch(BASE + r.source, { redirect: 'manual' })
    assert.ok(
      [301, 308].includes(res.status),
      `Expected redirect status, got ${res.status}`
    )
    const location = res.headers.get('location') ?? ''
    assert.ok(
      normalize(location).includes(normalize(r.destination)),
      `Location "${location}" should include "${r.destination}"`
    )
  })
}
