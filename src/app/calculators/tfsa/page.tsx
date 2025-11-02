import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import { CalculatorInfo } from '@/components/CalculatorInfo';
import { excali } from '@/fonts';
import { BASE_URL, TAGLINE } from '@/lib/constants';

import TFSACalculator from './_components/TFSACalculator';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TFSA Calculator | South Africa',
  description:
    'Calculate how long it will take to max out your Tax-Free Savings Account (TFSA) in South Africa. Free TFSA calculator with contribution tracking, timeline projections, and progress visualization.',
  alternates: {
    canonical: '/calculators/tfsa',
  },
  openGraph: {
    title: 'TFSA Calculator | South Africa',
    description:
      'Calculate how long it will take to max out your Tax-Free Savings Account (TFSA) in South Africa. Free TFSA calculator with contribution tracking and timeline projections.',
    type: 'website',
    url: '/calculators/tfsa',
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
    title: 'TFSA Calculator | South Africa',
    description:
      'Calculate how long it will take to max out your Tax-Free Savings Account (TFSA) in South Africa. Free TFSA calculator with contribution tracking and timeline projections.',
    images: ['/og-image.png'],
  },
};

export default function TFSACalculatorPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TFSA Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ZAR',
    },
    description:
      'Calculate how long it will take to max out your Tax-Free Savings Account (TFSA) in South Africa. Free TFSA calculator with contribution tracking, timeline projections, and progress visualization.',
    featureList: [
      'TFSA contribution timeline calculation',
      'Progress tracking visualization',
      'Lifetime limit: R500,000',
      'Annual limit checking: R36,000',
      'Projected max-out date',
      'Monthly and annual contribution planning',
    ],
    inLanguage: 'en-ZA',
    url: `${BASE_URL}/calculators/tfsa`,
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
        name: 'TFSA Calculator',
        item: `${BASE_URL}/calculators/tfsa`,
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
            { name: 'TFSA Calculator' },
          ]}
        />

        <div className="mb-8 text-center">
          <h1 className={`${excali.className} mb-4 text-4xl`}>
            TFSA Calculator
          </h1>
          <p className="text-lg text-gray-700">
            Calculate how long it will take to max out your Tax-Free Savings
            Account
          </p>
        </div>

        <TFSACalculator />

        <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
          <p className="mb-3 text-gray-800">
            Want to learn more about TFSAs and investment strategies?
          </p>
          <Button href="/blog/understanding-tax-free-savings">
            Read the Complete TFSA Guide →
          </Button>
        </div>

        <CalculatorInfo
          title="About Tax-Free Savings Accounts (TFSA)"
          items={[
            <>
              • <strong>Lifetime contribution limit:</strong> R500,000 (cannot
              be exceeded)
            </>,
            <>
              • <strong>Annual contribution limit:</strong> R36,000 per tax year
            </>,
            <>
              • <strong>Tax benefits:</strong> All growth, dividends, and
              interest are completely tax-free
            </>,
            <>
              • <strong>No tax on withdrawals:</strong> Unlike retirement
              annuities, you can access your money anytime without penalties.
              However, treat it like a retirement fund and avoid withdrawing to
              maximize long-term tax-free growth
            </>,
            <>
              • <strong>Withdrawals don&apos;t free up space:</strong> Once you
              contribute, that counts towards your lifetime limit forever - even
              if you withdraw the money
            </>,
            <>
              • <strong>Over-contribution penalties:</strong> Contributing more
              than R36,000 per year incurs a 40% penalty tax on the excess
            </>,
            <>
              • <strong>Available across providers:</strong> You can have
              multiple TFSAs across different banks and investment platforms
            </>,
            <>
              • <strong>Popular investment vehicle:</strong> Ideal for long-term
              wealth building with complete tax efficiency
            </>,
            <>
              • For informational purposes only - consult a financial advisor
              for personalized investment advice
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
