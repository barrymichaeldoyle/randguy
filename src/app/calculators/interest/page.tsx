import type { Metadata } from 'next';

import { excali } from '@/fonts';
import { Button } from '@/components/Button';
import { CalculatorInfo } from '@/components/CalculatorInfo';
import { Breadcrumb } from '@/components/Breadcrumb';

import InterestCalculator from './_components/InterestCalculator';
import { BASE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Interest Calculator | South Africa',
  description:
    'Calculate simple and compound interest gains across different time periods. Convert between annual, monthly, weekly, daily, and hourly interest rates. Free interest calculator with multiple compounding options for South African investments and loans.',
  keywords: [
    'interest calculator',
    'simple interest',
    'compound interest',
    'South Africa interest',
    'interest rate calculator',
    'investment calculator',
    'loan interest',
    'annual interest',
    'monthly interest',
    'monthly compounding',
    'quarterly compounding',
    'interest breakdown',
  ],
  alternates: {
    canonical: '/calculators/interest',
  },
  openGraph: {
    title: 'Interest Calculator | South Africa',
    description:
      'Calculate simple and compound interest gains across different time periods. Convert between annual, monthly, weekly, daily, and hourly interest rates with multiple compounding options.',
    type: 'website',
    url: '/calculators/interest',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Rand Guy - Making Cents of SA Finance',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interest Calculator | South Africa',
    description:
      'Calculate simple and compound interest gains across different time periods. Convert between annual, monthly, weekly, daily, and hourly interest rates with multiple compounding options.',
    images: ['/og-image.png'],
  },
};

export default function InterestCalculatorPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Interest Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ZAR',
    },
    description:
      'Calculate simple and compound interest gains across different time periods. Convert between annual, monthly, weekly, daily, and hourly interest rates. Free interest calculator with multiple compounding options for South African investments and loans.',
    featureList: [
      'Simple and compound interest calculation',
      'Multiple compounding frequencies (monthly, quarterly, annually, etc.)',
      'Multiple time period conversion',
      'Annual, monthly, weekly, daily, and hourly breakdowns',
      'Flexible rate input periods',
      'Investment and loan planning',
      'Effective annual rate display',
      'Simple vs Compound comparison',
    ],
    inLanguage: 'en-ZA',
    url: `${BASE_URL}/calculators/interest`,
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
        name: 'Interest Calculator',
        item: `${BASE_URL}/calculators/interest`,
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
            { name: 'Interest Calculator' },
          ]}
        />

        <div className="text-center mb-8">
          <h1 className={`${excali.className} text-4xl mb-4`}>
            Interest Calculator
          </h1>
          <p className="text-lg text-gray-700">
            Calculate simple and compound interest gains across multiple time
            periods
          </p>
        </div>

        <InterestCalculator />

        <CalculatorInfo
          title="About Interest Calculations"
          items={[
            <>
              • <strong>Simple vs Compound:</strong> Choose between simple
              interest (calculated only on principal) or compound interest
              (earning interest on interest)
            </>,
            <>
              • <strong>Compounding frequencies:</strong> Select from daily,
              monthly, quarterly, semi-annually, annually, hourly, or continuous
              compounding to match your investment or loan terms
            </>,
            <>
              • <strong>Flexible input:</strong> Enter your interest rate in any
              time period (annual, monthly, weekly, daily, or hourly)
            </>,
            <>
              • <strong>Multiple breakdowns:</strong> See your interest gains
              across all time periods simultaneously
            </>,
            <>
              • <strong>Effective annual rate:</strong> The calculator converts
              your input to an effective annual rate for comparison
            </>,
            <>
              • <strong>Investment planning:</strong> Useful for understanding
              potential returns on investments or costs of loans
            </>,
            <>
              • <strong>Compound interest power:</strong> More frequent
              compounding yields higher returns - most South African banks
              accrue interest daily
            </>,
            <>
              • <strong>Time value visualization:</strong> Helps you understand
              how interest accumulates over different periods
            </>,
            <>
              • For informational purposes only - consult a financial advisor
              for personalized investment advice
            </>,
          ]}
        />

        <div className="text-center mt-8">
          <Button href="/calculators" variant="secondary">
            View All Calculators
          </Button>
        </div>
      </div>
    </main>
  );
}
