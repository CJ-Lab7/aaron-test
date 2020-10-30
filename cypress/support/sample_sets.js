import * as ag from "./ag_enum"
import {failSamples, failAllSamples, openSheet} from "./lims"
import {assertAgRefresh} from "./ag_functions"

// false === failed sample
// true === active sample
export function confirmFailed(failList) {
    for(let i = 0; i < failList.length; i++) {
        if (failList[i]) {
            cy.get(`${ag.SECTION.BODY.LEFT} ${ag.BODY_ELEMENT.ROW}`).eq(i)
                .find(`${ag.BODY_ELEMENT.CHECKBOX}:not(.ag-hidden)`)
        } else {
            cy.get(`${ag.SECTION.BODY.LEFT} ${ag.BODY_ELEMENT.ROW}`).eq(i)
                .find(`${ag.BODY_ELEMENT.CHECKBOX}:not(.ag-hidden)`)
                .should('not.exist')
        } 
    }
}

export function confirmSampleCount(numSamples) {
    cy.get(`${ag.SECTION.BODY.LEFT} ${ag.BODY_ELEMENT.ROW}:not(.ag-hidden)`)
        .its('length')
        .should('eq', numSamples)
}

function completeAllSamples() {
    cy.wait(2000)
    cy.get(`${ag.BODY_ELEMENT.ROW} ${ag.BODY_ELEMENT.COMPLETE}:not([disabled]):not(.ag-hidden)`)
        .each($el => {
            cy.wrap($el).click()
        })
    cy.wait(5)
}

export function completeAll58(sheet, sampleCountList) {
    cy.visit('/#/lims')
    openSheet(sheet)
    // complete all protocols
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[0])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[1])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[2])
    let failList = []
    for (let i = 0; i < sampleCountList[3]; i++) {
        failList.push(true)
    }
    confirmFailed(failList)
    completeAllSamples()
    cy.wait(1000)
    cy.contains('button', 'Save')
        .click()
    assertAgRefresh()
    // archive
    cy.contains('button', 'Archive')
        .click()
    cy.contains('.modal-container button', 'Archive')
        .click()
    cy.contains(ag.HEADER_ELEMENT.CELL, 'Worksheet')
    cy.wait(500)
    cy.contains(ag.BODY_ELEMENT.ROW, sheet)
        .should('not.exist')
}

export function failAllSecond58(sheet, sampleCountList, confirmFailList) {
    cy.visit('/#/lims')
    openSheet(sheet)
    // complete first protocol
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[0])
    // fail all samples in second protocol
    failAllSamples()
    confirmFailed(confirmFailList)
    // archive
    cy.contains('button', 'Archive')
        .click()
    cy.contains('.modal-container button', 'Archive')
        .click()
    cy.contains(ag.HEADER_ELEMENT.CELL, 'Worksheet')
    cy.wait(500)
    cy.contains(ag.BODY_ELEMENT.ROW, sheet)
        .should('not.exist')
}

export function failSomeSecond58(sheet, sampleCountList, failSamplesList, confirmFailList) {
    cy.visit('/#/lims')
    openSheet(sheet)
    // complete first protocol
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    // fail first sample in second protocol
    confirmSampleCount(sampleCountList[0])
    failSamples(failSamplesList)
    confirmFailed(confirmFailList[0])
    // complete other protocols
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[1])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[2])
    confirmFailed(confirmFailList[1])
    completeAllSamples()
    cy.contains('button', 'Save')
        .click()
    assertAgRefresh()
    // archive
    cy.contains('button', 'Archive')
        .click()
    cy.contains('.modal-container button', 'Archive')
        .click()
    cy.contains(ag.BODY_ELEMENT.ROW, 'LM58-x')
    cy.wait(200)
    cy.contains(ag.BODY_ELEMENT.ROW, sheet)
        .should('not.exist')
}

