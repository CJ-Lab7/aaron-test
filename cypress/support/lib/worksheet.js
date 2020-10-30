
import { ESPAppsEnum } from '../enums/apps'
import { relativeTimeRounding } from 'moment';

export default class Worksheet {
    /**
     * Summary: .
     * 
     * Description: .
     * 
     * @param {string} worksheetName Worksheet name string.
     * @param {string} workflowName Workflow name string.
     * @param {string} experimentName Experiment name string that owns the Worksheet.
     * @param  {...any} args Individual Protocol class objects, e.g. Protocol1, Protocol2, Protocol3...
     */
    constructor(worksheetName, workflowName, experimentName, ...args) {
        this.worksheetName = worksheetName
        this.workflowName = workflowName
        this.experimentName = experimentName

        this.protocols = []
        if( !(args == null) ) {
            this.addProtocols(...args)
        }
    }

    /**
     * Summary: Adds Protocol objects to the worksheet making the call.
     * 
     * Description: Adds Protocol objects to the worksheet. The caller should pass Protocol objects that
     * are associated with the worksheet. Otherwise, conflict will occur when acting on the Protocols
     * when using a WorksheetWorker.
     * 
     * @param  {...any} args Individual Protocol class objects, e.g. Protocol1, Protocol2, Protocol3... 
     */
    addProtocols(...args) {
        let length = this.protocols.length
        args.forEach((element, index) => {
            this.protocols[length + index] = element
        })
    }

    /**
     * 
     * @param {string} workflowName Workflow name string.
     * @param {string} experimentName Experiment name string that owns the Worksheet to be created.
     */
    static create(workflowName, experimentName) {
        // TODO: May need another worksheet name creation method
        let worksheetName = experimentName + '-' + workflowName
        
        cy.NavigateToAppViaClick(ESPAppsEnum.LIMS, true)
        
        cy.get('#experiments-list').within(() => {
            cy.contains('[data-test=lab-submissions__experiments--instance]', experimentName)
                .espScrollIntoView()
                .within(() => {
                    cy.get('[data-test=lab-submissions__experiments--instance--add]').click()
            })
        })

        // TODO: May need to do a better worksheet name method.
        cy.get('[data-test=modal__container-data--sample-sheet-name]').type('{selectall}' + worksheetName)
        
        // We need to wait for the modal to clear out so we do an assertion.
        // This gives the grid time to refresh and update.
        cy.contains('button', 'Add Worksheet').click().then(($element) => {
            cy.wrap($element).should('not.exist')
        })

        cy.get('#experiments-list').within(() => {
            cy.contains('[data-test=lab-submissions__experiments--instance]', experimentName).should('not.exist')
        })

        return new Worksheet(worksheetName, workflowName, experimentName)
    }

    /**
     * 
     */
    open() {
        cy.NavigateToAppViaClick(ESPAppsEnum.LIMS)

        // TODO: Need to account for Cards instead of just List
        cy.get('.ag-row').within(() => {
            cy.contains('a', this.worksheetName).espScrollIntoView().should('be.visible').then((element) => {
                //cy.wrap(element).click('top', { force: true })
                cy.wrap(element).invoke('height').as('height')
                cy.wrap(element).invoke('width').as('width')
                cy.get('@height').then((height) => {
                    cy.get('@width').then((width) => {
                        cy.wrap(element).invoke('mousemove').click((width/2), (height/2)).should('not.exist')
                    })
                })
            })
        })
    }

    /**
     * 
     * @param {*} saveAndContinue Pass 'true' if you wish to select 'Save and Continue' instead of just 'Save'.
     */
    save(saveAndContinue=false) {
        if(saveAndContinue) {
            this.saveAndContinueButton()
        } else {
            this.saveButton()
        }
    }

    /**
     * 
     */
    nextProtocolButton() {
        cy.get('[data-test=protocol-button--next]').then((element) => {
            cy.wrap(element).invoke('attr', 'disabled').then((value) => {
                if(value === 'disabled') {
                    cy.log('Next Protocol button is not enabled.')
                } else {
                    cy.wrap(element).click()
                }
            })
        })
    }

    /**
     * 
     */
    previousProtocolButton() {
        cy.get('[data-test=protocol-button--previous]').then((element) => {
            cy.wrap(element).invoke('attr', 'disabled').then((value) => {
                if(value === 'disabled') {
                    cy.log('Previous Protocol button is not enabled.')
                } else {
                    cy.wrap(element).click()
                }
            })
        })
    }

    /**
     * 
     */
    saveButton() {
        cy.get('[data-test=worksheet-tab--save-button]').then((element) => {
            cy.wrap(element).invoke('attr', 'disabled').then((value) => {
                if(value === 'disabled') {
                    cy.log('Save button is not enabled.')
                } else {
                    cy.wrap(element).click()
                    cy.get('.loading-dots').should('not.exist').then(() => {
                        cy.get('.ag-body-viewport').should('be.visible').invoke('mouseover')
                    })
                }
            })
        })
    }

    /**
     * 
     */
    archiveButton() {
        cy.get('[data-test=right-content__secondary--archive-button]').then((element) => {
            cy.wrap(element).invoke('attr', 'disabled').then((value) => {
                if(value === 'disabled') {
                    cy.log('Archive button is not enabled.')
                } else {
                    cy.wrap(element).click()
                    cy.get('.loading-dots').should('not.exist').then(() => {
                        cy.get('.ag-body-viewport').should('be.visible').invoke('mouseover')
                    })
                }
            })
        })
    }

    /**
     * 
     */
    saveAndContinueButton() {
        cy.get('[data-test=worksheet-tab--save-continue-button]').then((element) => {
            cy.wrap(element).invoke('attr', 'disabled').then((value) => {
                if(value === 'disabled') {
                    cy.log('Save and Continue button is not enabled.')
                } else {
                    cy.wrap(element).click()
                    cy.get('.loading-dots').should('not.exist').then(() => {
                        cy.get('.ag-body-viewport').should('be.visible').invoke('mouseover')
                    })
                }
            })
        })
    }

    submitToNextWorksheet() {
        cy.get('input[value="Send Samples to Next Workflow"]').should('be.visible').click()
        cy.get('.ag-overlay-loading-center').should('not.exist')
        
        // cy.reload().then(() => {
        //     for(var i = 0; i < this.protocols.length - 2; ++i) {
        //         this.nextProtocolButton()
        //     }
        // })
        // cy.document().then(document => {
        //     return new Cypress.Promise(resolve => { // Cypress will wait for this Promise to resolve
        //         const onQueryEnd = () => {
        //             document.removeEventListener('afterGridColumnsChange', onQueryEnd) // cleanup
        //             resolve() // resolve and allow Cypress to continue
        //         }
        //         document.addEventListener('afterGridColumnsChange', onQueryEnd)
        //         this.nextProtocolButton()
        //     })
        // }).then(() => {
        //     cy.get('.action-buttons').children().each((input) => {
        //         cy.wrap(input).invoke('attr', 'value').then((value) => {
        //             if(value === 'Send Samples to Next Workflow') {
        //                 cy.wrap(input).should('be.visible').click()
        //             }
        //         })
        //     })
        // })
    }
}
