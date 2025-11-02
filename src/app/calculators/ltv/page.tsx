import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import { CalculatorInfo } from '@/components/CalculatorInfo';
import { excali } from '@/fonts';
import { BASE_URL, TAGLINE } from '@/lib/constants';

import LTVCalculator from './_components/LTVCalculator';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loan-to-Value (LTV) Calculator | South Africa',
  description:
    'Calculate your Loan-to-Value (LTV) ratio for property purchases in South Africa. Free LTV calculator to understand your equity position and loan terms. Essential for home buyers.',
  alternates: {
    canonical: '/calculators/ltv',
  },
  openGraph: {
    title: 'Loan-to-Value (LTV) Calculator | South Africa',
    description:
      'Calculate your Loan-to-Value (LTV) ratio for property purchases in South Africa. Understand your equity position and loan terms.',
    type: 'website',
    url: '/calculators/ltv',
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
    title: 'Loan-to-Value (LTV) Calculator | South Africa',
    description:
      'Calculate your Loan-to-Value (LTV) ratio for property purchases in South Africa. Understand your equity position and loan terms.',
    images: ['/og-image.png'],
  },
};

export default function LTVCalculatorPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Loan-to-Value Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ZAR',
    },
    description:
      'Calculate your Loan-to-Value (LTV) ratio for property purchases in South Africa. Free calculator to understand your equity position.',
    featureList: [
      'LTV percentage calculation',
      'Equity position calculation',
      'Visual breakdown of loan vs equity',
      'Flexible input (deposit or loan amount)',
      'South African property context',
      'Interest rate guidance by LTV level',
    ],
    inLanguage: 'en-ZA',
    url: `${BASE_URL}/calculators/ltv`,
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
        name: 'LTV Calculator',
        item: `${BASE_URL}/calculators/ltv`,
      },
    ],
  };

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
            { name: 'LTV Calculator' },
          ]}
        />

        <div className="mb-8 text-center">
          <h1 className={`${excali.className} mb-4 text-4xl`}>
            Loan-to-Value (LTV) Calculator
          </h1>
          <p className="text-lg text-gray-700">
            Calculate your LTV ratio and understand your equity position
          </p>
        </div>

        <LTVCalculator />

        <CalculatorInfo
          title="About Loan-to-Value (LTV) Ratio"
          items={[
            <>
              • <strong>LTV (Loan-to-Value)</strong> is the ratio of your loan
              amount to the property value, expressed as a percentage
            </>,
            <>
              • <strong>Formula:</strong> LTV = (Loan Amount / Property Value) ×
              100
            </>,
            <>
              • <strong>Lower LTV = Better rates:</strong> Banks offer better
              interest rates for LTV below 80%
            </>,
            <>
              • <strong>100% LTV</strong> means a full loan with no deposit.
              Available for first-time buyers but may have higher rates
            </>,
            <>
              • <strong>Your equity</strong> is the difference between property
              value and loan amount (your deposit)
            </>,
            <>
              • <strong>80% LTV or less</strong> typically gets you the best
              rates and terms from SA banks
            </>,
            <>
              • A larger deposit (lower LTV) gives you more{' '}
              <strong>negotiating power</strong> with banks
            </>,
            <>
              • LTV can change over time as you pay down your bond or as
              property values fluctuate
            </>,
            <>
              • For informational purposes only - actual rates depend on credit
              score, income, and bank policies
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
