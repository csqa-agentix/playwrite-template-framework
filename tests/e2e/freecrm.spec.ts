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
});