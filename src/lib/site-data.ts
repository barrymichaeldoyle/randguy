// Shared data for calculators and datasets across the site

export const CALCULATORS = [
  {
    title: 'Income Tax Calculator',
    description:
      'Calculate your South African income tax based on the latest tax brackets and rebates for the 2025/2026 tax year. Includes UIF and year-over-year comparisons.',
    href: '/calculators/income-tax',
    icon: '💰',
    buttonText: 'Calculate My Tax →',
  },
  {
    title: 'Home Loan Calculator',
    description:
      'Calculate your monthly bond repayments and see total interest, repayment breakdown, and plan your property purchase.',
    href: '/calculators/home-loan',
    icon: '🏠',
    buttonText: 'Calculate Repayments →',
  },
  {
    title: 'Loan-to-Value (LTV) Calculator',
    description:
      'Calculate your LTV ratio to understand your equity position and loan terms. Essential tool for property buyers to assess their financing situation.',
    href: '/calculators/ltv',
    icon: '📊',
    buttonText: 'Calculate LTV →',
  },
  {
    title: 'TFSA Calculator',
    description:
      'Calculate how long it will take to max out your Tax-Free Savings Account. Track your contributions and plan your timeline to reach the R500,000 lifetime limit.',
    href: '/calculators/tfsa',
    icon: '🎯',
    buttonText: 'Plan My TFSA →',
  },
  {
    title: 'Interest Calculator',
    description:
      'Calculate interest gains across different time periods. Convert between annual, monthly, weekly, daily, and hourly interest rates for investments and loans.',
    href: '/calculators/interest',
    icon: '💹',
    buttonText: 'Calculate Interest →',
  },
] as const;

export const DATASETS = [
  {
    title: 'Prime & Repo Rates',
    description:
      'Historical South African prime lending & repo rates from major banks. Track how interest rates have changed over the decades and understand their impact on loans and mortgages.',
    href: '/data/prime-rates',
    icon: '📈',
  },
  {
    title: 'Consumer Price Index (CPI)',
    description:
      'Track South African inflation trends through historical CPI data. Understand how the cost of living has changed over time and its impact on your purchasing power.',
    href: '/data/cpi',
    icon: '📉',
  },
  {
    title: 'Tax Brackets History',
    description:
      'See how SARS income tax brackets and rates have evolved over time. Compare historical tax thresholds and understand how tax policy has changed.',
    href: '/data/tax-brackets',
    icon: '📊',
  },
] as const;
