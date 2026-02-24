/**
 * ============================================================================
 * HANDLING WAITS AND TIMEOUTS IN CYPRESS - Training Examples
 * ============================================================================
 * 
 * This file demonstrates comprehensive wait and timeout handling in Cypress.
 * 
 * 📚 TOPICS COVERED:
 * -----------------
 * 1. IMPLICIT WAITS (Cypress Automatic Retry)
 *    - Built-in retry mechanism
 *    - How Cypress automatically waits for elements
 *    - Actionability checks
 * 
 * 2. EXPLICIT WAITS (cy.wait())
 *    - Fixed time waits
 *    - Waiting for aliases (network requests)
 *    - Waiting for multiple requests
 * 
 * 3. CUSTOM TIMEOUTS (timeout option)
 *    - Command-level timeouts
 *    - Global timeout configuration
 *    - Different timeout types
 * 
 * 🔑 KEY CONCEPT:
 * ---------------
 * Cypress is ASYNCHRONOUS by nature. Unlike Selenium, Cypress has built-in
 * waiting mechanisms, so you rarely need explicit waits!
 * 
 * ============================================================================
 */

describe('Handling Waits and Timeouts in Cypress', () => {

  // Load fixture data before tests
  let waitData

  before(() => {
    /**
     * 📦 LOADING FIXTURE DATA
     * Using fixture to externalize timeout and wait configuration
     * This makes it easy to adjust values without changing test code
     */
    cy.fixture('waitTimeoutData').then((data) => {
      waitData = data
    })
  })

  // ============================================================================
  // SECTION 1: IMPLICIT WAITS (Cypress Automatic Retry)
  // ============================================================================

  describe('1. IMPLICIT WAITS - Cypress Automatic Retry', () => {
    /**
     * 🔄 WHAT ARE IMPLICIT WAITS?
     * ---------------------------
     * Implicit waits are Cypress's BUILT-IN waiting mechanism.
     * Cypress automatically retries commands until:
     *   - The assertion passes, OR
     *   - The timeout is reached (default: 4 seconds)
     * 
     * ✅ ADVANTAGES:
     * - No need for explicit sleep/wait commands
     * - Tests are faster (only waits as long as needed)
     * - More reliable than fixed waits
     * 
     * 🎯 CYPRESS AUTOMATICALLY WAITS FOR:
     * - Elements to exist in DOM
     * - Elements to be visible
     * - Elements to be enabled
     * - Elements to stop being animated
     * - Elements to not be covered
     */

    beforeEach(() => {
      cy.visit('https://example.cypress.io/commands/querying')
    })

    it('TC1: Automatic Retry - Element Existence', () => {
      /**
       * 🔍 AUTOMATIC RETRY FOR ELEMENT EXISTENCE
       * ----------------------------------------
       * cy.get() automatically retries until element is found
       * Default timeout: 4000ms (4 seconds)
       * 
       * Cypress will:
       * 1. Query the DOM for the element
       * 2. If not found, wait and retry
       * 3. Continue until found or timeout
       */

      // Cypress automatically waits for element to exist
      cy.get('#query-btn')
        .should('exist')
      cy.log('✓ Element found - Cypress auto-waited if needed')

      // Even with chained commands, Cypress waits appropriately
      cy.get('#query-btn')
        .should('be.visible')
        .and('contain', 'Button')
      cy.log('✓ Chained assertions - each waits for condition')
    })

    it('TC2: Automatic Retry - Visibility Check', () => {
      /**
       * 👁️ AUTOMATIC RETRY FOR VISIBILITY
       * ----------------------------------
       * .should('be.visible') retries until element is visible
       * 
       * VISIBILITY means:
       * - Element has width and height > 0
       * - Element is not hidden (display: none, visibility: hidden)
       * - Element is not off-screen
       */

      cy.get('.query-list')
        .should('be.visible')
      cy.log('✓ Visibility check passed - auto-retry if needed')

      // Check multiple visibility conditions
      cy.get('.query-list li')
        .should('be.visible')
        .and('have.length.gt', 0)
      cy.log('✓ Multiple conditions - Cypress retries all')
    })

    it('TC3: Automatic Retry - Actionability', () => {
      /**
       * ⚡ ACTIONABILITY CHECKS (Automatic)
       * -----------------------------------
       * Before performing actions, Cypress automatically waits for:
       * 
       * 1. NOT DISABLED - Element must not have disabled attribute
       * 2. NOT ANIMATING - Element must be stable (no CSS animations)
       * 3. NOT COVERED - Element must not be covered by another element
       * 4. SCROLLED INTO VIEW - Element must be in viewport
       * 
       * These are AUTOMATIC - no explicit waits needed!
       */

      // Click automatically waits for actionability
      cy.get('#query-btn')
        .click()
      cy.log('✓ Click performed - Cypress waited for actionability')

      // Type also waits for actionability
      cy.get('input[placeholder="Name"]')
        .type('Cypress Training')
      cy.log('✓ Type performed - element was enabled and visible')
    })

    it('TC4: Automatic Retry - Assertion Retry', () => {
      /**
       * 🔁 ASSERTION RETRY MECHANISM
       * ----------------------------
       * .should() assertions automatically retry until:
       * - Assertion passes, OR
       * - Timeout is reached
       * 
       * This is DIFFERENT from other testing frameworks where
       * assertions fail immediately if condition is not met!
       */

      // This assertion will retry until text contains expected value
      cy.get('#query-btn')
        .should('contain', 'Button')
      cy.log('✓ Text assertion passed with auto-retry')

      // Multiple assertions - Cypress retries the entire chain
      cy.get('.query-list')
        .should('be.visible')
        .and('contain', 'oranges')
        .and('contain', 'bananas')
      cy.log('✓ Multiple assertions retried together')
    })

    it('TC5: Automatic Retry - DOM Changes', () => {
      /**
       * 🔄 HANDLING DYNAMIC DOM CHANGES
       * -------------------------------
       * Cypress automatically handles:
       * - Elements added to DOM after page load
       * - Elements that change state (enabled/disabled)
       * - Elements that become visible after animation
       * 
       * The retry mechanism keeps querying until condition is met
       */

      // Even if element state changes, Cypress handles it
      cy.get('#query-btn')
        .should('not.be.disabled')
      cy.log('✓ State check - auto-retry for dynamic changes')

      // Works with any CSS selector
      cy.get('button#query-btn')
        .should('exist')
      cy.log('✓ Different selector format - same auto-retry behavior')
    })
  })

  // ============================================================================
  // SECTION 2: EXPLICIT WAITS (cy.wait())
  // ============================================================================

  describe('2. EXPLICIT WAITS - cy.wait() Method', () => {
    /**
     * ⏱️ WHAT ARE EXPLICIT WAITS?
     * ---------------------------
     * Explicit waits are when YOU tell Cypress to wait for:
     * - A specific amount of time (fixed wait)
     * - A network request to complete (aliased wait)
     * 
     * ⚠️ IMPORTANT:
     * - Use cy.wait() SPARINGLY
     * - Prefer implicit waits when possible
     * - Always prefer waiting for aliases over fixed time
     */

    beforeEach(() => {
      cy.visit('https://example.cypress.io')
    })

    it('TC6: Fixed Time Wait - cy.wait(ms)', function() {
      /**
       * ⏰ FIXED TIME WAIT
       * ------------------
       * cy.wait(milliseconds) - Pauses execution for specified time
       * 
       * ⚠️ ANTI-PATTERN WARNING:
       * Fixed waits are generally NOT recommended because:
       * - They slow down tests unnecessarily
       * - They're flaky (might not wait long enough on slow systems)
       * - They don't adapt to actual conditions
       * 
       * ✅ USE ONLY WHEN:
       * - Testing time-based functionality (animations, timers)
       * - Debugging to see test state
       * - No better alternative exists
       */

      cy.log('Starting fixed wait demonstration...')
      
      // Using fixture data for wait time
      cy.wait(waitData.waitTimes.short) // 500ms
      cy.log(`✓ Waited ${waitData.waitTimes.short}ms (short wait)`)

      cy.wait(waitData.waitTimes.medium) // 1000ms  
      cy.log(`✓ Waited ${waitData.waitTimes.medium}ms (medium wait)`)

      // Verify page is still accessible after waits
      cy.get('h1').should('be.visible')
      cy.log('✓ Page still accessible after explicit waits')
    })

    it('TC7: Wait for Network Request - Aliased cy.wait(@alias)', () => {
      /**
       * 🌐 WAITING FOR NETWORK REQUESTS (RECOMMENDED)
       * ---------------------------------------------
       * This is the BEST way to use cy.wait()!
       * 
       * Steps:
       * 1. Intercept the network request with cy.intercept()
       * 2. Give it an alias with .as('aliasName')
       * 3. Trigger the action that makes the request
       * 4. Wait for the request with cy.wait('@aliasName')
       * 
       * ✅ ADVANTAGES:
       * - Waits only as long as needed
       * - Can inspect request/response data
       * - Much more reliable than fixed waits
       */

      // Step 1 & 2: Intercept and alias the request
      cy.intercept('GET', '**/comments/*').as('getComments')
      cy.log('✓ Network request intercepted and aliased')

      // Navigate to network examples page
      cy.visit('https://example.cypress.io/commands/network-requests')
      
      // Step 3: Trigger the request
      cy.get('.network-btn').click()
      
      // Step 4: Wait for the aliased request
      cy.wait('@getComments').then((interception) => {
        /**
         * 📦 INTERCEPTION OBJECT
         * ----------------------
         * The interception object contains:
         * - request: The request object
         * - response: The response object
         * - state: 'Complete', 'Pending', etc.
         */
        cy.log('✓ Network request completed')
        cy.log(`Response Status: ${interception.response.statusCode}`)
      })
    })

    it('TC8: Wait for Multiple Network Requests', () => {
      /**
       * 🌐🌐 WAITING FOR MULTIPLE REQUESTS
       * ----------------------------------
       * You can wait for multiple requests:
       * - Sequentially: cy.wait('@alias1').wait('@alias2')
       * - Array format: cy.wait(['@alias1', '@alias2'])
       * 
       * Useful when page makes multiple API calls on load
       */

      // Intercept multiple API calls
      cy.intercept('GET', '**/posts').as('getPosts')
      cy.intercept('GET', '**/comments/*').as('getComment')

      cy.visit('https://example.cypress.io/commands/network-requests')

      // Click button that triggers request
      cy.get('.network-btn').click()

      // Wait for the comment request
      cy.wait('@getComment').its('response.statusCode').should('eq', 200)
      cy.log('✓ Comment request completed successfully')
    })

    it('TC9: Wait with Timeout for Network Request', () => {
      /**
       * ⏱️ TIMEOUT FOR NETWORK WAITS
       * ----------------------------
       * You can specify a custom timeout for network waits:
       * cy.wait('@alias', { timeout: 30000 })
       * 
       * Useful for slow API endpoints
       */

      cy.intercept('GET', '**/comments/*').as('getComments')

      cy.visit('https://example.cypress.io/commands/network-requests')

      cy.get('.network-btn').click()

      // Wait with custom timeout (from fixture)
      cy.wait('@getComments', { timeout: waitData.timeoutValues.ajax })
        .its('response.statusCode')
        .should('eq', 200)
      cy.log(`✓ Request completed within ${waitData.timeoutValues.ajax}ms timeout`)
    })

    it('TC10: Wait and Validate Request/Response Data', () => {
      /**
       * 🔍 VALIDATING REQUEST/RESPONSE IN WAIT
       * --------------------------------------
       * After cy.wait(), you can validate:
       * - Request method, headers, body
       * - Response status, headers, body
       * 
       * This is powerful for API testing!
       */

      cy.intercept('GET', '**/comments/*').as('getComments')

      cy.visit('https://example.cypress.io/commands/network-requests')
      cy.get('.network-btn').click()

      cy.wait('@getComments').then((interception) => {
        // Validate request
        expect(interception.request.method).to.equal('GET')
        cy.log('✓ Request method validated: GET')

        // Validate response
        expect(interception.response.statusCode).to.equal(200)
        cy.log('✓ Response status validated: 200')

        // Validate response body exists
        expect(interception.response.body).to.exist
        cy.log('✓ Response body exists')
      })
    })
  })

  // ============================================================================
  // SECTION 3: CUSTOM TIMEOUTS (timeout option)
  // ============================================================================

  describe('3. CUSTOM TIMEOUTS - Timeout Configuration', () => {
    /**
     * ⚙️ TIMEOUT CONFIGURATION
     * ------------------------
     * Cypress has several timeout settings:
     * 
     * 1. defaultCommandTimeout (4000ms)
     *    - For DOM-based commands: cy.get(), cy.find(), etc.
     *    - For assertions
     * 
     * 2. pageLoadTimeout (60000ms)
     *    - For cy.visit()
     *    - For page transitions
     * 
     * 3. requestTimeout (5000ms)
     *    - For cy.request() commands
     *    - For the request phase of cy.wait()
     * 
     * 4. responseTimeout (30000ms)
     *    - For the response phase of cy.wait()
     *    - For network responses
     * 
     * You can override these at:
     * - Global level (cypress.config.js)
     * - Command level (timeout option)
     */

    beforeEach(() => {
      cy.visit('https://example.cypress.io/commands/querying')
    })

    it('TC11: Command-Level Timeout Override', function() {
      /**
       * 📝 COMMAND-LEVEL TIMEOUT
       * ------------------------
       * Override timeout for a single command:
       * cy.get('selector', { timeout: 10000 })
       * 
       * This is useful when you know:
       * - An element takes longer to appear
       * - A specific action is slow
       */

      // Default timeout (4000ms) - element exists quickly
      cy.get('#query-btn')
        .should('exist')
      cy.log('✓ Element found with default timeout')

      // Extended timeout from fixture data
      cy.get('#query-btn', { timeout: waitData.timeoutValues.extended })
        .should('be.visible')
      cy.log(`✓ Element found with ${waitData.timeoutValues.extended}ms timeout`)

      // Short timeout - element should be found quickly anyway
      cy.get('#query-btn', { timeout: waitData.timeoutValues.short })
        .should('exist')
      cy.log(`✓ Element found within ${waitData.timeoutValues.short}ms`)
    })

    it('TC12: Timeout on Assertions', () => {
      /**
       * ⏱️ ASSERTION TIMEOUT
       * --------------------
       * Timeout can also be applied to assertions:
       * .should('condition', { timeout: 10000 })
       * 
       * Cypress will retry the assertion until:
       * - Assertion passes, OR
       * - Timeout is reached
       */

      // Assertion with extended timeout
      cy.get('#query-btn')
        .should('be.visible', { timeout: 10000 })
      cy.log('✓ Visibility assertion with 10s timeout')

      // Multiple assertions with timeout on first
      cy.get('.query-list')
        .should('exist', { timeout: 5000 })
        .and('be.visible')
      cy.log('✓ Chained assertions - timeout applies to chain')
    })

    it('TC13: Visit with Page Load Timeout', () => {
      /**
       * 🌐 PAGE LOAD TIMEOUT
       * --------------------
       * cy.visit() has its own timeout for page load:
       * cy.visit(url, { timeout: 30000 })
       * 
       * Default pageLoadTimeout: 60000ms (60 seconds)
       */

      // Visit with custom page load timeout
      cy.visit('https://example.cypress.io', { timeout: 30000 })
      cy.log('✓ Page loaded within 30 second timeout')

      // Verify page content
      cy.get('h1').should('be.visible')
      cy.log('✓ Page content verified')
    })

    it('TC14: Input Actions with Timeout', () => {
      /**
       * ⌨️ ACTION TIMEOUTS
       * ------------------
       * Actions like .type(), .click() can also have timeouts:
       * .type('text', { timeout: 5000 })
       * .click({ timeout: 5000 })
       */

      // Type with custom timeout
      cy.get('input[placeholder="Name"]')
        .type('Cypress Training', { timeout: 5000 })
      cy.log('✓ Typed with 5s timeout')

      // Click with custom timeout
      cy.get('#query-btn')
        .click({ timeout: 5000 })
      cy.log('✓ Clicked with 5s timeout')
    })

    it('TC15: Understanding Timeout vs Retry', () => {
      /**
       * 🔄 TIMEOUT vs RETRY - Key Difference
       * ------------------------------------
       * 
       * TIMEOUT:
       * - Maximum time Cypress will wait
       * - After timeout, test FAILS
       * - Example: { timeout: 10000 }
       * 
       * RETRY:
       * - Cypress keeps trying the command
       * - Happens WITHIN the timeout period
       * - Automatic for most commands
       * 
       * 📊 VISUALIZATION:
       * 
       * |-------- timeout (10s) --------|
       * [try][try][try][try][SUCCESS]
       *      ^--- retries happen within timeout
       */

      // This demonstrates retry within timeout
      cy.get('#query-btn', { timeout: 10000 })
        .should('be.visible')              // Retry until visible
        .and('not.be.disabled')            // Also retry this
        .and('contain', 'Button')          // And this
      cy.log('✓ All assertions passed within 10s timeout')

      // Log explanation
      cy.log('NOTE: Cypress retried each assertion until pass or timeout')
    })
  })

  // ============================================================================
  // SECTION 4: BEST PRACTICES AND PATTERNS
  // ============================================================================

  describe('4. BEST PRACTICES - Wait and Timeout Patterns', () => {
    /**
     * 📚 BEST PRACTICES SUMMARY
     * -------------------------
     * 1. PREFER implicit waits (let Cypress auto-retry)
     * 2. USE cy.wait('@alias') for network requests
     * 3. AVOID cy.wait(time) fixed waits when possible
     * 4. SET reasonable timeouts, not excessive ones
     * 5. CONFIGURE global timeouts in cypress.config.js
     */

    beforeEach(() => {
      cy.visit('https://example.cypress.io/commands/querying')
    })

    it('TC16: GOOD - Using Implicit Waits', () => {
      /**
       * ✅ GOOD PATTERN: Implicit Waits
       * -------------------------------
       * Let Cypress handle waiting automatically
       */

      // GOOD: Cypress waits automatically
      cy.get('#query-btn').should('be.visible')
      cy.log('✅ GOOD: Let Cypress handle waiting')

      // GOOD: Chain assertions - Cypress retries
      cy.get('.query-list')
        .should('be.visible')
        .and('contain', 'oranges')
      cy.log('✅ GOOD: Chained assertions with auto-retry')
    })

    it('TC17: GOOD - Waiting for Network with Alias', () => {
      /**
       * ✅ GOOD PATTERN: Wait for Network Requests
       * ------------------------------------------
       * Intercept + Alias + Wait is the recommended approach
       */

      cy.intercept('GET', '**/comments/*').as('apiCall')
      cy.visit('https://example.cypress.io/commands/network-requests')
      
      cy.get('.network-btn').click()
      
      // GOOD: Wait for specific request
      cy.wait('@apiCall')
      cy.log('✅ GOOD: Wait for aliased network request')
    })

    it('TC18: AVOID - Fixed Time Waits (Anti-Pattern)', () => {
      /**
       * ⚠️ ANTI-PATTERN: Fixed Time Waits
       * ----------------------------------
       * cy.wait(5000) should be avoided when possible
       * 
       * Problems:
       * - Tests are slower than necessary
       * - Flaky on slow systems (might not be enough)
       * - Wastes time on fast systems
       */

      // ❌ AVOID: This is NOT recommended (but shown for education)
      // cy.wait(5000) // Don't do this!
      
      // ✅ BETTER: Use assertions that retry
      cy.get('#query-btn')
        .should('be.visible')
        .should('not.be.disabled')
      cy.log('✅ BETTER: Use assertions instead of fixed waits')
    })

    it('TC19: Pattern - Conditional Waiting', () => {
      /**
       * 🔀 CONDITIONAL WAITING PATTERN
       * ------------------------------
       * Sometimes you need to wait for a condition
       * Use .should() with a callback for complex conditions
       */

      // Wait until element meets complex condition
      cy.get('#query-btn').should(($btn) => {
        // Custom condition check
        expect($btn).to.be.visible
        expect($btn).to.not.be.disabled
        expect($btn.text()).to.include('Button')
      })
      cy.log('✅ Complex condition met with retry')
    })

    it('TC20: Pattern - Retry-ability Check', () => {
      /**
       * 🔁 UNDERSTANDING RETRY-ABILITY
       * ------------------------------
       * Not all commands are retryable!
       * 
       * RETRYABLE:
       * - cy.get(), cy.find(), cy.contains()
       * - .should(), .and()
       * 
       * NOT RETRYABLE:
       * - .click(), .type(), .then()
       * - Once executed, they don't retry
       * 
       * ⚠️ PUT assertions BEFORE non-retryable commands
       */

      // GOOD: Assertions before action
      cy.get('#query-btn')
        .should('be.visible')        // Retries
        .should('not.be.disabled')   // Retries
        .click()                     // Does NOT retry
      cy.log('✅ Assertions before non-retryable action')

      // Verify in .then() - not retryable
      cy.get('.query-list').then(($el) => {
        // Inside .then() - no retry
        expect($el).to.be.visible
        cy.log('Note: .then() callback does not retry')
      })
    })
  })

  // ============================================================================
  // SECTION 5: REAL-WORLD SCENARIOS
  // ============================================================================

  describe('5. REAL-WORLD SCENARIOS', () => {

    it('TC21: Scenario - Loading Spinner Wait', () => {
      /**
       * 🔄 WAITING FOR LOADING SPINNER TO DISAPPEAR
       * -------------------------------------------
       * Common pattern: Wait for loading indicator to disappear
       * before interacting with content
       */

      cy.visit('https://example.cypress.io/commands/querying')

      // If there was a spinner, you'd wait for it to not exist
      // cy.get('.loading-spinner').should('not.exist')
      
      // Then proceed with assertions
      cy.get('#query-btn').should('be.visible')
      cy.log('✅ Scenario: Wait for loading to complete')
    })

    it('TC22: Scenario - Dynamic Content Load', () => {
      /**
       * ⏳ WAITING FOR DYNAMIC CONTENT
       * ------------------------------
       * Content loaded via AJAX/JavaScript after page load
       */

      cy.visit('https://example.cypress.io/commands/querying')

      // Cypress automatically retries until content appears
      cy.get('#query-btn')
        .should('exist')
        .should('be.visible')
      cy.log('✅ Scenario: Dynamic content loaded and verified')
    })

    it('TC23: Scenario - Form Submission Wait', () => {
      /**
       * 📝 WAITING FOR FORM SUBMISSION RESPONSE
       * ---------------------------------------
       * After form submission, wait for:
       * - Network request to complete
       * - Success/error message to appear
       */

      cy.intercept('GET', '**/comments/*').as('formSubmit')
      cy.visit('https://example.cypress.io/commands/network-requests')

      // Simulate form action
      cy.get('.network-btn').click()

      // Wait for submission and check result
      cy.wait('@formSubmit')
        .its('response.statusCode')
        .should('be.oneOf', [200, 201])
      cy.log('✅ Scenario: Form submission completed and validated')
    })
  })
})

