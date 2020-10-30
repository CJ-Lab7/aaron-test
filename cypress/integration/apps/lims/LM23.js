import * as ag from "../../../support/ag_enum"
import {openSheet} from "../../../support/lims"

describe('23 - I should be able to fail samples', function() {
    // User Story 23: As a user when I am on the Worksheet Details page, I should be able to fail a sample
    before(function() {
        cy.seed('lims/LM23seed')
        cy.loginRoute('alice@example.com', 'L4b7R0cks!')
    })

    beforeEach(function() {
        cy.visit('/#/lims')
    })

    after(function() {
        // teardown not working
        cy.seedTeardown('lims/LM23teardown')
    })

    it('LM-23-1 Should be able to fail a sample row', function() {
        openSheet('LM23-1')
        cy.contains(ag.HEADER_ELEMENT.CELL, 'Text Column')
        cy.wait(1000)
        // Fail first sample
        cy.get(ag.SECTION.BODY.LEFT).find(ag.BODY_ELEMENT.ROW).eq(0).find(ag.BODY_ELEMENT.CHECKBOX).click()
        cy.get('[data-test="worksheet-tab--fail-button"]').click()
        // assert failed
        cy.get('.modal-container textarea')
            .type('qa fail')
        cy.contains('.modal-container button', 'Submit')
            .click()
        cy.contains('.toast', 'Samples failed successfully')
        cy.contains('.toast', 'Samples failed successfully')
            .should('not.be.visible')
        cy.contains('.row-failed', 'LM230001')
        cy.get(ag.SECTION.BODY.LEFT).find(ag.BODY_ELEMENT.ROW).eq(0).find(ag.BODY_ELEMENT.CHECKBOX).should('not.be.visible')
        // Fail two samples
        cy.get(ag.SECTION.BODY.LEFT).find(ag.BODY_ELEMENT.ROW).eq(1).find(ag.BODY_ELEMENT.CHECKBOX).click()
        cy.get(ag.SECTION.BODY.LEFT).find(ag.BODY_ELEMENT.ROW).eq(2).find(ag.BODY_ELEMENT.CHECKBOX).click()
        cy.get('[data-test="worksheet-tab--fail-button"]').click()
        cy.get('.modal-container textarea')
            .type('qa fail')
        cy.contains('.modal-container button', 'Submit')
            .click()
        // assert failed
        cy.contains('.toast', 'Samples failed successfully')
        cy.get('[data-test="worksheet-tab--fail-button"]').should('not.be.visible')
        cy.contains('.row-failed', 'LM230002')
        cy.contains('.row-failed', 'LM230003')
        cy.get(ag.SECTION.BODY.LEFT).find(ag.BODY_ELEMENT.ROW).eq(1).find(ag.BODY_ELEMENT.CHECKBOX).should('not.be.visible')
        cy.get(ag.SECTION.BODY.LEFT).find(ag.BODY_ELEMENT.ROW).eq(2).find(ag.BODY_ELEMENT.CHECKBOX).should('not.be.visible')
    })

    it('LM-23-2 Should not fail samples that are completed', function() {
        openSheet('LM23-2')
        cy.contains(ag.HEADER_ELEMENT.CELL, 'Text Column')
        // checkbox should not be visible when sample is complete
        cy.get(ag.SECTION.BODY.LEFT).find(ag.BODY_ELEMENT.ROW).eq(0).find(ag.BODY_ELEMENT.CHECKBOX).should('not.be.visible')
        cy.get(ag.SECTION.BODY.LEFT).find(ag.BODY_ELEMENT.ROW).eq(1).find(ag.BODY_ELEMENT.CHECKBOX).should('not.be.visible')
        cy.get(ag.SECTION.BODY.LEFT).find(ag.BODY_ELEMENT.ROW).eq(2).find(ag.BODY_ELEMENT.CHECKBOX).should('not.be.visible')
    })
})