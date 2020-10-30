import * as ag from "../ag_enum"

const USE_SSL = Cypress.env('PROTOCOL') == 'https' ? '-s' : ''

export function filterName(test_num) {
    filterElementsWithDiv(test_num, 'resource-name', `SP42_${test_num}`, 4, 'include.text', 'include.text', 'include.text')
    filterElementsWithDiv(test_num, 'resource-name', '_1', 1, 'include.text', 'not.include.text', 'not.include.text')
    filterElementsWithDiv(test_num, 'resource-name', '{backspace}2', 1, 'not.include.text', 'include.text', 'not.include.text')
    filterEmptyElementsWithDiv('resource-name', '1')
}

export function filterDescription(test_num, desc, nos_results) {
    filterElementsWithDiv(test_num, 'resource-desc', desc, nos_results, 'include.text', 'include.text', 'include.text')
    filterElementsWithDiv(test_num, 'resource-desc', ' 1', 1, 'include.text', 'not.include.text', 'not.include.text')
    filterElementsWithDiv(test_num, 'resource-desc', '{backspace}3', 1, 'not.include.text', 'not.include.text', 'include.text')
    filterEmptyElementsWithDiv('resource-desc', '1')
}

export function filterTags(test_num) {
    filterElements(test_num, 'resource-tags', 'SP42_1{enter}', 2, 'not.include.text', 'include.text', 'include.text')
    filterElements(test_num, 'resource-tags', '{backspace}SP42_3{enter}', 2, 'include.text', 'not.include.text', 'include.text')
    filterElements(test_num, 'resource-tags', '{backspace}SP42_2{enter}', 1, 'include.text', 'not.include.text', 'not.include.text')
    filterEmptyElements('resource-tags', '{backspace}SP42_4{enter}')
}

export function clearFilter(test_num, nos_results) {
    cy.get(`${ag.BODY_ELEMENT.POPUP} .filter-panel-apps .advanced_filters button`).click()
    cy.wait(2000)
    checkResults(test_num, nos_results, 'include.text', 'include.text', 'include.text')
}

export function filterOwner(test_num, nos_number, resource_name) {
    filterElementsWithDiv(test_num, 'resource-owner', 'syst', nos_number - 1, 'include.text', 'include.text', 'include.text')
    cy.get(`${ag.BODY_ELEMENT.POPUP} ${ag.BODY_ELEMENT.CELL} span`).should('not.include.text', 'New report')

    filterElementsWithDiv(test_num, 'resource-owner', '{backspace}{backspace}{backspace}{backspace}Alice', 1, 'not.include.text', 'not.include.text', 'not.include.text')
    cy.get(`${ag.BODY_ELEMENT.POPUP} ${ag.BODY_ELEMENT.CELL} span`).should('include.text', resource_name)

    filterEmptyElementsWithDiv('resource-owner', '1')
}

export function filterSampleName(test_num) {
    filterSampleWithDiv(test_num, 'entities-filter-name', `SP42_${test_num}`, 4, 'include.text', 'include.text', 'include.text')
    filterSampleWithDiv(test_num, 'entities-filter-name', '_1', 1, 'include.text', 'not.include.text', 'not.include.text')
    filterSampleWithDiv(test_num, 'entities-filter-name', '{backspace}2', 1, 'not.include.text', 'include.text', 'not.include.text')
    filterEmptySampleWithDiv('entities-filter-name', '1')
}

export function filterSampleDescription(test_num, desc, nos_results) {
    filterSampleWithDiv(test_num, 'entities-filter-description', desc, nos_results, 'include.text', 'include.text', 'include.text')
    filterSampleWithDiv(test_num, 'entities-filter-description', ' 1', 1, 'include.text', 'not.include.text', 'not.include.text')
    filterSampleWithDiv(test_num, 'entities-filter-description', '{backspace}3', 1, 'not.include.text', 'not.include.text', 'include.text')
    filterEmptySampleWithDiv('entities-filter-description', '1')
}

