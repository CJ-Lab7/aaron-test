// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// import { DragSimulator } from './index'
import { dropCommand, dragNDrop } from './sortable'
import * as ag from "./ag_enum"
import {upload_xlsx} from './data'

// Commands
import './enums/apps'
import './navigation/commands'
import './login/commands'
import './projects/commands'
import './lims/commands'

const USE_SSL = Cypress.env('PROTOCOL') == 'https' ? '-s' : ''
const ESP_COMMAND = 'esp ' + USE_SSL + ' -P ' + Cypress.env('PORT') + ' -H ' + Cypress.env('HOST') + ' -u ' + Cypress.env('emailAdmin') + ' -p ' + Cypress.env('passwordAdmin')

/**
   * Drop an element into a list of elements
   * Drag and drop for vuedraggable
   * https://github.com/cypress-io/cypress-example-recipes/pull/204/files
   *
   * @param {HTML Element - Cypress chain} prevSubject - element to start dragging from; yielded from Cypress chain
   * @param {Callback} dropCommand - Triggers mouse and drag events ($source, targetSelector, options)
  */
Cypress.Commands.add('drop', { prevSubject: 'element' }, dropCommand)

/**
   * Drop an element onto another element
   * Drag and drop for vuedraggable
   * https://github.com/cypress-io/cypress-example-recipes/pull/204/files
   *
   * @param {HTML Element - Cypress chain} prevSubject - element to start dragging from; yielded from Cypress chain
   * @param {Callback} dragNDrop - Triggers mouse and drag events, (source, target, position)
  */
 Cypress.Commands.add('dragNDrop', { prevSubject: 'element' }, dragNDrop)

/**
   * Add object to a container
   * must first visit the container details page
   *
   * @param {String} objectName - Name of the sample/container/item
   * @param {String} locationLabel - Label for the container location (A01, C03, etc)
  */
 Cypress.Commands.add('moveToLocation', (objectName, locationLabel, position) => {
    cy.contains('.sample', objectName)
        .trigger('mousedown', { which: 1, button: 0 })
        .trigger('dragstart', {force: true})

    cy.contains('.container', locationLabel)
        .trigger('dragover', position)
        .trigger('drop', position, { force: true })
        .trigger('mouseup', { which: 1, button: 0 })
    // cy.contains('.sample', objectName).drag('.container:nth-of-type(1)', 'center') //.drag(`.label:contains("${locationLabel}")`)
 })

/**
   * Seed ESP database through espclient
   *
   * @param {String} config - {apps_folder}/{seed_file_name}
  */
Cypress.Commands.add('seed', (config) => {
    // TODO - error message checking if file exists
    // try catch to give details about seed not working
    exec(ESP_COMMAND + ' seed --no-overwrite cypress/fixtures/apps/' + config + '.yml', {timeout: 360000})
})

/**
   * Seed ESP database through espclient
   *
   * @param {String} config - {apps_folder}/{seed_file_name}
  */
 Cypress.Commands.add('seedperf', (category, config) => {
    // TODO - error message checking if file exists
    // try catch to give details about seed not working
    exec(ESP_COMMAND + ' seed --no-overwrite cypress/fixtures/' + category + '/' + config + '.yml')
})

/**
   * Import data into the ESP database through espclient
   *
   * @param {String} model - client model (sample, experiment, etc)
   * @param {String} config - {apps_folder}/{seed_file_name}
  */
Cypress.Commands.add('import', (model, config) => {
    // error message checking if file exists
    // try catch to give details about seed not working
    exec(ESP_COMMAND + ' import --no-overwrite ' + model + ' cypress/fixtures/apps/' + config + '.yml')
})

/**
   * Clear data from the ESP database through espclient using the given file
   *
   * @param {String} model - client model (sample, experiment, etc)
   * @param {String} config - {apps_folder}/{seed_file_name}
  */
Cypress.Commands.add('importTeardown', (model, config) => {
    exec(ESP_COMMAND + ' import -f -d ' + model + ' cypress/fixtures/apps/' + config + '.yml')
})

/**
   * Clear data from the ESP database through espclient using the given file
   *
   * @param {String} config - {apps_folder}/{seed_file_name}
  */
Cypress.Commands.add('seedTeardown', (config) => {
    exec(ESP_COMMAND + ' seed -f -d cypress/fixtures/apps/' + config + '.yml', {timeout: 360000, failOnNonZeroExit: false})
})

/**
   * Clear data from the ESP database through espclient using the given file
   *
   * @param {String} config - {apps_folder}/{seed_file_name}
  */
