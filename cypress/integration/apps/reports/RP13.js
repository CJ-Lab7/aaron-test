describe('13 - I can use Reports link in the nav bar', function() {
    // User Story 13: As a user in Reports when I am under Group tab, I can view details of reports in the Inspector Panel 
    before(function() {
        cy.seed('reports/RP13seed')
        cy.loginRoute('alice@example.com', 'L4b7R0cks!')
    })
    
    beforeEach(function() {
        cy.visit('/#/dashboard/reports')
    })

    after(function() {
        cy.seedTeardown('reports/RP13seed')
    })

    let name = 'RP13'
    let description = 'Dummy report for RP13'
    let tags = ['rp13', 'qa']
    let owner = 'system admin'

    it('RP-13-1 Should open inspector', function() {
        cy.contains('.tab', 'Group').click()
        cy.contains('.report-table-row', name).click()
        cy.get('.details')
            .contains(name)
            .should('be.visible')
    })

    it('RP-13-2 Should find details', function() {
        cy.contains('.tab', 'Group').click()
        cy.contains('.report-table-row', name).click()
        cy.contains('.section', name).find('.details')
            .as('details')
        cy.get('@details').contains(name)
        cy.get('@details').contains(description)
        cy.get('@details').contains(owner)
        cy.get('@details').contains(tags[0])
        cy.get('@details').contains(tags[1])
    })

    it('RP-13-3 Should click view details link', function() {
        cy.contains('.tab', 'Group').click()
        cy.contains('.report-table-row', name).click()
        cy.contains('.details', name).contains('a', 'View details').click()
        cy.url().should('contain', 'reports/details')
    })
})