import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 60 * 1000, // 30 minutes per test (large data ops)
  expect: {
    timeout: 20 * 60 * 1000, // 20 minutes for assertions
  },
  use: {
    baseURL: 'http://localhost:4200',
    headless: false, // show browser so you can watch
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
