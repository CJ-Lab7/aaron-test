
export default class Protocol {
    /**
     * Summary: .
     * 
     * Description: .
     * 
     * @param {Object} protocol A protocol object from a parsed YML file.
     */
    constructor(protocol) {
        this.protocol = protocol
    }

    // NOTE: For the following methods...
    // There should only be one object in a protocol, thus
    // we can use the parent object key. If we start having
    // multiple objects per "protocol", this will need to be
    // redefined.

    /**
     * Returns a string of the Protocol name.
     */
    name() {
        return Object.getOwnPropertyNames(this.protocol)[0]
    }

    /**
     * Returns a string of the Protocol description.
     */
    description() {
        return this.protocol[Object.keys(this.protocol)[0]].desc
    }

    /**
     * Returns a string of the Protocol type.
     */
    type() {
        return this.protocol[Object.keys(this.protocol)[0]].protocol
    }

    /**
     * Returns an array of the Protocol column objects.
     */
    variables() {
        return this.protocol[Object.keys(this.protocol)[0]].variables
    }
}