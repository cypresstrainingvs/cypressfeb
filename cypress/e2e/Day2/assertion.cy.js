/// <reference types="cypress" />

/**
 * ============================================================================
 * CYPRESS ASSERTIONS - COMPREHENSIVE TRAINING GUIDE
 * ============================================================================
 * 
 * WHAT ARE ASSERTIONS?
 * --------------------
 * Assertions are used to verify that the application behaves as expected.
 * They are the actual "checks" in your tests that determine pass/fail.
 * 
 * Cypress provides TWO types of assertions:
 * 
 * 1. IMPLICIT ASSERTIONS (Recommended for UI testing)
 *    - should() and and() methods
 *    - Automatically retry until timeout
 *    - Best for DOM element checks
 *    - Built-in waiting mechanism
 * 
 * 2. EXPLICIT ASSERTIONS (For complex validations)
 *    - Chai's expect() function (BDD style)
 *    - Chai's assert() function (TDD style)
 *    - No automatic retry
 *    - Best for data validation inside .then() callbacks
 * 
 * ASSERTION LIBRARIES:
 * - Chai (expect, assert)
 * - Chai-jQuery (DOM assertions)
 * - Sinon-Chai (spy/stub assertions)
 * 
 * ============================================================================
 */

describe('Cypress Assertions - Training Examples', () => {

  // Variable to store fixture data
  let testData

  // =========================================================================
  // HOOKS
  // =========================================================================
  before(() => {
    cy.log('===== Loading Fixture Data for Assertion Tests =====')
    cy.fixture('assertionData').then((data) => {
      testData = data
    })
  })

  beforeEach(() => {
    // Visit the assertions page before each test
    cy.fixture('assertionData').then((data) => {
      testData = data
      cy.visit(testData.assertionPage.url)
    })
  })

  // =========================================================================
  // SECTION 1: IMPLICIT ASSERTIONS - should()
  // =========================================================================
  /**
   * IMPLICIT ASSERTIONS use .should() and .and()
   * 
   * KEY FEATURES:
   * - Automatically retry until assertion passes or timeout
   * - Default timeout is 4 seconds (configurable)
   * - Perfect for DOM elements that may take time to appear
   * - Chainable - can add multiple assertions
   * 
   * SYNTAX: cy.get(selector).should('assertion', value)
   */
  
  describe('IMPLICIT ASSERTIONS - should() Method', () => {

    // -----------------------------------------------------------------------
    // 1.1 VISIBILITY ASSERTIONS
    // -----------------------------------------------------------------------
    it('should() - Visibility Assertions', () => {
      cy.log('--- VISIBILITY ASSERTIONS ---')
      
      /**
       * .should('be.visible') - Element is visible in viewport
       * Checks: display !== none, visibility !== hidden, opacity > 0
       */
      cy.get('.navbar').should('be.visible')
      cy.log('✓ be.visible - Element is visible to user')

      /**
       * .should('not.be.visible') - Element exists but is hidden
       * Use for elements that are in DOM but not displayed
       */
      // cy.get('.hidden-element').should('not.be.visible')

      /**
       * .should('exist') - Element exists in DOM
       * Does NOT check visibility, only existence
       */
      cy.get('body').should('exist')
      cy.log('✓ exist - Element exists in DOM')

      /**
       * .should('not.exist') - Element does NOT exist in DOM
       * Useful for verifying element was removed
       */
      cy.get('.non-existent-element').should('not.exist')
      cy.log('✓ not.exist - Element does not exist in DOM')
    })

    // -----------------------------------------------------------------------
    // 1.2 TEXT CONTENT ASSERTIONS
    // -----------------------------------------------------------------------
    it('should() - Text Content Assertions', () => {
      cy.log('--- TEXT CONTENT ASSERTIONS ---')

      /**
       * .should('have.text', 'exact text') - Exact text match
       * Case-sensitive, must match exactly including whitespace
       */
      cy.get('h1').first()
        .should('contain.text', 'Assertions')
      cy.log('✓ have.text - Exact text match')

      /**
       * .should('contain', 'partial text') - Contains substring
       * More flexible, checks if text includes the string
       */
      cy.get('.container')
        .should('contain', 'Chai')
      cy.log('✓ contain - Text contains substring')

      /**
       * .should('include.text', 'text') - Similar to contain
       * Alternative syntax for text inclusion
       */
      cy.get('.container')
        .should('include.text', 'BDD')
      cy.log('✓ include.text - Text includes substring')

      /**
       * .should('not.contain', 'text') - Does NOT contain text
       * Verifies absence of specific text
       */
      cy.get('.container')
        .should('not.contain', 'ZZZZZ_NOT_FOUND')
      cy.log('✓ not.contain - Text does not contain substring')

      /**
       * .should('be.empty') - Element has no text content
       * Useful for empty divs, cleared inputs
       */
      // cy.get('.empty-div').should('be.empty')
    })

    // -----------------------------------------------------------------------
    // 1.3 VALUE ASSERTIONS (Form Inputs)
    // -----------------------------------------------------------------------
    it('should() - Input Value Assertions', () => {
      cy.log('--- INPUT VALUE ASSERTIONS ---')

      // Navigate to actions page for input elements
      cy.visit('/commands/actions')

      /**
       * .should('have.value', 'text') - Input has specific value
       * Used for text inputs, textareas, selects
       */
      cy.get('.action-email')
        .type('test@example.com')
        .should('have.value', 'test@example.com')
      cy.log('✓ have.value - Input has specific value')

      /**
       * .should('not.have.value', 'text') - Input does NOT have value
       */
      cy.get('.action-email')
        .clear()
        .should('not.have.value', 'test@example.com')
      cy.log('✓ not.have.value - Input does not have specific value')

      /**
       * .should('be.empty') for inputs - Input is empty
       */
      cy.get('.action-email')
        .should('have.value', '')
      cy.log('✓ have.value (empty) - Input is empty')
    })

    // -----------------------------------------------------------------------
    // 1.4 ATTRIBUTE ASSERTIONS
    // -----------------------------------------------------------------------
    it('should() - Attribute Assertions', () => {
      cy.log('--- ATTRIBUTE ASSERTIONS ---')

      /**
       * .should('have.attr', 'name') - Has attribute
       * Just checks existence of attribute
       */
      cy.get('.navbar-brand')
        .should('have.attr', 'href')
      cy.log('✓ have.attr - Element has attribute')

      /**
       * .should('have.attr', 'name', 'value') - Has attribute with value
       * Checks both attribute existence AND its value
       */
      cy.get('.navbar-brand')
        .should('have.attr', 'href', '/')
      cy.log('✓ have.attr with value - Attribute equals expected value')

      /**
       * .should('not.have.attr', 'name') - Does NOT have attribute
       */
      cy.get('.navbar-brand')
        .should('not.have.attr', 'disabled')
      cy.log('✓ not.have.attr - Element does not have attribute')

      /**
       * .should('have.id', 'id-value') - Has specific ID
       */
      // cy.get('#unique-element').should('have.id', 'unique-element')

      /**
       * .should('have.data', 'key', 'value') - Has data attribute
       * For data-* attributes
       */
      // cy.get('[data-test="element"]').should('have.data', 'test', 'element')
    })

    // -----------------------------------------------------------------------
    // 1.5 CLASS ASSERTIONS
    // -----------------------------------------------------------------------
    it('should() - Class Assertions', () => {
      cy.log('--- CLASS ASSERTIONS ---')

      /**
       * .should('have.class', 'class-name') - Has CSS class
       * Checks if element has specific class
       */
      cy.get('.navbar')
        .should('have.class', 'navbar')
      cy.log('✓ have.class - Element has CSS class')

      /**
       * .should('not.have.class', 'class-name') - Does NOT have class
       * Useful for checking state changes (active/inactive)
       */
      cy.get('.navbar')
        .should('not.have.class', 'hidden')
      cy.log('✓ not.have.class - Element does not have CSS class')

      /**
       * Multiple classes check - element can have multiple classes
       */
      cy.get('.navbar')
        .should('have.class', 'navbar')
        .and('have.class', 'navbar-inverse')
      cy.log('✓ Multiple class checks with and()')
    })

    // -----------------------------------------------------------------------
    // 1.6 STATE ASSERTIONS (Enabled/Disabled/Checked)
    // -----------------------------------------------------------------------
    it('should() - Element State Assertions', () => {
      cy.log('--- ELEMENT STATE ASSERTIONS ---')

      cy.visit('/commands/actions')

      /**
       * .should('be.enabled') - Element is enabled (not disabled)
       * Common for buttons and form inputs
       */
      cy.get('.action-email')
        .should('be.enabled')
      cy.log('✓ be.enabled - Element is enabled')

      /**
       * .should('be.disabled') - Element is disabled
       */
      cy.get('.action-disabled')
        .should('be.disabled')
      cy.log('✓ be.disabled - Element is disabled')

      /**
       * .should('be.checked') - Checkbox/Radio is checked
       */
      cy.get('.action-checkboxes [type="checkbox"]').first()
        .check()
        .should('be.checked')
      cy.log('✓ be.checked - Checkbox is checked')

      /**
       * .should('not.be.checked') - Checkbox/Radio is unchecked
       */
      cy.get('.action-checkboxes [type="checkbox"]').first()
        .uncheck()
        .should('not.be.checked')
      cy.log('✓ not.be.checked - Checkbox is unchecked')

      /**
       * .should('be.selected') - Option is selected
       */
      cy.get('.action-select').select('apples')
      cy.get('.action-select option:selected')
        .should('have.text', 'apples')
      cy.log('✓ Option selected verification')

      /**
       * .should('be.focused') - Element has focus
       */
      cy.get('.action-email').focus()
        .should('be.focused')
      cy.log('✓ be.focused - Element has focus')
    })

    // -----------------------------------------------------------------------
    // 1.7 CSS ASSERTIONS
    // -----------------------------------------------------------------------
    it('should() - CSS Style Assertions', () => {
      cy.log('--- CSS STYLE ASSERTIONS ---')

      /**
       * .should('have.css', 'property') - Has CSS property
       * Checks if element has the CSS property
       */
      cy.get('.navbar')
        .should('have.css', 'display')
      cy.log('✓ have.css - Element has CSS property')

      /**
       * .should('have.css', 'property', 'value') - CSS property equals value
       * Note: Colors are returned as rgb() format
       */
      cy.get('.navbar')
        .should('have.css', 'display', 'block')
      cy.log('✓ have.css with value - CSS property equals value')
    })

    // -----------------------------------------------------------------------
    // 1.8 LENGTH/COUNT ASSERTIONS
    // -----------------------------------------------------------------------
    it('should() - Length and Count Assertions', () => {
      cy.log('--- LENGTH ASSERTIONS ---')

      /**
       * .should('have.length', number) - Exact number of elements
       * Counts matching elements
       */
      cy.get('.assertion-table tbody tr')
        .should('have.length', 3)
      cy.log('✓ have.length - Exact count of elements')

      /**
       * .should('have.length.gt', number) - Greater than
       * More flexible count assertion
       */
      cy.get('ul li')
        .should('have.length.gt', 0)
      cy.log('✓ have.length.gt - Count greater than')

      /**
       * .should('have.length.gte', number) - Greater than or equal
       */
      cy.get('ul li')
        .should('have.length.gte', 1)
      cy.log('✓ have.length.gte - Count greater than or equal')

      /**
       * .should('have.length.lt', number) - Less than
       */
      cy.get('ul li')
        .should('have.length.lt', 100)
      cy.log('✓ have.length.lt - Count less than')

      /**
       * .should('have.length.lte', number) - Less than or equal
       */
      cy.get('ul li')
        .should('have.length.lte', 50)
      cy.log('✓ have.length.lte - Count less than or equal')
    })
  })

  // =========================================================================
  // SECTION 2: IMPLICIT ASSERTIONS - and() Chaining
  // =========================================================================
  /**
   * .and() METHOD
   * 
   * - Alternative to calling .should() multiple times
   * - Chains multiple assertions together
   * - More readable for multiple checks on same element
   * - Same retry behavior as .should()
   */
  
  describe('IMPLICIT ASSERTIONS - and() Chaining', () => {

    it('and() - Chaining Multiple Assertions', () => {
      cy.log('--- CHAINING WITH and() ---')

      /**
       * Chaining multiple assertions on the same element
       * Each assertion must pass for the test to succeed
       */
      cy.get('.navbar')
        .should('be.visible')           // First assertion
        .and('have.class', 'navbar')    // Second assertion
        .and('not.have.class', 'hidden') // Third assertion
      cy.log('✓ Multiple assertions chained with and()')

      /**
       * Complex chaining example with attribute and text
       */
      cy.get('.navbar-brand')
        .should('be.visible')
        .and('have.attr', 'href')
      cy.log('✓ Complex assertion chain')

      /**
       * Chaining assertions on form elements
       */
      cy.visit('/commands/actions')
      cy.get('.action-email')
        .should('be.visible')
        .and('be.enabled')
        .and('have.attr', 'type', 'email')
        .and('have.value', '')
      cy.log('✓ Form element assertion chain')
    })

    it('and() - Callback Function for Custom Assertions', () => {
      cy.log('--- CALLBACK ASSERTIONS ---')

      /**
       * .should() and .and() can take callback functions
       * Useful for custom complex assertions
       * The callback receives the jQuery element as argument
       */
      cy.get('.assertion-table tbody tr')
        .should(($rows) => {
          // Custom assertion inside callback
          expect($rows).to.have.length(3)
          expect($rows.first()).to.contain('Column content')
        })
      cy.log('✓ Callback function assertion')

      /**
       * Using and() with callback after should()
       */
      cy.get('.navbar-brand')
        .should('be.visible')
        .and(($el) => {
          // Access element properties
          const href = $el.attr('href')
          expect(href).to.exist
        })
      cy.log('✓ and() with callback function')
    })
  })

  // =========================================================================
  // SECTION 3: EXPLICIT ASSERTIONS - expect() (BDD Style)
  // =========================================================================
  /**
   * EXPLICIT ASSERTIONS with expect()
   * 
   * - Uses Chai's BDD (Behavior-Driven Development) syntax
   * - expect(value).to.assertion
   * - NO automatic retry - executes immediately
   * - Best used inside .then() callbacks
   * - More powerful for complex data validation
   * 
   * SYNTAX: expect(actual).to.equal(expected)
   */
  
  describe('EXPLICIT ASSERTIONS - expect() BDD Style', () => {

    // -----------------------------------------------------------------------
    // 3.1 EQUALITY ASSERTIONS
    // -----------------------------------------------------------------------
    it('expect() - Equality Assertions', () => {
      cy.log('--- EQUALITY ASSERTIONS ---')

      /**
       * expect().to.equal() - Strict equality (===)
       * Checks value AND type
       */
      const number = testData.testNumbers.positiveNumber // 42 from fixture
      expect(number).to.equal(42)
      cy.log('✓ to.equal - Strict equality')

      /**
       * expect().to.not.equal() - Not equal
       */
      expect(number).to.not.equal(100)
      cy.log('✓ to.not.equal - Not equal')

      /**
       * expect().to.eq() - Alias for equal
       */
      expect(number).to.eq(42)
      cy.log('✓ to.eq - Alias for equal')

      /**
       * expect().to.eql() - Deep equality (for objects/arrays)
       * Compares values, not references
       */
      const array = testData.testArrays.numbers // [1, 2, 3, 4, 5]
      expect(array).to.eql([1, 2, 3, 4, 5])
      cy.log('✓ to.eql - Deep equality for arrays')

      const user = testData.testObjects.user
      expect(user).to.eql({
        name: 'John Doe',
        age: 30,
        email: 'john@example.com',
        isActive: true,
        roles: ['admin', 'user']
      })
      cy.log('✓ to.eql - Deep equality for objects')

      /**
       * expect().to.deep.equal() - Same as eql
       */
      expect(array).to.deep.equal([1, 2, 3, 4, 5])
      cy.log('✓ to.deep.equal - Deep equality')
    })

    // -----------------------------------------------------------------------
    // 3.2 TYPE ASSERTIONS
    // -----------------------------------------------------------------------
    it('expect() - Type Checking Assertions', () => {
      cy.log('--- TYPE ASSERTIONS ---')

      /**
       * expect().to.be.a() / expect().to.be.an() - Type check
       * Checks the type of value
       */
      const str = 'hello'
      const num = 42
      const arr = testData.testArrays.fruits
      const obj = testData.testObjects.user
      const bool = true
      const undef = undefined
      const nul = null

      expect(str).to.be.a('string')
      cy.log('✓ to.be.a("string")')

      expect(num).to.be.a('number')
      cy.log('✓ to.be.a("number")')

      expect(arr).to.be.an('array')
      cy.log('✓ to.be.an("array")')

      expect(obj).to.be.an('object')
      cy.log('✓ to.be.an("object")')

      expect(bool).to.be.a('boolean')
      cy.log('✓ to.be.a("boolean")')

      expect(undef).to.be.undefined
      cy.log('✓ to.be.undefined')

      expect(nul).to.be.null
      cy.log('✓ to.be.null')

      /**
       * expect().to.be.NaN - Check for Not a Number
       */
      expect(NaN).to.be.NaN
      cy.log('✓ to.be.NaN')
    })

    // -----------------------------------------------------------------------
    // 3.3 TRUTHINESS ASSERTIONS
    // -----------------------------------------------------------------------
    it('expect() - Truthiness Assertions', () => {
      cy.log('--- TRUTHINESS ASSERTIONS ---')

      /**
       * expect().to.be.true - Strictly true
       */
      expect(testData.testObjects.user.isActive).to.be.true
      cy.log('✓ to.be.true')

      /**
       * expect().to.be.false - Strictly false
       */
      expect(false).to.be.false
      cy.log('✓ to.be.false')

      /**
       * expect().to.be.ok - Truthy value (not null, undefined, 0, '', false)
       */
      expect(1).to.be.ok
      expect('text').to.be.ok
      expect([]).to.be.ok
      expect({}).to.be.ok
      cy.log('✓ to.be.ok - Truthy values')

      /**
       * expect().to.not.be.ok - Falsy value
       */
      expect(0).to.not.be.ok
      expect('').to.not.be.ok
      expect(null).to.not.be.ok
      expect(undefined).to.not.be.ok
      cy.log('✓ to.not.be.ok - Falsy values')
    })

    // -----------------------------------------------------------------------
    // 3.4 STRING ASSERTIONS
    // -----------------------------------------------------------------------
    it('expect() - String Assertions', () => {
      cy.log('--- STRING ASSERTIONS ---')

      const testString = 'Hello Cypress World'

      /**
       * expect().to.include() - String contains substring
       */
      expect(testString).to.include('Cypress')
      cy.log('✓ to.include - Contains substring')

      /**
       * expect().to.contain() - Alias for include
       */
      expect(testString).to.contain('Hello')
      cy.log('✓ to.contain - Contains substring (alias)')

      /**
       * expect().to.have.string() - Another way to check substring
       */
      expect(testString).to.have.string('World')
      cy.log('✓ to.have.string - Contains substring')

      /**
       * expect().to.match() - Match regex pattern
       * Using pattern from fixture
       */
      const email = testData.testObjects.user.email // john@example.com
      expect(email).to.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      cy.log('✓ to.match - Matches regex pattern')

      /**
       * expect().to.have.length() - String length
       */
      expect(testString).to.have.length(19)
      cy.log('✓ to.have.length - String length')

      /**
       * expect().to.be.empty - Empty string
       */
      expect('').to.be.empty
      cy.log('✓ to.be.empty - Empty string')

      /**
       * expect().to.not.be.empty - Non-empty string
       */
      expect(testString).to.not.be.empty
      cy.log('✓ to.not.be.empty - Non-empty string')
    })

    // -----------------------------------------------------------------------
    // 3.5 NUMBER ASSERTIONS
    // -----------------------------------------------------------------------
    it('expect() - Number Assertions', () => {
      cy.log('--- NUMBER ASSERTIONS ---')

      const num = testData.testNumbers.positiveNumber // 42
      const largeNum = testData.testNumbers.largeNumber // 1000000

      /**
       * expect().to.be.above() / .gt() - Greater than
       */
      expect(num).to.be.above(40)
      expect(num).to.be.gt(40)
      cy.log('✓ to.be.above / gt - Greater than')

      /**
       * expect().to.be.at.least() / .gte() - Greater than or equal
       */
      expect(num).to.be.at.least(42)
      expect(num).to.be.gte(42)
      cy.log('✓ to.be.at.least / gte - Greater than or equal')

      /**
       * expect().to.be.below() / .lt() - Less than
       */
      expect(num).to.be.below(50)
      expect(num).to.be.lt(50)
      cy.log('✓ to.be.below / lt - Less than')

      /**
       * expect().to.be.at.most() / .lte() - Less than or equal
       */
      expect(num).to.be.at.most(42)
      expect(num).to.be.lte(42)
      cy.log('✓ to.be.at.most / lte - Less than or equal')

      /**
       * expect().to.be.within() - Within range
       */
      expect(num).to.be.within(40, 50)
      cy.log('✓ to.be.within - Within range')

      /**
       * expect().to.be.closeTo() - Approximately equal (for decimals)
       */
      const decimal = testData.testNumbers.decimalNumber // 3.14159
      expect(decimal).to.be.closeTo(3.14, 0.01)
      cy.log('✓ to.be.closeTo - Approximately equal')
    })

    // -----------------------------------------------------------------------
    // 3.6 ARRAY ASSERTIONS
    // -----------------------------------------------------------------------
    it('expect() - Array Assertions', () => {
      cy.log('--- ARRAY ASSERTIONS ---')

      const fruits = testData.testArrays.fruits // ['apple', 'banana', 'cherry', 'date']
      const numbers = testData.testArrays.numbers // [1, 2, 3, 4, 5]
      const emptyArr = testData.testArrays.emptyArray // []

      /**
       * expect().to.include() - Array contains element
       */
      expect(fruits).to.include('banana')
      cy.log('✓ to.include - Array contains element')

      /**
       * expect().to.include.members() - Contains all specified elements
       */
      expect(fruits).to.include.members(['apple', 'cherry'])
      cy.log('✓ to.include.members - Contains all specified elements')

      /**
       * expect().to.have.members() - Exact same members (order doesn't matter)
       */
      expect(numbers).to.have.members([5, 4, 3, 2, 1])
      cy.log('✓ to.have.members - Same members (any order)')

      /**
       * expect().to.have.ordered.members() - Same members in exact order
       */
      expect(numbers).to.have.ordered.members([1, 2, 3, 4, 5])
      cy.log('✓ to.have.ordered.members - Same members in order')

      /**
       * expect().to.have.length() - Array length
       */
      expect(fruits).to.have.length(4)
      cy.log('✓ to.have.length - Array length')

      /**
       * expect().to.be.empty - Empty array
       */
      expect(emptyArr).to.be.empty
      cy.log('✓ to.be.empty - Empty array')

      /**
       * expect().to.have.lengthOf.above() - Length greater than
       */
      expect(fruits).to.have.lengthOf.above(3)
      cy.log('✓ to.have.lengthOf.above - Array length greater than')
    })

    // -----------------------------------------------------------------------
    // 3.7 OBJECT ASSERTIONS
    // -----------------------------------------------------------------------
    it('expect() - Object Assertions', () => {
      cy.log('--- OBJECT ASSERTIONS ---')

      const user = testData.testObjects.user
      const nested = testData.testObjects.nestedObject

      /**
       * expect().to.have.property() - Has property
       */
      expect(user).to.have.property('name')
      cy.log('✓ to.have.property - Object has property')

      /**
       * expect().to.have.property() with value - Property equals value
       */
      expect(user).to.have.property('name', 'John Doe')
      cy.log('✓ to.have.property with value')

      /**
       * expect().to.have.keys() - Has all specified keys
       */
      expect(user).to.have.keys(['name', 'age', 'email', 'isActive', 'roles'])
      cy.log('✓ to.have.keys - Has specified keys')

      /**
       * expect().to.include.keys() - Has at least these keys
       */
      expect(user).to.include.keys(['name', 'email'])
      cy.log('✓ to.include.keys - Includes specified keys')

      /**
       * expect().to.have.nested.property() - Nested property access
       * Uses dot notation for nested objects
       */
      expect(nested).to.have.nested.property('level1.level2.level3')
      expect(nested).to.have.nested.property('level1.level2.level3', 'deep value')
      cy.log('✓ to.have.nested.property - Deep property access')

      /**
       * expect().to.deep.include() - Deep inclusion check
       */
      expect(user).to.deep.include({ name: 'John Doe', age: 30 })
      cy.log('✓ to.deep.include - Object contains properties')
    })

    // -----------------------------------------------------------------------
    // 3.8 USING expect() IN .then() CALLBACKS
    // -----------------------------------------------------------------------
    it('expect() - Inside .then() Callbacks', () => {
      cy.log('--- expect() IN CALLBACKS ---')

      /**
       * Using expect() inside .then() to validate element data
       * This is the recommended way to use explicit assertions
       */
      cy.get('ul li').then(($items) => {
        // $items is a jQuery object
        const itemCount = $items.length
        expect(itemCount).to.be.greaterThan(0)
        cy.log(`✓ Item count: ${itemCount}`)

        // Get text from first item
        const firstItemText = $items.first().text()
        expect(firstItemText).to.be.a('string')
        cy.log('✓ First item contains text')
      })

      /**
       * Validating element attributes
       */
      cy.get('.navbar-brand').then(($brand) => {
        const href = $brand.attr('href')
        const text = $brand.text()

        expect(href).to.be.a('string')
        expect(text).to.be.a('string')
        cy.log('✓ Brand element validated')
      })

      /**
       * Working with API response data
       */
      cy.request('GET', 'https://jsonplaceholder.typicode.com/users/1')
        .then((response) => {
          expect(response.status).to.equal(200)
          expect(response.body).to.have.property('id', 1)
          expect(response.body).to.have.property('name')
          expect(response.body.email).to.match(/@/)
          cy.log('✓ API response validated')
        })
    })
  })

  // =========================================================================
  // SECTION 4: EXPLICIT ASSERTIONS - assert() (TDD Style)
  // =========================================================================
  /**
   * EXPLICIT ASSERTIONS with assert()
   * 
   * - Uses Chai's TDD (Test-Driven Development) syntax
   * - assert.method(actual, expected, message)
   * - More traditional assertion style
   * - Provides descriptive error messages
   * 
   * SYNTAX: assert.equal(actual, expected, 'error message')
   */
  
  describe('EXPLICIT ASSERTIONS - assert() TDD Style', () => {

    it('assert() - Equality Assertions', () => {
      cy.log('--- assert EQUALITY ---')

      const num = testData.testNumbers.positiveNumber

      /**
       * assert.equal() - Equal (==) with type coercion
       */
      assert.equal(num, 42, 'Number should equal 42')
      cy.log('✓ assert.equal')

      /**
       * assert.strictEqual() - Strict equality (===)
       */
      assert.strictEqual(num, 42, 'Number should strictly equal 42')
      cy.log('✓ assert.strictEqual')

      /**
       * assert.notEqual() - Not equal
       */
      assert.notEqual(num, 100, 'Number should not equal 100')
      cy.log('✓ assert.notEqual')

      /**
       * assert.deepEqual() - Deep equality for objects/arrays
       */
      const arr = testData.testArrays.numbers
      assert.deepEqual(arr, [1, 2, 3, 4, 5], 'Arrays should be deeply equal')
      cy.log('✓ assert.deepEqual')
    })

    it('assert() - Type Assertions', () => {
      cy.log('--- assert TYPE ---')

      /**
       * assert.isString() - Value is a string
       */
      assert.isString('hello', 'Value should be a string')
      cy.log('✓ assert.isString')

      /**
       * assert.isNumber() - Value is a number
       */
      assert.isNumber(42, 'Value should be a number')
      cy.log('✓ assert.isNumber')

      /**
       * assert.isBoolean() - Value is a boolean
       */
      assert.isBoolean(true, 'Value should be a boolean')
      cy.log('✓ assert.isBoolean')

      /**
       * assert.isArray() - Value is an array
       */
      assert.isArray(testData.testArrays.fruits, 'Value should be an array')
      cy.log('✓ assert.isArray')

      /**
       * assert.isObject() - Value is an object
       */
      assert.isObject(testData.testObjects.user, 'Value should be an object')
      cy.log('✓ assert.isObject')

      /**
       * assert.isFunction() - Value is a function
       */
      assert.isFunction(() => {}, 'Value should be a function')
      cy.log('✓ assert.isFunction')

      /**
       * assert.isNull() / assert.isNotNull()
       */
      assert.isNull(null, 'Value should be null')
      assert.isNotNull('value', 'Value should not be null')
      cy.log('✓ assert.isNull / isNotNull')

      /**
       * assert.isUndefined() / assert.isDefined()
       */
      assert.isUndefined(undefined, 'Value should be undefined')
      assert.isDefined('value', 'Value should be defined')
      cy.log('✓ assert.isUndefined / isDefined')
    })

    it('assert() - Truthiness Assertions', () => {
      cy.log('--- assert TRUTHINESS ---')

      /**
       * assert.isTrue() - Value is strictly true
       */
      assert.isTrue(true, 'Value should be true')
      cy.log('✓ assert.isTrue')

      /**
       * assert.isFalse() - Value is strictly false
       */
      assert.isFalse(false, 'Value should be false')
      cy.log('✓ assert.isFalse')

      /**
       * assert.isOk() - Value is truthy
       */
      assert.isOk(1, 'Value should be truthy')
      assert.isOk('hello', 'Value should be truthy')
      cy.log('✓ assert.isOk')

      /**
       * assert.isNotOk() - Value is falsy
       */
      assert.isNotOk(0, 'Value should be falsy')
      assert.isNotOk('', 'Value should be falsy')
      cy.log('✓ assert.isNotOk')
    })

    it('assert() - Comparison Assertions', () => {
      cy.log('--- assert COMPARISON ---')

      const num = testData.testNumbers.positiveNumber // 42

      /**
       * assert.isAbove() - Greater than
       */
      assert.isAbove(num, 40, 'Number should be above 40')
      cy.log('✓ assert.isAbove')

      /**
       * assert.isAtLeast() - Greater than or equal
       */
      assert.isAtLeast(num, 42, 'Number should be at least 42')
      cy.log('✓ assert.isAtLeast')

      /**
       * assert.isBelow() - Less than
       */
      assert.isBelow(num, 50, 'Number should be below 50')
      cy.log('✓ assert.isBelow')

      /**
       * assert.isAtMost() - Less than or equal
       */
      assert.isAtMost(num, 42, 'Number should be at most 42')
      cy.log('✓ assert.isAtMost')
    })

    it('assert() - String and Array Assertions', () => {
      cy.log('--- assert STRING/ARRAY ---')

      const str = 'Hello Cypress'
      const arr = testData.testArrays.fruits

      /**
       * assert.include() - String/Array includes value
       */
      assert.include(str, 'Cypress', 'String should include "Cypress"')
      assert.include(arr, 'banana', 'Array should include "banana"')
      cy.log('✓ assert.include')

      /**
       * assert.notInclude() - Does not include
       */
      assert.notInclude(str, 'ZZZZZ', 'String should not include "ZZZZZ"')
      cy.log('✓ assert.notInclude')

      /**
       * assert.match() - String matches regex
       */
      assert.match(str, /Cypress/, 'String should match pattern')
      cy.log('✓ assert.match')

      /**
       * assert.lengthOf() - Length equals
       */
      assert.lengthOf(arr, 4, 'Array length should be 4')
      assert.lengthOf(str, 13, 'String length should be 13')
      cy.log('✓ assert.lengthOf')

      /**
       * assert.isEmpty() / assert.isNotEmpty()
       */
      assert.isEmpty(testData.testArrays.emptyArray, 'Array should be empty')
      assert.isNotEmpty(arr, 'Array should not be empty')
      cy.log('✓ assert.isEmpty / isNotEmpty')
    })

    it('assert() - Object Assertions', () => {
      cy.log('--- assert OBJECT ---')

      const user = testData.testObjects.user

      /**
       * assert.property() - Object has property
       */
      assert.property(user, 'name', 'Object should have "name" property')
      cy.log('✓ assert.property')

      /**
       * assert.propertyVal() - Property equals value
       */
      assert.propertyVal(user, 'name', 'John Doe', 'Name should be "John Doe"')
      cy.log('✓ assert.propertyVal')

      /**
       * assert.notProperty() - Does not have property
       */
      assert.notProperty(user, 'nonExistent', 'Should not have property')
      cy.log('✓ assert.notProperty')

      /**
       * assert.hasAllKeys() - Has all specified keys
       */
      assert.hasAllKeys(user, ['name', 'age', 'email', 'isActive', 'roles'])
      cy.log('✓ assert.hasAllKeys')

      /**
       * assert.containsAllKeys() - Contains at least these keys
       */
      assert.containsAllKeys(user, ['name', 'email'])
      cy.log('✓ assert.containsAllKeys')

      /**
       * assert.nestedProperty() - Has nested property
       */
      const nested = testData.testObjects.nestedObject
      assert.nestedProperty(nested, 'level1.level2.level3')
      cy.log('✓ assert.nestedProperty')
    })
  })

  // =========================================================================
  // SECTION 5: COMPARING IMPLICIT vs EXPLICIT ASSERTIONS
  // =========================================================================
  describe('COMPARING IMPLICIT vs EXPLICIT ASSERTIONS', () => {

    it('When to use IMPLICIT (should/and) - DOM Elements', () => {
      cy.log('--- IMPLICIT for DOM ---')

      /**
       * IMPLICIT ASSERTIONS (should/and) are BEST for:
       * 1. DOM element checks
       * 2. Elements that load asynchronously
       * 3. Visibility and state checks
       * 4. Simple value assertions
       * 
       * WHY: Automatic retry until timeout (default 4s)
       */

      // Good use of implicit assertion - element may take time to appear
      cy.get('.navbar')
        .should('be.visible')
        .and('have.class', 'navbar')

      cy.log('✓ Implicit assertions for DOM - auto-retry enabled')
    })

    it('When to use EXPLICIT (expect/assert) - Data Validation', () => {
      cy.log('--- EXPLICIT for DATA ---')

      /**
       * EXPLICIT ASSERTIONS (expect/assert) are BEST for:
       * 1. API response validation
       * 2. Complex object comparisons
       * 3. Mathematical calculations
       * 4. Multiple validations in .then() callbacks
       * 
       * WHY: More powerful assertion options, clear error messages
       */

      // Good use of explicit assertion - API response data
      cy.request('GET', 'https://jsonplaceholder.typicode.com/posts/1')
        .then((response) => {
          // Multiple validations on same response
          expect(response.status).to.equal(200)
          expect(response.body).to.have.property('id', 1)
          expect(response.body.title).to.be.a('string')
          expect(response.body.title).to.have.length.above(0)
          
          // Complex assertion
          assert.isObject(response.body, 'Response body should be an object')
          assert.property(response.body, 'userId', 'Should have userId')
        })

      cy.log('✓ Explicit assertions for data validation')
    })

    it('Combining IMPLICIT and EXPLICIT Assertions', () => {
      cy.log('--- COMBINING BOTH STYLES ---')

      /**
       * You can combine both styles in the same test
       * Use implicit for DOM, explicit in callbacks
       */

      // Implicit: Check element visibility
      cy.get('ul li')
        .should('be.visible')
        .and('have.length.gt', 0)
        // Then use explicit inside callback
        .then(($items) => {
          // Explicit assertions inside callback
          expect($items.length).to.be.greaterThan(0)
          
          $items.each((index, item) => {
            expect(item).to.not.be.null
            assert.exists(item, `Item ${index} should exist`)
          })
        })

      cy.log('✓ Combined implicit and explicit assertions')
    })
  })

})

