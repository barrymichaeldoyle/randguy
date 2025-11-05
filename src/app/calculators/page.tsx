import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/Button';
import { excali } from '@/fonts';
import { BASE_URL, TAGLINE, TWITTER_HANDLE } from '@/lib/constants';
import { CALCULATORS } from '@/lib/site-data';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Financial Calculators for South Africans',
  description:
    'Free South African financial calculators: income tax, bond repayments, TFSA growth, interest and more — fast, accurate, and mobile friendly.',
  alternates: {
    canonical: '/calculators',
  },
  openGraph: {
    title: 'Free Financial Calculators for South Africans',
    description:
      'Free South African financial calculators for income tax, bond repayments, TFSA growth, interest and more.',
    type: 'website',
    url: '/calculators',
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
    title: 'Free Financial Calculators for South Africans',
    description:
      'Free South African financial calculators: income tax, bond repayments, TFSA growth, interest and more — fast, accurate, and mobile friendly.',
    images: ['/og-image.png'],
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
};

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
      itemListElement: CALCULATORS.map((calc, index) => ({
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
              Calculators
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
            South African Financial Calculators
          </h1>
          <p className="text-lg text-gray-700">
            Free online tools to help you make informed financial decisions
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          {CALCULATORS.map((calculator) => (
            <article
              key={calculator.href}
              className="flex h-full flex-col rounded-lg border border-gray-200 p-6 text-center shadow-sm transition-shadow"
            >
              <div className="mb-4 flex flex-col items-center">
                <div className="mb-3 text-5xl" aria-hidden="true">
                  {calculator.icon}
                </div>
                <h2
                  className={`${excali.className} text-2xl font-bold text-gray-900`}
                >
                  {calculator.title}
                </h2>
              </div>
              <p className="mb-6 flex-grow text-gray-700">
                {calculator.description}
              </p>
              <div className="flex justify-center">
                <Button href={calculator.href} variant="primary" size="md">
                  {calculator.buttonText}
                </Button>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-8">
          <h2 className={`${excali.className} mb-4 text-center text-2xl`}>
            Why Use These Calculators?
          </h2>
          <div className="grid gap-6 text-center md:grid-cols-3">
            <div>
              <div className="mb-2 text-3xl">🇿🇦</div>
              <h3 className="mb-2 font-semibold">Built for South Africans</h3>
              <p className="text-sm text-gray-700">
                All calculators use <strong>official SARS data</strong> and SA
                tax regulations
              </p>
            </div>
            <div>
              <div className="mb-2 text-3xl">💯</div>
              <h3 className="mb-2 font-semibold">Always Free</h3>
              <p className="text-sm text-gray-700">
                No hidden fees, no sign-ups required. Just simple, free tools
              </p>
            </div>
            <div>
              <div className="mb-2 text-3xl">🔒</div>
              <h3 className="mb-2 font-semibold">Privacy First</h3>
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
    </>
  );
}
