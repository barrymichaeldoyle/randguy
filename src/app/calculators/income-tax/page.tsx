import type { Metadata } from 'next';

import { excali } from '@/fonts';
import { Button } from '@/components/Button';
import { CalculatorInfo } from '@/components/CalculatorInfo';
import { Breadcrumb } from '@/components/Breadcrumb';

import IncomeTaxCalculator from './_components/IncomeTaxCalculator';
import { BASE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Income Tax Calculator | South Africa 2025/2026',
  description:
    'Calculate your South African income tax for 2025/2026. Free income tax calculator with UIF, age-based rebates, and year-over-year comparison. Get instant tax breakdowns.',
  keywords: [
    'income tax calculator',
    'South Africa tax',
    'SARS tax calculator',
    '2025/2026 tax',
    'UIF calculator',
    'tax rebates',
    'take-home pay calculator',
  ],
  alternates: {
    canonical: '/calculators/income-tax',
  },
  openGraph: {
    title: 'Income Tax Calculator | South Africa 2025/2026',
    description:
      'Calculate your South African income tax for 2025/2026. Free income tax calculator with UIF, age-based rebates, and year-over-year comparison.',
    type: 'website',
    url: '/calculators/income-tax',
  },
};

export default function IncomeTaxCalculatorPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Income Tax Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ZAR',
    },
    description:
      'Calculate your South African income tax for 2025/2026. Free income tax calculator with UIF, age-based rebates, and year-over-year comparison.',
    featureList: [
      'Income tax calculation for South Africa',
      'UIF (Unemployment Insurance Fund) calculation',
      'Age-based rebates (65+ and 75+)',
      'Year-over-year tax comparison',
      'Multiple pay frequency options (monthly, annual, bi-weekly, weekly)',
      'Historical tax data from 2020/2021 to 2025/2026',
    ],
    inLanguage: 'en-ZA',
    url: `${BASE_URL}/calculators/income-tax`,
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Calculators',
        item: `${BASE_URL}/calculators`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Income Tax Calculator',
        item: `${BASE_URL}/calculators/income-tax`,
      },
    ],
  };

  return (
    <main className="flex flex-col items-center pt-8 md:pt-12 px-4 pb-8 md:px-8 flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <div className="max-w-7xl w-full">
        <Breadcrumb
          items={[
            { name: 'Home', href: '/' },
            { name: 'Calculators', href: '/calculators' },
            { name: 'Income Tax Calculator' },
          ]}
        />

        <div className="text-center mb-8">
          <h1 className={`${excali.className} text-4xl mb-4`}>
            South African Income Tax Calculator 2025/2026
          </h1>
          <p className="text-lg text-gray-700">
            Calculate your South African income tax with UIF and age-based
            rebates
          </p>
        </div>

        <IncomeTaxCalculator />

        <CalculatorInfo
          title="About This Income Tax Calculator"
          items={[
            <>
              • Based on official <strong>SARS tax brackets and rebates</strong>{' '}
              for the selected tax year (2020/2021 - 2025/2026)
            </>,
            <>
              • <strong>UIF (Unemployment Insurance Fund)</strong> is calculated
              at 1% for salary income, capped at R177.12/month (R17,712 monthly
              income ceiling)
            </>,
            <>
              • Tax brackets remained unchanged from 2024/2025 to 2025/2026,
              which may result in <strong>&quot;bracket creep&quot;</strong> as
              inflation pushes salaries into higher tax brackets
            </>,
            <>
              • Includes <strong>age-based rebates</strong> for taxpayers 65+
              and 75+
            </>,
            <>
              • Supports multiple <strong>pay frequencies</strong>: monthly,
              annual, bi-weekly, and weekly
            </>,
            <>
              • Does not include medical aid tax credits, retirement fund
              contributions, or other deductions
            </>,
            <>
              • For informational purposes only - consult a tax professional for
              personalized advice
            </>,
          ]}
        />

        <div className="text-center mt-8">
          <Button href="/" variant="secondary">
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
