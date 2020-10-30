
import { ESPAppsEnum } from '../enums/apps'
import Experiment from './experiment'

export default class Project {
    constructor(name) {
        // TODO: The API request will give us all existing parameters
        // for the project. We should give our Project class these
        // parameters to initialize with besides only the name.
        let projectExists = cy.request('api/projects'.concat('?name=', name)).its('body').then(($body) => {
            if( !($body == null) ) { return true }
        })
        if(projectExists) {
            this.name = name
        } else {
            this.name = null
            cy.log('The project name does not exist.', name)
        }
    }

    static create(name) {
        cy.NavigateToAppViaClick(ESPAppsEnum.PROJECTS)
        cy.get('[data-test=button__primary--new-project]').click()
        cy.get('[data-test=modal-container__project--name]').type(name)
        cy.get('[data-test=modal-container__project-save--button]').click().then(function($button) {
            cy.wrap($button).should('not.exist')
        })

        return new Project(name)
    }

    newExperiment(workflow, samples) {
        return Experiment.create(this.name, workflow, samples)
    }
}
