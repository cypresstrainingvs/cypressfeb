// cypress.config.js - Cypress Configuration
// Day 3 Training: Enhanced with file tasks and environment variables
const { defineConfig } = require('cypress')
const fs = require('fs')
const path = require('path')

// Import environment configuration from separate file
const { getEnvConfig } = require('./envconfig')
const envConfig = getEnvConfig()

module.exports = defineConfig({
  projectId: '18jbta',
  e2e: {
    baseUrl: envConfig.baseUrl,
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: envConfig.timeout,
    retries: { runMode: envConfig.retries, openMode: 0 },
    setupNodeEvents(on, config) {
      // ============================================================================
      // DAY 3: FILE SYSTEM TASKS
      // ============================================================================
      on('task', {
        // Check if a file exists
        isFileExist(filePath) {
          return fs.existsSync(filePath) || null
        },
        
        // Delete a file
        deleteFile(filePath) {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
            return 'deleted'
          }
          return 'not found'
        },
        
        // List files in a directory
        getDownloadedFiles(dirPath) {
          if (fs.existsSync(dirPath)) {
            return fs.readdirSync(dirPath)
          }
          return []
        },
        
        // Clear all files in a directory
        clearDownloads(dirPath) {
          if (!fs.existsSync(dirPath)) {
            return 0
          }
          const files = fs.readdirSync(dirPath)
          files.forEach(file => {
            const filePath = path.join(dirPath, file)
            if (fs.statSync(filePath).isFile()) {
              fs.unlinkSync(filePath)
            }
          })
          return files.length
        },
        
        // Log message to terminal
        log(message) {
          console.log(message)
          return null
        }
      })
      
      return config
    }
  },
  
  // ============================================================================
  // ENVIRONMENT VARIABLES (loaded from envconfig.js)
  // ============================================================================
  env: {
    environment: envConfig.name,
    apiUrl: envConfig.apiBaseUrl,
    apiBaseUrl: envConfig.apiBaseUrl,
    authApiUrl: envConfig.authApiUrl,
    mockEnabled: envConfig.mockEnabled,
    debugMode: envConfig.debugMode
  },
  
  video: true,
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  downloadsFolder: 'cypress/downloads',
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports/mochawesome',
    overwrite: false,
    html: true,
    json: true,
    timestamp: 'mmddyyyy_HHMMss'
  }
})
