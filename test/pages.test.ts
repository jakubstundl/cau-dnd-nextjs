import { test, expect } from '@playwright/test';

// It is imposibble to test specific trpc procedures on backend, 
// if you want to test something it must go through frontend

test('Initial home page title (Sanity check test)', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Home Page');
});

test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} => ${testInfo.status?.toUpperCase()}`);
  
    if (testInfo.status !== testInfo.expectedStatus)
      console.log(`Did not run as expected, ended up at ${page.url()}`);
});