'use client';

import { useState } from 'react';
import { excali } from '@/fonts';
import { taxBracketsHistory } from '@/lib/historical-data';

type Period = 'yearly' | 'monthly';

export default function TaxYearSelector() {
  const [selectedYear, setSelectedYear] = useState(
    taxBracketsHistory[taxBracketsHistory.length - 1].year
  );
  const [period, setPeriod] = useState<Period>('yearly');

  const selectedYearData = taxBracketsHistory.find(
    (y) => y.year === selectedYear
  );

  const divisor = period === 'monthly' ? 12 : 1;

  // Format number as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

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
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {taxBracketsHistory.map((year) => (
                <option key={year.year} value={year.year}>
                  {year.year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">Taxable Income</th>
              <th className="text-center py-3 px-4">Rate</th>
              <th className="text-right py-3 px-4">Tax on Bracket</th>
            </tr>
          </thead>
          <tbody>
            {selectedYearData?.brackets.map((bracket, index) => {
              const taxOnBracket =
                bracket.max !== null
                  ? ((bracket.max - bracket.min) * bracket.rate) / 100 / divisor
                  : 0;

              // Format the label based on period
              const formatLabel = (label: string) => {
                if (period === 'monthly') {
                  // Parse the label and divide by 12
                  return label.replace(/R([\d,]+)/g, (match, num) => {
                    const value = parseInt(num.replace(/,/g, ''));
                    return `R${Math.round(value / 12).toLocaleString('en-ZA')}`;
                  });
                }
                return label;
              };

              return (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">{formatLabel(bracket.label)}</td>
                  <td className="text-center py-3 px-4 font-semibold">
                    {bracket.rate}%
                  </td>
                  <td className="text-right py-3 px-4">
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
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">
            Primary Rebate (Under 65)
          </div>
          <div className={`${excali.className} text-2xl text-gray-900`}>
            {formatCurrency(selectedYearData?.rebates.primary ?? 0)}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">
            Secondary Rebate (65-74)
          </div>
          <div className={`${excali.className} text-2xl text-gray-900`}>
            {formatCurrency(selectedYearData?.rebates.secondary ?? 0)}
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">
            Tertiary Rebate (75+)
          </div>
          <div className={`${excali.className} text-2xl text-gray-900`}>
            {formatCurrency(selectedYearData?.rebates.tertiary ?? 0)}
          </div>
        </div>
      </div>
    </div>
  );
}
