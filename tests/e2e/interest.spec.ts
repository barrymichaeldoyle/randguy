import { test, expect } from '@playwright/test';

import { formatCurrencyInBrowser } from './utils';

import type { Page } from '@playwright/test';

const route = '/calculators/interest';

async function resetCalculatorState(page: Page) {
  await page.goto(route);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  timeYears: number,
  frequency:
    | 'annually'
    | 'semi-annually'
    | 'quarterly'
    | 'monthly'
    | 'weekly'
    | 'daily'
    | 'hourly'
    | 'continuously'
): number {
  const r = annualRate / 100;
  if (frequency === 'continuously') {
    return principal * Math.exp(r * timeYears);
  }
  let n = 12;
  if (frequency === 'annually') n = 1;
  else if (frequency === 'semi-annually') n = 2;
  else if (frequency === 'quarterly') n = 4;
  else if (frequency === 'monthly') n = 12;
  else if (frequency === 'weekly') n = 52;
  else if (frequency === 'daily') n = 365;
  else if (frequency === 'hourly') n = 365 * 24;
  return principal * Math.pow(1 + r / n, n * timeYears);
}

test.describe('Interest Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await resetCalculatorState(page);
  });

  test('default form state works', async ({ page }) => {
    await page.goto(route);

    await expect(page.getByLabel('Principal Amount')).toHaveValue('');
    await expect(page.getByLabel('Interest Rate')).toHaveValue('');
    // First combobox is the period selector
    await expect(page.getByRole('combobox').first()).toHaveValue('annual');
    // Second combobox is the interest type
    await expect(page.getByRole('combobox').nth(1)).toHaveValue(
      'compound-daily'
    );

    const calcBtn = page.getByRole('button', { name: /^Calculate$/i });
    await expect(calcBtn).toBeEnabled();
  });

  test('calculates correctly with valid data (compound daily)', async ({
    page,
  }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    // Fill inputs
    await page.getByLabel('Principal Amount').fill('10000');
    await page.getByLabel('Interest Rate').fill('10');
    // Defaults: period = annual, type = compound-daily

    await page.getByRole('button', { name: /^Calculate$/i }).click();

    // Expect results visible
    const resultsHeading = page.getByRole('heading', {
      name: /Interest Breakdown/i,
    });
    await expect(resultsHeading).toBeVisible();

    // Verify annual gain matches calculation
    const principal = 10000;
    const annualRate = 10; // percent
    const totalAfterOneYear = calculateCompoundInterest(
      principal,
      annualRate,
      1,
      'daily'
    );
    const expectedAnnualGain = totalAfterOneYear - principal;
    const expectedText = await formatCurrencyInBrowser(
      page,
      expectedAnnualGain
    );

    const primaryResultCard = page
      .locator('div.rounded-lg.border-2')
      .filter({ has: page.getByText('Annual Interest Gain') });
    await expect(primaryResultCard.getByText(expectedText)).toBeVisible();

    // Button becomes disabled and shows Calculated
    await expect(
      page.getByRole('button', { name: 'Calculated' })
    ).toBeDisabled();
  });

  test('prepopulated URL params auto-calculate', async ({ page }) => {
    const url = `${route}?principal=10000&rate=10&period=annual&type=compound-daily`;
    await page.goto(url);

    // Wait for auto-calc to finish
    await expect(
      page.getByRole('heading', { name: /Interest Breakdown/i })
    ).toBeVisible();
  });

  test('invalid URL params reset the form and clear results', async ({
    page,
  }) => {
    const url = `${route}?principal=-1&rate=0&period=annual&type=compound-daily`;
    await page.goto(url);

    // After validation, it resets to defaults and no results
    await expect(
      page.getByRole('heading', { name: /Interest Breakdown/i })
    ).toHaveCount(0);
    await expect(page.getByLabel('Principal Amount')).toHaveValue('');
    await expect(page.getByLabel('Interest Rate')).toHaveValue('');
    await expect(page.getByRole('combobox').first()).toHaveValue('annual');
    await expect(page.getByRole('combobox').nth(1)).toHaveValue(
      'compound-daily'
    );
  });

  test('reset button clears the form, results, and URL params', async ({
    page,
  }) => {
    const url = `${route}?principal=5000&rate=12&period=monthly&type=simple`;
    await page.goto(url);
    await expect(
      page.getByRole('heading', { name: /Interest Breakdown/i })
    ).toBeVisible();

    await page.getByRole('button', { name: /Reset Form/i }).click();
    await expect(
      page.getByRole('heading', { name: /Interest Breakdown/i })
    ).toHaveCount(0);
    await expect(page.getByLabel('Principal Amount')).toHaveValue('');
    await expect(page.getByLabel('Interest Rate')).toHaveValue('');
    // URL should no longer contain managed params (wait for client-side replace)
    await expect(page).toHaveURL(/\/calculators\/interest(?:\?|$)/);
    await expect
      .poll(async () => new URL(page.url()).searchParams.toString())
      .toBe('');
  });

  test('deep link preserves provided rate and period without conversion', async ({
    page,
  }) => {
    const url = `${route}?principal=310000&rate=0.2&period=weekly&type=compound-hourly`;
    await page.goto(url);

    // Weekly period should be selected and the rate remain 0.2
    await expect(page.getByRole('combobox').first()).toHaveValue('weekly');
    await expect(page.getByLabel('Interest Rate')).toHaveValue('0.2');

    // Results should be visible (auto-calculated)
    await expect(
      page.getByRole('heading', { name: /Interest Breakdown/i })
    ).toBeVisible();
  });

  test('auto-scrolls to results on mobile after calculate', async ({
    page,
  }) => {
    // Simulate mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(route);
    await page.waitForLoadState('domcontentloaded');

    // Ensure form is ready
    await expect(page.getByLabel('Principal Amount')).toBeVisible();
    await expect(page.getByLabel('Interest Rate')).toBeVisible();

    // Fill form
    await page.getByLabel('Principal Amount').fill('10000');
    await page.getByLabel('Interest Rate').fill('10');

    const initialScrollY = await page.evaluate(() => window.scrollY);

    // Trigger calculation
    await page.getByRole('button', { name: 'Calculate' }).click();

    // Wait for results to appear
    const resultsHeading = page.getByRole('heading', {
      name: /Interest Breakdown/i,
    });
    await expect(resultsHeading).toBeVisible();

    // Wait for smooth scroll
    await page.waitForTimeout(600);

    // Assert scrolled or heading in viewport
    const finalScrollY = await page.evaluate(() => window.scrollY);
    const scrolledDown = finalScrollY > initialScrollY + 50;
    const inViewport = await resultsHeading.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    });
    expect(scrolledDown || inViewport).toBeTruthy();
  });
});
