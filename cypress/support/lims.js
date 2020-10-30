
import {assertAgRefresh} from "./ag_functions"
import * as ag from "./ag_enum"

// indexList - list of indexes of sample rows to fail
export function failSamples(indexList) {
    for (let index = 0; index < indexList.length; index++ ) {
        cy.get(ag.SECTION.BODY.LEFT).find(ag.BODY_ELEMENT.ROW).find(ag.BODY_ELEMENT.CHECKBOX).eq(indexList[index])
            .click()
    }
    cy.get('[data-test="worksheet-tab--fail-button"]').click()
    cy.get('.modal-container textarea')
        .type('qa fail')
    cy.contains('.modal-container button', 'Submit')
        .click()
    cy.contains('.toast', 'Samples failed successfully')
    cy.get('[data-test="worksheet-tab--fail-button"]').should('not.be.visible')
}


/**
   * Fail all samples in a worksheet
   *
   * @param {String} sheet - The name of the worksheet
  */
 export function failAllSamples() {
    // click all sample checkboxes
    cy.get(ag.SECTION.BODY.LEFT).find(ag.BODY_ELEMENT.ROW).find(ag.BODY_ELEMENT.CHECKBOX)
        .click({multiple: true})
    // fail button
    cy.get('[data-test="worksheet-tab--fail-button"]').click()
    cy.get('.modal-container textarea')
        .type('qa fail')
    cy.contains('.modal-container button', 'Submit')
        .click()
    cy.contains('.toast', 'Samples failed successfully')
    cy.get('[data-test="worksheet-tab--fail-button"]').should('not.be.visible')
}

/**
   * Open a sample sheet.  Must be at /#/lims
   *
   * @param {String} sheet - Name of work sheet to open
  */
 export function openSheet(sheet) {
    cy.contains(ag.HEADER_ELEMENT.CELL, 'Worksheet')
    cy.contains(ag.BODY_ELEMENT.ROW, sheet)
        .find('a')
        .click()
    cy.contains(ag.SECTION.ROOT, 'Complete')
}

/**
   * Create a sample sheet for a submitted experiment.  Must be at /#/lims
   *
   * @param {String} workflow - Name of workflow for submitted experiment
  */
 export function newSheet(workflow, name=workflow) {
    cy.expandExperiments()
    cy.contains('.workflow-instance', workflow)
        .find('[data-test="lab-submissions__experiments--instance--add"]')
        .click()
    cy.get('[data-test="overlay__modal-container"]')
        .find('input[name="name"]')
        .clear()    
        .type(name)
        .should('have.value', name)
    cy.get('[data-test="overlay__modal-container--footer"]')
        .contains('button', 'Add Worksheet')
        .click()
    cy.wait(2000)  // TODO - how to remove?
    openSheet(workflow)
}

/**
   * Save a worksheet and send samples to the next workflow in a chain.  Must be in a lims worksheet
  */
 export function saveAndSend() {
    saveProtocol()
    cy.get('input[value="Send Samples to Next Workflow"]').click()
    cy.contains('.toast-container', 'Samples processed').should('be.visible')
}

/**
   * Save the current protocol and wait until it's done saving
  */
 export function saveProtocol() {
    cy.get('[data-test="worksheet-tab--save-button"]')
        .click()
    cy.get('.loading-dots')
        .should('be.visible')
    cy.get('.loading-dots')
        .should('not.be.visible') 
}

/**
   * Test an expression in lims
   *
   * @param {String} expression - ESP expression to test 
   * @param {String} output - Output of the expression
   * @param {String} sheet - Name of the worksheet
   * @param {String} sampleIndex - Index of sample in the worksheet (top sample is index 0)
  */
 export function testExpression(expression, output, sheet, sampleIndex) {
    // Open worksheet
    openSheet(sheet)
    cy.wait(3000)
    // Create expression link
    cy.contains('Expression Column')
    cy.get(ag.SECTION.BODY.CENTER).find(ag.BODY_ELEMENT.ROW).eq(sampleIndex).find(ag.BODY_ELEMENT.CELL).eq(0)
        .dblclick()
        .find('input')
        .clear({force: true})
        .type(expression, {force: true})
    cy.get('[data-test="worksheet-tab--save-button"]').click()
    cy.contains('Expression Column').should('not.be.visible')
    cy.contains('Expression Column').should('be.visible')

    // Assert links
    cy.get(ag.SECTION.BODY.CENTER).find(ag.BODY_ELEMENT.ROW).eq(sampleIndex).find(ag.BODY_ELEMENT.CELL).eq(0).contains(output)
}

