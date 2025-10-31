'use client';

import { useRef, useEffect } from 'react';

import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { NumericInput } from '@/components/NumericInput';
import { Select } from '@/components/Select';
import { excali } from '@/fonts';
import { formatZAR } from '@/lib/calculator-utils';

import {
  useInterestStore,
  type InterestPeriod,
  type InterestType,
  type CompoundingFrequency,
} from './interest-store';

// Convert any period rate to annual rate
function convertToAnnualRate(rate: number, period: InterestPeriod): number {
  switch (period) {
    case 'annual':
      return rate;
    case 'monthly':
      return rate * 12;
    case 'weekly':
      return rate * 52;
    case 'daily':
      return rate * 365;
    case 'hourly':
      return rate * 365 * 24;
    default:
      return rate;
  }
}

// Calculate compound interest with different frequencies
function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  time: number,
  frequency: CompoundingFrequency
): number {
  const r = annualRate / 100; // Convert to decimal

  if (frequency === 'continuously') {
    // A = Pe^(rt) - Continuous compounding
    return principal * Math.exp(r * time);
  } else {
    // A = P(1 + r/n)^(nt) - Periodic compounding
    let n: number;
    switch (frequency) {
      case 'annually':
        n = 1;
        break;
      case 'semi-annually':
        n = 2;
        break;
      case 'quarterly':
        n = 4;
        break;
      case 'monthly':
        n = 12;
        break;
      case 'weekly':
        n = 52;
        break;
      case 'daily':
        n = 365;
        break;
      case 'hourly':
        n = 365 * 24; // 8,760 times per year
        break;
      default:
        n = 12;
    }
    return principal * Math.pow(1 + r / n, n * time);
  }
}

