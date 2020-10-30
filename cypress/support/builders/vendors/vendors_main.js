import * as ag from "../../ag_enum"

export class VendorsMain{
    constructor() {}

    static visit() {
        cy.visit('#/builders/vendors')
    }

    // Header and Navbar
    static getHeader() {
        return cy.get('[data-test="header-tabs__tab"]')
    }

    static getSubHeader() {
        return cy.get('.view-header__info')
    }

    static getNewVendorBtn() {
        return cy.contains('button', 'New Vendor')
    }

    static getBuildersBtn() {
        return cy.contains('.navbar .selected_app', 'Builders')
    }

    static getVendorsBtn() {
        return cy.contains('.navbar a', 'Vendors')
    }

    // Filter Panel
    static getFilterPanel() {
        return cy.get('.filter-panel-apps')
    }

    static getCollapseFilterBtn() {
        return cy.contains('.left-panel-filters', 'Vendors Filters').find('.close-panel')
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

    // Vendor List
    static getVendorListHeader() {
        return cy.get(`${ag.SECTION.ROOT} ${ag.HEADER_ELEMENT.CELL}`)
    }

    static getVendorList() {
        return cy.get(`${ag.SECTION.BODY.CENTER} ${ag.BODY_ELEMENT.ROW}`)
    }

    static containsVendorRow(name) {
        return cy.contains(`${ag.SECTION.BODY.CENTER} ${ag.BODY_ELEMENT.ROW}`, name)
    }

    static openDetailsPage(name) {
        cy.contains(`${ag.SECTION.BODY.CENTER} ${ag.BODY_ELEMENT.ROW} a`, name)
            .click({force:true})
        cy.url()
            .should('contain', 'details')
    }
    
    // ag-grid functions are transfered to ag_functions.js 

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
     * Create a Vendor
     * @param {String} name - Name of new Vendor (*required)
     * @param {String} desc - Description
     */
    static createVendor(name, desc = '') {
        if (name === undefined || name === '') {
            throw new Error('createVendor requires name')
        }
        NewVendorModal.openModal()
        NewVendorModal.getNameInput()
            .clear()
            .type(name)
        if (desc) {
            NewVendorModal.getDescInput()
                .type(desc)
        }
        NewVendorModal.getSaveBtn()
            .click()
        NewVendorModal
            .getModal()
            .should('not.be.visible')
    }
}

export class NewVendorModal{
    constructor() {}

    static openModal() {
        VendorsMain
            .getNewVendorBtn()
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'New Vendor')
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