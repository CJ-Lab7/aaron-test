
export default class Cell {
    constructor(cell) {
        this.cell = cell
    }

    header() {
        return Object.getOwnPropertyNames(this.cell)[0]
    }

    properties() {
        return this.cell[Object.keys(this.cell)[0]]
    }
}