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
// SECTION: DAY 3 - ENTERPRISE API TESTING CUSTOM COMMANDS
// ============================================================================
// These commands demonstrate enterprise-level API testing patterns
// with proper error handling, logging, and reusability
// ============================================================================

/**
 * 🌐 API REQUEST - Universal API Request Command
 * ---------------------------------------------
 * A comprehensive command that handles all HTTP methods with full configuration
 * 
 * ENTERPRISE BENEFIT:
 * - Single command for all API operations
 * - Consistent logging and error handling
 * - Supports headers, query params, timeouts
 * - Returns chainable response object
 * 
 * @param {Object} options - Request configuration
 * @param {string} options.method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param {string} options.url - API endpoint URL
 * @param {Object} [options.body] - Request body for POST/PUT/PATCH
 * @param {Object} [options.headers] - Custom headers
 * @param {Object} [options.qs] - Query string parameters
 * @param {number} [options.timeout] - Request timeout in ms
 * @param {boolean} [options.failOnStatusCode] - Fail on non-2xx status (default: false)
 * 
 * @example 
 * cy.apiRequest({
 *   method: 'POST',
 *   url: '/api/users',
 *   body: { name: 'John' },
 *   headers: { Authorization: 'Bearer token' }
 * })
 */
Cypress.Commands.add('apiRequest', (options) => {
  const {
    method = 'GET',
    url,
    body = null,
    headers = {},
    qs = {},
    timeout = 30000,
    failOnStatusCode = false
  } = options

  cy.log(`📡 API ${method}: ${url}`)

  const requestConfig = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers
    },
    failOnStatusCode,
    timeout
  }

  // Add body for methods that support it
  if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    requestConfig.body = body
  }

  // Add query parameters if provided
  if (Object.keys(qs).length > 0) {
    requestConfig.qs = qs
  }

  return cy.request(requestConfig).then((response) => {
    cy.log(`✅ Response Status: ${response.status}`)
    cy.log(`⏱️ Response Time: ${response.duration}ms`)
    return cy.wrap(response)
  })
})

/**
 * 🔐 API LOGIN - Authenticate and Store Token
 * ------------------------------------------
 * Performs API login and stores the authentication token for subsequent requests
 * 
 * ENTERPRISE BENEFIT:
 * - Handles authentication flow
 * - Stores token for reuse
 * - Supports different auth endpoints
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} [authEndpoint] - Custom auth endpoint
 * 
 * @example cy.apiLogin('user@test.com', 'password123')
 */
Cypress.Commands.add('apiLogin', (email, password, authEndpoint = 'https://reqres.in/api/login') => {
  cy.log(`🔐 API Login: ${email}`)
  
  return cy.request({
    method: 'POST',
    url: authEndpoint,
    body: { email, password },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200 && response.body.token) {
      // Store token in Cypress environment
      Cypress.env('authToken', response.body.token)
      cy.log(`✅ Login successful - Token stored`)
      return cy.wrap({ success: true, token: response.body.token })
    } else {
      cy.log(`❌ Login failed - Status: ${response.status}`)
      return cy.wrap({ success: false, error: response.body })
    }
  })
})

/**
 * 🔗 API AUTHENTICATED REQUEST - Request with Auth Token
 * -----------------------------------------------------
 * Makes an authenticated API request using stored token
 * 
 * @param {Object} options - Same options as apiRequest
 * 
 * @example cy.apiAuthRequest({ method: 'GET', url: '/api/protected' })
 */
Cypress.Commands.add('apiAuthRequest', (options) => {
  const token = Cypress.env('authToken')
  
  if (!token) {
    cy.log('⚠️ No auth token found - Proceeding without authentication')
  }

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  return cy.apiRequest({
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers
    }
  })
})

