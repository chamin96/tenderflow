/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { TenderComponentsPage, TenderDeleteDialog, TenderUpdatePage } from './tender.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('Tender e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let tenderUpdatePage: TenderUpdatePage;
  let tenderComponentsPage: TenderComponentsPage;
  let tenderDeleteDialog: TenderDeleteDialog;
  const fileNameToUpload = 'logo-jhipster.png';
  const fileToUpload = '../../../../../../src/main/webapp/content/images/' + fileNameToUpload;
  const absolutePath = path.resolve(__dirname, fileToUpload);

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Tenders', async () => {
    await navBarPage.goToEntity('tender');
    tenderComponentsPage = new TenderComponentsPage();
    await browser.wait(ec.visibilityOf(tenderComponentsPage.title), 5000);
    expect(await tenderComponentsPage.getTitle()).to.eq('Tenders');
  });

  it('should load create Tender page', async () => {
    await tenderComponentsPage.clickOnCreateButton();
    tenderUpdatePage = new TenderUpdatePage();
    expect(await tenderUpdatePage.getPageTitle()).to.eq('Create or edit a Tender');
    await tenderUpdatePage.cancel();
  });

  it('should create and save Tenders', async () => {
    const nbButtonsBeforeCreate = await tenderComponentsPage.countDeleteButtons();

    await tenderComponentsPage.clickOnCreateButton();
    await promise.all([
      tenderUpdatePage.setTitleInput('title'),
      tenderUpdatePage.setDescriptionInput('description'),
      tenderUpdatePage.setInfoInput(absolutePath),
      tenderUpdatePage.adminSelectLastOption()
    ]);
    expect(await tenderUpdatePage.getTitleInput()).to.eq('title', 'Expected Title value to be equals to title');
    expect(await tenderUpdatePage.getDescriptionInput()).to.eq('description', 'Expected Description value to be equals to description');
    expect(await tenderUpdatePage.getInfoInput()).to.endsWith(fileNameToUpload, 'Expected Info value to be end with ' + fileNameToUpload);
    await tenderUpdatePage.save();
    expect(await tenderUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await tenderComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Tender', async () => {
    const nbButtonsBeforeDelete = await tenderComponentsPage.countDeleteButtons();
    await tenderComponentsPage.clickOnLastDeleteButton();

    tenderDeleteDialog = new TenderDeleteDialog();
    expect(await tenderDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Tender?');
    await tenderDeleteDialog.clickOnConfirmButton();

    expect(await tenderComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
