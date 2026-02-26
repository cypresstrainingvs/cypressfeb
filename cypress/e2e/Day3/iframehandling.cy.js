/*
 * Handling Iframes in Cypress Tests
 * ==================================
 * 
 * This file demonstrates how to work with iframes in Cypress.
 * Iframes are tricky because they load separate HTML documents,
 * which means Cypress cannot directly access elements inside them.
 * 
 * We'll cover:
 * - Why iframes are challenging for test automation
 * - The pattern to access iframe content
 * - Practical examples with a real WYSIWYG editor
 * - Best practices for reliable iframe tests
 */

describe('Handling Iframes in Cypress', () => {

  // Load test data from fixture before running tests
  let testData

  before(() => {
    cy.fixture('iframeData').then((data) => {
      testData = data
    })
  })


  /*
   * SECTION 1: Understanding the Iframe Challenge
   * ---------------------------------------------
   * Iframes embed completely separate HTML documents.
   * This creates isolation that Cypress cannot penetrate directly.
   */
  describe('Understanding Why Iframes Are Challenging', () => {

    it('demonstrates that Cypress works in the main document context', () => {
      // Visit the TinyMCE editor page
      cy.visit('https://the-internet.herokuapp.com/iframe')

      // This works - finding elements in the main document
      cy.get('h3').should('contain', 'An iFrame containing the TinyMCE WYSIWYG Editor')

      // The editor content is inside an iframe
      // If we try cy.get('p') without accessing the iframe first,
      // Cypress will only search the main document and may not find it
      cy.log('The editor content is isolated inside the iframe')
      cy.log('We need a special approach to access it')
    })

    it('shows the iframe structure on the page', () => {
      cy.visit('https://the-internet.herokuapp.com/iframe')

      // Verify the iframe exists in the main document
      cy.get('#mce_0_ifr')
        .should('exist')
        .and('be.visible')

      // This iframe contains a TinyMCE rich text editor
      // The actual editable content (paragraphs, text) is inside the iframe
      cy.log('Found the TinyMCE iframe with selector: #mce_0_ifr')
    })
  })


  /*
   * SECTION 2: The Pattern to Access Iframe Content
   * -----------------------------------------------
   * To work with iframes, we need to:
   * 1. Get the iframe element
   * 2. Access its contentDocument.body
   * 3. Wrap it so Cypress can use it
   * 
   * We have a custom command 'getIframeBody' that handles this.
   */
  describe('Accessing Iframe Content', () => {

    beforeEach(() => {
      cy.visit('https://the-internet.herokuapp.com/iframe')
    })

    it('accesses the iframe body using our custom command', () => {
      // Use the getIframeBody command we defined in commands.js
      // This returns the body element of the iframe document
      cy.getIframeBody('#mce_0_ifr')
        .should('exist')

      cy.log('Successfully accessed the iframe body')
    })

    it('finds elements inside the iframe', () => {
      // Once we have the iframe body, we can find elements inside it
      cy.getIframeBody('#mce_0_ifr')
        .find('p')                           // Find paragraph element
        .should('exist')
        .and('be.visible')

      cy.log('Found the paragraph element inside the iframe')
    })

    it('reads text content from the iframe', () => {
      cy.getIframeBody('#mce_0_ifr')
        .find('p')
        .invoke('text')
        .then((text) => {
          cy.log('Content inside iframe: ' + text)
          // The default text is "Your content goes here."
          expect(text.length).to.be.greaterThan(0)
        })
    })
  })


  /*
   * SECTION 3: Interacting with Iframe Content
   * ------------------------------------------
   * Now that we can access the iframe, let's interact with it.
   * We'll type text, clear content, and validate changes.
   */
  describe('Typing and Interacting Inside the Iframe', () => {

    beforeEach(() => {
      cy.visit('https://the-internet.herokuapp.com/iframe')
    })

    it('types text inside the iframe editor', () => {
      // Use our custom command that clicks first then types
      // This handles TinyMCE editor activation automatically
      cy.typeInTinyMce('#mce_0_ifr', 'Hello from Cypress!')

      // Verify the text was entered
      cy.getIframeBody('#mce_0_ifr')
        .find('p')
        .should('contain', 'Hello from Cypress!')

      cy.log('Successfully typed text inside the iframe')
    })

    it('clears existing content and types new text', () => {
      const newText = 'This is brand new content'

      // typeInTinyMce uses selectall to replace existing content
      cy.typeInTinyMce('#mce_0_ifr', newText)

      // Verify the new content
      cy.getIframeBody('#mce_0_ifr')
        .find('p')
        .should('have.text', newText)
    })

    it('types longer text with special characters', () => {
      const textWithSpecialChars = 'Testing: Hello and Goodbye! Price is 50 dollars.'

      cy.typeInTinyMce('#mce_0_ifr', textWithSpecialChars)

      cy.getIframeBody('#mce_0_ifr')
        .find('p')
        .should('contain', 'Testing')
        .and('contain', '50 dollars')
    })

    it('uses the convenience command to type in iframe', () => {
      // Alternative: direct body access using the iframe element
      cy.get('#mce_0_ifr').then(($iframe) => {
        const iframeDoc = $iframe[0].contentDocument
        iframeDoc.body.innerHTML = '<p>Typed using direct body access</p>'
      })
      cy.wait(100)

      cy.getIframeBody('#mce_0_ifr')
        .find('p')
        .should('contain', 'Typed using direct body access')
    })
  })


  /*
   * SECTION 4: Using Fixture Data for Tests
   * ---------------------------------------
   * Good practice: Keep test data in fixtures
   * This makes tests more maintainable and data-driven.
   */
  describe('Using Fixture Data with Iframes', () => {

    beforeEach(() => {
      cy.visit('https://the-internet.herokuapp.com/iframe')
    })

    it('types text from fixture data', () => {
      // Use data loaded from iframeData.json
      const textToType = testData.testData.sampleText

      // Use typeInTinyMce for reliable typing
      cy.typeInTinyMce(testData.selectors.tinyMce.iframe, textToType)

      // For verification, check the paragraph
      cy.getIframeBody(testData.selectors.tinyMce.iframe)
        .find(testData.selectors.tinyMce.paragraph)
        .should('contain', textToType)

      cy.log('Test data from fixture: ' + textToType)
    })

    it('types longer text from fixture', () => {
      const longText = testData.testData.longText

      // Use direct iframe element access
      cy.get('#mce_0_ifr').then(($iframe) => {
        const iframeDoc = $iframe[0].contentDocument
        iframeDoc.body.innerHTML = '<p>' + longText + '</p>'
      })
      cy.wait(100)

      cy.getIframeBody('#mce_0_ifr')
        .find('p')
        .invoke('text')
        .should('have.length.greaterThan', 50)
    })
  })


  /*
   * SECTION 5: Best Practices for Iframe Tests
   * ------------------------------------------
   * Tips for writing reliable iframe tests:
   * 1. Always wait for iframe content to load
   * 2. Use should('not.be.empty') to ensure content is ready
   * 3. Keep selectors in fixtures or constants
   * 4. Add appropriate waits for dynamic content
   */
  describe('Best Practices for Reliable Iframe Tests', () => {

    beforeEach(() => {
      cy.visit('https://the-internet.herokuapp.com/iframe')
    })

    it('waits for iframe content to be ready before interacting', () => {
      // Wait for iframe to be visible first
      cy.get('#mce_0_ifr').should('be.visible')
      
      // Use typeInTinyMce which handles waiting internally
      cy.typeInTinyMce('#mce_0_ifr', 'Content is ready!')

      cy.getIframeBody('#mce_0_ifr')
        .find('p')
        .should('contain', 'Content is ready!')
    })

    it('verifies content changes after interaction', () => {
      const originalText = 'Your content goes here.'
      const newText = 'Updated content'

      // First, verify we can see the original or some content
      cy.getIframeBody('#mce_0_ifr')
        .find('p')
        .should('exist')

      // Make changes using typeInTinyMce
      cy.typeInTinyMce('#mce_0_ifr', newText)

      // Verify the change happened
      cy.getIframeBody('#mce_0_ifr')
        .find('p')
        .should('have.text', newText)
        .and('not.contain', originalText)
    })

    it('handles the iframe gracefully if selector uses fixture', () => {
      // Using selectors from fixture makes maintenance easier
      const iframe = testData.selectors.tinyMce.iframe
      const paragraph = testData.selectors.tinyMce.paragraph

      // Use typeInTinyMce with fixture selector
      cy.typeInTinyMce(iframe, 'Fixture-based selectors work great!')

      // Verify using the paragraph selector from fixture
      cy.getIframeBody(iframe)
        .find(paragraph)
        .should('contain', 'Fixture-based selectors')
    })
  })


  /*
   * SECTION 6: Summary
   * ------------------
   * Key points about handling iframes in Cypress:
   * 
   * 1. Iframes load separate documents, isolating their DOM
   * 2. Cypress needs contentDocument.body access to interact
   * 3. Custom commands like getIframeBody make this reusable
   * 4. Always wait for iframe content to load before interacting
   * 5. Use fixtures for selectors and test data
   */
  describe('Summary - Iframe Handling Checklist', () => {

    it('confirms all iframe handling concepts work', () => {
      cy.visit('https://the-internet.herokuapp.com/iframe')

      // Step 1: Access the iframe
      cy.getIframeBody('#mce_0_ifr').should('exist')
      cy.log('Step 1: Accessed iframe body')

      // Step 2: Find element inside iframe
      cy.getIframeBody('#mce_0_ifr')
        .find('p')
        .should('be.visible')
      cy.log('Step 2: Found element inside iframe')

      // Step 3: Interact with element using typeInTinyMce
      cy.typeInTinyMce('#mce_0_ifr', 'All steps complete!')
      cy.log('Step 3: Typed text into editor')

      // Step 4: Verify the interaction
      cy.getIframeBody('#mce_0_ifr')
        .find('p')
        .should('contain', 'All steps complete!')
      cy.log('Step 4: Verified the interaction')

      cy.log('Iframe handling complete!')
    })
  })

})
