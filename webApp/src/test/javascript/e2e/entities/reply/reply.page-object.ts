import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class ReplyComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-reply div table .btn-danger'));
  title = element.all(by.css('jhi-reply div h2#page-heading span')).first();

  async clickOnCreateButton(timeout?: number) {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(timeout?: number) {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons() {
    return this.deleteButtons.count();
  }

  async getTitle() {
    return this.title.getText();
  }
}

export class ReplyUpdatePage {
  pageTitle = element(by.id('jhi-reply-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  dateInput = element(by.id('field_date'));
  responseInfoInput = element(by.id('field_responseInfo'));
  tenderSelect = element(by.id('field_tender'));
  supplierSelect = element(by.id('field_supplier'));

  async getPageTitle() {
    return this.pageTitle.getText();
  }

  async setDateInput(date) {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput() {
    return await this.dateInput.getAttribute('value');
  }

  async setResponseInfoInput(responseInfo) {
    await this.responseInfoInput.sendKeys(responseInfo);
  }

  async getResponseInfoInput() {
    return await this.responseInfoInput.getAttribute('value');
  }

  async tenderSelectLastOption(timeout?: number) {
    await this.tenderSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async tenderSelectOption(option) {
    await this.tenderSelect.sendKeys(option);
  }

  getTenderSelect(): ElementFinder {
    return this.tenderSelect;
  }

  async getTenderSelectedOption() {
    return await this.tenderSelect.element(by.css('option:checked')).getText();
  }

  async supplierSelectLastOption(timeout?: number) {
    await this.supplierSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async supplierSelectOption(option) {
    await this.supplierSelect.sendKeys(option);
  }

  getSupplierSelect(): ElementFinder {
    return this.supplierSelect;
  }

  async getSupplierSelectedOption() {
    return await this.supplierSelect.element(by.css('option:checked')).getText();
  }

  async save(timeout?: number) {
    await this.saveButton.click();
  }

  async cancel(timeout?: number) {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class ReplyDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-reply-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-reply'));

  async getDialogTitle() {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
