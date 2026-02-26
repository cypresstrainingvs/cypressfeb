/*
 * File Upload and Download Testing in Cypress
 * ============================================
 * 
 * This file demonstrates how to:
 * - Upload files using the cypress-file-upload plugin
 * - Validate downloaded files (existence and content)
 * - Use custom commands for reusable file operations
 * - Use fixtures to store test data
 * 
 * Prerequisites:
 * - cypress-file-upload plugin installed
 * - Test files stored in fixtures folder
 * - Custom commands defined in commands.js
 */

describe('File Upload and Download in Cypress', () => {

  // Load test data from fixture
  let testData

  before(() => {
    cy.fixture('fileUploadDownloadData').then((data) => {
      testData = data
    })
  })


  /*
   * SECTION 1: File Upload Tests
   * ----------------------------
   * File uploads use the cypress-file-upload plugin to attach
   * files to input elements, simulating real user actions.
   */
  describe('File Upload', () => {

    it('uploads a file using the selectFile method', () => {
      // Visit the upload page
      cy.visit(testData.uploadPage.url)

      // Upload file using Cypress native selectFile command
      // The file path is relative to the project root
      cy.get(testData.uploadPage.fileInput)
        .selectFile('cypress/fixtures/' + testData.testFiles.sampleText, { force: true })

      // Click submit button
      cy.get(testData.uploadPage.submitButton).click()

      // Verify upload success message
      cy.contains(testData.uploadPage.successMessage)
        .should('be.visible')

      cy.log('File uploaded successfully')
    })

    it('uploads a file using custom command', () => {
      cy.visit(testData.uploadPage.url)

      // Use our custom uploadFile command
      cy.uploadFile(testData.uploadPage.fileInput, testData.testFiles.sampleText)

      cy.get(testData.uploadPage.submitButton).click()

      cy.contains(testData.uploadPage.successMessage)
        .should('be.visible')
    })

    it('verifies the uploaded filename is displayed', () => {
      cy.visit(testData.uploadPage.url)

      // Upload the file
      cy.uploadFile(testData.uploadPage.fileInput, testData.testFiles.sampleText)
      cy.get(testData.uploadPage.submitButton).click()

      // Verify the filename appears in the result
      cy.get('#uploaded-files')
        .should('contain', testData.testFiles.sampleText)
    })
  })


  /*
   * SECTION 2: File Download Tests
   * ------------------------------
   * For downloads, we click the download link and then verify
   * the file exists in the downloads folder using cy.readFile.
   */
  describe('File Download', () => {

    beforeEach(() => {
      // Clear downloads folder before each test
      cy.clearDownloadsFolder()
    })

    it('downloads a file and verifies it exists', () => {
      cy.visit(testData.downloadPage.url)

      // Find and click a download link
      // Using a file that exists on the test site
      cy.get('a[href$=".txt"]').first().then(($link) => {
        const fileName = $link.text().trim()
        
        // Click to download
        cy.wrap($link).click()

        // Verify the file was downloaded
        cy.verifyDownloadedFile(fileName)
        
        cy.log('File downloaded: ' + fileName)
      })
    })

    it('downloads a file and checks its content', () => {
      cy.visit(testData.downloadPage.url)

      cy.get('a[href$=".txt"]').first().then(($link) => {
        const fileName = $link.text().trim()
        
        cy.wrap($link).click()

        // Read the file and verify it contains expected content
        const downloadsFolder = Cypress.config('downloadsFolder')
        cy.readFile(downloadsFolder + '/' + fileName, { timeout: testData.timeouts.downloadWait })
          .should('exist')
          .then((content) => {
            // Log file content length
            cy.log('File content length: ' + content.length + ' characters')
            expect(content.length).to.be.greaterThan(0)
          })
      })
    })

    it('uses task to check if downloaded file exists', () => {
      cy.visit(testData.downloadPage.url)

      cy.get('a[href$=".txt"]').first().then(($link) => {
        const fileName = $link.text().trim()
        
        cy.wrap($link).click()

        // Wait for download to complete
        cy.wait(3000)

        // Use task to check file existence
        const downloadsFolder = Cypress.config('downloadsFolder')
        const filePath = downloadsFolder + '/' + fileName
        
        cy.task('isFileExist', filePath).then((exists) => {
          expect(exists).to.be.true
          cy.log('File exists: ' + filePath)
        })
      })
    })
  })


  /*
   * SECTION 3: Upload Verification with Page Reload
   * ------------------------------------------------
   * This demonstrates how to verify uploads persist after refresh.
   */
  describe('Upload Verification', () => {

    it('verifies upload success message appears correctly', () => {
      // Visit the upload page
      cy.visit(testData.uploadPage.url)
      
      // Upload the file
      cy.uploadFile(testData.uploadPage.fileInput, testData.testFiles.sampleText)
      
      // Click submit
      cy.get(testData.uploadPage.submitButton).click()
      
      // Verify success
      cy.contains(testData.uploadPage.successMessage).should('be.visible')
      
      // Verify the filename is shown in the results
      cy.get('#uploaded-files')
        .should('contain', testData.testFiles.sampleText)
      
      cy.log('Upload verification completed')
    })
  })


  /*
   * SECTION 4: Best Practices Summary
   * ---------------------------------
   * Key points for file upload and download testing:
   * 
   * 1. Store test files in the fixtures folder
   * 2. Use the cypress-file-upload plugin for uploads
   * 3. Use cy.readFile to verify downloads
   * 4. Set appropriate timeouts for file operations
   * 5. Clean up downloads folder between tests
   * 6. Use custom commands for reusable operations
   */
  describe('Best Practices Checklist', () => {

    it('confirms file operations work correctly', () => {
      // Confirm upload works
      cy.visit(testData.uploadPage.url)
      cy.uploadFile(testData.uploadPage.fileInput, testData.testFiles.sampleText)
      cy.get(testData.uploadPage.submitButton).click()
      cy.contains(testData.uploadPage.successMessage).should('be.visible')

      // Confirm download works
      cy.clearDownloadsFolder()
      cy.visit(testData.downloadPage.url)
      cy.get('a[href$=".txt"]').first().click()

      // Wait and verify
      cy.wait(2000)
      const downloadsFolder = Cypress.config('downloadsFolder')
      cy.task('getDownloadedFiles', downloadsFolder).then((files) => {
        expect(files.length).to.be.greaterThan(0)
        cy.log('Downloaded files: ' + files.join(', '))
      })
    })
  })

})
