
import { ESPAppsEnum } from '../enums/apps';
import { workflowTypeEnum } from '../enums/workflow'
import Worksheet from './worksheet'
import Hash from '../helper/hash'

export default class Experiment {
    constructor(name) {
        // Will probably need the properties in the experiment object
        // I think this is just getting the /api/projects call so look into this further
        let experimentExists = cy.request('/api/projects/experiments').its('body').then(($body) => {
            for(var i = 0; i < $body.length; ++i) {
                if($body[i].name === name) {
                    return true
                }
            }
        })
        if(experimentExists) {
            this.name = name
        } else {
            this.name = null
            cy.log('The experiment name does not exist.', name)
        }
    }

    // Creating an experiment requires information for the workflow type and name
    // as well as the sample type and number.
    static create(projectName, workflow, samples) {
        let experimentName = Hash.alphanumeric()

        cy.NavigateToAppViaClick(ESPAppsEnum.PROJECTS)

        // Find the project we wish to create an experiment for.
        cy.get('.project-list').contains('[data-test=project-list__project-table-row]', projectName)
                .espScrollIntoView() //.contains('button', 'Experiment')
                .within(() => {
                    cy.get('[data-test=project-list__project-table-row-actions-experiments]').click()
                })

        // Create new experiment
        if(workflow.workflowType === workflowTypeEnum.CHAIN) {
            cy.get('[data-test=new-experiment-modal__form--workflow-chain-radio]').click()
        }
        else if (workflow.workflowType === workflowTypeEnum.WORKSHEET) {
            cy.log('Not implemented. Goodbye.')
        }

        cy.get('[data-test=form__workflow-options--select]').select(workflow.workflowName)
        cy.get('[data-test=form__workflow--name]').type(experimentName)
        cy.get('[data-test=experiment__footer-button--next]').click()

        // Add New Samples
        cy.get('[data-test=options-button]').contains('Add New Samples').click()
        cy.get('[data-test=samples-add__details-field--number]').type(samples.sampleNumber)
        cy.get('[data-test=samples-add__details-sample--type]').select(samples.sampleType)
        // TODO: Sample ID Sequence should be checked
        cy.get('[data-test=experiment__footer-button--next]').click()

        // Review and Save
        //
        // is selecting the app-checkbox necessary??
        // will need to account for more than one sample
        //cy.get('[data-test=selectable-sample-sheet__app-checkbox]').click()

        cy.get('[data-test=experiment__footer-button--next]').click()
        cy.get('[data-test=popup__experiment-samples--submit]').click().then(($button) => {
            cy.wrap($button).should('not.exist')
        })

        return new Experiment(experimentName)
    }

    addWorksheet(workflowName) {
        return Worksheet.create(workflowName, this.name)
    }
}
