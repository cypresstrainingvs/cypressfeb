/*
 * LoginPage.js - Page Object Model for Login Functionality
 * =========================================================
 * 
 * Design Pattern: Page Object Model (POM)
 * 
 * Benefits:
 * 1. Single point of maintenance - If UI changes, update only here
 * 2. Reusable across multiple test files
 * 3. Clean separation of locators and actions
 * 4. Easy to understand and extend
 * 
 * Usage in tests:
 *   import LoginPage from '../../pages/LoginPage'
 *   LoginPage.visit()
 *   LoginPage.login('user@email.com', 'password')
 */

class LoginPage {
  
  // ==========================================================================
  // LOCATORS - All element selectors in one place
  // ==========================================================================
  
  // Using getter methods for lazy evaluation
  get usernameInput() {
    return cy.get('[data-testid="username"], #username, input[name="username"], input[type="email"]').first()
  }
  
  get passwordInput() {
    return cy.get('[data-testid="password"], #password, input[name="password"], input[type="password"]').first()
  }
  
  get loginButton() {
    return cy.get('[data-testid="login-button"], button[type="submit"], input[type="submit"], .login-btn, #login-btn').first()
  }
  
  get errorMessage() {
    return cy.get('[data-testid="error-message"], .error-message, .alert-danger, #error, .error')
  }
  
  get successMessage() {
    return cy.get('[data-testid="success-message"], .success-message, .alert-success, #success')
  }
  
  get rememberMeCheckbox() {
    return cy.get('[data-testid="remember-me"], #remember-me, input[name="remember"]')
  }
  
  get forgotPasswordLink() {
    return cy.get('[data-testid="forgot-password"], a[href*="forgot"], .forgot-password')
  }
  
  get logoutButton() {
    return cy.get('[data-testid="logout"], .logout, #logout, a[href*="logout"]')
  }
  
  // ==========================================================================
  // NAVIGATION METHODS
  // ==========================================================================
  
  // Visit login page
  visit(url = '/login') {
    cy.visit(url)
    return this
  }
  
  // Visit with custom base URL (for different environments)
  visitWithBaseUrl(baseUrl, path = '/login') {
    cy.visit(baseUrl + path)
    return this
  }
  
  // ==========================================================================
  // ACTION METHODS - User interactions
  // ==========================================================================
  
  // Enter username
  enterUsername(username) {
    this.usernameInput.clear().type(username)
    return this
  }
  
  // Enter password
  enterPassword(password) {
    this.passwordInput.clear().type(password, { log: false }) // log: false hides password in logs
    return this
  }
  
  // Click login button
  clickLoginButton() {
    this.loginButton.click()
    return this
  }
  
  // Check remember me
  checkRememberMe() {
    this.rememberMeCheckbox.check()
    return this
  }
  
  // Uncheck remember me
  uncheckRememberMe() {
    this.rememberMeCheckbox.uncheck()
    return this
  }
  
  // Click forgot password
  clickForgotPassword() {
    this.forgotPasswordLink.click()
    return this
  }
  
  // Logout
  logout() {
    this.logoutButton.click()
    return this
  }
  
  // ==========================================================================
  // COMPOSITE METHODS - Common workflows
  // ==========================================================================
  
  // Complete login with username and password
  login(username, password) {
    this.enterUsername(username)
    this.enterPassword(password)
    this.clickLoginButton()
    return this
  }
  
  // Login with remember me option
  loginWithRememberMe(username, password) {
    this.enterUsername(username)
    this.enterPassword(password)
    this.checkRememberMe()
    this.clickLoginButton()
    return this
  }
  
  // Login using fixture data
  loginWithFixture(userType = 'validUser') {
    cy.fixture('loginCredentials').then((credentials) => {
      const user = credentials[userType]
      if (!user) {
        throw new Error(`User type "${userType}" not found in loginCredentials fixture`)
      }
      this.login(user.username, user.password)
    })
    return this
  }
  
  // Login using environment variables
  loginWithEnv() {
    const username = Cypress.env('LOGIN_USERNAME')
    const password = Cypress.env('LOGIN_PASSWORD')
    
    if (!username || !password) {
      throw new Error('LOGIN_USERNAME and LOGIN_PASSWORD environment variables must be set')
    }
    
    this.login(username, password)
    return this
  }
  
  // ==========================================================================
  // ASSERTION METHODS - Verification
  // ==========================================================================
  
  // Verify successful login
  verifyLoginSuccess() {
    // Check URL changed from login page
    cy.url().should('not.include', '/login')
    return this
  }
  
  // Verify login success with redirect URL
  verifyRedirectTo(expectedUrl) {
    cy.url().should('include', expectedUrl)
    return this
  }
  
  // Verify error message displayed
  verifyErrorMessage(expectedMessage) {
    this.errorMessage.should('be.visible').and('contain', expectedMessage)
    return this
  }
  
  // Verify error message exists (without checking content)
  verifyErrorDisplayed() {
    this.errorMessage.should('be.visible')
    return this
  }
  
  // Verify user is on login page
  verifyOnLoginPage() {
    cy.url().should('include', '/login')
    this.usernameInput.should('be.visible')
    this.passwordInput.should('be.visible')
    return this
  }
  
  // Verify logout successful
  verifyLogoutSuccess() {
    cy.url().should('include', '/login')
    return this
  }
  
  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================
  
  // Clear login form
  clearForm() {
    this.usernameInput.clear()
    this.passwordInput.clear()
    return this
  }
  
  // Take screenshot
  takeScreenshot(name) {
    cy.screenshot(name)
    return this
  }
  
  // Wait for login page to load
  waitForPageLoad() {
    this.usernameInput.should('be.visible')
    this.loginButton.should('be.visible')
    return this
  }
}

// Export a singleton instance
export default new LoginPage()
