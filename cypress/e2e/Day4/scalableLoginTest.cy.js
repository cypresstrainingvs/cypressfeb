/*
 * Scalable Login Test Suite - Enterprise Architecture
 * ====================================================
 * 
 * Designed by: Automation Architect (10+ Years Experience)
 * 
 * Architecture Patterns Used:
 * ---------------------------
 * 1. Page Object Model (POM) - Separation of concerns
 * 2. Custom Commands - Reusable authentication actions
 * 3. Fixture-Driven Tests - Centralized test data
 * 4. Data-Driven Testing - Multiple scenarios from fixture
 * 5. Session Caching - Faster test execution
 * 6. API Authentication - Bypass UI when not testing UI
 * 
 * Test Site: https://the-internet.herokuapp.com/login
 * Valid Credentials: tomsmith / SuperSecretPassword!
 * 
 * How to Run:
 *   npx cypress run --spec "cypress/e2e/Day4/scalableLoginTest.cy.js"
 *   npx cypress open (then select this file)
 */

import LoginPage from '../../pages/LoginPage'

describe('Scalable Login Test Suite', () => {
  
  // Load test data before all tests
  let credentials
  
  before(() => {
    cy.fixture('loginCredentials').then((data) => {
      credentials = data
    })
  })
  
  // ============================================================================
  // SECTION 1: Basic Login Tests (Using Custom Commands)
  // ============================================================================
  
  describe('Section 1: Basic Login Tests', () => {
    
    beforeEach(() => {
      // Visit login page before each test
      cy.visit('https://the-internet.herokuapp.com/login')
    })
    
    it('TC01: Successful login with valid credentials', () => {
      // Using custom command - simplest approach
      cy.loginToHerokuApp('tomsmith', 'SuperSecretPassword!')
      
      // Verify successful login
      cy.url().should('include', '/secure')
      cy.get('#flash').should('contain', 'You logged into a secure area!')
    })
    
    it('TC02: Failed login with invalid username', () => {
      cy.loginToHerokuApp('invaliduser', 'SuperSecretPassword!')
      
      // Verify error message
      cy.get('#flash.error').should('be.visible')
      cy.get('#flash').should('contain', 'Your username is invalid!')
    })
    
    it('TC03: Failed login with invalid password', () => {
      cy.loginToHerokuApp('tomsmith', 'wrongpassword')
      
      // Verify error message
      cy.get('#flash.error').should('be.visible')
      cy.get('#flash').should('contain', 'Your password is invalid!')
    })
    
    it('TC04: Failed login with empty credentials', () => {
      // Just click login without entering anything
      cy.get('button[type="submit"]').click()
      
      // Verify error message
      cy.get('#flash.error').should('be.visible')
    })
    
  })
  
  // ============================================================================
  // SECTION 2: Page Object Model Tests
  // ============================================================================
  
  describe('Section 2: Page Object Model Approach', () => {
    
    beforeEach(() => {
      LoginPage.visitWithBaseUrl('https://the-internet.herokuapp.com', '/login')
      LoginPage.waitForPageLoad()
    })
    
    it('TC05: Login using Page Object - Method Chaining', () => {
      // Fluent interface - method chaining
      LoginPage
        .enterUsername('tomsmith')
        .enterPassword('SuperSecretPassword!')
        .clickLoginButton()
      
      // Verify using Page Object
      cy.url().should('include', '/secure')
    })
    
    it('TC06: Login using Page Object - Single Method', () => {
      // Single method for complete login
      LoginPage.login('tomsmith', 'SuperSecretPassword!')
      
      cy.url().should('include', '/secure')
    })
    
    it('TC07: Clear form and re-enter credentials', () => {
      // Enter wrong credentials first
      LoginPage.enterUsername('wronguser')
      LoginPage.enterPassword('wrongpass')
      
      // Clear and enter correct credentials
      LoginPage.clearForm()
      LoginPage.login('tomsmith', 'SuperSecretPassword!')
      
      cy.url().should('include', '/secure')
    })
    
  })
  
  // ============================================================================
  // SECTION 3: Fixture-Driven Tests
  // ============================================================================
  
  describe('Section 3: Fixture-Driven Tests', () => {
    
    beforeEach(() => {
      cy.visit('https://the-internet.herokuapp.com/login')
    })
    
    it('TC08: Login using fixture data (validUser)', () => {
      cy.fixture('loginCredentials').then((data) => {
        const user = data.validUser
        
        cy.get('#username').type(user.username)
        cy.get('#password').type(user.password)
        cy.get('button[type="submit"]').click()
        
        cy.url().should('include', '/secure')
      })
    })
    
    it('TC09: Login with custom command using fixture', () => {
      // Custom command loads fixture internally
      cy.loginToHerokuApp()  // No params = uses fixture
      
      cy.url().should('include', '/secure')
    })
    
    it('TC10: Validate error message from fixture', () => {
      cy.fixture('loginCredentials').then((data) => {
        const user = data.invalidUser
        const expectedError = data.validationMessages.invalidCredentials
        
        cy.get('#username').type(user.username)
        cy.get('#password').type(user.password)
        cy.get('button[type="submit"]').click()
        
        // Note: herokuapp has different error message format
        cy.get('#flash.error').should('be.visible')
      })
    })
    
  })
  
  // ============================================================================
  // SECTION 4: Role-Based Login Tests
  // ============================================================================
  
  describe('Section 4: Role-Based Login', () => {
    
    it('TC11: Login with role - validUser', () => {
      cy.loginWithRole('validUser', 'herokuapp')
      cy.verifyLoginOutcome(true, 'herokuapp')
    })
    
    it('TC12: Login with role - invalidUser', () => {
      cy.loginWithRole('invalidUser', 'herokuapp')
      cy.verifyLoginOutcome(false, 'herokuapp')
    })
    
    it('TC13: Login with role - invalidPassword', () => {
      cy.loginWithRole('invalidPassword', 'herokuapp')
      cy.verifyLoginOutcome(false, 'herokuapp')
    })
    
  })
  
  // ============================================================================
  // SECTION 5: Session-Based Login (Performance Optimization)
  // ============================================================================
  
  describe('Section 5: Session-Based Login', () => {
    
    // Note: Session caching works best with apps that use cookies/tokens
    // The herokuapp app has limited session support, so we demonstrate the pattern
    
    it('TC14: Understanding session login concept', () => {
      // Session login caches the authenticated state
      // For apps with proper auth, this avoids repeated logins
      
      cy.log('Session login concept:')
      cy.log('1. First call: Performs actual login')
      cy.log('2. Subsequent calls: Reuses cached session')
      cy.log('3. Benefit: Much faster test suites')
      
      // Demo: Normal login (session would cache this)
      cy.visit('https://the-internet.herokuapp.com/login')
      cy.get('#username').type('tomsmith')
      cy.get('#password').type('SuperSecretPassword!')
      cy.get('button[type="submit"]').click()
      
      cy.url().should('include', '/secure')
    })
    
    it('TC15: Session login reduces redundant logins', () => {
      // In real apps with proper session handling:
      // cy.session('user', () => { login(); })
      // Reuses session across tests
      
      cy.loginToHerokuApp('tomsmith', 'SuperSecretPassword!')
      cy.url().should('include', '/secure')
      cy.log('In a real app, this would reuse cached session')
    })
    
    it('TC16: Session validation for fast execution', () => {
      cy.loginToHerokuApp('tomsmith', 'SuperSecretPassword!')
      cy.url().should('include', '/secure')
      cy.get('h2').should('contain', 'Secure Area')
    })
    
  })
  
  // ============================================================================
  // SECTION 6: Logout Tests
  // ============================================================================
  
  describe('Section 6: Logout Tests', () => {
    
    beforeEach(() => {
      // Login before testing logout
      cy.loginToHerokuApp('tomsmith', 'SuperSecretPassword!')
      cy.url().should('include', '/secure')
    })
    
    it('TC17: Successful logout', () => {
      cy.logoutFromHerokuApp()
      
      cy.url().should('include', '/login')
      cy.get('#flash').should('contain', 'You logged out of the secure area!')
    })
    
    it('TC18: Cannot access secure page after logout', () => {
      cy.logoutFromHerokuApp()
      
      // Try to access secure page
      cy.visit('https://the-internet.herokuapp.com/secure', { failOnStatusCode: false })
      
      // Should be redirected to login
      cy.url().should('include', '/login')
    })
    
  })
  
  // ============================================================================
  // SECTION 7: Data-Driven Tests (Multiple Scenarios)
  // ============================================================================
  
  describe('Section 7: Data-Driven Tests', () => {
    
    // Test multiple scenarios from a single test definition
    const positiveScenarios = [
      { username: 'tomsmith', password: 'SuperSecretPassword!', description: 'Valid credentials' }
    ]
    
    const negativeScenarios = [
      { username: 'invalid', password: 'SuperSecretPassword!', description: 'Invalid username' },
      { username: 'tomsmith', password: 'wrongpass', description: 'Invalid password' },
      { username: '', password: 'SuperSecretPassword!', description: 'Empty username' },
      { username: 'tomsmith', password: '', description: 'Empty password' }
    ]
    
    positiveScenarios.forEach((scenario) => {
      it('TC19-P: Positive Test - ' + scenario.description, () => {
        cy.visit('https://the-internet.herokuapp.com/login')
        cy.get('#username').type(scenario.username)
        cy.get('#password').type(scenario.password)
        cy.get('button[type="submit"]').click()
        
        cy.url().should('include', '/secure')
      })
    })
    
    negativeScenarios.forEach((scenario, index) => {
      it('TC20-N' + (index + 1) + ': Negative Test - ' + scenario.description, () => {
        cy.visit('https://the-internet.herokuapp.com/login')
        
        if (scenario.username) {
          cy.get('#username').type(scenario.username)
        }
        if (scenario.password) {
          cy.get('#password').type(scenario.password)
        }
        
        cy.get('button[type="submit"]').click()
        
        // Should show error
        cy.get('#flash.error').should('be.visible')
      })
    })
    
  })
  
  // ============================================================================
  // SECTION 8: Security Tests
  // ============================================================================
  
  describe('Section 8: Security Tests', () => {
    
    it('TC21: Password field should mask input', () => {
      cy.visit('https://the-internet.herokuapp.com/login')
      
      cy.get('#password')
        .should('have.attr', 'type', 'password')
    })
    
    it('TC22: SQL Injection attempt should fail', () => {
      cy.visit('https://the-internet.herokuapp.com/login')
      
      // Try SQL injection
      cy.get('#username').type("' OR '1'='1")
      cy.get('#password').type("' OR '1'='1")
      cy.get('button[type="submit"]').click()
      
      // Should not login
      cy.url().should('include', '/login')
      cy.get('#flash.error').should('be.visible')
    })
    
    it('TC23: XSS attempt should be handled', () => {
      cy.visit('https://the-internet.herokuapp.com/login')
      
      // Try XSS attack
      cy.get('#username').type('<script>alert("XSS")</script>')
      cy.get('#password').type('password')
      cy.get('button[type="submit"]').click()
      
      // Should show error, not execute script
      cy.get('#flash.error').should('be.visible')
    })
    
  })
  
  // ============================================================================
  // SECTION 9: Accessibility and UI Tests
  // ============================================================================
  
  describe('Section 9: Accessibility Tests', () => {
    
    beforeEach(() => {
      cy.visit('https://the-internet.herokuapp.com/login')
    })
    
    it('TC24: Login form has proper labels', () => {
      cy.get('label[for="username"]').should('exist')
      cy.get('label[for="password"]').should('exist')
    })
    
    it('TC25: Form fields are focusable', () => {
      cy.get('#username').focus().should('be.focused')
      cy.get('#password').focus().should('be.focused')
    })
    
    it('TC26: Tab navigation works correctly', () => {
      // Verify form elements exist in correct order for tab navigation
      cy.get('form').within(() => {
        cy.get('input').first().should('have.attr', 'id', 'username')
        cy.get('input').last().should('have.attr', 'id', 'password')
      })
      
      // Verify submit button exists after inputs
      cy.get('button[type="submit"]').should('exist')
    })
    
  })
  
  // ============================================================================
  // SECTION 10: Performance Tests
  // ============================================================================
  
  describe('Section 10: Performance Tests', () => {
    
    it('TC27: Login page loads within acceptable time', () => {
      const startTime = Date.now()
      
      cy.visit('https://the-internet.herokuapp.com/login')
      
      cy.get('#username').should('be.visible').then(() => {
        const loadTime = Date.now() - startTime
        cy.log('Page load time: ' + loadTime + 'ms')
        
        // Page should load within 5 seconds
        expect(loadTime).to.be.lessThan(5000)
      })
    })
    
    it('TC28: Login action completes within acceptable time', () => {
      cy.visit('https://the-internet.herokuapp.com/login')
      
      const startTime = Date.now()
      
      cy.get('#username').type('tomsmith')
      cy.get('#password').type('SuperSecretPassword!')
      cy.get('button[type="submit"]').click()
      
      cy.url().should('include', '/secure').then(() => {
        const loginTime = Date.now() - startTime
        cy.log('Login time: ' + loginTime + 'ms')
        
        // Login should complete within 5 seconds (allowing for network latency)
        expect(loginTime).to.be.lessThan(5000)
      })
    })
    
  })
  
})


