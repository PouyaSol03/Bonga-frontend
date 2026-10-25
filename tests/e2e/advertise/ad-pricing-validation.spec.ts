import { expect, test } from "@playwright/test";
import type { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import type { NewAdFormValues } from "../../../src/features/advertisements/create/types";
import {
  calculateRentPriceConversion,
  clampRentConversionMortgage,
  getRentConversionSnapPoints,
  parseRentPriceValue,
  RENT_CONVERSION_SNAP_ROUND_UNIT,
  resolveMagneticRentValue,
} from "../../../src/features/advertisements/create/rentPriceConversion";
import { expandErrorSections } from "../../../src/features/advertisements/create/validationScroll";

test.describe("Ad pricing and section expansion validations", () => {
  test("expandErrorSections detects errors and activates matching accordions", () => {
    const values: Partial<NewAdFormValues> = {
      loanEnabled: false,
      exchangeEnabled: false,
      saleTermsEnabled: false,
      rentConversionEnabled: false,
    };

    const setValue: UseFormSetValue<NewAdFormValues> = (key, val) => {
      values[key] = val;
    };
    const getValues: UseFormGetValues<NewAdFormValues> = ((key?: keyof NewAdFormValues) =>
      key ? values[key] : values) as UseFormGetValues<NewAdFormValues>;

    // Loan error triggers loan section expansion
    expandErrorSections({ loanAmount: "مبلغ وام نامعتبر است" }, setValue, getValues);
    expect(values.loanEnabled).toBe(true);

    // Exchange error triggers exchange section expansion
    expandErrorSections(
      { exchangeTargets: "لطفا مورد معاوضه را انتخاب کنید" },
      setValue,
      getValues,
    );
    expect(values.exchangeEnabled).toBe(true);

    // Sale terms error triggers sale terms section expansion
    expandErrorSections(
      { saleTermsPercent: "درصد نامعتبر است" },
      setValue,
      getValues,
    );
    expect(values.saleTermsEnabled).toBe(true);

    // Rent conversion error triggers conversion expansion
    expandErrorSections(
      { rentConversionMortgagePrice: "تبدیل رهن غیرمجاز است" },
      setValue,
      getValues,
    );
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

  test("generates 7 snap points (2 on sides + 5 in middle) rounded to 50,000,000 for rent conversion", () => {
    expect(RENT_CONVERSION_SNAP_ROUND_UNIT).toBe(50_000_000);

    // 1.2 billion maximum mortgage generates 2 on sides + 5 in middle
    const points12B = getRentConversionSnapPoints(1_200_000_000);
    expect(points12B).toHaveLength(7);
    expect(points12B).toEqual([
      0,
      200_000_000,
      400_000_000,
      600_000_000,
      800_000_000,
      1_000_000_000,
      1_200_000_000,
    ]);

    // All points are multiples of 50M
    for (const point of points12B) {
      expect(point % RENT_CONVERSION_SNAP_ROUND_UNIT).toBe(0);
    }

    // 1 billion maximum mortgage generates 7 points rounded to 50M
    const points1B = getRentConversionSnapPoints(1_000_000_000);
    expect(points1B).toHaveLength(7);
    expect(points1B).toEqual([
      0,
      150_000_000,
      350_000_000,
      500_000_000,
      650_000_000,
      850_000_000,
      1_000_000_000,
    ]);

    // 2,167,000,000 maximum mortgage (from ad 295) generates 7 points rounded to 50M
    const pointsAd295 = getRentConversionSnapPoints(2_167_000_000);
    expect(pointsAd295).toHaveLength(7);
    for (const point of pointsAd295) {
      expect(point % RENT_CONVERSION_SNAP_ROUND_UNIT).toBe(0);
      expect(point).toBeLessThanOrEqual(2_167_000_000);
    }
  });

  test("magnetic attraction pulls mover near snap points without blocking nearby numbers", () => {
    const max = 1_000_000_000;
    const snapPoints = getRentConversionSnapPoints(max);

    // Approaching 500M: raw 498M is pulled magnetically to 500M
    const resultNear500 = resolveMagneticRentValue({
      activeSnappedPoint: null,
      maximumMortgage: max,
      raw: 498_000_000,
      snapPoints,
    });
    expect(resultNear500.snappedPoint).toBe(500_000_000);
    expect(resultNear500.value).toBe(500_000_000);

    // Numbers close to snap points outside magnetic threshold remain accessible (not cut into 50M steps)
    const resultAt480 = resolveMagneticRentValue({
      activeSnappedPoint: null,
      maximumMortgage: max,
      raw: 480_000_000,
      snapPoints,
    });
    expect(resultAt480.snappedPoint).toBeNull();
    expect(resultAt480.value).toBe(480_000_000);

    const resultAt520 = resolveMagneticRentValue({
      activeSnappedPoint: null,
      maximumMortgage: max,
      raw: 520_000_000,
      snapPoints,
    });
    expect(resultAt520.snappedPoint).toBeNull();
    expect(resultAt520.value).toBe(520_000_000);

    // When pulling away past release radius, breaks free from active magnet
    const pullAway = resolveMagneticRentValue({
      activeSnappedPoint: 500_000_000,
      maximumMortgage: max,
      raw: 480_000_000,
      snapPoints,
    });
    expect(pullAway.snappedPoint).toBeNull();
    expect(pullAway.value).toBe(480_000_000);
  });
});
