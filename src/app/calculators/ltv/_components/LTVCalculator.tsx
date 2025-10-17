"use client";

import { excali } from "@/fonts";
import { Button } from "@/components/Button";
import { NumericInput } from "@/components/NumericInput";
import { formatCurrency } from "@/lib/calculator-utils";

import { useLTVStore } from "./ltv-store";

function calculateLTV(
  propertyValue: number,
  loanAmount: number,
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
      color: "text-green-700",
      bgColor: "bg-green-50 border-green-200",
      label: "Excellent",
      description: "Best interest rates and loan terms available",
    };
  } else if (ltv <= 90) {
    return {
      color: "text-blue-700",
      bgColor: "bg-blue-50 border-blue-200",
      label: "Good",
      description: "Competitive rates, good approval chances",
    };
  } else if (ltv < 100) {
    return {
      color: "text-yellow-700",
      bgColor: "bg-yellow-50 border-yellow-200",
      label: "Fair",
      description: "Higher rates possible, limited options",
    };
  } else {
    return {
      color: "text-red-700",
      bgColor: "bg-red-50 border-red-200",
      label: "100% Loan",
      description: "Available for qualifying first-time buyers",
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
    setPropertyValue,
    setLoanAmount,
    setDeposit,
    setInputMode,
    setResults,
    clearForm,
  } = useLTVStore();

  const handleCalculate = () => {
    const propValue = parseFloat(propertyValue.replace(/,/g, ""));

    if (isNaN(propValue) || propValue <= 0) {
      alert("Please enter a valid property value");
      return;
    }

    let calculatedLoanAmount: number;

    if (inputMode === "deposit") {
      const depositValue = parseFloat(deposit.replace(/,/g, "")) || 0;
      if (depositValue > propValue) {
        alert("Deposit cannot be greater than property value");
        return;
      }
      calculatedLoanAmount = propValue - depositValue;
    } else {
      calculatedLoanAmount = parseFloat(loanAmount.replace(/,/g, ""));
      if (isNaN(calculatedLoanAmount) || calculatedLoanAmount < 0) {
        alert("Please enter a valid loan amount");
        return;
      }
      if (calculatedLoanAmount > propValue) {
        alert("Loan amount cannot exceed property value");
        return;
      }
    }

    const calculatedResults = calculateLTV(propValue, calculatedLoanAmount);
    setResults(calculatedResults);
  };

  return (
    <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
      {/* Input Form - Left Side */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm lg:sticky lg:top-8">
        <h2 className={`${excali.className} text-2xl mb-6`}>
          Property Details
        </h2>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="propertyValue"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Property Value
            </label>
            <NumericInput
              id="propertyValue"
              value={propertyValue}
              onChange={setPropertyValue}
              placeholder="0"
              prefix="R"
            />
          </div>

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
                  checked={inputMode === "deposit"}
                  onChange={() => setInputMode("deposit")}
                  className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                />
                <span className="ml-2 text-sm text-gray-900">Deposit</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="inputMode"
                  value="loan"
                  checked={inputMode === "loan"}
                  onChange={() => setInputMode("loan")}
                  className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                />
                <span className="ml-2 text-sm text-gray-900">Loan Amount</span>
              </label>
            </div>
          </div>

          {inputMode === "deposit" ? (
            <div>
              <label
                htmlFor="deposit"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Deposit Amount
              </label>
              <NumericInput
                id="deposit"
                value={deposit}
                onChange={setDeposit}
                placeholder="0"
                prefix="R"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter R0 for a 100% loan
              </p>
            </div>
          ) : (
            <div>
              <label
                htmlFor="loanAmount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Loan Amount
              </label>
              <NumericInput
                id="loanAmount"
                value={loanAmount}
                onChange={setLoanAmount}
                placeholder="0"
                prefix="R"
              />
            </div>
          )}

          <div className="space-y-3">
            <Button onClick={handleCalculate} className="w-full" size="lg">
              Calculate LTV
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
                  className={`${excali.className} text-5xl block ${getLTVStatus(results.ltvPercentage).color}`}
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
                  <span
                    className={`${excali.className} text-3xl text-gray-900 block`}
                  >
                    {formatCurrency(results.loanAmount)}
                  </span>
                </div>

                <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                  <span className="text-sm text-gray-600 block mb-1">
                    Your Equity (Deposit)
                  </span>
                  <span
                    className={`${excali.className} text-3xl text-gray-900 block`}
                  >
                    {formatCurrency(results.deposit)}
                  </span>
                </div>
              </div>

              {/* Visual Representation */}
              <div className="pt-4">
                <h3
                  className={`${excali.className} text-lg text-gray-700 mb-3`}
                >
                  Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-10 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full flex items-center justify-end pr-3"
                        style={{
                          width: `${results.ltvPercentage}%`,
                        }}
                      >
                        <span className="text-xs text-white font-semibold">
                          {results.ltvPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-24">
                      Bank Loan
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-10 overflow-hidden">
                      <div
                        className="bg-green-500 h-full flex items-center justify-end pr-3"
                        style={{
                          width: `${results.equityPercentage}%`,
                        }}
                      >
                        <span className="text-xs text-white font-semibold">
                          {results.equityPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-24">
                      Your Equity
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
