import type { Locator, Page } from '@playwright/test';

export class FreeCrmCompaniesPage {
  readonly page: Page;
  readonly createButton: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createButton = page.getByRole('button', { name: /^Create$/i });
    this.nameInput = page.locator('#name');
    this.saveButton = page.locator('button[type="submit"]');
  }

  async goto(path = '/companies'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async createCompany(name: string): Promise<void> {
    await this.createButton.click();
    await this.nameInput.fill(name);
    await this.saveButton.click();
  }
}