import { test, expect } from '@playwright/test';

test('GET /races, returns all races', async ({ page }) => {
    await page.goto('/races');
    await expect(page.getByTestId('race')).toHaveCount(8); 
});

test('GET /races/human, returns correct human stats', async ({ page }) => {
    await page.goto('/races/human'); 
    await expect(page.getByTestId('race_details')).toHaveText("These were the stories of a restless people who long ago took to the seas and rivers in longboats, first to pillage and terrorize, then to settle. Yet there was an energy, a love of adventure, that sang from every page. Long into the night Liriel read, lighting candle after precious candle.  She’d never given much thought to humans, but these stories fascinated her. "
    );    
});

test('GET /races/john, error handling on non-existent race', async ({ page }) => {
    await page.goto('/races/john');  
    await expect(page).toHaveTitle('404 - Page Not Found')
});

test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} => ${testInfo.status?.toUpperCase()}`);
  
    if (testInfo.status !== testInfo.expectedStatus)
      console.log(`Did not run as expected, ended up at ${page.url()}`);
});
