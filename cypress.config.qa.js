/*
 * QA Environment Configuration
 * ============================
 * Run with: npx cypress run --config-file cypress.config.qa.js
 */
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://qa.example.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    
    // QA specific settings
    defaultCommandTimeout: 10000,
    viewportWidth: 1366,
    viewportHeight: 768,
    retries: { runMode: 1, openMode: 0 },
    
    // Environment variables for QA
    env: {
      environment: 'qa',
      apiBaseUrl: 'https://qa-api.example.com',
      mockEnabled: false,
      debugMode: true,
      logLevel: 'info'
    }
  }
})
