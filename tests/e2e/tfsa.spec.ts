import { test, expect } from '@playwright/test';

import { formatCurrencyInBrowser } from './utils';

import type { Page } from '@playwright/test';

const route = '/calculators/tfsa';

async function resetCalculatorState(page: Page) {
  await page.goto(route);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

test.describe('TFSA Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await resetCalculatorState(page);
  });

  test('default form state works', async ({ page }) => {
    await page.goto(route);

    await expect(page.getByLabel('Current TFSA Contributions')).toHaveValue('');
    await expect(page.getByLabel('Contribution Amount')).toHaveValue('');
    // Unit select defaults to Annual (years)
    await expect(page.getByRole('combobox')).toHaveValue('years');

    const calcBtn = page.getByRole('button', { name: /^Calculate$/i });
    await expect(calcBtn).toBeEnabled();
  });

  test('calculates correctly with valid data (annual unit)', async ({
    page,
  }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    // Current = 120k, annual contribution = 36k
    await page.getByLabel('Current TFSA Contributions').fill('120000');
    await page.getByLabel('Contribution Amount').fill('36000');
    await page.getByRole('button', { name: /^Calculate$/i }).click();

    const resultsHeading = page.getByRole('heading', {
      name: /Your TFSA Timeline/i,
    });
    await expect(resultsHeading).toBeVisible();

    // Remaining = 500k - 120k = 380k
    const expectedRemaining = 500_000 - 120_000;
    await expect(
      page
        .getByText(await formatCurrencyInBrowser(page, expectedRemaining))
        .first()
    ).toBeVisible();
  });

  test('calculates correctly with valid data (monthly unit)', async ({
    page,
  }) => {
    await page.goto(route);
    // Switch unit to Monthly
    await page.getByRole('combobox').selectOption('months');
    await page.getByLabel('Current TFSA Contributions').fill('0');
    await page.getByLabel('Contribution Amount').fill('3000');
    await page.getByRole('button', { name: /^Calculate$/i }).click();

    const resultsHeading = page.getByRole('heading', {
      name: /Your TFSA Timeline/i,
    });
    await expect(resultsHeading).toBeVisible();

    // Annual contribution should be 36k
    await expect(
      page.getByText(await formatCurrencyInBrowser(page, 36_000)).first()
    ).toBeVisible();
  });

  test('prepopulated URL params auto-calculate (annual)', async ({ page }) => {
    const url = `${route}?current=100000&contribution=36000&unit=years`;
    await page.goto(url);
    await expect(
      page.getByRole('heading', { name: /Your TFSA Timeline/i })
    ).toBeVisible();
  });

  test('prepopulated URL params auto-calculate (monthly)', async ({ page }) => {
    const url = `${route}?current=50000&contribution=3000&unit=months`;
    await page.goto(url);
    await expect(
      page.getByRole('heading', { name: /Your TFSA Timeline/i })
    ).toBeVisible();
  });

  test('invalid URL params reset the form and clear results', async ({
    page,
  }) => {
    // Negative contribution invalid
    const url = `${route}?current=100000&contribution=-1&unit=years`;
    await page.goto(url);
    await expect(
      page.getByRole('heading', { name: /Your TFSA Timeline/i })
    ).toHaveCount(0);
    await expect(page.getByLabel('Current TFSA Contributions')).toHaveValue('');
  });

  test('reset button clears the form, results, and URL params', async ({
    page,
  }) => {
    const url = `${route}?current=100000&contribution=36000&unit=years`;
    await page.goto(url);
    await expect(
      page.getByRole('heading', { name: /Your TFSA Timeline/i })
    ).toBeVisible();

    await page.getByRole('button', { name: /Reset Form/i }).click();
    await expect(
      page.getByRole('heading', { name: /Your TFSA Timeline/i })
    ).toHaveCount(0);
    await expect(page.getByLabel('Current TFSA Contributions')).toHaveValue('');

    // Wait for client-side replace to clear params
    await expect(page).toHaveURL(/\/calculators\/tfsa(?:\?|$)/);
    await expect
      .poll(async () => new URL(page.url()).searchParams.toString())
      .toBe('');
  });

  test('auto-scrolls to results on mobile after calculate', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(route);
    await page.waitForLoadState('domcontentloaded');

    await page.getByLabel('Current TFSA Contributions').fill('200000');
    await page.getByLabel('Contribution Amount').fill('36000');

    const initialScrollY = await page.evaluate(() => window.scrollY);

    await page.getByRole('button', { name: 'Calculate' }).click();

    const resultsHeading = page.getByRole('heading', {
      name: /Your TFSA Timeline/i,
    });
    await expect(resultsHeading).toBeVisible();

    await page.waitForTimeout(600);
    const finalScrollY = await page.evaluate(() => window.scrollY);
    const scrolledDown = finalScrollY > initialScrollY + 50;
    const inViewport = await resultsHeading.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    });
    expect(scrolledDown || inViewport).toBeTruthy();
  });
});