/**
 * ✅ VALIDATE RESPONSE SCHEMA - Schema Validation Command
 * ------------------------------------------------------
 * Validates API response against expected schema
 * 
 * ENTERPRISE BENEFIT:
 * - Ensures API contracts are maintained
 * - Validates field types and required fields
 * - Provides detailed error messages
 * 
 * @param {Object} response - Cypress response object
 * @param {Object} schema - Expected schema { requiredFields: [], types: {} }
 * 
 * @example 
 * cy.apiRequest({ url: '/posts/1' })
 *   .validateSchema({
 *     requiredFields: ['id', 'title'],
 *     types: { id: 'number', title: 'string' }
 *   })
 */
Cypress.Commands.add('validateSchema', { prevSubject: true }, (response, schema) => {
  const { requiredFields = [], types = {} } = schema
  const data = response.body

  cy.log('🔍 Validating Response Schema')

  // Handle array responses - validate first item
  const itemToValidate = Array.isArray(data) ? data[0] : data

  // Check required fields
  requiredFields.forEach((field) => {
    expect(itemToValidate, `Required field "${field}"`).to.have.property(field)
  })

  // Check field types
  Object.entries(types).forEach(([field, expectedType]) => {
    if (itemToValidate[field] !== undefined) {
      expect(typeof itemToValidate[field], `Field "${field}" type`).to.eq(expectedType)
    }
  })

  cy.log('✅ Schema validation passed')
  return cy.wrap(response)
})

/**
 * 📊 VALIDATE RESPONSE HEADERS - Header Validation Command
 * -------------------------------------------------------
 * Validates specific headers in API response
 * 
 * @param {Object} expectedHeaders - Key-value pairs of expected headers
 * 
 * @example 
 * cy.apiRequest({ url: '/posts' })
 *   .validateHeaders({ 'content-type': 'application/json' })
 */
Cypress.Commands.add('validateHeaders', { prevSubject: true }, (response, expectedHeaders) => {
  cy.log('📊 Validating Response Headers')

  Object.entries(expectedHeaders).forEach(([header, expectedValue]) => {
    const actualValue = response.headers[header.toLowerCase()]
    expect(actualValue, `Header "${header}"`).to.include(expectedValue)
  })

  cy.log('✅ Header validation passed')
  return cy.wrap(response)
})

/**
 * 🔄 API CRUD OPERATIONS - Create, Read, Update, Delete
 * -----------------------------------------------------
 * Convenience commands for common CRUD operations
 */

// CREATE (POST)
Cypress.Commands.add('apiCreate', (url, data, headers = {}) => {
  cy.log(`📝 CREATE: ${url}`)
  return cy.apiRequest({
    method: 'POST',
    url,
    body: data,
    headers
  })
})

// READ (GET)
Cypress.Commands.add('apiRead', (url, queryParams = {}, headers = {}) => {
  cy.log(`📖 READ: ${url}`)
  return cy.apiRequest({
    method: 'GET',
    url,
    qs: queryParams,
    headers
  })
})

// UPDATE (PUT - Full update)
Cypress.Commands.add('apiUpdate', (url, data, headers = {}) => {
  cy.log(`✏️ UPDATE (PUT): ${url}`)
  return cy.apiRequest({
    method: 'PUT',
    url,
    body: data,
    headers
  })
})

// PARTIAL UPDATE (PATCH)
Cypress.Commands.add('apiPatch', (url, data, headers = {}) => {
  cy.log(`🔧 PATCH: ${url}`)
  return cy.apiRequest({
    method: 'PATCH',
    url,
    body: data,
    headers
  })
})

// DELETE
Cypress.Commands.add('apiDelete', (url, headers = {}) => {
  cy.log(`🗑️ DELETE: ${url}`)
  return cy.apiRequest({
    method: 'DELETE',
    url,
    headers
  })
})

// ----------------------------------------------------------------------------
// IFRAME HANDLING COMMANDS
// ----------------------------------------------------------------------------
// Iframes embed separate HTML documents inside a page.
// Cypress cannot directly access iframe content because it runs in the
// main document context. These commands help bridge that gap.
// ----------------------------------------------------------------------------

