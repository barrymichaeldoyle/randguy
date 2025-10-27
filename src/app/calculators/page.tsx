import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';

import { excali } from '@/fonts';
import { BASE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Free Financial Calculators for South Africans',
  description:
    'Free online financial calculators for South Africans. Calculate income tax, SARS deductions, UIF, and more. Simple tools to help you make informed financial decisions.',
  keywords: [
    'financial calculators',
    'South Africa',
    'income tax calculator',
    'SARS calculator',
    'tax calculator',
    'personal finance tools',
    'free calculators',
  ],
  alternates: {
    canonical: '/calculators',
  },
  openGraph: {
    title: 'Free Financial Calculators for South Africans',
    description:
      'Free online financial calculators for South Africans. Calculate income tax, SARS deductions, UIF, and more.',
    type: 'website',
    url: '/calculators',
  },
};

const calculators = [
  {
    title: 'Income Tax Calculator',
    description:
      'Calculate your South African income tax based on the latest tax brackets and rebates for the 2025/2026 tax year. Includes UIF and year-over-year comparisons.',
    href: '/calculators/income-tax',
    icon: '💰',
  },
  {
    title: 'Home Loan Calculator',
    description:
      'Calculate your monthly bond repayments and see total interest, repayment breakdown, and plan your property purchase.',
    href: '/calculators/home-loan',
    icon: '🏠',
  },
  {
    title: 'Loan-to-Value (LTV) Calculator',
    description:
      'Calculate your LTV ratio to understand your equity position and loan terms. Essential tool for property buyers to assess their financing situation.',
    href: '/calculators/ltv',
    icon: '📊',
  },
  {
    title: 'TFSA Calculator',
    description:
      'Calculate how long it will take to max out your Tax-Free Savings Account. Track your contributions and plan your timeline to reach the R500,000 lifetime limit.',
    href: '/calculators/tfsa',
    icon: '🎯',
  },
  {
    title: 'Interest Calculator',
    description:
      'Calculate interest gains across different time periods. Convert between annual, monthly, weekly, daily, and hourly interest rates for investments and loans.',
    href: '/calculators/interest',
    icon: '💹',
  },
  // Add more calculators here in the future
];

export default function CalculatorsPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Financial Calculators',
    description:
      'Free online financial calculators for South Africans. Calculate income tax, SARS deductions, UIF, and more.',
    url: `${BASE_URL}/calculators`,
    inLanguage: 'en-ZA',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: calculators.map((calc, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'WebApplication',
          name: calc.title,
          description: calc.description,
          url: `${BASE_URL}${calc.href}`,
          applicationCategory: 'FinanceApplication',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'ZAR',
          },
        },
      })),
    },
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
      <div className="max-w-4xl w-full">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-yellow-600 transition">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium" aria-current="page">
              Calculators
            </li>
          </ol>
        </nav>

        <div className="text-center mb-12">
          <Image
            src="/RandGuyLogo.png"
            alt="Rand Guy logo"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className={`${excali.className} text-4xl mb-4`}>
            South African Financial Calculators
          </h1>
          <p className="text-lg text-gray-700">
            Free online tools to help you make informed financial decisions
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          {calculators.map((calculator) => (
            <Link
              key={calculator.href}
              href={calculator.href}
              className="group"
            >
              <article className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:border-yellow-400 h-full">
                <div className="flex items-center gap-3">
                  <div className="text-4xl mb-4" aria-hidden="true">
                    {calculator.icon}
                  </div>
                  <h2
                    className={`${excali.className} text-2xl font-bold mb-3 text-gray-900 group-hover:text-yellow-600 transition-colors`}
                  >
                    {calculator.title}
                  </h2>
                </div>
                <p className="text-gray-700 mb-4">{calculator.description}</p>
                <span
                  className={`${excali.className} text-gray-900 group-hover:text-yellow-600 font-medium transition-colors`}
                >
                  Use Calculator →
                </span>
              </article>
            </Link>
          ))}
        </section>

        <section className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-8">
          <h2 className={`${excali.className} text-2xl mb-4 text-center`}>
            Why Use These Calculators?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🇿🇦</div>
              <h3 className="font-semibold mb-2">Built for South Africans</h3>
              <p className="text-sm text-gray-700">
                All calculators use <strong>official SARS data</strong> and SA
                tax regulations
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">💯</div>
              <h3 className="font-semibold mb-2">Always Free</h3>
              <p className="text-sm text-gray-700">
                No hidden fees, no sign-ups required. Just simple, free tools
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-semibold mb-2">Privacy First</h3>
              <p className="text-sm text-gray-700">
                Your data stays on your device. I don&apos;t track or store your
                information
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 text-center">
          <p className="text-gray-600">More calculators coming soon!</p>
        </div>
      </div>
    </main>
  );
}
