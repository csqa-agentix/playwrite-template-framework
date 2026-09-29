const { test, expect } = require('@playwright/test');
const { FreeCrmLoginPage } = require('../../pages/freecrm.login.page');

const EMAIL = process.env.FREECRM_EMAIL || 'csqa@yopmail.com';
const PASSWORD = process.env.FREECRM_PASSWORD || 'Admin@123123';

async function login(page) {
  const loginPage = new FreeCrmLoginPage(page);
  await loginPage.goto();
  await loginPage.login(EMAIL, PASSWORD);
  return loginPage;
}

test.describe('FreeCRM requested test cases', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Test Case 1 - Login into system with valid credentials', async ({ page }) => {
    await login(page);
    await expect(page.locator('[aria-label="User menu"]')).toBeVisible();
  });

  test('Test Case 2 - Identify the logo on the login page', async ({ page }) => {
    const loginPage = new FreeCrmLoginPage(page);
    await loginPage.goto();
    await expect(loginPage.logo).toBeVisible();
  });

  test('Test Case 3 - Add contact with first name and last name', async ({ page }) => {
    await login(page);
    await page.goto('https://ui.freecrm.com/contacts', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /^Create$/i }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill(`Test${Date.now()}`);
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Contact');
    await page.getByRole('button', { name: /^Save$/i }).click();
    await expect(page).toHaveURL(/contacts/);
  });

  test('Test Case 4 - Add company and save', async ({ page }) => {
    await login(page);
    await page.goto('https://ui.freecrm.com/companies', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /^Create$/i }).click();
    const companyName = `Test Company ${Date.now()}`;
    await page.locator('#name').fill(companyName);
    await page.locator('button[type="submit"]').click();
    await expect(page.getByRole('heading', { name: companyName })).toBeVisible({ timeout: 10000 });
  });

  test('Test Case 5 - Logout from the system', async ({ page }) => {
    const loginPage = await login(page);
    await loginPage.logout();
    await expect(page).toHaveURL(/login/);
  });

  test('Locator failure 1 - missing contacts button after login', async ({ page }) => {
    await login(page);
    await page.locator('#missing-contacts-button').click();
  });

  test('Locator failure 2 - missing contact field after login', async ({ page }) => {
    await login(page);
    await page.locator('input[name="missing_first_name"]').fill('Test');
  });

  test('Locator failure 3 - missing company field after login', async ({ page }) => {
    await login(page);
    await page.locator('#missing-company-name').fill('Test Company');
  });

  test('Locator failure 4 - missing save button after login', async ({ page }) => {
    await login(page);
    await page.locator('button[data-testid="missing-save-button"]').click();
  });

  test('Locator failure 5 - missing logout control after login', async ({ page }) => {
    await login(page);
    await page.locator('[aria-label="missing logout control"]').click();
  });

  test('Wait failure 1 - contacts panel does not load', async ({ page }) => {
    await login(page);
    await page.waitForSelector('[data-testid="contacts-panel-never-loads"]', { timeout: 1000 });
  });

  test('Wait failure 2 - contact form does not load', async ({ page }) => {
    await login(page);
    await page.waitForSelector('#contact-form-never-loads', { timeout: 1000 });
  });

  test('Wait failure 3 - company form does not load', async ({ page }) => {
    await login(page);
    await page.waitForSelector('#company-form-never-loads', { timeout: 1000 });
  });

  test('Wait failure 4 - dashboard widget does not load', async ({ page }) => {
    await login(page);
    await page.waitForSelector('.dashboard-widget-never-loads', { timeout: 1000 });
  });

  test('Wait failure 5 - logout confirmation does not load', async ({ page }) => {
    await login(page);
    await page.waitForSelector('[aria-label="logout-confirmation-never-loads"]', { timeout: 1000 });
  });

  test('Knowledge failure 1 - unexpected dashboard heading', async ({ page }) => {
    await login(page);
    await expect(page.getByRole('heading', { name: 'Expected Dashboard Heading' })).toBeVisible();
  });

  test('Knowledge failure 2 - invalid contacts URL expectation', async ({ page }) => {
    await login(page);
    await page.goto('https://ui.freecrm.com/contacts');
    await expect(page).toHaveURL(/contacts\/details\/999999/);
  });

  test('Knowledge failure 3 - unexpected contact count', async ({ page }) => {
    await login(page);
    await page.goto('https://ui.freecrm.com/contacts');
    await expect(page.getByText('9999 Contacts')).toBeVisible();
  });

  test('Knowledge failure 4 - unsupported dashboard action', async ({ page }) => {
    await login(page);
    await page.getByRole('button', { name: 'Export All Records' }).click();
  });

  test('Knowledge failure 5 - incorrect application state', async ({ page }) => {
    await login(page);
    expect(await page.title()).toBe('FreeCRM Test Environment');
  });
});
