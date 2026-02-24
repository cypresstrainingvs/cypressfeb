/// <reference types="cypress" />

describe('UI Hooks Demo (example.cypress.io)', () => {
  let testData

  // Runs ONCE before all tests
  before(() => {
    cy.log('before(): one-time suite setup')
    // Load fixture data
    cy.fixture('uihooksdemo').then((data) => {
      testData = data
    })
    // Visit home once to warm up + cache
    cy.visit('/') // -> https://example.cypress.io
  })

  // Runs BEFORE EACH test
  beforeEach(() => {
    cy.log('beforeEach(): reset to a known page')
    cy.fixture('uihooksdemo').then((data) => {
      testData = data
      cy.visit(testData.actionsPage.url) // a stable page with inputs/buttons
    })
  })

  // Runs AFTER EACH test
  afterEach(() => {
    cy.log('afterEach(): per-test cleanup (if needed)')
    // (Usually not needed on this site; kept for teaching)
    cy.clearCookies({ log: false })
    cy.clearLocalStorage({ log: false })
  })

  // Runs ONCE after all tests
  after(() => {
    cy.log('after(): one-time suite teardown')
  })

  it('types into an input and asserts the value', () => {
    const { selector, testValue } = testData.actionsPage.emailInput
    cy.get(selector).type(testValue)
      .should('have.value', testValue)
  })

  it('clicks a button and verifies behavior', () => {
    const { text, popoverText } = testData.actionsPage.button
    cy.contains('button', text).first().click()
    cy.contains(popoverText).should('be.visible')
  })
})