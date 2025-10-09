import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import { resolveFromRoot } from './lib/utils/paths';

process.env.CI
  ? dotenv.config({ path: resolveFromRoot('.env') })
  : dotenv.config({ path: resolveFromRoot('.env.development') });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
if (!baseUrl) throw new Error('BaseUrl not set by variables');

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  maxFailures: 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseUrl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'smoke-test',
      testDir: './tests',
      grep: /@smoke/,
      use: { ...devices['Desktop Chrome'] },
    },

    // --- Shared setup project (only for E2E) ---
    {
      name: 'e2e-all-browsers',
      testDir: './tests',
      grepInvert: [/@smoke/, /@api/],
      dependencies: ['chromium', 'firefox', 'webkit'],
    },
    // This prevents setup running for each browser.
    {
      name: 'setup-blogs',
      testMatch: /global-setup\.ts/,
      teardown: 'teardown-blogs',
    },
    {
      name: 'teardown-blogs',
      testMatch: /global-teardown\.ts/,
    },
    {
      name: 'chromium',
      testDir: './tests',
      grepInvert: [/@smoke/, /@api/],
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup-blogs'],
    },
    {
      name: 'firefox',
      testDir: './tests',
      grepInvert: [/@smoke/, /@api/],
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup-blogs'],
    },
    {
      name: 'webkit',
      testDir: './tests',
      grepInvert: [/@smoke/, /@api/],
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup-blogs'],
    },
    {
      name: 'api',
      testDir: './tests/api',
      grep: /@api/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup-blogs'],
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
  ...(process.env.CI
    ? {
        webServer: {
          command: 'npm run start',
          url: baseUrl + '/api/health',
          reuseExistingServer: !process.env.CI,
        },
      }
    : {
        /* Run your local dev server before starting the tests */
        webServer: {
          command: 'npm run dev',
          url: baseUrl + '/api/health',
          reuseExistingServer: true,
        },
      }),
});
