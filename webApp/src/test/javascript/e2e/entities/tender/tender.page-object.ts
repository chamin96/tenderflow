import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class TenderComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-tender div table .btn-danger'));
  title = element.all(by.css('jhi-tender div h2#page-heading span')).first();

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

export class TenderUpdatePage {
  pageTitle = element(by.id('jhi-tender-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  titleInput = element(by.id('field_title'));
  descriptionInput = element(by.id('field_description'));
  infoInput = element(by.id('file_info'));
  adminSelect = element(by.id('field_admin'));

  async getPageTitle() {
    return this.pageTitle.getText();
  }

  async setTitleInput(title) {
    await this.titleInput.sendKeys(title);
  }

  async getTitleInput() {
    return await this.titleInput.getAttribute('value');
  }

  async setDescriptionInput(description) {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput() {
    return await this.descriptionInput.getAttribute('value');
  }

  async setInfoInput(info) {
    await this.infoInput.sendKeys(info);
  }

  async getInfoInput() {
    return await this.infoInput.getAttribute('value');
  }

  async adminSelectLastOption(timeout?: number) {
    await this.adminSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async adminSelectOption(option) {
    await this.adminSelect.sendKeys(option);
  }

  getAdminSelect(): ElementFinder {
    return this.adminSelect;
  }

  async getAdminSelectedOption() {
    return await this.adminSelect.element(by.css('option:checked')).getText();
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

export class TenderDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-tender-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-tender'));

  async getDialogTitle() {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
