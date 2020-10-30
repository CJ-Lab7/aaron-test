
export default class Hash {
    
    /** 
     * Returns a 7-digit hex hash.
     */
    static hex() {
        return this.hash(16)
    }
    
    /**
     * Returns a 7-digit alphanumeric hash.
     */
    static alphanumeric() {
        return this.hash(36)
    }

    /**
     * A simple 7-digit hash generator.
     * 
     * @param {Int} value An integer value between 2 and 36 that represents the radix,
     * i.e. the base for numeric values.
     */
    static hash(value) {
        return 'xxxxxxx'.replace(/[x]/g, function(c) {
            var r = Math.random() * value | 0
            return r.toString(value);
        });
    }
}