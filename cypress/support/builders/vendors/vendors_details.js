export class VendorsDetails{
    constructor() {}

    // Nav Bars
    static getVendorsNav() {
        return cy.get('.header-tabs')
    }

    static getBuildersNav() {
        return cy.get('.selected_app__title')
    }

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

    static getCancelBtn() {
        return cy.contains('button', 'Cancel')
    }

    static getSaveBtn() {
        return cy.contains('button', 'Save')
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

    static getLeftPanelInfo(field) {
        return cy.contains('.info-panel tr', field)
    }

    static getNameInput() {
        return cy.contains('.info-panel tr', 'Name')
                    .find('input')
    }

    static getDescInput() {
        return cy.contains('.info-panel tr', 'Description')
                    .find('textarea')
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

    // Contact Info Tab
    static getContactTab() {
        return cy.contains('.tab', 'Contact Info')
    }

    static getBillingText(field) {
        return cy.get('.details').eq(0)
                .contains('.item-details-cell', field)
    }

    static getShippingText(field) {
        return cy.get('.details').eq(1)
                .contains('.item-details-cell', field)
    }

    static getSameAsBillingInput() {
        return cy.get('.vendor-contact-info .checkbox')
    }

    static getBillingStreet1Input() {
        return cy.get('.vendor-contact-info input').eq(0)
    }

    static getBillingStreet2Input() {
        return cy.get('.vendor-contact-info input').eq(1)
    }

    static getBillingCityInput() {
        return cy.get('.vendor-contact-info input').eq(2)
    }

    static getBillingStateInput() {
        return cy.get('.vendor-contact-info input').eq(3)
    }

    static getBillingCountryInput() {
        return cy.get('.vendor-contact-info input').eq(4)
    }

    static getBillingPostalCodeInput() {
        return cy.get('.vendor-contact-info input').eq(5)
    }

    static getShippingStreet1Input() {
        return cy.get('.vendor-contact-info input').eq(6)
    }

    static getShippingStreet2Input() {
        return cy.get('.vendor-contact-info input').eq(7)
    }

    static getShippingCityInput() {
        return cy.get('.vendor-contact-info input').eq(8)
    }

    static getShippingStateInput() {
        return cy.get('.vendor-contact-info input').eq(9)
    }

    static getShippingCountryInput() {
        return cy.get('.vendor-contact-info input').eq(10)
    }

    static getShippingPostalCodeInput() {
        return cy.get('.vendor-contact-info input').eq(11)
    }

    // History Tab
    static getHistoryTab() {
        return cy.contains('.tab', 'History')
    }

    static getHistoryColumn(column) {
        return cy.get('.row').contains('span', column)
    }

    static getHistoryUpdate(update) {
        return cy.contains('.row', update)
    }



    // CRUD
    /**
     * Update Contact Info
     * @param {Object} props - Object containing the following keys
     * @param {Boolean} props.same - Shipping Address === Billing Address? (true/false)
     * @param {String} props.billing_street1 - Billing Address - Street 1
     * @param {String} props.billing_street2 - Billing Address - Street 2
     * @param {String} props.billing_city - Billing Address - City
     * @param {String} props.billing_state - Billing Address - State
     * @param {String} props.billing_country - Billing Address - Country
     * @param {String} props.billing_postal - Billing Address - Postal Code
     * @param {String} props.shipping_street1 - Shipping Address - Street 1
     * @param {String} props.shipping_street2 - Shipping Address - Street 2
     * @param {String} props.shipping_city - Shipping Address - City
     * @param {String} props.shipping_state - Shipping Address - State
     * @param {String} props.shipping_country - Shipping Address - Country
     * @param {String} props.shipping_postal - Shipping Address - Postal Code
     */
    static updateContactInfo(props) {
        // Handle missing props keys
        if (props === undefined || props === {}) {
            throw new Error('updateContactInfo requires props object')
        } 
        props = props || {}
        props.billing_street1 = props.billing_street1 || ''
        props.billing_street2 = props.billing_street2 || ''
        props.billing_streets = props.billing_streets || ''
        props.billing_city = props.billing_city || ''
        props.billing_state = props.billing_state || ''
        props.billing_country = props.billing_country || ''
        props.billing_postal = props.billing_postal || ''
        props.shipping_street1 = props.shipping_street1 || ''
        props.shipping_street2 = props.shipping_street2 || ''
        props.shipping_city = props.shipping_city || ''
        props.shipping_state = props.shipping_state || ''
        props.shipping_country = props.shipping_country || ''
        props.shipping_postal = props.shipping_postal || ''

        // Create Dimension
        VendorsDetails
            .getContactTab()
            .click()
        // Billing Address
        if (props.billing_street1) {
            VendorsDetails
                .getBillingStreet1Input() 
                .clear()
                .type(props.billing_street1)
        }
        if (props.billing_street2) {
            VendorsDetails
                .getBillingStreet2Input()
                .clear()
                .type(props.billing_street2)
        }
        if (props.billing_streets) {
            VendorsDetails
                .getBillingStreet1Input()
                .clear()
                .type(props.billing_streets)
            VendorsDetails
                .getBillingStreet2Input()
                .clear()
                .type(props.billing_streets)
        }
        if (props.billing_city) {
            VendorsDetails
                .getBillingCityInput()
                .clear()
                .type(props.billing_city)
        }
        if (props.billing_state) {
            VendorsDetails
                .getBillingStateInput()
                .clear()
                .type(props.billing_state)
        }
        if (props.billing_country) {
            VendorsDetails
                .getBillingCountryInput()
                .clear()
                .type(props.billing_country)
        }
        if (props.billing_postal) {
            VendorsDetails
                .getBillingPostalCodeInput()
                .clear()
                .type(props.billing_postal)
        }
        // Shipping Address
        if (props.same) {
            VendorsDetails
                .getSameAsBillingInput()
                .click()
            if (props.shipping_street1) {
                VendorsDetails
                    .getShippingStreet1Input()
                    .clear()
                    .type(props.shipping_street1)
            }
            if (props.shipping_street2) {
                VendorsDetails
                    .getShippingStreet2Input()
                    .clear()
                    .type(props.shipping_street2)
            }
            if (props.shipping_city) {
                VendorsDetails
                    .getShippingCityInput()
                    .clear()
                    .type(props.shipping_city)
            }
            if (props.shipping_state) {
                VendorsDetails
                    .getShippingStateInput()
                    .clear()
                    .type(props.shipping_state)
            }
            if (props.shipping_country) {
                VendorsDetails
                    .getShippingCountryInput()
                    .clear()
                    .type(props.shipping_country)
            }
            if (props.shipping_postal) {
                VendorsDetails
                    .getShippingPostalCodeInput()
                    .clear()
                    .type(props.shipping_postal)
            }
        }
        VendorsDetails
            .getSaveBtn()
            .click()
    }





    // CRUD
    /**
     * Update Billing Address
     * @param {String} street1 - Street 1
     * @param {String} street2 - Street 2
     * @param {String} city - City
     * @param {String} state - State
     * @param {String} country - Country
     * @param {String} postal - Postal Code
     */
    static updateBilling(props) {
        // Handle missing props keys
        if (props === undefined || props === {}) {
            throw new Error('updateBilling requires props object')
        }
        props.street1 = props.street1 || ''
        props.street2 = props.street2 || ''
        props.city = props.city || ''
        props.state = props.state || ''
        props.country = props.country || ''
        props.postal = props.postal || ''

        // Create Dimension
        VendorsDetails
            .getContactTab()
            .click()
        if (props.street1) {
            VendorsDetails
                .getStreet1Input()
                .type(props.street1)
        }
        if (props.street2) {
            VendorsDetails
                .getStreet2Input()
                .type(props.street2)
        }
        if (props.city) {
            VendorsDetails
                .getCityInput()
                .type(props.city)
        }
        if (props.state) {
            VendorsDetails
                .getStateInput()
                .type(props.state)
        }
        if (props.country) {
            VendorsDetails
                .getCountryInput()
                .type(props.country)
        }
        if (props.postal) {
            VendorsDetails
                .getPostalCodeInput()
                .type(props.postal)
        }
        VendorsDetails
            .getSaveBtn()
            .click()
    }

    // Common Helper Functions

}

export class ArchiveModal{
    constructor() {}

    static openModal() {
        VendorsDetails
            .getArchiveBtn()
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'Archive Vendor')
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