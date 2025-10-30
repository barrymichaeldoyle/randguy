'use client';

import { useEffect, useRef } from 'react';

import { excali } from '@/fonts';
import { Button } from '@/components/Button';
import { NumericInput } from '@/components/NumericInput';
import { FormField } from '@/components/FormField';
import { ResultCard, ResultCardItem } from '@/components/ResultCard';
import { Select } from '@/components/Select';
import { formatCurrency, formatPercentage } from '@/lib/calculator-utils';

import { useIncomeTaxStore } from './income-tax-store';

// South African Tax Data by Year
type TaxYear =
  | '2021/2022'
  | '2022/2023'
  | '2023/2024'
  | '2024/2025'
  | '2025/2026';

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

const TAX_DATA: Record<TaxYear | '2020/2021', TaxYearData> = {
  '2020/2021': {
    brackets: [
      { min: 0, max: 205900, rate: 0.18, base: 0 },
      { min: 205901, max: 321600, rate: 0.26, base: 37062 },
      { min: 321601, max: 445100, rate: 0.31, base: 67144 },
      { min: 445101, max: 584200, rate: 0.36, base: 105429 },
      { min: 584201, max: 744800, rate: 0.39, base: 155505 },
      { min: 744801, max: 1577300, rate: 0.41, base: 218139 },
      { min: 1577301, max: Infinity, rate: 0.45, base: 559464 },
    ],
    rebates: {
      primary: 14958,
      secondary: 8199,
      tertiary: 2736,
    },
    thresholds: {
      under65: 83100,
      age65to74: 128650,
      age75plus: 143850,
    },
  },
  '2021/2022': {
    brackets: [
      { min: 0, max: 216200, rate: 0.18, base: 0 },
      { min: 216201, max: 337800, rate: 0.26, base: 38916 },
      { min: 337801, max: 467500, rate: 0.31, base: 70532 },
      { min: 467501, max: 613600, rate: 0.36, base: 110739 },
      { min: 613601, max: 782200, rate: 0.39, base: 163335 },
      { min: 782201, max: 1656600, rate: 0.41, base: 229089 },
      { min: 1656601, max: Infinity, rate: 0.45, base: 587593 },
    ],
    rebates: {
      primary: 15714,
      secondary: 8613,
      tertiary: 2871,
    },
    thresholds: {
      under65: 87300,
      age65to74: 135150,
      age75plus: 151100,
    },
  },
  '2022/2023': {
    brackets: [
      { min: 0, max: 226000, rate: 0.18, base: 0 },
      { min: 226001, max: 353100, rate: 0.26, base: 40680 },
      { min: 353101, max: 488700, rate: 0.31, base: 73726 },
      { min: 488701, max: 641400, rate: 0.36, base: 115762 },
      { min: 641401, max: 817600, rate: 0.39, base: 170734 },
      { min: 817601, max: 1731600, rate: 0.41, base: 239452 },
      { min: 1731601, max: Infinity, rate: 0.45, base: 614192 },
    ],
    rebates: {
      primary: 16425,
      secondary: 9000,
      tertiary: 2997,
    },
    thresholds: {
      under65: 91250,
      age65to74: 141250,
      age75plus: 157900,
    },
  },
  '2023/2024': {
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
  '2024/2025': {
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
  '2025/2026': {
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

// Helper to get previous tax year
const PREVIOUS_YEAR: Record<TaxYear, (TaxYear | '2020/2021') | null> = {
  '2021/2022': '2020/2021',
  '2022/2023': '2021/2022',
  '2023/2024': '2022/2023',
  '2024/2025': '2023/2024',
  '2025/2026': '2024/2025',
};

// UIF (Unemployment Insurance Fund) constants
const UIF_RATE = 0.01; // 1% employee contribution
const UIF_MAX_MONTHLY_INCOME = 17712; // Maximum monthly income for UIF

function calculateIncomeTax(
  annualIncome: number,
  age: number,
  taxYear: TaxYear | '2020/2021',
  isSalary: boolean = false
): {
  taxableIncome: number;
  taxBeforeRebates: number;
  rebates: number;
  taxPayable: number;
  effectiveRate: number;
  marginalRate: number;
  monthlyTax: number;
  uifMonthly: number;
  uifAnnual: number;
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
        bracket.max - bracket.min + 1
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

  // Calculate UIF if this is salary income
  const monthlyIncome = annualIncome / 12;
  const uifMonthly = isSalary
    ? Math.min(monthlyIncome, UIF_MAX_MONTHLY_INCOME) * UIF_RATE
    : 0;
  const uifAnnual = uifMonthly * 12;

  return {
    taxableIncome: annualIncome,
    taxBeforeRebates,
    rebates,
    taxPayable,
    effectiveRate,
    marginalRate,
    monthlyTax: taxPayable / 12,
    uifMonthly,
    uifAnnual,
    takeHomePay: annualIncome - taxPayable - uifAnnual,
    monthlyTakeHome: (annualIncome - taxPayable - uifAnnual) / 12,
  };
}

type AgeGroup = 'under65' | '65to74' | '75plus';
type PayFrequency = 'monthly' | 'annual' | 'biweekly' | 'weekly';

export default function IncomeTaxCalculator() {
  const {
    income,
    payFrequency,
    ageGroup,
    taxYear,
    isSalary,
    isAdvancedMode,
    results,
    isDirty,
    setIncome,
    setPayFrequency,
    setAgeGroup,
    setTaxYear,
    setIsSalary,
    setIsAdvancedMode,
    setResults,
    setIsDirty,
    resetForm,
  } = useIncomeTaxStore();

  const previousFrequency = useRef<PayFrequency>('monthly');
  const incomeByFrequency = useRef<Record<PayFrequency, string>>({
    monthly: '',
    annual: '',
    biweekly: '',
    weekly: '',
  });

  // Convert income when pay frequency changes
  useEffect(() => {
    if (previousFrequency.current !== payFrequency) {
      // Check if we have a saved value for this frequency
      if (incomeByFrequency.current[payFrequency]) {
        setIncome(incomeByFrequency.current[payFrequency]);
      } else if (income) {
        // Convert from previous frequency
        const incomeValue = parseFloat(income.replace(/,/g, ''));

        if (!isNaN(incomeValue) && incomeValue > 0) {
          const frequencyMultiplier: Record<PayFrequency, number> = {
            monthly: 12,
            annual: 1,
            biweekly: 26,
            weekly: 52,
          };

          // Convert to annual first
          const annualAmount =
            incomeValue * frequencyMultiplier[previousFrequency.current];
          // Then convert to new frequency
          const newAmount = annualAmount / frequencyMultiplier[payFrequency];

          const convertedValue = Math.round(newAmount).toString();
          setIncome(convertedValue);
          incomeByFrequency.current[payFrequency] = convertedValue;
        }
      }

      previousFrequency.current = payFrequency;
    }
  }, [payFrequency, income, setIncome]);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    const incomeValue = parseFloat(income.replace(/,/g, ''));

    if (isNaN(incomeValue) || incomeValue < 0) {
      alert('Please enter a valid income amount');
      return;
    }

    // Convert age group to a representative age for calculation
    const ageMap: Record<AgeGroup, number> = {
      under65: 35,
      '65to74': 70,
      '75plus': 80,
    };

    // Convert to annual income based on pay frequency
    const frequencyMultiplier: Record<PayFrequency, number> = {
      monthly: 12,
      annual: 1,
      biweekly: 26,
      weekly: 52,
    };

    const annualIncome = incomeValue * frequencyMultiplier[payFrequency];
    const calculatedResults = calculateIncomeTax(
      annualIncome,
      ageMap[ageGroup],
      taxYear,
      isSalary
    );

    // Calculate previous year for comparison if available
    const prevYear = PREVIOUS_YEAR[taxYear];
    const prevYearResults = prevYear
      ? calculateIncomeTax(annualIncome, ageMap[ageGroup], prevYear, isSalary)
      : null;

    setResults({
      ...calculatedResults,
      previousYear: prevYear,
      previousYearResults: prevYearResults,
    });
    setIsDirty(false); // Mark as clean after successful calculation

    // Scroll to results on mobile
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const handleIncomeChange = (value: string) => {
    setIncome(value);
    // Clear all saved values except the current frequency
    // This ensures conversions are based on the latest edited value
    incomeByFrequency.current = {
      monthly: '',
      annual: '',
      biweekly: '',
      weekly: '',
    };
    incomeByFrequency.current[payFrequency] = value;
  };

  const getIncomeLabel = () => {
    switch (payFrequency) {
      case 'monthly':
        return 'Monthly Gross Income (before tax)';
      case 'annual':
        return 'Annual Gross Income (before tax)';
      case 'biweekly':
        return 'Bi-weekly Gross Income (before tax)';
      case 'weekly':
        return 'Weekly Gross Income (before tax)';
    }
  };

  const toggleMode = () => {
    if (isAdvancedMode) {
      // Switching to basic mode - reset to defaults
      setTaxYear('2025/2026');
      setAgeGroup('under65');
      setIsSalary(true);
    }
    setIsAdvancedMode(!isAdvancedMode);
  };

  const handleResetForm = () => {
    resetForm();
    // Reset refs
    previousFrequency.current = 'monthly';
    incomeByFrequency.current = {
      monthly: '',
      annual: '',
      biweekly: '',
      weekly: '',
    };
  };

  return (
    <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
      {/* Input Form - Left Side */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-8 shadow-sm lg:sticky lg:top-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`${excali.className} text-2xl`}>Your Information</h2>
          <Button onClick={toggleMode} variant="text" size="sm">
            {isAdvancedMode ? 'Switch to Basic' : 'Advanced Options'}
          </Button>
        </div>

        <div className="space-y-6">
          {isAdvancedMode && (
            <FormField label="Tax Year" htmlFor="taxYear">
              <Select
                id="taxYear"
                value={taxYear}
                onChange={setTaxYear}
                options={[
                  { value: '2025/2026', label: '2026 (Mar 2025 - Feb 2026)' },
                  { value: '2024/2025', label: '2025 (Mar 2024 - Feb 2025)' },
                  { value: '2023/2024', label: '2024 (Mar 2023 - Feb 2024)' },
                  { value: '2022/2023', label: '2023 (Mar 2022 - Feb 2023)' },
                  { value: '2021/2022', label: '2022 (Mar 2021 - Feb 2022)' },
                ]}
              />
            </FormField>
          )}

          <FormField label={getIncomeLabel()} htmlFor="income">
            <div className="flex gap-2">
              <div className="flex-1">
                <NumericInput
                  id="income"
                  value={income}
                  onChange={handleIncomeChange}
                  placeholder="0"
                  prefix="R"
                />
              </div>
              <Select
                value={payFrequency}
                onChange={setPayFrequency}
                options={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'annual', label: 'Annual' },
                  { value: 'biweekly', label: 'Bi-weekly' },
                  { value: 'weekly', label: 'Weekly' },
                ]}
                className="w-30"
              />
            </div>
          </FormField>

          {isAdvancedMode && (
            <>
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
                      checked={ageGroup === 'under65'}
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
                      checked={ageGroup === '65to74'}
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
                      checked={ageGroup === '75plus'}
                      onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                      className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                    />
                    <span className="ml-2 text-sm text-gray-900">75+</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Income Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="incomeType"
                      value="salary"
                      checked={isSalary}
                      onChange={() => setIsSalary(true)}
                      className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                    />
                    <span className="ml-2 text-sm text-gray-900">
                      Salary (includes UIF)
                    </span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="incomeType"
                      value="other"
                      checked={!isSalary}
                      onChange={() => setIsSalary(false)}
                      className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                    />
                    <span className="ml-2 text-sm text-gray-900">Other</span>
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleCalculate}
              className="w-full"
              size="lg"
              disabled={!isDirty && results !== null}
            >
              {!isDirty && results !== null ? 'Calculated' : 'Calculate Tax'}
            </Button>
            <button
              type="button"
              onClick={handleResetForm}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Reset Form
            </button>
          </div>
        </div>
      </div>

      {/* Results - Right Side */}
      <div ref={resultsRef} className="min-h-[400px]">
        {results && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-8 shadow-sm">
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
                  <ResultCard color="green" variant="highlight">
                    <ResultCardItem
                      label="Take-Home Pay"
                      value={
                        <span className="text-4xl font-bold text-green-700 block">
                          {formatCurrency(results.monthlyTakeHome)}
                        </span>
                      }
                    />
                  </ResultCard>

                  <ResultCard color="yellow">
                    <ResultCardItem
                      label="Tax Deducted"
                      value={
                        <span className="text-3xl font-bold text-gray-900 block">
                          {formatCurrency(results.monthlyTax)}
                        </span>
                      }
                    />
                  </ResultCard>

                  {results.uifMonthly > 0 && (
                    <ResultCard color="blue">
                      <ResultCardItem
                        label="UIF Contribution"
                        value={
                          <span className="text-3xl font-bold text-gray-900 block">
                            {formatCurrency(results.uifMonthly)}
                          </span>
                        }
                      />
                    </ResultCard>
                  )}

                  <ResultCard color="gray">
                    <ResultCardItem
                      label="Gross Income"
                      value={
                        <span className="text-3xl font-bold text-gray-900 block">
                          {formatCurrency(results.taxableIncome / 12)}
                        </span>
                      }
                    />
                  </ResultCard>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Effective Rate</p>
                    <p className="font-bold text-xl text-gray-900">
                      {formatPercentage(results.effectiveRate)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Marginal Rate</p>
                    <p className="font-bold text-xl text-gray-900">
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
                    <span className="text-gray-600">Tax Before Rebates</span>
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

                  {results.uifAnnual > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">UIF Contribution</span>
                      <span className="text-gray-700">
                        {formatCurrency(results.uifAnnual)}
                      </span>
                    </div>
                  )}

                  <ResultCard color="yellow" size="sm" className="mt-4">
                    <ResultCardItem
                      label="Tax Payable"
                      value={
                        <span className="text-2xl font-bold text-gray-900">
                          {formatCurrency(results.taxPayable)}
                        </span>
                      }
                      layout="horizontal"
                    />
                  </ResultCard>

                  <ResultCard color="green" size="sm">
                    <ResultCardItem
                      label="Take-Home Pay"
                      value={
                        <span className="text-2xl font-bold text-green-700">
                          {formatCurrency(results.takeHomePay)}
                        </span>
                      }
                      layout="horizontal"
                    />
                  </ResultCard>
                </div>
              </div>
            </div>

            {/* Year-over-Year Comparison */}
            {results.previousYear && results.previousYearResults && (
              <div className="mt-8 pt-6 border-t-2 border-gray-300">
                <h3
                  className={`${excali.className} text-xl text-gray-700 mb-4`}
                >
                  Comparison vs {results.previousYear}
                </h3>

                {(() => {
                  const annualTakeHomeDiff =
                    results.takeHomePay -
                    results.previousYearResults.takeHomePay;
                  const monthlyTakeHomeDiff =
                    results.monthlyTakeHome -
                    results.previousYearResults.monthlyTakeHome;

                  return (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">
                          Annual Take-Home Change
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            annualTakeHomeDiff > 0
                              ? 'text-green-600'
                              : annualTakeHomeDiff < 0
                                ? 'text-red-600'
                                : 'text-gray-600'
                          }`}
                        >
                          {annualTakeHomeDiff > 0 ? '+' : ''}
                          {formatCurrency(annualTakeHomeDiff)}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">
                          Monthly Take-Home Change
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            monthlyTakeHomeDiff > 0
                              ? 'text-green-600'
                              : monthlyTakeHomeDiff < 0
                                ? 'text-red-600'
                                : 'text-gray-600'
                          }`}
                        >
                          {monthlyTakeHomeDiff > 0 ? '+' : ''}
                          {formatCurrency(monthlyTakeHomeDiff)}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {!results && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <p className="text-gray-500 text-lg">
              Enter your monthly income and age group, then click Calculate Tax
              to see your results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
