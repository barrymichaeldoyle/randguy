import Link from 'next/link';
import { Suspense } from 'react';

import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import { CalculatorInfo } from '@/components/CalculatorInfo';
import { excali } from '@/fonts';
import { BASE_URL, TAGLINE } from '@/lib/constants';
import {
  PRIME_LENDING_RATE_LAST_UPDATED,
  CURRENT_PRIME_LENDING_RATE,
} from '@/lib/historical-data';

import HomeLoanCalculator from './_components/HomeLoanCalculator';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home Loan Calculator | South Africa',
  description:
    'Calculate your home loan repayments in South Africa. Free bond calculator with monthly payments, total interest, and loan breakdown. Plan your property purchase with accurate repayment estimates.',
  alternates: {
    canonical: '/calculators/home-loan',
  },
  openGraph: {
    title: 'Home Loan Calculator | South Africa',
    description:
      'Calculate your home loan repayments in South Africa. Free bond calculator with monthly payments, total interest, and loan breakdown.',
    type: 'website',
    url: '/calculators/home-loan',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Rand Guy - ${TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Loan Calculator | South Africa',
    description:
      'Calculate your home loan repayments in South Africa. Free bond calculator with monthly payments, total interest, and loan breakdown.',
    images: ['/og-image.png'],
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Home Loan Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'ZAR',
  },
  description:
    'Calculate your home loan repayments in South Africa. Free bond calculator with monthly payments, total interest, and loan breakdown.',
  featureList: [
    'Monthly repayment calculation',
    'Total interest calculation',
    'Loan term flexibility (1-100 years or months)',
    'Deposit percentage calculator',
    'Configurable monthly service fee',
    'Visual cost breakdown',
    'South African bond calculator',
  ],
  inLanguage: 'en-ZA',
  url: `${BASE_URL}/calculators/home-loan`,
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
      name: 'Home Loan Calculator',
      item: `${BASE_URL}/calculators/home-loan`,
    },
  ],
};

export default function HomeLoanCalculatorPage() {
  const lastUpdated = new Date(
    PRIME_LENDING_RATE_LAST_UPDATED
  ).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <div className="w-full max-w-7xl px-4 pt-8 pb-8 md:px-8 md:pt-12">
        <Breadcrumb
          items={[
            { name: 'Home', href: '/' },
            { name: 'Calculators', href: '/calculators' },
            { name: 'Home Loan Calculator' },
          ]}
        />

        <div className="mb-8 text-center">
          <h1 className={`${excali.className} mb-4 text-4xl`}>
            Home Loan Calculator
          </h1>
          <p className="text-lg text-gray-700">
            Calculate your monthly bond repayments in South Africa
          </p>
        </div>

        <Suspense
          fallback={
            <div className="py-8 text-center">
              Loading home loancalculator...
            </div>
          }
          name="home-loan-calculator"
        >
          <HomeLoanCalculator />
        </Suspense>

        <CalculatorInfo
          title="About This Home Loan Calculator"
          items={[
            <>
              • Calculates <strong>monthly repayments</strong> based on loan
              amount, interest rate, and term
            </>,
            <>
              • Uses the standard <strong>amortization formula</strong> used by
              South African banks
            </>,
            <>
              • Current <strong>SA prime rate</strong> is{' '}
              {CURRENT_PRIME_LENDING_RATE}% (as of {lastUpdated}).{' '}
              <Link href="/data/prime-rates">View historical rates</Link>.
              Interest rates vary by bank and are negotiable
            </>,
            <>
              • <strong>100% home loans</strong> are available from many banks,
              especially for first-time home buyers. Adding a deposit may help
              you negotiate better rates
            </>,
            <>
              • Includes optional <strong>monthly service fee</strong>{' '}
              (typically R69) - this is the bank admin fee charged each month
            </>,
            <>
              • Does not include additional costs like transfer fees, bond
              registration, or insurance
            </>,
            <>
              • <strong>Loan term</strong> typically ranges from 20-30 years for
              home loans
            </>,
            <>
              • Shorter loan terms mean higher monthly payments but less total
              interest paid
            </>,
            <>
              • For informational purposes only - contact a bank or bond
              originator for accurate quotes
            </>,
          ]}
        />

        <div className="mt-8 text-center">
          <Button href="/calculators" variant="secondary">
            View All Calculators
          </Button>
        </div>
      </div>
    </>
  );
}
