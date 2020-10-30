import * as ag from "./ag_enum"


/**
   * Sort an ag-grid column by clicking on the header
   * The header is clicked 3 times to toggle between asceding/descending/none
   * The header icon is used to determine which sorting to assert
   *
   * @param {String} columnName - Name of column in the header
   * @param {Number} columnPos - position of the column in the header (0 index)
   * @param {String} headerSelector - selector for table row
   * @param {String} rowSelector - selector for table row
  */
export function sortAgColumn(columnName, columnPos, headerSelector, rowSelector, clickPos = 'center') {
    for (let numClick = 0; numClick < 3; numClick++) {
        cy.get(headerSelector)
            .contains(columnName)
            .as('nameCol')
            .click(clickPos)
        cy.wait(1000)
        cy.contains(headerSelector, columnName)
            .find('.ag-header-icon')
            .then($headerIcons => {
                let ascendIcon = $headerIcons.filter('.ag-sort-ascending-icon')
                let descendIcon = $headerIcons.filter('.ag-sort-descending-icon')
                if (!ascendIcon.hasClass('ag-hidden')) { // ascending
                    assertAlphabetic(true)
                } else if (!descendIcon.hasClass('ag-hidden')) { // descending
                    assertAlphabetic(false)
                } 
            })
    }

    // ascending === true -> top row is less than bottom row (alphabetically)
    function assertAlphabetic(ascending) {
        cy.get(rowSelector).then(($rows) => {
            
            let espRowOrder = []
            for(let rowIndex = 0; rowIndex < $rows.length; rowIndex++) {
                espRowOrder.push($rows.filter(`[row-index=${rowIndex}]`)[0].children[columnPos].textContent)
            }
            let originalOrder = [...espRowOrder]
            let ascendingOrder = espRowOrder.sort(function (a, b) {
                return a.toLowerCase().localeCompare(b.toLowerCase())
            })
            if (ascending) { // ascending
                expect(originalOrder).to.deep.eq(ascendingOrder)
            } if (!ascending) { // descending
                expect(originalOrder).to.deep.eq(ascendingOrder.reverse()) 
            }
        })
    }
}

export function sortHistoryColumn(columnName, columnPos, headerSelector, rowSelector, clickPos = 'center') {
    for (let numClick = 0; numClick < 3; numClick++) {
        cy.get(headerSelector)
            .contains(columnName)
            .as('nameCol')
            .click(clickPos)
        cy.wait(1000)
        cy.contains(headerSelector, columnName)
            .find('i.sort-icon')
            .then($headerIcons => {
                let ascendIcon = $headerIcons.filter('.active')
                let descendIcon = $headerIcons.filter('.active')
                if (!ascendIcon.hasClass('active')) { // ascending
                    assertAlphabetic(true)
                } else if (!descendIcon.hasClass('active')) { // descending
                    assertAlphabetic(false)
                } 
            })
    }

    // ascending === true -> top row is less than bottom row (alphabetically)
    function assertAlphabetic(ascending) {
        cy.get(rowSelector).then(($rows) => {
            let espRowOrder = []
            for(let rowIndex = 0; rowIndex < $rows.length; rowIndex++) {
                let ordInd = `[order-${rowIndex}]`
                espRowOrder.push($rows.filter(ordInd)[0].children[columnPos].textContent)                
            }
            let originalOrder = [...espRowOrder]
            let ascendingOrder = espRowOrder.sort(function (a, b) {
                return a.toLowerCase().localeCompare(b.toLowerCase())
            })
            if (ascending) { // ascending
                expect(originalOrder).to.deep.eq(ascendingOrder)
            } if (!ascending) { // descending
                expect(originalOrder).to.deep.eq(ascendingOrder.reverse()) 
            }
        })
    }
}

// watches for the ag-grid table to refresh
export function assertAgRefresh() {
    cy.get(ag.SECTION.ROOT)
        .should('not.be.visible')
    cy.get(ag.SECTION.ROOT)
        .should('be.visible')
    cy.wait(1000)
}

// click transpose button
export function transpose() {
    cy.contains(ag.HEADER_ELEMENT.CELL, 'Complete')
    cy.contains('.icon-button', 'rotate_90_degrees_ccw')
        .click()
}

