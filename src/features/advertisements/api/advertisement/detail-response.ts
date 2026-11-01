import { type AdvertisementFeature } from "./entity-types";
import { type AdvertisementItem } from "./item-types";
import { type AdvertisementShowResponse } from "./detail-types";
import { ApiError } from "../../../../shared/api/api";

export function extractLoanFromFeatures(
  features?: AdvertisementFeature[],
): AdvertisementItem["loan"] {
  if (!Array.isArray(features)) return undefined;

  const findValue = (keys: string[]) =>
    features.find(
      (f) => keys.includes(f.label ?? "") || keys.includes(f.key ?? ""),
    )?.value;

  const amount = findValue([
    "loan_amount",
    "mortgage_amount",
    "loan_price",
    "loan_value",
  ]);
  const installment = findValue([
    "loan_installment",
    "installment_amount",
    "loan_payment",
    "monthly_installment",
  ]);

  if (amount !== undefined || installment !== undefined) {
    return {
      amount: (amount ?? null) as string | number | null,
      installment: (installment ?? null) as string | number | null,
    };
  }
  return undefined;
}

export function normalizeAdvertisementLoan(
  item: AdvertisementItem,
): AdvertisementItem {
  if (!item || typeof item !== "object") return item;

  const loanFromFeatures = extractLoanFromFeatures(item.features);
  if (loanFromFeatures) {
    item.loan = {
      amount: item.loan?.amount ?? loanFromFeatures.amount,
      installment: item.loan?.installment ?? loanFromFeatures.installment,
    };
  }

  return item;
}

export function unwrapAdvertisementShowResponse(
  response: AdvertisementShowResponse,
): AdvertisementItem {
  if (response?.data && typeof response.data === "object") {
    return normalizeAdvertisementLoan(response.data);
  }

  throw new ApiError(500, "ساختار اطلاعات آگهی از سرور قابل استفاده نیست.");
}

export function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}
