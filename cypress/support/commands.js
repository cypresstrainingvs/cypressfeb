/**
 * ============================================================================
 * CYPRESS CUSTOM COMMANDS - Training Examples
 * ============================================================================
 * 
 * Custom commands extend Cypress functionality by allowing you to create
 * reusable, chainable commands that can be used across all your tests.
 * 
 * 📚 BENEFITS OF CUSTOM COMMANDS:
 * --------------------------------
 * 1. PROMOTE REUSABLE AND MODULAR CODE
 *    - Define common actions once, use everywhere
 *    - Eliminate code duplication
 * 
 * 2. IMPROVE TEST READABILITY
 *    - Clean, expressive test steps like cy.login('admin')
 *    - Anyone can understand what the step represents
 * 
 * 3. REDUCE REDUNDANCY AND SIMPLIFY MAINTENANCE
 *    - Update logic in ONE place when UI changes
 *    - All tests automatically get updated
 * 
 * 4. ENFORCE BEST PRACTICES AND STANDARDS
 *    - Consistent naming conventions
 *    - Standardized selector usage
 *    - Error handling rules
 * 
 * 🔧 TYPES OF CUSTOM COMMANDS:
 * ----------------------------
 * - PARENT COMMANDS: Start a new chain (like cy.visit())
 * - CHILD COMMANDS: Chain off a previous command (like .click())
 * - DUAL COMMANDS: Can start or chain (like .contains())
 * 
 * ============================================================================
 */

// ============================================================================
// SECTION 1: PARENT COMMANDS (Start a new chain)
// ============================================================================

/**
 * 🔐 LOGIN COMMAND - Reusable Authentication
 * ------------------------------------------
 * BENEFIT 1: PROMOTE REUSABLE AND MODULAR CODE
 * 
 * Instead of writing login steps in every test:
 *   cy.visit('/login')
 *   cy.get('#username').type('user')
 *   cy.get('#password').type('pass')
 *   cy.get('#submit').click()
 * 
 * You simply write:
 *   cy.login('admin')
 * 
 * @param {string} userType - Type of user ('admin', 'standard', 'invalid')
 * @example cy.login('admin')
 */
Cypress.Commands.add('login', (userType = 'standard') => {
  // Load credentials from fixture - BEST PRACTICE: Never hardcode credentials
  cy.fixture('customCommandData').then((data) => {
    const user = data.users[userType]
    const selectors = data.loginPage.selectors

    // Validate user exists - BEST PRACTICE: Error handling
    if (!user) {
      throw new Error(`User type "${userType}" not found in fixture data`)
    }

    cy.log(`🔐 Logging in as: ${userType} (${user.username})`)

    // Visit login page
    cy.visit(data.loginPage.url)

    // Perform login actions
    cy.get(selectors.usernameInput)
      .should('be.visible')
      .clear()
      .type(user.username)

    cy.get(selectors.passwordInput)
      .should('be.visible')
      .clear()
      .type(user.password, { log: false }) // Don't log password - SECURITY

    cy.get(selectors.submitButton)
      .should('be.visible')
      .and('not.be.disabled')
      .click()

    // Return user data for chaining
    cy.wrap(user).as('currentUser')
  })
})

/**
 * ✅ VERIFY LOGIN SUCCESS - Validates successful login
 * ----------------------------------------------------
 * BENEFIT 2: IMPROVE TEST READABILITY
 * 
 * Clear, descriptive command name tells exactly what's being verified
 * 
 * @example cy.verifyLoginSuccess()
 */
Cypress.Commands.add('verifyLoginSuccess', () => {
  cy.fixture('customCommandData').then((data) => {
    const selectors = data.loginPage.selectors

    cy.log('✅ Verifying successful login')

    // Verify success message
    cy.get(selectors.successMessage)
      .should('be.visible')
      .and('contain', 'Logged In Successfully')

    // Verify URL changed
    cy.url().should('include', 'logged-in-successfully')
  })
})

/**
 * ❌ VERIFY LOGIN ERROR - Validates login failure
 * -----------------------------------------------
 * Encapsulates error validation logic
 * 
 * @param {string} expectedError - Expected error message
 * @example cy.verifyLoginError('Your username is invalid!')
 */
Cypress.Commands.add('verifyLoginError', (expectedError) => {
  cy.fixture('customCommandData').then((data) => {
    const selectors = data.loginPage.selectors

    cy.log(`❌ Verifying login error: "${expectedError}"`)

    cy.get(selectors.errorMessage)
      .should('be.visible')
      .and('contain', expectedError)
  })
})

/**
 * 📝 FILL FORM - Generic form filling command
 * -------------------------------------------
 * BENEFIT 3: REDUCE REDUNDANCY AND SIMPLIFY MAINTENANCE
 * 
 * When form fields change, update only this command.
 * All tests using cy.fillForm() automatically work.
 * 
 * @param {Object} formData - Object with field selectors and values
 * @example cy.fillForm({ '#name': 'John', '#email': 'john@test.com' })
 */
