/*
 * envconfig.js - Environment Configuration
 * =========================================
 * 
 * This file contains all environment-specific settings.
 * Import this into cypress.config.js to keep configs separate.
 * 
 * Usage:
 *   Windows:   set CYPRESS_ENV=prod && npx cypress run
 *   Mac/Linux: CYPRESS_ENV=prod npx cypress run
 *   Default:   qa (if CYPRESS_ENV not set)
 */

// Detect current environment from system variable
const currentEnv = process.env.CYPRESS_ENV || 'qa'

// Environment-specific configurations
const environments = {
  
  development: {
    name: 'development',
    baseUrl: 'https://example.cypress.io',
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    authApiUrl: 'https://reqres.in/api',
    mockEnabled: true,
    debugMode: true,
    retries: 0,
    timeout: 8000
  },

  qa: {
    name: 'qa',
    baseUrl: 'https://example.cypress.io',
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    authApiUrl: 'https://reqres.in/api',
    mockEnabled: false,
    debugMode: true,
    retries: 1,
    timeout: 10000
  },

  staging: {
    name: 'staging',
    baseUrl: 'https://example.cypress.io',
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    authApiUrl: 'https://reqres.in/api',
    mockEnabled: false,
    debugMode: false,
    retries: 1,
    timeout: 12000
  },

  production: {
    name: 'production',
    baseUrl: 'https://example.cypress.io',
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    authApiUrl: 'https://reqres.in/api',
    mockEnabled: false,
    debugMode: false,
    retries: 2,
    timeout: 15000
  }
}

// Get configuration for current environment
function getEnvConfig() {
  const config = environments[currentEnv] || environments.qa
  console.log('Environment: ' + config.name)
  return config
}

// Export for use in cypress.config.js
module.exports = {
  currentEnv,
  environments,
  getEnvConfig
}
