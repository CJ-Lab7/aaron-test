/**
   * Test an expression in lims
   *
   * @param {String} expression - ESP expression to test 
   * @param {String} output - Output of the expression
   * @param {String} sheet - Name of the worksheet
   * @param {String} sampleIndex - Index of sample in the worksheet (top sample is index 0)
  */
 Cypress.Commands.add('testExpression', (expression, output, sheet, sampleIndex) => {
    // Open worksheet
    cy.openSheet(sheet)
    // Create expression link
    cy.contains('Expression Column')
    cy.get('.ag-body-container').find('.ag-row').eq(sampleIndex).find('.ag-cell').eq(0)
        .dblclick()
        .find('input')
        .clear({force: true})
        .type(expression, {force: true})
    cy.get('[data-test="worksheet-tab--save-button"]').click()
    cy.contains('Expression Column').should('not.be.visible')
    cy.contains('Expression Column').should('be.visible')

    // Assert links
    cy.get('.ag-body-container').find('.ag-row').eq(sampleIndex).find('.ag-cell').eq(0).contains(output)
})

/**
   * Fail all samples in a worksheet
   *
   * @param {String} sheet - The name of the worksheet
  */
 Cypress.Commands.add('failAllSamples', () => {
    // click all sample checkboxes
    cy.get('.ag-pinned-left-cols-viewport').find('.ag-row').find('.ag-selection-checkbox')
        .click({multiple: true})
    // fail button
    cy.get('[data-test="worksheet-tab--fail-button"]').click()
    cy.get('[data-test="worksheet-tab--fail-button"]').should('not.be.visible')
})

/**
   * Open a sample sheet.  Must be at /#/lims
   *
   * @param {String} sheet - Name of work sheet to open
  */
 Cypress.Commands.add('openSheet', (sheet) => {
    cy.contains('.ag-row .ag-cell a', sheet)
        .click()
})

/**
   * Open a sample sheet for performance.  Must be at /#/lims
   *
   * @param {String} sheet - Name of work sheet to open
  */
 Cypress.Commands.add('openSheetPerf', (sheet) => {
    cy.get('.ag-body-container >  .ag-row').contains('.ag-cell a', sheet).eq(0).click()
        //.dblclick({force: true})
})

/**
   * Create a sample sheet for a submitted experiment.  Must be at /#/lims
   *
   * @param {String} workflow - Name of workflow for submitted experiment
  */
Cypress.Commands.add('newSheet', (workflow, name=workflow) => {
    cy.expandExperiments()
    cy.contains('.experiment', workflow).find('.new-sheet')
        .click()
    cy.get('[data-test="overlay__modal-container"]').find('input[name="name"]')
        .clear()    
        .type(name)
        .should('have.value', name)
    cy.get('[data-test="overlay__modal-container--footer"]').contains('button', 'Add Worksheet')
        .click()
    cy.wait(2000)  // TODO - how to remove?
    cy.openSheet(workflow)
})

/**
   * Save a worksheet and send samples to the next workflow in a chain.  Must be in a lims worksheet
  */
Cypress.Commands.add('saveAndSend', () => {
    cy.contains('button', 'Save').click()
    cy.get('button .loading-dots').should('be.visible')
    cy.get('button .loading-dots').should('not.be.visible')
    cy.get('input[value="Send Samples to Next Workflow"]').click()
    cy.contains('.toast-container', 'Samples processed').should('be.visible')
})

/**
   * Save the current protocol and wait until it's done saving
  */
Cypress.Commands.add('saveProtocol', () => {
    cy.get('[data-test="worksheet-tab--save-button"]')
        .click()
    cy.get('.loading-dots')
        .should('be.visible')
    cy.get('.loading-dots')
        .should('not.be.visible') 
})

/**
   * expand all experiments (shows details before creating a worksheet)
  */
 Cypress.Commands.add('expandExperiments', () => {
    cy.get('.sample-group-list .arrow--closed')
        .each($el => {
            cy.wrap($el).click()
        })
    cy.wait(50)
})