export function resetColumns(){
      
    cy.get('.ag-icon.ag-icon-menu').first().click({force: true})
    cy.get('.ag-menu.ag-ltr').then((body) => {
        if (body.find('.ag-menu-option-text').length > 0) {
            cy.contains('.ag-menu-option-text', 'Reset Columns').click()
        } 
        else {
            cy.get('.ag-tab:nth-child(1)').click()
            cy.wait(1000)
            cy.contains('.ag-menu-option-text', 'Reset Columns').click()
        } 
    })
}

export function getColumnsHeader() {
    return cy.get(`${ag.HEADER_ELEMENT.ROW}`)
}

export function getFirstColumn() {
    return cy.get(`${ag.SECTION.HEADER.LEFT} ${ag.HEADER_ELEMENT.ROW} ${ag.HEADER_ELEMENT.CELL}`)
}

export function getColumn(selector) {
    return cy.get(`${ag.HEADER_ELEMENT.ROW} `+ selector )
}

export function getColumnChildrenList(selector) {
    return cy.get(`${ag.BODY_ELEMENT.ROW} ` + selector)
}

export function openColsMenu(columnSelector){
    return cy.get(columnSelector +` ${ag.AG_MENU.CELLMENU}` )
}

export function clickSecondMenuTab() {
    cy.get('body').then((body) => {
        if (body.find('.ag-tab-header .ag-tab-selected:nth-child(2)').length > 0) {
            cy.wait(1000)
        } 
        else{
            cy.get(`${ag.AG_MENU.TABHEADER} ${ag.AG_MENU.TABHEADERCONTENT.FILTER}`).click()
        }
    })
}

export function getThirdMenuTab() {
    return cy.get(`${ag.AG_MENU.TABHEADERCONTENT.COLUMNS}`)
}

export function getFilterMenuSecondTabInputFirst() {
    return cy.get(`${ag.AG_MENU.TABBODYFILTER.SECONDTABINPUTPARAMETERONE} ${ag.AG_MENU.TABBODYFILTER.SEARCHINPUT}`)
}

export function getFilterMenuSecondTabInputSecond() {
    return cy.get(`${ag.AG_MENU.TABBODYFILTER.SECONDTABINPUTPARAMETERTWO} ${ag.AG_MENU.TABBODYFILTER.SEARCHINPUT}`)
}

export function getFilterMenuSecondTabFilterSelectorOne() {
    return cy.get(`${ag.AG_MENU.TABBODYFILTER.CONDITIONSELECTOR}`).eq(0)
}

export function getFilterMenuSecondTabFilterSelectorTwo() {
    return cy.get(`${ag.AG_MENU.TABBODYFILTER.CONDITIONSELECTOR}`).eq(1)
}

export function getFilterMenuSecondTabConditionAnd() {
    return cy.get(`${ag.AG_MENU.TABBODYFILTER.CONDITIONAND}`)
}

export function getFilterMenuSecondTabConditionOr() {
    return cy.get(`${ag.AG_MENU.TABBODYFILTER.CONDITIONOR}`)
}

export function getFilterMenuInput() {
    return cy.get(`${ag.AG_MENU.TABBODYFILTER.SEARCHINPUT}`)
}

export function getMenuColsList() {
    return cy.get(`${ag.AG_MENU.TABBODY.TABLIST}`)
}

export function getColsListItem(ColumnName) {
    return cy.contains(`${ag.AG_MENU.TABBODY.TABLISTITEM}`, ColumnName)
}

export function getMenuInput() {
    return cy.get(`${ag.AG_MENU.TABHEADERCONTENT.FILTERINPUT}`)
}

export function selectAllColsCheckbox () {
    cy.get('body').then((body) => {
        if (body.find('div[ref="eSelect"]>span.ag-icon.ag-icon-checkbox-checked.ag-hidden').length > 0) {
            cy.get('div[ref="eSelect"]').click()
        } 
    })
}

export function getSeconMenuTabFilter(){
    return cy.get(`${ag.AG_MENU.TABHEADER} ${ag.AG_MENU.TABHEADERCONTENT.FILTER}`)
}
