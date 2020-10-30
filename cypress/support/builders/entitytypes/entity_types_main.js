import * as ag from '../../ag_enum'

export class EntityTypesMain{
    constructor() {}

    static visit() {
        cy.visit('#/builders/entity-types')
    }

    // Header and Navbar

    static getTab(tabName){
        return cy.contains('.tab', tabName)
    }

    static getSubHeader() {
        return cy.get('.view-header__info')
    }

    static getNewEntityTypeBtn() {
        return cy.contains('button', 'New Entity Type')
    }

    static getBuildersBtn() {
        return cy.contains('.navbar .selected_app', 'Builders')
    }

    static getEntityTypesBtn() {
        return cy.contains('.navbar a', 'Entity Types')
    }

    // Filter Panel
    static getFilterPanel() {
        return cy.get('.filter-panel-apps')
    }

    static getCollapseFilterBtn() {
        return cy.contains('.left-panel-filters', 'Entity Type Filters').find('.close-panel')
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

    // Entity Type List 
    static getEntityTypeList() {
        return cy.get(`${ag.SECTION.BODY.CENTER} ${ag.BODY_ELEMENT.ROW}`)
    }

    static containsEntityTypeRow(name) {
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
                EntityTypesMain
                    .containsEntityTypeRow(el)
            } else {
                EntityTypesMain
                    .containsEntityTypeRow(el)
                    .should('not.exist')
            }
        }
    }

    // Inspector
    static getInspectorPanel() {
        return cy.contains('.left-panel-filters', 'Inspector:')
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
     * Create a Entity Type
     * @param {String} name - Name of new Entity Type
     * @param {Object} props - Object with the following keys
     * @param {String} props.desc - Description
     * @param {Enum} props.class - Entity Class (Sample or custom entity class)
     * @param {List} props.tagList - List of Tags
     */
    static createEntityType(name, props) {
        // Handle missing props keys
        props = props || {}
        props.desc = props.desc || ''
        props.class = props.class || ''
        props.tagList = props.tagList || ''

        NewEntityTypeModal.openModal()
        NewEntityTypeModal.getNameInput()
            .clear()
            .type(name)
        if (props.desc) {
            NewEntityTypeModal.getDescInput()
                .type(props.desc)
        }
        if (props.class) {
            NewEntityTypeModal.getClassSelect()
                .select(props.class)
                .contains('option:selected', props.class)
        }
        if (props.tagList) {
            for(let tag of props.tagList) {
                NewEntityTypeModal.getTagsInput()
                    .type(tag + '{enter}')
            }
        }
        NewEntityTypeModal.getSaveBtn()
            .click()
        NewEntityTypeModal
            .getModal()
            .should('not.be.visible')
    }

    // Common Helper Functions (Add functions here that are used in multiple user stories)

}

export class NewEntityTypeModal{
    constructor() {}

    static openModal() {
        cy.contains('button', 'New Entity Type')
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'New Entity Type')
    }

    static getNameInput() {
        return this.getModal()
            .find('input[name="name"]')
    }

    static getDescInput() {
        return this.getModal()
            .find('textarea[name="description"]')
    }

    static getClassSelect() {
        return this.getModal()
            .contains('.form-field', 'Entity Class')
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