Cypress.Commands.add('fillForm', (formData) => {
  cy.log('📝 Filling form with provided data')

  Object.entries(formData).forEach(([selector, value]) => {
    cy.get(selector)
      .should('be.visible')
      .clear()
      .type(value)
    cy.log(`  ✓ Filled "${selector}" with "${value}"`)
  })
})

/**
 * 🌐 API LOGIN - Login via API (faster than UI)
 * ---------------------------------------------
 * BENEFIT 4: ENFORCE BEST PRACTICES
 * 
 * For tests that don't specifically test login UI,
 * using API login is faster and more reliable.
 * 
 * @param {string} userType - Type of user
 * @example cy.apiLogin('admin')
 */
Cypress.Commands.add('apiLogin', (userType = 'standard') => {
  cy.fixture('customCommandData').then((data) => {
    const user = data.users[userType]

    cy.log(`🌐 API Login as: ${userType}`)

    // Simulate API login (in real scenario, this would hit your auth endpoint)
    cy.request({
      method: 'GET',
      url: data.apiEndpoints.users,
    }).then((response) => {
      expect(response.status).to.eq(200)
      cy.log('✓ API authentication simulated')
    })
  })
})

// ============================================================================
// SECTION 2: CHILD COMMANDS (Chain off a previous command)
// ============================================================================

/**
 * 🔍 SHOULD BE VISIBLE AND CONTAIN - Enhanced visibility check
 * ------------------------------------------------------------
 * Child command that chains off elements
 * 
 * @param {string} text - Text the element should contain
 * @example cy.get('.message').shouldBeVisibleAndContain('Success')
 */
Cypress.Commands.add('shouldBeVisibleAndContain', { prevSubject: 'element' }, (subject, text) => {
  cy.wrap(subject)
    .should('be.visible')
    .and('contain', text)
  cy.log(`✓ Element is visible and contains: "${text}"`)
  return cy.wrap(subject)
})

/**
 * ⌨️ TYPE AND VERIFY - Types and immediately verifies the value
 * -------------------------------------------------------------
 * Combines type and verification in one command
 * 
 * @param {string} text - Text to type
 * @example cy.get('input').typeAndVerify('Hello World')
 */
Cypress.Commands.add('typeAndVerify', { prevSubject: 'element' }, (subject, text) => {
  cy.wrap(subject)
    .clear()
    .type(text)
    .should('have.value', text)
  cy.log(`✓ Typed and verified: "${text}"`)
  return cy.wrap(subject)
})

/**
 * 🖱️ CLICK AND WAIT - Clicks and waits for response
 * -------------------------------------------------
 * Useful for buttons that trigger API calls
 * 
 * @param {string} alias - Network alias to wait for (optional)
 * @example cy.get('.submit-btn').clickAndWait('@submitForm')
 */
Cypress.Commands.add('clickAndWait', { prevSubject: 'element' }, (subject, alias) => {
  cy.wrap(subject)
    .should('be.visible')
    .and('not.be.disabled')
    .click()

  if (alias) {
    cy.wait(alias)
    cy.log(`✓ Clicked and waited for: ${alias}`)
  } else {
    cy.log('✓ Clicked element')
  }
  return cy.wrap(subject)
})

/**
 * 🎯 FORCE CLICK - Click even if element is covered
 * -------------------------------------------------
 * Use sparingly - only when regular click fails
 * 
 * @example cy.get('.hidden-btn').forceClick()
 */
Cypress.Commands.add('forceClick', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).click({ force: true })
  cy.log('⚠️ Force clicked element (use sparingly)')
  return cy.wrap(subject)
})

// ============================================================================
// SECTION 3: DUAL COMMANDS (Can start or chain)
// ============================================================================

/**
 * 📸 TAKE SCREENSHOT WITH LABEL - Named screenshot capture
 * --------------------------------------------------------
 * Dual command - works with or without subject
 * 
 * @param {string} name - Screenshot name
 * @example cy.takeScreenshotWithLabel('login-page')
 * @example cy.get('.form').takeScreenshotWithLabel('form-state')
 */
Cypress.Commands.add('takeScreenshotWithLabel', { prevSubject: 'optional' }, (subject, name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const fullName = `${name}_${timestamp}`

  if (subject) {
    cy.wrap(subject).screenshot(fullName)
    cy.log(`📸 Screenshot of element: ${fullName}`)
  } else {
    cy.screenshot(fullName)
    cy.log(`📸 Full page screenshot: ${fullName}`)
  }
})

/**
 * ⏱️ WITH TIMEOUT - Apply custom timeout to any command
 * -----------------------------------------------------
 * 
 * @param {number} ms - Timeout in milliseconds
 * @example cy.get('.slow-element').withTimeout(10000).should('be.visible')
 */
