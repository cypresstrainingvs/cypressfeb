// cypress.config.cjs  (or cypress.config.js if package.json doesn’t set "type":"module")
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: '18jbta',
  e2e: {
    baseUrl: 'https://example.cypress.io',
    viewportWidth: 1280,
    viewportHeight: 800,
    retries: { runMode: 1, openMode: 0 }, // helpful in CI
    setupNodeEvents(on, config) {
      // add reporters / tasks if needed
      return config
    },
    // If you ever reorganize files:
    // specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'
  },
  video: true,
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports/mochawesome',
    overwrite: false,
    html: true,
    json: true,
    timestamp: 'mmddyyyy_HHMMss'
  }
})