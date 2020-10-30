

let appList = ['admin', 'analysis', 'applets', 'dashboard', 'data', 'entities', 'iam', 
        'ingest', 'inventory', 'lims', 'location', 'projects', 'samples', 'search']

export function testPermission(accessApp) {
    // find app via app picker
    cy.visit('/')
    cy.get('.app-picker')
        .find(`a[href="#/${accessApp}"]`)
    for (let app of appList) {
        if (app !== accessApp) {
            cy.get('.app-picker')
                .find(`a[href="#/${app}"]`)
                .should('not.exist')
        }
    }
    if (accessApp === 'iam') {
        cy.get('.app-picker')
            .find(`a[href="#/${accessApp}"]`)
    } else {
        cy.get('.app-picker')
            .find(`a[href="#/${accessApp}"]`)
    }
    // find app via app drawer
    for (let app of appList) {
        cy.get('.navbar .mark img', {timeout: 20000})
            .click()
        if (app === accessApp) {
            if (accessApp === 'iam') {
                cy.get('.app-drawer')
                    .find(`a[href="/admin"]`)
            } else {
                cy.get('.app-drawer')
                    .find(`a[href="#/${accessApp}"]`)
            }
        } else {
            cy.get('.app-drawer')
                .find('a[href="#/home"]')
            cy.get('.app-drawer')
                .find(`a[href="#/${app}"]`)
                .should('not.exist')
        }
    }
}

export function clickLinkAppDrawer(app) {
    // visit app via app drawer
    cy.visit('/')
    cy.get('.navbar .mark img', {timeout: 20000})
    cy.wait(1000)
    cy.get('.navbar .mark img')
        .click()
    cy.wait(1000)
    cy.get('.app-drawer')
        .find(`a[href="#/${app}"]`)
        .click()
    cy.url()
        .should('contain', '#/' + app)
    cy.wait(1500)
}

export function clickLinkAppPicker(app) {
    // visit app via app picker
    cy.visit('/')
    cy.get('.app-picker')
        .find(`a[href="#/${app}"]`)
    cy.wait(500)
    cy.get('.app-picker')
        .find(`a[href="#/${app}"]`)
        .click()
    cy.url()
        .should('contain', '#/' + app)
    cy.wait(1500)
}

export function noLinkAppPicker(app) {
    cy.get('.app-picker')
        .find(`a[href="#/${app}"]`)
        .should('not.exist')
}

export function noLinkAppDrawer(app) {
    cy.get('.navbar .mark img', {timeout: 20000})
        .click()
    cy.get('.app-drawer')
        .find('a[href="#/home"]')
    cy.get('.app-drawer')
        .find(`a[href="#/${app}"]`)
        .should('not.exist')
}

export function addressBarAccess(app) {
    if (app === 'iam') {
        cy.visit('/admin')
        cy.url()
            .should('contain', '/admin')
    } else {
        cy.visit('#/' + app)
        cy.url()
            .should('contain', '#/' + app)
    }
    cy.wait(1500)
}

export function addressBarNoAccess(app) {
    if (app === 'admin') {
        cy.visit('/admin', {failOnStatusCode: false})
        cy.contains('.no-license', 'You are not authorized for Admin app')
    } else {
        cy.visit('#/' + app)
        cy.contains('.no-license', 'You are not authorized for ' + app.charAt(0).toUpperCase() + app.slice(1) + ' app')
    }
}

