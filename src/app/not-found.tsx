import Link from 'next/link';

import { Button } from '@/components/Button';
import { excali } from '@/fonts';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: "Sorry, we couldn't find the page you're looking for.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* 404 Number */}
        <h1
          className={`${excali.className} mb-4 text-8xl font-bold text-yellow-600 sm:text-9xl`}
        >
          404
        </h1>

        {/* Heading */}
        <h2
          className={`${excali.className} mb-4 text-3xl font-bold text-gray-900 sm:text-4xl`}
        >
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mb-8 text-lg text-gray-600">
          Oops! The page you&apos;re looking for doesn&apos;t exist. It might
          have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button href="/" variant="primary" size="lg">
            Go Home
          </Button>
          <Button href="/calculators" variant="secondary" size="lg">
            Browse Calculators
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12">
          <p className="mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase">
            Popular Pages
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/calculators/income-tax"
              className="text-yellow-800 hover:text-yellow-600"
            >
              Income Tax Calculator
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/calculators/tfsa"
              className="text-yellow-800 hover:text-yellow-600"
            >
              TFSA Calculator
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/blog"
              className="text-yellow-800 hover:text-yellow-600"
            >
              Blog
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/data/prime-rates"
              className="text-yellow-800 hover:text-yellow-600"
            >
              Prime Rates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
