'use client';

import { useRef } from 'react';

import { excali } from '@/fonts';
import { Button } from '@/components/Button';
import { NumericInput } from '@/components/NumericInput';
import { FormField } from '@/components/FormField';
import { formatCurrency } from '@/lib/calculator-utils';

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
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I want to enter
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="inputMode"
                  value="deposit"
                  checked={inputMode === 'deposit'}
                  onChange={() => setInputMode('deposit')}
                  className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                />
                <span className="ml-2 text-sm text-gray-900">Deposit</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="inputMode"
                  value="loan"
                  checked={inputMode === 'loan'}
                  onChange={() => setInputMode('loan')}
                  className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
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
              onClick={resetForm}
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
              LTV Breakdown
            </h2>

            <div className="space-y-6">
              {/* Primary Result - LTV Percentage */}
              <div
                className={`rounded-lg p-6 border-2 ${getLTVStatus(results.ltvPercentage).bgColor}`}
              >
                <span className="text-sm text-gray-600 block mb-1">
                  Loan-to-Value (LTV) Ratio
                </span>
                <span
                  className={`text-5xl font-bold block ${getLTVStatus(results.ltvPercentage).color}`}
                >
                  {results.ltvPercentage.toFixed(1)}%
                </span>
                <div className="mt-3 pt-3 border-t border-gray-300">
                  <span
                    className={`text-sm font-semibold block ${getLTVStatus(results.ltvPercentage).color}`}
                  >
                    {getLTVStatus(results.ltvPercentage).label}
                  </span>
                  <span className="text-xs text-gray-700 block mt-1">
                    {getLTVStatus(results.ltvPercentage).description}
                  </span>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                  <span className="text-sm text-gray-600 block mb-1">
                    Loan Amount
                  </span>
                  <span className="text-3xl font-bold text-gray-900 block">
                    {formatCurrency(results.loanAmount)}
                  </span>
                </div>

                <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                  <span className="text-sm text-gray-600 block mb-1">
                    Your Equity (Deposit)
                  </span>
                  <span className="text-3xl font-bold text-gray-900 block">
                    {formatCurrency(results.deposit)}
                  </span>
                </div>
              </div>

              {/* Visual Representation - Stacked Bar */}
              <div className="pt-4">
                <h3
                  className={`${excali.className} text-lg text-gray-700 mb-3`}
                >
                  Property Composition
                </h3>

                {/* Stacked Bar */}
                <div className="w-full bg-gray-200 rounded-lg h-16 overflow-hidden flex">
                  {/* Loan Amount (Blue) */}
                  <div
                    className="bg-blue-500 flex items-center justify-center transition-all duration-300"
                    style={{ width: `${results.ltvPercentage}%` }}
                  >
                    {results.ltvPercentage >= 15 && (
                      <span className="text-sm text-white font-semibold px-2 text-center">
                        {results.ltvPercentage >= 25
                          ? `Loan ${results.ltvPercentage.toFixed(1)}%`
                          : `${results.ltvPercentage.toFixed(1)}%`}
                      </span>
                    )}
                  </div>

                  {/* Equity (Green) */}
                  <div
                    className="bg-green-500 flex items-center justify-center transition-all duration-300"
                    style={{ width: `${results.equityPercentage}%` }}
                  >
                    {results.equityPercentage >= 15 && (
                      <span className="text-sm text-white font-semibold px-2 text-center">
                        {results.equityPercentage >= 25
                          ? `Equity ${results.equityPercentage.toFixed(1)}%`
                          : `${results.equityPercentage.toFixed(1)}%`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex gap-6 mt-4 justify-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-gray-700">
                      Bank Loan: {results.ltvPercentage.toFixed(1)}% (
                      {formatCurrency(results.loanAmount)})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-700">
                      Your Equity: {results.equityPercentage.toFixed(1)}% (
                      {formatCurrency(results.deposit)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <h3
                  className={`${excali.className} text-xl text-gray-700 mb-3`}
                >
                  Property Breakdown
                </h3>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Property Value</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(results.propertyValue)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Loan Amount</span>
                  <span className="text-blue-600 font-semibold">
                    {formatCurrency(results.loanAmount)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Your Deposit</span>
                  <span className="text-green-600 font-semibold">
                    {formatCurrency(results.deposit)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!results && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <p className="text-gray-500 text-lg">
              Enter your property value and deposit (or loan amount) to
              calculate your LTV ratio
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
