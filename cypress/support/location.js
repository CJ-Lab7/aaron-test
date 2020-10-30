import {getResponseByName} from './api.js'
import * as ag from './ag_enum'


/**
 * Scan a sample barcode to add it to a location in the location details page
 *
 * @param {List} sampleList - list of objects to be added to the location (newBarcode is only required if the barcode will be changed by API)
 *                      Ex: 
 *                      [{
 *                          name: 'LC2620001', 
 *                          location: 'A01',
 *                          newBarcode: 'LC2621asdf1234'
 *                      },
 *                      {
 *                          name: 'LC2620002',
 *                          location: 'C02',
 *                          newBarcode: 'LC2622asdf1234'
 *                      }]
 * @param {Boolean} uuid - true if barcode is a uuid, false otherwise
 * @param {Boolean} fail - true if scan fails, false otherwise
 */
export function scanSamples(sampleList, uuid = true, fail = false) {
    // for each sample: get it's barcode, click a location, "scan" barcode to add sample to that location
    for (let i = 0; i < sampleList.length; i++) {
        cy.contains('.container', sampleList[i].location)
            .click()
        if (uuid) {
            getResponseByName('/api/samples', sampleList[i].name).then((response) => {
                cy.get('body')
                    .type(response.body[0].barcode)
            })
        } else {
            cy.get('body')
                .type(sampleList[i].newBarcode)
        }
        if (fail) {
            cy.contains('.container', sampleList[i].location)
                .contains(sampleList[i].name)
                .should('not.exist')
            cy.contains('.toast', 'Cannot Aliquot')
                .should('be.visible')
                .contains('close')
                .click()
        } else {
            cy.contains('.container', sampleList[i].location)
                .contains(sampleList[i].name)
        }
    }
    // remove focus from container location
    cy.contains('Details for')
        .click()
}

/**
   * Add object to a container
   * must first visit the container details page
   *
   * @param {String} objectName - Name of the sample/container/item
   * @param {String} locationLabel - Label for the container location (A01, C03, etc)
  */
 export function moveToLocation(objectName, locationLabel, position) {
    cy.contains('.sample', objectName)
        .trigger('mousedown', { which: 1, button: 0 })
        .trigger('dragstart', {force: true})

    cy.contains('.container', locationLabel)
        .trigger('dragover', position)
        .trigger('drop', position, { force: true })
        .trigger('mouseup', { which: 1, button: 0 })
    // cy.contains('.sample', objectName).drag('.container:nth-of-type(1)', 'center') //.drag(`.label:contains("${locationLabel}")`)
 }


/**
 * Add samples or containers to the itempool
 * must first visit the container details page
 *
 * @param {String} apiEndpoint - /api/samples or /api/containers
 * @param {String} objectList - list of sample/container names
 */
export function addToPool(apiEndpoint, objectList) {
    for (let i = 0; i < objectList.length; i++) {
        getResponseByName(apiEndpoint, objectList[i])
            .then((response) => {
                // "scan" barcode
                cy.get('body')
                    .type(response.body[0].barcode)
                if (objectList.length > 1) {
                    cy.wait(2000)
                }
            })
    }
}


/**
   * Assert if objects are in the item pool
   * must first visit the container details page
   *
   * @param {String} objectList - list of sample/container names
   * @param {String} fail - does the assertion fail or not
  */
 export function assertPool(objectList, fail = false) {
    for (let i = 0; i < objectList.length; i++) {
        // confirm object is in the pool
        if (fail) {
            cy.contains('.pool .sample_content', objectList[i])
                .should('not.exist')
        } else {
            cy.contains('.pool .sample_content', objectList[i])
        }
    }
 }

/**
 * assert samples are in the correct container location
 * @param {Object} sampleObject - object containing sample name and positions, if 
 * [
        {
            name: 'sampleName1',
            pos: 1 // 0 indexed
            exists: false // sample should not be in this position; optional
        },
        {
            name: 'sampleName2',
            pos: 2
        },
    ]
*/
export function assertSampleLocation(sampleObject) {
    for (let sample of sampleObject) {
        if (!('exists' in sample)) {
            sample.exists = true
        }
        cy.get('.grid-table tbody td > div').eq(sample.pos)
            .then($el => {
                if (sample.exists) {
                    cy.wrap($el)
                        .find('.occupied')
                        .click()
                    cy.contains('.section_content td', sample.name)
                } else { // sample should not be in this location
                    cy.wrap($el)
                        .find('.occupied')
                        .should('not.exist')
                    cy.wrap($el)
                        .click()
                    cy.contains('.section_content td', sample.name)
                        .should('not.exist')
                }
            })
    }
 }

export function openContainerDetails(name) {
     cy.contains(`${ag.BODY_ELEMENT.CELL} a`, name)
        .click()
}

export function findContainer(name, exists=true) {
    if(exists) {
        cy.contains(`${ag.BODY_ELEMENT.CELL} a`, name)
    } else {
        cy.contains(`${ag.BODY_ELEMENT.CELL} a`, name)
            .should('not.exist')
    }
}
 
