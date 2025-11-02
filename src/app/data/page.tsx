import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/Button';
import { excali } from '@/fonts';
import { BASE_URL, TAGLINE } from '@/lib/constants';
import { DATASETS } from '@/lib/site-data';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Historical Financial Data for South Africa',
  description:
    'Explore historical financial data for South Africa. View prime lending & repo rates, tax brackets, and other important financial trends over time.',
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
        alt: `Rand Guy - ${TAGLINE}`,
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <div className="w-full max-w-4xl px-4 pt-8 pb-8 md:px-8 md:pt-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link href="/" className="transition hover:text-yellow-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium text-gray-900" aria-current="page">
              Historical Data
            </li>
          </ol>
        </nav>

        <div className="mb-12 text-center">
          <Image
            src="/RandGuyLogo.png"
            alt="Rand Guy logo"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className={`${excali.className} mb-4 text-4xl`}>
            Historical Financial Data
          </h1>
          <p className="text-lg text-gray-700">
            Explore how key financial metrics have changed over time in South
            Africa
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          {DATASETS.map((dataset) => (
            <article
              key={dataset.href}
              className="flex h-full flex-col rounded-lg border border-gray-200 p-6 text-center shadow-sm transition-shadow"
            >
              <div className="mb-4 flex flex-col items-center">
                <div className="mb-3 text-5xl" aria-hidden="true">
                  {dataset.icon}
                </div>
                <h2
                  className={`${excali.className} text-2xl font-bold text-gray-900`}
                >
                  {dataset.title}
                </h2>
              </div>
              <p className="mb-6 flex-grow text-gray-700">
                {dataset.description}
              </p>
              <div className="flex justify-center">
                <Button href={dataset.href} variant="primary" size="md">
                  View Data →
                </Button>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-8">
          <h2 className={`${excali.className} mb-4 text-center text-2xl`}>
            Why Historical Data Matters
          </h2>
          <div className="grid gap-6 text-center md:grid-cols-3">
            <div>
              <div className="mb-2 text-3xl">🔍</div>
              <h3 className="mb-2 font-semibold">Understand Trends</h3>
              <p className="text-sm text-gray-700">
                See how financial metrics have evolved and spot long-term
                patterns
              </p>
            </div>
            <div>
              <div className="mb-2 text-3xl">📚</div>
              <h3 className="mb-2 font-semibold">Learn from History</h3>
              <p className="text-sm text-gray-700">
                Context helps you make better financial decisions for the future
              </p>
            </div>
            <div>
              <div className="mb-2 text-3xl">💡</div>
              <h3 className="mb-2 font-semibold">Plan Ahead</h3>
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
    </>
  );
}