/*
 * getIframeBody - Access the body element inside an iframe
 * 
 * Why this is needed:
 * - Iframes have their own document context (separate from main page)
 * - Cypress commands only work in the main document by default
 * - We need to extract the iframe body and wrap it for Cypress to use
 * 
 * How it works:
 * 1. Find the iframe element using the selector
 * 2. Access its contentDocument.body property
 * 3. Wait until the body has content (not empty)
 * 4. Wrap it so Cypress commands can be chained
 * 
 * Usage:
 *   cy.getIframeBody('#my-iframe').find('button').click()
 *   cy.getIframeBody('.editor-frame').find('p').type('Hello')
 */
Cypress.Commands.add('getIframeBody', (iframeSelector) => {
  // Log what we're doing for test debugging
  cy.log('Accessing iframe: ' + iframeSelector)

  return cy
    .get(iframeSelector)
    .its('0.contentDocument.body')  // Get the body of the iframe document
    .should('not.be.empty')         // Wait for content to load
    .then(cy.wrap)                  // Wrap it so we can use Cypress commands
})

/*
 * getIframeDocument - Get the full iframe document for more control
 * 
 * Use this when you need access to the iframe's document object,
 * not just the body. Useful for complex iframe interactions.
 */
Cypress.Commands.add('getIframeDocument', (iframeSelector) => {
  return cy
    .get(iframeSelector)
    .its('0.contentDocument')
    .should('exist')
})

/*
 * typeInTinyMce - Type into TinyMCE editor (handles readonly state)
 * 
 * TinyMCE editors need special handling. This command:
 * 1. Gets the iframe element directly
 * 2. Accesses its contentDocument 
 * 3. Sets the content via innerHTML
 */
Cypress.Commands.add('typeInTinyMce', (iframeSelector, text) => {
  cy.get(iframeSelector).then(($iframe) => {
    const iframeDoc = $iframe[0].contentDocument
    const body = iframeDoc.body
    body.innerHTML = '<p>' + text + '</p>'
  })
  // Small wait for DOM to update
  cy.wait(100)
})

/*
 * typeInIframe - Type text into an element inside an iframe
 * 
 * A convenience command that combines iframe access with typing.
 * Useful when you need to type into iframe content frequently.
 * 
 * Parameters:
 *   iframeSelector - CSS selector for the iframe
 *   elementSelector - CSS selector for the element inside the iframe
 *   text - The text to type
 * 
 * Usage:
 *   cy.typeInIframe('#editor-iframe', 'p', 'Hello World')
 */
Cypress.Commands.add('typeInIframe', (iframeSelector, elementSelector, text) => {
  cy.getIframeBody(iframeSelector)
    .find(elementSelector)
    .click()
    .type('{selectall}' + text)
})

/*
 * clickInIframe - Click an element inside an iframe
 * 
 * Parameters:
 *   iframeSelector - CSS selector for the iframe
 *   elementSelector - CSS selector for the element to click
 * 
 * Usage:
 *   cy.clickInIframe('#my-iframe', 'button.submit')
 */
Cypress.Commands.add('clickInIframe', (iframeSelector, elementSelector) => {
  cy.getIframeBody(iframeSelector)
    .find(elementSelector)
    .click()
})

/**
 * 📁 FILE UPLOAD - Custom Command for File Uploads
 * ------------------------------------------------
 * Handles file uploads using different methods
 * 
 * @param {string} selector - Input file element selector
 * @param {string} filePath - Path to file in fixtures folder
 * @param {string} [mimeType] - File MIME type
 * 
 * @example cy.uploadFile('input[type="file"]', 'test-image.png', 'image/png')
 */
