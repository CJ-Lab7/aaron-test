
import { espUser } from '../enums/user'

/**
   * Login through the UI.
   *
   * @param {String} email - User's email address for login
   * @param {String} password - User's password
*/
Cypress.Commands.add('loginUI', (email, password) => {
    cy.visit('/#/login').then(() => {
        cy.clearCookie('lab7user')
        cy.get('#login').then(() => {
            cy.get('input[name=username]')
                .type(email)
                .should('have.value', email)
            cy.get('input[name=password]')
                .type(password)
                .should('have.value', password)
            cy.get('#submit-btn').click()
            cy.get('#log_in_wrapper').should('not.be.visible')
        })
    })
})

/**
   * Obtain login cookie through POST request
   *
   * @param {String} email - User's email address for login
   * @param {String} password - User's password
*/
Cypress.Commands.add('loginRoute', (email, password) => {
    cy.clearCookie('lab7user')
    cy.request({
        method: 'POST',      
        credentials: 'include',
        url: '/login', 
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic ' + btoa(email + ':' + password)
            }
        }).as('response')
    cy.get('@response').should((response) => {
        expect(response.status).to.eq(200)
    })
})

/**
 * Login with the desired user.
 * 
 * @param {String} user - A user listed in the 'espUser' enum.
*/
Cypress.Commands.add('login', (user) => {
    switch(user) {
        case espUser.ADMIN:
            cy.loginUI('admin@localhost', 'password')
            break;
        case espUser.STANDARD:
            cy.log('Not yet implemented. Now watch the world burn.')
            break;
        default:
            cy.log('Not a valid user entry for logging in.')
            break;
    }
})

/**
   * Login Alice Admin through the UI
   * Login as admin through UI
   * TODO - remove from admin tests (use loginUI)
*/
Cypress.Commands.add('loginAdmin', () => {
    let email = 'admin@localhost'
    cy.visit('/#/login')
    cy.get('input[name=username]')
        .type(email)
        .should('have.value', email)
    cy.get('input[name=password]')
        .type(Cypress.env('passwordAdmin'))
        .should('have.value', Cypress.env('passwordAdmin'))
    cy.get('#submit-btn').click()
    cy.get('.nav')
    cy.visit('/admin')
});

/**
   * Logout through POST request
*/
Cypress.Commands.add('logoutRoute', () => {
    cy.request({
        method: 'POST',
        credentials: 'include',
        url: '/logout',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
})
