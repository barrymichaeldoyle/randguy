"use client";

import { useMemo, useState } from "react";
import { excali } from "@/fonts";
import { taxBracketsHistory } from "@/lib/historical-data";

export default function TaxYearSelector() {
  const [selectedYear, setSelectedYear] = useState(
    taxBracketsHistory[taxBracketsHistory.length - 1].year,
  );

  const selectedYearData = useMemo(
    () => taxBracketsHistory.find((y) => y.year === selectedYear),
    [selectedYear],
  );

  // Format number as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      {/* Year Selector */}
      <div className="mb-8">
        <label
          htmlFor="year-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Tax Year
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full md:w-64 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          {taxBracketsHistory.map((year) => (
            <option key={year.year} value={year.year}>
              {year.year}
            </option>
          ))}
        </select>
      </div>

      {/* Current Year Brackets */}
      {selectedYearData && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className={`${excali.className} text-2xl mb-4`}>
            Tax Brackets for {selectedYearData.year}
          </h2>

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
                {selectedYearData.brackets.map((bracket, index) => {
                  const taxOnBracket =
                    bracket.max !== null
                      ? ((bracket.max - bracket.min) * bracket.rate) / 100
                      : 0;
                  return (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4">{bracket.label}</td>
                      <td className="text-center py-3 px-4 font-semibold">
                        {bracket.rate}%
                      </td>
                      <td className="text-right py-3 px-4">
                        {bracket.max !== null
                          ? formatCurrency(taxOnBracket)
                          : "Variable"}
                      </td>
                    </tr>
                  );
                })}
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
                {formatCurrency(selectedYearData.rebates.primary)}
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">
                Secondary Rebate (65-74)
              </div>
              <div className={`${excali.className} text-2xl text-gray-900`}>
                {formatCurrency(selectedYearData.rebates.secondary)}
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">
                Tertiary Rebate (75+)
              </div>
              <div className={`${excali.className} text-2xl text-gray-900`}>
                {formatCurrency(selectedYearData.rebates.tertiary)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
