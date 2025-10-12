"use client";

import { useState } from "react";
import { excali } from "@/fonts";
import { Button } from "@/components/Button";

// South African Tax Data by Year
type TaxYear = "2024/2025" | "2025/2026";

interface TaxYearData {
  brackets: Array<{
    min: number;
    max: number;
    rate: number;
    base: number;
  }>;
  rebates: {
    primary: number;
    secondary: number; // Age 65-74
    tertiary: number; // Age 75+
  };
  thresholds: {
    under65: number;
    age65to74: number;
    age75plus: number;
  };
}

const TAX_DATA: Record<TaxYear, TaxYearData> = {
  "2024/2025": {
    brackets: [
      { min: 0, max: 237100, rate: 0.18, base: 0 },
      { min: 237101, max: 370500, rate: 0.26, base: 42678 },
      { min: 370501, max: 512800, rate: 0.31, base: 77362 },
      { min: 512801, max: 673000, rate: 0.36, base: 121475 },
      { min: 673001, max: 857900, rate: 0.39, base: 179147 },
      { min: 857901, max: 1817000, rate: 0.41, base: 251258 },
      { min: 1817001, max: Infinity, rate: 0.45, base: 644489 },
    ],
    rebates: {
      primary: 17235,
      secondary: 9444,
      tertiary: 3145,
    },
    thresholds: {
      under65: 95750,
      age65to74: 148217,
      age75plus: 165689,
    },
  },
  "2025/2026": {
    brackets: [
      { min: 0, max: 237100, rate: 0.18, base: 0 },
      { min: 237101, max: 370500, rate: 0.26, base: 42678 },
      { min: 370501, max: 512800, rate: 0.31, base: 77362 },
      { min: 512801, max: 673000, rate: 0.36, base: 121475 },
      { min: 673001, max: 857900, rate: 0.39, base: 179147 },
      { min: 857901, max: 1817000, rate: 0.41, base: 251258 },
      { min: 1817001, max: Infinity, rate: 0.45, base: 644489 },
    ],
    rebates: {
      primary: 17235,
      secondary: 9444,
      tertiary: 3145,
    },
    thresholds: {
      under65: 95750,
      age65to74: 148217,
      age75plus: 165689,
    },
  },
};

function calculateIncomeTax(
  annualIncome: number,
  age: number,
  taxYear: TaxYear,
): {
  taxableIncome: number;
  taxBeforeRebates: number;
  rebates: number;
  taxPayable: number;
  effectiveRate: number;
  marginalRate: number;
  monthlyTax: number;
  takeHomePay: number;
  monthlyTakeHome: number;
} {
  const yearData = TAX_DATA[taxYear];

  // Calculate tax before rebates
  let taxBeforeRebates = 0;
  for (const bracket of yearData.brackets) {
    if (annualIncome > bracket.min) {
      const taxableInBracket = Math.min(
        annualIncome - bracket.min + 1,
        bracket.max - bracket.min + 1,
      );
      taxBeforeRebates = bracket.base + taxableInBracket * bracket.rate;
    }
  }

  // Calculate rebates based on age
  let rebates = yearData.rebates.primary;
  if (age >= 75) {
    rebates += yearData.rebates.secondary + yearData.rebates.tertiary;
  } else if (age >= 65) {
    rebates += yearData.rebates.secondary;
  }

  // Calculate tax payable (cannot be negative)
  const taxPayable = Math.max(0, taxBeforeRebates - rebates);

  // Calculate marginal rate (highest bracket reached)
  let marginalRate = 0;
  for (const bracket of yearData.brackets) {
    if (annualIncome >= bracket.min) {
      marginalRate = bracket.rate;
    }
  }

  // Calculate effective rate
  const effectiveRate = annualIncome > 0 ? taxPayable / annualIncome : 0;

  return {
    taxableIncome: annualIncome,
    taxBeforeRebates,
    rebates,
    taxPayable,
    effectiveRate,
    marginalRate,
    monthlyTax: taxPayable / 12,
    takeHomePay: annualIncome - taxPayable,
    monthlyTakeHome: (annualIncome - taxPayable) / 12,
  };
}

type AgeGroup = "under65" | "65to74" | "75plus";