/**
 * ============================================================================
 * ASSERTIONS QUICK REFERENCE SUMMARY
 * ============================================================================
 * 
 * IMPLICIT ASSERTIONS (should/and) - Auto-retry enabled
 * -----------------------------------------------------
 * Visibility:    .should('be.visible'), .should('not.be.visible')
 *                .should('exist'), .should('not.exist')
 * 
 * Text:          .should('have.text', 'exact'), .should('contain', 'partial')
 *                .should('include.text', 'partial')
 * 
 * Value:         .should('have.value', 'text')
 * 
 * Attribute:     .should('have.attr', 'name', 'value')
 * 
 * Class:         .should('have.class', 'name')
 * 
 * State:         .should('be.enabled'), .should('be.disabled')
 *                .should('be.checked'), .should('be.focused')
 * 
 * CSS:           .should('have.css', 'property', 'value')
 * 
 * Length:        .should('have.length', n), .should('have.length.gt', n)
 * 
 * 
 * EXPLICIT ASSERTIONS - expect() BDD Style
 * ----------------------------------------
 * Equality:      expect(a).to.equal(b), expect(a).to.eql(b)
 * Type:          expect(a).to.be.a('string'), expect(a).to.be.an('array')
 * Truthiness:    expect(a).to.be.true, expect(a).to.be.ok
 * Strings:       expect(s).to.include('x'), expect(s).to.match(/regex/)
 * Numbers:       expect(n).to.be.above(x), expect(n).to.be.within(x, y)
 * Arrays:        expect(a).to.include('x'), expect(a).to.have.members([...])
 * Objects:       expect(o).to.have.property('key', 'value')
 * 
 * 
 * EXPLICIT ASSERTIONS - assert() TDD Style
 * ----------------------------------------
 * Equality:      assert.equal(a, b), assert.deepEqual(a, b)
 * Type:          assert.isString(a), assert.isArray(a), assert.isObject(a)
 * Truthiness:    assert.isTrue(a), assert.isOk(a)
 * Comparison:    assert.isAbove(a, b), assert.isBelow(a, b)
 * Inclusion:     assert.include(a, b), assert.property(obj, 'key')
 * 
 * ============================================================================
 */
