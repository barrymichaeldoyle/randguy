import {
  defineConfig,
  devices,
  type PlaywrightTestConfig,
} from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* CI retries */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? ([
        ['dot'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
      ] as const)
    : ([['list'], ['html']] as const),
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    locale: 'en-ZA',
    timezoneId: 'Africa/Johannesburg',
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
};

// Only manage webServer if not explicitly skipped (useful for UI mode when server is already running)
if (!process.env.PLAYWRIGHT_SKIP_SERVER) {
  config.webServer = {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // Reduce output to speed up startup
    stdout: 'ignore',
    stderr: 'pipe',
  };
}

export default defineConfig(config);