/**
 * Add or remove a sample from a location column
 *
 * @param {String} container - name of container
 * @param {String} location - location label (written in container location)
 * @param {Number} sampleIndex - lims sample row (zero indexed)
 * @param {Number} columnIndex - lims column
 * @param {Number} row - location row in editor
 * @param {Number} col - location column in editor
 * @param {String} action - should either be 'add' or 'delete'
 */
export function locationAction(container, location, sampleIndex, columnIndex, row, col, action, fail, select = true) {
    cy.wait(1000)
    cy.get(`${ag.SECTION.BODY.LEFT} ${ag.BODY_ELEMENT.ROW}[row-index="${sampleIndex}"] a`)
        .then($sampleName => {
            let sampleName = $sampleName[0].innerText
            cy.get(ag.SECTION.BODY.CENTER).find(`${ag.BODY_ELEMENT.ROW}[row-index="${sampleIndex}"]`).find(ag.BODY_ELEMENT.CELL).eq(columnIndex)
                .as('cell')
                .dblclick()
            locationModal(container, location, row, col, action, select, sampleName)
            cy.get('@cell')
                .then($cell => {
                    confirmLocationCell($cell, action, container, location)
                })
        })
}

/**
 * Add or remove a sample from a location column in transpose view
 *
 * @param {String} container - name of container
 * @param {String} location - location label (written in container location)
 * @param {Number} sampleIndex - lims sample row (zero indexed)
 * @param {Number} columnIndex - lims column
 * @param {Number} row - location row in editor
 * @param {Number} col - location column in editor
 * @param {String} action - should either be 'add' or 'delete'
 */
export function locationActionTranspose(container, location, sampleIndex, columnIndex, row, col, action, select = true) {
    cy.wait(1000)
    cy.get(`${ag.SECTION.HEADER.ALL} ${ag.HEADER_ELEMENT.CELL}:nth-child(${columnIndex + 1}) a`)
        .then($sampleName => {
            let sampleName = $sampleName[0].innerText
            cy.get(ag.SECTION.BODY.CENTER).find(ag.BODY_ELEMENT.ROW).eq(columnIndex).find(ag.BODY_ELEMENT.CELL).eq(sampleIndex)
                .as('cell')
                .dblclick()
            locationModal(container, location, row, col, action, select, sampleName)
            cy.get('@cell')
                .then($cell => {
                    confirmLocationCell($cell, action, container, location)
                })
        })
}

function locationModal(container, location, row, col, action, select, sampleName) {
    cy.get(ag.BODY_ELEMENT.POPUP).as('editor')
    if(select === true) {
        cy.get('@editor').find('.multiselect')
            .click()
        cy.get('@editor')
            .contains('.option__desc', container)
            .click()
    }
    cy.get('@editor').find('tbody').find('tr').eq(row).find('td').eq(col + 1)
        .rightclick()
    if (action === 'add') {
        // add sample to cell
        cy.get('@editor').find('.dropdown-input')
            .type(sampleName)
        cy.get('@editor').contains('button', 'Save')
            .click()
        cy.wait(500)
        // confirm cell shows location
        cy.get('@cell').contains(container)
        cy.get('@cell').contains(location)
    } else if (action === 'delete') {
        cy.get('@editor').contains('.sample-searcher i', 'delete')
            .click()
        cy.get('@editor').contains('button', 'Save')
            .click()
        cy.wait(500)
        cy.get('@cell').contains(location)
            .should('not.exist')
    }
}

function confirmLocationCell($cell, action, container, location) {
    if (action === 'add') {
        // confirm cell shows location
        cy.wrap($cell).contains(container)
        cy.wrap($cell).contains(location)
    } else if (action === 'delete') {
        cy.wrap($cell).contains(location)
            .should('not.exist')
    }
}


/**
   * Add a new workflow chain.  Must be at /#/projects/projects
   *
   * @param {String} project - Name for project
   * @param {String} chainName - Name of workflow chain
   * @param {String} expName - Name of the experiment
   * @param {String} numSamples - nubmer of samples to submit
   * @param {String} sampleType - type for the submited samples
  */
export function newChain(project, chainName, expName, desc, numSamples, sampleType) {
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
}

// Click button to go to next protocol
export function nextProtocol() {
    cy.get('[data-test="protocol-button--next"]')
        .click()
}

// Click button to go to previous protocol
export function prevProtocol() {
    cy.get('[data-test="protocol-button--previous"]')
        .click()
}

// Assert that the correct protocol is selected
export function assertProtocolSelect(name, numSamples) {
    cy.contains('[data-test="worksheet__collapsible-panel--protocol-select"] option:selected', `${name} - (${numSamples})`)
}

// select protocol
export function selectProtocol(name) {
    cy.get('[data-test="worksheet__collapsible-panel--protocol-select"]')
        .select(name)
}

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