Cypress.Commands.add('seedperfTeardown', (category, config) => {
    cy.exec(ESP_COMMAND + ' seed -f -d cypress/fixtures/' + category + '/' + config + '.yml', {timeout: 360000})
})

/**
   * Confirm the value in a column
   *
   * @param {String} header - Name of the column in the header
   * @param {String} data - value in the column
  */
Cypress.Commands.add('columnValue', (header, data) => {
    cy.get('.header').find('.row').contains('.col', header).then(($order) => {
        let classes = $order[0].classList
        let pos
        classes.forEach(function(value, index) {
            if(value.includes('order'))
            pos = '.' + classes[index]
        })
        cy.get('.body').find('.row').contains(pos, data)
    })
})

/**
   * Sort a column by clicking on the header
   *
   * @param {String} columnName - Name of column in the header
   * @param {Number} columnPos - position of the column in the header (0 index)
   * @param {String} headerSelector - selector for table row
   * @param {String} rowSelector - selector for table row
  */
Cypress.Commands.add('sortColumn', (columnName, columnPos, headerSelector, rowSelector) => {
    cy.get(headerSelector).contains(columnName).as('nameCol').click()
    cy.wait(500)
    cy.get(rowSelector).then(($rows) => {
        const len = $rows.length
        const name0 = $rows[0].children[columnPos].textContent
        const nameLast = $rows[len - 1].children[columnPos].textContent
        // reverse order
        cy.get('@nameCol').click()
        cy.wait(500)
        cy.get(rowSelector).then(($rowsNew) => {
            const name0New = $rowsNew[0].children[columnPos].textContent
            const nameLastNew = $rowsNew[len - 1].children[columnPos].textContent
            expect(name0New).to.eq(nameLast)
            expect(nameLastNew).to.eq(name0)
        })
    })
})

/**
   * Close all open resource tabs (items, samples, etc)
  */
 Cypress.Commands.add('closeAllResources', (usage, note = ' ') => {
    // add usage entry
    cy.get('.nav').find('.recent-resource').children().then(($span) => {
        if($span[0].children.length > 0) {
            cy.get('.nav').find('.tab').each(($tab) => {
                cy.wrap($tab).find('.close').click()
            })
        }
    })
    cy.wait(100)
})

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

// Cypress.on('fail', (err, runnable) => {

//     // we now have access to the err instance
//     // and the mocha runnable this failed on
//   })

Cypress.Commands.add('drag', {
    prevSubject: 'element',
}, (...args) => DragSimulator.simulate(...args));

/**
 * 
 *
 * @param {String} iframeSelector
 * @param {String} elSelector
 */
Cypress.Commands.add('iframe', (iframeSelector, elSelector) => {
    return cy
        .get(`iframe${iframeSelector || ''}`, { timeout: 10000 })
        .should($iframe => {
            expect($iframe.contents().find(elSelector||'body')).to.exist
        })
        .then($iframe => {
            return cy.wrap($iframe.contents().find('body'))
        })
})

/**
 * 
 */
Cypress.Commands.add('espScrollIntoView', { prevSubject: 'element', }, (subject) => {
    cy.wrap(subject).scrollIntoView().should('be.visible').then((element) => {
        cy.wrap(element).invoke('height').should('be.greaterThan', 0)
        cy.wrap(element).invoke('width').should('be.greaterThan', 0)
    })
    // Hack to yield the prevSubject element for chaining.
    cy.wrap(subject)
})

Cypress.Commands.add('espClick', { prevSubject: 'element' }, (subject) => {
    try {
        cy.log('first click').then(() => {
            subject.click()
        })
    }
    catch {
        cy.wrap(subject).espClickImpl(subject.width(), subject.height())
    }
    finally {
        cy.wrap(subject)
    }
})

Cypress.Commands.add('espClickImpl', { prevSubject:'element' }, (subject, width , height) => {
    if(subject.width() <= 0) {
        throw new Error('Unable to find a location to click within the current element: {0}', subject)
    } else {
        try {
            cy.log('impl click').then(() => {
                subject.click(width - 1, height)
            })
        }
        catch {
            cy.wrap(subject).espClickImpl(width - 1, height)
        }
    }
})

// exec function with full error message
const exec = command => {
    cy.exec(command, { failOnNonZeroExit: false }).then(result => {
      if (result.code) {
        throw new Error(`Execution of "${command}" failed
        Exit code: ${result.code}
        Stdout:\n${result.stdout}
        Stderr:\n${result.stderr}`);
      }
    })
  }