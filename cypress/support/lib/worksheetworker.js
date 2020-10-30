
import Cell from '../../support/lib/cell'
import { espUser } from '../../support/enums/user'
import Date from '../../support/helper/date'

export default class WorksheetWorker {
    /**
     * The worksheet worker will take a worksheet object
     * to work directly on.
     * 
     * @param {Worksheet} worksheet An initialized Worksheet object.
     */
    constructor(worksheet) {
        this.worksheet = worksheet
    }

    /**
     * Fills out the worksheet with the given protocol data.
     * 
     * @param {Array}   protocolData An array of JSON objects with protocol headers and the data to apply to the associated cells.
     * @param {Boolean} transpose Pass true to complete the worksheet in transposed view.
     */
    completeWorksheet(protocolData, transpose=false) {
        let numberOfProtocols = this.worksheet.protocols.length
        let numberOfProtocolsWithData = protocolData.length
        if(numberOfProtocols != numberOfProtocolsWithData) {
            throw new Error('The number of worksheet protocols and protocol data objects to work with are not equivalent. Worksheet Protocols: ' + numberOfProtocols + ' || Protocol Data Objects: ' + numberOfProtocolsWithData)
        }

        if(transpose) {
            cy.get('[data-test=protocol-button--transpose]').click().then(() => {
                for(var i = 0; i < numberOfProtocols - 1; ++i) {
                    this.completeTransposedProtocol(this.worksheet.protocols[i], protocolData[i])
                    this.worksheet.save(true)
                }
                this.completeTransposedProtocol(this.worksheet.protocols[numberOfProtocols - 1], protocolData[numberOfProtocols - 1])
            })
        } else {
            for(var i = 0; i < numberOfProtocols - 1; ++i) {
                this.completeProtocol(this.worksheet.protocols[i], protocolData[i])
                this.worksheet.save(true)
            }
            this.completeProtocol(this.worksheet.protocols[numberOfProtocols - 1], protocolData[numberOfProtocols - 1])
        }
        this.worksheet.save()
    }

    /**
     * Fills out the protocol with the given protocol data.
     * 
     * @param {Protocol}    protocol A Protocol object.
     * @param {Object}      protocolData A JSON object with protocol headers and the data to apply to the associated cells.
     */
    completeProtocol(protocol, protocolData) {
        switch(protocol.type()) {
            case 'standard':
                this.fillCells(protocol.variables(), protocolData)
                break
            case 'pipeline':
                this.fillCells(protocol.variables(), protocolData)
                break
            case 'sample':
                this.fillCells(protocol.variables(), protocolData)
                break
            case 'cypress':
                this.fillCells(protocol.variables(), protocolData)
                break
            default:
                cy.log('Account for this new protocol type: ', protocol.type())
                break
        }
    }

    /**
     * Fills out the protocol with the given protocol data.
     * For transposed views.
     * 
     * @param {Protocol}    protocol A Protocol object.
     * @param {Object}      protocolData A JSON object with protocol headers and the data to apply to the associated cells.
     */
    completeTransposedProtocol(protocol, protocolData) {
        switch(protocol.type()) {
            case 'standard':
                this.fillTransposedCells(protocol.variables(), protocolData)
                break
            case 'pipeline':
                this.fillTransposedCells(protocol.variables(), protocolData)
                break
            case 'sample':
                this.fillTransposedCells(protocol.variables(), protocolData)
                break
            case 'cypress':
                this.fillTransposedCells(protocol.variables(), protocolData)
                break
            default:
                cy.log('Account for this new protocol type: ', protocol.type())
                break
        }
    }

    /**
     * Fills out the protocol cells for the given cell headers.
     * 
     * @param {Object} cellHeaders An object created from a Protocol object's variables() method.
     * @param {Object} protocolData A JSON object with protocol headers and the data to apply to the associated cells.
     */
    fillCells(cellHeaders, protocolData) {
        if(Cypress.config('domVirtualisation')) {
            this.setViewport()
            this.fillCellsImpl(cellHeaders, protocolData)
            this.selectComplete()
            this.resetViewport()
        } else {
            this.fillCellsImpl(cellHeaders, protocolData)
            this.selectComplete()
        }
    }

    /**
     * Fills out the protocol cells for the given cell headers.
     * For transposed views.
     * 
     * @param {Object} cellHeaders An object created from a Protocol object's variables() method.
     * @param {Object} protocolData A JSON object with protocol headers and the data to apply to the associated cells. 
     */
    fillTransposedCells(cellHeaders, protocolData) {
        if(Cypress.config('domVirtualisation')) {
            this.setViewport()
            this.fillTransposedCellsImpl(cellHeaders, protocolData)
            this.selectTransposedComplete()
            this.resetViewport()
        } else {
            this.fillTransposedCellsImpl(cellHeaders, protocolData)
            this.selectTransposedComplete()
        }
    }

