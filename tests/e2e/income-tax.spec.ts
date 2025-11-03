import { test, expect } from '@playwright/test';

import type { Page } from '@playwright/test';

const route = '/calculators/income-tax';

async function resetCalculatorState(page: Page) {
  await page.goto(route);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

test.describe('Income Tax Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await resetCalculatorState(page);
  });

  test('default form state works', async ({ page }) => {
    await page.goto(route);

    // Default frequency is monthly; label should match
    await expect(
      page.getByLabel('Monthly Gross Income (before tax)')
    ).toBeVisible();

    // Advanced defaults are hidden until toggled; button is enabled
    const calcBtn = page.getByRole('button', { name: /Calculate Tax/i });
    await expect(calcBtn).toBeEnabled();
  });

  test('calculates correctly with valid data', async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    await page.getByLabel('Monthly Gross Income (before tax)').fill('50000'); // monthly income

    await page.getByRole('button', { name: /Calculate Tax/i }).click();

    // Expect results visible
    const resultsHeading = page.getByRole('heading', {
      name: /Your Tax Breakdown/i,
    });
    await expect(resultsHeading).toBeVisible();

    // Primary result card should show Take-Home Pay (monthly)
    await expect(page.getByText('Monthly Summary')).toBeVisible();
    // Use .first() to target the Monthly Summary section (first occurrence)
    // since there's also "Take-Home Pay" in the Annual Breakdown section
    await expect(page.getByText('Take-Home Pay').first()).toBeVisible();

    // Button becomes disabled and shows Calculated
    await expect(
      page.getByRole('button', { name: 'Calculated' })
    ).toBeDisabled();
  });

  test('results persist on refresh and after navigating away and back', async ({
    page,
  }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    await page.getByLabel('Monthly Gross Income (before tax)').fill('40000');
    await page.getByRole('button', { name: /Calculate Tax/i }).click();
    await expect(
      page.getByRole('heading', { name: /Your Tax Breakdown/i })
    ).toBeVisible();

    // Refresh
    await page.reload();
    await expect(
      page.getByRole('heading', { name: /Your Tax Breakdown/i })
    ).toBeVisible();

    // Navigate away and back
    await page.goto('/');
    await page.goto(route);
    await expect(
      page.getByRole('heading', { name: /Your Tax Breakdown/i })
    ).toBeVisible();
  });

  test('prepopulated URL params auto-calculate', async ({ page }) => {
    const url = `${route}?income=60000&frequency=monthly&age=under65&year=2026&salary=1`;
    await page.goto(url);

    // Wait for auto-calc to finish
    await expect(
      page.getByRole('heading', { name: /Your Tax Breakdown/i })
    ).toBeVisible();

    // Assert Monthly Summary present and contains currency values
    await expect(page.getByText('Monthly Summary')).toBeVisible();
    // Scope to Monthly Summary section to avoid matching Annual Breakdown
    const monthlySection = page
      .getByRole('heading', { name: 'Monthly Summary' })
      .locator('..');
    await expect(
      monthlySection.getByText(/R\s?\d|\d,\d{3}/).first()
    ).toBeVisible();
  });

  test('mobile: prepopulated params auto-scroll to results', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const url = `${route}?income=50000&frequency=monthly&age=under65&year=2026&salary=1`;
    await page.goto(url);

    // Wait for auto-calc to finish
    const resultsHeading = page.getByRole('heading', {
      name: /Your Tax Breakdown/i,
    });
    await expect(resultsHeading).toBeVisible();

    // Allow smooth scroll (component delays ~100ms and scrolls)
    await page.waitForTimeout(600);

    const inViewport = await resultsHeading.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    });
    expect(inViewport).toBeTruthy();
  });

  test('invalid URL params reset the form and clear results', async ({
    page,
  }) => {
    const url = `${route}?income=-1000&frequency=monthly&age=under65&year=2026&salary=1`;
    await page.goto(url);

    // After validation, it resets to defaults and no results
    await expect(
      page.getByRole('heading', { name: /Your Tax Breakdown/i })
    ).toHaveCount(0);

    // Default label visible and input empty
    await expect(
      page.getByLabel('Monthly Gross Income (before tax)')
    ).toHaveValue('');
  });

  test('reset button clears the form and results', async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    await page.getByLabel('Monthly Gross Income (before tax)').fill('70000');
    await page.getByRole('button', { name: /Calculate Tax/i }).click();
    await expect(
      page.getByRole('heading', { name: /Your Tax Breakdown/i })
    ).toBeVisible();

    await page.getByRole('button', { name: /Reset Form/i }).click();
    await expect(
      page.getByRole('heading', { name: /Your Tax Breakdown/i })
    ).toHaveCount(0);
    await expect(
      page.getByLabel('Monthly Gross Income (before tax)')
    ).toHaveValue('');
  });
});
