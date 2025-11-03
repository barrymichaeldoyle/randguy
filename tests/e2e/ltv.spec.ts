import { test, expect } from '@playwright/test';

import { formatCurrencyInBrowser } from './utils';

import type { Page } from '@playwright/test';

const route = '/calculators/ltv';

async function resetCalculatorState(page: Page) {
  await page.goto(route);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

function calculateLTV(propertyValue: number, loanAmount: number) {
  const deposit = propertyValue - loanAmount;
  const ltvPercentage = (loanAmount / propertyValue) * 100;
  const equityPercentage = (deposit / propertyValue) * 100;
  return {
    propertyValue,
    loanAmount,
    deposit,
    ltvPercentage,
    equityPercentage,
  };
}

test.describe('LTV Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await resetCalculatorState(page);
  });

  test('default form state works', async ({ page }) => {
    await page.goto(route);

    await expect(page.getByLabel('Property Value')).toHaveValue('');
    // Default input mode is Deposit
    await expect(page.getByRole('radio', { name: 'Deposit' })).toBeChecked();
    await expect(page.getByLabel('Deposit Amount')).toHaveValue('');

    const calcBtn = page.getByRole('button', { name: /Calculate LTV/i });
    await expect(calcBtn).toBeEnabled();
  });

  test('calculates correctly with valid data (deposit mode)', async ({
    page,
  }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    await page.getByLabel('Property Value').fill('1000000');
    await page.getByLabel('Deposit Amount').fill('200000');
    await page.getByRole('button', { name: /Calculate LTV/i }).click();

    const resultsHeading = page.getByRole('heading', {
      name: /LTV Breakdown/i,
    });
    await expect(resultsHeading).toBeVisible();

    const expected = calculateLTV(1_000_000, 800_000);
    const expectedLoanText = await formatCurrencyInBrowser(
      page,
      expected.loanAmount
    );
    const expectedEquityText = await formatCurrencyInBrowser(
      page,
      expected.deposit
    );

    await expect(
      page.getByText(`${expected.ltvPercentage.toFixed(1)}%`).first()
    ).toBeVisible();
    await expect(page.getByText(expectedLoanText).first()).toBeVisible();
    await expect(page.getByText(expectedEquityText).first()).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Calculated' })
    ).toBeDisabled();
  });

  test('calculates correctly with valid data (loan mode)', async ({ page }) => {
    await page.goto(route);
    await page.getByRole('radio', { name: 'Loan Amount' }).check();
    await page.getByLabel('Property Value').fill('900000');
    await page.getByRole('textbox', { name: 'Loan Amount' }).fill('765000');
    await page.getByRole('button', { name: /Calculate LTV/i }).click();

    const resultsHeading = page.getByRole('heading', {
      name: /LTV Breakdown/i,
    });
    await expect(resultsHeading).toBeVisible();

    const expected = calculateLTV(900_000, 765_000);
    await expect(
      page.getByText(`${expected.ltvPercentage.toFixed(1)}%`).first()
    ).toBeVisible();
  });

  test('prepopulated URL params auto-calculate (deposit mode)', async ({
    page,
  }) => {
    const url = `${route}?property=1000000&mode=deposit&deposit=250000`;
    await page.goto(url);
    await expect(
      page.getByRole('heading', { name: /LTV Breakdown/i })
    ).toBeVisible();
  });

  test('prepopulated URL params auto-calculate (loan mode)', async ({
    page,
  }) => {
    const url = `${route}?property=1200000&mode=loan&loan=1020000`;
    await page.goto(url);
    await expect(
      page.getByRole('heading', { name: /LTV Breakdown/i })
    ).toBeVisible();
  });

  test('invalid URL params reset the form and clear results', async ({
    page,
  }) => {
    // loan greater than property is invalid
    const url = `${route}?property=800000&mode=loan&loan=900000`;
    await page.goto(url);
    await expect(
      page.getByRole('heading', { name: /LTV Breakdown/i })
    ).toHaveCount(0);
    await expect(page.getByLabel('Property Value')).toHaveValue('');
  });

  test('reset button clears the form, results, and URL params', async ({
    page,
  }) => {
    const url = `${route}?property=1000000&mode=deposit&deposit=100000`;
    await page.goto(url);
    await expect(
      page.getByRole('heading', { name: /LTV Breakdown/i })
    ).toBeVisible();

    await page.getByRole('button', { name: /Reset Form/i }).click();
    await expect(
      page.getByRole('heading', { name: /LTV Breakdown/i })
    ).toHaveCount(0);
    await expect(page.getByLabel('Property Value')).toHaveValue('');

    // Wait for client-side replace to clear params
    await expect(page).toHaveURL(/\/calculators\/ltv(?:\?|$)/);
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

    await page.getByLabel('Property Value').fill('800000');
    await page.getByLabel('Deposit Amount').fill('160000');

    const initialScrollY = await page.evaluate(() => window.scrollY);
    await page.getByRole('button', { name: 'Calculate LTV' }).click();

    const resultsHeading = page.getByRole('heading', {
      name: /LTV Breakdown/i,
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