Cypress.Commands.add('uploadFile', (selector, filePath, mimeType = '') => {
  cy.log(`📁 Uploading file: ${filePath}`)
  
  return cy.fixture(filePath, 'base64').then((fileContent) => {
    const fileName = filePath.split('/').pop()
    
    cy.get(selector).then((input) => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, mimeType)
      const file = new File([blob], fileName, { type: mimeType })
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      
      input[0].files = dataTransfer.files
      cy.wrap(input).trigger('change', { force: true })
    })
  })
})

/**
 * 📥 VERIFY DOWNLOAD - Check if file was downloaded
 * ------------------------------------------------
 * Verifies a file exists in the downloads folder
 * 
 * @param {string} fileName - Name of the downloaded file
 * 
 * @example cy.verifyDownload('report.pdf')
 */
Cypress.Commands.add('verifyDownload', (fileName) => {
  cy.log(`📥 Verifying download: ${fileName}`)
  
  const downloadsFolder = Cypress.config('downloadsFolder')
  cy.readFile(`${downloadsFolder}/${fileName}`, { timeout: 15000 }).should('exist')
})

/**
 * 🔀 INTERCEPT AND MOCK - Enhanced Intercept Command
 * -------------------------------------------------
 * Simplifies API mocking with built-in fixture support
 * 
 * @param {string} method - HTTP method to intercept
 * @param {string|RegExp} url - URL pattern to intercept
 * @param {string|Object} response - Fixture name or response object
 * @param {string} alias - Alias for the intercept
 * @param {number} [statusCode] - Response status code
 * @param {number} [delay] - Response delay in ms
 * 
 * @example 
 * cy.interceptAndMock('GET', '/api/users', 'mockApiResponses', 'getUsers')
 * cy.interceptAndMock('GET', '/api/posts', { id: 1 }, 'getPosts', 200, 1000)
 */
Cypress.Commands.add('interceptAndMock', (method, url, response, alias, statusCode = 200, delay = 0) => {
  cy.log(`🔀 Intercepting ${method} ${url}`)
  
  if (typeof response === 'string') {
    // Response is a fixture name
    cy.fixture(response).then((fixtureData) => {
      cy.intercept(method, url, {
        statusCode,
        body: fixtureData,
        delay
      }).as(alias)
    })
  } else {
    // Response is an object
    cy.intercept(method, url, {
      statusCode,
      body: response,
      delay
    }).as(alias)
  }
})

/**
 * ⏱️ WAIT FOR API - Wait for API call and validate
 * -----------------------------------------------
 * Waits for intercepted API call and validates response
 * 
 * @param {string} alias - Intercept alias (with @)
 * @param {number} [expectedStatus] - Expected status code
 * 
 * @example cy.waitForApi('@getUsers', 200)
 */
Cypress.Commands.add('waitForApi', (alias, expectedStatus = null) => {
  cy.log(`⏱️ Waiting for API: ${alias}`)
  
  return cy.wait(alias).then((interception) => {
    if (expectedStatus) {
      expect(interception.response.statusCode).to.eq(expectedStatus)
    }
    cy.log(`✅ API ${alias} completed - Status: ${interception.response.statusCode}`)
    return cy.wrap(interception)
  })
})

// ============================================================================
// END OF CUSTOM COMMANDS
// ============================================================================


// ============================================================================
// FILE UPLOAD AND DOWNLOAD CUSTOM COMMANDS
// ============================================================================

/*
 * uploadFile - Upload a file to a file input element
 * Uses Cypress native selectFile command (built-in since Cypress 9.3)
 * 
 * Parameters:
 *   selector - CSS selector for the file input element
 *   fileName - Name of the file in fixtures folder
 */
Cypress.Commands.add('uploadFile', (selector, fileName) => {
  cy.log('Uploading file: ' + fileName)
  cy.get(selector).selectFile('cypress/fixtures/' + fileName, { force: true })
})

/*
 * verifyDownloadedFile - Check if a file was downloaded and verify its content
 * 
 * Parameters:
 *   fileName - Name of the downloaded file
 *   expectedContent - Optional text to verify in the file
 *   timeout - How long to wait for file (default 15 seconds)
 */
