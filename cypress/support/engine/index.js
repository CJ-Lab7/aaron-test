'use strict';

/**
 * Models for interacting with LIMs application.
 */


// imports
// -------
import * as ag from "../ag_enum";
const path = require('path');


// views
// -----
/**
 * Data structure with closure functions for common functionality.
 */
class View {

  /**
   * Proxy for reloading page.
   */
  reload() {
    cy.reload();
  }

}


/**
 * Methods for cypress interaction on LIMS landing page.
 */
class LimsView extends View {

  /**
   * Visit lims page and wait for load
   */
  visit() {
    cy.visit('/#/lims');
    cy.contains(ag.HEADER_ELEMENT.CELL, 'Worksheet', { timeout: 20000 });
    return this;
  }

  /**
   * Select for list/card view.
   *
   * @param type {string} - The type of view (list/card)
   */
  view(type) {
    // CLICK TO TOGGLE LIST VIEW OR CARD VIEW
    throw 'Not Implemented!';
    return this;
  }

  /**
   * Experiment grouping toggle.
   *
   * @param type {string} - The type of grouping (...)
   */
  grouping(type) {
    // CLICK TO OPEN DROPDOWN
    // CLICK TYPE SELECTION
    throw 'Not Implemented!';
    return this;
  }

  /**
   * Click through to sample sheet
   *
   * @param name {string} - Name of sample sheet.
   */
  open(name) {
    cy.contains(ag.BODY_ELEMENT.ROW, name).find('a').click();
    cy.contains(ag.SECTION.ROOT, 'Complete', { timeout: 20000 });
    return new WorksheetView();
  }

  /**
   * Select sample sheet in view.
   *
   * @param name {string} - Name of sample sheet.
   */
  select(name) {
    // DETERMINE VIEW TO SELECT CARD OR ROW
    // CLICK ELEMENT TO SELECT
    throw 'Not Implemented!';
    return this;
  }

}

/**
 * Methods for cypress interaction on worksheets.
 */
class WorksheetView extends View {

  /**
   * Return WorksheetCell object for specified row and column.
   *
   * @param row {string} - Sample name for row.
   * @param col {string} - Column name.
   */
  cell(row, col) {
     return new WorksheetCell(row, col);
  }

  /**
   * Complete sheet or specific row in sheet.
   *
   * @param row {string} - Sample name for row (default = '*').
   */
  complete(row = '*') {
    // entire column
    if (row === '*') {
      cy.get(`${ag.HEADER_ELEMENT.CELL}[col-id="complete"] input[type="checkbox"]`).last().click();

    // single row
    } else {
        throw 'Not Implemented!';
    }
    return this;

  }

  /**
   * Save worksheet.
   */
  save() {
    cy.get('button').contains('Save').click();
    cy.get('div').contains('Worksheet Saved Successfully');
    return this;
  }

 }


 // components
 // ----------
/**
 * Methods for cypress interaction on worksheet cell.
 *
 * @param row {string} - Name of sample in row.
 * @param col {string} - Column name for cell.
 */
