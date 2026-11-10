import type { NewAdFormValues, SheetState } from "../../types";

export type SetDetailsField = <T extends keyof NewAdFormValues>(key: T, value: NewAdFormValues[T]) => void;
export type OpenDetailsSheet = (sheet: SheetState | null) => void;
export type PricingValues = Pick<NewAdFormValues,
  | "builderSharePercent" | "minPrice" | "maxPrice" | "normalDailyPrice"
  | "weekendDailyPrice" | "specialDailyPrice" | "extraPersonPrice" | "mortgagePrice"
  | "rentPrice" | "rentConversionEnabled" | "rentConversionMortgagePrice" | "price"
  | "loanEnabled" | "loanAmount" | "loanInstallment" | "exchangeEnabled"
  | "exchangeTargets" | "saleTermsEnabled" | "saleTermsPercent" | "saleTermsInstallmentMonths"
>;
