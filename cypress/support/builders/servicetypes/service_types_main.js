import * as ag from "../../ag_enum"

export class ServiceTypesMain{
    constructor() {}

    static visit() {
        cy.visit('/#/builders/service-types')
    }

    // Header and Navbar
    static getHeader() {
        return cy.get('[data-test="header-tabs__tab"]')
    }

    static getSubHeader() {
        return cy.get('.view-header__info')
    }

    static getTab(tabName){
        return cy.contains('.tab__name', tabName)
    }

    static getNewServiceTypeBtn() {
        return cy.contains('button', 'New Service Type')
    }

    static getBuildersBtn() {
        return cy.contains('.navbar .selected_app', 'Builders')
    }

    static getServiceTypesBtn() {
        return cy.contains('.navbar a', 'Service Types')
    }

    static getArchiveBtn() {
        return cy.contains('button', 'Archive')
    }

    // Filter Panel
    static getFilterPanel() {
        return cy.get('.filter-panel-apps')
    }

    static getCollapseFilterBtn() {
        return cy.contains('.left-panel-filters', 'Service Type Filters').find('.close-panel')
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

    // Service Type List
    static getServiceTypeListHeader() {
        return cy.get(`${ag.SECTION.ROOT} ${ag.HEADER_ELEMENT.CELL}`)
    }

    static getServiceTypeList() {
        return cy.get(`${ag.SECTION.BODY.CENTER} ${ag.BODY_ELEMENT.ROW}`)
    }

    static containsServiceTypeRow(name) {
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
     * Create a Service Type
     * @param {String} name - Name of new Container Type (*required)
     * @param {Object} props - parameter object
     * @param {String} props.desc - Description
     * @param {Enum} props.priceType - Price Type (Per Sample/Per time duration)
     * @param {Enum} props.scaleUnits - Scale Units (Hours/Minutes/Seconds)
     * @param {Number} props.basePrice - Base Price
     * @param {Number} props.scalePrice - Scale Price
     */
    static createServiceType(name, props) {
        if (name === undefined || name === '') {
            throw new Error('createServiceType requires name')
        }
        // Handle missing props keys
        props = props || {}
        props.desc = props.desc || ''
        props.priceType = props.priceType || ''
        props.scaleUnits = props.scaleUnits || ''
        props.basePrice = props.basePrice || 0
        props.scalePrice = props.scalePrice || 0

        // Use New Service Type Modal
        NewServiceTypeModal.openModal()
        NewServiceTypeModal.getNameInput()
            .clear()
            .type(name)
        if (props.desc) {
            NewServiceTypeModal
                .getDescInput()
                .clear()
                .type(props.desc)
        }
        if (props.priceType) {
            NewServiceTypeModal
                .getPriceTypeSelect()
                .select(props.priceType)
            // Scale Units and Scale Price are only relevant when priceType is 'Per time duration'
            if (props.priceType === 'Per time duration') {
                if (props.scaleUnits) {
                    NewServiceTypeModal
                        .getScaleUnitsSelect()
                        .select(props.scaleUnits)
                }
                if (props.scalePrice) {
                    NewServiceTypeModal
                        .getScalePriceInput()
                        .clear()
                        .type(props.scalePrice)
                }
            }
        }
        if (props.basePrice) {
            NewServiceTypeModal
                .getBasePriceInput()
                .clear()
                .type(props.basePrice)
        }

        NewServiceTypeModal.getSaveBtn()
            .click()
        NewServiceTypeModal
            .getModal()
            .should('not.be.visible')
    }
}

export class NewServiceTypeModal{
    constructor() {}

    static openModal() {
        ServiceTypesMain
            .getNewServiceTypeBtn()
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'New Service Type')
    }

    static getNameInput() {
        return this.getModal()
            .find('input[name="name"]')
    }

    static getDescInput() {
        return this.getModal()
            .find('textarea[name="description"]')
    }

    static getPriceTypeSelect() {
        return this.getModal()
            .contains('.form-field', 'Price Type')
            .find('select')
    }

    static getScaleUnitsSelect() {
        return this.getModal()
            .contains('.form-field', 'Scale Units')
            .find('select')
    }

    static getBasePriceInput() {
        return this.getModal()
            .contains('.form-field', 'Base Price')
            .find('input')
    }

    static getScalePriceInput() {
        return this.getModal()
            .contains('.form-field', 'Scale Price')
            .find('input')
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