import { test, expect } from '../fixtures/freecrm.fixture';
import { FreeCrmPageManager } from '../../pages/freecrm.page.manager';
import testData from '../../test-data/freecrm.json';

async function login(pageManager: FreeCrmPageManager): Promise<void> {
  await pageManager.loginPage.goto(testData.paths.login);
  await pageManager.loginPage.login(
    process.env.FREECRM_EMAIL || testData.credentials.email,
    process.env.FREECRM_PASSWORD || testData.credentials.password,
  );
}

test.describe('FreeCRM requested test cases', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Test Case 1 - Login into system with valid credentials', async ({ pageManager }) => {
    await login(pageManager);
    await expect(pageManager.loginPage.userMenu).toBeVisible();
  });

  test('Test Case 2 - Identify the logo on the login page', async ({ pageManager }) => {
    await pageManager.loginPage.goto(testData.paths.login);
    await expect(pageManager.loginPage.logo).toBeVisible();
  });

  test('Test Case 3 - Add contact with first name and last name', async ({ page, pageManager }) => {
    await login(pageManager);
    await pageManager.contactsPage.goto(testData.paths.contacts);
    await pageManager.contactsPage.createContact(
      `${testData.contact.firstNamePrefix}${Date.now()}`,
      testData.contact.lastName,
    );
    await expect(page).toHaveURL(/contacts/);
  });

  test('Test Case 4 - Add company and save', async ({ page, pageManager }) => {
    await login(pageManager);
    await pageManager.companiesPage.goto(testData.paths.companies);
    const companyName = `${testData.company.namePrefix} ${Date.now()}`;
    await pageManager.companiesPage.createCompany(companyName);
    await expect(page.getByRole('heading', { name: companyName })).toBeVisible({ timeout: 10000 });
  });

  test('Test Case 5 - Logout from the system', async ({ page, pageManager }) => {
    await login(pageManager);
    await pageManager.loginPage.logout();
    await expect(page).toHaveURL(/login/);
  });

  test('Locator failure 1 - missing contacts button after login', async ({ page, pageManager }) => {
    await login(pageManager);
    await page.locator('#missing-contacts-button').click();
  });

  test('Locator failure 2 - missing contact field after login', async ({ page, pageManager }) => {
    await login(pageManager);
    await page.locator('input[name="missing_first_name"]').fill('Test');
  });

  test('Locator failure 3 - missing company field after login', async ({ page, pageManager }) => {
    await login(pageManager);
    await page.locator('#missing-company-name').fill('Test Company');
  });

  test('Locator failure 4 - missing save button after login', async ({ page, pageManager }) => {
    await login(pageManager);
    await page.locator('button[data-testid="missing-save-button"]').click();
  });

  test('Locator failure 5 - missing logout control after login', async ({ page, pageManager }) => {
    await login(pageManager);
    await page.locator('[aria-label="missing logout control"]').click();
  });

  test('Wait failure 1 - contacts panel does not load', async ({ page, pageManager }) => {
    await login(pageManager);
    await pageManager.contactsPage.goto(testData.paths.contacts);
    await page.waitForSelector('[data-testid="contacts-panel-never-loads"]', { state: 'visible', timeout: 1000 });
  });

  test('Wait failure 2 - contact form does not load', async ({ page, pageManager }) => {
    await login(pageManager);
    await pageManager.contactsPage.goto(testData.paths.contacts);
    await page.waitForSelector('#contact-form-never-loads', { state: 'visible', timeout: 1000 });
  });

  test('Wait failure 3 - company form does not load', async ({ page, pageManager }) => {
    await login(pageManager);
    await pageManager.companiesPage.goto(testData.paths.companies);
    await page.waitForSelector('#company-form-never-loads', { state: 'visible', timeout: 1000 });
  });

  test('Wait failure 4 - dashboard widget does not load', async ({ page, pageManager }) => {
    await login(pageManager);
    await page.waitForSelector('.dashboard-widget-never-loads', { state: 'visible', timeout: 1000 });
  });

  test('Wait failure 5 - logout confirmation does not load', async ({ page, pageManager }) => {
    await login(pageManager);
    await pageManager.loginPage.logout();
    await page.waitForSelector('[aria-label="logout-confirmation-never-loads"]', { state: 'visible', timeout: 1000 });
  });

  test('Knowledge failure 1 - unexpected dashboard heading', async ({ page, pageManager }) => {
    await login(pageManager);
    await expect(page.getByRole('heading', { name: 'Expected Dashboard Heading' })).toBeVisible();
  });

  test('Knowledge failure 2 - invalid contacts URL expectation', async ({ page, pageManager }) => {
    await login(pageManager);
    await pageManager.contactsPage.goto(testData.paths.contacts);
    await expect(page).toHaveURL(/contacts\/details\/999999/);
  });

  test('Knowledge failure 3 - unexpected contact count', async ({ page, pageManager }) => {
    await login(pageManager);
    await pageManager.contactsPage.goto(testData.paths.contacts);
    await expect(page.getByText('9999 Contacts')).toBeVisible();
  });

  test('Knowledge failure 4 - unsupported dashboard action', async ({ page, pageManager }) => {
    await login(pageManager);
    await page.getByRole('button', { name: 'Export All Records' }).click();
  });

  test('Knowledge failure 5 - incorrect application state', async ({ page, pageManager }) => {
    await login(pageManager);
    await expect(page).toHaveTitle('FreeCRM Test Environment');
  });
});