export default function IncomeTaxCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("under65");
  const [taxYear, setTaxYear] = useState<TaxYear>("2025/2026");
  const [results, setResults] = useState<ReturnType<
    typeof calculateIncomeTax
  > | null>(null);

  const handleCalculate = () => {
    const income = parseFloat(monthlyIncome.replace(/,/g, ""));

    if (isNaN(income) || income < 0) {
      alert("Please enter a valid monthly income");
      return;
    }

    // Convert age group to a representative age for calculation
    const ageMap: Record<AgeGroup, number> = {
      under65: 35,
      "65to74": 70,
      "75plus": 80,
    };

    // Convert monthly to annual for tax calculation
    const annualIncome = income * 12;
    const calculatedResults = calculateIncomeTax(
      annualIncome,
      ageMap[ageGroup],
      taxYear,
    );
    setResults(calculatedResults);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${(rate * 100).toFixed(2)}%`;
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (value === "" || !isNaN(parseFloat(value))) {
      setMonthlyIncome(value);
    }
  };

  const displayIncome = monthlyIncome
    ? parseFloat(monthlyIncome).toLocaleString("en-ZA")
    : "";

  return (
    <main className="flex flex-col items-center pt-12 p-8 flex-1">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-8">
          <h1 className={`${excali.className} text-4xl mb-4`}>
            Income Tax Calculator
          </h1>
          <p className="text-lg text-gray-700">
            Calculate your South African income tax
          </p>
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
          {/* Input Form - Left Side */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm lg:sticky lg:top-8">
            <h2 className={`${excali.className} text-2xl mb-6`}>
              Your Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Year
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="taxYear"
                      value="2025/2026"
                      checked={taxYear === "2025/2026"}
                      onChange={(e) => setTaxYear(e.target.value as TaxYear)}
                      className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                    />
                    <span className="ml-2 text-sm text-gray-900">
                      2025/2026
                    </span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="taxYear"
                      value="2024/2025"
                      checked={taxYear === "2024/2025"}
                      onChange={(e) => setTaxYear(e.target.value as TaxYear)}
                      className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                    />
                    <span className="ml-2 text-sm text-gray-900">
                      2024/2025
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="income"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Monthly Gross Income (before tax)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    R
                  </span>
                  <input
                    type="text"
                    id="income"
                    value={displayIncome}
                    onChange={handleIncomeChange}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Group
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="ageGroup"
                      value="under65"
                      checked={ageGroup === "under65"}
                      onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                      className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                    />
                    <span className="ml-2 text-sm text-gray-900">Under 65</span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="ageGroup"
                      value="65to74"
                      checked={ageGroup === "65to74"}
                      onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                      className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                    />
                    <span className="ml-2 text-sm text-gray-900">65-74</span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="ageGroup"
                      value="75plus"
                      checked={ageGroup === "75plus"}
                      onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                      className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                    />
                    <span className="ml-2 text-sm text-gray-900">75+</span>
                  </label>
                </div>
              </div>

              <Button onClick={handleCalculate} className="w-full" size="lg">
                Calculate Tax
              </Button>
            </div>
          </div>

          {/* Results - Right Side */}
          <div className="min-h-[400px]">
            {results && (
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <h2 className={`${excali.className} text-2xl mb-6`}>
                  Your Tax Breakdown
                </h2>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left Column: Primary Monthly Results */}
                  <div className="space-y-4">
                    <h3
                      className={`${excali.className} text-xl text-gray-700 mb-4`}
                    >
                      Monthly Summary
                    </h3>

                    <div className="flex flex-col gap-4">
                      <div className="bg-green-50 rounded-lg p-5 border-2 border-green-200">
                        <span className="text-sm text-gray-600 block mb-1">
                          Take-Home Pay
                        </span>
                        <span
                          className={`${excali.className} text-4xl text-green-700 block`}
                        >
                          {formatCurrency(results.monthlyTakeHome)}
                        </span>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
                        <span className="text-sm text-gray-600 block mb-1">
                          Tax Deducted
                        </span>
                        <span
                          className={`${excali.className} text-3xl text-gray-900 block`}
                        >
                          {formatCurrency(results.monthlyTax)}
                        </span>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <span className="text-sm text-gray-600 block mb-1">
                          Gross Income
                        </span>
                        <span
                          className={`${excali.className} text-3xl text-gray-900 block`}
                        >
                          {formatCurrency(results.taxableIncome / 12)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">
                          Effective Rate
                        </p>
                        <p
                          className={`${excali.className} text-xl text-gray-900`}
                        >
                          {formatPercentage(results.effectiveRate)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">
                          Marginal Rate
                        </p>
                        <p
                          className={`${excali.className} text-xl text-gray-900`}
                        >
                          {formatPercentage(results.marginalRate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Annual Details */}
                  <div className="space-y-4">
                    <h3
                      className={`${excali.className} text-xl text-gray-700 mb-4`}
                    >
                      Annual Breakdown
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600">Gross Income</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(results.taxableIncome)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600">
                          Tax Before Rebates
                        </span>
                        <span className="text-gray-700">
                          {formatCurrency(results.taxBeforeRebates)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600">Tax Rebates</span>
                        <span className="text-green-600 font-medium">
                          -{formatCurrency(results.rebates)}
                        </span>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">
                            Tax Payable
                          </span>
                          <span
                            className={`${excali.className} text-2xl text-gray-900`}
                          >
                            {formatCurrency(results.taxPayable)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">
                            Take-Home Pay
                          </span>
                          <span
                            className={`${excali.className} text-2xl text-green-700`}
                          >
                            {formatCurrency(results.takeHomePay)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!results && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg">
                  Enter your monthly income and age group, then click Calculate
                  Tax to see your results
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className={`${excali.className} text-xl mb-3 text-blue-900`}>
            About This Calculator
          </h3>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>
              • Based on official SARS tax brackets and rebates for the selected
              tax year
            </li>
            <li>
              • Note: Tax brackets remained unchanged from 2024/2025 to
              2025/2026, which may result in "bracket creep" as inflation pushes
              salaries into higher brackets
            </li>
            <li>• Includes age-based rebates (65+ and 75+)</li>
            <li>
              • Does not include medical aid credits, retirement fund
              contributions, or other deductions
            </li>
            <li>
              • For informational purposes only - consult a tax professional for
              accurate advice
            </li>
          </ul>
        </div>

        <div className="text-center mt-8">
          <Button href="/" variant="secondary">
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
