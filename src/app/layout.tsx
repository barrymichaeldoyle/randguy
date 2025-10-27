import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PropsWithChildren } from 'react';

import './globals.css';
import { assistant, excali } from '../fonts';
import { Button } from '@/components/Button';
import { BASE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Rand Guy | South African Personal Finance',
    template: '%s | Rand Guy',
  },
  description:
    'Making Cents of SA Finance. Practical personal finance advice for everyday South Africans.',
  keywords: [
    'South African personal finance',
    'investing in South Africa',
    'TFSA',
    'tax-free savings account',
    'ETFs South Africa',
    'wealth building',
  ],
  authors: [{ name: 'Rand Guy' }],
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    siteName: 'Rand Guy',
  },
  twitter: {
    card: 'summary',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <Analytics />
      <body
        className={`${excali.variable} ${assistant.variable} ${assistant.className} antialiased min-h-screen flex flex-col`}
      >
        <header className="sticky top-0 z-50 bg-white flex items-center justify-between px-4 py-2 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/RandGuyLogo.png"
              alt="Rand Guy logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <h1
              className={`${excali.className} text-2xl leading-none text-gray-900 hover:text-yellow-600 transition-colors`}
            >
              Rand Guy
            </h1>
          </Link>
          <nav className="flex items-center gap-2">
            <Button href="/calculators" size="sm">
              Calculators
            </Button>
            <Button href="/data" size="sm">
              Data
            </Button>
            <Button href="/blog" size="sm">
              Blog
            </Button>
          </nav>
        </header>
        {children}
        <footer className="border-t border-gray-200 py-12 mt-auto bg-gray-50">
          <div className="max-w-3xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-32 mb-8">
              {/* Calculators Section */}
              <div>
                <h3 className={`${excali.className} text-lg font-bold mb-4`}>
                  Calculators
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/calculators/income-tax"
                      className="text-gray-600 hover:text-yellow-600 transition-colors"
                    >
                      Income Tax Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calculators/home-loan"
                      className="text-gray-600 hover:text-yellow-600 transition-colors"
                    >
                      Home Loan Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calculators/ltv"
                      className="text-gray-600 hover:text-yellow-600 transition-colors"
                    >
                      Loan-to-Value Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calculators/tfsa"
                      className="text-gray-600 hover:text-yellow-600 transition-colors"
                    >
                      TFSA Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calculators/interest"
                      className="text-gray-600 hover:text-yellow-600 transition-colors"
                    >
                      Interest Calculator
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Historical Data Section */}
              <div>
                <h3 className={`${excali.className} text-lg font-bold mb-4`}>
                  Historical Data
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/data/prime-rates"
                      className="text-gray-600 hover:text-yellow-600 transition-colors"
                    >
                      Prime Rates
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/data/tax-brackets"
                      className="text-gray-600 hover:text-yellow-600 transition-colors"
                    >
                      Tax Brackets
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources Section */}
              <div>
                <h3 className={`${excali.className} text-lg font-bold mb-4`}>
                  Resources
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/blog"
                      className="text-gray-600 hover:text-yellow-600 transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calculators"
                      className="text-gray-600 hover:text-yellow-600 transition-colors"
                    >
                      All Calculators
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/data"
                      className="text-gray-600 hover:text-yellow-600 transition-colors"
                    >
                      All Data
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
              © {new Date().getFullYear()} Rand Guy. Making Cents of SA
              Finance.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
