import { test, expect } from '@playwright/test';

test.describe('Calculators index and pages', () => {
  test('calculators index renders a grid of calculators', async ({ page }) => {
    await page.goto('/calculators');
    const pageHeading = page.getByRole('heading', {
      name: /South African Financial Calculators/i,
    });
    await expect(pageHeading).toBeVisible();
    // Expect at least one calculator card with a "Start" or button inside
    const anyCardButton = page
      .getByRole('link')
      .filter({ hasText: /Calculator|Start|Open|Go|Calculate/i })
      .first();
    await expect(anyCardButton).toBeVisible();
  });

  test('navigate to Income Tax calculator from calculators index', async ({
    page,
  }) => {
    await page.goto('/calculators');
    // Try common calculator link texts; fallback to first calculator button
    const linkCandidates = [
      /Income Tax Calculator/i,
      /Home Loan Calculator/i,
      /TFSA Calculator/i,
      /Loan-to-Value/i,
    ];

    let clicked = false;
    for (const pattern of linkCandidates) {
      const link = page.getByRole('link', { name: pattern });
      if (await link.count().then((c) => c > 0)) {
        await link.first().click();
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      // Fallback: click the first calculator card button
      await page.getByRole('link').first().click();
    }

    await expect(page).toHaveURL(/\/calculators\//);
    // Expect the calculator page to have a heading
    const calcHeading = page.getByRole('heading').first();
    await expect(calcHeading).toBeVisible();
  });
});