Cypress.Commands.add('withTimeout', { prevSubject: 'optional' }, (subject, ms) => {
  if (subject) {
    return cy.wrap(subject, { timeout: ms })
  }
  cy.log(`⏱️ Using timeout: ${ms}ms`)
})

// ============================================================================
// SECTION 4: UTILITY COMMANDS
// ============================================================================

/**
 * 🧹 CLEAR ALL DATA - Clears cookies, localStorage, sessionStorage
 * ----------------------------------------------------------------
 * BEST PRACTICE: Clean state before tests
 * 
 * @example cy.clearAllData()
 */
Cypress.Commands.add('clearAllData', () => {
  cy.log('🧹 Clearing all browser data')
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.window().then((win) => {
    win.sessionStorage.clear()
  })
  cy.log('✓ All browser data cleared')
})

/**
 * 📊 LOG TEST INFO - Structured test logging
 * ------------------------------------------
 * Creates consistent log format across tests
 * 
 * @param {string} testName - Name of the test
 * @param {string} description - Test description
 * @example cy.logTestInfo('TC001', 'Verify login functionality')
 */
Cypress.Commands.add('logTestInfo', (testName, description) => {
  cy.log('═══════════════════════════════════════')
  cy.log(`📋 TEST: ${testName}`)
  cy.log(`📝 ${description}`)
  cy.log('═══════════════════════════════════════')
})

/**
 * 🔄 WAIT FOR ELEMENT TO DISAPPEAR - Waits for loading indicators
 * ---------------------------------------------------------------
 * Useful for waiting for spinners/loaders to disappear
 * 
 * @param {string} selector - Element selector
 * @param {number} timeout - Maximum wait time (default: 10000)
 * @example cy.waitForElementToDisappear('.loading-spinner')
 */
Cypress.Commands.add('waitForElementToDisappear', (selector, timeout = 10000) => {
  cy.log(`🔄 Waiting for "${selector}" to disappear`)
  cy.get(selector, { timeout }).should('not.exist')
  cy.log('✓ Element disappeared')
})

/**
 * 🎲 GET RANDOM ITEM - Get random item from array
 * -----------------------------------------------
 * Useful for data-driven testing with random data
 * 
 * @param {Array} array - Array to select from
 * @example cy.getRandomItem(['a', 'b', 'c']).then(item => ...)
 */
Cypress.Commands.add('getRandomItem', (array) => {
  const randomIndex = Math.floor(Math.random() * array.length)
  const item = array[randomIndex]
  cy.log(`🎲 Selected random item: "${item}"`)
  return cy.wrap(item)
})

/**
 * 🔗 CHECK LINK - Validates link href and optionally visits
 * ---------------------------------------------------------
 * 
 * @param {string} expectedHref - Expected href value (partial match)
 * @param {boolean} shouldVisit - Whether to click the link (default: false)
 * @example cy.get('a.nav-link').checkLink('/products', true)
 */
Cypress.Commands.add('checkLink', { prevSubject: 'element' }, (subject, expectedHref, shouldVisit = false) => {
  cy.wrap(subject)
    .should('have.attr', 'href')
    .and('include', expectedHref)

  if (shouldVisit) {
    cy.wrap(subject).click()
    cy.url().should('include', expectedHref)
    cy.log(`✓ Navigated to: ${expectedHref}`)
  } else {
    cy.log(`✓ Link href verified: ${expectedHref}`)
  }

  return cy.wrap(subject)
})

// ============================================================================
// SECTION 5: API TESTING COMMANDS
// ============================================================================

/**
 * 🌐 API GET AND VALIDATE - GET request with validation
 * -----------------------------------------------------
 * 
 * @param {string} url - API endpoint
 * @param {number} expectedStatus - Expected status code (default: 200)
 * @example cy.apiGetAndValidate('/api/users', 200)
 */
Cypress.Commands.add('apiGetAndValidate', (url, expectedStatus = 200) => {
  cy.log(`🌐 GET: ${url}`)
  cy.request({
    method: 'GET',
    url: url,
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.eq(expectedStatus)
    cy.log(`✓ Status: ${response.status}`)
    return cy.wrap(response)
  })
})

/**
 * 🌐 API POST AND VALIDATE - POST request with validation
 * -------------------------------------------------------
 * 
 * @param {string} url - API endpoint
 * @param {Object} body - Request body
 * @param {number} expectedStatus - Expected status code (default: 201)
 * @example cy.apiPostAndValidate('/api/users', { name: 'John' })
 */
Cypress.Commands.add('apiPostAndValidate', (url, body, expectedStatus = 201) => {
  cy.log(`🌐 POST: ${url}`)
  cy.request({
    method: 'POST',
    url: url,
    body: body,
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.eq(expectedStatus)
    cy.log(`✓ Status: ${response.status}`)
    return cy.wrap(response)
  })
})

// ============================================================================
// END OF CUSTOM COMMANDS
// ============================================================================
