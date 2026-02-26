/*
 * Environment Variables and Configuration Management in Cypress
 * ==============================================================
 * 
 * This file demonstrates how to:
 * - Access environment variables from cypress.env.json
 * - Use environment variables in tests
 * - Work with feature flags
 * - Make API requests using environment configuration
 * - Switch between environments (dev, qa, prod)
 * 
 * Key Files:
 * - cypress.env.json: Stores sensitive and environment-specific values
 * - cypress.config.js: Base configuration
 * - cypress.config.dev.js: Development environment config
 * - cypress.config.qa.js: QA environment config
 * - cypress.config.prod.js: Production environment config
 * 
 * Important:
 * - cypress.env.json should be added to .gitignore
 * - Never commit sensitive data like passwords or API keys
 */

describe('Environment Variables in Cypress', () => {

  // Load fixture data for tests
  let testData

  before(() => {
    cy.fixture('environmentData').then((data) => {
      testData = data
    })
  })


  /*
   * SECTION 1: Accessing Environment Variables
   * ------------------------------------------
   * Environment variables are accessed using Cypress.env('variableName')
   * Values can come from: cypress.env.json, CLI, or cypress.config.js
   */
  describe('Accessing Environment Variables', () => {

    it('reads variables from cypress.env.json', () => {
      // Access username from cypress.env.json
      const username = Cypress.env('username')
      cy.log('Username from env: ' + username)
      expect(username).to.equal('qa_user')

      // Access password (sensitive data)
      const password = Cypress.env('password')
      cy.log('Password is loaded: ' + (password !== undefined ? 'yes' : 'no'))
      expect(password).to.not.be.undefined
    })

    it('reads API base URL from environment', () => {
      const apiBaseUrl = Cypress.env('apiBaseUrl')
      cy.log('API Base URL: ' + apiBaseUrl)
      expect(apiBaseUrl).to.include('https://')
    })

    it('uses custom command to get environment variable', () => {
      // Using our custom command for cleaner syntax
      cy.getEnvVariable('environment').then((env) => {
        cy.log('Current environment: ' + env)
        expect(env).to.be.a('string')
      })
    })

    it('provides default value when variable is not set', () => {
      // Variable that does not exist
      cy.getEnvVariable('nonExistentVar', 'default-value').then((value) => {
        expect(value).to.equal('default-value')
      })
    })
  })


  /*
   * SECTION 2: Working with Feature Flags
   * -------------------------------------
   * Feature flags allow enabling/disabling features per environment
   * Common use: enable debug mode in dev, disable in production
   */
  describe('Feature Flags', () => {

    it('reads feature flags from environment', () => {
      const featureFlags = Cypress.env('featureFlags')
      cy.log('Feature flags loaded: ' + JSON.stringify(featureFlags))
      
      expect(featureFlags).to.be.an('object')
      expect(featureFlags).to.have.property('darkMode')
      expect(featureFlags).to.have.property('betaFeatures')
    })

    it('checks if specific feature is enabled', () => {
      cy.checkFeatureFlag('darkMode').then((isEnabled) => {
        cy.log('Dark mode enabled: ' + isEnabled)
        expect(isEnabled).to.be.a('boolean')
      })
    })

    it('conditionally runs tests based on feature flag', () => {
      cy.checkFeatureFlag('betaFeatures').then((isEnabled) => {
        if (isEnabled) {
          cy.log('Running beta feature tests')
          // Add beta feature test logic here
          expect(true).to.be.true
        } else {
          cy.log('Skipping beta feature tests - flag disabled')
        }
      })
    })
  })


  /*
   * SECTION 3: Using Environment Variables for API Testing
   * ------------------------------------------------------
   * API base URL and tokens should come from environment variables
   * This allows same tests to run against different environments
   */
  describe('API Testing with Environment Variables', () => {

    it('makes API request using environment base URL', () => {
      const apiBaseUrl = Cypress.env('apiBaseUrl')
      const endpoint = testData.endpoints.users

      cy.request({
        method: 'GET',
        url: apiBaseUrl + endpoint,
        failOnStatusCode: false
      }).then((response) => {
        cy.log('API Response Status: ' + response.status)
        expect(response.status).to.be.oneOf([200, 201])
      })
    })

    it('uses custom command for API requests', () => {
      // Our custom command uses the environment API base URL
      cy.makeApiRequest('/posts/1').then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('id')
        cy.log('Post title: ' + response.body.title)
      })
    })

    it('creates a resource using environment configuration', () => {
      const newPost = {
        title: 'Test Post from Environment Demo',
        body: 'This post was created using environment variables',
        userId: 1
      }

      cy.makeApiRequest('/posts', 'POST', newPost).then((response) => {
        expect(response.status).to.equal(201)
        expect(response.body.title).to.equal(newPost.title)
        cy.log('Created post with ID: ' + response.body.id)
      })
    })
  })


  /*
   * SECTION 4: Environment Information Logging
   * ------------------------------------------
   * Logging environment info is helpful for debugging
   * and understanding which configuration is active
   */
  describe('Environment Information', () => {

    it('logs current environment configuration', () => {
      cy.logEnvironmentInfo()
      
      // Verify key configurations are set
      const baseUrl = Cypress.config('baseUrl')
      expect(baseUrl).to.not.be.empty
    })

    it('verifies all required environment variables are set', () => {
      const requiredVars = ['username', 'password', 'apiBaseUrl']
      
      requiredVars.forEach((varName) => {
        const value = Cypress.env(varName)
        cy.log('Checking: ' + varName + ' = ' + (value ? 'set' : 'NOT SET'))
        expect(value, varName + ' should be defined').to.not.be.undefined
      })
    })
  })


  /*
   * SECTION 5: Timeouts from Environment
   * ------------------------------------
   * Timeouts can also be configured via environment variables
   * This allows different timeouts for different environments
   */
  describe('Timeout Configuration', () => {

    it('uses timeout values from environment', () => {
      const timeouts = Cypress.env('timeouts')
      cy.log('API Request Timeout: ' + timeouts.apiRequest + 'ms')
      cy.log('Page Load Timeout: ' + timeouts.pageLoad + 'ms')
      
      expect(timeouts.apiRequest).to.be.a('number')
      expect(timeouts.pageLoad).to.be.a('number')
    })

    it('applies environment timeout to API request', () => {
      const timeouts = Cypress.env('timeouts')
      
      cy.request({
        method: 'GET',
        url: Cypress.env('apiBaseUrl') + '/users/1',
        timeout: timeouts.apiRequest
      }).then((response) => {
        expect(response.status).to.equal(200)
        cy.log('Request completed within timeout')
      })
    })
  })
})


