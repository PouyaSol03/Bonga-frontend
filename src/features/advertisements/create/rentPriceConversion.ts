export const RENT_CONVERSION_MORTGAGE_UNIT = 1_000_000;
export const RENT_CONVERSION_RENT_PER_UNIT = 30_000;
export const RENT_CONVERSION_SNAP_ROUND_UNIT = 50_000_000;

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

function getRentEquivalentMortgage(mortgagePrice: number, rentPrice: number) {
  const mortgage = finiteNonNegative(mortgagePrice);
  const rent = finiteNonNegative(rentPrice);

  const fullUnits = Math.floor(rent / RENT_CONVERSION_RENT_PER_UNIT);
  const remainder = rent % RENT_CONVERSION_RENT_PER_UNIT;
  const extraUnit = remainder >= 20_000 ? 1 : 0;
  const convertibleUnits = fullUnits + extraUnit;

  return mortgage + convertibleUnits * RENT_CONVERSION_MORTGAGE_UNIT;
}

export function clampRentConversionMortgage(
  selectedMortgagePrice: number,
  mortgagePrice: number,
  rentPrice: number,
) {
  const maximum = getRentEquivalentMortgage(mortgagePrice, rentPrice);

  if (maximum <= 0) return 0;

  const clamped = Math.min(maximum, Math.max(0, finiteNonNegative(selectedMortgagePrice)));
  const stepped =
    Math.round(clamped / RENT_CONVERSION_MORTGAGE_UNIT) * RENT_CONVERSION_MORTGAGE_UNIT;

  return Math.min(maximum, stepped);
}

type RentPriceConversionResult = {
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
  const convertedMortgage = clampRentConversionMortgage(requestedMortgage, baseMortgage, baseRent);
  const mortgageStepDiff = Math.round(
    (convertedMortgage - baseMortgage) / RENT_CONVERSION_MORTGAGE_UNIT,
  );

  let convertedRent = 0;
  if (maximumMortgage > 0) {
    if (mortgageStepDiff <= 0) {
      convertedRent = baseRent + Math.abs(mortgageStepDiff) * RENT_CONVERSION_RENT_PER_UNIT;
    } else {
      if (convertedMortgage >= maximumMortgage) {
        convertedRent = 0;
      } else {
        convertedRent = Math.max(
          0,
          Math.round(baseRent - mortgageStepDiff * RENT_CONVERSION_RENT_PER_UNIT),
        );
      }
    }
  }

  return {
    baseMortgage,
    baseRent,
    maximumMortgage,
    convertedMortgage,
    convertedRent,
    mortgageDelta: convertedMortgage - baseMortgage,
    rentDelta: convertedRent - baseRent,
    positionPercent:
      maximumMortgage > 0
        ? Math.min(100, Math.max(0, (convertedMortgage / maximumMortgage) * 100))
        : 0,
  };
}

export function getRentConversionSnapPoints(maximumMortgage: number): number[] {
  const max = Math.max(0, Math.round(maximumMortgage));
  if (max <= 0) return [0];

  const maxMultiple =
    Math.floor(max / RENT_CONVERSION_SNAP_ROUND_UNIT) * RENT_CONVERSION_SNAP_ROUND_UNIT;
  const lastPoint = maxMultiple > 0 ? maxMultiple : max;

  // 2 on sides (0 and lastPoint) + 5 in the middle (1/6, 2/6, 3/6, 4/6, 5/6)
  const fractions = [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1];

  const points = fractions.map((fraction, index) => {
    if (index === 0) return 0;
    if (index === fractions.length - 1) return lastPoint;
    const rawVal = fraction * max;
    const rounded =
      Math.round(rawVal / RENT_CONVERSION_SNAP_ROUND_UNIT) * RENT_CONVERSION_SNAP_ROUND_UNIT;
    return Math.min(max, Math.max(0, rounded));
  });

  return Array.from(new Set(points)).sort((a, b) => a - b);
}

export function resolveMagneticRentValue({
  activeSnappedPoint,
  maximumMortgage,
  raw,
  snapPoints,
}: {
  activeSnappedPoint: number | null;
  maximumMortgage: number;
  raw: number;
  snapPoints: number[];
}): { snappedPoint: number | null; value: number } {
  const max = Math.max(0, Math.round(maximumMortgage));
  if (max <= 0) return { snappedPoint: null, value: 0 };

  const halfStep = RENT_CONVERSION_MORTGAGE_UNIT / 2;
  if (Math.abs(raw - max) < halfStep) {
    return { snappedPoint: max, value: max };
  }

  // Magnetic capture and release radii (capped at 8M so adjacent values remain freely selectable)
  const captureRadius = Math.min(
    8_000_000,
    Math.max(3_000_000, Math.round(max * 0.015)),
  );
  const releaseRadius = captureRadius + 4_000_000;

  // 1. If currently captured on a snap point, stay until user pulls past releaseRadius
  if (activeSnappedPoint !== null) {
    const distFromActive = Math.abs(raw - activeSnappedPoint);
    if (distFromActive <= releaseRadius) {
      return { snappedPoint: activeSnappedPoint, value: activeSnappedPoint };
    }
  }

  // 2. Check if raw enters captureRadius of any snap point
  let closestPoint: number | null = null;
  let minDistance = Infinity;

  for (const point of snapPoints) {
    const dist = Math.abs(raw - point);
    if (dist <= captureRadius && dist < minDistance) {
      minDistance = dist;
      closestPoint = point;
    }
  }

  if (closestPoint !== null) {
    return { snappedPoint: closestPoint, value: closestPoint };
  }

  return { snappedPoint: null, value: raw };
}