export function filterSampleTags(test_num) {
    filterSampleWithDiv(test_num, 'renderless-tag-input__tag-input-text', 'SP42_1{enter}', 2, 'not.include.text', 'include.text', 'include.text')
    filterSampleWithDiv(test_num, 'renderless-tag-input__tag-input-text', '{backspace}SP42_3{enter}', 2, 'include.text', 'not.include.text', 'include.text')
    filterSampleWithDiv(test_num, 'renderless-tag-input__tag-input-text', '{backspace}SP42_2{enter}', 1, 'include.text', 'not.include.text', 'not.include.text')
    filterEmptySampleWithDiv('renderless-tag-input__tag-input-text', '{backspace}SP42_4{enter}')
}

export function clearSampleFilter(test_num, nos_results) {
    cy.get(`${ag.BODY_ELEMENT.POPUP} .filter-panel-apps .advanced_filters button`).click()
    cy.wait(2000)
    checkResults(test_num, nos_results, 'include.text', 'include.text', 'include.text')
}

export function filterSampleOwner(test_num, nos_number, resource_name) {
    filterSampleWithDiv(test_num, 'entities-filter-owner', 'syst', nos_number - 1, 'include.text', 'include.text', 'include.text')
    cy.get(`${ag.BODY_ELEMENT.POPUP} ${ag.BODY_ELEMENT.CELL} span`).should('not.include.text', 'New report')

    filterSampleWithDiv(test_num, 'entities-filter-owner', '{backspace}{backspace}{backspace}{backspace}Alice', 1, 'not.include.text', 'not.include.text', 'not.include.text')
    cy.get(`${ag.BODY_ELEMENT.POPUP} ${ag.BODY_ELEMENT.CELL} span`).should('include.text', resource_name)

    filterEmptySampleWithDiv('entities-filter-owner', '1')
}

export function visitContain(sample) {
    cy.visit('/#/samples')
    cy.wait(4000)
    cy.contains('a', sample, { timeout: 30000 }).click()
    cy.wait(2000)
}

export function filterElements(test_num, label, label_value, number, firstStatus, secondStatus, thirdStatus) {
    cy.get(`${ag.BODY_ELEMENT.POPUP} .filter-panel-apps .filter`).find(`div[name=${label}]`).find(`input`).type(label_value, { force: true })
    clickSearch()
    checkResults(test_num, number, firstStatus, secondStatus, thirdStatus)
}

export function filterSampleDate(test_num, label, label_value, number, firstStatus, secondStatus, thirdStatus) {
    cy.get(`${ag.BODY_ELEMENT.POPUP} .filter-panel-apps`).find(`div[data-test=${label}]`).find(`input`).type(label_value, { force: true }).type('{enter}')
    clickSearch()
    checkResults(test_num, number, firstStatus, secondStatus, thirdStatus)
}

export function filterEmptySampleDate(test_num, label, label_value, number, firstStatus, secondStatus, thirdStatus) {
    cy.get(`${ag.BODY_ELEMENT.POPUP} .filter-panel-apps`).find(`div[data-test=${label}]`).find(`input`).type(label_value, { force: true }).type('{enter}').type('{enter}')
    clickSearch()
    cy.get(`${ag.BODY_ELEMENT.POPUP} ${ag.BODY_ELEMENT.CHECKBOX}`).should('not.be.visible')
}

export function filterElementsWithDiv(test_num, label, label_value, number, firstStatus, secondStatus, thirdStatus) {
    cy.get(`${ag.BODY_ELEMENT.POPUP} .filter-panel-apps .filter div`).find(`input[name=${label}]`).type(label_value, { force: true })
    clickSearch()
    checkResults(test_num, number, firstStatus, secondStatus, thirdStatus)
}