const periodOptions: { value: InterestPeriod; label: string }[] = [
  { value: 'annual', label: 'Annual' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily' },
  { value: 'hourly', label: 'Hourly' },
];

const interestTypeOptions: { value: InterestType; label: string }[] = [
  {
    value: 'compound-continuously',
    label: 'Compound Interest (Continuously)',
  },
  { value: 'compound-hourly', label: 'Compound Interest (Hourly)' },
  { value: 'compound-daily', label: 'Compound Interest (Daily)' },
  { value: 'compound-weekly', label: 'Compound Interest (Weekly)' },
  { value: 'compound-monthly', label: 'Compound Interest (Monthly)' },
  { value: 'compound-quarterly', label: 'Compound Interest (Quarterly)' },
  {
    value: 'compound-semi-annually',
    label: 'Compound Interest (Semi-Annually)',
  },
  { value: 'compound-annually', label: 'Compound Interest (Annually)' },
  { value: 'simple', label: 'Simple Interest' },
];

export default function InterestCalculator() {
  const {
    principal,
    interestRate,
    inputPeriod,
    interestType,
    results,
    isDirty,
    setPrincipal,
    setInterestRate,
    setInputPeriod,
    setInterestType,
    setResults,
    setIsDirty,
    resetForm,
  } = useInterestStore();

  const previousPeriod = useRef<InterestPeriod>('annual');
  const rateByPeriod = useRef<Record<InterestPeriod, string>>({
    annual: '',
    monthly: '',
    weekly: '',
    daily: '',
    hourly: '',
  });

  // Convert rate when period changes
  useEffect(() => {
    if (previousPeriod.current !== inputPeriod) {
      // Check if we have a saved value for this period
      if (rateByPeriod.current[inputPeriod]) {
        setInterestRate(rateByPeriod.current[inputPeriod]);
      } else if (interestRate) {
        // Convert from previous period
        const rateValue = parseFloat(interestRate.replace(/,/g, ''));

        if (!isNaN(rateValue) && rateValue > 0) {
          // First convert to annual rate
          const annualRate = convertToAnnualRate(
            rateValue,
            previousPeriod.current
          );

          // Then convert to the new period
          let convertedValue: number;
          switch (inputPeriod) {
            case 'annual':
              convertedValue = annualRate;
              break;
            case 'monthly':
              convertedValue = annualRate / 12;
              break;
            case 'weekly':
              convertedValue = annualRate / 52;
              break;
            case 'daily':
              convertedValue = annualRate / 365;
              break;
            case 'hourly':
              convertedValue = annualRate / (365 * 24);
              break;
            default:
              convertedValue = annualRate;
          }

          const convertedString = convertedValue
            .toFixed(6)
            .replace(/\.?0+$/, '');
          setInterestRate(convertedString);
          rateByPeriod.current[inputPeriod] = convertedString;
        }
      }

      previousPeriod.current = inputPeriod;
    }
  }, [inputPeriod, interestRate, setInterestRate]);

  const handleRateChange = (value: string) => {
    setInterestRate(value);
    // Clear all saved values except the current period
    // This ensures conversions are based on the latest edited value
    rateByPeriod.current = {
      annual: '',
      monthly: '',
      weekly: '',
      daily: '',
      hourly: '',
    };
    rateByPeriod.current[inputPeriod] = value;
  };

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    const principalAmount = parseFloat(principal.replace(/,/g, ''));
    const rate = parseFloat(interestRate.replace(/,/g, ''));

    // Validation
    if (isNaN(principalAmount) || principalAmount <= 0) {
      alert('Please enter a valid principal amount.');
      return;
    }

    if (isNaN(rate) || rate <= 0) {
      alert('Please enter a valid interest rate.');
      return;
    }

    // Convert input rate to annual rate
    const effectiveAnnualRate = convertToAnnualRate(rate, inputPeriod);

    let annualGain: number;
    let monthlyGain: number;
    let weeklyGain: number;
    let dailyGain: number;
    let hourlyGain: number;
    let totalAfterOneYear: number;

    // Extract compounding frequency from interest type
    let compoundingFreq: CompoundingFrequency = 'daily';
    if (interestType === 'compound-annually') compoundingFreq = 'annually';
    else if (interestType === 'compound-semi-annually')
      compoundingFreq = 'semi-annually';
    else if (interestType === 'compound-quarterly')
      compoundingFreq = 'quarterly';
    else if (interestType === 'compound-monthly') compoundingFreq = 'monthly';
    else if (interestType === 'compound-weekly') compoundingFreq = 'weekly';
    else if (interestType === 'compound-daily') compoundingFreq = 'daily';
    else if (interestType === 'compound-hourly') compoundingFreq = 'hourly';
    else if (interestType === 'compound-continuously')
      compoundingFreq = 'continuously';

    if (interestType === 'simple') {
      // Simple Interest: I = PRT
      annualGain = (principalAmount * effectiveAnnualRate) / 100;
      monthlyGain = annualGain / 12;
      weeklyGain = annualGain / 52;
      dailyGain = annualGain / 365;
      hourlyGain = dailyGain / 24;
      totalAfterOneYear = principalAmount + annualGain;
    } else {
      // Compound Interest
      // Calculate total after 1 year
      totalAfterOneYear = calculateCompoundInterest(
        principalAmount,
        effectiveAnnualRate,
        1,
        compoundingFreq
      );
      annualGain = totalAfterOneYear - principalAmount;

      // For monthly, weekly, daily, hourly - calculate compound interest for that period
      const totalAfterMonth = calculateCompoundInterest(
        principalAmount,
        effectiveAnnualRate,
        1 / 12,
        compoundingFreq
      );
      monthlyGain = totalAfterMonth - principalAmount;

      const totalAfterWeek = calculateCompoundInterest(
        principalAmount,
        effectiveAnnualRate,
        1 / 52,
        compoundingFreq
      );
      weeklyGain = totalAfterWeek - principalAmount;

      const totalAfterDay = calculateCompoundInterest(
        principalAmount,
        effectiveAnnualRate,
        1 / 365,
        compoundingFreq
      );
      dailyGain = totalAfterDay - principalAmount;

      const totalAfterHour = calculateCompoundInterest(
        principalAmount,
        effectiveAnnualRate,
        1 / (365 * 24),
        compoundingFreq
      );
      hourlyGain = totalAfterHour - principalAmount;
    }

    setResults({
      annualGain,
      monthlyGain,
      weeklyGain,
      dailyGain,
      hourlyGain,
      effectiveAnnualRate,
      totalAfterOneYear,
      calculatedWith: {
        principal: principalAmount,
        interestRate: rate,
        inputPeriod,
        interestType,
        compoundingFrequency: compoundingFreq,
      },
    });
    setIsDirty(false);

    // Scroll to results on mobile
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[400px_1fr]">
      {/* Input Form - Left Side */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-8 lg:sticky lg:top-8">
        <h2 className={`${excali.className} mb-6 text-2xl`}>
          Interest Details
        </h2>

        <div className="space-y-6">
          <FormField
            label="Principal Amount"
            htmlFor="principal"
            helperText="The initial amount you're investing or borrowing"
          >
            <NumericInput
              id="principal"
              value={principal}
              onChange={setPrincipal}
              placeholder="10000"
              prefix="R"
            />
          </FormField>

          <FormField
            label="Interest Rate"
            htmlFor="interestRate"
            helperText="Enter the rate for your selected time period"
          >
            <div className="flex gap-2">
              <NumericInput
                id="interestRate"
                value={interestRate}
                onChange={handleRateChange}
                placeholder="10"
                suffix="%"
                allowDecimals
              />
              <Select
                value={inputPeriod}
                onChange={(value) => setInputPeriod(value as InterestPeriod)}
                options={periodOptions}
                className="w-32"
              />
            </div>
          </FormField>

          <FormField
            label="Interest Type"
            htmlFor="interestType"
            helperText={
              interestType === 'simple'
                ? "Simple interest doesn't compound"
                : 'Interest compounds over time - earning interest on interest'
            }
          >
            <Select
              value={interestType}
              onChange={(value) => setInterestType(value as InterestType)}
              options={interestTypeOptions}
            />
          </FormField>

          <div className="space-y-3">
            <Button
              onClick={handleCalculate}
              className="w-full"
              size="lg"
              disabled={!isDirty && results !== null}
            >
              {!isDirty && results !== null ? 'Calculated' : 'Calculate'}
            </Button>
            <button
              type="button"
              onClick={resetForm}
              className="w-full rounded-lg px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              Reset Form
            </button>
          </div>
        </div>
      </div>

      {/* Results - Right Side */}
      <div ref={resultsRef} className="min-h-[400px]">
        {results && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-8">
            <h2 className={`${excali.className} mb-6 text-2xl`}>
              Interest Breakdown
            </h2>

            <div className="space-y-6">
              {/* Primary Result - Annual Gain */}
              <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
                <span className="mb-1 block text-sm text-gray-600">
                  Annual Interest Gain
                </span>
                <span className="block text-5xl font-bold text-green-700">
                  {formatZAR(results.annualGain)}
                </span>
                <span className="mt-2 block text-xs text-gray-600">
                  {results.calculatedWith.interestType === 'simple'
                    ? 'Simple'
                    : 'Compound'}{' '}
                  interest at {results.effectiveAnnualRate.toFixed(2)}% annual
                  rate
                  {results.calculatedWith.interestType !== 'simple' && (
                    <span className="block capitalize">
                      Compounded {results.calculatedWith.compoundingFrequency}
                    </span>
                  )}
                </span>
              </div>

              {/* Interest Breakdown by Period */}
              <div className="space-y-4">
                <h3 className={`${excali.className} text-xl text-gray-700`}>
                  Interest by Time Period
                </h3>
                {results.calculatedWith.interestType !== 'simple' && (
                  <p className="text-sm text-gray-600">
                    Showing interest gained over each time period with{' '}
                    {results.calculatedWith.compoundingFrequency} compounding
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
                    <span className="mb-1 block text-sm text-gray-600">
                      Monthly
                    </span>
                    <span className="block text-2xl font-bold text-gray-900">
                      {formatZAR(results.monthlyGain)}
                    </span>
                    <span className="mt-1 block text-xs text-gray-600">
                      {(
                        (results.monthlyGain /
                          results.calculatedWith.principal) *
                        100
                      )
                        .toFixed(4)
                        .replace(/\.?0+$/, '')}
                      % effective rate
                    </span>
                  </div>

                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-5">
                    <span className="mb-1 block text-sm text-gray-600">
                      Weekly
                    </span>
                    <span className="block text-2xl font-bold text-gray-900">
                      {formatZAR(results.weeklyGain)}
                    </span>
                    <span className="mt-1 block text-xs text-gray-600">
                      {(
                        (results.weeklyGain /
                          results.calculatedWith.principal) *
                        100
                      )
                        .toFixed(4)
                        .replace(/\.?0+$/, '')}
                      % effective rate
                    </span>
                  </div>

                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
                    <span className="mb-1 block text-sm text-gray-600">
                      Daily
                    </span>
                    <span className="block text-2xl font-bold text-gray-900">
                      {formatZAR(results.dailyGain)}
                    </span>
                    <span className="mt-1 block text-xs text-gray-600">
                      {(
                        (results.dailyGain / results.calculatedWith.principal) *
                        100
                      )
                        .toFixed(4)
                        .replace(/\.?0+$/, '')}
                      % effective rate
                    </span>
                  </div>

                  <div className="rounded-lg border border-pink-200 bg-pink-50 p-5">
                    <span className="mb-1 block text-sm text-gray-600">
                      Hourly
                    </span>
                    <span className="block text-2xl font-bold text-gray-900">
                      {formatZAR(results.hourlyGain)}
                    </span>
                    <span className="mt-1 block text-xs text-gray-600">
                      {(
                        (results.hourlyGain /
                          results.calculatedWith.principal) *
                        100
                      )
                        .toFixed(6)
                        .replace(/\.?0+$/, '')}
                      % effective rate
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <h3
                  className={`${excali.className} mb-3 text-xl text-gray-700`}
                >
                  Summary
                </h3>

                <div className="flex items-center justify-between border-b border-gray-200 py-3">
                  <span className="text-gray-600">Principal Amount</span>
                  <span className="font-semibold text-gray-900">
                    {formatZAR(results.calculatedWith.principal)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 py-3">
                  <span className="text-gray-600">Interest Type</span>
                  <span className="font-semibold text-gray-900">
                    {results.calculatedWith.interestType === 'simple'
                      ? 'Simple'
                      : 'Compound'}
                  </span>
                </div>

                {results.calculatedWith.interestType !== 'simple' && (
                  <div className="flex items-center justify-between border-b border-gray-200 py-3">
                    <span className="text-gray-600">Compounding</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {results.calculatedWith.compoundingFrequency}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between border-b border-gray-200 py-3">
                  <span className="text-gray-600">Interest Rate</span>
                  <span className="font-semibold text-gray-900">
                    {results.calculatedWith.interestRate.toFixed(2)}%{' '}
                    {results.calculatedWith.inputPeriod}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 py-3">
                  <span className="text-gray-600">Effective Annual Rate</span>
                  <span className="font-semibold text-gray-900">
                    {results.effectiveAnnualRate.toFixed(2)}%
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 text-lg font-bold">
                  <span className="text-gray-700">Total After 1 Year</span>
                  <span className="text-gray-900">
                    {formatZAR(results.totalAfterOneYear)}
                  </span>
                </div>
              </div>

              {/* Comparison: Simple vs Compound */}
              <div className="rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-6">
                <h3
                  className={`${excali.className} mb-4 text-xl text-gray-800`}
                >
                  Simple vs Compound Interest Comparison
                </h3>
                <p className="mb-3 text-xs text-gray-600 capitalize">
                  Comparing simple interest with{' '}
                  {results.calculatedWith.compoundingFrequency} compounding
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="mb-1 text-sm text-gray-600">
                        Simple Interest (1 Year)
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatZAR(
                          (results.calculatedWith.principal *
                            results.effectiveAnnualRate) /
                            100
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-sm text-gray-600 capitalize">
                        Compound ({results.calculatedWith.compoundingFrequency})
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        {formatZAR(
                          calculateCompoundInterest(
                            results.calculatedWith.principal,
                            results.effectiveAnnualRate,
                            1,
                            results.calculatedWith.compoundingFrequency
                          ) - results.calculatedWith.principal
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-purple-200 pt-3">
                    <div className="mb-1 text-sm text-gray-600">
                      Extra Earnings with Compound (
                      {results.calculatedWith.compoundingFrequency})
                    </div>
                    <div className="text-xl font-bold text-purple-700">
                      {formatZAR(
                        calculateCompoundInterest(
                          results.calculatedWith.principal,
                          results.effectiveAnnualRate,
                          1,
                          results.calculatedWith.compoundingFrequency
                        ) -
                          results.calculatedWith.principal -
                          (results.calculatedWith.principal *
                            results.effectiveAnnualRate) /
                            100
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                      Compound interest (
                      {results.calculatedWith.compoundingFrequency}) earns{' '}
                      {(
                        ((calculateCompoundInterest(
                          results.calculatedWith.principal,
                          results.effectiveAnnualRate,
                          1,
                          results.calculatedWith.compoundingFrequency
                        ) -
                          results.calculatedWith.principal) /
                          ((results.calculatedWith.principal *
                            results.effectiveAnnualRate) /
                            100) -
                          1) *
                        100
                      ).toFixed(2)}
                      % more than simple interest over 1 year
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      {results.calculatedWith.interestType === 'simple'
                        ? 'Simple Interest'
                        : 'Compound Interest'}
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      {results.calculatedWith.interestType === 'simple' ? (
                        <p>
                          Simple interest is calculated only on the principal
                          amount. The interest earned doesn&apos;t earn
                          additional interest over time.
                        </p>
                      ) : (
                        <p>
                          Compound interest earns interest on both the principal
                          and accumulated interest.{' '}
                          {results.calculatedWith.compoundingFrequency ===
                            'continuously' &&
                            'Continuous compounding (e^rt) represents the mathematical limit - the maximum possible growth. '}
                          The more frequently interest compounds, the more you
                          earn. Most South African banks accrue interest daily.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!results && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <p className="text-lg text-gray-500">
              Enter your principal amount and interest rate, then click
              Calculate to see your results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
