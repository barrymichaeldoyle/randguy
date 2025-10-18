import { create } from "zustand";
import { persist } from "zustand/middleware";

type AgeGroup = "under65" | "65to74" | "75plus";
type PayFrequency = "monthly" | "annual" | "biweekly" | "weekly";
type TaxYear =
  | "2021/2022"
  | "2022/2023"
  | "2023/2024"
  | "2024/2025"
  | "2025/2026";

interface TaxResults {
  taxableIncome: number;
  taxBeforeRebates: number;
  rebates: number;
  taxPayable: number;
  effectiveRate: number;
  marginalRate: number;
  monthlyTax: number;
  uifMonthly: number;
  uifAnnual: number;
  takeHomePay: number;
  monthlyTakeHome: number;
  previousYear: (TaxYear | "2020/2021") | null;
  previousYearResults: {
    taxableIncome: number;
    taxBeforeRebates: number;
    rebates: number;
    taxPayable: number;
    effectiveRate: number;
    marginalRate: number;
    monthlyTax: number;
    uifMonthly: number;
    uifAnnual: number;
    takeHomePay: number;
    monthlyTakeHome: number;
  } | null;
}

interface IncomeTaxState {
  // Form inputs
  income: string;
  payFrequency: PayFrequency;
  ageGroup: AgeGroup;
  taxYear: TaxYear;
  isSalary: boolean;
  isAdvancedMode: boolean;

  // Results
  results: TaxResults | null;
  isDirty: boolean; // Track if form has changed since last calculation

  // Actions
  setIncome: (income: string) => void;
  setPayFrequency: (frequency: PayFrequency) => void;
  setAgeGroup: (group: AgeGroup) => void;
  setTaxYear: (year: TaxYear) => void;
  setIsSalary: (isSalary: boolean) => void;
  setIsAdvancedMode: (isAdvanced: boolean) => void;
  setResults: (results: TaxResults | null) => void;
  setIsDirty: (isDirty: boolean) => void;
  resetForm: () => void;
}

const initialState = {
  income: "",
  payFrequency: "monthly" as PayFrequency,
  ageGroup: "under65" as AgeGroup,
  taxYear: "2025/2026" as TaxYear,
  isSalary: true,
  isAdvancedMode: false,
  results: null as TaxResults | null,
  isDirty: true, // Start as dirty so initial calculation is enabled
};

export const useIncomeTaxStore = create<IncomeTaxState>()(
  persist(
    (set) => ({
      ...initialState,

      setIncome: (income) => set({ income, isDirty: true }),
      setPayFrequency: (payFrequency) => set({ payFrequency, isDirty: true }),
      setAgeGroup: (ageGroup) => set({ ageGroup, isDirty: true }),
      setTaxYear: (taxYear) => set({ taxYear, isDirty: true }),
      setIsSalary: (isSalary) => set({ isSalary, isDirty: true }),
      setIsAdvancedMode: (isAdvancedMode) =>
        set({ isAdvancedMode, isDirty: true }),
      setResults: (results) => set({ results }),
      setIsDirty: (isDirty) => set({ isDirty }),
      resetForm: () => set(initialState),
    }),
    {
      name: "income-tax-calculator",
      partialize: (state) => ({
        income: state.income,
        payFrequency: state.payFrequency,
        ageGroup: state.ageGroup,
        taxYear: state.taxYear,
        isSalary: state.isSalary,
        isAdvancedMode: state.isAdvancedMode,
        results: state.results,
        isDirty: state.isDirty,
      }),
    },
  ),
);
