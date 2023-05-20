import { PlaywrightTestConfig, devices } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
console.log(`ℹ️ Using base URL "${baseUrl}"`);

const opts = {
  // launch headless on CI, in browser locally
  headless: !!process.env.CI || !!process.env.PLAYWRIGHT_HEADLESS,
  // collectCoverage: !!process.env.PLAYWRIGHT_HEADLESS
};
const config: PlaywrightTestConfig = {

  testDir: './test',  

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000/',
    timeout: 120000,
  },
  use: {
    ...devices['Desktop Chrome'],
    baseURL: baseUrl,
    headless: opts.headless,
    testIdAttribute: 'test-id',
  },
};

export default config;