export function failAllThird58(sheet, sampleCountList, confirmFailList) {
    cy.visit('/#/lims')
    openSheet(sheet)
    // complete 2 protocols protocols
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[0])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[1])
    // fail all samples in third protocol
    failAllSamples()
    confirmFailed(confirmFailList)
    // archive
    cy.contains('button', 'Archive')
        .click()
    cy.contains('.modal-container button', 'Archive')
        .click()
    cy.contains(ag.BODY_ELEMENT.ROW, 'LM58-x')
    cy.wait(200)
    cy.contains(ag.BODY_ELEMENT.ROW, sheet)
        .should('not.exist')
}

export function failSomeThird58(sheet, sampleCountList, failSamplesList, confirmFailList) {
    cy.visit('/#/lims')
    openSheet(sheet)
    // complete first 2 protocols
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[0])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[1])
    // fail first sample in third protocol
    failSamples(failSamplesList)
    confirmFailed(confirmFailList[0])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[2])
    confirmFailed(confirmFailList[1])
    // complete last protocol
    completeAllSamples()
    cy.contains('button', 'Save')
        .click()
    assertAgRefresh()
    // archive
    cy.contains('button', 'Archive')
        .click()
    cy.contains('.modal-container button', 'Archive')
        .click()
    cy.contains(ag.BODY_ELEMENT.ROW, 'LM58-x')
    cy.wait(200)
    cy.contains(ag.BODY_ELEMENT.ROW, sheet)
        .should('not.exist')
}

export function failOneBoth58(sheet, sampleCountList, failSamplesList, confirmFailList) {
    cy.visit('/#/lims')
    openSheet(sheet)
    // complete first 2 protocols
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[0])
    // fail first sample in second protocol
    failSamples(failSamplesList[0])
    confirmFailed(confirmFailList[0])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[1])
    // fail last sample in third protocol
    failSamples(failSamplesList[1])
    confirmFailed(confirmFailList[1])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[2])
    confirmFailed(confirmFailList[2])
    // complete last protocol
    completeAllSamples()
    cy.contains('button', 'Save')
        .click()
    assertAgRefresh()
    // archive
    cy.contains('button', 'Archive')
        .click()
    cy.contains('.modal-container button', 'Archive')
        .click()
    cy.contains(ag.BODY_ELEMENT.ROW, 'LM58-x')
    cy.wait(200)
    cy.contains(ag.BODY_ELEMENT.ROW, sheet)
        .should('not.exist')
}

// LM59 complete all samples, then archive
export function completeAll59(sheet, sampleCountList) {
    cy.visit('/#/lims')
    openSheet(sheet)
    // complete all protocols
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[0])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[1])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[2])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[3])
    let failList = []
    for (let i = 0; i < sampleCountList[3]; i++) {
        failList.push(true)
    }
    confirmFailed(failList)
    completeAllSamples()
    cy.contains('button', 'Save')
        .click()
    assertAgRefresh()
    // archive
    cy.contains('button', 'Archive')
        .click()
    cy.contains('.modal-container button', 'Archive')
        .click()
    cy.contains(ag.HEADER_ELEMENT.CELL, 'Worksheet')
    cy.wait(500)
    cy.contains(ag.BODY_ELEMENT.ROW, sheet)
        .should('not.exist')
}

export function failAllSecond59(sheet, sampleCountList, confirmFailList) {
    cy.visit('/#/lims')
    openSheet(sheet)
    // complete first protocol
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[0])
    // fail all samples in second protocol
    failAllSamples()
    confirmFailed(confirmFailList)
    // archive
    cy.contains('button', 'Archive')
        .click()
    cy.contains('.modal-container button', 'Archive')
        .click()
    cy.contains(ag.HEADER_ELEMENT.CELL, 'Worksheet')
    cy.wait(500)
    cy.contains(ag.BODY_ELEMENT.ROW, sheet)
        .should('not.exist')
}

