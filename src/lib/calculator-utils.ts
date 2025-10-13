/**
 * Format a number as South African Rand currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a decimal rate as a percentage
 */
export function formatPercentage(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}

/**
 * Format a number with thousand separators (South African format)
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-ZA").format(value);
}
