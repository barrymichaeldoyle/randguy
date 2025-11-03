import Link from 'next/link';
import { Suspense } from 'react';

import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import { CalculatorInfo } from '@/components/CalculatorInfo';
import { excali } from '@/fonts';
import { formatZAR } from '@/lib/calculator-utils';
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

        <Suspense
          fallback={<div>Loading TFSA Calculator...</div>}
          name="tfsa-calculator"
        >
          <TFSACalculator />
        </Suspense>

        <div className="mt-10 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-8">
          <h2 className={`${excali.className} mb-4 text-2xl`}>
            Regular Investment vs TFSA: How Your Money Grows (5% Annual Return)
          </h2>

          <div className="mb-6 text-sm text-gray-600">
            <div className="mb-2 font-semibold">
              Assumptions used in this example:
            </div>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                You start with <strong>R0</strong> balance.
              </li>
              <li>
                Contribute <strong>R36 000</strong> each year until you reach
                the <strong>R500 000</strong> TFSA lifetime limit (≈14 years).
              </li>
              <li>
                No more contributions after the lifetime limit is reached.
              </li>
              <li>
                Annual return of <strong>5%</strong>, compounded yearly.
              </li>
              <li>
                Contributions are added at the{' '}
                <strong>start of each year</strong>.
              </li>
              <li>
                The regular account pays <strong>27% capital gains tax</strong>{' '}
                on profits when withdrawn; the TFSA pays <strong>no tax</strong>
                .
              </li>
            </ul>
          </div>

          <p className="mb-4 text-sm text-gray-700">
            Each row below shows what your investment would be worth after a
            given number of years in a regular account versus a TFSA.
          </p>

          <ComparisonTable />

          <p className="my-4 text-sm text-gray-700">
            This comparison shows how a{' '}
            <strong>Tax-Free Savings Account</strong> lets your money compound
            without paying capital gains tax on investment growth. Over time,
            that difference really adds up. After around{' '}
            <strong>40 years</strong>, the TFSA leaves you with about{' '}
            <span className="font-semibold text-green-700">
              R572&nbsp;000 more
            </span>{' '}
            than a regular investment taxed at capital-gains rates — and after
            <strong> 80 years</strong>, the advantage grows to about{' '}
            <span className="font-semibold text-green-700">
              R4.84&nbsp;million
            </span>
            . Assumes the same investment mix and no withdrawals.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Figures assume a steady 5&nbsp;% annual return, meant to reflect
            inflation-adjusted (real) growth, so you&apos;re seeing the tax
            benefit rather than compounding from unrealistic returns. For
            reference, you can view long-term{' '}
            <Link href="/data/cpi">South African CPI data</Link>.
          </p>
        </div>

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

function ComparisonTable() {
  const LIFETIME_CAP = 500_000; // R500,000 TFSA lifetime cap
  const ANNUAL_CONTRIBUTION = 36_000; // R36,000 per year
  const RETURN_RATE = 0.05; // 5% annual return
  const TAX_RATE = 0.27; // 27% CGT on gains for regular account
  const horizons = [10, 20, 30, 40, 50, 60, 70, 80];

  const rows = horizons.map((years) => {
    let balance = 0;
    let totalContributed = 0;

    for (let y = 1; y <= years; y += 1) {
      // Add contribution at the start of the year (until cap reached)
      if (totalContributed < LIFETIME_CAP) {
        const remainingRoom = LIFETIME_CAP - totalContributed;
        const contrib = Math.min(ANNUAL_CONTRIBUTION, remainingRoom);
        balance += contrib;
        totalContributed += contrib;
      }
      // Then grow for the year
      balance *= 1 + RETURN_RATE;
    }

    const tfsaFinal = balance;
    const gain = Math.max(0, balance - totalContributed);
    const taxPaid = TAX_RATE * gain;
    const regularFinal = balance - taxPaid;

    return {
      years,
      regularFinal,
      taxPaid,
      tfsaFinal,
    };
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Years
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              Regular Account (After Tax)
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              TFSA Account (Tax‑Free)
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              Extra Kept (TFSA Advantage)
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {[
            { years: 10, regular: 444274.37, tfsa: 475444.34, diff: 31169.97 },
            { years: 20, regular: 855621.22, tfsa: 987152.36, diff: 131531.14 },
            {
              years: 30,
              regular: 1308816.04,
              tfsa: 1607967.17,
              diff: 299151.13,
            },
            {
              years: 40,
              regular: 2047022.63,
              tfsa: 2619209.09,
              diff: 572186.46,
            },
            {
              years: 50,
              regular: 3249483.4,
              tfsa: 4266415.61,
              diff: 1016932.21,
            },
            {
              years: 60,
              regular: 5208165.27,
              tfsa: 6949541.47,
              diff: 1741376.2,
            },
            {
              years: 70,
              regular: 8398651.65,
              tfsa: 11320070.75,
              diff: 2921419.1,
            },
            {
              years: 80,
              regular: 13595617.77,
              tfsa: 18439202.42,
              diff: 4843584.65,
            },
          ].map((r) => (
            <tr key={r.years}>
              <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-700">
                {r.years}
              </td>
              <td className="px-4 py-3 text-right text-sm font-medium whitespace-nowrap text-gray-900">
                {formatZAR(r.regular)}
              </td>
              <td className="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-700">
                {formatZAR(r.tfsa)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold whitespace-nowrap text-green-700">
                {formatZAR(r.diff)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