export function failSomeSecond59(sheet, sampleCountList, failSamplesList, confirmFailList) {
    cy.visit('/#/lims')
    openSheet(sheet)
    // complete first protocol
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    // fail sample(s) in second protocol
    confirmSampleCount(sampleCountList[0])
    failSamples(failSamplesList)
    confirmFailed(confirmFailList[0])
    // complete other protocols
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[1])
    confirmFailed(confirmFailList[1])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[2])
    confirmFailed(confirmFailList[2])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[3])
    confirmFailed(confirmFailList[3])
    completeAllSamples()
    cy.contains('button', 'Save')
        .click()
    assertAgRefresh()
    // archive
    cy.contains('button', 'Archive')
        .click()
    cy.contains('.modal-container button', 'Archive')
        .click()
    cy.contains(ag.BODY_ELEMENT.ROW, 'LM59-x')
    cy.wait(200)
    cy.contains(ag.BODY_ELEMENT.ROW, sheet)
        .should('not.exist')
}

export function failAllThird59(sheet, sampleCountList, confirmFailList) {
    cy.visit('/#/lims')
    openSheet(sheet)
    // complete first protocol
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[0])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[1])
    // fail all samples in second protocol
    failAllSamples()
    confirmFailed(confirmFailList)
    // archive
    cy.contains('button', 'Archive')
        .click()
    cy.contains('.modal-container button', 'Archive')
        .click()
    cy.contains(ag.HEADER_ELEMENT.CELL, 'Worksheet')
    cy.wait(500)
    cy.contains(ag.BODY_ELEMENT.ROW, sheet)
        .should('not.exist')
}

export function failSomeThird59(sheet, sampleCountList, failSamplesList, confirmFailList) {
    cy.visit('/#/lims')
    openSheet(sheet)
    // complete first protocol
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[0])
    confirmFailed(confirmFailList[0])
    // complete other protocols
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    // fail sample(s) in third protocol
    confirmSampleCount(sampleCountList[1])
    failSamples(failSamplesList)
    confirmFailed(confirmFailList[1])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[2])
    confirmFailed(confirmFailList[2])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[3])
    confirmFailed(confirmFailList[3])
    completeAllSamples()
    cy.contains('button', 'Save')
        .click()
    assertAgRefresh()
    // archive
    cy.contains('button', 'Archive')
        .click()
    cy.contains('.modal-container button', 'Archive')
        .click()
    cy.contains(ag.BODY_ELEMENT.ROW, 'LM59-x')
    cy.wait(200)
    cy.contains(ag.BODY_ELEMENT.ROW, sheet)
        .should('not.exist')
}

export function failAllFourth59(sheet, sampleCountList, confirmFailList) {
    cy.visit('/#/lims')
    openSheet(sheet)
    // complete first protocols
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[0])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[1])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[2])
    // fail all samples in fourth protocol
    failAllSamples()
    confirmFailed(confirmFailList)
    // archive
    cy.contains('button', 'Archive')
        .click()
    cy.contains('.modal-container button', 'Archive')
        .click()
    cy.contains(ag.HEADER_ELEMENT.CELL, 'Worksheet')
    cy.wait(500)
    cy.contains(ag.BODY_ELEMENT.ROW, sheet)
        .should('not.exist')
}

export function failSomeFourth59(sheet, sampleCountList, failSamplesList, confirmFailList) {
    cy.visit('/#/lims')
    openSheet(sheet)
    // complete first protocol
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[0])
    confirmFailed(confirmFailList[0])
    // complete other protocols
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[1])
    confirmFailed(confirmFailList[1])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    // fail sample(s) in fourth protocol
    confirmSampleCount(sampleCountList[2])
    failSamples(failSamplesList)
    confirmFailed(confirmFailList[2])
    completeAllSamples()
    cy.contains('button', 'Save and Continue')
        .click()
    assertAgRefresh()
    confirmSampleCount(sampleCountList[3])
    confirmFailed(confirmFailList[3])
    completeAllSamples()
    cy.contains('button', 'Save')
        .click()
    assertAgRefresh()
    // archive
    cy.contains('button', 'Archive')
        .click()
    cy.contains('.modal-container button', 'Archive')
        .click()
    cy.contains(ag.BODY_ELEMENT.ROW, 'LM59-x')
    cy.wait(200)
    cy.contains(ag.BODY_ELEMENT.ROW, sheet)
        .should('not.exist')
}