export class ContainerTypesDetails{
    constructor() {}

    // Header
    static getHeader() {
        return cy.get('.view-header__info')
    }

    static getExportHistoryBtn() {
        return cy.contains('button', 'Export History')
    }

    static getArchiveBtn() {
        return cy.contains('button', 'Archive')
    }

    static getDimensionBtn() {
        return cy.contains('button', 'Add Dimension')
    }

    static getCustomFieldBtn() {
        return cy.contains('button', 'Add Custom Field')
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
    static getNameInput() {
        return cy.contains('.info-panel tr', 'Name')
                    .find('input')
    }

    static getDescInput() {
        return cy.contains('.info-panel tr', 'Description')
                    .find('textarea')
    }

    static getContainsSelect() {
        return cy.contains('.info-panel tr', 'Contains')
                    .find('select')
    }

    static getElementsSelect() {
        return cy.contains('.info-panel tr', 'Elements per location')
                    .find('select')
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

    // Dimensions Tab
    static getDimensionsTab() {
        return cy.contains('.tab', 'Dimensions')
    }

    static getDimension(name) {
        return cy.contains('.container-dimension-row', name)
    }

    // Custom Fields Tab
    static getCustomFieldsTab() {
        return cy.contains('.tab', 'Custom Fields')
    }
    
    static getCustomField(name) {
        return cy.contains('.custom-field', name)
    }

    // History Tab
    static getHistoryTab() {
        return cy.contains('.tab', 'History')
    }

    // CRUD
    /**
     * Create a Container Type dimension
     * @param {String} name - Name of Dimension to create
     * @param {Object} props - Object with the following keys
     * @param {String} props.suffix - Suffix
     * @param {Number} props.elements - Elements
     * @param {Enum} props.labelType - Label Type
     * @param {List} props.labels - list of Labels
     */
    static createDimension(name, props) {
        // Handle missing props keys
        props = props || {}
        props.suffix = props.suffix || ''
        props.elements = props.elements || 0
        props.labelType = props.labelType || ''
        props.labels = props.labels || ''

        // Create Dimension
        NewDimensionModal.openModal()
        NewDimensionModal
            .getNameInput()
            .clear()
            .type(name)
        if (props.suffix) {
            NewDimensionModal
                .getSuffixInput()
                .type(props.suffix)
        }
        if (props.elements) {
            NewDimensionModal
                .getElementsInput()
                .clear()
                .type(props.elements)
            NewDimensionModal
                .getLabelsInput()
                .its('length')
                .should('eq', props.elements)
        }
        if (props.labelType) {
            NewDimensionModal
                .getLabelSelect()
                .select(props.labelType)
        }
        if (props.labels) {
            NewDimensionModal
                .getLabelsInput()
                .type(props.labels)
        }
        NewDimensionModal
            .getSaveBtn()
            .click()
        NewDimensionModal
            .getModal()
            .should('not.be.visible')
    }

    /**
     * Update a Container Type dimension
     * @param {String} name - Name of Dimension to edit
     * @param {Object} props - Object with the following keys
     * @param {String} props.newName - New Name
     * @param {String} props.suffix - New Suffix
     * @param {Number} props.elements - New Elements
     * @param {Enum} props.labelType - New Label Type
     * @param {List} props.labels - New list of Labels
     */
    static editDimension(name, props) {
        // Handle missing props keys
        props = props || {}
        props.newName = props.newName || ''
        props.suffix = props.suffix || ''
        props.elements = props.elements || 0
        props.labelType = props.labelType || ''
        props.labels = props.labels || ''

        // Edit dimension
        this.getDimension(name)
            .find('.edit')
            .click()
        NewDimensionModal
            .getModal()
            .should('be.visible')
        if (props.newName) {
            NewDimensionModal
                .getNameInput()
                .clear()
                .type(props.newName)
        }
        if (props.suffix) {
            NewDimensionModal
                .getSuffixInput()
                .type(props.suffix)
        }
        if (props.elements) {
            NewDimensionModal
                .getElementsInput()
                .invoke('val')
                .then($val => {
                    if ($val !== props.elements) {
                        NewDimensionModal
                            .getElementsInput()
                            .clear()
                            .type(props.elements)
                    }
                })
        }
        if (props.labelType) {
            NewDimensionModal
                .getLabelSelect()
                .select(props.labelType)
        }
        if (props.labels) {
            for (let i = 0; i < props.labels.length; i++) {
                NewDimensionModal
                    .getLabelsInput()
                    .eq(i)
                    .type(props.labels[i])
            }
        }
        NewDimensionModal
            .getSaveBtn()
            .click()
        NewDimensionModal
            .getModal()
            .should('not.be.visible')
    }

    /**
     * Delete a Container Type Dimension
     * @param {String} dimension - Name of the dimension to delete
     */
    static deleteDimension(dimension) {
        DeleteDimensionModal.openModal(dimension)
        DeleteDimensionModal
            .getConfirmBtn()
            .click()
        DeleteDimensionModal
            .getModal()
            .should('not.be.visible')
    }

    /**
     * Create a Container Type Custom Field
     * @param {String} name - Name of Custom Field to create *required*
     * @param {Enum} type - Custom field type *required* (text/number/picklist/date/checkbox/attachment/barcode/link)
     * @param {Object} props - Object with the following keys
     * @param {String} props.desc - Description
     * @param {String} props.default - Default value
     * @param {Boolean} props.defaultPopup - true if default value should be added in popup window
     * @param {Boolean} props.read_only - Read Only (true/false)
     * @param {Boolean} props.required - Required (true/false)
     * @param {String} props.var_group - Var group
     * @param {Enum} props.picklist_option - Picklist Options, only used with type=picklist(manual/expression)
     * @param {Boolean} props.multiple - Multiple toggle, only used with type=picklist (true/false)
     * @param {List} props.option_list - List of picklist options to enter in Option 0:, Option 1:, etc, only used with type=picklist (['option1', 'option2']])
     * @param {Enum} props.date_format - Date format, only used with type=date (YYYY-MM-DD or YYYY/MM/DD or DD-MM-YYYY or DD/MM/YYYY or DD MMM YYY or DD MMMM YYYY or MMM DD, YYYY or MMMM DD, YYYY)
     * @param {Enum} props.barcode_type - Barcode type, only used with type=barcode (QR/mini data matrix/1D)
     * @param {Enum} props.link_type - Resource link type, only used with type=link (Sample/File/Container/Report/Project/Experiment/Inventory)
     */
    static createCustomField(name, type, props) {
        // Handle missing parameters
        if (name === '' || name === undefined) {
            throw new Error('createCustomField requires name parameter')
        }
        if (type === '' || type === undefined) {
            throw new Error('createCustomField requires type parameter')
        }
        switch (type) {
            case 'text':
                type = 'Free-form text entry'
                break
            case 'number':
                type = 'Numbers only allowed'
                break
            case 'picklist':
                type = 'Picklist'
                break
            case 'date':
                type = 'Date'
                break
            case 'checkbox':
                type = 'Checkbox'
                break
            case 'attachment':
                type = 'Attachment'
                break
            case 'barcode':
                type = 'Barcode'
                break
            case 'link':
                type = 'Resource Link'
                break
            default:
                throw new Error('type must be one of the following values: text/number/picklist/date/checkbox/attachment/barcode/link')
        }
        props = props || {}
        props.desc = props.desc || ''
        props.default = props.default || ''
        props.defaultPopup = props.defaultPopup || false
        props.read_only = props.read_only || false
        props.required = props.required || false
        props.var_group = props.var_group || ''
        props.picklist_option = props.picklist_option || ''
        props.multiple = props.multiple || false
        props.option_list = props.option_list || []
        props.date_format = props.date_format || ''
        props.barcode_type = props.barcode_type || ''
        props.link_type = props.link_type || ''
        props.expression_text = props.expression_text || []
        props.manual_list = props.manual_list || []

        // Create Custom Field
        ContainerTypesDetails
            .getCustomFieldBtn()
            .click()
        NewCustomFieldModal
            .getNameInput()
            .clear()
            .type(name)
        NewCustomFieldModal
            .getTypeSelect() //this will select the Type drop down
            .select(type)
        if (props.desc) {
            NewCustomFieldModal
                .getDescInput()
                .clear()
                .type(props.desc)
        }
        if (props.defaultPopup) {
            NewCustomFieldModal
                .typeDefaultValuePopup(props.default)
            NewCustomFieldModal
                .getXPopupBtn()
                .click()
        } else if (props.default) {
            NewCustomFieldModal
                .getDefaultValueInput()
                .clear()
                .type(props.default)
        }
        if (props.read_only) {
            NewCustomFieldModal
                .getReadOnlyCheckbox()
                .click()
        }
        if (props.required) {
            NewCustomFieldModal
                .getRequiredCheckbox()
                .click()
        }
        if (props.vargroup) {
            NewCustomFieldModal
                .getVarGroupInput()
                .clear()
                .type(props.vargroup)
        }
        // picklist form
        if (type === 'Picklist') {
            if (props.picklist_option) {
                NewCustomFieldModal
                    .getESPExpressionBtn()
                    .click()
                NewCustomFieldModal
                    .getESPExpressionInput()
                    .type(props.picklist_option)
            } else {
                NewCustomFieldModal
                    .getManualBtn()
                    .click()
            }
            if (props.multiple) {
 
                NewCustomFieldModal
                    .getMultipleToggle()
                    .click()
            }
            if (props.option_list>0) {
                // add options if necessary
                if (props.option_list.length > 4) {
                    for (let i = 0; i < props.option_list.length - 4; i++) {
                        NewCustomFieldModal
                            .addOptionBtn()
                            .click()
                        cy.wait(100)
                    }
                }
                //it used to start with Option 0. Now the developer changed to start with Option 1 (optonNum)
                for (let optionNum = 1; optionNum < props.option_list.length+1; optionNum++) {
                    NewCustomFieldModal
                        .getOptionInput(optionNum + 1)
                        .clear()
                        .type(props.option_list[optionNum-1])
                }
            }
            if (props.expression_text.length>0) {
                NewCustomFieldModal
                    .getManualBtn()
                    .click()
                NewCustomFieldModal
                    .getMultipleToggle()
                    .click()
                // add options if necessary
                if (props.option_list.length > 4) {
                    for (let i = 0; i < props.expression_text.length - 4; i++) {
                        NewCustomFieldModal
                            .addOptionBtn()
                            .click()
                        cy.wait(100)
                    }
                }
                for (let optionNum = 1; optionNum < props.expression_text.length+1; optionNum++) {
                    NewCustomFieldModal
                        .getOptionInput(optionNum)
                        .clear()
                        .type(props.expression_text[optionNum-1])
                }
                NewCustomFieldModal
                    .getESPExpressionBtn()
                    .click()
                NewCustomFieldModal
                    .getESPExpressionInput()
                    .clear()
                    .type('my new expression')      
            }
            if (props.manual_list.length>0) {
                NewCustomFieldModal
                   .getESPExpressionBtn()
                    .click()
                NewCustomFieldModal
                    .getESPExpressionInput()
                    .clear()
                    .type('my new expression')
                NewCustomFieldModal
                    .getManualBtn()
                    .click()
                NewCustomFieldModal
                    .getMultipleToggle()
                    .click() 
                // add options if necessary
                if (props.option_list.length > 4) {
                    for (let i = 0; i < props.manual_list.length - 4; i++) {
                        NewCustomFieldModal
                            .addOptionBtn()
                            .click()
                        cy.wait(100)
                    }
                }
                for (let optionNum = 1; optionNum < props.manual_list.length+1; optionNum++) {
                    NewCustomFieldModal
                        .getOptionInput(optionNum)
                        .clear()
                        .type(props.manual_list[optionNum-1])
                }
            }
        }
        // date form
        if (type === 'Date') {
            if (props.date_format) {
                NewCustomFieldModal
                    .getDateFormatSelect()
                    .select(props.date_format)
            }
        }

        // barcode form
       if (type === 'Barcode') {
            if (props.barcode_type) {
                NewCustomFieldModal
                    .getBarcodeTypeSelect(props.barcode_type)
                    .select(props.barcode_type)
            }
        }

        // resource link for
        if (type === 'Resource Link') {
            if (props.link_type === '') {
                throw new Error('createCustomField requires props.link_type when type===link')
            } else {
                NewCustomFieldModal
                    .getLinkTypeSelect(props.link_type)
                    .select(props.link_type)
            }
        }
        cy.wait(250)
        NewCustomFieldModal
            .getSaveBtn()
            .click()
    }   

    /**
     * Update a Container Type Custom Field
     * @param {String} name - Name of Custom Field to create *required*
     * @param {Enum} type - Custom field type *required* (text/number/picklist/date/checkbox/attachment/barcode/link)
     * @param {Object} props - Object with the following keys
     * * @param {String} props.editName - Edit Name
     * @param {String} props.editDesc - Edit Description
     * @param {String} props.editDefault - Edit Default value
     * @param {Boolean} props.editReadOnly - Edit Read Only (true/false)
     * @param {Boolean} props.editRequired - Edit Required (true/false)
     * @param {Enum} props.type - Edit Custom field type *required* (text/number/picklist/date/checkbox/attachment/barcode/link)
     * @param {List} props.addOptionList - List of picklist options to enter in Option 0:, Option 1:, etc, only used with type=picklist (['option1', 'option2']])
     */
    static editCustomField(name, type, props) {
        // Handle missing props keys
        props = props || {}
        props.editName = props.editName || ''
        props.editDesc = props.editDesc || ''
        props.editDefault = props.editDefault || ''
        props.read_only = props.editReadOnly || false
        props.editRequired = props.editRequired || false
        props.editType = props.editType || ''
        props.option_list = props.addOptionList || []

        ContainerTypesDetails
            .getCustomFieldsTab()
            .click()
        // edit the description
        ContainerTypesDetails
            .getCustomField(name)
            .find('.edit')
            .click()
        if(props.editName){
            NewCustomFieldModal
                .getNameInput()
                .clear()
                .type(props.editName)
        }
        if(props.editDesc){
            NewCustomFieldModal
                .getDescInput()
                .clear()
                .type(props.editDesc)
        }
        if(props.editDefault){
            NewCustomFieldModal
                .getDefaultValueInput()
                .clear()
                .type(props.editDefault)
        }
        if (props.editReadOnly) {
            NewCustomFieldModal
                .getReadOnlyCheckbox()
                .click()
        }
        if (props.editRequired) {
            NewCustomFieldModal
                .getRequiredCheckbox()
                .click()
        }
        if (props.option_list.length>0) {
            // add options if necessary
            if (props.option_list.length > 4) {
                for (let i = 0; i < props.option_list.length - 4; i++) {
                    NewCustomFieldModal
                        .addOptionBtn()
                        .click()
                    cy.wait(100)
                }
            }
            for (let optionNum = 1; optionNum < props.option_list.length+1; optionNum++) {
                NewCustomFieldModal
                    .getOptionInput(optionNum)
                    .clear()
                    .type(props.option_list[optionNum-1])
            }
        }
        if(props.editType){
            NewCustomFieldModal
                .getTypeSelect() //this will select the Type drop down
                .select(props.editType)
        } else {
            NewCustomFieldModal
                .getTypeSelect() //this will select the Type drop down
                .select(type)
        }
        NewCustomFieldModal
            .getSaveBtn()
            .click()
    }

    /**
     * Delete a Container Type Custom Field
     * @param {String} name - Name of the custom field to delete
     */
    static deleteCustomField(name) {
        DeleteCustomFieldModal.openModal(name)
        DeleteCustomFieldModal
            .getConfirmBtn()
            .click()
    }

    // Common Helper Functions

    static confirmType(name, type){
        cy.wait(500)
        ContainerTypesDetails
            .getSaveBtn()
            .click()
        ContainerTypesDetails
            .getCustomFieldsTab()
            .click()
        cy.wait(500)
        ContainerTypesDetails
            .getCustomField(name)
            .find('.edit')
            .click({force:true})
        NewCustomFieldModal
            .getNameInput()
            .should('have.value', name)
        NewCustomFieldModal
            .getTypeSelect()
            .find('option:selected')
            .should('contain', type)  
    }

}

export class NewDimensionModal{
    constructor() {}

    static openModal() {
        cy.contains('button', 'Add Dimension')
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'Edit Dimension')
    }

    static getNameInput() {
        return this.getModal()
            .find('input[name="name"]')
    }

    static getSuffixInput() {
        return this.getModal()
            .find('input[placeholder="enter suffix here"]')
    }

    static getElementsInput() {
        return this.getModal()
        .find('input[placeholder="enter elements here"]')
    }

    static getLabelSelect() {
        return this.getModal()
            .contains('.form-field', 'Label Type')
            .find('select')
    }

    static getLabelsInput() {
        return this.getModal()
            .find('input[placeholder="enter label"]')
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

export class DeleteDimensionModal{
    constructor() {}

    static openModal(dimension) {
        cy.contains('.container-dimension-row', dimension)
            .contains('close')
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'Remove Dimension')
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

// Used for both New Custom Field and Edit Custom Field
export class NewCustomFieldModal{
    constructor() {}

    static getModal() {
        return cy.contains('.modal-container', 'Custom Field')
    }

    static getNameInput() {
        return this.getModal()
            .find('input[placeholder="enter name here"]')
    }

    static getDescInput() {
        return this.getModal()
            .find('textarea[placeholder="enter description here"]')
    }

    static getDefaultValueInput() {
        return this.getModal()
            .find('.default-value-expression-editor textarea')
    }

    static typeDefaultValuePopup(popupValue) {
        this.getModal()
            .find('.default-value-expression-editor textarea')
            .click()
        cy.wait(500)
        cy.contains('.wrapper', 'open_in_new')
            .click()
        cy.get('.CodeMirror')
            .type(popupValue)
    }

    static getReadOnlyCheckbox() {
        return this.getModal()
            .contains('.checkbox-container', 'Read only')
            .find('i')
    }

    static getRequiredCheckbox() {
        return this.getModal()
            .contains('.checkbox-container', 'Required')
            .find('i')
    }

    static getVarGroupInput() {
        return this.getModal()
            .find('input[placeholder="Enter Var Group"]')
    }

    static getESPExpressionInput() {
        return this.getModal()
            .find('input[placeholder="ESP Expression"]')
    }

    static getTypeSelect() {
        return this.getModal()
            .contains('.form-field', 'Type')
            .find('select')
    }

    // Barcode Form
    static getBarcodeTypeSelect(barcodeType) { 
        return this.getModal()
            .contains('select', barcodeType) 
    }

    // Resource Link Form
    static getLinkTypeSelect(linkType) {
        return this.getModal()
            .contains('select', linkType)
    }

    // Picklist Form
    static getManualBtn() {
        return this.getModal()
            .contains('button', 'Manual')
    }

    static getESPExpressionBtn() {
        return this.getModal()
            .contains('button', 'ESP Expression')
    }

    static getMultipleToggle() {
        return this.getModal()
            .get('.toggle')
    }

    static getOptionInput(num) {
        return this.getModal()
            .contains('.picklist-option' , `Option ${num}:`)
            .find('input')
    }

    static deleteOptionInput(num) {
        return this.getModal()
            .contains('.picklist-option' , `Option: ${num}:`)
            .find('i')
            .click()
    }

    static addOptionBtn() {
        return this.getModal()
            .contains('.wrapper', 'Add option')
            .click()
    }

    // Date Form
    static getDateFormatSelect() {
        return this.getModal()
            .contains('select', 'Select a date format')
    }

    static getExampleDate() {
        return this.getModal()
            .contains('.form-field', 'Example Date')
            .find('.form-field__input')
    }
   
    // Buttons
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
    
    static getXPopupBtn() {
        cy.contains('.modal-container', 'ESP Expression')
            .should('be.visible')
        return cy.contains('.modal-container', 'ESP Expression')
            .contains('close')
    }
}

export class DeleteCustomFieldModal{
    constructor() {}

    static openModal(field) {
        cy.contains('.custom-field', field)
            .contains('close')
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'Yes, remove field')
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

export class ArchiveModal{
    constructor() {}

    static openModal() {
        ContainerTypesDetails
            .getArchiveBtn()
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'Archive Container Type')
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