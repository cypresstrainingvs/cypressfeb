/**
 * ============================================================================
 * CUSTOM COMMANDS IN CYPRESS - Training Examples
 * ============================================================================
 * 
 * This test file demonstrates the BENEFITS of using Custom Commands in Cypress.
 * 
 * 📚 BENEFITS COVERED:
 * --------------------
 * ✅ BENEFIT 1: Promote Reusable and Modular Code
 * ✅ BENEFIT 2: Improve Test Readability
 * ✅ BENEFIT 3: Reduce Redundancy and Simplify Maintenance
 * ✅ BENEFIT 4: Enforce Best Practices and Standards
 * 
 * 🔧 FILES INVOLVED:
 * ------------------
 * - cypress/support/commands.js   → Custom command definitions
 * - cypress/fixtures/customCommandData.json → Test data
 * - cypress/e2e/Day2/customcommand.cy.js    → This test file
 * 
 * ============================================================================
 */

describe('Custom Commands in Cypress - Training Examples', () => {

  // Load fixture data for reference
  let testData

  before(() => {
    cy.fixture('customCommandData').then((data) => {
      testData = data
    })
  })

  // ============================================================================
  // BENEFIT 1: PROMOTE REUSABLE AND MODULAR CODE
  // ============================================================================

  describe('BENEFIT 1: Promote Reusable and Modular Code', () => {
    /**
     * 📌 BENEFIT EXPLANATION:
     * -----------------------
     * Custom commands allow you to define commonly repeated actions—such as
     * login, navigation, or form filling—ONCE and reuse them across multiple tests.
     * This leads to modular test design and eliminates code duplication.
     * 
     * ❌ WITHOUT CUSTOM COMMANDS (Repetitive):
     * ----------------------------------------
     * // Test 1
     * cy.visit('/login')
     * cy.get('#username').type('admin')
     * cy.get('#password').type('password')
     * cy.get('#submit').click()
     * 
     * // Test 2 (Same code repeated!)
     * cy.visit('/login')
     * cy.get('#username').type('admin')
     * cy.get('#password').type('password')
     * cy.get('#submit').click()
     * 
     * ✅ WITH CUSTOM COMMANDS (Reusable):
     * -----------------------------------
     * // Test 1
     * cy.login('admin')
     * 
     * // Test 2
     * cy.login('admin')
     */

    it('TC1: Using cy.login() - Reusable Login Command', () => {
      cy.logTestInfo('TC1', 'Demonstrating reusable login command')

      /**
       * ONE LINE instead of 5+ lines of code!
       * The login logic is defined ONCE in commands.js
       * and can be reused in ANY test file.
       */
      cy.login('admin')

      // Verify login was successful
      cy.verifyLoginSuccess()

      cy.log('✅ BENEFIT: Login logic is written ONCE, used EVERYWHERE')
    })

    it('TC2: Using cy.login() with Different Users', () => {
      cy.logTestInfo('TC2', 'Same command, different user types')

      /**
       * SAME command works for different user types
       * Just pass a different parameter!
       */
      cy.login('standard')
      cy.verifyLoginSuccess()

      cy.log('✅ BENEFIT: Modular command accepts parameters for flexibility')
    })

    it('TC3: Using cy.fillForm() - Reusable Form Filling', () => {
      cy.logTestInfo('TC3', 'Demonstrating reusable form command')

      cy.visit('https://example.cypress.io/commands/actions')

      /**
       * cy.fillForm() - Generic form filling command
       * Pass any field selectors and values as an object
       */
      cy.fillForm({
        '.action-email': 'test@example.com'
      })

      cy.log('✅ BENEFIT: One command handles ANY form with ANY fields')
    })
  })

  // ============================================================================
  // BENEFIT 2: IMPROVE TEST READABILITY
  // ============================================================================

  describe('BENEFIT 2: Improve Test Readability', () => {
    /**
     * 📌 BENEFIT EXPLANATION:
     * -----------------------
     * Using custom commands makes your test scripts:
     * - SHORTER
     * - CLEARER
     * - EASIER to understand
     * 
     * Instead of long blocks of DOM interactions, you get clean,
     * expressive steps that anyone can understand!
     * 
     * ❌ HARD TO READ (Raw Cypress):
     * ------------------------------
     * cy.get('#username').should('be.visible').clear().type('admin')
     * cy.get('#password').should('be.visible').clear().type('pass123')
     * cy.get('#submit').should('be.visible').and('not.be.disabled').click()
     * cy.get('.success-message').should('be.visible').and('contain', 'Success')
     * 
     * ✅ EASY TO READ (Custom Commands):
     * ----------------------------------
     * cy.login('admin')
     * cy.verifyLoginSuccess()
     */

    it('TC4: Readable Login Flow', () => {
      cy.logTestInfo('TC4', 'Demonstrating readable test flow')

      /**
       * COMPARE THE READABILITY:
       * 
       * ❌ Without custom commands:
       *    cy.visit('https://practicetestautomation.com/practice-test-login/')
       *    cy.get('#username').should('be.visible').clear().type('student')
       *    cy.get('#password').should('be.visible').clear().type('Password123', {log: false})
       *    cy.get('#submit').should('be.visible').and('not.be.disabled').click()
       *    cy.get('.post-title').should('be.visible').and('contain', 'Logged In')
       *    cy.url().should('include', 'logged-in-successfully')
       * 
       * ✅ With custom commands (MUCH clearer!):
       */
      cy.login('admin')
      cy.verifyLoginSuccess()

      cy.log('✅ BENEFIT: Even non-technical team members can understand the test!')
    })

    it('TC5: Readable Error Verification', () => {
      cy.logTestInfo('TC5', 'Clear error verification command')

      cy.login('invalid')

      /**
       * CLEAR INTENT: Anyone reading this knows exactly what's being tested
       */
      cy.verifyLoginError('Your username is invalid!')

      cy.log('✅ BENEFIT: Self-documenting test steps')
    })

    it('TC6: Readable Chained Commands', () => {
      cy.logTestInfo('TC6', 'Child commands for readability')

      cy.visit('https://example.cypress.io/commands/actions')

      /**
       * CHILD COMMANDS make chains more readable:
       * 
       * ❌ cy.get('input').clear().type('text').should('have.value', 'text')
       * ✅ cy.get('input').typeAndVerify('text')
       */
      cy.get('.action-email')
        .typeAndVerify('readable@example.com')

      cy.log('✅ BENEFIT: Chained commands are self-explanatory')
    })
  })

  // ============================================================================
  // BENEFIT 3: REDUCE REDUNDANCY AND SIMPLIFY MAINTENANCE
  // ============================================================================

  describe('BENEFIT 3: Reduce Redundancy and Simplify Maintenance', () => {
    /**
     * 📌 BENEFIT EXPLANATION:
     * -----------------------
     * When UI changes occur (e.g., a new button ID or locator):
     * - You only need to update the logic ONCE inside the custom command
     * - ALL tests using that command automatically get updated
     * 
     * OUTCOME:
     * ✅ Faster maintenance
     * ✅ Lower chance of missing updates
     * ✅ Consistent behavior across all tests
     * 
     * SCENARIO:
     * ---------
     * If the login button changes from '#submit' to '#login-btn':
     * 
     * ❌ WITHOUT custom commands: Update 50+ test files!
     * ✅ WITH custom commands: Update ONLY commands.js (1 file!)
     */

    it('TC7: Single Point of Maintenance - Login Selectors', () => {
      cy.logTestInfo('TC7', 'All selectors defined in ONE place')

      /**
       * If selectors change in the future:
       * 
       * OLD: #username → NEW: #user-name
       * OLD: #password → NEW: #user-password
       * OLD: #submit   → NEW: #login-button
       * 
       * UPDATE ONLY: commands.js (selectors come from fixture)
       * ALL TESTS continue to work without changes!
       */
      cy.login('admin')
      cy.verifyLoginSuccess()

      cy.log('✅ BENEFIT: Selectors centralized in fixture/commands')
      cy.log('✅ BENEFIT: UI change = 1 file update, not 50!')
    })

    it('TC8: Single Point of Update - API Endpoints', () => {
      cy.logTestInfo('TC8', 'API endpoints from fixture')

      /**
       * API endpoints defined in fixture:
       * If endpoint changes: Update fixture ONCE
       */
      cy.apiGetAndValidate(testData.apiEndpoints.posts, 200)

      cy.log('✅ BENEFIT: API URLs centralized, easy to update')
    })

    it('TC9: Consistent Behavior Across Tests', () => {
      cy.logTestInfo('TC9', 'Same logic everywhere')

      cy.visit('https://example.cypress.io/commands/actions')

      /**
       * cy.typeAndVerify() ensures:
       * - Always clears before typing
       * - Always verifies after typing
       * 
       * This CONSISTENT behavior is guaranteed in ALL tests!
       */
      cy.get('.action-email').typeAndVerify('consistent@test.com')
      cy.get('.action-focus').typeAndVerify('always same behavior')

      cy.log('✅ BENEFIT: Consistent behavior guaranteed')
    })
  })

  // ============================================================================
  // BENEFIT 4: ENFORCE BEST PRACTICES AND STANDARDS
  // ============================================================================

  describe('BENEFIT 4: Enforce Best Practices and Standards', () => {
    /**
     * 📌 BENEFIT EXPLANATION:
     * -----------------------
     * Teams can design custom commands to follow:
     * ✅ Naming conventions
     * ✅ Error-handling rules
     * ✅ Standardized selector usage
     * ✅ Security practices (not logging passwords)
     * ✅ Cleaner BDD style patterns
     * 
     * This ensures ALL test developers follow the same quality guidelines!
     */

    it('TC10: Best Practice - Structured Logging', () => {
      /**
       * cy.logTestInfo() enforces consistent test documentation
       * Every test starts with structured info
       */
      cy.logTestInfo('TC10', 'Demonstrating structured logging standard')

      cy.visit('https://example.cypress.io')

      cy.log('✅ BEST PRACTICE: Consistent test documentation format')
    })

    it('TC11: Best Practice - Clear State Before Tests', () => {
      cy.logTestInfo('TC11', 'Demonstrating clean state command')

      /**
       * cy.clearAllData() ensures clean test state
       * Clears: Cookies, localStorage, sessionStorage
       * 
       * BEST PRACTICE: Tests should not depend on previous test state
       */
      cy.clearAllData()

      cy.visit('https://example.cypress.io')

      cy.log('✅ BEST PRACTICE: Always start with clean state')
    })

    it('TC12: Best Practice - Security (Password Hiding)', () => {
      cy.logTestInfo('TC12', 'Demonstrating security best practice')

      /**
       * Notice in the Cypress logs:
       * - Username is logged
       * - Password is NOT logged (security!)
       * 
       * This is built into cy.login() command:
       * .type(user.password, { log: false })
       */
      cy.login('admin')
      cy.verifyLoginSuccess()

      cy.log('✅ BEST PRACTICE: Passwords are never logged')
    })

    it('TC13: Best Practice - Error Handling', () => {
      cy.logTestInfo('TC13', 'Demonstrating error handling')

      /**
       * Custom commands include error handling:
       * - Validate inputs before processing
       * - Provide clear error messages
       * - Fail fast with meaningful messages
       * 
       * Example: cy.login() checks if user type exists in fixture
       */

      // This would throw: 'User type "nonexistent" not found in fixture data'
      // cy.login('nonexistent')

      // Proper usage:
      cy.login('admin')
      cy.verifyLoginSuccess()

      cy.log('✅ BEST PRACTICE: Commands validate inputs and fail gracefully')
    })

    it('TC14: Best Practice - Actionability Checks Built-in', () => {
      cy.logTestInfo('TC14', 'Demonstrating built-in checks')

      cy.visit('https://example.cypress.io/commands/actions')

      /**
       * cy.clickAndWait() includes:
       * - .should('be.visible')
       * - .and('not.be.disabled')
       * 
       * These checks are AUTOMATICALLY applied!
       * No need for team members to remember to add them.
       */
      cy.intercept('GET', '**/comments/*').as('loadData')

      // Note: Just demonstrating the pattern, actual element may not trigger request
      cy.get('.action-btn')
        .should('be.visible')
        .click()

      cy.log('✅ BEST PRACTICE: Actionability checks built into commands')
    })
  })

  // ============================================================================
  // SECTION 5: COMPARING WITH AND WITHOUT CUSTOM COMMANDS
  // ============================================================================

  describe('COMPARISON: With vs Without Custom Commands', () => {

    it('TC15: COMPARISON - Login Flow', () => {
      cy.logTestInfo('TC15', 'Side-by-side comparison')

      /**
       * ═══════════════════════════════════════════════════════════════════
       * ❌ WITHOUT CUSTOM COMMANDS (22 lines):
       * ═══════════════════════════════════════════════════════════════════
       * 
       * cy.visit('https://practicetestautomation.com/practice-test-login/')
       * 
       * cy.get('#username')
       *   .should('be.visible')
       *   .clear()
       *   .type('student')
       * 
       * cy.get('#password')
       *   .should('be.visible')
       *   .clear()
       *   .type('Password123', { log: false })
       * 
       * cy.get('#submit')
       *   .should('be.visible')
       *   .and('not.be.disabled')
       *   .click()
       * 
       * cy.get('.post-title')
       *   .should('be.visible')
       *   .and('contain', 'Logged In Successfully')
       * 
       * cy.url().should('include', 'logged-in-successfully')
       * 
       * ═══════════════════════════════════════════════════════════════════
       * ✅ WITH CUSTOM COMMANDS (2 lines):
       * ═══════════════════════════════════════════════════════════════════
       */

      cy.login('admin')
      cy.verifyLoginSuccess()

      cy.log('═══════════════════════════════════════')
      cy.log('COMPARISON RESULT:')
      cy.log('❌ Without: ~22 lines')
      cy.log('✅ With: 2 lines')
      cy.log('📉 REDUCTION: 91% less code!')
      cy.log('═══════════════════════════════════════')
    })
  })

  // ============================================================================
  // SECTION 6: TYPES OF CUSTOM COMMANDS DEMONSTRATION
  // ============================================================================

  describe('Types of Custom Commands', () => {

    it('TC16: PARENT COMMAND - Starts a new chain', () => {
      cy.logTestInfo('TC16', 'Demonstrating Parent Commands')

      /**
       * PARENT COMMANDS:
       * - Start a new command chain
       * - Like: cy.visit(), cy.get()
       * 
       * Examples we created:
       * - cy.login()
       * - cy.clearAllData()
       * - cy.logTestInfo()
       */

      cy.clearAllData()           // Parent command
      cy.login('admin')           // Parent command
      cy.verifyLoginSuccess()     // Parent command

      cy.log('✅ Parent commands start new chains')
    })

    it('TC17: CHILD COMMAND - Chains off previous command', () => {
      cy.logTestInfo('TC17', 'Demonstrating Child Commands')

      cy.visit('https://example.cypress.io/commands/actions')

      /**
       * CHILD COMMANDS:
       * - Must chain off a previous command
       * - Like: .click(), .type(), .should()
       * 
       * Examples we created:
       * - .typeAndVerify()
       * - .shouldBeVisibleAndContain()
       * - .clickAndWait()
       */

      cy.get('.action-email')
        .typeAndVerify('child@command.com')  // Child command

      cy.get('h1')
        .shouldBeVisibleAndContain('Actions')  // Child command

      cy.log('✅ Child commands chain off elements')
    })

    it('TC18: DUAL COMMAND - Works both ways', () => {
      cy.logTestInfo('TC18', 'Demonstrating Dual Commands')

      cy.visit('https://example.cypress.io/commands/actions')

      /**
       * DUAL COMMANDS:
       * - Can start a chain OR chain off previous command
       * - Like: .contains()
       * 
       * Example we created:
       * - .takeScreenshotWithLabel()
       */

      // As parent (no subject)
      cy.takeScreenshotWithLabel('full-page-dual-demo')

      // As child (with subject)
      cy.get('.action-btn')
        .takeScreenshotWithLabel('button-element-demo')

      cy.log('✅ Dual commands work both ways')
    })
  })

  // ============================================================================
  // SECTION 7: API CUSTOM COMMANDS
  // ============================================================================

  describe('API Testing Custom Commands', () => {

    it('TC19: Using cy.apiGetAndValidate()', () => {
      cy.logTestInfo('TC19', 'API GET with custom command')

      /**
       * cy.apiGetAndValidate() simplifies API testing:
       * - Makes GET request
       * - Validates status code
       * - Returns response for further assertions
       */

      cy.apiGetAndValidate(testData.apiEndpoints.posts, 200)
        .then((response) => {
          expect(response.body).to.be.an('array')
          expect(response.body.length).to.be.greaterThan(0)
        })

      cy.log('✅ API GET validated with custom command')
    })

    it('TC20: Using cy.apiPostAndValidate()', () => {
      cy.logTestInfo('TC20', 'API POST with custom command')

      /**
       * cy.apiPostAndValidate() simplifies POST requests:
       * - Makes POST request with body
       * - Validates status code
       * - Returns response
       */

      const newPost = {
        title: 'Test Post',
        body: 'This is a test post created by custom command',
        userId: 1
      }

      cy.apiPostAndValidate(testData.apiEndpoints.posts, newPost, 201)
        .then((response) => {
          expect(response.body).to.have.property('id')
          expect(response.body.title).to.equal(newPost.title)
        })

      cy.log('✅ API POST validated with custom command')
    })
  })
})

/**
 * ============================================================================
 * 📋 SUMMARY - BENEFITS OF CUSTOM COMMANDS
 * ============================================================================
 * 
 * ✅ BENEFIT 1: REUSABLE AND MODULAR CODE
 *    - Define once, use everywhere
 *    - cy.login('admin') vs 10+ lines of code
 * 
 * ✅ BENEFIT 2: IMPROVED READABILITY
 *    - Self-documenting test steps
 *    - Anyone can understand the test flow
 * 
 * ✅ BENEFIT 3: EASIER MAINTENANCE
 *    - Update ONE file when UI changes
 *    - All tests automatically updated
 * 
 * ✅ BENEFIT 4: ENFORCED BEST PRACTICES
 *    - Consistent naming conventions
 *    - Built-in security (password hiding)
 *    - Standardized error handling
 * 
 * 🔧 FILES STRUCTURE:
 * -------------------
 * commands.js           → Command definitions
 * customCommandData.json → Centralized test data
 * customcommand.cy.js   → Test file using commands
 * 
 * ============================================================================
 */
