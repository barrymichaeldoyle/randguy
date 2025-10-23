import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type InterestPeriod =
  | 'annual'
  | 'monthly'
  | 'weekly'
  | 'daily'
  | 'hourly';

export type CompoundingFrequency =
  | 'annually'
  | 'semi-annually'
  | 'quarterly'
  | 'monthly'
  | 'weekly'
  | 'daily'
  | 'hourly'
  | 'continuously';

export type InterestType =
  | 'simple'
  | 'compound-monthly'
  | 'compound-quarterly'
  | 'compound-semi-annually'
  | 'compound-annually'
  | 'compound-weekly'
  | 'compound-daily'
  | 'compound-hourly'
  | 'compound-continuously';

interface InterestResults {
  annualGain: number;
  monthlyGain: number;
  weeklyGain: number;
  dailyGain: number;
  hourlyGain: number;
  effectiveAnnualRate: number; // The actual annual rate calculated from the input
  totalAfterOneYear: number; // Total amount after 1 year
  // Store the input values used for this calculation
  calculatedWith: {
    principal: number;
    interestRate: number;
    inputPeriod: InterestPeriod;
    interestType: InterestType;
    compoundingFrequency: CompoundingFrequency;
  };
}

interface InterestState {
  // Form inputs
  principal: string;
  interestRate: string;
  inputPeriod: InterestPeriod;
  interestType: InterestType;

  // Results
  results: InterestResults | null;
  isDirty: boolean; // Track if form has changed since last calculation

  // Actions
  setPrincipal: (amount: string) => void;
  setInterestRate: (rate: string) => void;
  setInputPeriod: (period: InterestPeriod) => void;
  setInterestType: (type: InterestType) => void;
  setResults: (results: InterestResults | null) => void;
  setIsDirty: (isDirty: boolean) => void;
  resetForm: () => void;
}

const initialState = {
  principal: '',
  interestRate: '',
  inputPeriod: 'annual' as InterestPeriod,
  interestType: 'compound-daily' as InterestType,
  results: null as InterestResults | null,
  isDirty: true, // Start as dirty so initial calculation is enabled
};

export const useInterestStore = create<InterestState>()(
  persist(
    (set) => ({
      ...initialState,

      setPrincipal: (principal) => set({ principal, isDirty: true }),
      setInterestRate: (interestRate) => set({ interestRate, isDirty: true }),
      setInputPeriod: (inputPeriod) => set({ inputPeriod, isDirty: true }),
      setInterestType: (interestType) => set({ interestType, isDirty: true }),
      setResults: (results) => set({ results }),
      setIsDirty: (isDirty) => set({ isDirty }),
      resetForm: () => set(initialState),
    }),
    {
      name: 'interest-calculator',
      partialize: (state) => ({
        principal: state.principal,
        interestRate: state.interestRate,
        inputPeriod: state.inputPeriod,
        interestType: state.interestType,
        results: state.results,
        isDirty: state.isDirty,
      }),
    }
  )
);
