// Sections of an ag-grid worksheet
export const SECTION = {
  ROOT : '.ag-root',
  HEADER : {
    ALL: '.ag-header',
    LEFT: '.ag-pinned-left-header',
    RIGHT: '.ag-pinned-right-header',
  },
  BODY : {
    ALL: '.ag-body-viewport',
    LEFT: '.ag-pinned-left-cols-container',
    CENTER: '.ag-center-cols-viewport',
    RIGHT: '.ag-pinned-right-cols-container',
  }
}

// Elements found within an ag-grid body section
export const BODY_ELEMENT = {
  ROW: '.ag-row',
  CELL: '.ag-cell',
  CENTERCONTAINER: '.ag-center-cols-container',
  DROPDOWN: '.multiselect__input',
  INPUT: '.ag-cell-edit-input',
  CHECKBOX: '.ag-selection-checkbox',
  COMPLETE: 'input[type="checkbox"]',
  POPUP: '.ag-popup-editor',
  CONTRACTED: '.ag-group-contracted', // arrow to expand grouped samples
  EXPANDED: '.ag-icon-expanded' // arrow by inventory items
}

// Elements found within an ag-grid header section
export const HEADER_ELEMENT = {
  ROW: '.ag-header-row', 
  CELL: '.ag-header-cell',
  COMPLETE: 'input.complete',
  CHECKBOX: 'input.checkbox-test',
  UUID: 'div[col-id="uuid"]',
  NAME: 'div[col-id="name"]',
  DESCRIPTION: 'div[col-id="description"]',
  OWNER: 'div[col-id="owner"]',
  LASTUPDATED: 'div[col-id="lastUpdated"]',
  PARAMETERS: 'div[col-id="parametersCount"]'
}

// ag-grid checkbox icons
export const CHECKBOX_ICON = {
  CHECKED: '.ag-icon-checkbox-checked',
  UNCHECKED: '.ag-icon-checkbox-unchecked',
  UNDEFINED: '.ag-icon-checkbox-indeterminate'
}

// ag-grid levels for sample provenance graph
export const LEVEL = {
  ZERO: '.ag-row-level-0',
  ONE: '.ag-row-level-1',
  TWO: '.ag-row-level-2',
}

// ag-menu 
export const AG_MENU = {
  TABHEADER: '.ag-tab-header',
  CELLMENU: '.ag-header-cell-menu-button',
  TABHEADERCONTENT:{
    ALLCHECKBOX: '.ag-primary-cols-header-panel',
    COLUMN: '.ag-tab',
    COLUMNS: '.ag-icon-columns',
    FILTER: '.ag-icon-filter',
    FILTERINPUT: '.ag-primary-cols-filter'

  },
  TABBODY: {
    TABLIST: '.ag-primary-cols-list-panel',
    TABLISTITEM: '.ag-column-tool-panel-column-label',
  },
  TABBODYFILTER:{
    SECONDTABINPUTPARAMETERONE: 'div[ref="eInputWrapper1"]',
    SECONDTABINPUTPARAMETERTWO: 'div[ref="eInputWrapper2"]',
    CONDITIONSELECTOR: '.ag-filter-select',
    CONDITIONAND: 'input.and',
    CONDITIONOR: 'input.or',
    SEARCHINPUT: '.ag-filter-filter'
  }
}

export const paramDetails = {
  HEADERROW: '.header.container-fluid .row',
  BODYROWS: '.body.container-fluid .row',
  HISTORYTAB:{
    DATECOLUMNCHILDREN: 'div.col-1',
    ACTIONCOLUMNCHILDREN: 'div.col-4',
    OWNERCOLUMNCHILDREN: 'div.col-2'
  }

}