/*
 * Configuration Management Demonstration
 * ======================================
 * This section shows how to work with different config files
 */
describe('Configuration Management Best Practices', () => {

  let testData

  before(() => {
    cy.fixture('environmentData').then((data) => {
      testData = data
    })
  })


  /*
   * SECTION 1: Current Configuration
   * --------------------------------
   * Access current configuration values from Cypress.config()
   */
  describe('Accessing Current Configuration', () => {

    it('reads base URL from configuration', () => {
      const baseUrl = Cypress.config('baseUrl')
      cy.log('Current Base URL: ' + baseUrl)
      expect(baseUrl).to.be.a('string')
    })

    it('reads timeout configuration', () => {
      const defaultTimeout = Cypress.config('defaultCommandTimeout')
      const pageLoadTimeout = Cypress.config('pageLoadTimeout')
      
      cy.log('Default Command Timeout: ' + defaultTimeout + 'ms')
      cy.log('Page Load Timeout: ' + pageLoadTimeout + 'ms')
      
      expect(defaultTimeout).to.be.a('number')
    })

    it('reads viewport configuration', () => {
      const width = Cypress.config('viewportWidth')
      const height = Cypress.config('viewportHeight')
      
      cy.log('Viewport: ' + width + 'x' + height)
      expect(width).to.be.greaterThan(0)
      expect(height).to.be.greaterThan(0)
    })
  })


  /*
   * SECTION 2: Environment Specific Behavior
   * ----------------------------------------
   * Tests can behave differently based on environment
   */
  describe('Environment Specific Behavior', () => {

    it('determines current environment', () => {
      const environment = Cypress.env('environment') || 'default'
      cy.log('Running in environment: ' + environment)
      
      // Different assertions per environment
      if (environment === 'production') {
        cy.log('Production checks enabled')
      } else {
        cy.log('Non-production environment')
      }
    })

    it('configures test behavior based on environment', () => {
      const environment = Cypress.env('environment')
      const mockEnabled = Cypress.env('mockEnabled')
      
      cy.log('Environment: ' + environment)
      cy.log('Mocking enabled: ' + mockEnabled)

      // This pattern allows same test to work differently per environment
      if (mockEnabled) {
        cy.log('Using mocked responses')
      } else {
        cy.log('Using real API responses')
      }
    })
  })


  /*
   * SECTION 3: Retries Configuration
   * --------------------------------
   * Retries can be configured per environment
   */
  describe('Retry Configuration', () => {

    it('reads retry configuration', () => {
      const retries = Cypress.config('retries')
      cy.log('Retry configuration: ' + JSON.stringify(retries))
      
      // Retries object contains runMode and openMode
      expect(retries).to.be.an('object')
    })
  })
})


/*
 * Summary: How to Use Environment Files
 * =====================================
 * 
 * 1. cypress.env.json (Sensitive data - gitignore this)
 *    {
 *      "username": "qa_user",
 *      "password": "SecurePass123",
 *      "apiToken": "secret-token"
 *    }
 * 
 * 2. cypress.config.js env section (Non-sensitive defaults)
 *    env: {
 *      environment: 'qa',
 *      apiBaseUrl: 'https://api.qa.example.com'
 *    }
 * 
 * 3. CLI Override (Highest priority)
 *    npx cypress run --env environment=prod,apiBaseUrl=https://api.prod.com
 * 
 * 4. System Environment Variables
 *    export CYPRESS_apiToken=my-token
 *    (Prefix with CYPRESS_ to make available in tests)
 * 
 * Priority Order (highest to lowest):
 *    CLI > cypress.env.json > cypress.config.js env > System Variables
 */
