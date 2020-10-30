/**
   * Upload a file to an input element
   * https://github.com/cypress-io/cypress/issues/170
   *
   * @param {String} fileName - Path to file.  pwd = app_cypress_tests/
   * @param {String} selector Selector that identifies a single target upon which to add a file
   * @param {String} fileType - MIME type (ex: text/text)
  */
 export function uploadFile(fileName, selector, fileType) {
    // add file to input
    if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cy.fixture(fileName, 'binary')
                .then(Cypress.Blob.binaryStringToBlob)
                .then(fileContent => {
                        cy.get('input[type=file]').attachFile({
                            fileContent,
                            fileName: fileName,
                            mimeType: fileType,
                            encoding: 'utf8'
                        })
                    })
    } else {
        cy.fixture(fileName)
            .then(fileContent => {
                cy.get(selector)
                    .attachFile({fileContent, fileName, mimeType: fileType})
            })
    }
}

/**
   * Add a file to the data app.  Must be at /#/data/list
   *
   * @param {String} fileName - name for file
   * @param {String} fileType - MIME type (ex: text/text)
   * @param {String} description - file description
   * @param {List} tags - file tags
  */
export function addData(fileName, fileType = ' ', description = ' ', tags = []) {
    cy.contains('button', 'Upload Files').click()
    uploadFile(fileName, 'input[type="file"]', fileType)
    cy.contains('.modal-container', 'File Selected')
    cy.get('.modal-container').find('.input').type(description)
    for (let i = 0; i < tags.length; i++) {
        cy.get('.modal-container').find('[data-test="renderless-tag-input__tag-input-text"]').type(tags[i] + '{enter}')
    }
    cy.get('.modal-container').contains('button', 'Upload').click()
    cy.get('.modal-container').should('not.be.visible')
}
