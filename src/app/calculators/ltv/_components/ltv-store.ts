import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LTVResults {
  propertyValue: number;
  loanAmount: number;
  deposit: number;
  ltvPercentage: number;
  equityAmount: number;
  equityPercentage: number;
}

interface LTVState {
  // Form inputs
  propertyValue: string;
  loanAmount: string;
  deposit: string;
  inputMode: "loan" | "deposit"; // User can input either loan amount or deposit

  // Results
  results: LTVResults | null;
  isDirty: boolean; // Track if form has changed since last calculation

  // Actions
  setPropertyValue: (value: string) => void;
  setLoanAmount: (amount: string) => void;
  setDeposit: (deposit: string) => void;
  setInputMode: (mode: "loan" | "deposit") => void;
  setResults: (results: LTVResults | null) => void;
  setIsDirty: (isDirty: boolean) => void;
  resetForm: () => void;
}

const initialState = {
  propertyValue: "",
  loanAmount: "",
  deposit: "",
  inputMode: "deposit" as "loan" | "deposit",
  results: null as LTVResults | null,
  isDirty: true, // Start as dirty so initial calculation is enabled
};

export const useLTVStore = create<LTVState>()(
  persist(
    (set) => ({
      ...initialState,

      setPropertyValue: (propertyValue) =>
        set({ propertyValue, isDirty: true }),
      setLoanAmount: (loanAmount) => set({ loanAmount, isDirty: true }),
      setDeposit: (deposit) => set({ deposit, isDirty: true }),
      setInputMode: (inputMode) =>
        set((state) => {
          // Auto-convert when switching modes
          const propValue = parseFloat(state.propertyValue.replace(/,/g, ""));

          // Only convert if we have a valid property value
          if (isNaN(propValue) || propValue <= 0) {
            return { inputMode, isDirty: true };
          }

          if (inputMode === "loan" && state.inputMode === "deposit") {
            // Switching from deposit to loan mode
            // Calculate loan amount from property value and deposit
            const depositValue = parseFloat(state.deposit.replace(/,/g, ""));
            if (!isNaN(depositValue) && depositValue >= 0) {
              const calculatedLoanAmount = propValue - depositValue;
              return {
                inputMode,
                loanAmount: calculatedLoanAmount.toFixed(0),
                isDirty: true,
              };
            }
          } else if (inputMode === "deposit" && state.inputMode === "loan") {
            // Switching from loan to deposit mode
            // Calculate deposit from property value and loan amount
            const loanValue = parseFloat(state.loanAmount.replace(/,/g, ""));
            if (!isNaN(loanValue) && loanValue >= 0) {
              const calculatedDeposit = propValue - loanValue;
              return {
                inputMode,
                deposit: calculatedDeposit.toFixed(0),
                isDirty: true,
              };
            }
          }

          return { inputMode, isDirty: true };
        }),
      setResults: (results) => set({ results }),
      setIsDirty: (isDirty) => set({ isDirty }),
      resetForm: () => set(initialState),
    }),
    {
      name: "ltv-calculator",
      partialize: (state) => ({
        propertyValue: state.propertyValue,
        loanAmount: state.loanAmount,
        deposit: state.deposit,
        inputMode: state.inputMode,
        results: state.results,
        isDirty: state.isDirty,
      }),
    },
  ),
);
