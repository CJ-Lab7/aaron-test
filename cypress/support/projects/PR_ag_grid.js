export function checkPipeline(num_results, label_have, label_not_have) {
    checkNav(num_results, label_have)
    checkNotNav(num_results, label_not_have)
}

function checkNav(num_results, label) {
    for (let i = 0; i < num_results; i++) {
        cy.get('.ag-header-cell-text').eq(i).should('have.text', label[i])
    }
}

function checkNotNav(num_results, label) {
    for (let z = 0; z < label.length; z++) {
        for (let i = 0; i < num_results; i++) {
            cy.get('.ag-header-cell-text').eq(i).should('not.have.text', label[z])
        }
    }
}

export function openAgGrid() {
    cy.get('.ag-icon.ag-icon-menu').eq(0).click({ force: true })
    cy.wait(2000)
}

export function resetColumns() {
    openAgGrid()
    cy.contains('span', 'Reset Columns').click()
}

export function moveElement(from_number, to_number) {
    cy.get('span.ag-header-cell-text').eq(to_number)
        .trigger("mousedown", { button: 0 }, { force: true })
        .trigger("mousemove", 200, -200, { force: true })
    cy.get('span.ag-header-cell-text').eq(from_number).click()
        .trigger("mouseup", { force: true });
}

export function checkPosition(first, second, third) {
    cy.get('.ag-header-cell.ag-header-cell-sortable').eq(0).should('have.css', 'left', first)
    cy.get('.ag-header-cell.ag-header-cell-sortable').eq(1).should('have.css', 'left', second)
    cy.get('.ag-header-cell.ag-header-cell-sortable').eq(2).should('have.css', 'left', third)
}