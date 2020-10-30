export function getResponseByName(apiEndpoint, name) {
    cy.request('GET', apiEndpoint + `?name=${name}`, 
            {
                "Accept": "application/json"
            })
        .as('response')
    return cy.get('@response')
}

export function getSampleChildren(name) {
    let uuid
    getResponseByName('/api/samples', name)
        .then(response => {
            uuid = response.body[0].uuid
            cy.request('GET', 'api/samples/' + uuid + '/children', 
                    {
                        "Accept": "application/json"
                    })
                .as('response')
        })
    return cy.get('@response')
}

export function changeBarcode(apiEndpoint, objectName, barcode) {
    getResponseByName(apiEndpoint, objectName).then(response => {
        let uuid = response.body[0].uuid
        cy.request({
            method: 'PUT',
            url: apiEndpoint + `/${uuid}`, 
            headers: {
                "Accept": "application/json"
                },
            body: {
                    "barcode": barcode
                }
            }).as('response')
        cy.get('@response').should((response) => {
            expect(response.status).to.eq(200)
        })
    })
}

export function createSample(sampleType, sampleName) {
    getResponseByName('/api/sample_types', sampleType).then(response => {
        let uuid = response.body[0].sample_type_id
        cy.request({
            method: 'POST',
            url: '/api/samples', 
            headers: {
                "Accept": "application/json"
                },
            body: {
                    "sample_type_uuid": uuid,
                    "name": sampleName
                    // "autogen_names": "false",
                    // "lab7_id_sequence": sampleName
                }
            }).as('response')
        cy.get('@response').should((response) => {
            expect(response.status).to.eq(200)
        })
    })
}

export function postExpression(expression, context = {}) {
    cy.request({
        method: 'POST',
        url: '/api/expressions/eval', 
        headers: {
            "Accept": "application/json"
            },
        body: {
                "expression": expression,
                "context": context
            }
        }).as('response')
    return cy.get('@response')
}

export function updateUserRole(userName, role) {
    getResponseByName('/api/users', userName)
        .then($user => {
            let userUuid = $user.body[0].uuid
            getResponseByName('/api/roles', role)
                .then($role => {
                    console.log($role.body[0])
                    let roleUuid = $role.body[0].uuid
                    cy.request({
                        method: 'PUT',
                        url: `/api/users/${userUuid}`, 
                        headers: {
                            "Accept": "application/json"
                            },
                        body: {
                                "roles": [$role.body[0]]
                            }
                        }).as('response')
                    cy.get('@response').should((response) => {
                        expect(response.status).to.eq(200)
                    })
                })
        })
}