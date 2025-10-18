import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoanResults {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanAmount: number;
  loanTermYears: number;
  serviceFee: number; // The service fee used in this calculation
}

type TermUnit = "years" | "months";

interface HomeLoanState {
  // Form inputs
  propertyPrice: string;
  deposit: string;
  interestRate: string;
  loanTerm: string; // displayed term value
  termUnit: TermUnit; // "years" or "months"
  monthlyServiceFee: string; // monthly bank service fee
  isAdvancedMode: boolean;

  // Results
  results: LoanResults | null;
  isDirty: boolean; // Track if form has changed since last calculation

  // Actions
  setPropertyPrice: (price: string) => void;
  setDeposit: (deposit: string) => void;
  setInterestRate: (rate: string) => void;
  setLoanTerm: (term: string) => void;
  setTermUnit: (unit: TermUnit) => void;
  setMonthlyServiceFee: (fee: string) => void;
  setIsAdvancedMode: (isAdvanced: boolean) => void;
  setResults: (results: LoanResults | null) => void;
  setIsDirty: (isDirty: boolean) => void;
  resetForm: () => void;
}

const initialState = {
  propertyPrice: "",
  deposit: "",
  interestRate: "10.5", // default to prime rate
  loanTerm: "20",
  termUnit: "years" as TermUnit,
  monthlyServiceFee: "69", // Default R69 service fee
  isAdvancedMode: false,
  results: null as LoanResults | null,
  isDirty: true, // Start as dirty so initial calculation is enabled
};

export const useHomeLoanStore = create<HomeLoanState>()(
  persist(
    (set) => ({
      ...initialState,

      setPropertyPrice: (propertyPrice) =>
        set({ propertyPrice, isDirty: true }),
      setDeposit: (deposit) => set({ deposit, isDirty: true }),
      setInterestRate: (interestRate) => set({ interestRate, isDirty: true }),
      setLoanTerm: (loanTerm) => set({ loanTerm, isDirty: true }),
      setTermUnit: (termUnit) => set({ termUnit, isDirty: true }),
      setMonthlyServiceFee: (monthlyServiceFee) =>
        set({ monthlyServiceFee, isDirty: true }),
      setIsAdvancedMode: (isAdvancedMode) => set({ isAdvancedMode }),
      setResults: (results) => set({ results }),
      setIsDirty: (isDirty) => set({ isDirty }),
      resetForm: () => set(initialState),
    }),
    {
      name: "home-loan-calculator",
      partialize: (state) => ({
        propertyPrice: state.propertyPrice,
        deposit: state.deposit,
        interestRate: state.interestRate,
        loanTerm: state.loanTerm,
        termUnit: state.termUnit,
        monthlyServiceFee: state.monthlyServiceFee,
        isAdvancedMode: state.isAdvancedMode,
        results: state.results,
        isDirty: state.isDirty,
      }),
    },
  ),
);
