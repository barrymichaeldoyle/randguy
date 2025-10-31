'use client';

import { useState } from 'react';

import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { excali } from '@/fonts';
import { formatZAR } from '@/lib/calculator-utils';
import { taxBracketsHistory } from '@/lib/historical-data';

type Period = 'yearly' | 'monthly';

/**
 * Format the label based on period
 * @param label - The label to format
 * @param period - The period to format the label for
 * @returns The formatted label
 */
const formatLabel = (label: string, period: Period) => {
  if (period === 'monthly') {
    // Parse the label and divide by 12
    return label.replace(/R([\d,]+)/g, (_, num) => {
      const value = parseInt(num.replace(/,/g, ''));
      return `R${Math.round(value / 12).toLocaleString('en-ZA')}`;
    });
  }
  return label;
};

export default function TaxYearSelector() {
  const [selectedYear, setSelectedYear] = useState(
    taxBracketsHistory[taxBracketsHistory.length - 1].year
  );
  const [period, setPeriod] = useState<Period>('yearly');

  const selectedYearData = taxBracketsHistory.find(
    (y) => y.year === selectedYear
  );

  const isMonthly = period === 'monthly';
  const divisor = isMonthly ? 12 : 1;

  // Create options for the year selector
  const yearOptions = taxBracketsHistory.map((year) => ({
    value: year.year,
    label: year.year,
  }));

  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className={`${excali.className} text-2xl`}>Tax Brackets</h2>
        <div className="flex items-center gap-4">
          {/* Period Toggle */}
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setPeriod('yearly')}
              className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                period === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                period === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="year-select"
              className="text-sm font-medium text-gray-700"
            >
              Year:
            </label>
            <Select
              id="year-select"
              value={selectedYear}
              onChange={setSelectedYear}
              options={yearOptions}
              className="w-auto px-3 py-1.5 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left">
                Taxable Income ({isMonthly ? 'Monthly' : 'Annual'})
              </th>
              <th className="w-20 px-4 py-3 text-center">Rate</th>
              <th className="w-32 px-4 py-3 text-right">Tax on Bracket</th>
            </tr>
          </thead>
          <tbody>
            {selectedYearData?.brackets.map((bracket, index) => {
              const taxOnBracket =
                bracket.max !== null
                  ? ((bracket.max - bracket.min) * bracket.rate) / 100 / divisor
                  : 0;

              return (
                <tr key={index} className="border-b border-gray-100">
                  <td className="px-4 py-3">
                    {formatLabel(bracket.label, period)}
                  </td>
                  <td className="w-20 px-4 py-3 text-center font-semibold">
                    {bracket.rate}%
                  </td>
                  <td className="w-32 px-4 py-3 text-right">
                    {bracket.max !== null
                      ? formatZAR(taxOnBracket)
                      : 'Variable'}
                  </td>
                </tr>
              );
            }) ?? (
              <tr>
                <td colSpan={3} className="px-4 py-3 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Rebates */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className={`${excali.className} text-lg`}>
            Annual Tax Rebates (Tax Credits)
          </h3>
          <Button
            href="/blog/how-to-calculate-your-effective-tax-rate"
            variant="text"
          >
            Learn how rebates work →
          </Button>
        </div>
        <p className="mb-4 text-xs text-gray-600">
          Rebates are tax credits that reduce your total tax liability. Everyone
          gets the primary rebate. Additional rebates apply based on age.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="mb-1 text-xs text-gray-500">Primary Rebate</div>
            <div className="mb-2 text-sm font-medium text-gray-700">
              Under 65
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatZAR(selectedYearData?.rebates.primary ?? 0)}
            </div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="mb-1 text-xs text-gray-500">+ Secondary Rebate</div>
            <div className="mb-2 text-sm font-medium text-gray-700">
              Age 65-74
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatZAR(selectedYearData?.rebates.secondary ?? 0)}
            </div>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <div className="mb-1 text-xs text-gray-500">+ Tertiary Rebate</div>
            <div className="mb-2 text-sm font-medium text-gray-700">
              Age 75+
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatZAR(selectedYearData?.rebates.tertiary ?? 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
