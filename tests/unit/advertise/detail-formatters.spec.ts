import { expect, test } from "vitest";
import {
  toText,
  toNumber,
  getFeatureValue,
  getResolvedAdvertisementFeatures,
  createLoanRow,
  createExchangeRow,
  formatAreaDetailValue,
  formatMeterDetailValue,
  toBooleanLike,
} from "../../../src/features/advertisements/view/viewAdDetails";

test("preserves localized scalar formatting", () => {
  expect(toText([12, true, false])).toBe("۱۲، دارد، ندارد");
  expect(toText(null, "missing")).toBe("missing");
  expect(toNumber("۱۲,۳۴۵")).toBe(12345);
  expect(formatAreaDetailValue("120 متر")).toBe("۱۲۰ مترمربع");
  expect(formatMeterDetailValue("12 متر")).toBe("۱۲ متر");
});

test.each([
  [true, true],
  ["بله", true],
  ["0", false],
  ["unknown", undefined],
] as const)("preserves boolean conversion %s", (input, expected) =>
  expect(toBooleanLike(input)).toBe(expected),
);

test("reads feature labels and keys without losing false or zero", () => {
  const features = [
    { label: "Area", value: 0 },
    { label: "Other", key: "has_loan", value: false },
  ];
  expect(getFeatureValue(features, " area ")).toBe(0);
  expect(getFeatureValue(features, "has_loan")).toBe(false);
});

test("promotes root values while preserving explicit feature values", () => {
  const features = getResolvedAdvertisementFeatures({
    area: 70,
    floor: 0,
    features: [{ label: "area", value: 80 }],
  });
  expect(getFeatureValue(features, "area")).toBe(80);
  expect(getFeatureValue(features, "floor")).toBe(0);
});

test("preserves loan and exchange display rules", () => {
  expect(createLoanRow({}, []).value).toBe("بدون وام");
  expect(createLoanRow({ loan: { amount: 1000000 } }, []).value).toBe("دارای وام");
  expect(createExchangeRow([{ label: "has_exchange", value: false }]).value).toBe("بدون معاوضه");
  expect(createExchangeRow([{ label: "exchange_with", value: ["خانه"] }]).value).toEqual(["خانه"]);
});
