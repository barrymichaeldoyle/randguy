"use client";

import { excali } from "@/fonts";
import { Button } from "@/components/Button";
import { NumericInput } from "@/components/NumericInput";
import { formatCurrency } from "@/lib/calculator-utils";

import { useHomeLoanStore } from "./home-loan-store";

function calculateHomeLoan(
  loanAmount: number,
  annualRate: number,
  years: number,
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

export default function HomeLoanCalculator() {
  const {
    propertyPrice,
    deposit,
    interestRate,
    loanTerm,
    results,
    setPropertyPrice,
    setDeposit,
    setInterestRate,
    setLoanTerm,
    setResults,
    clearForm,
  } = useHomeLoanStore();

  const handleCalculate = () => {
    const priceValue = parseFloat(propertyPrice.replace(/,/g, ""));
    const depositValue = parseFloat(deposit.replace(/,/g, "")) || 0;
    const rateValue = parseFloat(interestRate);
    const termValue = parseFloat(loanTerm);

    if (isNaN(priceValue) || priceValue <= 0) {
      alert("Please enter a valid property price");
      return;
    }

    if (isNaN(rateValue) || rateValue <= 0) {
      alert("Please enter a valid interest rate");
      return;
    }

    if (isNaN(termValue) || termValue <= 0) {
      alert("Please enter a valid loan term");
      return;
    }

    if (depositValue >= priceValue) {
      alert("Deposit cannot be equal to or greater than property price");
      return;
    }

    const loanAmount = priceValue - depositValue;

    if (loanAmount <= 0) {
      alert("Loan amount must be greater than zero");
      return;
    }

    const calculatedResults = calculateHomeLoan(
      loanAmount,
      rateValue,
      termValue,
    );
    setResults(calculatedResults);
  };

  const depositPercentage =
    propertyPrice && deposit
      ? (
          (parseFloat(deposit.replace(/,/g, "")) /
            parseFloat(propertyPrice.replace(/,/g, ""))) *
          100
        ).toFixed(1)
      : "0";

  return (
    <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
      {/* Input Form - Left Side */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm lg:sticky lg:top-8">
        <h2 className={`${excali.className} text-2xl mb-6`}>Loan Details</h2>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="propertyPrice"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Property Price
            </label>
            <NumericInput
              id="propertyPrice"
              value={propertyPrice}
              onChange={setPropertyPrice}
              placeholder="0"
              prefix="R"
            />
          </div>

          <div>
            <label
              htmlFor="deposit"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Deposit{" "}
              {deposit && propertyPrice && (
                <span className="text-gray-500 font-normal">
                  ({depositPercentage}%)
                </span>
              )}
            </label>
            <NumericInput
              id="deposit"
              value={deposit}
              onChange={setDeposit}
              placeholder="0"
              prefix="R"
            />
            <p className="text-xs text-gray-500 mt-1">
              Banks may offer 100% loans for first-time buyers (0% deposit)
            </p>
          </div>

          <div>
            <label
              htmlFor="interestRate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Interest Rate (% per year)
            </label>
            <NumericInput
              id="interestRate"
              value={interestRate}
              onChange={setInterestRate}
              placeholder="10.5"
              suffix="%"
            />
            <p className="text-xs text-gray-500 mt-1">
              SA prime rate: 10.5% (Oct 2025). Shop around and negotiate!
            </p>
          </div>

          <div>
            <label
              htmlFor="loanTerm"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Loan Term (years)
            </label>
            <NumericInput
              id="loanTerm"
              value={loanTerm}
              onChange={setLoanTerm}
              placeholder="20"
            />
            <p className="text-xs text-gray-500 mt-1">Typical: 20-30 years</p>
          </div>

          <div className="space-y-3">
            <Button onClick={handleCalculate} className="w-full" size="lg">
              Calculate Repayment
            </Button>
            <button
              type="button"
              onClick={clearForm}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Clear Form
            </button>
          </div>
        </div>
      </div>

      {/* Results - Right Side */}
      <div className="min-h-[400px]">
        {results && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className={`${excali.className} text-2xl mb-6`}>
              Repayment Breakdown
            </h2>

            <div className="space-y-6">
              {/* Primary Result - Monthly Payment */}
              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                <span className="text-sm text-gray-600 block mb-1">
                  Monthly Repayment
                </span>
                <span
                  className={`${excali.className} text-5xl text-green-700 block`}
                >
                  {formatCurrency(results.monthlyPayment)}
                </span>
                <span className="text-xs text-gray-600 block mt-2">
                  for {results.loanTermYears} years
                </span>
              </div>

              {/* Loan Summary */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <span className="text-sm text-gray-600 block mb-1">
                    Loan Amount
                  </span>
                  <span
                    className={`${excali.className} text-3xl text-gray-900 block`}
                  >
                    {formatCurrency(results.loanAmount)}
                  </span>
                </div>

                <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
                  <span className="text-sm text-gray-600 block mb-1">
                    Total Interest
                  </span>
                  <span
                    className={`${excali.className} text-3xl text-gray-900 block`}
                  >
                    {formatCurrency(results.totalInterest)}
                  </span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <h3
                  className={`${excali.className} text-xl text-gray-700 mb-3`}
                >
                  Total Cost Over {results.loanTermYears} Years
                </h3>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Loan Amount</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(results.loanAmount)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Total Interest Paid</span>
                  <span className="text-yellow-600 font-semibold">
                    {formatCurrency(results.totalInterest)}
                  </span>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">
                      Total Amount to Repay
                    </span>
                    <span
                      className={`${excali.className} text-2xl text-gray-900`}
                    >
                      {formatCurrency(results.totalPayment)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual representation */}
              <div className="pt-4">
                <h3
                  className={`${excali.className} text-lg text-gray-700 mb-3`}
                >
                  Cost Breakdown
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-green-500 h-full flex items-center justify-end pr-2"
                        style={{
                          width: `${(results.loanAmount / results.totalPayment) * 100}%`,
                        }}
                      >
                        <span className="text-xs text-white font-semibold">
                          {(
                            (results.loanAmount / results.totalPayment) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-24">
                      Principal
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-yellow-500 h-full flex items-center justify-end pr-2"
                        style={{
                          width: `${(results.totalInterest / results.totalPayment) * 100}%`,
                        }}
                      >
                        <span className="text-xs text-white font-semibold">
                          {(
                            (results.totalInterest / results.totalPayment) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-24">Interest</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!results && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <p className="text-gray-500 text-lg">
              Enter your property details and click Calculate Repayment to see
              your results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
