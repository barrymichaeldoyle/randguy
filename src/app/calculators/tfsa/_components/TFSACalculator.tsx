'use client';

import { useEffect, useRef } from 'react';

import { excali } from '@/fonts';
import { Button } from '@/components/Button';
import { NumericInput } from '@/components/NumericInput';
import { FormField } from '@/components/FormField';
import { Select } from '@/components/Select';
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

  const handleCalculate = () => {
    const current = parseFloat(currentContributions.replace(/,/g, ''));
    const contributionAmount = parseFloat(
      monthlyContribution.replace(/,/g, '')
    );

    // Validation
    if (isNaN(current) || current < 0) {
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
    <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
      {/* Input Form - Left Side */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-8 shadow-sm lg:sticky lg:top-8">
        <h2 className={`${excali.className} text-2xl mb-6`}>
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
              <NumericInput
                id="monthlyContribution"
                value={monthlyContribution}
                onChange={handleContributionChange}
                placeholder={displayUnit === 'months' ? '3000' : '36000'}
                prefix="R"
              />
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
              Your TFSA Timeline
            </h2>

            <div className="space-y-6">
              {/* Primary Result - Time to Max Out */}
              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                <span className="text-sm text-gray-600 block mb-1">
                  Time to Max Out
                </span>
                <span className="text-5xl font-bold text-green-700 block">
                  {results.yearsToMaxOut.toFixed(1)} years
                </span>
                <span className="text-xs text-gray-600 block mt-2">
                  {results.monthsToMaxOut} months
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {results.currentProgress.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-green-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${results.currentProgress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                  <span>
                    {formatCurrency(parseFloat(currentContributions))}
                  </span>
                  <span>{formatCurrency(LIFETIME_LIMIT)}</span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <span className="text-sm text-gray-600 block mb-1">
                    Remaining Contributions
                  </span>
                  <span className="text-3xl font-bold text-gray-900 block">
                    {formatCurrency(results.remainingContributions)}
                  </span>
                </div>

                <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                  <span className="text-sm text-gray-600 block mb-1">
                    Projected Max Out Date
                  </span>
                  <span className="text-3xl font-bold text-gray-900 block">
                    {formatDate(results.projectedMaxOutDate)}
                  </span>
                </div>
              </div>

              {/* Annual Contribution Warning */}
              {results.annualContribution > ANNUAL_LIMIT && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
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
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <h3
                  className={`${excali.className} text-xl text-gray-700 mb-3`}
                >
                  Contribution Summary
                </h3>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Current Contributions</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(parseFloat(currentContributions))}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Monthly Contribution</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(
                      displayUnit === 'months'
                        ? parseFloat(monthlyContribution)
                        : parseFloat(monthlyContribution) / 12
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Annual Contribution</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(
                      displayUnit === 'years'
                        ? parseFloat(monthlyContribution)
                        : parseFloat(monthlyContribution) * 12
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 font-bold text-lg">
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
