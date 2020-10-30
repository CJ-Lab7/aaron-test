export class ParamGroupsDetails{
    constructor() {}

    // Nav Bars
    static getParamGroupNav() {
        return cy.get('.header-tabs')
    }

    static getBuildersNav() {
        return cy.get('.selected_app__title')
    }

    // Header
    static getSubHeader() {
        return cy.get('.view-header__info')
    }

    static getArchiveBtn() {
        return cy.contains('button', 'Archive')
    }
    static getAddParameterBtn() {
        return cy.contains('button', 'Add Parameter')
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

    static getNameParamGroupHeader(name) {
        return cy.contains('.info-panel--header', 'Details for ' + name)
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

    static getLastUpdated() {
        return cy.contains('tbody td', 'Last Updated').next()
    }

    static getParameters() {
        return cy.contains('tbody td', 'Parameters').next()
    }

    // Parameters Tab
    static getParametersTab() {
        return cy.contains('.tab', 'Parameters')
    }

    static clickEditParameterBtn(parameterName) {
        cy.get('.group-parameter .name').each( ($el, index, $list )=>{
            const text = $el.text()
            if(parameterName === text){
                return cy.get('.group-parameter .esp-icons.action.edit').eq(index).click({force: true})
            }
        }) 
    }

    static clickRemoveParameterBtn(parameterName) {
        cy.get('.group-parameter .name').each( ($el, index, $list )=>{
            const text = $el.text()
            if(parameterName === text){
                return cy.get('.group-parameter .esp-icons.action.edit').next().eq(index).click({force: true})
            }
        }) 
    }

    static getParameterItem(paramName) {
        return cy.contains('.group-parameter', paramName)
    }

    static getParameter() {
        return cy.get('.group-parameter')
    }

    static getFirstParameterItem() {
        return cy.get('.group-parameter .info').eq(1)
    }

    
    static dragAndDropParameter(source, target) {
        this.getParameterItem(source)
        .trigger('dragstart', {dataTransfer})

        this.getParameterItem(target)
        .trigger('drop', {dataTransfer})

        this.getParameterItem(source)
        .trigger('dragend')
        .should('be.visible')
        .should('have.text', target)
    }

    
    
    // History Tab
    static getHistoryTab() {
        return cy.contains('.tab', 'History')
    }

    static getHistoryColumn(column) {
        return cy.get('.row').contains('span', column)
    }

    static getHistoryChildrenList(selector) {
        return cy.get(`.row ` + selector)
    }

    static getHistoryUpdate(update) {
        return cy.contains('.row', update)
    }

    // CRUD (Create, Read, Update, Delete)
    /**
     * Create a Vendor
     * @param {String} name - Name of new Vendor (*required)
     * @param {String} value - Value
     */
    static createNewParameter(name, value = '') {
        if (name === undefined || name === '') {
            throw new Error('createNewParameter requires name')
        }
        if (value === undefined || name === '') {
            throw new Error('createNewParameter requires value')
        }

        NewParameterModal.openModal()
        NewParameterModal.getNameInput()
            .clear()
            .type(name)
        if (value) {
            NewParameterModal.getValueInput()
                .type(value)
        }
        NewParameterModal.getSaveBtn()
            .click()
        NewVendorModal
            .getModal()
            .should('not.be.visible')
    }

}

export class ArchiveModal{
    constructor() {}

    static openModal() {
        ParamGroupsDetails
            .getArchiveBtn()
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'Deactivate Param Group')
    }

    static getCancelBtn() {
        return this.getModal()
            .contains('button', 'Cancel')
    }

    static getConfirmBtn() {
        return this.getModal()
            .contains('button', 'Yes, Deactivate Param Group')
    }

    static getXBtn() {
        return this.getModal()
            .find('.close')
    }

}

// Parameter modal 

export class NewParameterModal{

    constructor() {}

    static openModal() {
        ParamGroupsDetails
            .getAddParameterBtn()
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'New Parameter')
    }

    static getNameInput() {
        return cy.get('.container .form-input').first()
    }

    static getValueInput() {
        return cy.get('.container .form-input').last()
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