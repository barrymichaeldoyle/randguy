'use client';

import { useEffect, useRef } from 'react';

import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { NumericInput } from '@/components/NumericInput';
import { Select } from '@/components/Select';
import { excali } from '@/fonts';

import { useTFSAStore, type DisplayUnit } from './tfsa-store';

const LIFETIME_LIMIT = 500000; // R500,000 lifetime limit
const ANNUAL_LIMIT = 36000; // R36,000 annual limit

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
  });
}

export default function TFSACalculator() {
  const {
    currentContributions,
    monthlyContribution,
    displayUnit,
    results,
    isDirty,
    setCurrentContributions,
    setMonthlyContribution,
    setDisplayUnit,
    setResults,
    setIsDirty,
    resetForm,
  } = useTFSAStore();

  const previousUnit = useRef<DisplayUnit>('years');
  const contributionByUnit = useRef<Record<DisplayUnit, string>>({
    months: '',
    years: '',
  });

  // Convert contribution when display unit changes
  useEffect(() => {
    if (previousUnit.current !== displayUnit) {
      // Check if we have a saved value for this unit
      if (contributionByUnit.current[displayUnit]) {
        setMonthlyContribution(contributionByUnit.current[displayUnit]);
      } else if (monthlyContribution) {
        // Convert from previous unit
        const contributionValue = parseFloat(
          monthlyContribution.replace(/,/g, '')
        );

        if (!isNaN(contributionValue) && contributionValue > 0) {
          let convertedValue: string;

          if (displayUnit === 'years' && previousUnit.current === 'months') {
            // Converting from monthly to annual
            const annualAmount = contributionValue * 12;
            convertedValue = Math.round(annualAmount).toString();
          } else {
            // Converting from annual to monthly
            const monthlyAmount = contributionValue / 12;
            convertedValue = Math.round(monthlyAmount).toString();
          }

          setMonthlyContribution(convertedValue);
          contributionByUnit.current[displayUnit] = convertedValue;
        }
      }

      previousUnit.current = displayUnit;
    }
  }, [displayUnit, monthlyContribution, setMonthlyContribution]);

  const handleContributionChange = (value: string) => {
    setMonthlyContribution(value);
    // Clear all saved values except the current unit
    // This ensures conversions are based on the latest edited value
    contributionByUnit.current = {
      months: '',
      years: '',
    };
    contributionByUnit.current[displayUnit] = value;
  };

  const handleSetMaxContribution = () => {
    const maxValue = displayUnit === 'months' ? '3000' : '36000';
    handleContributionChange(maxValue);
  };

  const handleResetForm = () => {
    resetForm();
    // Reset refs
    previousUnit.current = 'years';
    contributionByUnit.current = {
      months: '',
      years: '',
    };
  };

  const resultsRef = useRef<HTMLDivElement>(null);

  // Derived UI state for the Max button
  const maxPerUnit = displayUnit === 'months' ? 3000 : 36000;
  const currentContributionNumeric = monthlyContribution.trim()
    ? parseFloat(monthlyContribution.replace(/,/g, ''))
    : 0;
  const isAtOrAboveMax = currentContributionNumeric >= maxPerUnit;

  const handleCalculate = () => {
    const current = currentContributions.trim()
      ? parseFloat(currentContributions.replace(/,/g, ''))
      : 0;
    const contributionAmount = parseFloat(
      monthlyContribution.replace(/,/g, '')
    );

    // Validation
    if (current < 0) {
      alert('Please enter a valid current contribution amount.');
      return;
    }

    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      alert('Please enter a valid contribution amount.');
      return;
    }

    if (current > LIFETIME_LIMIT) {
      alert(
        `Current contributions cannot exceed the lifetime limit of ${formatCurrency(LIFETIME_LIMIT)}.`
      );
      return;
    }

    if (current === LIFETIME_LIMIT) {
      alert("You've already maxed out your TFSA contributions!");
      return;
    }

    // Convert to monthly contribution
    const monthly =
      displayUnit === 'years' ? contributionAmount / 12 : contributionAmount;

    // Calculate remaining contributions
    const remaining = LIFETIME_LIMIT - current;
    const monthsToMaxOut = Math.ceil(remaining / monthly);
    const yearsToMaxOut = monthsToMaxOut / 12;

    // Calculate projected max out date
    const projectedDate = new Date();
    projectedDate.setMonth(projectedDate.getMonth() + monthsToMaxOut);

    // Calculate current progress percentage
    const currentProgress = (current / LIFETIME_LIMIT) * 100;

    // Calculate annual contribution
    const annualContribution = monthly * 12;

    setResults({
      remainingContributions: remaining,
      monthsToMaxOut,
      yearsToMaxOut,
      projectedMaxOutDate: projectedDate,
      currentProgress,
      annualContribution,
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
          Your TFSA Details
        </h2>

        <div className="space-y-6">
          <FormField
            label="Current TFSA Contributions"
            htmlFor="currentContributions"
            helperText="Lifetime limit: R500,000"
          >
            <NumericInput
              id="currentContributions"
              value={currentContributions}
              onChange={setCurrentContributions}
              placeholder="0"
              prefix="R"
            />
          </FormField>

          <FormField
            label="Contribution Amount"
            htmlFor="monthlyContribution"
            helperText={
              displayUnit === 'months'
                ? 'Annual limit: R36,000 (R3,000/month)'
                : 'Annual limit: R36,000'
            }
          >
            <div className="flex gap-2">
              <div className="relative flex-1">
                <NumericInput
                  id="monthlyContribution"
                  value={monthlyContribution}
                  onChange={handleContributionChange}
                  placeholder={displayUnit === 'months' ? '3000' : '36000'}
                  prefix="R"
                  max={maxPerUnit}
                  className="w-full rounded-lg border border-gray-300 py-3 pr-16 pl-8 transition outline-none focus:border-transparent focus:ring-2 focus:ring-yellow-400"
                />
                {!isAtOrAboveMax && (
                  <button
                    type="button"
                    onClick={handleSetMaxContribution}
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-sm font-medium text-yellow-600 transition-colors hover:text-yellow-700"
                  >
                    Max
                  </button>
                )}
              </div>
              <Select
                value={displayUnit}
                onChange={setDisplayUnit}
                options={[
                  { value: 'months', label: 'Monthly' },
                  { value: 'years', label: 'Annual' },
                ]}
                className="w-30"
              />
            </div>
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
              onClick={handleResetForm}
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
              Your TFSA Timeline
            </h2>

            <div className="space-y-6">
              {/* Primary Result - Time to Max Out */}
              <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
                <span className="mb-1 block text-sm text-gray-600">
                  Time to Max Out
                </span>
                <span className="block text-5xl font-bold text-green-700">
                  {results.yearsToMaxOut.toFixed(1)} years
                </span>
                <span className="mt-2 block text-xs text-gray-600">
                  {results.monthsToMaxOut} months
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {results.currentProgress.toFixed(1)}%
                  </span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-4 rounded-full bg-green-600 transition-all duration-500"
                    style={{ width: `${results.currentProgress}%` }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {formatCurrency(
                      currentContributions.trim()
                        ? parseFloat(currentContributions.replace(/,/g, ''))
                        : 0
                    )}
                  </span>
                  <span>{formatCurrency(LIFETIME_LIMIT)}</span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <span className="mb-1 block text-sm text-gray-600">
                    Remaining Contributions
                  </span>
                  <span className="block text-3xl font-bold text-gray-900">
                    {formatCurrency(results.remainingContributions)}
                  </span>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
                  <span className="mb-1 block text-sm text-gray-600">
                    Projected Max Out Date
                  </span>
                  <span className="block text-3xl font-bold text-gray-900">
                    {formatDate(results.projectedMaxOutDate)}
                  </span>
                </div>
              </div>

              {/* Annual Contribution Warning */}
              {results.annualContribution > ANNUAL_LIMIT && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Annual Limit Exceeded
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Your planned annual contribution of{' '}
                          {formatCurrency(results.annualContribution)} exceeds
                          the annual limit of {formatCurrency(ANNUAL_LIMIT)}.
                          Consider reducing to R3,000/month to stay within
                          limits.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contribution Summary */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <h3
                  className={`${excali.className} mb-3 text-xl text-gray-700`}
                >
                  Contribution Summary
                </h3>

                <div className="flex items-center justify-between border-b border-gray-200 py-3">
                  <span className="text-gray-600">Current Contributions</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(
                      currentContributions.trim()
                        ? parseFloat(currentContributions.replace(/,/g, ''))
                        : 0
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 py-3">
                  <span className="text-gray-600">Monthly Contribution</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(
                      displayUnit === 'months'
                        ? parseFloat(monthlyContribution)
                        : parseFloat(monthlyContribution) / 12
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 py-3">
                  <span className="text-gray-600">Annual Contribution</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(
                      displayUnit === 'years'
                        ? parseFloat(monthlyContribution)
                        : parseFloat(monthlyContribution) * 12
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 text-lg font-bold">
                  <span className="text-gray-700">Lifetime Limit</span>
                  <span className="text-gray-900">
                    {formatCurrency(LIFETIME_LIMIT)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
