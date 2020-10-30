describe('12 - I can use Reports link in the nav bar', function() {
    // User Story 12: As a user in the reports app, I can use Dashbaord links in the nav bar
    before(function() {
        cy.seed('reports/RP12seed')
        cy.loginRoute('alice@example.com', 'L4b7R0cks!')
    })
    
    beforeEach(function() {
        cy.visit('/#/dashboard/reports')
    })

    after(function() {
        cy.seedTeardown('reports/RP12seed')
    })

    it('RP-12-1 Should use Reports link', function() {
        cy.contains('.description', 'RP12').click()
        cy.url()
            .should('contain', 'reports/details')
        cy.contains('Details for RP12')
        cy.contains('.nav .tab', 'Reports')
            .click()
        cy.url()
            .should('not.contain', 'details')
    })

    it('RP-12-2 Should use DASHBOARD link', function() {
        cy.contains('.description', 'RP12').click()
        cy.url()
            .should('contain', 'reports/details')
        cy.contains('Details for RP12')
        cy.contains('.selected_app__title', 'Dashboard')
            .click()
        cy.url()
            .should('not.contain', 'details')
    })
})