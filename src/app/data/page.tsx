import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { excali } from '@/fonts';
import { BASE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Historical Financial Data for South Africa',
  description:
    'Explore historical financial data for South Africa. View prime lending & repo rates, tax brackets, and other important financial trends over time.',
  keywords: [
    'historical data',
    'South Africa',
    'prime lending rate',
    'tax brackets',
    'SARS',
    'financial history',
    'interest rates',
  ],
  alternates: {
    canonical: '/data',
  },
  openGraph: {
    title: 'Historical Financial Data for South Africa',
    description:
      'Explore historical financial data for South Africa. View prime lending & repo rates, tax brackets, and other important financial trends.',
    type: 'website',
    url: '/data',
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
    title: 'Historical Financial Data for South Africa',
    description:
      'Explore historical financial data for South Africa. View prime lending & repo rates, tax brackets, and other important financial trends.',
    images: ['/og-image.png'],
  },
};

const datasets = [
  {
    title: 'Prime & Repo Rates',
    description:
      'Historical South African prime lending & repo rates from major banks. Track how interest rates have changed over the decades and understand their impact on loans and mortgages.',
    href: '/data/prime-rates',
    icon: '📈',
  },
  {
    title: 'Tax Brackets History',
    description:
      'See how SARS income tax brackets and rates have evolved over time. Compare historical tax thresholds and understand how tax policy has changed.',
    href: '/data/tax-brackets',
    icon: '📊',
  },
  // Add more datasets here in the future
];

export default function DataPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Historical Financial Data',
    description:
      'Historical financial data visualizations for South Africa including prime rates, tax brackets, and more.',
    url: `${BASE_URL}/data`,
    inLanguage: 'en-ZA',
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
        name: 'Historical Data',
        item: `${BASE_URL}/data`,
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
              Historical Data
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
            Historical Financial Data
          </h1>
          <p className="text-lg text-gray-700">
            Explore how key financial metrics have changed over time in South
            Africa
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          {datasets.map((dataset) => (
            <Link key={dataset.href} href={dataset.href} className="group">
              <article className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:border-yellow-400 h-full">
                <div className="flex items-center gap-3">
                  <div className="text-4xl mb-4" aria-hidden="true">
                    {dataset.icon}
                  </div>
                  <h2
                    className={`${excali.className} text-2xl font-bold mb-3 text-gray-900 group-hover:text-yellow-600 transition-colors`}
                  >
                    {dataset.title}
                  </h2>
                </div>
                <p className="text-gray-700 mb-4">{dataset.description}</p>
                <span
                  className={`${excali.className} text-gray-900 group-hover:text-yellow-600 font-medium transition-colors`}
                >
                  View Data →
                </span>
              </article>
            </Link>
          ))}
        </section>

        <section className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-8">
          <h2 className={`${excali.className} text-2xl mb-4 text-center`}>
            Why Historical Data Matters
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-semibold mb-2">Understand Trends</h3>
              <p className="text-sm text-gray-700">
                See how financial metrics have evolved and spot long-term
                patterns
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-semibold mb-2">Learn from History</h3>
              <p className="text-sm text-gray-700">
                Context helps you make better financial decisions for the future
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">💡</div>
              <h3 className="font-semibold mb-2">Plan Ahead</h3>
              <p className="text-sm text-gray-700">
                Historical data helps you understand what&apos;s normal and
                what&apos;s not
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 text-center">
          <p className="text-gray-600">More datasets coming soon!</p>
        </div>
      </div>
    </main>
  );
}
