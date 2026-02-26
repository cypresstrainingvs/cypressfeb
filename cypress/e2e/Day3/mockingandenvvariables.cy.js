/*
 * Mocking Network Requests in Cypress
 * ====================================
 * 
 * This module covers cy.intercept() - the command we use to control
 * network requests in our tests.
 * 
 * Topics Covered:
 * - What cy.intercept() does and why we use it
 * - Mocking successful API responses
 * - Mocking error scenarios (500, 401, 404)
 * - Simulating slow network responses
 * - Using fixtures to store mock data
 * 
 * Why Mock Network Requests?
 * - Tests become stable and predictable
 * - No dependency on backend availability
 * - Can test error scenarios easily
 * - Tests run faster
 */


describe('Mocking Network Requests with cy.intercept()', () => {

  // Load mock data from fixture before all tests
  let mockData

  before(() => {
    cy.fixture('mockData').then((data) => {
      mockData = data
    })
  })


  // =========================================================================
  // SECTION 1: Basic Mocking - What is cy.intercept()?
  // =========================================================================

  describe('Section 1: Understanding cy.intercept()', () => {

    /*
     * cy.intercept() intercepts HTTP requests made by the application.
     * We can:
     * - Watch requests (spy)
     * - Modify responses (stub/mock)
     * - Delay responses (simulate slow network)
     */

    it('intercepts and mocks a GET request with inline data', () => {
      // Define the mock response inline
      cy.intercept('GET', '/api/users', {
        statusCode: 200,
        body: {
          users: [
            { id: 1, name: 'John Doe' }
          ]
        }
      }).as('getUsers')

      // Visit a page that would make this API call
      cy.visit('https://example.cypress.io/')

      // The intercept is now active - any GET to /api/users will return our mock
      cy.log('Intercept is active for GET /api/users')
    })


    it('uses alias to wait for the mocked request', () => {
      // Set up the intercept with an alias
      cy.intercept('GET', '**/todos/1', {
        statusCode: 200,
        body: {
          id: 1,
          title: 'Learn Cypress Mocking',
          completed: true
        }
      }).as('getTodo')

      // Make the actual request
      cy.request('https://jsonplaceholder.typicode.com/todos/1')

      // Wait for the request (note: cy.request bypasses intercept in this case)
      // In real tests, the app would trigger the request
      cy.log('Alias @getTodo can be used with cy.wait("@getTodo")')
    })
  })


  // =========================================================================
  // SECTION 2: Mocking Success Responses
  // =========================================================================

  describe('Section 2: Mocking Success Responses', () => {

    /*
     * The most common use case - return fake successful data.
     * This lets us test the UI without needing a real backend.
     */

    it('mocks a successful response using fixture data', () => {
      // Use data from our fixture file
      cy.intercept('GET', '/api/users', {
        statusCode: mockData.users.success.statusCode,
        body: mockData.users.success.body
      }).as('getUsersSuccess')

      cy.visit('https://example.cypress.io/')

      // Verify the intercept was set up correctly
      cy.log('Mock returns: ' + mockData.users.success.body.users.length + ' users')
    })


    it('mocks a POST request for creating data', () => {
      // Mock the response for creating a new post
      cy.intercept('POST', '/api/posts', {
        statusCode: 201,
        body: {
          id: 101,
          title: 'My New Post',
          message: 'Created successfully'
        }
      }).as('createPost')

      cy.visit('https://example.cypress.io/')

      cy.log('POST /api/posts will return status 201 with new post data')
    })


    it('mocks an empty data response', () => {
      // Sometimes we need to test what happens when there is no data
      cy.intercept('GET', '/api/users', {
        statusCode: 200,
        body: {
          users: []
        }
      }).as('getUsersEmpty')

      cy.visit('https://example.cypress.io/')

      cy.log('Empty response - useful for testing "no results" UI')
    })
  })


  // =========================================================================
  // SECTION 3: Mocking Error Scenarios
  // =========================================================================

  describe('Section 3: Mocking Error Responses', () => {

    /*
     * Testing error scenarios is critical.
     * In real environments, errors are hard to reproduce.
     * With mocking, we can test any error anytime.
     */

    it('mocks a 500 Internal Server Error', () => {
      // This tests how the UI handles server failures
      cy.intercept('GET', '/api/users', {
        statusCode: 500,
        body: {
          message: 'Internal Server Error'
        }
      }).as('getUsers500')

      cy.visit('https://example.cypress.io/')

      cy.log('500 Error - Test how UI shows error message to user')
    })


    it('mocks a 401 Unauthorized Error', () => {
      // Test what happens when user is not authenticated
      cy.intercept('GET', '/api/users', {
        statusCode: 401,
        body: {
          message: 'Unauthorized - Please login'
        }
      }).as('getUsers401')

      cy.visit('https://example.cypress.io/')

      cy.log('401 Error - Test redirect to login or show auth message')
    })


    it('mocks a 404 Not Found Error', () => {
      // Test when requested resource does not exist
      cy.intercept('GET', '/api/users/999', {
        statusCode: 404,
        body: {
          message: 'User not found'
        }
      }).as('getUser404')

      cy.visit('https://example.cypress.io/')

      cy.log('404 Error - Test "not found" message in UI')
    })


    it('mocks error from fixture data', () => {
      // Use preset error responses from fixture
      cy.intercept('GET', '/api/users', {
        statusCode: mockData.users.serverError.statusCode,
        body: mockData.users.serverError.body
      }).as('getUsersError')

      cy.visit('https://example.cypress.io/')

      cy.log('Using fixture for error: ' + mockData.users.serverError.body.message)
    })
  })


  // =========================================================================
  // SECTION 4: Simulating Slow Network / Delays
  // =========================================================================

  describe('Section 4: Simulating Slow Network', () => {

    /*
     * Slow network simulation helps us test:
     * - Loading spinners
     * - Timeout handling
     * - User experience during slow connections
     */

    it('adds a delay to the response', () => {
      // Add a 2 second delay to simulate slow network
      cy.intercept('GET', '/api/users', {
        statusCode: 200,
        body: { users: [{ id: 1, name: 'John' }] },
        delay: 2000  // 2000 milliseconds = 2 seconds
      }).as('getUsersSlow')

      cy.visit('https://example.cypress.io/')

      cy.log('Response will be delayed by 2 seconds')
      cy.log('Use this to test loading spinners')
    })


    it('uses callback function for more control over delay', () => {
      // Alternative method using request callback
      cy.intercept('GET', '/api/users', (req) => {
        req.reply({
          statusCode: 200,
          body: { users: [{ id: 1, name: 'Delayed User' }] },
          delay: 3000
        })
      }).as('getUsersCallback')

      cy.visit('https://example.cypress.io/')

      cy.log('Callback method gives more control over the response')
    })


    it('simulates network failure / timeout', () => {
      // Force the request to fail completely
      cy.intercept('GET', '/api/users', {
        forceNetworkError: true
      }).as('getUsersNetworkError')

      cy.visit('https://example.cypress.io/')

      cy.log('Network error - tests offline handling')
    })
  })


  // =========================================================================
  // SECTION 5: Practical Patterns for Real Tests
  // =========================================================================

  describe('Section 5: Practical Patterns', () => {

    /*
     * These patterns are commonly used in real projects.
     * They show how to combine mocking with actual testing.
     */

    it('spies on a request without modifying it', () => {
      // Just watch the request, let it go to real server
      cy.intercept('GET', '**/todos/*').as('getTodoSpy')

      // Make a real request
      cy.request('https://jsonplaceholder.typicode.com/todos/1')
        .then((response) => {
          expect(response.status).to.equal(200)
          expect(response.body).to.have.property('id', 1)
        })

      cy.log('Spy mode - request goes to real server, we just watch')
    })


    it('mocks multiple endpoints at once', () => {
      // Set up multiple intercepts for a page that calls several APIs
      cy.intercept('GET', '/api/users', {
        statusCode: 200,
        body: { users: [{ id: 1, name: 'User 1' }] }
      }).as('getUsers')

      cy.intercept('GET', '/api/posts', {
        statusCode: 200,
        body: { posts: [{ id: 1, title: 'Post 1' }] }
      }).as('getPosts')

      cy.intercept('GET', '/api/comments', {
        statusCode: 200,
        body: { comments: [] }
      }).as('getComments')

      cy.visit('https://example.cypress.io/')

      cy.log('Multiple intercepts active - each API returns mocked data')
    })


    it('modifies specific fields in the response', () => {
      // Intercept and modify only certain fields
      cy.intercept('GET', '**/todos/1', (req) => {
        req.reply((res) => {
          // Modify the real response
          res.body.title = 'Modified by Cypress'
          res.body.completed = true
        })
      }).as('modifyTodo')

      cy.request('https://jsonplaceholder.typicode.com/todos/1')
        .then((response) => {
          // Note: cy.request doesn't go through intercept
          // This pattern works when the app makes the request
          cy.log('In app tests, this would modify the actual response')
        })
    })
  })


  // =========================================================================
  // SECTION 6: Summary and Best Practices
  // =========================================================================

  describe('Section 6: Summary', () => {

    /*
     * Key Takeaways:
     * 
     * 1. cy.intercept() controls network requests in tests
     * 
     * 2. Use cases:
     *    - Mock success responses (200, 201)
     *    - Mock error responses (400, 401, 404, 500)
     *    - Simulate slow network (delay option)
     *    - Spy on requests without changing them
     * 
     * 3. Benefits:
     *    - Tests are stable (no backend dependency)
     *    - Tests are fast (no network wait)
     *    - Can test edge cases easily
     *    - CI/CD pipelines are more reliable
     * 
     * 4. Best Practices:
     *    - Store mock data in fixtures
     *    - Use meaningful alias names
     *    - Test both success and error paths
     */

    it('confirms all mocking concepts are understood', () => {
      // Quick demo of full mocking workflow

      // Step 1: Set up the intercept
      cy.intercept('GET', '/api/users', {
        statusCode: 200,
        body: mockData.users.success.body
      }).as('getUsers')

      // Step 2: Visit the page (this would trigger the API call in real app)
      cy.visit('https://example.cypress.io/')

      // Step 3: Log what we learned
      cy.log('Step 1: cy.intercept() sets up the mock')
      cy.log('Step 2: App makes request, gets mocked response')
      cy.log('Step 3: cy.wait("@alias") waits for the request')
      cy.log('Step 4: Assert on the UI that received mocked data')
    })
  })

})
