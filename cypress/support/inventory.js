import * as ag from "./ag_enum"

export function openItemDetails(name, type) {
    cy.contains(ag.BODY_ELEMENT.ROW, type)
        .find(ag.BODY_ELEMENT.EXPANDED)
        .click()
    cy.contains(`${ag.LEVEL.ONE} a`, name)
        .click()
}

export function findItems(names, type, exists = true) {
    cy.contains(ag.BODY_ELEMENT.ROW, type)
        .find(ag.BODY_ELEMENT.EXPANDED)
        .click()
    for (let i = 0; i < names.length; i++) {
        if (exists === true) {
            cy.contains(`${ag.LEVEL.ONE} ${ag.BODY_ELEMENT.CELL}`, names[i])
        } else {
            cy.contains(`${ag.LEVEL.ONE} ${ag.BODY_ELEMENT.CELL}`, names[i])
                .should('not.exist')
        }
    }
}

/**
   * Add an item to the inventory app.  Must be at /#/inventory
   *
   * @param {String} name - Name for item
   * @param {String} description - item description
   * @param {String} itemType - item type
   * @param {String} vendor - item vendor
   * @param {String} lotNumber - item lot number
   * @param {String} originalAmount - item starting quantity
  */
export function addItem(name, description, itemType, vendor, lotNumber, originalAmount) {
    cy.contains('button', 'New Item').click()
    cy.contains('.modal-container', 'Add New Inventory Item').should('be.visible')
    cy.get('.modal-container').find('input').eq(0).type(name)
    cy.get('.modal-container').find('input').eq(1).type(description)
    cy.contains('.modal-container', 'Loading item types')
        .should('not.exist')
    cy.get('.modal-container').find('select').eq(0).select(itemType)
    cy.get('.modal-container').find('select').eq(1).select(vendor)
    cy.get('.modal-container').find('input').eq(2).type(lotNumber)
    cy.get('.modal-container').find('input').eq(3).type(originalAmount)
    cy.contains('button', 'Create').click()
    cy.wait(100)
    cy.contains('.modal-container', 'Add New Inventory Item').should('not.be.visible')
}

export function expandItems() {
    cy.get(`${ag.BODY_ELEMENT.EXPANDED}:not(.ag-hidden)`)
        .each($arrow => {
            cy.wrap($arrow)
                .click()
        })
    cy.wait(250)
}

/**
   * Add a usage entry for an inventory item
   *
   * @param {String} usage - The amount of the item to use (this number will be subtracted from item quantity)
   * @param {String} note - note for usage entry
  */
 export function itemUsage(usage, note = ' ') {
    // add usage entry
    cy.contains('button', 'Usage Entry').click()
    cy.get('[data-test="overlay__modal-container"]').find('input').type(usage)
    cy.get('[data-test="overlay__modal-container"]').find('textarea').type(note)
    cy.get('[data-test="overlay__modal-container"]').contains('button', 'Save Entry').click()
    cy.wait(1000)
}