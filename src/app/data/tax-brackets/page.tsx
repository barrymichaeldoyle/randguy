import Link from 'next/link';

import { Breadcrumb } from '@/components/Breadcrumb';
import { excali } from '@/fonts';
import { taxBracketsHistory } from '@/lib/historical-data';

import TaxYearSelector from './_components/TaxYearSelector';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Historical Tax Brackets & Rates - South Africa',
  description:
    "Explore South Africa's income tax brackets from 2015 to present. See how SARS tax rates, thresholds, and rebates have evolved over time.",
  alternates: {
    canonical: '/data/tax-brackets',
  },
  openGraph: {
    title: 'Historical Tax Brackets - South Africa',
    description:
      "Track how South Africa's income tax brackets, rates and rebates have changed since 2015.",
    type: 'website',
    url: '/data/tax-brackets',
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
    title: 'Historical Tax Brackets - South Africa',
    description:
      "Track how South Africa's income tax brackets, rates and rebates have changed since 2015.",
    images: ['/og-image.png'],
  },
};

// Format number as currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function TaxBracketsPage() {
  // Prepare chart data - done server-side
  // Map bracket RANGES (size of each bracket) for stacked visualization
  const thresholdData = taxBracketsHistory.map((year) => {
    const data: { year: string; [key: string]: string | number } = {
      year: year.year,
    };

    // For each bracket, store the SIZE (range) of that bracket
    // This allows for proper stacked bar visualization
    year.brackets.forEach((bracket) => {
      const bracketSize = bracket.max !== null ? bracket.max - bracket.min : 0; // Can't show unlimited brackets

      if (bracketSize > 0) {
        data[`${bracket.rate}%`] = bracketSize;
      }
    });

    return data;
  });

  // Prepare data showing ALL bracket rates over time
  const bracketRatesData = taxBracketsHistory.map((year) => {
    const data: { year: string; [key: string]: string | number } = {
      year: year.year,
    };

    // Add each bracket rate with its position label
    year.brackets.forEach((bracket, index) => {
      // Use percentage as key for consistency
      data[`${bracket.rate}%`] = bracket.rate;
    });

    return data;
  });

  return (
    <main className="flex flex-col items-center pt-8 md:pt-12 px-4 pb-8 md:px-8 flex-1">
      <div className="max-w-6xl w-full">
        <Breadcrumb
          items={[
            { name: 'Home', href: '/' },
            { name: 'Historical Data', href: '/data' },
            { name: 'Tax Brackets' },
          ]}
        />

        <div className="mb-8">
          <h1 className={`${excali.className} text-4xl mb-4`}>
            Historical Tax Brackets
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Explore how SARS income tax brackets and rates have evolved since
            2015. See how tax thresholds, rates, and rebates have changed over
            time.
          </p>
        </div>

        {/* Year Selector and Current Year Brackets */}
        <TaxYearSelector />

        {/* Information Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className={`${excali.className} text-xl mb-3`}>
              Understanding Tax Brackets
            </h3>
            <p className="text-gray-700 text-sm mb-3">
              South Africa uses a progressive tax system. Your income is taxed
              at different rates as it passes through each bracket. For example,
              only the portion of income in a higher bracket is taxed at that
              higher rate.
            </p>
            <p className="text-gray-700 text-sm">
              Use our{' '}
              <Link
                href="/calculators/income-tax"
                className="text-yellow-600 hover:underline font-semibold"
              >
                Income Tax Calculator
              </Link>{' '}
              to see exactly how much tax you&apos;ll pay.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className={`${excali.className} text-xl mb-3`}>
              What are Tax Rebates?
            </h3>
            <p className="text-gray-700 text-sm">
              Tax rebates directly reduce the amount of tax you owe (not your
              taxable income). Everyone gets the primary rebate. If you&apos;re
              65 or older, you get an additional secondary rebate. At 75+, you
              also get the tertiary rebate. These rebates mean you don&apos;t
              pay tax until your income exceeds certain thresholds.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className={`${excali.className} text-xl mb-3`}>
              Key Changes Over Time
            </h3>
            <ul className="text-gray-700 text-sm space-y-2">
              <li>
                <strong>2017/2018:</strong> Introduction of 45% top marginal
                rate for income over R1.5 million
              </li>
              <li>
                <strong>2020/2021:</strong> Significant bracket adjustments to
                offset inflation
              </li>
              <li>
                <strong>2025/2026:</strong> Large increases in thresholds and
                rebates
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className={`${excali.className} text-xl mb-3`}>
              Tax-Free Thresholds for 2025/2026
            </h3>
            <div className="text-gray-700 text-sm space-y-3">
              <p>
                Thanks to rebates, you don&apos;t pay tax until your annual
                income exceeds these amounts:
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-white rounded px-3 py-2">
                  <span className="font-medium">Under 65:</span>
                  <span className="font-bold text-gray-900">R106,084/year</span>
                </div>
                <div className="flex justify-between items-center bg-white rounded px-3 py-2">
                  <span className="font-medium">Age 65-74:</span>
                  <span className="font-bold text-gray-900">R164,530/year</span>
                </div>
                <div className="flex justify-between items-center bg-white rounded px-3 py-2">
                  <span className="font-medium">Age 75+:</span>
                  <span className="font-bold text-gray-900">R183,986/year</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 italic mt-2">
                These are income thresholds, not rebate amounts. See rebates in
                the table above.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className={`${excali.className} text-2xl mb-4`}>
            Primary Rebate History
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            How the primary tax rebate has increased over the years.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Tax Year</th>
                  <th className="text-right py-3 px-4">Primary Rebate</th>
                  <th className="text-right py-3 px-4">Change</th>
                  <th className="text-right py-3 px-4">% Increase</th>
                </tr>
              </thead>
              <tbody>
                {taxBracketsHistory.map((year, index) => {
                  const prevRebate =
                    index > 0
                      ? taxBracketsHistory[index - 1].rebates.primary
                      : year.rebates.primary;
                  const change = year.rebates.primary - prevRebate;
                  const percentChange =
                    prevRebate > 0 ? (change / prevRebate) * 100 : 0;
                  return (
                    <tr key={year.year} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">{year.year}</td>
                      <td className="text-right py-3 px-4">
                        {formatCurrency(year.rebates.primary)}
                      </td>
                      <td className="text-right py-3 px-4">
                        {change === 0 ? (
                          <span className="text-gray-400">-</span>
                        ) : (
                          <span className="text-green-600">
                            +{formatCurrency(change)}
                          </span>
                        )}
                      </td>
                      <td className="text-right py-3 px-4">
                        {percentChange === 0 ? (
                          <span className="text-gray-400">-</span>
                        ) : (
                          <span className="text-green-600">
                            +{percentChange.toFixed(1)}%
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
