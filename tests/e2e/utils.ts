import type { Page } from '@playwright/test';

export async function formatCurrencyInBrowser(
  page: Page,
  value: number
): Promise<string> {
  return await page.evaluate((v) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v as number);
  }, value);
}
