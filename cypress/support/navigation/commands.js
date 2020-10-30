
import { ESPAppsEnum } from '../enums/apps'

/*
    *
    *
    *
*/
Cypress.Commands.add('NavigateToAppViaClick', (app, forceClick=false) => {
    
    switch(app) {
        case ESPAppsEnum.ANALYSIS:
            //cy.get('.apps > [href="#/analysis"]').click()
            NavigateIfNotOnPage('/analysis', '.apps > [href="#/analysis"]', forceClick)
            break
        case ESPAppsEnum.DASHBOARD:
            //cy.get('.apps > [href="#/dashboard"]').click()
            NavigateIfNotOnPage('/dashboard', '.apps > [href="#/dashboard"]', forceClick)
            break
        case ESPAppsEnum.DATA:
            //cy.get('.apps > [href="#/data"]').click()
            NavigateIfNotOnPage('/data', '.apps > [href="#/data"]', forceClick)
            break
        case ESPAppsEnum.INVENTORY:
            //cy.get('.apps > [href="#/inventory"]').click()
            NavigateIfNotOnPage('/inventory', '.apps > [href="#/inventory"]', forceClick)
            break
        case ESPAppsEnum.LIMS:
            //cy.get('.apps > [href="#/lims"]').click()
            NavigateIfNotOnPage('/lims', '.apps > [href="#/lims"]', forceClick)
            break
        case ESPAppsEnum.LOCATION:
            //cy.get('.apps > [href="#/location"]').click()
            NavigateIfNotOnPage('/location', '.apps > [href="#/location"]', forceClick)
            break
        case ESPAppsEnum.PROJECTS:
            //cy.get('.apps > [href="#/projects"]').click()
            NavigateIfNotOnPage('/projects', '.apps > [href="#/projects"]', forceClick)
            break
        case ESPAppsEnum.SAMPLES:
            //cy.get('.apps > [href="#/samples"]').click()
            NavigateIfNotOnPage('/samples', '.apps > [href="#/samples"]', forceClick)
            break
        default:
            cy.log('Unable to visit the specified app in ESP: ', app)
            break
    }
})

/*
    *
    *
    *
*/
Cypress.Commands.add('NavigateToAppViaUrl', (app) => {
    switch(app) {
        case ESPAppsEnum.ANALYSIS:
            cy.visit('/analysis')
            break
        case ESPAppsEnum.DASHBOARD:
            cy.visit('/dashboard')
            break
        case ESPAppsEnum.DATA:
            cy.visit('/data')
            break
        case ESPAppsEnum.INVENTORY:
            cy.visit('/inventory')
            break
        case ESPAppsEnum.LIMS:
            cy.visit('/lims')
            break
        case ESPAppsEnum.LOCATION:
            cy.visit('/location')
            break
        case ESPAppsEnum.PROJECTS:
            cy.visit('/projects')
            break
        case ESPAppsEnum.SAMPLES:
            cy.visit('/samples')
            break
        default:
            cy.log('Unable to visit the specified app in ESP: ', app)
            break
    }
})


function NavigateIfNotOnPage(urlSubString, navMenuItem, forceClick) {
    cy.url().then((result) => {
        if(!result.includes(urlSubString) || forceClick) {
            // TODO: .mark and .app-drawer needs a v-test attribute for robustness
            cy.get('.mark').click().then(() => {
                cy.get('.app-drawer').should('exist').within(function() {
                    cy.get(navMenuItem).click().then(($element) => {
                        cy.wrap($element).should('not.exist')
                    })
                })
            })
        }
    })
}