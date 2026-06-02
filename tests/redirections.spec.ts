import redirects from '../redirects.json'

describe('Should redirect legacy routes', () => {
  // Skip entries whose source uses Next.js path-matcher syntax (e.g. `/safenet/:path*`).
  // Those are not literal URLs and can't be fetched directly.
  const cases = redirects.filter(r => !r.source.includes(':'))

  cases.forEach(redirect => {
    it(`Should redirect ${redirect.source} to ${redirect.destination}`, () => {
      cy.request({
        url: redirect.source,
        followRedirect: false
      }).then(response => {
        expect(response.status).to.be.oneOf([301, 308])
        const location = response.headers.location as string
        // Next.js decodes `+` in query values to a literal space when emitting
        // the Location header, so normalize both sides to compare encoding-agnostic.
        const normalize = (s: string): string =>
          s.replace(/\+/g, ' ').replace(/%20/g, ' ')
        expect(normalize(location)).to.include(normalize(redirect.destination))
      })
    })
  })
})
