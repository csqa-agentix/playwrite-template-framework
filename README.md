# Playwright FreeCRM Tests

Playwright TypeScript tests for the FreeCRM application, organized with a Page Object Manager and JSON-driven test data:

<https://ui.freecrm.com/login>

The browser runs in headed mode locally and headless mode in CI. The suite contains five functional tests covering login, logo visibility, contact creation, company creation, and logout.

## Project Structure

```text
pages/
  freecrm.login.page.ts       Login, logo, and logout actions
  freecrm.contacts.page.ts    Contact creation actions
  freecrm.companies.page.ts   Company creation actions
  freecrm.page.manager.ts     Page object manager
tests/
  e2e/freecrm.spec.ts         Five FreeCRM functional tests
  fixtures/freecrm.fixture.ts Page manager fixture
test-data/freecrm.json        Base URL, paths, credentials, and form data
scripts/summarize-results.ts  Test result summary utility
playwright.config.ts          Playwright and reporter configuration
tsconfig.json                 TypeScript compiler configuration
.github/workflows/playwright.yml  GitHub Actions CI pipeline
```

## Test Coverage

`freecrm.spec.ts` contains five tests:

- Login with valid credentials
- Login-page logo visibility
- Contact creation
- Company creation
- Logout

## Test Data

Default credentials, application paths, and contact/company inputs are stored in `test-data/freecrm.json`. Credentials can be overridden without changing source code:

```powershell
$env:FREECRM_EMAIL = 'csqa@yopmail.com'
$env:FREECRM_PASSWORD = 'Admin@123123'
$env:FREECRM_BASE_URL = 'https://ui.freecrm.com'
```

Contact and company names receive a timestamp suffix during a run to avoid collisions with existing records.

## Installation

```powershell
npm install
npx playwright install chromium
```

## Run Tests

Run all five tests in headed Chromium:

```powershell
npx playwright test tests/e2e/freecrm.spec.ts --project=chromium --workers=1
```

Run only the five functional tests:

```powershell
npx playwright test tests/e2e/freecrm.spec.ts --project=chromium --workers=1 --grep "Test Case [1-5]"
```

Run with the npm script:

```powershell
npm test -- tests/e2e/freecrm.spec.ts --project=chromium --workers=1
```

Run the CI-safe functional test set locally:

```powershell
npm run test:ci
```

Type-check the framework:

```powershell
npm run typecheck
```

## Continuous Integration

GitHub Actions runs on pushes and pull requests targeting `main` or `master`. It installs Chromium, runs the five functional tests, and uploads the Playwright HTML report and test results as workflow artifacts. The CI job requires these repository secrets under **Settings > Secrets and variables > Actions**:

```text
FREECRM_EMAIL
FREECRM_PASSWORD
```

The workflow uses Node.js 20 and `npm ci`, so keep `package-lock.json` committed. Allure files are generated locally by the commands below; the current workflow does not upload an Allure report.

## Reports

The Playwright HTML report can be opened with:

```powershell
npx playwright show-report
```

Allure Playwright results are written to `allure-results/`. After running tests, generate and open the Allure Report 3 HTML report with:

```powershell
npm run allure:generate
npm run allure:open
```

The report is generated in `allure-report/`. The Playwright HTML report is generated in `playwright-report/`; screenshots, videos, traces, and JSON results are stored in `test-results/`.
