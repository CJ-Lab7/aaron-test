import * as ag from "../../ag_enum"

export class CustomersMain{
    constructor() {}

    static visit() {
        cy.visit('#/builders/customers')
    }

    // Header and Navbar
    static getHeader() {
        return cy.get('[data-test="header-tabs__tab"]')
    }

    static getSubHeader() {
        return cy.get('.view-header__info')
    }

    static getNewCustomerBtn() {
        return cy.contains('button', 'New Customer')
    }

    static getBuildersBtn() {
        return cy.contains('.navbar .selected_app', 'Builders')
    }

    static getCustomersBtn() {
        return cy.contains('.navbar a', 'Customers')
    }

    // Filter Panel
    static getFilterPanel() {
        return cy.get('.filter-panel-apps')
    }

    static getCollapseFilterBtn() {
        return cy.contains('.left-panel-filters', 'Customers Filters').find('.close-panel')
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

    // Customer List
    static getCustomerListHeader() {
        return cy.get(`${ag.SECTION.ROOT} ${ag.HEADER_ELEMENT.CELL}`)
    }

    static getCustomerList() {
        return cy.get(`${ag.SECTION.BODY.CENTER} ${ag.BODY_ELEMENT.ROW}`)
    }

    static containsCustomerRow(name) {
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

    static getInspectorSection(section) {
        return cy.contains('.left-panel-filters', 'Inspector')
                    .contains('.content-collapsible', section)
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
     * Create a Customer
     * @param {String} name - Name of new Customer (*required)
     * @param {String} desc - Description
     */
    static createCustomer(name, desc = '') {
        if (name === undefined || name === '') {
            throw new Error('createCustomer requires name')
        }
        NewCustomerModal.openModal()
        NewCustomerModal.getNameInput()
            .clear()
            .type(name)
        if (desc) {
            NewCustomerModal.getDescInput()
                .type(desc)
        }
        cy.wait(100)
        NewCustomerModal.getSaveBtn()
            .click()
        NewCustomerModal
            .getModal()
            .should('not.be.visible')
    }
}

export class NewCustomerModal{
    constructor() {}

    static openModal() {
        CustomersMain
            .getNewCustomerBtn()
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'New Customer')
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