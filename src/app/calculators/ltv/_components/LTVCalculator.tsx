'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { NumericInput } from '@/components/NumericInput';
import { excali } from '@/fonts';
import { formatZAR } from '@/lib/calculator-utils';
import { useURLParams } from '@/lib/use-url-params';

import { useLTVStore } from './ltv-store';

function calculateLTV(
  propertyValue: number,
  loanAmount: number
): {
  propertyValue: number;
  loanAmount: number;
  deposit: number;
  ltvPercentage: number;
  equityAmount: number;
  equityPercentage: number;
} {
  const deposit = propertyValue - loanAmount;
  const ltvPercentage = (loanAmount / propertyValue) * 100;
  const equityPercentage = (deposit / propertyValue) * 100;

  return {
    propertyValue,
    loanAmount,
    deposit,
    ltvPercentage,
    equityAmount: deposit,
    equityPercentage,
  };
}

function getLTVStatus(ltv: number): {
  color: string;
  bgColor: string;
  label: string;
  description: string;
} {
  if (ltv <= 80) {
    return {
      color: 'text-green-700',
      bgColor: 'bg-green-50 border-green-200',
      label: 'Excellent',
      description: 'Best interest rates and loan terms available',
    };
  } else if (ltv <= 90) {
    return {
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 border-blue-200',
      label: 'Good',
      description: 'Competitive rates, good approval chances',
    };
  } else if (ltv < 100) {
    return {
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50 border-yellow-200',
      label: 'Fair',
      description: 'Higher rates possible, limited options',
    };
  } else {
    return {
      color: 'text-red-700',
      bgColor: 'bg-red-50 border-red-200',
      label: '100% Loan',
      description: 'Available for qualifying first-time buyers',
    };
  }
}

