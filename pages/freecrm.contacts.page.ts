import type { Locator, Page } from '@playwright/test';

export class FreeCrmContactsPage {
  readonly page: Page;
  readonly createButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createButton = page.getByRole('button', { name: /^Create$/i });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.saveButton = page.getByRole('button', { name: /^Save$/i });
  }

  async goto(path = '/contacts'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async createContact(firstName: string, lastName: string): Promise<void> {
    await this.createButton.click();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.saveButton.click();
  }
}