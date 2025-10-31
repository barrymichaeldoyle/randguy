import Link from 'next/link';

import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import { excali } from '@/fonts';
import { CPI_DATA_ZA } from '@/lib/historical-data';

import CPIChartClient from './_components/CPIChartClient';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Historical CPI & Inflation Data - South Africa',
  description:
    'Track South African inflation rates and Consumer Price Index (CPI) from 2000 to present. Understand how the cost of living has changed and its impact on your purchasing power.',
  alternates: {
    canonical: '/data/cpi',
  },
  openGraph: {
    title: 'Historical CPI & Inflation Data - South Africa',
    description:
      'Track South African inflation rates and CPI from 2000 to present. Interactive data and analysis.',
    type: 'website',
    url: '/data/cpi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Historical CPI & Inflation Data - South Africa',
    description:
      'Track South African inflation rates and CPI from 2000 to present. Interactive data and analysis.',
  },
};

// Calculate statistics
const inflationRates = CPI_DATA_ZA.map((d) => d.inflationRate);
const currentInflation = inflationRates[0]; // First item is most recent
const avgInflation =
  inflationRates.reduce((a, b) => a + b, 0) / inflationRates.length;
const maxInflation = Math.max(...inflationRates);
const minInflation = Math.min(...inflationRates);

const stats = {
  current: currentInflation,
  average: avgInflation,
  max: maxInflation,
  min: minInflation,
};

// Calculate purchasing power: What R100 in 2000 is worth today
const cpiBase = CPI_DATA_ZA[CPI_DATA_ZA.length - 1].cpiIndex; // 2000
const cpiCurrent = CPI_DATA_ZA[0].cpiIndex; // Current year
const purchasingPower = (cpiBase / cpiCurrent) * 100;

