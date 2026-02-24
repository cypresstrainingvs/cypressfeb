/// <reference types="cypress" />

describe('API Hooks Demo (JSONPlaceholder)', () => {
  let createdUserId

  // One-time setup: (optionally) log something or fetch reference data
  before(() => {
    cy.log('before(): suite-level setup for API tests')
  })

  // Reset/prepare before each test (idempotent endpoint idea)
  beforeEach(() => {
    cy.log('beforeEach(): nothing heavy here; API is stateless for demo')
  })

  afterEach(() => {
    cy.log('afterEach(): per-test cleanup (if needed)')
  })

  // One-time teardown: delete anything created in suite
  after(() => {
    cy.log('after(): clean up users if created')
    if (createdUserId) {
      // JSONPlaceholder fakes writes, so this is for demonstration
      cy.request('DELETE', `https://jsonplaceholder.typicode.com/users/${createdUserId}`)
        .its('status').should('eq', 200)
    }
  })

  it('lists users', () => {
    cy.request('GET', 'https://jsonplaceholder.typicode.com/users') // list users
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array').and.have.length.greaterThan(0)
      })
  })

  it('creates a user and captures its id', () => {
    cy.request('POST', 'https://jsonplaceholder.typicode.com/users', {
      name: 'Training User',
      username: 'trainuser',
      email: 'train@example.com'
    }).then(({ status, body }) => {
      expect(status).to.eq(201)
      expect(body).to.have.property('id')
      createdUserId = body.id
    })
  })

  it('updates a user (PUT)', () => {
    // JSONPlaceholder only has users 1-10, so always use an existing id
    const id = 2
    cy.request('PUT', `https://jsonplaceholder.typicode.com/users/${id}`, {
      name: 'Training User Updated',
      username: 'trainuserupdated',
      email: 'trainupdated@example.com'
    }).its('status').should('eq', 200)
  })
})