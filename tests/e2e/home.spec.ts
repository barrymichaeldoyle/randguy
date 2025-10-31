import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and shows main hero heading', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Rand Guy/i);
    const heading = page.getByRole('heading', {
      name: /South African Personal Finance Made Simple/i,
    });
    await expect(heading).toBeVisible();
  });

  test('navigates to Calculators page from home', async ({ page }) => {
    await page.goto('/');
    const calculatorsButton = page.getByRole('link', {
      name: /Explore Calculators/i,
    });
    await calculatorsButton.click();
    await expect(page).toHaveURL(/\/calculators$/);
    const calculatorsHeading = page.getByRole('heading', {
      name: /South African Financial Calculators/i,
    });
    await expect(calculatorsHeading).toBeVisible();
  });
});