/**
 * ============================================================================
 * 📋 SUMMARY - HANDLING WAITS AND TIMEOUTS
 * ============================================================================
 * 
 * 1. IMPLICIT WAITS (Cypress Automatic Retry):
 *    - Built-in to Cypress
 *    - cy.get() and .should() automatically retry
 *    - Default timeout: 4 seconds
 *    - RECOMMENDED approach
 * 
 * 2. EXPLICIT WAITS (cy.wait()):
 *    - cy.wait(ms) - Fixed time wait (avoid when possible)
 *    - cy.wait('@alias') - Wait for network request (recommended)
 *    - cy.wait(['@a', '@b']) - Wait for multiple requests
 * 
 * 3. CUSTOM TIMEOUTS:
 *    - Command level: cy.get('el', { timeout: 10000 })
 *    - Visit: cy.visit(url, { timeout: 30000 })
 *    - Global: cypress.config.js settings
 * 
 * 🎯 GOLDEN RULES:
 * ---------------
 * ✅ DO: Let Cypress auto-wait with assertions
 * ✅ DO: Use cy.intercept() + cy.wait('@alias') for API calls
 * ✅ DO: Set reasonable timeouts for slow operations
 * ❌ DON'T: Use cy.wait(5000) fixed waits as first choice
 * ❌ DON'T: Set excessively long timeouts (slows tests)
 * 
 * ============================================================================
 */
