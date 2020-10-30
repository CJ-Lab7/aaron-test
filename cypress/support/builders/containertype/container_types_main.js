import * as ag from '../../ag_enum'

export class ContainerTypesMain{
    constructor() {}

    static visit() {
        cy.visit('#/builders/container-types')
    }

    // Header and Navbar
    static getHeader() {
        return cy.get('[data-test="header-tabs__tab"]')
    }

    static getSubHeader() {
        return cy.get('.view-header__info')
    }

    static getNewContainerBtn() {
        return cy.contains('button', 'New Container Type')
    }

    static getBuildersBtn() {
        return cy.contains('.navbar .selected_app', 'Builders')
    }

    static getContainerTypesBtn() {
        return cy.contains('.navbar a', 'Container Types')
    }

    static getTab(tabName){
        return cy.contains('.tab__name', tabName)
    }

    // Filter Panel
    static getFilterPanel() {
        return cy.get('.filter-panel-apps')
    }

    static getCollapseFilterBtn() {
        return cy.contains('.left-panel-filters', 'Container Types Filters').find('.close-panel')
    }

    static getExpandFilterBtn() {
        return cy.get('.left-panel-filters .panel--collapsed').contains('Filters')
    }

    static getNameFilter() {
        return cy.get('.filter-panel-apps input[placeholder="ex: John Doe"]')
    }

    static getDescFilter() {
        return cy.get('.filter-panel-apps input[placeholder="ex: my type description"]')
    }

    static getTagsFilter() {
        return cy.get('.filter-panel-apps input[data-test="renderless-tag-input__tag-input-text"]')
    }

    // Container List 
    static getContainerTypeList() {
        return cy.get(`${ag.SECTION.BODY.CENTER} ${ag.BODY_ELEMENT.ROW}`)
    }

    static containsContainerTypeRow(name) {
        return cy.contains(`${ag.SECTION.BODY.CENTER} ${ag.BODY_ELEMENT.ROW}`, name)
    }

    static openDetailsPage(name) {
        cy.contains(`${ag.SECTION.BODY.CENTER} ${ag.BODY_ELEMENT.ROW} a`, name)
            .click({force:true})
        cy.url()
            .should('contain', 'details')
    }

    /**
     *  Assert whether of not a list of container types exists
     * @param {List} list - List of names of container types
     * @param {Bool} exists - true if the list should exist
     * */ 
    static containsRowList(list, exists = true ) {
        for (let el of list) {
            if (exists) {
                ContainerTypesMain
                    .containsContainerTypeRow(el)
            } else {
                ContainerTypesMain
                    .containsContainerTypeRow(el)
                    .should('not.exist')
            }
        }
    }

    // Inspector
    static getInspectorPanel() {
        return cy.contains('.left-panel-filters', 'Inspector:')
    }

    static getInspectorDetails() {
        return cy.contains('.left-panel-filters', 'Inspector')
                    .contains('.content-collapsible', 'Container type details')
    }

    static getInspectorDimensions() {
        return cy.contains('.left-panel-filters', 'Inspector')
                    .contains('.content-collapsible', 'Dimensions')
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
     * Create a Container Type
     * @param {String} name - Name of new Container Type
     * @param {Object} props - Object with the following keys
     * @param {String} props.desc - Description
     * @param {Enum} props.contains - Objects allowed in the container ('Entities', 'Containers', or 'Entities and Containers')
     * @param {Enum} props.elements - Number of elements allowed per location ('One' or 'Unlimited')
     * @param {List} props.tagList - List of Tags
     */
    static createContainerType(name, props) {
        // Handle missing props keys
        props = props || {}
        props.desc = props.desc || ''
        props.contains = props.contains || ''
        props.elements = props.elements || ''
        props.tagList = props.tagList || ''

        NewContainerTypeModal.openModal()
        NewContainerTypeModal.getNameInput()
            .clear()
            .type(name)
        if (props.desc) {
            NewContainerTypeModal.getDescInput()
                .type(props.desc)
        }
        if (props.contains) {
            NewContainerTypeModal.getContainsSelect()
                .select(props.contains)
        }
        if (props.elements) {
            NewContainerTypeModal.getElementsSelect()
                .select(props.elements)
        }
        if (props.tagList) {
            for(let tag of props.tagList) {
                NewContainerTypeModal.getTagsInput()
                    .type(tag + '{enter}')
            }
        }
        NewContainerTypeModal.getSaveBtn()
            .click()
        NewContainerTypeModal
            .getModal()
            .should('not.be.visible')
    }

    // Common Helper Functions (Add functions here that are used in multiple user stories)

}

export class NewContainerTypeModal{
    constructor() {}

    static openModal() {
        cy.contains('button', 'New Container Type')
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'New Container Type')
    }

    static getNameInput() {
        return this.getModal()
            .find('input[name="name"]')
    }

    static getDescInput() {
        return this.getModal()
            .find('textarea[name="description"]')
    }

    static getContainsSelect() {
        return this.getModal()
            .contains('.form-field', 'Contains')
            .find('select')
    }

    static getElementsSelect() {
        return this.getModal()
            .contains('.form-field', 'Elements per location')
            .find('select')
    }

    // static getScriptInput() {
    //     return this.getModal()
    //         .find('.textarea-editor textarea')
    // }

    static getTagsInput() {
        return this.getModal()
            .find('.tag-input-text')
    }

    static getTag(text) {
        return this.getModal()
            .contains('.tag-input-tag', text)
    }

    static deleteTag(text) {
        return this.getTag(text)
            .find('.tag-close-button').click()
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