import { test, expect } from '@playwright/test';

import { formatCurrencyInBrowser } from './utils';

import type { Page } from '@playwright/test';

const route = '/calculators/home-loan';

async function resetCalculatorState(page: Page) {
  await page.goto(route);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

function calcMonthly(loanAmount: number, annualRate: number, years: number) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

test.describe('Home Loan Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await resetCalculatorState(page);
  });

  test('default form state works', async ({ page }) => {
    await page.goto(route);

    await expect(page.getByLabel('Interest Rate (% per year)')).toHaveValue(
      '10.5'
    );
    await expect(page.getByLabel('Loan Term')).toHaveValue('20');
    // default unit is Years
    await expect(page.getByRole('combobox')).toHaveValue('years');
    await expect(page.getByLabel('Property Price')).toHaveValue('');
    await expect(page.getByLabel('Deposit')).toHaveValue('');

    const calcBtn = page.getByRole('button', { name: /Calculate Repayment/i });
    await expect(calcBtn).toBeEnabled();
  });

  test('calculates correctly with valid data', async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    // Fill inputs
    await page.getByLabel('Property Price').fill('1000000');
    await page.getByLabel('Deposit').fill('100000');
    // interest rate defaults to 10.5
    await page.getByLabel('Loan Term').fill('20');

    await page.getByRole('button', { name: /Calculate Repayment/i }).click();

    // Expect results visible
    const resultsHeading = page.getByRole('heading', {
      name: /Repayment Breakdown/i,
    });
    await expect(resultsHeading).toBeVisible();

    // Compute expected monthly including default service fee (R69)
    const loanAmount = 1000000 - 100000;
    const monthly = calcMonthly(loanAmount, 10.5, 20);
    const expectedMonthlyWithFee = monthly + 69;
    const expectedText = await formatCurrencyInBrowser(
      page,
      expectedMonthlyWithFee
    );
    await expect(page.getByText(expectedText).first()).toBeVisible();

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
    await page.getByLabel('Property Price').fill('750000');
    await page.getByLabel('Deposit').fill('50000');
    await page.getByRole('button', { name: /Calculate Repayment/i }).click();
    await expect(
      page.getByRole('heading', { name: /Repayment Breakdown/i })
    ).toBeVisible();

    // Refresh
    await page.reload();
    await expect(
      page.getByRole('heading', { name: /Repayment Breakdown/i })
    ).toBeVisible();

    // Navigate away and back
    await page.goto('/');
    await page.goto(route);
    await expect(
      page.getByRole('heading', { name: /Repayment Breakdown/i })
    ).toBeVisible();
  });

  test('shows alert with invalid data (deposit >= price)', async ({ page }) => {
    await page.goto(route);

    // Wait for the page to be fully interactive
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');

    // Wait for the calculator form to be ready
    await expect(page.getByLabel('Property Price')).toBeVisible();
    await expect(page.getByLabel('Deposit')).toBeVisible();

    // Ensure any loading overlay is gone
    await expect(page.getByText('Loading calculator values...')).toHaveCount(0);

    await page.getByLabel('Property Price').fill('500000');
    await page.getByLabel('Deposit').fill('500000');

    // Wait a bit for React state to settle after filling
    await page.waitForTimeout(100);

    // Ensure inputs reflect the filled values (formatting may add commas or spaces)
    // Accept any whitespace or comma separator (browsers format differently)
    await expect(page.getByLabel('Property Price')).toHaveValue(/500[\s,]?000/);
    await expect(page.getByLabel('Deposit')).toHaveValue(/500[\s,]?000/);

    // Wait for button to be ready and ensure it's not covered
    const calcBtn = page.getByRole('button', { name: 'Calculate Repayment' });
    await calcBtn.waitFor({ state: 'visible' });
    await expect(calcBtn).toBeEnabled();

    // Pre-register a one-shot dialog handler BEFORE clicking
    let dialogMessage = '';
    page.once('dialog', (dialog) => {
      dialogMessage = dialog.message();
      dialog.accept();
    });

    // Scroll into view and click
    await calcBtn.scrollIntoViewIfNeeded();
    await calcBtn.click();

    // Assert the alert text captured by the handler
    expect(dialogMessage).toMatch(
      /Deposit cannot be equal to or greater than property price/i
    );

    // No results shown
    await expect(
      page.getByRole('heading', { name: /Repayment Breakdown/i })
    ).toHaveCount(0);
  });

  test('prepopulated URL params auto-calculate', async ({ page }) => {
    const url = `${route}?price=1000000&deposit=200000&rate=10.5&term=20&termUnit=years`;
    await page.goto(url);

    // Wait for auto-calc to finish
    await expect(
      page.getByRole('heading', { name: /Repayment Breakdown/i })
    ).toBeVisible();

    const loanAmount = 1000000 - 200000;
    const monthly = calcMonthly(loanAmount, 10.5, 20);
    const expectedMonthlyWithFee = monthly + 69;
    const expectedText = await formatCurrencyInBrowser(
      page,
      expectedMonthlyWithFee
    );
    // Disambiguate: target the green primary result card only
    const primaryResultCard = page
      .locator('div.rounded-lg.border-2')
      .filter({ has: page.getByText('Total Monthly Payment') });
    await expect(primaryResultCard.getByText(expectedText)).toBeVisible();
  });

  test('mobile: prepopulated params auto-scroll to results', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const url = `${route}?price=1000000&deposit=200000&rate=10.5&term=20&termUnit=years`;
    await page.goto(url);

    // Wait for auto-calc to finish
    const resultsHeading = page.getByRole('heading', {
      name: /Repayment Breakdown/i,
    });
    await expect(resultsHeading).toBeVisible();

    // Allow smooth scroll (component delays 100ms and scrolls)
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
    const url = `${route}?price=1000000&deposit=2000000&rate=10.5&term=20&termUnit=years`;
    await page.goto(url);

    // After validation, it resets to defaults and no results
    await expect(
      page.getByRole('heading', { name: /Repayment Breakdown/i })
    ).toHaveCount(0);
    await expect(page.getByLabel('Interest Rate (% per year)')).toHaveValue(
      '10.5'
    );
    await expect(page.getByLabel('Loan Term')).toHaveValue('20');
    await expect(page.getByLabel('Property Price')).toHaveValue('');
    await expect(page.getByLabel('Deposit')).toHaveValue('');
  });

  test('reset button clears the form and results', async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    await page.getByLabel('Property Price').fill('600000');
    await page.getByRole('button', { name: /Calculate Repayment/i }).click();
    await expect(
      page.getByRole('heading', { name: /Repayment Breakdown/i })
    ).toBeVisible();

    await page.getByRole('button', { name: /Reset Form/i }).click();
    await expect(
      page.getByRole('heading', { name: /Repayment Breakdown/i })
    ).toHaveCount(0);
    await expect(page.getByLabel('Interest Rate (% per year)')).toHaveValue(
      '10.5'
    );
    await expect(page.getByLabel('Loan Term')).toHaveValue('20');
    await expect(page.getByLabel('Property Price')).toHaveValue('');
  });

  test('term unit switch preserves/updates value meaningfully', async ({
    page,
  }) => {
    await page.goto(route);
    await page.getByLabel('Loan Term').fill('20');
    // switch to months and ensure value converts to ~240
    await page.getByRole('combobox').selectOption('months');
    await expect(page.getByLabel('Loan Term')).toHaveValue('240');
    // switch back to years and ensure it converts back
    await page.getByRole('combobox').selectOption('years');
    await expect(page.getByLabel('Loan Term')).toHaveValue('20');
  });

  test('auto-scrolls to results on mobile after calculate', async ({
    page,
  }) => {
    // Simulate mobile viewport (set before navigation for layout)
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto(route);
    await page.waitForLoadState('domcontentloaded');

    // Ensure form is ready
    await expect(page.getByLabel('Property Price')).toBeVisible();
    await expect(page.getByLabel('Deposit')).toBeVisible();

    // Fill form
    await page.getByLabel('Property Price').fill('1000000');
    await page.getByLabel('Deposit').fill('100000');
    await page.getByLabel('Loan Term').fill('20');

    // Initial scroll position
    const initialScrollY = await page.evaluate(() => window.scrollY);

    // Trigger calculation
    await page.getByRole('button', { name: 'Calculate Repayment' }).click();

    // Wait for results to appear
    const resultsHeading = page.getByRole('heading', {
      name: /Repayment Breakdown/i,
    });
    await expect(resultsHeading).toBeVisible();

    // Wait for smooth scroll animation to complete (component uses 100ms delay)
    await page.waitForTimeout(600);

    // Assert we scrolled down by a meaningful amount or heading is in viewport
    const finalScrollY = await page.evaluate(() => window.scrollY);
    const scrolledDown = finalScrollY > initialScrollY + 50; // threshold
    const inViewport = await resultsHeading.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    });

    expect(scrolledDown || inViewport).toBeTruthy();
  });
});
