/*
 * Development Environment Configuration
 * ======================================
 * Run with: npx cypress run --config-file cypress.config.dev.js
 */
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://dev.example.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    
    // Development specific settings
    defaultCommandTimeout: 8000,
    viewportWidth: 1280,
    viewportHeight: 720,
    retries: { runMode: 0, openMode: 0 },
    
    // Environment variables for development
    env: {
      environment: 'development',
      apiBaseUrl: 'https://dev-api.example.com',
      mockEnabled: true,
      debugMode: true,
      logLevel: 'verbose'
    }
  }
})