export default function LTVCalculator() {
  const {
    propertyValue,
    loanAmount,
    deposit,
    inputMode,
    results,
    isDirty,
    setPropertyValue,
    setLoanAmount,
    setDeposit,
    setInputMode,
    setResults,
    setIsDirty,
    resetForm,
  } = useLTVStore();

  const searchParams = useSearchParams();

  // URL params configuration
  const { updateURLParams, clearURLParams } = useURLParams({
    paramMap: {
      propertyValue: 'property',
      loanAmount: 'loan',
      deposit: 'deposit',
      inputMode: 'mode',
    },
    storeValues: {
      propertyValue,
      loanAmount,
      deposit,
      inputMode,
    },
    storeSetters: {
      propertyValue: setPropertyValue,
      loanAmount: setLoanAmount,
      deposit: setDeposit,
      inputMode: setInputMode,
    },
  });

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    const propValue = parseFloat(propertyValue.replace(/,/g, ''));

    if (isNaN(propValue) || propValue <= 0) {
      alert('Please enter a valid property value');
      return;
    }

    let calculatedLoanAmount: number;

    if (inputMode === 'deposit') {
      const depositValue = parseFloat(deposit.replace(/,/g, '')) || 0;
      if (depositValue > propValue) {
        alert('Deposit cannot be greater than property value');
        return;
      }
      calculatedLoanAmount = propValue - depositValue;
    } else {
      calculatedLoanAmount = parseFloat(loanAmount.replace(/,/g, ''));
      if (isNaN(calculatedLoanAmount) || calculatedLoanAmount < 0) {
        alert('Please enter a valid loan amount');
        return;
      }
      if (calculatedLoanAmount > propValue) {
        alert('Loan amount cannot exceed property value');
        return;
      }
    }

    const calculatedResults = calculateLTV(propValue, calculatedLoanAmount);
    setResults(calculatedResults);
    setIsDirty(false); // Mark as clean after successful calculation

    // Update URL params with current form values
    updateURLParams({
      propertyValue,
      loanAmount,
      deposit,
      inputMode,
    });

    // Scroll to results on mobile
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  // Validate URL params and auto-calculate if valid on mount
  // Only run once; useURLParams hook will keep store in sync on changes

  useEffect(() => {
    const hasRelevantParams = ['property', 'loan', 'deposit', 'mode'].some(
      (key) => searchParams.get(key) !== null
    );
    if (!hasRelevantParams) return;

    const rawProperty = searchParams.get('property');
    const rawLoan = searchParams.get('loan');
    const rawDeposit = searchParams.get('deposit');
    const rawMode = searchParams.get('mode');

    const decode = (v: string | null) =>
      v === null ? '' : decodeURIComponent(v);
    const parseNum = (v: string | null): number | null => {
      if (v === null) return null;
      const decoded = decodeURIComponent(v);
      const cleaned = decoded.replace(/,/g, '');
      const n = parseFloat(cleaned);
      return Number.isFinite(n) ? n : null;
    };

    const propertyValueNum = parseNum(rawProperty);
    const loanAmountNum = parseNum(rawLoan);
    const depositNum = parseNum(rawDeposit);
    const modeParam =
      rawMode === 'loan' || rawMode === 'deposit' ? rawMode : 'deposit';

    const isValidBase = propertyValueNum !== null && propertyValueNum > 0;
    let isValid = false;
    if (modeParam === 'deposit') {
      const d = depositNum ?? 0;
      isValid = isValidBase && d >= 0 && d <= (propertyValueNum as number);
    } else {
      const l = loanAmountNum ?? null;
      isValid =
        isValidBase &&
        l !== null &&
        l >= 0 &&
        l <= (propertyValueNum as number);
    }

    if (!isValid) {
      clearURLParams();
      resetForm();
      return;
    }

    // Sync store explicitly from URL
    setPropertyValue(decode(rawProperty));
    setInputMode(modeParam);
    if (modeParam === 'deposit') {
      setDeposit(decode(rawDeposit));
      setLoanAmount('');
    } else {
      setLoanAmount(decode(rawLoan));
      setDeposit('');
    }

    // Perform calculation from validated URL params
    const effectiveLoanAmount =
      modeParam === 'deposit'
        ? (propertyValueNum as number) - (depositNum ?? 0)
        : (loanAmountNum as number);

    const calculatedResults = calculateLTV(
      propertyValueNum as number,
      effectiveLoanAmount
    );
    setResults(calculatedResults);
    setIsDirty(false);
  }, []);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[400px_1fr]">
      {/* Input Form - Left Side */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-8 lg:sticky lg:top-8">
        <h2 className={`${excali.className} mb-6 text-2xl`}>
          Property Details
        </h2>

        <div className="space-y-6">
          <FormField label="Property Value" htmlFor="propertyValue">
            <NumericInput
              id="propertyValue"
              value={propertyValue}
              onChange={setPropertyValue}
              placeholder="0"
              prefix="R"
            />
          </FormField>

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              I want to enter
            </label>
            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center">
                <input
                  type="radio"
                  name="inputMode"
                  value="deposit"
                  checked={inputMode === 'deposit'}
                  onChange={() => setInputMode('deposit')}
                  className="h-4 w-4 text-yellow-400 focus:ring-yellow-400"
                />
                <span className="ml-2 text-sm text-gray-900">Deposit</span>
              </label>

              <label className="flex cursor-pointer items-center">
                <input
                  type="radio"
                  name="inputMode"
                  value="loan"
                  checked={inputMode === 'loan'}
                  onChange={() => setInputMode('loan')}
                  className="h-4 w-4 text-yellow-400 focus:ring-yellow-400"
                />
                <span className="ml-2 text-sm text-gray-900">Loan Amount</span>
              </label>
            </div>
          </div>

          {inputMode === 'deposit' ? (
            <FormField
              label="Deposit Amount"
              htmlFor="deposit"
              helperText="Enter R0 for a 100% loan"
            >
              <NumericInput
                id="deposit"
                value={deposit}
                onChange={setDeposit}
                placeholder="0"
                prefix="R"
              />
            </FormField>
          ) : (
            <FormField label="Loan Amount" htmlFor="loanAmount">
              <NumericInput
                id="loanAmount"
                value={loanAmount}
                onChange={setLoanAmount}
                placeholder="0"
                prefix="R"
              />
            </FormField>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleCalculate}
              className="w-full"
              size="lg"
              disabled={!isDirty && results !== null}
            >
              {!isDirty && results !== null ? 'Calculated' : 'Calculate LTV'}
            </Button>
            <button
              type="button"
              onClick={() => {
                clearURLParams();
                resetForm();
              }}
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
              LTV Breakdown
            </h2>

            <div className="space-y-6">
              {/* Primary Result - LTV Percentage */}
              <div
                className={`rounded-lg border-2 p-6 ${getLTVStatus(results.ltvPercentage).bgColor}`}
              >
                <span className="mb-1 block text-sm text-gray-600">
                  Loan-to-Value (LTV) Ratio
                </span>
                <span
                  className={`block text-5xl font-bold ${getLTVStatus(results.ltvPercentage).color}`}
                >
                  {results.ltvPercentage.toFixed(1)}%
                </span>
                <div className="mt-3 border-t border-gray-300 pt-3">
                  <span
                    className={`block text-sm font-semibold ${getLTVStatus(results.ltvPercentage).color}`}
                  >
                    {getLTVStatus(results.ltvPercentage).label}
                  </span>
                  <span className="mt-1 block text-xs text-gray-700">
                    {getLTVStatus(results.ltvPercentage).description}
                  </span>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
                  <span className="mb-1 block text-sm text-gray-600">
                    Loan Amount
                  </span>
                  <span className="block text-3xl font-bold text-gray-900">
                    {formatZAR(results.loanAmount)}
                  </span>
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-5">
                  <span className="mb-1 block text-sm text-gray-600">
                    Your Equity (Deposit)
                  </span>
                  <span className="block text-3xl font-bold text-gray-900">
                    {formatZAR(results.deposit)}
                  </span>
                </div>
              </div>

              {/* Visual Representation - Stacked Bar */}
              <div className="pt-4">
                <h3
                  className={`${excali.className} mb-3 text-lg text-gray-700`}
                >
                  Property Composition
                </h3>

                {/* Stacked Bar */}
                <div className="flex h-16 w-full overflow-hidden rounded-lg bg-gray-200">
                  {/* Loan Amount (Blue) */}
                  <div
                    className="flex items-center justify-center bg-blue-500 transition-all duration-300"
                    style={{ width: `${results.ltvPercentage}%` }}
                  >
                    {results.ltvPercentage >= 15 && (
                      <span className="px-2 text-center text-sm font-semibold text-white">
                        {results.ltvPercentage >= 25
                          ? `Loan ${results.ltvPercentage.toFixed(1)}%`
                          : `${results.ltvPercentage.toFixed(1)}%`}
                      </span>
                    )}
                  </div>

                  {/* Equity (Green) */}
                  <div
                    className="flex items-center justify-center bg-green-500 transition-all duration-300"
                    style={{ width: `${results.equityPercentage}%` }}
                  >
                    {results.equityPercentage >= 15 && (
                      <span className="px-2 text-center text-sm font-semibold text-white">
                        {results.equityPercentage >= 25
                          ? `Equity ${results.equityPercentage.toFixed(1)}%`
                          : `${results.equityPercentage.toFixed(1)}%`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-4 flex justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-blue-500"></div>
                    <span className="text-gray-700">
                      Bank Loan: {results.ltvPercentage.toFixed(1)}% (
                      {formatZAR(results.loanAmount)})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-green-500"></div>
                    <span className="text-gray-700">
                      Your Equity: {results.equityPercentage.toFixed(1)}% (
                      {formatZAR(results.deposit)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <h3
                  className={`${excali.className} mb-3 text-xl text-gray-700`}
                >
                  Property Breakdown
                </h3>

                <div className="flex items-center justify-between border-b border-gray-200 py-3">
                  <span className="text-gray-600">Property Value</span>
                  <span className="font-semibold text-gray-900">
                    {formatZAR(results.propertyValue)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 py-3">
                  <span className="text-gray-600">Loan Amount</span>
                  <span className="font-semibold text-blue-600">
                    {formatZAR(results.loanAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 py-3">
                  <span className="text-gray-600">Your Deposit</span>
                  <span className="font-semibold text-green-600">
                    {formatZAR(results.deposit)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!results && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <p className="text-lg text-gray-500">
              Enter your property value and deposit (or loan amount) to
              calculate your LTV ratio
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
