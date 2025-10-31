import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import './globals.css';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { BASE_URL } from '@/lib/constants';

import { assistant, excali } from '../fonts';

import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

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

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body
        className={`${excali.variable} ${assistant.variable} ${assistant.className} flex min-h-screen flex-col antialiased`}
      >
        <Header />
        <main className="flex flex-1 flex-col items-center" role="main">
          {children}
        </main>
        <Footer />
        <Analytics mode="auto" />
        <SpeedInsights />
      </body>
    </html>
  );
}
