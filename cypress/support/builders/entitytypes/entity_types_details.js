export class EntityTypesDetails{
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

    static getEntityClassSelect() {
        return cy.contains('.info-panel tr', 'Entity Class')
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

    // Custom Fields Tab
    static getCustomFieldsTab() {
        return cy.contains('.tab', 'Custom Fields')
    }
    
    static getCustomField(name) {
        return cy.contains('.custom-field', name)
    }

    // Sample ID Sequences Tab
    static getSequenceTab() {
        return cy.contains('.tab', 'Sample ID Sequences')
    }

    static getSequenceHeader() {
        return cy.get('.sequences-table .header')
    }

    static getSequenceRow(name) {
        return cy.contains('.sequences-table .body .row', name)
    }

    // History Tab
    static getHistoryTab() {
        return cy.contains('.tab', 'History')
    }

    // CRUD
    
    /**
     * Create a Entity Type Custom Field
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
        EntityTypesDetails
            .getCustomFieldBtn()
            .click()
        NewCustomFieldModal
            .getNameInput()
            .clear()
            .type(name)
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
        NewCustomFieldModal
            .getTypeSelect() //this will select the Type drop down
            .select(type)
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
            //  } else {
              //  NewCustomFieldModal
                //    .getManualBtn()
                  //  .click()
            }
            if (props.multiple) {
                NewCustomFieldModal
                    .getMultipleToggle()
                    .click()
            }
            if (props.option_list.length>0) {
                // add options if necessary
                if (props.option_list.length > 4) {
                    for (let i = 0; i < props.option_list.length - 4; i++) {
                        NewCustomFieldModal
                            .addOptionBtn()
                            //.click()
                        cy.wait(100)
                    }
                }
                //it used to start with Option 0. Now the developer changed to start with Option 1 (optonNum)
                for (let optionNum = 1; optionNum < props.option_list.length+1; optionNum++) {
                    NewCustomFieldModal
                        .getOptionInput(optionNum)
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
                    .type(`{{}{{} ['option %s' % i for i in range(1,6)] }}`)      
            }
            if (props.manual_list.length>0) {
                NewCustomFieldModal
                   .getESPExpressionBtn()
                    .click()
                NewCustomFieldModal
                    .getESPExpressionInput()
                    .clear()
                    .type(`{{}{{} ['option %s' % i for i in range(1,6)] }}`)
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
     * Update a Entity Type Custom Field
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
        props.expression_text = props.expression_text || []
        props.manual_list = props.manual_list || []

        EntityTypesDetails
            .getCustomFieldsTab()
            .click()
        cy.wait(500)
        // edit the description
        EntityTypesDetails
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
            if (props.manual_list.length>0) {
                NewCustomFieldModal
                   .getESPExpressionBtn()
                    .click()
                NewCustomFieldModal
                    .getESPExpressionInput()
                    .clear()
                    .type(`{{}{{} ['option %s' % i for i in range(1,6)] }}`)
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
     * Delete a Entity Type Custom Field
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
        EntityTypesDetails
            .getSaveBtn()
            .click()
        EntityTypesDetails
            .getCustomFieldsTab()
            .click()
        cy.wait(500)
        EntityTypesDetails
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
        EntityTypesDetails
            .getArchiveBtn()
            .click()
        this.getModal()
            .should('be.visible')
    }

    static getModal() {
        return cy.contains('.modal-container', 'Yes, Archive Entity Type')
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