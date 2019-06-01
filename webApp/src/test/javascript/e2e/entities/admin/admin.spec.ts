/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { AdminComponentsPage, AdminDeleteDialog, AdminUpdatePage } from './admin.page-object';

const expect = chai.expect;

describe('Admin e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let adminUpdatePage: AdminUpdatePage;
  let adminComponentsPage: AdminComponentsPage;
  let adminDeleteDialog: AdminDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Admins', async () => {
    await navBarPage.goToEntity('admin');
    adminComponentsPage = new AdminComponentsPage();
    await browser.wait(ec.visibilityOf(adminComponentsPage.title), 5000);
    expect(await adminComponentsPage.getTitle()).to.eq('Admins');
  });

  it('should load create Admin page', async () => {
    await adminComponentsPage.clickOnCreateButton();
    adminUpdatePage = new AdminUpdatePage();
    expect(await adminUpdatePage.getPageTitle()).to.eq('Create or edit a Admin');
    await adminUpdatePage.cancel();
  });

  it('should create and save Admins', async () => {
    const nbButtonsBeforeCreate = await adminComponentsPage.countDeleteButtons();

    await adminComponentsPage.clickOnCreateButton();
    await promise.all([
      adminUpdatePage.setFirstNameInput('firstName'),
      adminUpdatePage.setLastNameInput('lastName'),
      adminUpdatePage.setEmailInput('email'),
      adminUpdatePage.userSelectLastOption()
    ]);
    expect(await adminUpdatePage.getFirstNameInput()).to.eq('firstName', 'Expected FirstName value to be equals to firstName');
    expect(await adminUpdatePage.getLastNameInput()).to.eq('lastName', 'Expected LastName value to be equals to lastName');
    expect(await adminUpdatePage.getEmailInput()).to.eq('email', 'Expected Email value to be equals to email');
    await adminUpdatePage.save();
    expect(await adminUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await adminComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Admin', async () => {
    const nbButtonsBeforeDelete = await adminComponentsPage.countDeleteButtons();
    await adminComponentsPage.clickOnLastDeleteButton();

    adminDeleteDialog = new AdminDeleteDialog();
    expect(await adminDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Admin?');
    await adminDeleteDialog.clickOnConfirmButton();

    expect(await adminComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
