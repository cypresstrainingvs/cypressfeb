/// <reference types="cypress" />

describe('API Hooks Demo (JSONPlaceholder)', () => {
  let newPostId

  before(() => {
    cy.log('before(): suite setup - nothing heavy')
  })

  beforeEach(() => {
    cy.log('beforeEach(): ensure API is reachable')
    cy.request('GET', 'https://jsonplaceholder.typicode.com/posts/1')
      .its('status').should('eq', 200)
  })

  afterEach(() => {
    cy.log('afterEach(): no per-test cleanup required for this fake API')
  })

  after(() => {
    cy.log('after(): reminder - JSONPlaceholder fakes writes only')
  })

  it('reads a single resource', () => {
    cy.request('GET', 'https://jsonplaceholder.typicode.com/posts/1')
      .its('body').should('have.property', 'id', 1)
  })

  it('creates a post (faked server write)', () => {
    cy.request('POST', 'https://jsonplaceholder.typicode.com/posts', {
      title: 'My Post',
      body: 'Hello from training',
      userId: 1
    }).then(({ status, body }) => {
      expect(status).to.eq(201)
      expect(body).to.have.property('id')
      newPostId = body.id
    })
  })

  it('updates a post (PUT, faked)', () => {
    // JSONPlaceholder only has posts 1-100, so always use an existing id
    const id = 1
    cy.request('PUT', `https://jsonplaceholder.typicode.com/posts/${id}`, {
      id,
      title: 'Updated',
      body: 'Updated body',
      userId: 1
    }).its('status').should('eq', 200)
  })

  it('lists nested resources (comments for post 1)', () => {
    cy.request('GET', 'https://jsonplaceholder.typicode.com/posts/1/comments')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array').and.have.length.greaterThan(0)
      })
  })
})