    /**
     * Fills out the protocol cells for the given cell headers.
     * Parses the cell header information.
     * 
     * @param {Object} cellHeaders An object created from a Protocol object's variables() method.
     * @param {Object} protocolData A JSON object with protocol headers and the data to apply to the associated cells.
     */
    fillCellsImpl(cellHeaders, protocolData) {
        cellHeaders.forEach((element) => {
            let cell = new Cell(element)
            if( !(cell.properties().hasOwnProperty('visible')) || (cell.properties()['visible'] === true) ) {
                let data = protocolData[cell.header()]
                this.fillCell(cell, data)
            }
        })
    }

    /**
     * Fills out the protocol cells for the given cell headers.
     * Parses the cell header information.
     * For transposed views.
     * 
     * @param {Object} cellHeaders An object created from a Protocol object's variables() method.
     * @param {Object} protocolData A JSON object with protocol headers and the data to apply to the associated cells. 
     */
    fillTransposedCellsImpl(cellHeaders, protocolData) {
        cellHeaders.forEach((element) => {
            let cell = new Cell(element)
            // TODO: fix the dumb conditional
            if( !(cell.properties().hasOwnProperty('visible')) || (cell.properties()['visible'] === true) ) {
                let data = protocolData[cell.header()]
                this.fillTransposedCell(cell, data)
            }
        })
    }