export function filterSampleWithDiv(test_num, label, label_value, number, firstStatus, secondStatus, thirdStatus) {
    cy.get(`${ag.BODY_ELEMENT.POPUP} .filter-panel-apps div`).find(`input[data-test=${label}]`).type(label_value, { force: true })
    clickSearch()
    checkResults(test_num, number, firstStatus, secondStatus, thirdStatus)
}

export function filterEmptyElements(label, label_value) {
    cy.get(`${ag.BODY_ELEMENT.POPUP} .filter-panel-apps .filter`).find(`div[name=${label}]`).find(`input`).type(label_value, { force: true })
    clickSearch()
    cy.get(`${ag.BODY_ELEMENT.POPUP} ${ag.BODY_ELEMENT.CHECKBOX}`).should('not.be.visible')
}

export function filterEmptyElementsWithDiv(label, label_value) {
    cy.get(`${ag.BODY_ELEMENT.POPUP} .filter-panel-apps .filter div`).find(`input[name=${label}]`).type(label_value, { force: true })
    clickSearch()
    cy.get(`${ag.BODY_ELEMENT.POPUP} ${ag.BODY_ELEMENT.CHECKBOX}`).should('not.be.visible')
}

export function filterEmptySampleWithDiv(label, label_value) {
    cy.get(`${ag.BODY_ELEMENT.POPUP} .filter-panel-apps div`).find(`input[data-test=${label}]`).type(label_value, { force: true })
    clickSearch()
    cy.get(`${ag.BODY_ELEMENT.POPUP} ${ag.BODY_ELEMENT.CHECKBOX}`).should('not.be.visible')
}

export function clickSearch() {
    cy.get(`${ag.BODY_ELEMENT.POPUP} .search-button`).click()
    cy.wait(1000)
}

export function checkResults(test_num, number, firstStatus, secondStatus, thirdStatus) {
    cy.get(`${ag.BODY_ELEMENT.POPUP} ${ag.BODY_ELEMENT.CHECKBOX}`).its('length').should('eq', number)
    cy.get(`${ag.BODY_ELEMENT.POPUP} ${ag.BODY_ELEMENT.CELL} span`)
        .should(firstStatus, `SP42_${test_num}_1`)
        .and(secondStatus, `SP42_${test_num}_2`)
        .and(thirdStatus, `SP42_${test_num}_3`)
}

export function checkResultsBefore(test_num, number, firstStatus, secondStatus, thirdStatus) {
    cy.get(`${ag.BODY_ELEMENT.POPUP} ${ag.BODY_ELEMENT.CHECKBOX}`).its('length').should('be.gte', number)
    cy.get(`${ag.BODY_ELEMENT.POPUP} ${ag.BODY_ELEMENT.CELL} span`)
        .should(firstStatus, `SP42_${test_num}_1`)
        .and(secondStatus, `SP42_${test_num}_2`)
        .and(thirdStatus, `SP42_${test_num}_3`)

    cy.get(`${ag.BODY_ELEMENT.POPUP} ${ag.BODY_ELEMENT.CHECKBOX}`).its('length').as('len_before')
}

export function getDate() {
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0')
    var yyyy = today.getFullYear()

    today = mm + '/' + dd + '/' + yyyy
    return today
}

export function getFutureDate() {
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0')
    var yyyy = String(Number(today.getFullYear()) + 1)

    today = mm + '/' + dd + '/' + yyyy
    return today
}

export function seedAlice(config) {
    cy.exec('esp ' + USE_SSL + ' -P ' + Cypress.env('PORT') + ' -H ' + Cypress.env('HOST') + ' -u alice@example.com -p L4b7R0cks! seed --no-overwrite cypress/fixtures/apps/' + config + '.yml', { timeout: 200000 })
}

export function teardownAlice(config) {
    cy.exec('esp ' + USE_SSL + ' -P ' + Cypress.env('PORT') + ' -H ' + Cypress.env('HOST') + ' -u alice@example.com -p L4b7R0cks! seed -f -d cypress/fixtures/apps/' + config + '.yml', { timeout: 200000 })
}