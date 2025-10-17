import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoanResults {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanAmount: number;
  loanTermYears: number;
}

interface HomeLoanState {
  // Form inputs
  propertyPrice: string;
  deposit: string;
  interestRate: string;
  loanTerm: string; // in years

  // Results
  results: LoanResults | null;

  // Actions
  setPropertyPrice: (price: string) => void;
  setDeposit: (deposit: string) => void;
  setInterestRate: (rate: string) => void;
  setLoanTerm: (term: string) => void;
  setResults: (results: LoanResults | null) => void;
  clearForm: () => void;
}

const initialState = {
  propertyPrice: "",
  deposit: "",
  interestRate: "",
  loanTerm: "20",
  results: null as LoanResults | null,
};

export const useHomeLoanStore = create<HomeLoanState>()(
  persist(
    (set) => ({
      ...initialState,

      setPropertyPrice: (propertyPrice) => set({ propertyPrice }),
      setDeposit: (deposit) => set({ deposit }),
      setInterestRate: (interestRate) => set({ interestRate }),
      setLoanTerm: (loanTerm) => set({ loanTerm }),
      setResults: (results) => set({ results }),
      clearForm: () => set(initialState),
    }),
    {
      name: "home-loan-calculator",
    },
  ),
);
