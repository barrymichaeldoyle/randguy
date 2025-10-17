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

  // Actions
  setPropertyValue: (value: string) => void;
  setLoanAmount: (amount: string) => void;
  setDeposit: (deposit: string) => void;
  setInputMode: (mode: "loan" | "deposit") => void;
  setResults: (results: LTVResults | null) => void;
  clearForm: () => void;
}

const initialState = {
  propertyValue: "",
  loanAmount: "",
  deposit: "",
  inputMode: "deposit" as "loan" | "deposit",
  results: null as LTVResults | null,
};

export const useLTVStore = create<LTVState>()(
  persist(
    (set) => ({
      ...initialState,

      setPropertyValue: (propertyValue) => set({ propertyValue }),
      setLoanAmount: (loanAmount) => set({ loanAmount }),
      setDeposit: (deposit) => set({ deposit }),
      setInputMode: (inputMode) => set({ inputMode }),
      setResults: (results) => set({ results }),
      clearForm: () => set(initialState),
    }),
    {
      name: "ltv-calculator",
    },
  ),
);
