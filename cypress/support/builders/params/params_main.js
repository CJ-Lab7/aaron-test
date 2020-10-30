import * as ag from "../../ag_enum"
export class ParamGroupsMain{
    constructor() {}

    static visit() {
        cy.visit('#/builders/param-groups')
    }

    // Header and Navbar
    static getHeader() {
        return cy.get('[data-test="header-tabs__tab"]')
    }

    static getSubHeader() {
        return cy.get('.view-header__info')
    }

    static getNewParamGroupBtn() {
        return cy.contains('button', 'New Parameter Group')
    }

    static getBuildersBtn() {
        return cy.contains('.navbar .selected_app', 'Builders')
    }

    static getParamGroupsBtn() {
        return cy.contains('.navbar a', 'Param Groups')
    }

    // Filter Panel
    static getFilterPanel() {
        return cy.get('.filter-panel-apps')
    }

    static getCollapseFilterBtn() {
        return cy.contains('.left-panel-filters', 'Param Group Filters').find('.close-panel')
    }

    static getExpandFilterBtn() {
        return cy.get('.left-panel-filters .panel--collapsed').contains('Filters')
    }

    static getNameFilter() {
        return cy.get('.filter-panel-apps input').eq(0)
    }

    static getDescFilter() {
        return cy.get('.filter-panel-apps input').eq(1)
    }

    // Param Group List
    static getParamGroupListHeader() {
        return cy.get(`${ag.SECTION.ROOT} ${ag.HEADER_ELEMENT.CELL}`)
    }

    static getParamGroupList() {
        return cy.get(`${ag.SECTION.BODY.CENTER} ${ag.BODY_ELEMENT.ROW}`)
    }

    static containsParamGroupRow(name) {
        return cy.contains(`${ag.SECTION.BODY.CENTER} ${ag.BODY_ELEMENT.ROW}`, name)
    }

    static openDetailsPage(name) {
        cy.contains(`${ag.SECTION.BODY.CENTER} ${ag.BODY_ELEMENT.ROW} a`, name)
            .click({force:true})
        cy.url()
            .should('contain', 'details')
    }
    
    

    // Inspector
    static getInspectorPanel() {
        return cy.contains('.left-panel-filters', 'Inspector:')
    }

    static getInspectorSectionOne(section) {
        return cy.contains('.left-panel-filters', 'Inspector')
                    .contains('.content-collapsible', section)
    }

    static getInspectorSectionTwo(subheader) {
        return cy.contains('.label--section', subheader)
    }

    static getParamGroupDetailsNameValue(){
        return cy.contains('.item-details-cell', 'Name').next()
    }

    static getParamGroupDetailsDescriptionValue(){
        return cy.contains('.item-details-cell', 'Description').next()
    }

    static getParamGroupDetailsLastUpdatedValue(){
        return cy.contains('.item-details-cell', 'Last Updated').next()
    }

    static getParamGroupDetailsParametersValue(){
        return cy.contains('.item-details-cell', 'Parameters').next()
    }

    static getInspectorParametersBody() {
        return cy.get('.body.container-fluid')
    }

    static getCollapseInspectorBtn() {
        return cy.contains('.left-panel-filters', 'Inspector')
            .find('.close-panel')
    }

    static getExpandInspectorBtn() {
        return cy.get('.left-panel-filters .panel--collapsed')
            .contains('Inspector')
    }

    // CRUD (Create, Read, Update, Delete)
    /**
     * Create a Param Group
     * @param {String} name - Name of new Param (*required)
     * @param {String} desc - Description
     */
    static createParamGroup(name, desc = '') {
        if (name === undefined || name === '') {
            throw new Error('createParamGroup requires name')
        }
        NewParamGroupModal.openModal()
        NewParamGroupModal.getNameInput()
            .clear()
            .type(name)
        if (desc) {
            NewParamGroupModal.getDescInput()
                .type(desc)
        }
        NewParamGroupModal.getSaveBtn()
            .click()
            NewParamGroupModal
            .getModal()
            .should('not.be.visible')
    }
}

export class NewParamGroupModal{
    constructor() {}

    static openModal() {
        ParamGroupsMain
            .getNewParamGroupBtn()
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'New Parameter Group')
    }

    static getNameInput() {
        return this.getModal()
            .find('input[name="name"]')
    }

    static getDescInput() {
        return this.getModal()
            .find('textarea[name="description"]')
    }

    static getCancelBtn() {
        return this.getModal()
            .contains('button', 'Cancel')
    }

    static getSaveBtn() {
        return this.getModal()
            .contains('button', 'Save')
    }

    static getXBtn() {
        return this.getModal()
            .find('.close')
    }

}