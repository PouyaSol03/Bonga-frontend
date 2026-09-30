import { expect, test } from "@playwright/test";
import {
  calculateRentPriceConversion,
  clampRentConversionMortgage,
  parseRentPriceValue,
} from "../../../src/features/advertisements/create/rentPriceConversion";
import { expandErrorSections } from "../../../src/features/advertisements/create/validationScroll";

test.describe("Ad pricing and section expansion validations", () => {
  test("expandErrorSections detects errors and activates matching accordions", () => {
    const values: Record<string, any> = {
      loanEnabled: false,
      exchangeEnabled: false,
      saleTermsEnabled: false,
      rentConversionEnabled: false,
    };

    const setValue = (key: string, val: any) => {
      values[key] = val;
    };
    const getValues = (key?: string) => (key ? values[key] : values);

    // Loan error triggers loan section expansion
    expandErrorSections({ loanAmount: "مبلغ وام نامعتبر است" }, setValue as any, getValues as any);
    expect(values.loanEnabled).toBe(true);

    // Exchange error triggers exchange section expansion
    expandErrorSections({ exchangeTargets: "لطفا مورد معاوضه را انتخاب کنید" }, setValue as any, getValues as any);
    expect(values.exchangeEnabled).toBe(true);

    // Sale terms error triggers sale terms section expansion
    expandErrorSections({ saleTermsPercent: "درصد نامعتبر است" }, setValue as any, getValues as any);
    expect(values.saleTermsEnabled).toBe(true);

    // Rent conversion error triggers conversion expansion
    expandErrorSections({ rentConversionMortgagePrice: "تبدیل رهن غیرمجاز است" }, setValue as any, getValues as any);
    expect(values.rentConversionEnabled).toBe(true);
  });

  test("rent price conversion calculations convert mortgage and rent accurately", () => {
    // Base test for parseRentPriceValue with persian digits
    expect(parseRentPriceValue("۱,۰۰۰,۰۰۰")).toBe(1_000_000);
    expect(parseRentPriceValue("0")).toBe(0);
    expect(parseRentPriceValue("")).toBe(0);

    // 100M mortgage + 3M rent -> with 90M selected mortgage, converted rent increases by 300,000 (10M / 1M * 30,000)
    const conversion = calculateRentPriceConversion(100_000_000, 3_000_000, 90_000_000);
    expect(conversion.convertedMortgage).toBe(90_000_000);
    expect(conversion.convertedRent).toBe(3_300_000);

    // Clamp mortgage within valid maximum range
    const clamped = clampRentConversionMortgage(500_000_000, 100_000_000, 3_000_000);
    expect(clamped).toBe(200_000_000);
  });
});
