export class ServiceTypesDetails{
    constructor() {}

    // Header
    static getSubHeader() {
        return cy.get('.view-header__info')
    }

    static getExportHistoryBtn() {
        return cy.contains('button', 'Export History')
    }

    static getArchiveBtn() {
        return cy.contains('button', 'Archive')
    }

    static getNewPriceEntryBtn() {
        return cy.contains('button', 'New Price Entry')
    }

    static getCancelBtn() {
        return cy.contains('.view-header button', 'Cancel')
    }

    static getSaveBtn() {
        return cy.contains('.view-header button', 'Save')
    }

    static clickSaveAndDoneBtn() {
        cy.get('.action--select')
            .click()
        cy.contains('.option', 'Save & Done')
            .click()
    }

    // Details Panel
    static getDetailsPanel() {
        return cy.contains('.info-panel', 'Details for')
    }

    static getNameInput() {
        return cy.contains('.info-panel tr', 'Name')
                    .find('input')
    }

    static getDescInput() {
        return cy.contains('.info-panel tr', 'Description')
                    .find('textarea')
    }
    static getBasePriceInput() {
        return cy.contains('tr', 'Default Base Price')
            .find('input')
    }

    static getScalePriceInput() {
        return cy.contains('tr', 'Scale Price')
            .find('input')
    }

    static getScaleUnitsSelect() {
        return this.getDetailsPanel()
            .find('select')
    }

    static getPriceType() {
        return cy.contains('tr', 'Price Type')
            .find('td')
            .eq(1)
            .invoke('text')
    }

    static getTagsInput() {
        return cy.get('.tag-input-text')
    }

    static getTag(text) {
        return cy.contains('.tag-input-tag', text)
    }

    static deleteTag(text) {
        return this.getTag(text)
            .find('.tag-close-button').click()
    }

    static getOwner() {
        return cy.contains('tr', 'Owner')
            .find('td')
            .eq(1)
    }

    // Customer-specific Pricing Tab
    static getPricingTab() {
        return cy.contains('.tab', 'Customer-specific Pricing')
    }

    static getPricingRow(customer) {
        return cy.contains('.price-entries-tab .body .row', customer)
    }

    static getDeletePricingBtn(customer) {
        return this.getPricingRow(customer)
            .find('.remove')
    }

    static getEditPricingBtn(customer) {
        return this.getPricingRow(customer)
            .find('.edit')
    }

    // History Tab
    static getHistoryTab() {
        return cy.contains('.tab', 'History')
    }

    static getHistoryUpdate(text) {
        return cy.contains('.row', text)
    }

    // CRUD
    /**
     * Create a price entry for a given customer
     * Base Price and Scale Price have default values
     * @param {String} customer - Customer name in the database
     * @param {Number} props.basePrice - Base Price
     * @param {Number} props.scalePrice - Scale Price
     */
    static createPriceEntry(customer, props) {
        // All fields are required but prices have defualt values
        if (customer === '' || customer === undefined) {
            throw new Error('createPriceEntry requires customer')
        }
        props.basePrice = props.basePrice || 0
        props.scalePrice = props.scalePrice || 0

        // Create Price Entry
        PriceEntryModal
            .openModal()
        PriceEntryModal
            .getCustomerSelect()
            .select(customer)
        if (props.basePrice) {
            PriceEntryModal
                .getBasePriceInput()
                .clear()
                .type(props.basePrice)
        }
        if (props.scalePrice) {
            PriceEntryModal
                .getScalePriceInput()
                .clear()
                .type(props.scalePrice)
        }
        PriceEntryModal
            .getSaveBtn()
            .click()
    }

