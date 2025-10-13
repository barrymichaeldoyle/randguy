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

  // Actions
  setIncome: (income: string) => void;
  setPayFrequency: (frequency: PayFrequency) => void;
  setAgeGroup: (group: AgeGroup) => void;
  setTaxYear: (year: TaxYear) => void;
  setIsSalary: (isSalary: boolean) => void;
  setIsAdvancedMode: (isAdvanced: boolean) => void;
  setResults: (results: TaxResults | null) => void;
  clearForm: () => void;
}

const initialState = {
  income: "",
  payFrequency: "monthly" as PayFrequency,
  ageGroup: "under65" as AgeGroup,
  taxYear: "2025/2026" as TaxYear,
  isSalary: true,
  isAdvancedMode: false,
  results: null as TaxResults | null,
};

export const useIncomeTaxStore = create<IncomeTaxState>()(
  persist(
    (set) => ({
      ...initialState,

      setIncome: (income) => set({ income }),
      setPayFrequency: (payFrequency) => set({ payFrequency }),
      setAgeGroup: (ageGroup) => set({ ageGroup }),
      setTaxYear: (taxYear) => set({ taxYear }),
      setIsSalary: (isSalary) => set({ isSalary }),
      setIsAdvancedMode: (isAdvancedMode) => set({ isAdvancedMode }),
      setResults: (results) => set({ results }),
      clearForm: () => set(initialState),
    }),
    {
      name: "income-tax-calculator",
    },
  ),
);
