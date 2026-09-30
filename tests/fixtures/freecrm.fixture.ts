import { expect, test as base } from '@playwright/test';
import { FreeCrmPageManager } from '../../pages/freecrm.page.manager';

export const test = base.extend<{ pageManager: FreeCrmPageManager }>({
  pageManager: async ({ page }, use) => {
    await use(new FreeCrmPageManager(page));
  },
});

export { expect };