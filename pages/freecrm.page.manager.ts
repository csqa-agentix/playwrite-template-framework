import type { Page } from '@playwright/test';
import { FreeCrmCompaniesPage } from './freecrm.companies.page';
import { FreeCrmContactsPage } from './freecrm.contacts.page';
import { FreeCrmLoginPage } from './freecrm.login.page';

export class FreeCrmPageManager {
  readonly loginPage: FreeCrmLoginPage;
  readonly contactsPage: FreeCrmContactsPage;
  readonly companiesPage: FreeCrmCompaniesPage;

  constructor(page: Page) {
    this.loginPage = new FreeCrmLoginPage(page);
    this.contactsPage = new FreeCrmContactsPage(page);
    this.companiesPage = new FreeCrmCompaniesPage(page);
  }
}