export default function CPIPage() {
  // Prepare chart data
  const chartData = CPI_DATA_ZA.map((item) => ({
    year: item.year,
    inflationRate: item.inflationRate,
    cpiIndex: item.cpiIndex,
  }));

  return (
    <div className="w-full max-w-6xl px-4 pt-8 pb-8 md:px-8 md:pt-12">
      <Breadcrumb
        items={[
          { name: 'Home', href: '/' },
          { name: 'Historical Data', href: '/data' },
          { name: 'CPI & Inflation' },
        ]}
      />

      <div className="mb-8">
        <h1 className={`${excali.className} mb-4 text-4xl`}>
          Consumer Price Index & Inflation
        </h1>
        <p className="mb-2 text-lg text-gray-700">
          Track how South Africa&apos;s inflation rate and Consumer Price Index
          (CPI) have changed since 2000. CPI measures the average change in
          prices over time for goods and services.
        </p>
        <p className="mb-6 text-sm text-gray-600">
          Source: Statistics South Africa (Stats SA). Data represents annual
          inflation rates.
        </p>

        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border-2 border-gray-300 bg-white p-4">
            <div className="mb-1 text-sm text-gray-600">
              Current Inflation Rate
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.current}%
            </div>
            <div className="text-xs text-gray-500">2024</div>
          </div>
          <div className="rounded-lg border-2 border-blue-300 bg-blue-50 p-4">
            <div className="mb-1 text-sm text-blue-900">
              Average (Since 2000)
            </div>
            <div className="text-3xl font-bold text-blue-900">
              {stats.average.toFixed(1)}%
            </div>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="mb-1 text-sm text-gray-600">
              Highest Inflation (Since 2000)
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.max}%</div>
            <div className="text-xs text-gray-500">2008</div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="mb-1 text-sm text-gray-600">
              Lowest Inflation (Since 2000)
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.min}%</div>
            <div className="text-xs text-gray-500">2004</div>
          </div>
        </div>

        {/* Purchasing Power Card */}
        <div className="mb-8 rounded-lg border-2 border-yellow-300 bg-yellow-50 p-6">
          <h2 className={`${excali.className} mb-3 text-2xl`}>
            Purchasing Power
          </h2>
          <p className="mb-4 text-gray-700">
            Due to inflation, R100 in the year 2000 has the same purchasing
            power as approximately{' '}
            <strong className="text-2xl text-yellow-800">
              R{((cpiCurrent / cpiBase) * 100).toFixed(2)}
            </strong>{' '}
            today.
          </p>
          <p className="text-sm text-gray-600">
            Conversely, R100 today would only buy what{' '}
            <strong>R{purchasingPower.toFixed(2)}</strong> could buy in 2000.
            This demonstrates how inflation erodes the value of money over time.
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className={`${excali.className} mb-6 text-2xl`}>
          Inflation Rate & CPI Over Time
        </h2>
        <CPIChartClient chartData={chartData} />
      </div>

      {/* Information Section */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className={`${excali.className} mb-3 text-xl`}>What is CPI?</h3>
          <p className="text-sm text-gray-700">
            The Consumer Price Index (CPI) measures the average change over time
            in the prices paid by consumers for a basket of goods and services.
            It&apos;s the most widely used measure of inflation in South Africa,
            compiled by Statistics South Africa (Stats SA).
          </p>
        </div>

        <div className="rounded-lg border border-purple-200 bg-purple-50 p-6">
          <h3 className={`${excali.className} mb-3 text-xl`}>
            SARB Inflation Target
          </h3>
          <p className="text-sm text-gray-700">
            The South African Reserve Bank (SARB) aims to keep inflation between{' '}
            <strong>3% and 6%</strong> per year. When inflation rises above this
            range, the SARB typically increases interest rates to slow down
            price increases.
          </p>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
          <h3 className={`${excali.className} mb-3 text-xl`}>
            Historical Highlights
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <strong>2008:</strong> Inflation peaked at 11.5% during the global
              financial crisis
            </li>
            <li>
              <strong>2020:</strong> Dropped to 3.3% during COVID-19 pandemic
            </li>
            <li>
              <strong>2022-2023:</strong> Rose to 6-7% due to global supply
              chain issues
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-orange-200 bg-orange-50 p-6">
          <h3 className={`${excali.className} mb-3 text-xl`}>
            Impact on Your Finances
          </h3>
          <p className="text-sm text-gray-700">
            Inflation affects everything from groceries to petrol prices. To
            maintain your purchasing power, your investments should ideally grow
            faster than inflation. Use our{' '}
            <Link
              href="/calculators/tfsa"
              className="font-semibold text-yellow-600 hover:underline"
            >
              TFSA Calculator
            </Link>{' '}
            to see how tax-free savings can help you beat inflation.
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className={`${excali.className} mb-4 text-2xl`}>
          Historical Inflation Data
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-left">Year</th>
                <th className="px-4 py-2 text-right">Inflation Rate</th>
                <th className="px-4 py-2 text-right">CPI Index</th>
                <th className="px-4 py-2 text-right">R100 Equivalent Today</th>
              </tr>
            </thead>
            <tbody>
              {CPI_DATA_ZA.map((item) => {
                const equivalentToday = (cpiCurrent / item.cpiIndex) * 100;

                return (
                  <tr key={item.year} className="border-b border-gray-100">
                    <td className="px-4 py-2">{item.year}</td>
                    <td className="px-4 py-2 text-right font-semibold">
                      {item.inflationRate}%
                    </td>
                    <td className="px-4 py-2 text-right text-gray-600">
                      {item.cpiIndex}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-600">
                      R{equivalentToday.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          *R100 Equivalent shows what R100 from that year would be worth in
          today&apos;s money
        </p>
      </div>

      {/* Call to Action */}
      <div className="rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-8 text-center">
        <h2 className={`${excali.className} mb-3 text-2xl`}>
          Protect Your Wealth from Inflation
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-gray-700">
          Use our calculators to understand how inflation affects your savings
          and investments, and plan strategies to maintain your purchasing
          power.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/calculators/tfsa" variant="primary">
            TFSA Calculator →
          </Button>
          <Button href="/calculators/interest" variant="secondary">
            Interest Calculator
          </Button>
        </div>
      </div>
    </div>
  );
}
