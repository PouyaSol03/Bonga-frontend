export const RENT_CONVERSION_MORTGAGE_UNIT = 1_000_000;
export const RENT_CONVERSION_RENT_PER_UNIT = 30_000;

function finiteNonNegative(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function parseRentPriceValue(value: string | number | null | undefined) {
  if (typeof value === "number") return finiteNonNegative(value);

  const normalized = String(value ?? "")
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/,/g, "")
    .trim();
  const number = Number(normalized);

  return normalized && Number.isFinite(number) ? Math.max(0, number) : 0;
}

export function getRentEquivalentMortgage(mortgagePrice: number, rentPrice: number) {
  const mortgage = finiteNonNegative(mortgagePrice);
  const rent = finiteNonNegative(rentPrice);

  return mortgage + (rent / RENT_CONVERSION_RENT_PER_UNIT) * RENT_CONVERSION_MORTGAGE_UNIT;
}

export function clampRentConversionMortgage(
  selectedMortgagePrice: number,
  mortgagePrice: number,
  rentPrice: number,
) {
  const maximum = getRentEquivalentMortgage(mortgagePrice, rentPrice);

  if (maximum <= 0) return 0;

  const clamped = Math.min(maximum, Math.max(0, finiteNonNegative(selectedMortgagePrice)));
  const stepped = Math.round(clamped / RENT_CONVERSION_MORTGAGE_UNIT) * RENT_CONVERSION_MORTGAGE_UNIT;

  return Math.min(maximum, stepped);
}

export type RentPriceConversionResult = {
  baseMortgage: number;
  baseRent: number;
  maximumMortgage: number;
  convertedMortgage: number;
  convertedRent: number;
  mortgageDelta: number;
  rentDelta: number;
  positionPercent: number;
};

export function calculateRentPriceConversion(
  mortgagePrice: string | number | null | undefined,
  rentPrice: string | number | null | undefined,
  selectedMortgagePrice: string | number | null | undefined,
): RentPriceConversionResult {
  const baseMortgage = parseRentPriceValue(mortgagePrice);
  const baseRent = parseRentPriceValue(rentPrice);
  const maximumMortgage = getRentEquivalentMortgage(baseMortgage, baseRent);
  const requestedMortgage = parseRentPriceValue(selectedMortgagePrice);
  const convertedMortgage = clampRentConversionMortgage(
    requestedMortgage,
    baseMortgage,
    baseRent,
  );
  const convertedRent = maximumMortgage <= 0
    ? 0
    : Math.max(
        0,
        Math.round(
          ((maximumMortgage - convertedMortgage) / RENT_CONVERSION_MORTGAGE_UNIT) *
            RENT_CONVERSION_RENT_PER_UNIT,
        ),
      );

  return {
    baseMortgage,
    baseRent,
    maximumMortgage,
    convertedMortgage,
    convertedRent,
    mortgageDelta: convertedMortgage - baseMortgage,
    rentDelta: convertedRent - baseRent,
    positionPercent: maximumMortgage > 0
      ? Math.min(100, Math.max(0, (convertedMortgage / maximumMortgage) * 100))
      : 0,
  };
}
