const { expect } = require('@playwright/test');

class FreeCrmLoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: /^Email$/i });
    this.passwordInput = page.getByRole('textbox', { name: /^Password$/i });
    this.submitButton = page.getByRole('button', { name: /^Login$/i });
    this.logo = page.locator('._logoMark_1gzkm_33');
    this.userMenu = page.locator('[aria-label="User menu"]');
  }

  async goto() {
    await this.page.goto('https://ui.freecrm.com/login', { waitUntil: 'domcontentloaded' });
  }

  async login(email, password) {
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await expect(this.userMenu).toBeVisible({ timeout: 15000 });
  }

  async logout() {
    await expect(this.userMenu).toBeVisible();
    await this.userMenu.click();
    await this.page.getByRole('menuitem', { name: /Log Out/i }).click();
    await expect(this.emailInput).toBeVisible({ timeout: 15000 });
  }
}

module.exports = { FreeCrmLoginPage };
