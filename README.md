# Playwright FreeCRM Tests

Playwright JavaScript framework using Page Object Model to test the FreeCRM application:

<https://ui.freecrm.com/login>

The browser runs in headed mode locally and headless mode in CI. The CI pipeline runs the five functional tests so the workflow remains green; the other 15 tests are intentional failure demonstrations.

## Project Structure

```text
pages/
	freecrm.login.page.js    Login, logo, and logout page actions
tests/e2e/
	freecrm.spec.js          20 FreeCRM test cases
playwright.config.js       Playwright configuration
.github/workflows/
	playwright.yml            GitHub Actions CI pipeline
```

## Test Coverage

`freecrm.spec.js` contains 20 tests:

- 5 passing functional tests: login, logo, add contact, add company, and logout
- 5 intentional locator-not-found failures
- 5 intentional wait-timeout failures
- 5 intentional application-behavior/assertion failures

The passing tests are expected to pass. The complete suite is intentionally expected to exit with code `1` because 15 tests are designed to fail.

## Credentials

The default test credentials are:

```text
Email: csqa@yopmail.com
Password: Admin@123123
```

Credentials can be overridden without changing source code:

```powershell
$env:FREECRM_EMAIL = 'your-email@example.com'
$env:FREECRM_PASSWORD = 'your-password'
```

## Installation

```powershell
npm install
npx playwright install
```

## Run Tests

Run the complete suite in headed Chromium:

```powershell
npx playwright test tests/e2e/freecrm.spec.js --project=chromium --workers=1
```

Run only the five passing functional tests:

```powershell
npx playwright test tests/e2e/freecrm.spec.js --project=chromium --workers=1 --grep "Test Case [1-5]"
```

Run the intentional failure groups:

```powershell
npx playwright test tests/e2e/freecrm.spec.js --project=chromium --workers=1 --grep "Locator failure"
npx playwright test tests/e2e/freecrm.spec.js --project=chromium --workers=1 --grep "Wait failure"
npx playwright test tests/e2e/freecrm.spec.js --project=chromium --workers=1 --grep "Knowledge failure"
```

Run with the npm script:

```powershell
npm test -- tests/e2e/freecrm.spec.js --project=chromium --workers=1
```

Run the CI-safe functional test set locally:

```powershell
npm run test:ci
```

## CI/CD Pipeline

GitHub Actions is configured in `.github/workflows/playwright.yml`. It runs on pushes and pull requests targeting `main` or `master`, installs Chromium, runs the five functional tests, and uploads the HTML report and test artifacts.

Add these repository secrets under **Settings > Secrets and variables > Actions**:

```text
FREECRM_EMAIL
FREECRM_PASSWORD
```

The workflow uses Node.js 20 and `npm ci`, so `package-lock.json` must remain committed.

## Reports

After a run, open the HTML report with:

```powershell
npx playwright show-report
```

Test artifacts such as screenshots, videos, traces, and JSON results are stored under `test-results/` and `playwright-report/`.
