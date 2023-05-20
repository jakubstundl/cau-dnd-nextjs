import { test, expect } from '@playwright/test';

test('GET /classes, returns all classes', async ({ page }) => {
    await page.goto('/classes');
    await expect(page.getByTestId('class')).toHaveCount(12); 
});

test('GET /classes/monk, return class description', async ({ page }) => {
    await page.goto('/classes/monk');
    await expect(page.getByTestId('class_details')).toHaveText("Her fists a blur as they deflect an incoming hail of arrows, a half-elf springs over a barricade and throws herself into the massed ranks of hobgoblins on the other side. She whirls among them, knocking their blows aside and sending them reeling, until at last she stands alone.  Taking a deep breath, a human covered in tattoos settles into a battle stance. As the first charging orcs reach him, he exhales and a blast of fire roars from his mouth, engulfing his foes."
    );  
    await expect(page).toHaveTitle('monk');
})

test('GET /classes/mentor, error handling on non-existent race', async ({ page }) => {
    await page.goto('/classes/mentor');
    await expect(page).toHaveTitle('404 - Page Not Found')
});

test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} => ${testInfo.status?.toUpperCase()}`);
  
    if (testInfo.status !== testInfo.expectedStatus)
      console.log(`Did not run as expected, ended up at ${page.url()}`);
});
