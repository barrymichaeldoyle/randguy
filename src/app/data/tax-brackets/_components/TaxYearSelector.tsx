'use client';

import { useState } from 'react';
import { excali } from '@/fonts';
import { taxBracketsHistory } from '@/lib/historical-data';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';

type Period = 'yearly' | 'monthly';

/**
 * Format a number as currency
 * @param value - The value to format as currency
 * @returns The formatted currency value
 */
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

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
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className={`${excali.className} text-2xl`}>Tax Brackets</h2>
        <div className="flex items-center gap-4">
          {/* Period Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPeriod('yearly')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                period === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
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

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">
                Taxable Income ({isMonthly ? 'Monthly' : 'Annual'})
              </th>
              <th className="text-center py-3 px-4 w-20">Rate</th>
              <th className="text-right py-3 px-4 w-32">Tax on Bracket</th>
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
                  <td className="py-3 px-4">
                    {formatLabel(bracket.label, period)}
                  </td>
                  <td className="text-center py-3 px-4 font-semibold w-20">
                    {bracket.rate}%
                  </td>
                  <td className="text-right py-3 px-4 w-32">
                    {bracket.max !== null
                      ? formatCurrency(taxOnBracket)
                      : 'Variable'}
                  </td>
                </tr>
              );
            }) ?? (
              <tr>
                <td colSpan={3} className="text-center py-3 px-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Rebates */}
      <div>
        <div className="flex items-center justify-between mb-2">
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
        <p className="text-xs text-gray-600 mb-4">
          Rebates are tax credits that reduce your total tax liability. Everyone
          gets the primary rebate. Additional rebates apply based on age.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">Primary Rebate</div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              Under 65
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(selectedYearData?.rebates.primary ?? 0)}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">+ Secondary Rebate</div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              Age 65-74
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(selectedYearData?.rebates.secondary ?? 0)}
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">+ Tertiary Rebate</div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              Age 75+
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(selectedYearData?.rebates.tertiary ?? 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