    /**
     * Use Cypress' 'as' feature to get rid of this nesting hell
     */
    fillCell(cell, data) {
        cy.get('.ag-body-container').then((body) => {
            cy.contains('.ag-header-cell', cell.header()).then((header) => {
                cy.wrap(header).invoke('attr', 'col-id').then((columnId) => {
                    cy.get('.ag-body-container > .ag-row').then((row) => {
                        cy.wrap(row).each(() => {
                            cy.get('.ag-cell').then((agCell) => {
                                cy.wrap(agCell).each((_agCell) => {
                                    cy.wrap(_agCell).invoke('attr', 'col-id').then((value) => {
                                        if(value === columnId) {
                                            if(cell.properties().hasOwnProperty('required') && cell.properties()['required'] === true ) {
                                                if(cell.properties().hasOwnProperty('default')) {
                                                    if(cell.properties()['rule'] === 'string' || cell.properties()['rule'] === 'text') {
                                                        cy.wrap(_agCell).should('have.text', cell.properties()['default'].toString())
                                                    } else if(cell.properties()['rule'] === 'numeric') {
                                                        cy.wrap(_agCell).should('have.value', cell.properties()['default'])
                                                    } else if(cell.properties()['rule'] === 'dropdown') {
                                                        cy.wrap(_agCell).should((aCell) => {
                                                            expect(aCell).to.contain(cell.properties()['default'])
                                                        })
                                                    } else if(cell.properties()['rule'] === 'approval') {
                                                        this.approval(data)
                                                    }
                                                } else if(cell.properties()['rule'] === 'string') {
                                                    cy.wrap(_agCell).dblclick().find('input').type(data + '{enter}')
                                                } else if(cell.properties()['rule'] === 'numeric') {
                                                    cy.wrap(_agCell).dblclick().find('input').type(data + '{enter}')
                                                } else if(cell.properties()['rule'] === 'dropdown') {
                                                    cy.wrap(_agCell).click().then(() => { // .select(data)?? -- gotta find the select number for the data item
                                                        cy.get('.ag-popup-editor').within((editor) => {
                                                            cy.get('.ag-rich-select-row').contains(data).trigger('mousemove').then(() => {
                                                                cy.get('.ag-rich-select-row-selected').click()
                                                            })
                                                        })
                                                    })
                                                } else if(cell.properties()['rule'] === 'approval') {
                                                    this.worksheet.save()
                                                    this.approval(columnId, data)
                                                    cy.login(espUser.ADMIN)
                                                    this.worksheet.open()
                                                }
                                            }
                                            // skip cells that are not required
                                        }
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    /**
     * Use Cypress' 'as' feature to get rid of this nesting hell
     */
    fillTransposedCell(cell, data) {

        cy.get('#worksheet').find('.ag-pinned-left-cols-container').find('.ag-cell').contains(cell.header()).then((headerCell) => {
            cy.wrap(headerCell).parent().invoke('attr', 'row-index').as('headerRowIndex')
        })

        cy.get('@headerRowIndex').then((value) => {
            cy.get('#worksheet').find('.ag-center-cols-container > .ag-row').each((row) => {
                cy.wrap(row).invoke('attr', 'row-index').then((rowIndex) => {
                    if(rowIndex === value) {
                        cy.wrap(row).as('row')
                    }
                })
            })
        })
        
        cy.get('@row').find('.ag-cell').each((agCell) => {
            if(cell.properties().hasOwnProperty('required') && cell.properties()['required'] === true ) {
                if(cell.properties().hasOwnProperty('default')) {
                    this.verifyDefaultValue(agCell, cell, 'default')
                } else if(cell.properties().hasOwnProperty('value')) {
                    this.verifyDefaultValue(agCell, cell, 'value')
                } else {
                    this.inputCellData(agCell, cell, data)
                }
            }
        })
    }

    /**
     * Checks data from a Cell object against data in
     * an ag-grid cell. Dependent on variables from the YML
     * content configuration file.
     * 
     * @param {Object} agCell   A DOM object that represents an ag-grid cell.
     * @param {Object} cell     A Cell object that contains data to check against a visible cell in the DOM.
     * @param {String} value    The YML parameter value to query for, e.g. 'default' and 'value'.
     */
    verifyDefaultValue(agCell, cell, value) {
        if(cell.properties()['rule'] === 'string' || cell.properties()['rule'] === 'text') {
            cy.wrap(agCell).should('have.text', cell.properties()[value].toString())
        } else if(cell.properties()['rule'] === 'numeric') {
            cy.wrap(agCell).should('have.value', cell.properties()[value])
        } else if(cell.properties()['rule'] === 'dropdown') {
            cy.wrap(agCell).should((aCell) => {
                expect(aCell).to.contain(cell.properties()[value])
            })
        } else if(cell.properties()['rule'] === 'date') {
            let dateText = Date.mmddyyyy(cell.properties()[value])
            cy.wrap(agCell).should('have.text', dateText)
        } else if(cell.properties()['rule'] === 'approval') {
            //this.approval(data)
            cy.log('Implement a default approval??')
        }
    }

    /**
     * Inputs data from a Cell object into an ag-grid cell. 
     * Dependent on variables from the YML content configuration file.
     * 
     * @param {Object} agCell   A DOM object that represents an ag-grid cell.
     * @param {Object} cell     A Cell object that contains data to check against a visible cell in the DOM.
     * @param {Object} data     Contains custom data for input. Either a string or numeric.
     */
    inputCellData(agCell, cell, data) {
        if(cell.properties()['rule'] === 'string' || cell.properties()['rule'] === 'text') {
            cy.wrap(agCell).dblclick().find('input').type(data + '{enter}')
        } else if(cell.properties()['rule'] === 'numeric') {
            cy.wrap(agCell).dblclick().find('input').type(data + '{enter}')
        } else if(cell.properties()['rule'] === 'dropdown') {
            cy.wrap(agCell).dblclick().then(() => { // .select(data)?? -- gotta find the select number for the data item
                cy.get('.ag-popup-editor').within((editor) => {
                    cy.get('.ag-rich-select-row').contains(data).trigger('mousemove').then(() => {
                        cy.get('.ag-rich-select-row-selected').click()
                    })
                })
            })
        } else if(cell.properties()['rule'] === 'date') {
            // TODO: robust datepicker solution -- currently this
            // method is an easy way to populate a date
            cy.wrap(agCell).dblclick().type('{enter}')
        } else if(cell.properties()['rule'] === 'approval') {
            this.worksheet.save()
            cy.get('@headerRowIndex').then((value) => {
                this.transposedApproval(value, data)
            })
            cy.login(espUser.ADMIN)
            this.worksheet.open()
            //cy.get('[data-test=protocol-button--transpose]').click()
            cy.get('.ag-center-cols-container').should('be.visible')
        }
    }

    /**
     * Fills out the approval information for a protocol's Approval button.
     * 
     * @param {String} columnId The column ID where the approval button is located.
     * @param {Object} data Contains email and password properties that are strings.
     */
    approval(columnId, data) {
        cy.loginUI(data['email'], data['password']).then(() => {
            this.worksheet.open()
            this.setViewport()
        })
        cy.get('.ag-cell').each((cell) => {
            cy.wrap(cell).invoke('attr', 'col-id').then((value) => {
                if(value === columnId) {
                    cy.wrap(cell).within(() => {
                        cy.get('button').dblclick()
                    })
                }
            })
        })
        cy.get('.approval-editor').within((editor) => {
            cy.contains('.form-field', 'Username').within(() => {
                cy.get('input').type(data['email'])
            })
            cy.contains('.form-field', 'Password').within(() => {
                cy.get('input').type(data['password'])
            })
            cy.contains('button', 'Submit').click().then(() => {
                cy.wrap(editor).should('not.be.visible')
            })
        })
        cy.get('.ag-cell').each((cell) => {
            cy.wrap(cell).invoke('attr', 'col-id').then((value) => {
                if(value === columnId) {
                    cy.wrap(cell).should('have.text', 'Approved')
                }
            })
        })
    }

    /**
     * Fills out the approval information for a protocol's Approval button.
     * For transposed views.
     * 
     * @param {String} rowIndex The row index where the approval button is located.
     * @param {Object} data Contains email and password properties that are strings.
     */
    transposedApproval(rowIndex, data) {
        cy.loginUI(data['email'], data['password']).then(() => {
            this.worksheet.open()
        })
        // .then(() => {
        //     cy.get('[data-test=protocol-button--transpose]').click()
        //     this.setViewport()
        // })
        cy.get('#worksheet').should('be.visible')
        cy.get('.ag-center-cols-container > .ag-row').each((row) => {
            cy.wrap(row).find('.ag-cell').then((cell) => {
                cy.wrap(cell).parent().invoke('attr', 'row-index').then((value) => {
                    if(value === rowIndex) {
                        cy.wrap(cell).within(() => {
                            cy.get('button').dblclick()
                        })
                    }
                })
            })
        })
        cy.get('.approval-editor').within((editor) => {
            cy.contains('.form-field', 'Username').within(() => {
                cy.get('input').type(data['email'])
            })
            cy.contains('.form-field', 'Password').within(() => {
                cy.get('input').type(data['password'])
            })
            cy.contains('button', 'Submit').click().then(() => {
                cy.wrap(editor).should('not.be.visible')
            })
        })
        cy.get('.ag-center-cols-container > .ag-row').each((row) => {
            cy.wrap(row).find('.ag-cell').then((cell) => {
                cy.wrap(cell).parent().invoke('attr', 'row-index').then((value) => {
                    if(value === rowIndex) {
                        cy.wrap(cell).should('have.text', 'Approved')
                    }
                })
            })
        })
    }

    /**
     * Finds the Complete checkbox to complete the row.
     */
    selectComplete() {
        cy.get('#worksheet').within(() => {
            cy.contains('.ag-header-cell', 'Complete').then((header) => {
                cy.wrap(header).invoke('attr', 'col-id').then((columnId) => {
                    cy.get('.ag-cell').each((agCell) => {
                        cy.wrap(agCell).invoke('attr', 'col-id').then((value) => {
                            if(value === columnId) {
                                cy.wrap(agCell).within(() => { cy.get('input').check() })
                            }
                        })
                    })
                })
            })
        })
    }

    /**
     * Finds the Complete checkbox to complete the column.
     * For transposed view.
     */
    selectTransposedComplete() {
        cy.get('#worksheet').find('.ag-pinned-left-cols-container').find('.ag-cell').contains('Complete').then((agCell) => {
            cy.wrap(agCell).parent().invoke('attr', 'row-index').as('completeRowHeaderIndex')
        })
        cy.get('@completeRowHeaderIndex').then((completeRowHeaderIndex) => {
            cy.get('#worksheet').find('.ag-center-cols-container > .ag-row').each((row) => {
                cy.wrap(row).invoke('attr', 'row-index').then((value) => {
                    if(value === completeRowHeaderIndex) {
                        cy.wrap(row).as('completeRow')
                    }
                })
            })
        })
        cy.get('@completeRow').find('.ag-cell').each((agCell) => {
            cy.wrap(agCell).within(() => {
                cy.get('input').check()
            })
        })
    }

    /**
     * Sets a new viewport width and height to accommodate a protocol's content size.
     * If the content in the grid exceeds Cypress' maximum values, an error is thrown.
     */
    setViewport() {
        cy.get('.navbar').then((navbar) => {
            cy.get('.body-content').within((body) => {
                cy.get('.ag-root-wrapper').then((wrapper) => {
                    cy.get('.ag-center-cols-container').then((center) => {
                        cy.get('.ag-side-buttons').then((sideButtons) => {
                            cy.get('.ag-pinned-left-cols-container').then((pinned) => {
                                let centerWidth = center.width() + sideButtons.width()
                                let pinnedWidth = pinned.width()
                                let rightSpace = navbar.width() - body.width()
                                let paddedSpace = body.width() - wrapper.width()
                                cy.get('.ag-center-cols-container').trigger('mouseover', 'left').then((container) => {
                                    let newViewportWidth = container.width() + centerWidth + pinnedWidth + paddedSpace + rightSpace
                                    if( newViewportWidth > Cypress.config('viewportMaxValue') ) {
                                        throw new Error('The worksheet width is too long to fully display with a Cypress viewport expansion.')
                                    } else if(newViewportWidth > Cypress.config('viewportWidth')) {
                                        cy.viewport(newViewportWidth, Cypress.config('viewportHeight'))
                                        cy.wrap(container).trigger('mouseover')
                                    }
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    /**
     * Set the Cypress viewport to the default width and height that is present in the cypress.json file.
     */
    resetViewport() {
        cy.viewport(Cypress.config('viewportWidth'), Cypress.config('viewportHeight'))
    }
}