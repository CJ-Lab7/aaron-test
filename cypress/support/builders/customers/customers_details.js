export class CustomersDetails{
    constructor() {}

    // Header
    static getSubHeader() {
        return cy.get('.view-header__info')
    }

    static getTab(tabName){
        return cy.contains('.tab__name', tabName)
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

    static getSameAsBillingInput() {
        return cy.get('.customer-contact-info .checkbox')
    }

    static getBillingStreet1Input() {
        return cy.get('.customer-contact-info .item-details-cell input').eq(0)
    }

    static getBillingStreet2Input() {
        return cy.get('.customer-contact-info .item-details-cell input').eq(1)
    }

    static getBillingCityInput() {
        return cy.get('.customer-contact-info .item-details-cell input').eq(2)
    }

    static getBillingStateInput() {
        return cy.get('.customer-contact-info .item-details-cell input').eq(3)
    }

    static getBillingCountryInput() {
        return cy.get('.customer-contact-info .item-details-cell input').eq(4)
    }

    static getBillingPostalCodeInput() {
        return cy.get('.customer-contact-info .item-details-cell input').eq(5)
    }

    static getShippingStreet1Input() {
        return cy.get('.customer-contact-info .item-details-cell input').eq(6)
    }

    static getShippingStreet2Input() {
        return cy.get('.customer-contact-info .item-details-cell input').eq(7)
    }

    static getShippingCityInput() {
        return cy.get('.customer-contact-info .item-details-cell input').eq(8)
    }

    static getShippingStateInput() {
        return cy.get('.customer-contact-info .item-details-cell input').eq(9)
    }

    static getShippingCountryInput() {
        return cy.get('.customer-contact-info .item-details-cell input').eq(10)
    }

    static getShippingPostalCodeInput() {
        return cy.get('.customer-contact-info .item-details-cell input').eq(11)
    }

    // History Tab
    static getHistoryTab() {
        return cy.contains('.tab', 'History')
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
        CustomersDetails
            .getContactTab()
            .click()
        // Billing Address
        if (props.billing_street1) {
            CustomersDetails
                .getBillingStreet1Input() 
                .clear()
                .type(props.billing_street1)
        }
        if (props.billing_street2) {
            CustomersDetails
                .getBillingStreet2Input()
                .clear()
                .type(props.billing_street2)
        }
        if (props.billing_streets) {
            CustomersDetails
                .getBillingStreet1Input()
                .clear()
                .type(props.billing_streets)
            CustomersDetails
                .getBillingStreet2Input()
                .clear()
                .type(props.billing_streets)
        }
        if (props.billing_city) {
            CustomersDetails
                .getBillingCityInput()
                .clear()
                .type(props.billing_city)
        }
        if (props.billing_state) {
            CustomersDetails
                .getBillingStateInput()
                .clear()
                .type(props.billing_state)
        }
        if (props.billing_country) {
            CustomersDetails
                .getBillingCountryInput()
                .clear()
                .type(props.billing_country)
        }
        if (props.billing_postal) {
            CustomersDetails
                .getBillingPostalCodeInput()
                .clear()
                .type(props.billing_postal)
        }
        // Shipping Address
        if (props.same) {
            CustomersDetails
                .getSameAsBillingInput()
                .click()
            if (props.shipping_street1) {
                CustomersDetails
                    .getShippingStreet1Input()
                    .clear()
                    .type(props.shipping_street1)
            }
            if (props.shipping_street2) {
                CustomersDetails
                    .getShippingStreet2Input()
                    .clear()
                    .type(props.shipping_street2)
            }
            if (props.shipping_city) {
                CustomersDetails
                    .getShippingCityInput()
                    .clear()
                    .type(props.shipping_city)
            }
            if (props.shipping_state) {
                CustomersDetails
                    .getShippingStateInput()
                    .clear()
                    .type(props.shipping_state)
            }
            if (props.shipping_country) {
                CustomersDetails
                    .getShippingCountryInput()
                    .clear()
                    .type(props.shipping_country)
            }
            if (props.shipping_postal) {
                CustomersDetails
                    .getShippingPostalCodeInput()
                    .clear()
                    .type(props.shipping_postal)
            }
        }
        CustomersDetails
            .getSaveBtn()
            .click()
    }

    // Common Helper Functions

}

export class ArchiveModal{
    constructor() {}

    static openModal() {
        CustomersDetails
            .getArchiveBtn()
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'Archive Customer')
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