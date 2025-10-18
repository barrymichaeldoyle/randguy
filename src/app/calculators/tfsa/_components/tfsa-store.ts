import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DisplayUnit = "years" | "months";

interface TFSAResults {
  remainingContributions: number;
  monthsToMaxOut: number;
  yearsToMaxOut: number;
  projectedMaxOutDate: Date;
  currentProgress: number; // percentage
  annualContribution: number;
}

interface TFSAState {
  // Form inputs
  currentContributions: string;
  monthlyContribution: string;

  // Display preferences
  displayUnit: DisplayUnit;

  // Results
  results: TFSAResults | null;
  isDirty: boolean; // Track if form has changed since last calculation

  // Actions
  setCurrentContributions: (amount: string) => void;
  setMonthlyContribution: (amount: string) => void;
  setDisplayUnit: (unit: DisplayUnit) => void;
  setResults: (results: TFSAResults | null) => void;
  setIsDirty: (isDirty: boolean) => void;
  resetForm: () => void;
}

const initialState = {
  currentContributions: "",
  monthlyContribution: "",
  displayUnit: "years" as DisplayUnit,
  results: null as TFSAResults | null,
  isDirty: true, // Start as dirty so initial calculation is enabled
};

export const useTFSAStore = create<TFSAState>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentContributions: (currentContributions) =>
        set({ currentContributions, isDirty: true }),
      setMonthlyContribution: (monthlyContribution) =>
        set({ monthlyContribution, isDirty: true }),
      setDisplayUnit: (displayUnit) => set({ displayUnit }),
      setResults: (results) => set({ results }),
      setIsDirty: (isDirty) => set({ isDirty }),
      resetForm: () => set(initialState),
    }),
    {
      name: "tfsa-calculator",
      partialize: (state) => ({
        currentContributions: state.currentContributions,
        monthlyContribution: state.monthlyContribution,
        displayUnit: state.displayUnit,
        results: state.results,
        isDirty: state.isDirty,
      }),
    },
  ),
);
