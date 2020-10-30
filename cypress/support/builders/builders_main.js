export class BuildersMain{
    constructor() {}

    static visit() {
        cy.visit('#/builders')
    }

    // Processes
    static getProtocolsBtn() {
        return cy.contains('a', 'Protocols')
    }

    static getWorkflowsBtn() {
        return cy.contains('a', 'Workflows')
    }

    static getWorkflowChainsBtn() {
        return cy.contains('a', 'Workflow Chains')
    }

    static getParamGroupsBtn() {
        return cy.contains('a', 'Param Groups')
    }

    // Inventory
    static getVendorsBtn() {
        return cy.contains('a', 'Vendors')
    } 

    static getCustomersBtn() {
        return cy.contains('a', 'Customers')
    }

    static getServiceTypesBtn() {
        return cy.contains('a', 'Service Types')
    }

    static getEntityTypesBtn() {
        return cy.contains('a', 'Entity Types')
    }

    static getContainerTypesBtn() {
        return cy.contains('a', 'Container Types')
    }

    static getItemTypesBtn() {
        return cy.contains('a', 'Item Types')
    }
}