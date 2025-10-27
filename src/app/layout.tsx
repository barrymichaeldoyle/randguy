import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
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
  authors: [{ name: 'Rand Guy' }],
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    siteName: 'Rand Guy',
    title: 'Rand Guy | South African Personal Finance',
    description:
      'Making Cents of SA Finance. Practical personal finance advice for everyday South Africans.',
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
    title: 'Rand Guy | South African Personal Finance',
    description:
      'Making Cents of SA Finance. Free financial calculators & investment guides for South Africans.',
    images: ['/og-image.png'],
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

interface FooterLink {
  href: string;
  label: string;
}

interface FooterGroup {
  title: string;
  links: FooterLink[];
}

const footerGroups: FooterGroup[] = [
  {
    title: 'Calculators',
    links: [
      { href: '/calculators/income-tax', label: 'Income Tax Calculator' },
      { href: '/calculators/home-loan', label: 'Home Loan Calculator' },
      { href: '/calculators/ltv', label: 'Loan-to-Value Calculator' },
      { href: '/calculators/tfsa', label: 'TFSA Calculator' },
      { href: '/calculators/interest', label: 'Interest Calculator' },
    ],
  },
  {
    title: 'Historical Data',
    links: [
      { href: '/data/prime-rates', label: 'Prime Rates' },
      { href: '/data/tax-brackets', label: 'Tax Brackets' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/blog', label: 'Blog' },
      { href: '/calculators', label: 'All Calculators' },
      { href: '/data', label: 'All Data' },
    ],
  },
];

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
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
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <h3 className={`${excali.className} text-lg font-bold mb-4`}>
                    {group.title}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6 text-center">
              <div className="mb-4">
                <a
                  href="https://x.com/RandGuyZA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                  aria-label="Follow Rand Guy on X (Twitter)"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Follow @RandGuyZA
                </a>
              </div>
              <div className="text-sm text-gray-700">
                © {new Date().getFullYear()} Rand Guy. Making Cents of SA
                Finance.
              </div>
            </div>
          </div>
        </footer>
        <Analytics mode="auto" />
        <SpeedInsights />
      </body>
    </html>
  );
}
