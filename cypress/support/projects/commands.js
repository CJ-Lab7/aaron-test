/**
   * Add a new workflow chain.  Must be at /#/projects/projects
   *
   * @param {String} project - Name for project
   * @param {String} chainName - Name of workflow chain
   * @param {String} expName - Name of the experiment
   * @param {String} numSamples - nubmer of samples to submit
   * @param {String} sampleType - type for the submited samples
  */
 Cypress.Commands.add('newChain', (project, chainName, expName, desc, numSamples, sampleType) => {
    cy.contains('[data-test="project-list__project-table-row"]', project).contains('button', 'Experiment').click()
    // define experiment
    cy.get('[data-test="new-experiment-modal__form--workflow-chain-radio"]').click()
    cy.get('[data-test="form__workflow-options--select"]').select(chainName)
    cy.get('[data-test="form__workflow--name"]').type(expName).should('have.value', expName)
    cy.get('[data-test="form__workflow--desc"]').type(desc).should('have.value', desc)
    cy.get('[data-test="experiment__footer-button--next"]').click({force:true})
    // add samples
    cy.get('[data-test="options-button"]').contains('Add New Samples').click()
    cy.get('[data-test="samples-add__details-field--number"]').clear().type(numSamples).should('have.value', String(numSamples))
    cy.get('[data-test="samples-add__details-sample--type"]').select(sampleType)
    //cy.get('[data-test="samples-add__details-sample--sequence"]').select('ESP SEQUENCE')
    cy.get('[data-test="experiment__footer-button--next"]').click()
    // review and save
    cy.contains('[data-test="experiment-review__samples-details--project-name"]', project)
    cy.contains('[data-test="experiment-review__samples-details--experiment-name"]', expName)
    cy.contains('[data-test="experiment-review__samples--selected"]', numSamples)
    cy.get('.selectable-sample-table').find('.body').find('.row').its('length').should('eq', numSamples)
    cy.get('.toast-container').should('be.visible').contains('close').click()
    cy.get('[data-test="experiment__footer-button--next"]').click()
    cy.get('[data-test="popup__experiment-samples--submit"]').click()
    cy.get('[data-test="overlay__modal-container"]').should('not.be.visible')
    cy.wait(1000)
})