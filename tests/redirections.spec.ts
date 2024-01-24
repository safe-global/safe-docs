import redirects from '../redirects.json'

describe('Should redirect legacy routes', () => {
  redirects.forEach(redirect => {
    it(`Should redirect ${redirect.source} to ${redirect.destination}`, () => {
      cy.visit(redirect.source)
      cy.url().should('include', redirect.destination)
    })
  })
})