    static deletePriceEntry(customer) {
        if (customer === '' || customer === undefined) {
            throw new Error('deletePriceEntry requires customer')
        }

        ServiceTypesDetails
            .getPricingTab()
            .click()
        ServiceTypesDetails
            .getDeletePricingBtn(customer)
            .click()
        DeletePriceEntryModal
            .getModal()
            .should('be.visible')
        DeletePriceEntryModal
            .getConfirmBtn()
            .click()
        DeletePriceEntryModal
            .getModal()
            .should('not.be.visible')
    }
    /**
     * Edit a price entry for a given customer
     * Base Price and Scale Price have default values
     * @param {String} customer - Customer name of an existing price entry
     * @param {Number} props.basePrice - Base Price
     * @param {Number} props.scalePrice - Scale Price
     */
    static updatePriceEntry(customer, props) {
        // All fields are required but prices have defualt values
        if (customer === '' || customer === undefined) {
            throw new Error('updatePriceEntry requires customer')
        }
        props.basePrice = props.basePrice || 0
        props.scalePrice = props.scalePrice || 0

        // Edit Price Entry
        ServiceTypesDetails
            .getEditPricingBtn(customer)
            .click()
        if (props.basePrice) {
            PriceEntryModal
                .getBasePriceInput()
                .clear()
                .type(props.basePrice)
        }
        if (props.scalePrice) {
            PriceEntryModal
                .getScalePriceInput()
                .clear()
                .type(props.scalePrice)
        }
        PriceEntryModal
            .getSaveBtn()
            .click()
    }

    // Common Helper Functions
    /**
     * Assert Service Type details are correct
     * @param {Object} props - Property object
     * @param {String} props.name - Name of service type
     * @param {String} props.desc - Description
     * @param {String} props.priceType - Price Type
     * @param {String} props.scaleUnits - Scale Units
     * @param {Number} props.basePrice - Base Price
     * @param {Number} props.scalePrice - Scale Price
     * @param {List} props.tags - List of tags
     * @param {String} props.owner - Owner (user whom created)
     */
    static assertDetails(props) {
        // Handle missing props keys
        props.name = props.name || ''
        props.desc = props.desc || ''
        props.priceType = props.priceType || ''
        props.scaleUnits = props.scaleUnits || ''
        props.basePrice = props.basePrice || 0
        props.scalePrice = props.scalePrice || 0
        props.tags = props.tags || []
        props.owner = props.owner || ''
        
        if (props.name) {
            ServiceTypesDetails
                .getNameInput()
                .invoke('val')
                .should('eq', props.name)
        }
        if (props.desc) {
            ServiceTypesDetails
                .getDescInput()
                .invoke('val')
                .should('eq', props.desc)
        }
        if (props.priceType) {
            ServiceTypesDetails
                .getPriceType()
                .should('contain', props.priceType)
        }
        if (props.basePrice) {
            ServiceTypesDetails
                .getBasePriceInput()
                .invoke('val')
                .should('eq', props.basePrice.toString())
        }
        if (props.scalePrice) {
            ServiceTypesDetails
                .getScalePriceInput()
                .invoke('val')
                .should('eq', props.scalePrice.toString())
        }
        if (props.scaleUnits) {
            ServiceTypesDetails
                .getScaleUnitsSelect()
                .contains('option:selected', props.scaleUnits)
        }
        if (props.tags) {
            for (let i = 0; i < props.tags.length; i++) {
                ServiceTypesDetails
                    .getTag(props.tags[i])
            }
        }
        if (props.owner) {
            ServiceTypesDetails
                .getOwner()
                .should('eq', props.owner)
        }
    }
}

export class ArchiveModal{
    constructor() {}

    static openModal() {
        ServiceTypesDetails
            .getArchiveBtn()
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'Archive Service Type')
    }

    static getCancelBtn() {
        return this.getModal()
            .contains('button', 'Cancel')
    }

    static getConfirmBtn() {
        return this.getModal()
            .contains('button', 'Yes')
    }

    static getXBtn() {
        return this.getModal()
            .find('.close')
    }
}

export class PriceEntryModal{
    constructor() {}

    static openModal() {
        ServiceTypesDetails
            .getNewPriceEntryBtn()
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'Price Entry')
    }

    static getCustomerSelect() {
        return this.getModal()
            .find('select')
    }

    static getBasePriceInput() {
        return this.getModal()
            .find('input[placeholder="enter base price here"]')
    }

    static getScalePriceInput() {
        return this.getModal()
            .find('input[placeholder="enter scale price here"]')
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

export class DeletePriceEntryModal{
    constructor() {}

    static getModal() {
        return cy.contains('.modal-container', 'Remove')
    }

    static getCancelBtn() {
        return this.getModal()
            .contains('button', 'Cancel')
    }

    static getConfirmBtn() {
        return this.getModal()
            .contains('button', 'Yes')
    }

    static getXBtn() {
        return this.getModal()
            .find('.close')
    }
}