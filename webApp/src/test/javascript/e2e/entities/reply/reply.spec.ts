/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ReplyComponentsPage, ReplyDeleteDialog, ReplyUpdatePage } from './reply.page-object';

const expect = chai.expect;

describe('Reply e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let replyUpdatePage: ReplyUpdatePage;
  let replyComponentsPage: ReplyComponentsPage;
  let replyDeleteDialog: ReplyDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Replies', async () => {
    await navBarPage.goToEntity('reply');
    replyComponentsPage = new ReplyComponentsPage();
    await browser.wait(ec.visibilityOf(replyComponentsPage.title), 5000);
    expect(await replyComponentsPage.getTitle()).to.eq('Replies');
  });

  it('should load create Reply page', async () => {
    await replyComponentsPage.clickOnCreateButton();
    replyUpdatePage = new ReplyUpdatePage();
    expect(await replyUpdatePage.getPageTitle()).to.eq('Create or edit a Reply');
    await replyUpdatePage.cancel();
  });

  it('should create and save Replies', async () => {
    const nbButtonsBeforeCreate = await replyComponentsPage.countDeleteButtons();

    await replyComponentsPage.clickOnCreateButton();
    await promise.all([
      replyUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      replyUpdatePage.setResponseInfoInput('responseInfo'),
      replyUpdatePage.tenderSelectLastOption(),
      replyUpdatePage.supplierSelectLastOption()
    ]);
    expect(await replyUpdatePage.getDateInput()).to.contain('2001-01-01T02:30', 'Expected date value to be equals to 2000-12-31');
    expect(await replyUpdatePage.getResponseInfoInput()).to.eq('responseInfo', 'Expected ResponseInfo value to be equals to responseInfo');
    await replyUpdatePage.save();
    expect(await replyUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await replyComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Reply', async () => {
    const nbButtonsBeforeDelete = await replyComponentsPage.countDeleteButtons();
    await replyComponentsPage.clickOnLastDeleteButton();

    replyDeleteDialog = new ReplyDeleteDialog();
    expect(await replyDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Reply?');
    await replyDeleteDialog.clickOnConfirmButton();

    expect(await replyComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
