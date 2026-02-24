/// <reference types="cypress" />

/**
 * ============================================================================
 * CYPRESS LOGIN TEST SUITE - TRAINING DEMONSTRATION
 * ============================================================================
 * 
 * This test suite demonstrates the following Cypress concepts:
 * 
 * 1. HOOKS: before(), beforeEach(), afterEach(), after()
 * 2. BASIC ACTIONS: visit(), get(), type(), click(), clear(), submit()
 * 3. ASSERTIONS: should(), expect(), and()
 * 4. FIXTURES: Loading external test data
 * 5. QUERYING: get(), contains(), find(), first(), last()
 * 6. NAVIGATION: visit(), reload(), go()
 * 7. VIEWPORT: viewport()
 * 8. WAITING: wait()
 * 9. SCREENSHOTS: screenshot()
 * 10. LOGGING: log()
 * 
 * Website used: https://practicetestautomation.com/practice-test-login/
 * ============================================================================
 */

describe('Login Module - Cypress Actions Training', () => {
  
  // Variable to store fixture data loaded from JSON file
  let loginData

  // =========================================================================
  // HOOK: before() - Runs ONCE before ALL tests in this describe block
  // =========================================================================
  // Use case: One-time setup like loading fixtures, setting up test data,
  // or performing actions that should happen only once per test suite
  before(() => {
    cy.log('===== BEFORE HOOK: Suite-level setup starting =====')
    
    /**
     * cy.fixture() - Loads data from a JSON file in cypress/fixtures folder
     * - Returns a Promise, so we use .then() to access the data
     * - Data is stored in a variable for use across all tests
     */
    cy.fixture('loginData').then((data) => {
      loginData = data
      cy.log('Fixture data loaded successfully')
    })

    cy.log('===== BEFORE HOOK: Suite-level setup complete =====')
  })

  // =========================================================================
  // HOOK: beforeEach() - Runs BEFORE EACH test in this describe block
  // =========================================================================
  // Use case: Reset application state, navigate to starting page,
  // clear cookies/storage, or perform setup needed for every test
  beforeEach(() => {
    cy.log('===== BEFORE EACH: Test-level setup starting =====')

    /**
     * cy.viewport() - Sets the browser viewport size
     * - First argument: width in pixels
     * - Second argument: height in pixels
     * - Can also use presets like 'iphone-6', 'macbook-15', etc.
     */
    cy.viewport(1280, 800)

    /**
     * cy.visit() - Navigates to a URL
     * - If baseUrl is set in cypress.config.js, you can use relative paths
     * - Options: timeout, failOnStatusCode, etc.
     * - Using full URL here as login site is different from baseUrl
     */
    cy.visit(loginData.baseUrl + loginData.loginPage.url)

    /**
     * cy.url() - Gets the current URL
     * - Often used with should() for URL assertions
     */
    cy.url().should('include', loginData.loginPage.url)

    /**
     * cy.title() - Gets the document title
     * - Useful for verifying you're on the correct page
     */
    cy.title().should('include', loginData.loginPage.title)

    cy.log('===== BEFORE EACH: Test-level setup complete =====')
  })

  // =========================================================================
  // HOOK: afterEach() - Runs AFTER EACH test in this describe block
  // =========================================================================
  // Use case: Cleanup after each test, capture screenshots on failure,
  // clear cookies/storage, log test completion
  afterEach(() => {
    cy.log('===== AFTER EACH: Test-level cleanup starting =====')

    /**
     * cy.clearCookies() - Clears all browser cookies
     * - Options: { log: false } to suppress command log
     * - Ensures clean state for next test
     */
    cy.clearCookies({ log: false })

    /**
     * cy.clearLocalStorage() - Clears all localStorage data
     * - Important for tests that store authentication tokens
     */
    cy.clearLocalStorage({ log: false })

    cy.log('===== AFTER EACH: Test-level cleanup complete =====')
  })

  // =========================================================================
  // HOOK: after() - Runs ONCE after ALL tests in this describe block
  // =========================================================================
  // Use case: Final cleanup, generate reports, close connections,
  // or perform actions that should happen only once after all tests
  after(() => {
    cy.log('===== AFTER HOOK: Suite-level teardown starting =====')
    cy.log('All login tests completed!')
    cy.log('===== AFTER HOOK: Suite-level teardown complete =====')
  })

  // =========================================================================
  // TEST CASE 1: Successful Login with Valid Credentials
  // =========================================================================
  it('TC001 - Should login successfully with valid credentials', () => {
    cy.log('Starting valid login test...')

    /**
     * cy.get() - Queries DOM elements using CSS selectors
     * - Most common way to select elements
     * - Supports all CSS selectors: #id, .class, [attribute], etc.
     * - Automatically retries until element is found or timeout
     */
    cy.get(loginData.selectors.usernameInput)
      /**
       * .should('be.visible') - Asserts element is visible
       * - Built-in retry mechanism
       * - Waits up to defaultCommandTimeout
       */
      .should('be.visible')
      /**
       * .type() - Types text into an input element
       * - Simulates real keyboard typing
       * - Special characters: {enter}, {backspace}, {del}, {esc}, etc.
       * - Options: { delay: 100 } for slower typing
       */
      .type(loginData.validUser.username)
      /**
       * .should('have.value', 'text') - Asserts input has specific value
       * - Verifies text was typed correctly
       */
      .should('have.value', loginData.validUser.username)

    // Password field - demonstrating chained commands
    cy.get(loginData.selectors.passwordInput)
      .should('be.visible')
      .type(loginData.validUser.password)
      .should('have.value', loginData.validUser.password)

    /**
     * cy.get().click() - Clicks on an element
     * - Automatically scrolls element into view
     * - Options: { force: true } to bypass actionability checks
     * - Options: { multiple: true } to click all matching elements
     */
    cy.get(loginData.selectors.submitButton)
      .should('be.visible')
      .should('be.enabled') // Verify button is not disabled
      .click()

    /**
     * cy.contains() - Finds element by text content
     * - Very useful for finding buttons, links, headings
     * - Can combine with selector: cy.contains('button', 'Submit')
     */
    cy.contains(loginData.validUser.expectedSuccessText)
      .should('be.visible')

    /**
     * cy.screenshot() - Captures a screenshot
     * - Saved to cypress/screenshots folder
     * - Useful for documentation and debugging
     */
    cy.screenshot('TC001-successful-login')

    cy.log('Valid login test completed successfully!')
  })

  // =========================================================================
  // TEST CASE 2: Failed Login with Invalid Username
  // =========================================================================
  it('TC002 - Should display error for invalid username', () => {
    cy.log('Starting invalid username test...')

    /**
     * Demonstrating clear() before type()
     * .clear() - Clears the content of an input field
     * - Useful when input might have pre-filled values
     */
    cy.get(loginData.selectors.usernameInput)
      .clear() // Clear any existing content
      .type(loginData.invalidUser.username)

    cy.get(loginData.selectors.passwordInput)
      .clear()
      .type(loginData.invalidUser.password)

    cy.get(loginData.selectors.submitButton).click()

    /**
     * Error message validation
     * .should('contain', 'text') - Asserts element contains text
     * - Partial text match (doesn't need exact match)
     */
    cy.get(loginData.selectors.errorMessage)
      .should('be.visible')
      .and('contain', loginData.invalidUser.expectedErrorText)

    /**
     * .and() - Chains multiple assertions
     * - Equivalent to calling .should() again
     * - Makes assertions more readable
     */
    cy.get(loginData.selectors.errorMessage)
      .should('be.visible')
      .and('have.css', 'color') // Check CSS property exists

    cy.screenshot('TC002-invalid-username-error')
    cy.log('Invalid username test completed!')
  })

  // =========================================================================
  // TEST CASE 3: Failed Login with Invalid Password
  // =========================================================================
  it('TC003 - Should display error for invalid password', () => {
    cy.log('Starting invalid password test...')

    cy.get(loginData.selectors.usernameInput)
      .type(loginData.invalidPassword.username)

    cy.get(loginData.selectors.passwordInput)
      .type(loginData.invalidPassword.password)

    cy.get(loginData.selectors.submitButton).click()

    cy.get(loginData.selectors.errorMessage)
      .should('be.visible')
      .should('contain', loginData.invalidPassword.expectedErrorText)

    cy.screenshot('TC003-invalid-password-error')
    cy.log('Invalid password test completed!')
  })

  // =========================================================================
  // TEST CASE 4: Empty Credentials Validation
  // =========================================================================
  it('TC004 - Should validate empty credentials', () => {
    cy.log('Starting empty credentials test...')

    /**
     * Clicking submit without entering any credentials
     * Testing form validation
     */
    cy.get(loginData.selectors.submitButton)
      .should('be.visible')
      .click()

    /**
     * cy.wait() - Waits for specified time or alias
     * - Time: cy.wait(1000) waits 1 second
     * - Alias: cy.wait('@apiCall') waits for network request
     * - Use sparingly; prefer assertions that auto-retry
     */
    cy.wait(500) // Small wait for error to appear

    cy.get(loginData.selectors.errorMessage)
      .should('be.visible')

    cy.screenshot('TC004-empty-credentials-error')
    cy.log('Empty credentials test completed!')
  })

  // =========================================================================
  // TEST CASE 5: Demonstrating Additional Cypress Commands
  // =========================================================================
  it('TC005 - Should demonstrate additional Cypress commands', () => {
    cy.log('Starting additional commands demonstration...')

    /**
     * cy.focused() - Gets the currently focused DOM element
     * Useful for testing tab navigation and focus management
     */
    cy.get(loginData.selectors.usernameInput).focus()
    cy.focused().should('have.attr', 'id', 'username')

    /**
     * .blur() - Removes focus from the element
     * Triggers blur events on the element
     */
    cy.get(loginData.selectors.usernameInput)
      .type('testuser')
      .blur()

    /**
     * cy.get().invoke() - Invokes a function on the element
     * Useful for getting/setting properties
     */
    cy.get(loginData.selectors.usernameInput)
      .invoke('val')
      .then((value) => {
        cy.log(`Current input value: ${value}`)
        expect(value).to.equal('testuser')
      })

    /**
     * .then() - Allows you to work with yielded subject
     * - Useful for complex logic and assertions
     * - Access to jQuery element with $el
     */
    cy.get(loginData.selectors.usernameInput).then(($input) => {
      // $input is a jQuery object
      const inputId = $input.attr('id')
      const inputType = $input.attr('type')
      cy.log(`Input ID: ${inputId}, Type: ${inputType}`)
      
      expect(inputId).to.equal('username')
    })

    /**
     * .its() - Gets a property from the subject
     * Useful for accessing properties of objects
     */
    cy.get(loginData.selectors.usernameInput)
      .its('0') // Get the raw DOM element (first item)
      .its('id')
      .should('equal', 'username')

    /**
     * cy.wrap() - Wraps an object to use Cypress commands
     * Useful when working with plain objects or values
     */
    const user = { name: 'Test User', role: 'Admin' }
    cy.wrap(user)
      .its('name')
      .should('equal', 'Test User')

    cy.log('Additional commands demonstration completed!')
  })

  // =========================================================================
  // TEST CASE 6: Keyboard Navigation and Special Keys
  // =========================================================================
  it('TC006 - Should demonstrate keyboard navigation and special keys', () => {
    cy.log('Starting keyboard navigation test...')

    /**
     * Special keys in type():
     * {enter} - Press Enter key
     * {backspace} - Press Backspace
     * {del} - Press Delete
     * {esc} - Press Escape
     * {selectall} - Select all text
     * {movetostart} - Move cursor to start
     * {movetoend} - Move cursor to end
     * 
     * Note: {tab} is NOT supported in cy.type()
     * For tab navigation, use cy.focus() on the next element
     */

    // Demonstrate {selectall} and {backspace}
    cy.get(loginData.selectors.usernameInput)
      .type('wrongtext')
      .type('{selectall}') // Select all text
      .type('{backspace}') // Delete selected text
      .should('have.value', '') // Field should be empty

    // Now type correct username
    cy.get(loginData.selectors.usernameInput)
      .type(loginData.validUser.username)

    // Focus on password field (simulating tab navigation)
    cy.get(loginData.selectors.passwordInput).focus()

    // Verify password field is now focused
    cy.focused()
      .should('have.attr', 'id', 'password')

    // Type password
    cy.get(loginData.selectors.passwordInput)
      .type(loginData.validUser.password)

    // Click submit button (more reliable than {enter})
    cy.get(loginData.selectors.submitButton).click()

    // Verify successful login
    cy.contains(loginData.validUser.expectedSuccessText)
      .should('be.visible')

    cy.log('Keyboard navigation test completed!')
  })

  // =========================================================================
  // TEST CASE 7: Page Reload and Navigation
  // =========================================================================
  it('TC007 - Should demonstrate page reload and navigation', () => {
    cy.log('Starting page reload test...')

    // Fill in credentials
    cy.get(loginData.selectors.usernameInput).type('testuser')
    cy.get(loginData.selectors.passwordInput).type('testpass')

    /**
     * cy.reload() - Reloads the page
     * - Options: cy.reload(true) for hard reload (clear cache)
     */
    cy.reload()

    // After reload, inputs should be cleared (depends on browser)
    cy.get(loginData.selectors.usernameInput).should('be.visible')

    /**
     * cy.go() - Navigate forward or back in browser history
     * - cy.go('back') or cy.go(-1) - Go back
     * - cy.go('forward') or cy.go(1) - Go forward
     */
    // Navigate to home page first (using full URL)
    cy.visit(loginData.baseUrl)
    // Go back to login page
    cy.go('back')
    cy.url().should('include', loginData.loginPage.url)

    cy.log('Page reload test completed!')
  })

  // =========================================================================
  // TEST CASE 8: Different Viewport Sizes (Responsive Testing)
  // =========================================================================
  it('TC008 - Should work on different viewport sizes', () => {
    cy.log('Starting responsive testing...')

    /**
     * cy.viewport() - Change viewport dimensions
     * Presets: 'iphone-6', 'iphone-x', 'ipad-2', 'macbook-15', etc.
     * Custom: cy.viewport(width, height)
     */

    // Test on mobile viewport
    cy.viewport('iphone-6')
    cy.get(loginData.selectors.usernameInput).should('be.visible')
    cy.screenshot('TC008-mobile-view')

    // Test on tablet viewport
    cy.viewport('ipad-2')
    cy.get(loginData.selectors.usernameInput).should('be.visible')
    cy.screenshot('TC008-tablet-view')

    // Test on desktop viewport
    cy.viewport(1920, 1080)
    cy.get(loginData.selectors.usernameInput).should('be.visible')
    cy.screenshot('TC008-desktop-view')

    cy.log('Responsive testing completed!')
  })

})

