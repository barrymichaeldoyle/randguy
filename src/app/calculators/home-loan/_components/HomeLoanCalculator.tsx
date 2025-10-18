"use client";

import { useRef, useEffect } from "react";
import { excali } from "@/fonts";
import { Button } from "@/components/Button";
import { NumericInput } from "@/components/NumericInput";
import { FormField } from "@/components/FormField";
import { Select } from "@/components/Select";
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

type TermUnit = "years" | "months";

export default function HomeLoanCalculator() {
  const {
    propertyPrice,
    deposit,
    interestRate,
    loanTerm,
    termUnit,
    monthlyServiceFee,
    results,
    isDirty,
    setPropertyPrice,
    setDeposit,
    setInterestRate,
    setLoanTerm,
    setTermUnit,
    setMonthlyServiceFee,
    setResults,
    setIsDirty,
    resetForm,
  } = useHomeLoanStore();

  // Store the last entered value for each unit to avoid losing precision
  const termByUnit = useRef<Record<TermUnit, string>>({
    years: "",
    months: "",
  });
  const previousUnit = useRef<TermUnit>(termUnit);

  // Convert term between years and months
  const convertTerm = (value: string, from: TermUnit, to: TermUnit): string => {
    if (!value || value === "") return "";
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "";

    if (from === "years" && to === "months") {
      // Years to months: multiply by 12, no decimals for months
      return Math.round(numValue * 12).toString();
    } else if (from === "months" && to === "years") {
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
    const otherUnit = termUnit === "years" ? "months" : "years";
    termByUnit.current[otherUnit] = "";
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

    if (termUnit === "months") {
      return termValue / 12;
    }
    return termValue;
  };

  const handleCalculate = () => {
    const priceValue = parseFloat(propertyPrice.replace(/,/g, ""));
    const depositValue = parseFloat(deposit.replace(/,/g, "")) || 0;
    const rateValue = parseFloat(interestRate);
    const termInYears = getTermInYears();

    if (isNaN(priceValue) || priceValue <= 0) {
      alert("Please enter a valid property price");
      return;
    }

    if (isNaN(rateValue) || rateValue <= 0) {
      alert("Please enter a valid interest rate");
      return;
    }

    if (termInYears <= 0) {
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
      termInYears,
    );
    setResults(calculatedResults);
    setIsDirty(false); // Mark as clean after successful calculation
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
                Deposit{" "}
                {deposit && propertyPrice && (
                  <span className="text-gray-500 font-normal">
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
            label="Interest Rate (% per year)"
            htmlFor="interestRate"
            helperText="SA prime rate: 10.5% (Oct 2025). Shop around and negotiate!"
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
              termUnit === "years"
                ? "Typical: 20-30 years"
                : "Typical: 240-360 months"
            }
          >
            <div className="flex gap-2">
              <div className="flex-1">
                <NumericInput
                  id="loanTerm"
                  value={loanTerm}
                  onChange={handleTermChange}
                  placeholder={termUnit === "years" ? "20" : "240"}
                  allowDecimals={termUnit === "years"}
                  max={termUnit === "years" ? 100 : 1200}
                />
              </div>
              <Select
                value={termUnit}
                onChange={setTermUnit}
                options={[
                  { value: "years", label: "Years" },
                  { value: "months", label: "Months" },
                ]}
                className="w-30"
              />
            </div>
          </FormField>

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

          <div className="space-y-3">
            <Button
              onClick={handleCalculate}
              className="w-full"
              size="lg"
              disabled={!isDirty && results !== null}
            >
              {!isDirty && results !== null
                ? "Calculated"
                : "Calculate Repayment"}
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
                  Total Monthly Payment
                </span>
                <span className="text-5xl font-bold text-green-700 block">
                  {formatCurrency(
                    results.monthlyPayment +
                      parseFloat(monthlyServiceFee || "0"),
                  )}
                </span>
                <span className="text-xs text-gray-600 block mt-2">
                  for {results.loanTermYears} years
                </span>
                {parseFloat(monthlyServiceFee || "0") > 0 && (
                  <div className="text-xs text-gray-600 mt-2 pt-2 border-t border-green-200">
                    Bond: {formatCurrency(results.monthlyPayment)} + Service
                    Fee: {formatCurrency(parseFloat(monthlyServiceFee))}
                  </div>
                )}
              </div>

              {/* Loan Summary */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <span className="text-sm text-gray-600 block mb-1">
                    Loan Amount
                  </span>
                  <span className="text-3xl font-bold text-gray-900 block">
                    {formatCurrency(results.loanAmount)}
                  </span>
                </div>

                <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
                  <span className="text-sm text-gray-600 block mb-1">
                    Total Interest
                  </span>
                  <span className="text-3xl font-bold text-gray-900 block">
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
                    <span className="text-2xl font-bold text-gray-900">
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
                <div className="bg-gray-200 rounded-lg h-12 overflow-hidden flex">
                  {(() => {
                    const principalPercent =
                      (results.loanAmount / results.totalPayment) * 100;
                    const interestPercent =
                      (results.totalInterest / results.totalPayment) * 100;

                    return (
                      <>
                        <div
                          className="bg-green-500 flex items-center justify-center transition-all"
                          style={{
                            width: `${principalPercent}%`,
                          }}
                        >
                          {principalPercent >= 15 && (
                            <span className="text-sm text-white font-semibold">
                              {principalPercent >= 25
                                ? `Principal ${principalPercent.toFixed(1)}%`
                                : `${principalPercent.toFixed(1)}%`}
                            </span>
                          )}
                        </div>
                        <div
                          className="bg-yellow-500 flex items-center justify-center transition-all"
                          style={{
                            width: `${interestPercent}%`,
                          }}
                        >
                          {interestPercent >= 15 && (
                            <span className="text-sm text-white font-semibold">
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
                <div className="flex items-center justify-center gap-6 mt-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
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
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
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