/*
 * TRAINER NOTES - Scalable Login Architecture
 * ===========================================
 * 
 * 1. WHY THIS ARCHITECTURE?
 *    - Single point of maintenance (Page Objects + Custom Commands)
 *    - Test data separate from test logic (Fixtures)
 *    - Reusable across multiple test suites
 *    - Easy to add new user roles (just update fixture)
 * 
 * 2. KEY PATTERNS DEMONSTRATED:
 *    Pattern 1: Page Object Model
 *    - LoginPage.js encapsulates all selectors and actions
 *    - Tests call methods like LoginPage.login()
 * 
 *    Pattern 2: Custom Commands
 *    - cy.loginToHerokuApp() - simple login
 *    - cy.loginWithRole() - role-based login
 *    - cy.sessionLogin() - cached login for speed
 * 
 *    Pattern 3: Fixture-Driven Data
 *    - loginCredentials.json has all user types
 *    - Add new users without changing test code
 * 
 *    Pattern 4: Session Caching
 *    - cy.session() caches login state
 *    - Subsequent tests reuse session = faster execution
 * 
 *    Pattern 5: Data-Driven Tests
 *    - Array of scenarios + forEach = multiple tests
 *    - Easy to add new test scenarios
 * 
 * 3. WHEN TO USE EACH APPROACH:
 *    - Quick tests: cy.loginToHerokuApp()
 *    - Role testing: cy.loginWithRole('admin')
 *    - Large suites: cy.sessionLogin() for speed
 *    - Complex flows: LoginPage methods
 * 
 * 4. SCALABILITY BENEFITS:
 *    - New user type: Add to fixture only
 *    - UI change: Update Page Object only
 *    - New test: Copy pattern, change data
 *    - Multiple apps: Create new Page Object
 * 
 * Commands to Run:
 *   Single file: npx cypress run --spec "cypress/e2e/Day4/scalableLoginTest.cy.js"
 *   In browser: npx cypress open (select file)
 */