Cypress.Commands.add('verifyDownloadedFile', (fileName, expectedContent = null, timeout = 15000) => {
  const downloadsFolder = Cypress.config('downloadsFolder')
  const filePath = downloadsFolder + '/' + fileName
  
  cy.log('Checking for downloaded file: ' + fileName)
  
  if (expectedContent) {
    cy.readFile(filePath, { timeout: timeout })
      .should('exist')
      .and('contain', expectedContent)
  } else {
    cy.readFile(filePath, { timeout: timeout })
      .should('exist')
  }
})

/*
 * clearDownloadsFolder - Clear all files from downloads folder before test
 */
Cypress.Commands.add('clearDownloadsFolder', () => {
  const downloadsFolder = Cypress.config('downloadsFolder')
  cy.task('clearDownloads', downloadsFolder).then((count) => {
    cy.log('Cleared ' + count + ' files from downloads folder')
  })
})


// ============================================================================
// SECTION: ENVIRONMENT VARIABLE COMMANDS
// ============================================================================
// These commands help work with environment variables in a structured way

/*
 * getEnvVariable - Get an environment variable with logging
 * 
 * Parameters:
 *   varName - Name of the environment variable
 *   defaultValue - Default value if not set
 */
Cypress.Commands.add('getEnvVariable', (varName, defaultValue = null) => {
  const value = Cypress.env(varName)
  if (value === undefined && defaultValue !== null) {
    cy.log('Environment variable "' + varName + '" not set, using default: ' + defaultValue)
    return cy.wrap(defaultValue)
  }
  cy.log('Environment variable "' + varName + '": ' + value)
  return cy.wrap(value)
})

/*
 * verifyEnvVariable - Verify an environment variable has expected value
 * 
 * Parameters:
 *   varName - Name of the environment variable
 *   expectedValue - Expected value
 */
Cypress.Commands.add('verifyEnvVariable', (varName, expectedValue) => {
  const actualValue = Cypress.env(varName)
  cy.log('Verifying "' + varName + '" equals "' + expectedValue + '"')
  expect(actualValue).to.equal(expectedValue)
})

/*
 * checkFeatureFlag - Check if a feature flag is enabled
 * 
 * Parameters:
 *   flagName - Name of the feature flag
 */
Cypress.Commands.add('checkFeatureFlag', (flagName) => {
  const featureFlags = Cypress.env('featureFlags') || {}
  const isEnabled = featureFlags[flagName] === true
  cy.log('Feature flag "' + flagName + '" is ' + (isEnabled ? 'enabled' : 'disabled'))
  return cy.wrap(isEnabled)
})

/*
 * logEnvironmentInfo - Log current environment configuration
 * Useful for debugging and test reports
 */
Cypress.Commands.add('logEnvironmentInfo', () => {
  const environment = Cypress.env('environment') || 'not set'
  const apiBaseUrl = Cypress.env('apiBaseUrl') || 'not set'
  const baseUrl = Cypress.config('baseUrl') || 'not set'
  
  cy.log('--- Environment Information ---')
  cy.log('Environment: ' + environment)
  cy.log('Base URL: ' + baseUrl)
  cy.log('API Base URL: ' + apiBaseUrl)
  cy.log('-------------------------------')
})

/*
 * makeApiRequest - Make API request using environment base URL
 * 
 * Parameters:
 *   endpoint - API endpoint path
 *   method - HTTP method (default GET)
 *   body - Request body for POST/PUT
 */
Cypress.Commands.add('makeApiRequest', (endpoint, method = 'GET', body = null) => {
  const apiBaseUrl = Cypress.env('apiBaseUrl')
  const url = apiBaseUrl + endpoint
  
  cy.log('Making ' + method + ' request to: ' + url)
  
  const options = {
    method: method,
    url: url,
    failOnStatusCode: false
  }
  
  if (body) {
    options.body = body
  }
  
  return cy.request(options)
})