/**
 * ============================================================================
 * SUMMARY OF CYPRESS COMMANDS DEMONSTRATED
 * ============================================================================
 * 
 * NAVIGATION:
 * - cy.visit()    : Navigate to URL
 * - cy.reload()   : Reload page
 * - cy.go()       : Navigate browser history
 * 
 * QUERYING:
 * - cy.get()      : Select by CSS selector
 * - cy.contains() : Select by text content
 * - cy.focused()  : Get focused element
 * 
 * ACTIONS:
 * - .type()       : Type into input
 * - .clear()      : Clear input
 * - .click()      : Click element
 * - .focus()      : Focus element
 * - .blur()       : Remove focus
 * 
 * ASSERTIONS:
 * - .should()     : Make assertion
 * - .and()        : Chain assertions
 * - expect()      : BDD assertion
 * 
 * UTILITIES:
 * - cy.wait()     : Wait for time/alias
 * - cy.log()      : Log message
 * - cy.screenshot(): Take screenshot
 * - cy.viewport() : Set viewport size
 * - cy.wrap()     : Wrap object
 * 
 * DATA ACCESS:
 * - cy.fixture()  : Load fixture data
 * - .then()       : Access yielded subject
 * - .its()        : Get property
 * - .invoke()     : Invoke function
 * 
 * ============================================================================
 */
