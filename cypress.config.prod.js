/*
 * Production Environment Configuration
 * =====================================
 * Run with: npx cypress run --config-file cypress.config.prod.js
 */
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.example.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    
    // Production specific settings
    defaultCommandTimeout: 15000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    retries: { runMode: 2, openMode: 0 },
    
    // Environment variables for production
    env: {
      environment: 'production',
      apiBaseUrl: 'https://api.example.com',
      mockEnabled: false,
      debugMode: false,
      logLevel: 'error'
    }
  }
})