class WorksheetCell {

  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.cell = null;
    this.refresh();
    return this;
  }

  /**
   * Refresh inner cell property using initial selectors.
   */
  refresh() {

    // fetch row by sample name
    this.cell = cy.get(`${ag.BODY_ELEMENT.CELL}[col-id="name"] a`)
      .contains(this.row).then(element => {
        const ridx = element.closest(ag.BODY_ELEMENT.ROW)[0].getAttribute('row-id');

        // get column index
        return cy.get(`${ag.HEADER_ELEMENT.CELL}`)
          .contains(this.col).then(element => {
            const cidx = element.closest(ag.HEADER_ELEMENT.CELL)[0].getAttribute('col-id');

            // get cell
            return cy.get(`${ag.BODY_ELEMENT.ROW}[row-id="${ridx}"] ${ag.BODY_ELEMENT.CELL}[col-id="${cidx}"]`);
        });
      });

    return this;
  }

  /**
   * Get within cell.
   */
  get() {
    return this.cell.get();
  }

  /**
   * Get within cell.
   */
  contains(text) {
    return this.cell.contains(text);
  }

  /**
   * Doubleclick cell.
   */
  dblclick() {
    return this.cell.dblclick();
  }

  /**
   * Click cell.
   */
  click() {
    return this.cell.click();
  }

  /**
   * Close opened cell modal
   */
  close() {
    cy.get('i.close').contains('close').click();
    cy.get('i.close').should('not.be.visible');
    return this;
  }

  /**
   * Fill text in cell after doubleclick.
   */
  fill(text) {
    this.cell.dblclick().type(text + '{enter}');
    this.cell.contains(text);
    return this;
  }

  /**
   * Fill date column with today's date.
   */
  today(alias) {
    this.cell.dblclick();
    cy.get('.vdp-datepicker span.today').click();
    cy.get('.vdp-datepicker').should('not.be.visible');
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');
    this.refresh();
    this.cell.contains(today);
    return this;
  }

  /**
   * Click checkbox.
   */
  check() {
    this.cell.within(() => {
      cy.get('input[type="checkbox"]').first().click().should('be.checked');
    });
    return this;
  }

  /**
   * Select options from dropdown or multiselect
   *
   * @param item {string, array} - Single item to select or list of
   *  items to multiselect.
   */
  select(item) {
    if (typeof item === 'string') {
      item = [item];
    }
    this.cell.dblclick().then(() => {
      item.map((element) => {
        cy.get('.multiselect__element').contains(element).click();
      });
    });
    cy.get('nav').click();
    cy.get('.ag-popup-editor').should('not.be.visible');
    this.refresh();
    this.cell.contains(item.join(', '));
    return this;
  }

  /**
   * Upload file to attachment column.
   *
   * @param filename {string} - Filename to upload.
   */
  upload(filename) {
    const basename = path.basename(filename);
    this.cell.dblclick().then(() => {
      cy.fixture(filename).then(content => {
        cy.get('input[type="file"]').attachFile({
          fileContent: content,
          fileName: filename,
          mimetype: 'text/plain',
        });
      });
    });
    cy.get(`div[title="${basename}"]`).should('be.visible');
    cy.get(`div[title="${basename}"]`).contains(basename);
    return this;
  }

  /**
   * Fill location column by selecting sample and well.
   *
   * @param target {string} - Target to locate in container.
   * @param container {string} - Container to locate target into.
   * @param cell {string} - Cell to locate target into.
   *
   * TODO: GET DEV TEAM TO PUT ACTUAL RENDERED WELL NAMES INTO CELLS IN THE
   *       LOCATION RENDERERS - WOULD MAKE IT EASIER TO SELECT CELLS.
   */
  locate(target, container, cell) {
    let id = 1;

    // parse letter number in well
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].map((letter, idx) => {
      if (cell.indexOf(letter) > -1) {
        id = id * idx;
      }
    });

    // parse numeric well input
    ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'].map((letter, idx) => {
      if (cell.indexOf(letter) > -1) {
        id = id * idx;
      }
    });

    // locate item in container
    this.cell.dblclick().then(() => {
      cy.get('.modal-container .multiselect__tags').click();
      cy.get('.modal-container .multiselect__element').contains(container).click();
      cy.get('.grid-table tr td .cell').eq(id).rightclick();
      cy.get('.container-editor input[type="text"]').click();
      cy.get('.container-editor ul li').contains(target).click();
      cy.get('button[data-test="popup__experiment-samples--submit"]').click();
      cy.get('.container-editor').should('not.be.visible');
    });
    this.refresh();
    this.cell.contains(`${container}: ${cell}`);
    return this;
  }

  /**
   * Update barcode column with text.
   *
   * @param text {string} - Text for barcode.
   */
  barcode(text) {
    this.cell.dblclick();
    cy.get('.barcode-value-editor input').focus().type(text);
    cy.get('nav').click();
    cy.get('.barcode-value-editor').should('not.be.visible');
    this.refresh();
    this.cell.contains(text);
    return this;
  }

  /**
   * Update resource link using modal.
   *
   * @param item {string} - Item/entity to link with modal.
   */
  link(item) {
    this.cell.dblclick();
    cy.get('.resource-link-wrapper input[data-test="entities-filter-name"]').focus().type(item);
    cy.get('.resource-link-wrapper button.search-button').click().then(() => {
      cy.wait(1000);
      cy.get(`.resource-link-wrapper ${ag.BODY_ELEMENT.CELL}`).contains(item).click();
      cy.get('.resource-link-wrapper button').contains('Submit').click();
    });
    cy.get('.resource-link-wrapper').should('not.be.visible');
    this.refresh();
    this.cell.contains(item);
    return this;
  }

  /**
   * Adjust item quantity using editor.
   *
   * @param target {string} - Target to adjust quantity of.
   * @param amount {string} - Amount of item to adjust up or down.
   */
  adjust(target, amount) {
    this.cell.dblclick();
    cy.get('.modal-container form.item-qty-adj select').select(target);
    cy.get('.modal-container input[type="number"]').clear().focus().type(parseInt(amount).toString());
    cy.get('.modal-container button').contains('Save').click();
    cy.get('.modal-container').should('not.be.visible');
    this.refresh();
    this.cell.contains(amount.toString());
    return this;
  }

  /**
   * Complete approval column with username and password.
   *
   * @param username {string} - Username for approval column.
   * @param password {string} - Password for approval column.
   */
  approve(username, password) {
    this.cell.dblclick().then(() => {
      cy.get('.approval-editor').within(($modal) => {
        if($modal.text().includes('Retry')) {
          cy.get('button').contains('Retry').click();
        }
        cy.get('input[name="username"]').type(username);
        cy.get('input[name="password"]').type(password);
        cy.get('button').contains('Submit').click();
      }).then((cell) => {
        cy.get('.approval-editor').should('not.be.visible');
      });
    });
    this.refresh();
    this.cell.contains('Approved');
    return this;
  }

}


/**
 * Methods for cypress interaction on entireworksheet column.
 *
 * @param col {string} - Column name for cell.
 */
class WorksheetColumn {
  constructor(col) {

    this.cells = [];

    // THINK THROUGH BELOW - WANT TO ITERATE THROUGH ALL
    // CELLS AND CALL WORKSHEETCELL OPERATIONS, BUT NEED
    // TO ACCOUNT FOR ACTION CHAINS.

    // return new Proxy(this, {
    //   get(target, name) {
    //     if (name in target) {
    //       return target[name];
    //     } else {
    //       return (...) => {
    //         this.cells.map(cell => {
    //           cell[name](...);
    //         });
    //       }
    //       // get all sample names
    //     }
    //   }
    // });
  }
}



// helpers
// -------
/**
 * Core closure for navigating to application pages.
 */
function navigate(view) {

  if (view.toUpperCase() === 'LIMS') {
    const lims = new LimsView();
    return lims.visit();
  }

}


// exports
// -------
export default {
  navigate,
};
