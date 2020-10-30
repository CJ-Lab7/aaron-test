
import YAML from 'yamljs'
import Protocol from '../../support/lib/protocol'

export default class WorksheetYmlParser {
    /**
     * Summary: Designed to parse an ESP Worksheet YML file data.
     * 
     * Description: The class methods make assumptions about the YML object.
     * ESP YML Worksheets have a certain format and this helper uses that information
     * to get the relevant information for the method calls.
     * 
     * @param {Object} fileData Takes in an object generated from cy.readFile() on a .YML file.
     */
    constructor(fileData) {
        this.yml = YAML.parse(fileData)
    }

    /**
     * Returns a string of the Worksheet YML object name.
     * Assumes there is only one parent object in the YML file.
     */
    worksheetName() {
        return Object.getOwnPropertyNames(this.yml)[0]
    }

    /**
     * Returns an array of Protocols from the Worksheet YML object.
     * Assumes there is only one parent object in the YML file.
     * Also assumes that the YML protocol objects are already in an array format.
     */
    protocols() {
        let protocolArray = []
        let protocolObjects = this.yml[Object.keys(this.yml)[0]].protocols
        protocolObjects.forEach((element) => {
            protocolArray.push(new Protocol(element))
        })
        return protocolArray
    }

    /**
     * Takes in an object generated from cy.readFile() on a .YML file.
     * Returns a Protocol object created from the YML data.
     * 
     * @param {Object} fileData 
     */
    static parseProtocolYml(fileData) {
        let ymlParseData = YAML.parse(fileData)
        if(ymlParseData[Object.keys(ymlParseData)[0]].protocol === undefined) {
            ymlParseData[Object.keys(ymlParseData)[0]].protocol = 'cypress'
        }
        return new Protocol(ymlParseData)
    }
}