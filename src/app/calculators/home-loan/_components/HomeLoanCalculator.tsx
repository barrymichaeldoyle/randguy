'use client';

import { useRef, useEffect, Fragment } from 'react';

import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { NumericInput } from '@/components/NumericInput';
import { Select } from '@/components/Select';
import { excali } from '@/fonts';
import { formatCurrency } from '@/lib/calculator-utils';
import { PRIME_LENDING_RATE_ZA } from '@/lib/historical-data';

import { useHomeLoanStore } from './home-loan-store';

function calculateHomeLoan(
  loanAmount: number,
  annualRate: number,
  years: number
): {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanAmount: number;
  loanTermYears: number;
} {
  const monthlyRate = annualRate / 12 / 100;
  const numberOfPayments = years * 12;

  // Calculate monthly payment using the formula:
  // M = P * [r(1+r)^n] / [(1+r)^n - 1]
  // Where M = monthly payment, P = principal, r = monthly rate, n = number of payments
  const monthlyPayment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - loanAmount;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    loanAmount,
    loanTermYears: years,
  };
}

type TermUnit = 'years' | 'months';

export default function HomeLoanCalculator() {
  const {
    propertyPrice,
    deposit,
    interestRate,
    loanTerm,
    termUnit,
    monthlyServiceFee,
    isAdvancedMode,
    results,
    isDirty,
    setPropertyPrice,
    setDeposit,
    setInterestRate,
    setLoanTerm,
    setTermUnit,
    setMonthlyServiceFee,
    setIsAdvancedMode,
    setResults,
    setIsDirty,
    resetForm,
  } = useHomeLoanStore();

  // Store the last entered value for each unit to avoid losing precision
  const termByUnit = useRef<Record<TermUnit, string>>({
    years: '',
    months: '',
  });
  const previousUnit = useRef<TermUnit>(termUnit);

  // Convert term between years and months
  const convertTerm = (value: string, from: TermUnit, to: TermUnit): string => {
    if (!value || value === '') return '';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';

    if (from === 'years' && to === 'months') {
      // Years to months: multiply by 12, no decimals for months
      return Math.round(numValue * 12).toString();
    } else if (from === 'months' && to === 'years') {
      // Months to years: divide by 12, round to 1 decimal
      const years = numValue / 12;
      const rounded = parseFloat(years.toFixed(1));
      // Remove .0 if it's a whole number
      return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
    }
    return value;
  };

  // Handle term value changes (manual edits)
  const handleTermChange = (value: string) => {
    setLoanTerm(value);
    // Store the value for the current unit and clear other units
    termByUnit.current[termUnit] = value;
    const otherUnit = termUnit === 'years' ? 'months' : 'years';
    termByUnit.current[otherUnit] = '';
  };

  // Handle unit changes (years <-> months)
  useEffect(() => {
    if (previousUnit.current !== termUnit && loanTerm) {
      // Check if we have a stored value for the new unit
      if (termByUnit.current[termUnit]) {
        // Use the stored value
        setLoanTerm(termByUnit.current[termUnit]);
      } else {
        // Convert from the previous unit
        const converted = convertTerm(loanTerm, previousUnit.current, termUnit);
        setLoanTerm(converted);
        termByUnit.current[termUnit] = converted;
      }
      previousUnit.current = termUnit;
    }
  }, [termUnit, loanTerm, setLoanTerm]);

  // Get term in years for calculation
  const getTermInYears = (): number => {
    const termValue = parseFloat(loanTerm);
    if (isNaN(termValue)) return 0;

    if (termUnit === 'months') {
      return termValue / 12;
    }
    return termValue;
  };

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    const priceValue = parseFloat(propertyPrice.replace(/,/g, ''));
    const depositValue = parseFloat(deposit.replace(/,/g, '')) || 0;
    const rateValue = parseFloat(interestRate);
    const termInYears = getTermInYears();

    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Please enter a valid property price');
      return;
    }

    if (isNaN(rateValue) || rateValue <= 0) {
      alert('Please enter a valid interest rate');
      return;
    }

    if (termInYears <= 0) {
      alert('Please enter a valid loan term');
      return;
    }

    if (depositValue >= priceValue) {
      alert('Deposit cannot be equal to or greater than property price');
      return;
    }

    const loanAmount = priceValue - depositValue;

    if (loanAmount <= 0) {
      alert('Loan amount must be greater than zero');
      return;
    }

    const calculatedResults = calculateHomeLoan(
      loanAmount,
      rateValue,
      termInYears
    );

    // Include the service fee that was used in this calculation
    const serviceFeeValue = parseFloat(effectiveServiceFee || '0');
    setResults({
      ...calculatedResults,
      serviceFee: serviceFeeValue,
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

  const depositPercentage =
    propertyPrice && deposit
      ? (
          (parseFloat(deposit.replace(/,/g, '')) /
            parseFloat(propertyPrice.replace(/,/g, ''))) *
          100
        ).toFixed(1)
      : '0';

  // Get historical rates
  const currentPrimeRate = PRIME_LENDING_RATE_ZA[0].rate; // First item is most recent

  // Calculate margin to prime for display
  const marginToPrime = interestRate
    ? parseFloat(interestRate) - currentPrimeRate
    : null;

  const marginToPrimeDisplay =
    marginToPrime !== null
      ? marginToPrime === 0
        ? 'Prime'
        : marginToPrime > 0
          ? `Prime +${marginToPrime.toFixed(2)}%`
          : `Prime ${marginToPrime.toFixed(2)}%`
      : null;

  // Find specific historical rates by date
  // 2008 Crisis Peak: June 2008 (15.5%)
  const crisis2008Rate =
    PRIME_LENDING_RATE_ZA.find((r) => r.date === '2008-06-13')?.rate || 15.5;

  // COVID-19 Low: July 2020 (7.0%)
  const covidLowRate =
    PRIME_LENDING_RATE_ZA.find((r) => r.date === '2020-07-24')?.rate || 7.0;

  // Calculate rate scenarios
  const calculateRateScenarios = () => {
    if (!results) return null;

    const currentRate = parseFloat(interestRate);

    // Calculate margin to prime (e.g., if rate is 9.5% and prime is 10.5%, margin is -1.0%)
    const marginToPrime = currentRate - currentPrimeRate;

    const scenarios = [
      { label: '-1.00%', rate: currentRate - 1.0, change: -1.0 },
      { label: '-0.75%', rate: currentRate - 0.75, change: -0.75 },
      { label: '-0.50%', rate: currentRate - 0.5, change: -0.5 },
      { label: '-0.25%', rate: currentRate - 0.25, change: -0.25 },
      { label: 'Current Rate', rate: currentRate, highlight: true, change: 0 },
      { label: '+0.25%', rate: currentRate + 0.25, change: 0.25 },
      { label: '+0.50%', rate: currentRate + 0.5, change: 0.5 },
      { label: '+0.75%', rate: currentRate + 0.75, change: 0.75 },
      { label: '+1.00%', rate: currentRate + 1.0, change: 1.0 },
    ];

    // Calculate effective rates based on user's margin to prime
    const effectiveCrisis2008Rate = crisis2008Rate + marginToPrime;
    const effectiveCovidLowRate = covidLowRate + marginToPrime;

    const historical = [
      {
        label: '2008 Crisis Peak',
        rate: effectiveCrisis2008Rate,
        description: `Your rate would have been ${effectiveCrisis2008Rate.toFixed(2)}% (prime ${crisis2008Rate}% ${marginToPrime >= 0 ? '+' : ''}${marginToPrime.toFixed(2)}%)`,
      },
      {
        label: 'COVID-19 Low',
        rate: effectiveCovidLowRate,
        description: `Your rate would have been ${effectiveCovidLowRate.toFixed(2)}% (prime ${covidLowRate}% ${marginToPrime >= 0 ? '+' : ''}${marginToPrime.toFixed(2)}%)`,
      },
    ];

    return { scenarios, historical };
  };

  const rateScenarios = calculateRateScenarios();

  const toggleMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
  };

  // Get effective service fee - use default if not in advanced mode
  const effectiveServiceFee = isAdvancedMode ? monthlyServiceFee : '69';

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[400px_1fr]">
      {/* Input Form - Left Side */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-8 lg:sticky lg:top-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className={`${excali.className} text-2xl`}>Loan Details</h2>
          <Button variant="text" size="md" onClick={toggleMode}>
            {isAdvancedMode ? 'Switch to Basic' : 'Advanced Options'}
          </Button>
        </div>

        <div className="space-y-6">
          <FormField label="Property Price" htmlFor="propertyPrice">
            <NumericInput
              id="propertyPrice"
              value={propertyPrice}
              onChange={setPropertyPrice}
              placeholder="0"
              prefix="R"
            />
          </FormField>

          <FormField
            label={
              <>
                Deposit{' '}
                {deposit && propertyPrice && (
                  <span className="font-normal text-gray-500">
                    ({depositPercentage}%)
                  </span>
                )}
              </>
            }
            htmlFor="deposit"
            helperText="Banks may offer 100% loans for first-time buyers (0% deposit)"
          >
            <NumericInput
              id="deposit"
              value={deposit}
              onChange={setDeposit}
              placeholder="0"
              prefix="R"
            />
          </FormField>

          <FormField
            label={
              <>
                Interest Rate (% per year){' '}
                {marginToPrimeDisplay && (
                  <span className="font-normal text-gray-500">
                    ({marginToPrimeDisplay})
                  </span>
                )}
              </>
            }
            htmlFor="interestRate"
            helperText={`SA prime rate: ${currentPrimeRate}%. Shop around and negotiate!`}
          >
            <NumericInput
              id="interestRate"
              value={interestRate}
              onChange={setInterestRate}
              placeholder="10.5"
              suffix="%"
              allowDecimals
              max={100}
            />
          </FormField>

          <FormField
            label="Loan Term"
            htmlFor="loanTerm"
            helperText={
              termUnit === 'years'
                ? 'Typical: 20-30 years'
                : 'Typical: 240-360 months'
            }
          >
            <div className="flex gap-2">
              <div className="flex-1">
                <NumericInput
                  id="loanTerm"
                  value={loanTerm}
                  onChange={handleTermChange}
                  placeholder={termUnit === 'years' ? '20' : '240'}
                  allowDecimals={termUnit === 'years'}
                  max={termUnit === 'years' ? 100 : 1200}
                />
              </div>
              <Select
                value={termUnit}
                onChange={setTermUnit}
                options={[
                  { value: 'years', label: 'Years' },
                  { value: 'months', label: 'Months' },
                ]}
                className="w-30"
              />
            </div>
          </FormField>

          {isAdvancedMode && (
            <FormField
              label="Monthly Service Fee"
              htmlFor="monthlyServiceFee"
              helperText="Typical bank admin fee (default: R69)"
            >
              <NumericInput
                id="monthlyServiceFee"
                value={monthlyServiceFee}
                onChange={setMonthlyServiceFee}
                placeholder="69"
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
              {!isDirty && results !== null
                ? 'Calculated'
                : 'Calculate Repayment'}
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
              Repayment Breakdown
            </h2>

            <div className="space-y-6">
              {/* Primary Result - Monthly Payment */}
              <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
                <span className="mb-1 block text-sm text-gray-600">
                  Total Monthly Payment
                </span>
                <span className="block text-5xl font-bold text-green-700">
                  {formatCurrency(results.monthlyPayment + results.serviceFee)}
                </span>
                <span className="mt-2 block text-xs text-gray-600">
                  for {results.loanTermYears.toFixed(1)} years
                </span>
                {results.serviceFee > 0 && (
                  <div className="mt-2 border-t border-green-200 pt-2 text-xs text-gray-600">
                    Bond: {formatCurrency(results.monthlyPayment)} + Service
                    Fee: {formatCurrency(results.serviceFee)}
                  </div>
                )}
              </div>

              {/* Loan Summary */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <span className="mb-1 block text-sm text-gray-600">
                    Loan Amount
                  </span>
                  <span className="block text-3xl font-bold text-gray-900">
                    {formatCurrency(results.loanAmount)}
                  </span>
                </div>

                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-5">
                  <span className="mb-1 block text-sm text-gray-600">
                    Total Interest
                  </span>
                  <span className="block text-3xl font-bold text-gray-900">
                    {formatCurrency(results.totalInterest)}
                  </span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <h3
                  className={`${excali.className} mb-3 text-xl text-gray-700`}
                >
                  Total Cost Over {results.loanTermYears.toFixed(1)} Years
                </h3>

                <div className="flex items-center justify-between border-b border-gray-200 py-3">
                  <span className="text-gray-600">Loan Amount</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(results.loanAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 py-3">
                  <span className="text-gray-600">Total Interest Paid</span>
                  <span className="font-semibold text-yellow-600">
                    {formatCurrency(results.totalInterest)}
                  </span>
                </div>

                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">
                      Total Amount to Repay
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(results.totalPayment)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual representation */}
              <div className="pt-4">
                <h3
                  className={`${excali.className} mb-3 text-lg text-gray-700`}
                >
                  Cost Breakdown
                </h3>
                <div className="flex h-12 overflow-hidden rounded-lg bg-gray-200">
                  {(() => {
                    const principalPercent =
                      (results.loanAmount / results.totalPayment) * 100;
                    const interestPercent =
                      (results.totalInterest / results.totalPayment) * 100;

                    return (
                      <>
                        <div
                          className="flex items-center justify-center bg-green-500 transition-all"
                          style={{
                            width: `${principalPercent}%`,
                          }}
                        >
                          {principalPercent >= 15 && (
                            <span className="text-sm font-semibold text-white">
                              {principalPercent >= 25
                                ? `Principal ${principalPercent.toFixed(1)}%`
                                : `${principalPercent.toFixed(1)}%`}
                            </span>
                          )}
                        </div>
                        <div
                          className="flex items-center justify-center bg-yellow-500 transition-all"
                          style={{
                            width: `${interestPercent}%`,
                          }}
                        >
                          {interestPercent >= 15 && (
                            <span className="text-sm font-semibold text-white">
                              {interestPercent >= 25
                                ? `Interest ${interestPercent.toFixed(1)}%`
                                : `${interestPercent.toFixed(1)}%`}
                            </span>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
                {/* Legend */}
                <div className="mt-3 flex items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-green-500"></div>
                    <span>
                      Principal (
                      {(
                        (results.loanAmount / results.totalPayment) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-yellow-500"></div>
                    <span>
                      Interest (
                      {(
                        (results.totalInterest / results.totalPayment) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                </div>
              </div>

              {/* Rate Impact Analysis */}
              {rateScenarios && (
                <div className="mt-8 border-t border-gray-200 pt-8">
                  <h3
                    className={`${excali.className} mb-4 text-xl text-gray-700`}
                  >
                    Rate Impact Analysis
                  </h3>
                  <p className="mb-6 text-sm text-gray-600">
                    See how changes in interest rates affect your monthly
                    repayment
                  </p>

                  {/* Rate Change Scenarios */}
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold text-gray-700">
                      Rate Change Scenarios
                    </h4>
                    <p className="mb-3 text-xs text-gray-600">
                      Hover over rows to see how rate changes affect your
                      monthly payment
                    </p>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                      <div className="grid min-w-[300px] grid-cols-[minmax(100px,1fr)_minmax(100px,auto)_minmax(90px,auto)] gap-px bg-gray-200">
                        {/* Header */}
                        <div className="bg-gray-100 px-2 py-2 text-xs font-semibold text-gray-700 sm:px-4 sm:text-sm">
                          Rate Change
                        </div>
                        <div className="bg-gray-100 px-2 py-2 text-right text-xs font-semibold text-gray-700 sm:px-4 sm:text-sm">
                          Monthly
                        </div>
                        <div className="bg-gray-100 px-2 py-2 text-right text-xs font-semibold text-gray-700 sm:px-4 sm:text-sm">
                          Difference
                        </div>

                        {/* Scenarios */}
                        {rateScenarios.scenarios.map((scenario) => {
                          const payment = calculateHomeLoan(
                            results.loanAmount,
                            scenario.rate,
                            results.loanTermYears
                          ).monthlyPayment;
                          const totalPayment = payment + results.serviceFee;
                          const difference =
                            totalPayment -
                            (results.monthlyPayment + results.serviceFee);

                          return (
                            <Fragment key={scenario.label}>
                              <div
                                className={`px-2 py-2 transition-colors hover:bg-gray-50 sm:px-4 sm:py-3 ${
                                  scenario.highlight
                                    ? 'bg-yellow-50 font-semibold'
                                    : 'bg-white'
                                }`}
                              >
                                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                  <span
                                    className={`text-xs sm:text-sm ${
                                      scenario.change < 0
                                        ? 'text-green-600'
                                        : scenario.change > 0
                                          ? 'text-red-600'
                                          : 'text-gray-900'
                                    }`}
                                  >
                                    {scenario.label}
                                  </span>
                                  {scenario.highlight && (
                                    <span className="rounded-full bg-yellow-200 px-1.5 py-0.5 text-[10px] text-yellow-800 sm:text-xs">
                                      Now
                                    </span>
                                  )}
                                </div>
                                <div className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
                                  {scenario.rate.toFixed(2)}%
                                </div>
                              </div>
                              <div
                                className={`px-2 py-2 text-right text-xs font-semibold transition-colors hover:bg-gray-50 sm:px-4 sm:py-3 sm:text-sm ${
                                  scenario.highlight
                                    ? 'bg-yellow-50'
                                    : 'bg-white'
                                }`}
                              >
                                {formatCurrency(totalPayment)}
                              </div>
                              <div
                                className={`px-2 py-2 text-right text-xs font-semibold transition-colors hover:bg-gray-50 sm:px-4 sm:py-3 sm:text-sm ${
                                  scenario.highlight
                                    ? 'bg-yellow-50'
                                    : 'bg-white'
                                } ${
                                  Math.abs(difference) < 0.01
                                    ? 'text-gray-400'
                                    : difference > 0
                                      ? 'text-red-600'
                                      : 'text-green-600'
                                }`}
                              >
                                {Math.abs(difference) < 0.01
                                  ? '-'
                                  : `${difference > 0 ? '+' : ''}${formatCurrency(difference)}`}
                              </div>
                            </Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Historical Comparison */}
                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-gray-700">
                      Historical Comparison
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      {rateScenarios.historical.map((historic, index) => {
                        const payment = calculateHomeLoan(
                          results.loanAmount,
                          historic.rate,
                          results.loanTermYears
                        ).monthlyPayment;
                        const totalPayment = payment + results.serviceFee;
                        const difference =
                          totalPayment -
                          (results.monthlyPayment + results.serviceFee);
                        const isPeak = historic.label === '2008 Crisis Peak';

                        return (
                          <div
                            key={index}
                            className={`rounded-lg border-2 p-5 ${
                              isPeak
                                ? 'border-red-200 bg-red-50'
                                : 'border-green-200 bg-green-50'
                            }`}
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <span className="font-semibold text-gray-900">
                                {historic.label}
                              </span>
                              <span
                                className={`text-lg font-bold ${
                                  isPeak ? 'text-red-700' : 'text-green-700'
                                }`}
                              >
                                {historic.rate}%
                              </span>
                            </div>
                            <div className="mb-3 text-xs text-gray-600">
                              {historic.description}
                            </div>
                            <div className="mb-1 text-2xl font-bold text-gray-900">
                              {formatCurrency(totalPayment)}
                              <span className="text-sm font-normal text-gray-600">
                                /month
                              </span>
                            </div>
                            <div
                              className={`text-sm ${
                                difference > 0
                                  ? 'text-red-600'
                                  : 'text-green-600'
                              }`}
                            >
                              {difference > 0 ? '+' : ''}
                              {formatCurrency(difference)} vs current rate
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="mb-2 text-sm text-gray-700">
                      <strong>💡 How this works:</strong> Historical comparisons
                      show what <em>your</em> rate would have been based on your
                      margin to prime. If you&apos;re getting prime minus 1%,
                      these calculations show historical prime rates minus 1%.
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Tip:</strong> Even a 0.25% rate change can
                      significantly impact your monthly budget. It&apos;s worth
                      shopping around and negotiating with different banks.{' '}
                      <a
                        href="/data/prime-rates"
                        className="font-semibold text-yellow-600 hover:underline"
                      >
                        View historical rates
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!results && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <p className="text-lg text-gray-500">
              Enter your property details and click Calculate Repayment to see
              your results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
