// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
// let COMMON_STATE_LOADED = 

// Don't clear login cookie after each test
Cypress.Cookies.defaults({
    preserve: 'lab7user'
  })

// before(() => {
    // remove fetch from the window, use XHR instead
    // let polyfill
    // const polyfillUrl = 'https://unpkg.com/unfetch/dist/unfetch.umd.js'
    // cy.request(polyfillUrl)
    // .then((response) => {
    // polyfill = response.body
    // })

//   // import common data to ESP
//     cy.seed('common/indexseed')
//     COMMON_STATE_LOADED=true
//     cy.log(COMMON_STATE_LOADED)
// })

// Cypress.on('window:before:load', win => {
//     delete win.fetch
//     win.eval(polyfill)
//     win.fetch = win.unfetch
// })

// Code taken from https://github.com/4teamwork/cypress-drag-drop
// Example: cy.get('.sourceitem').drag('.targetitem');
const DragSimulator = {
    MAX_TRIES: 5,
    DELAY_INTERVAL_MS: 10,
    counter: 0,
    rectsEqual(r1, r2) {
        return r1.top === r2.top
            && r1.right === r2.right
            && r1.bottom === r2.bottom
            && r1.left === r2.left;
    },
    get dropped() {
        const currentSourcePosition = this.source.getBoundingClientRect();
        return !this.rectsEqual(this.initialSourcePosition, currentSourcePosition);
    },
    get hasTriesLeft() { return this.counter < this.MAX_TRIES; },
    dragstart() {
        cy
            .wrap(this.source)
            .trigger('mousedown', { which: 1, button: 0 })
            .trigger('dragstart');
    },
    drop() {
        return cy
            .wrap(this.target)
            .trigger('drop', { force: true })
            .trigger('mouseup', { which: 1, button: 0 });
    },
    dragover() {
        if (!this.dropped && this.hasTriesLeft) {
            this.counter = this.counter + 1
            return cy
                .wrap(this.target)
                .trigger('dragover', this.position)
                .wait(this.DELAY_INTERVAL_MS)
                .then(() => this.dragover());
        }
        if (!this.dropped) {
            return this.drop().then(() => {
                throw new Error(`Exeeded maximum tries of: ${this.MAX_TRIES}, aborting`);
            });
        }
        return this.drop();
    },
    init(source, target, position) {
        this.source = source;
        this.target = target;
        this.position = position;

        this.dragstart();

        return cy.wait(this.DELAY_INTERVAL_MS).then(() => {
            this.initialSourcePosition = this.source.getBoundingClientRect();
            return this.dragover();
        });
    },
    simulate(sourceWrapper, targetSelector, position = 'top') {
        return cy.get(targetSelector)
            .then(targetWrapper => this.init(sourceWrapper.get(0), targetWrapper.get(0), position));
    },
};

/**
   * Drop an element onto another element
   * Drag and drop 
   * https://github.com/4teamwork/cypress-drag-drop
   *
   * @param {HTML Element - Cypress chain} prevSubject - element to start dragging from; yielded from Cypress chain
   * @param {CSS Selector} args - Selector for drop target
  */
 Cypress.Commands.add('drag', { prevSubject: 'element', }, (...args) => DragSimulator.simulate(...args))
