"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";

import { excali } from "@/fonts";
import { taxBracketsHistory } from "@/lib/historical-data";

export default function TaxBracketsPage() {
  const [selectedYear, setSelectedYear] = useState(
    taxBracketsHistory[taxBracketsHistory.length - 1].year,
  );

  const selectedYearData = useMemo(
    () => taxBracketsHistory.find((y) => y.year === selectedYear),
    [selectedYear],
  );

  // Prepare data for tax threshold chart (how thresholds have changed)
  const thresholdData = useMemo(() => {
    return taxBracketsHistory.map((year) => ({
      year: year.year,
      firstBracket: year.brackets[0].max || 0,
      secondBracket: year.brackets[1].max || 0,
      thirdBracket: year.brackets[2].max || 0,
      primaryRebate: year.rebates.primary,
    }));
  }, []);

  // Prepare data for top marginal rate over time
  const topRateData = useMemo(() => {
    return taxBracketsHistory.map((year) => ({
      year: year.year,
      topRate: year.brackets[year.brackets.length - 1].rate,
    }));
  }, []);

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
    <main className="flex flex-col items-center pt-8 md:pt-12 px-4 pb-8 md:px-8 flex-1">
      <div className="max-w-6xl w-full">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-yellow-600 transition">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/data" className="hover:text-yellow-600 transition">
                Historical Data
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium" aria-current="page">
              Tax Brackets
            </li>
          </ol>
        </nav>

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

        {/* Tax Threshold Evolution Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className={`${excali.className} text-2xl mb-6`}>
            Tax Threshold Evolution
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            How the upper limits of the first three tax brackets have changed
            over time.
          </p>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={thresholdData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="year"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Line
                  type="monotone"
                  dataKey="firstBracket"
                  name="1st Bracket"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="secondBracket"
                  name="2nd Bracket"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="thirdBracket"
                  name="3rd Bracket"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Marginal Rate Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className={`${excali.className} text-2xl mb-6`}>
            Top Marginal Tax Rate Over Time
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            The highest tax rate applied to top earners.
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topRateData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="year"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  domain={[0, 50]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Top Rate"]}
                />
                <Bar dataKey="topRate" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

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
              Use our{" "}
              <Link
                href="/calculators/income-tax"
                className="text-yellow-600 hover:underline font-semibold"
              >
                Income Tax Calculator
              </Link>{" "}
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
              Tax Threshold for 2025/2026
            </h3>
            <div className="text-gray-700 text-sm space-y-2">
              <p>
                Thanks to rebates, you don&apos;t pay tax until your annual
                income exceeds:
              </p>
              <ul className="space-y-1 ml-4">
                <li>
                  <strong>Under 65:</strong> R106,084
                </li>
                <li>
                  <strong>65-74:</strong> R164,530
                </li>
                <li>
                  <strong>75+:</strong> R183,986
                </li>
              </ul>
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
