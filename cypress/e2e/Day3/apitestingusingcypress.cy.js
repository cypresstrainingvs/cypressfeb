/*
 * API Testing Using Cypress
 * =========================
 * 
 * This module covers how to test REST APIs using Cypress.
 * 
 * Topics:
 * - Introduction to cy.request() and API testing
 * - HTTP methods: GET, POST, PUT, PATCH, DELETE
 * - Validating responses, headers, and status codes
 * - Chaining multiple API requests
 * - Using fixtures for test data
 * - Custom commands for reusable API operations
 * 
 * Key Points:
 * - cy.request() bypasses the browser, making tests faster
 * - API tests don't need a running UI
 * - Great for test data setup, authentication, and backend validation
 */


describe('API Testing Using Cypress', () => {


  // ===========================================================================
  // SECTION 1: Introduction to API Testing
  // ===========================================================================

  describe('Section 1: Introduction to API Testing', () => {

    /*
     * What is API Testing?
     * - Send requests to backend endpoints
     * - Validate status codes, response body, headers
     * - Check response times for performance
     * 
     * Why use Cypress for API testing?
     * - Same framework for UI and API tests
     * - Easy to chain API calls with UI tests
     * - Built-in assertions and retries
     */

    it('demonstrates basic API test structure', () => {
      // Make a GET request to fetch a post
      cy.request({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/posts/1'
      }).then((response) => {
        // Log response details for learning
        cy.log('Response Status: ' + response.status)
        cy.log('Response Body: ' + JSON.stringify(response.body))
        cy.log('Response Time: ' + response.duration + 'ms')

        // Validate status code
        expect(response.status).to.eq(200)

        // Validate response body exists
        expect(response.body).to.not.be.empty

        // Validate response has expected properties
        expect(response.body).to.have.property('id')
        expect(response.body).to.have.property('title')
        expect(response.body).to.have.property('body')
        expect(response.body).to.have.property('userId')
      })
    })


    it('inspects all parts of API response', () => {
      /*
       * The response object contains:
       * - status: HTTP status code (200, 201, 404, etc.)
       * - body: The response payload (parsed JSON)
       * - headers: Response headers
       * - duration: Request time in milliseconds
       */
      cy.request('https://jsonplaceholder.typicode.com/users/1').then((response) => {
        // Status code
        cy.log('Status Code: ' + response.status)
        expect(response.status).to.be.oneOf([200, 201])

        // Response body
        cy.log('Body Type: ' + typeof response.body)
        expect(response.body).to.be.an('object')

        // Headers
        cy.log('Content-Type: ' + response.headers['content-type'])
        expect(response.headers).to.have.property('content-type')

        // Duration (performance check)
        cy.log('Duration: ' + response.duration + 'ms')
        expect(response.duration).to.be.lessThan(5000)

        // Verify specific data
        expect(response.body.name).to.eq('Leanne Graham')
        expect(response.body.email).to.eq('Sincere@april.biz')
      })
    })
  })


  // ===========================================================================
  // SECTION 2: HTTP Methods with cy.request()
  // ===========================================================================

  /*
   * HTTP Methods Overview:
   * GET    - Retrieve data from server
   * POST   - Create new resource
   * PUT    - Replace entire resource
   * PATCH  - Partial update of resource
   * DELETE - Remove resource
   */

  describe('Section 2: Working with HTTP Methods', () => {

    // Load test data from fixture
    let apiData

    before(() => {
      cy.fixture('apiTestData').then((data) => {
        apiData = data
        cy.log('Test data loaded from fixture')
      })
    })


    // -------------------------------------------------------------------------
    // 2.1 GET Requests - Retrieve data from server
    // -------------------------------------------------------------------------

    describe('2.1 GET Requests', () => {

      it('fetches a single resource', () => {
        cy.request({
          method: 'GET',
          url: 'https://jsonplaceholder.typicode.com/posts/1'
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.all.keys('userId', 'id', 'title', 'body')
          expect(response.body.id).to.eq(1)
          expect(response.body.userId).to.eq(1)
          expect(response.body.title).to.be.a('string')
        })
      })


      it('fetches a collection of resources', () => {
        cy.request({
          method: 'GET',
          url: 'https://jsonplaceholder.typicode.com/posts'
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.be.an('array')
          expect(response.body).to.have.length(100)

          // Each item should have required properties
          response.body.forEach((post) => {
            expect(post).to.have.property('id')
            expect(post).to.have.property('title')
          })
        })
      })


      it('uses query parameters for filtering', () => {
        // Use 'qs' option to pass query parameters
        cy.request({
          method: 'GET',
          url: 'https://jsonplaceholder.typicode.com/posts',
          qs: {
            userId: 1,
            _limit: 5
          }
        }).then((response) => {
          expect(response.status).to.eq(200)

          // Verify filtering worked
          response.body.forEach((post) => {
            expect(post.userId).to.eq(1)
          })

          cy.log('Fetched ' + response.body.length + ' posts for userId=1')
        })
      })


      it('handles 404 Not Found gracefully', () => {
        cy.request({
          method: 'GET',
          url: 'https://jsonplaceholder.typicode.com/posts/9999',
          failOnStatusCode: false  // Don't fail test on 4xx/5xx
        }).then((response) => {
          expect(response.status).to.eq(404)
          expect(response.body).to.deep.eq({})
          cy.log('404 handled correctly')
        })
      })
    })


    // -------------------------------------------------------------------------
    // 2.2 POST Requests - Create new resources
    // -------------------------------------------------------------------------

    describe('2.2 POST Requests', () => {

      it('creates a new resource', () => {
        const newPost = {
          title: 'Cypress API Testing',
          body: 'Learning how to test APIs with Cypress',
          userId: 1
        }

        cy.request({
          method: 'POST',
          url: 'https://jsonplaceholder.typicode.com/posts',
          body: newPost,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          // POST returns 201 Created
          expect(response.status).to.eq(201)

          // Server returns created resource with ID
          expect(response.body).to.have.property('id')
          expect(response.body.id).to.eq(101)

          // Verify our data was received
          expect(response.body.title).to.eq(newPost.title)
          expect(response.body.body).to.eq(newPost.body)
          expect(response.body.userId).to.eq(newPost.userId)

          cy.log('Created post with ID: ' + response.body.id)
        })
      })


      it('creates resource using fixture data', () => {
        cy.fixture('apiTestData').then((data) => {
          cy.request({
            method: 'POST',
            url: data.baseUrls.jsonPlaceholder + '/posts',
            body: data.testPosts.newPost
          }).then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.title).to.eq(data.testPosts.newPost.title)
            cy.log('Resource created using fixture data')
          })
        })
      })
    })


    // -------------------------------------------------------------------------
    // 2.3 PUT Requests - Replace entire resource
    // -------------------------------------------------------------------------

    describe('2.3 PUT Requests (Full Update)', () => {

      it('fully updates a resource', () => {
        const updatedPost = {
          id: 1,
          title: 'Completely Updated Title',
          body: 'This is a completely new body content',
          userId: 1
        }

        cy.request({
          method: 'PUT',
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          body: updatedPost
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.title).to.eq(updatedPost.title)
          expect(response.body.body).to.eq(updatedPost.body)
          cy.log('Resource fully updated with PUT')
        })
      })
    })


    // -------------------------------------------------------------------------
    // 2.4 PATCH Requests - Partial update
    // -------------------------------------------------------------------------

    describe('2.4 PATCH Requests (Partial Update)', () => {

      it('partially updates a resource', () => {
        // Only update title, leave other fields unchanged
        const partialUpdate = {
          title: 'Only Title Updated'
        }

        cy.request({
          method: 'PATCH',
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          body: partialUpdate
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.title).to.eq(partialUpdate.title)

          // Other fields should still exist
          expect(response.body).to.have.property('body')
          expect(response.body).to.have.property('userId')

          cy.log('Resource partially updated with PATCH')
        })
      })
    })


    // -------------------------------------------------------------------------
    // 2.5 DELETE Requests - Remove resources
    // -------------------------------------------------------------------------

    describe('2.5 DELETE Requests', () => {

      it('deletes a resource', () => {
        cy.request({
          method: 'DELETE',
          url: 'https://jsonplaceholder.typicode.com/posts/1'
        }).then((response) => {
          expect(response.status).to.be.oneOf([200, 204])
          cy.log('Resource deleted successfully')
        })
      })


      it('verifies resource is deleted', () => {
        cy.request({
          method: 'DELETE',
          url: 'https://jsonplaceholder.typicode.com/posts/1'
        }).then((deleteResponse) => {
          expect(deleteResponse.status).to.be.oneOf([200, 204])
        })

        // Note: JSONPlaceholder doesn't actually delete
        // In real APIs, GET would return 404 after DELETE
        cy.log('In real APIs, GET would return 404 after DELETE')
      })
    })
  })


  // ===========================================================================
  // SECTION 3: Advanced Response Validations
  // ===========================================================================

  describe('Section 3: Advanced Response Validations', () => {

    // -------------------------------------------------------------------------
    // 3.1 Header Validation
    // -------------------------------------------------------------------------

    describe('3.1 Validating Response Headers', () => {

      it('validates response headers', () => {
        cy.request('https://jsonplaceholder.typicode.com/posts/1').then((response) => {
          // Check content-type header
          expect(response.headers).to.have.property('content-type')
          expect(response.headers['content-type']).to.include('application/json')

          // Check cache headers exist
          expect(response.headers).to.have.property('cache-control')

          cy.log('Response Headers: ' + JSON.stringify(response.headers))
        })
      })
    })


    // -------------------------------------------------------------------------
    // 3.2 Schema Validation
    // -------------------------------------------------------------------------

    describe('3.2 Response Schema Validation', () => {

      it('validates response matches expected schema', () => {
        cy.request('https://jsonplaceholder.typicode.com/users/1').then((response) => {
          const user = response.body

          // Validate required fields exist
          const requiredFields = ['id', 'name', 'username', 'email', 'address', 'phone', 'website', 'company']
          requiredFields.forEach((field) => {
            expect(user, 'Missing field: ' + field).to.have.property(field)
          })

          // Validate field types
          expect(user.id).to.be.a('number')
          expect(user.name).to.be.a('string')
          expect(user.email).to.be.a('string')
          expect(user.address).to.be.an('object')

          // Validate nested object structure
          expect(user.address).to.have.property('street')
          expect(user.address).to.have.property('city')
          expect(user.address).to.have.property('geo')
          expect(user.address.geo).to.have.property('lat')
          expect(user.address.geo).to.have.property('lng')

          cy.log('Schema validation passed')
        })
      })
    })

    // -------------------------------------------------------------------------
    // 3.3 Performance Validation
    // -------------------------------------------------------------------------

    describe('3.3 Performance/Response Time Validation', () => {

      it('responds within acceptable time limit', () => {
        const maxResponseTime = 3000 // 3 seconds

        cy.request('https://jsonplaceholder.typicode.com/posts').then((response) => {
          expect(response.status).to.eq(200)
          expect(response.duration).to.be.lessThan(maxResponseTime)

          cy.log('Response time: ' + response.duration + 'ms (limit: ' + maxResponseTime + 'ms)')
        })
      })
    })
  })


  // ===========================================================================
  // SECTION 4: Chaining API Requests
  // ===========================================================================

  describe('Section 4: Chaining API Requests', () => {

    /*
     * Request chaining patterns:
     * 1. Use response from one request in another
     * 2. Create -> Read -> Update -> Delete sequences
     * 3. Authentication -> Protected API calls
     */

    it('chains multiple API requests (CRUD)', () => {
      let createdPostId

      // Step 1: CREATE a new post
      cy.request({
        method: 'POST',
        url: 'https://jsonplaceholder.typicode.com/posts',
        body: {
          title: 'Chained Request Test',
          body: 'This post was created in a chain',
          userId: 1
        }
      }).then((createResponse) => {
        expect(createResponse.status).to.eq(201)
        createdPostId = createResponse.body.id
        cy.log('Step 1: Created post with ID: ' + createdPostId)

        // Step 2: READ the created post
        return cy.request({
          method: 'GET',
          url: 'https://jsonplaceholder.typicode.com/posts/' + createdPostId
        })
      }).then((readResponse) => {
        expect(readResponse.status).to.eq(200)
        cy.log('Step 2: Retrieved post: ' + readResponse.body.title)

        // Step 3: UPDATE the post
        return cy.request({
          method: 'PUT',
          url: 'https://jsonplaceholder.typicode.com/posts/' + createdPostId,
          body: {
            id: createdPostId,
            title: 'Updated Chained Post',
            body: 'This post has been updated',
            userId: 1
          }
        })
      }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200)
        cy.log('Step 3: Updated post title to: ' + updateResponse.body.title)

        // Step 4: DELETE the post
        return cy.request({
          method: 'DELETE',
          url: 'https://jsonplaceholder.typicode.com/posts/' + createdPostId
        })
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.be.oneOf([200, 204])
        cy.log('Step 4: Deleted post with ID: ' + createdPostId)
        cy.log('Full CRUD chain completed successfully')
      })
    })


    it('chains authentication with protected API call', () => {
      // Step 1: Login and get token
      cy.request({
        method: 'POST',
        url: 'https://reqres.in/api/login',
        body: {
          email: 'eve.holt@reqres.in',
          password: 'cityslicka'
        }
      }).then((loginResponse) => {
        expect(loginResponse.status).to.eq(200)
        expect(loginResponse.body).to.have.property('token')

        const authToken = loginResponse.body.token
        cy.log('Received auth token: ' + authToken)

        // Step 2: Use token for authenticated request
        return cy.request({
          method: 'GET',
          url: 'https://reqres.in/api/users/2',
          headers: {
            Authorization: 'Bearer ' + authToken
          }
        })
      }).then((userResponse) => {
        expect(userResponse.status).to.eq(200)
        expect(userResponse.body.data).to.have.property('email')

        cy.log('Fetched user: ' + userResponse.body.data.first_name + ' ' + userResponse.body.data.last_name)
        cy.log('Authenticated API chain completed')
      })
    })


    it('fetches related resources in sequence', () => {
      let userId

      // Step 1: Get a user
      cy.request('https://jsonplaceholder.typicode.com/users/1').then((userResponse) => {
        userId = userResponse.body.id
        cy.log('User: ' + userResponse.body.name)

        // Step 2: Get user's posts
        return cy.request({
          url: 'https://jsonplaceholder.typicode.com/posts',
          qs: { userId: userId }
        })
      }).then((postsResponse) => {
        cy.log('User has ' + postsResponse.body.length + ' posts')

        // Step 3: Get comments on first post
        const firstPostId = postsResponse.body[0].id
        return cy.request({
          url: 'https://jsonplaceholder.typicode.com/comments',
          qs: { postId: firstPostId }
        })
      }).then((commentsResponse) => {
        cy.log('First post has ' + commentsResponse.body.length + ' comments')
        cy.log('Related resources chain completed')
      })
    })
  })


  // ===========================================================================
  // SECTION 5: Using Custom Commands (Enterprise Pattern)
  // ===========================================================================

  describe('Section 5: Using Custom Commands', () => {

    /*
     * Benefits of custom commands:
     * - Reusability: Write once, use everywhere
     * - Consistency: Same patterns across all tests
     * - Maintainability: Update logic in one place
     * - Readability: Clean, expressive test code
     */

    it('uses apiRequest custom command', () => {
      cy.apiRequest({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/posts/1'
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('title')
      })
    })


    it('uses apiCreate custom command for POST', () => {
      const newPost = {
        title: 'Created via Custom Command',
        body: 'This demonstrates the apiCreate command',
        userId: 1
      }

      cy.apiCreate('https://jsonplaceholder.typicode.com/posts', newPost)
        .then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body.title).to.eq(newPost.title)
        })
    })


    it('uses apiRead custom command for GET', () => {
      cy.apiRead('https://jsonplaceholder.typicode.com/posts', { _limit: 5 })
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.length(5)
        })
    })


    it('uses apiUpdate custom command for PUT', () => {
      const updatedPost = {
        id: 1,
        title: 'Updated via Custom Command',
        body: 'This demonstrates the apiUpdate command',
        userId: 1
      }

      cy.apiUpdate('https://jsonplaceholder.typicode.com/posts/1', updatedPost)
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.title).to.eq(updatedPost.title)
        })
    })


    it('uses apiDelete custom command for DELETE', () => {
      cy.apiDelete('https://jsonplaceholder.typicode.com/posts/1')
        .then((response) => {
          expect(response.status).to.be.oneOf([200, 204])
        })
    })


    it('chains custom commands with schema validation', () => {
      const schema = {
        requiredFields: ['id', 'title', 'body', 'userId'],
        types: {
          id: 'number',
          title: 'string',
          body: 'string',
          userId: 'number'
        }
      }

      cy.apiRead('https://jsonplaceholder.typicode.com/posts/1')
        .validateSchema(schema)
        .validateHeaders({ 'content-type': 'application/json' })
        .then((response) => {
          cy.log('All validations passed')
        })
    })
  })


  // ===========================================================================
  // SECTION 6: Error Handling in API Tests
  // ===========================================================================

  describe('Section 6: Error Handling', () => {

    /*
     * Why error handling matters:
     * - Tests should verify error scenarios too
     * - API should return appropriate error codes
     * - Error messages should be meaningful
     */

    it('handles 400 Bad Request', () => {
      cy.request({
        method: 'POST',
        url: 'https://reqres.in/api/login',
        body: {
          email: 'test@test.com'
          // Missing password - should cause 400
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('error')
        cy.log('Error message: ' + response.body.error)
      })
    })


    it('handles 404 Not Found', () => {
      cy.request({
        method: 'GET',
        url: 'https://reqres.in/api/users/999',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404)
        cy.log('404 handled correctly for non-existent user')
      })
    })


    it('handles network timeout gracefully', () => {
      cy.request({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/posts',
        timeout: 30000
      }).then((response) => {
        expect(response.status).to.eq(200)
        cy.log('Request completed within timeout')
      })
    })
  })


  // ===========================================================================
  // SECTION 7: API + UI Integration Patterns
  // ===========================================================================

  describe('Section 7: API + UI Integration Patterns', () => {

    /*
     * Common integration patterns:
     * - API for test setup (create test data)
     * - API for authentication (faster than UI login)
     * - API for cleanup (delete test data after tests)
     * - API for verification (verify UI actions via API)
     */

    it('demonstrates API-first test setup pattern', () => {
      // Use API to create test data, then verify in UI
      // This is faster and more reliable than creating data through UI

      cy.request({
        method: 'POST',
        url: 'https://jsonplaceholder.typicode.com/posts',
        body: {
          title: 'Test Post for UI Verification',
          body: 'Created via API for testing',
          userId: 1
        }
      }).then((response) => {
        const postId = response.body.id
        cy.log('Test data created via API - Post ID: ' + postId)

        // Now you could visit a UI page to verify this data appears
        // cy.visit('/posts/' + postId)
        // cy.contains('Test Post for UI Verification').should('be.visible')
      })
    })


    it('demonstrates API authentication pattern', () => {
      // Use API login instead of UI login (faster)

      cy.request({
        method: 'POST',
        url: 'https://reqres.in/api/login',
        body: {
          email: 'eve.holt@reqres.in',
          password: 'cityslicka'
        }
      }).then((response) => {
        // Store token for subsequent requests
        window.localStorage.setItem('authToken', response.body.token)
        cy.log('Authenticated via API - Token stored in localStorage')

        // Now UI tests can run authenticated without going through login UI
      })
    })
  })

})


/*
 * Summary - Key Takeaways
 * =======================
 * 
 * 1. cy.request() is the primary tool for API testing in Cypress
 * 
 * 2. Always validate:
 *    - Status codes (200, 201, 400, 404, etc.)
 *    - Response body structure and content
 *    - Headers (Content-Type, Authorization, etc.)
 *    - Response time for performance
 * 
 * 3. Use failOnStatusCode: false when testing error scenarios
 * 
 * 4. Chain requests for complex workflows (Auth -> API calls)
 * 
 * 5. Use fixtures for test data management
 * 
 * 6. Create custom commands for reusable API operations
 * 
 * 7. Integrate API tests with UI tests for efficient testing
 */
