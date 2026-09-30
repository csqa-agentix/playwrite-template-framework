import { expect, type Locator, type Page } from '@playwright/test';

export class FreeCrmLoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly logo: Locator;
  readonly userMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: /^Email$/i });
    this.passwordInput = page.getByRole('textbox', { name: /^Password$/i });
    this.submitButton = page.getByRole('button', { name: /^Login$/i });
    this.logo = page.locator('._logoMark_1gzkm_33');
    this.userMenu = page.locator('[aria-label="User menu"]');
  }

  async goto(path = '/login'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async login(email: string, password: string): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await expect(this.userMenu).toBeVisible({ timeout: 15000 });
  }

  async logout(): Promise<void> {
    await expect(this.userMenu).toBeVisible();
    await this.userMenu.click();
    await this.page.getByRole('menuitem', { name: /Log Out/i }).click();
    await expect(this.emailInput).toBeVisible({ timeout: 15000 });
  }
}