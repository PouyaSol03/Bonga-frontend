import type {
  AdvertisementCheckoutItem,
  AdvertisementCheckoutPaymentMethod,
} from "../../../advertisements/api/advertisement.service";
export function toSafeNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));

    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
}

export type CheckoutCreditType = "ad_credit" | "special_credit" | "renew_credit";

export function aggregateCreditRequirements(items: AdvertisementCheckoutItem[]) {
  const result: Record<CheckoutCreditType, number> = {
    ad_credit: 0,
    special_credit: 0,
    renew_credit: 0,
  };

  items.forEach((item) => {
    (item.credit_requirements ?? []).forEach((requirement) => {
      const type = requirement.credit_type as CheckoutCreditType;
      if (!(type in result)) return;
      result[type] += Math.max(toSafeNumber(requirement.amount), 0);
    });
  });

  return result;
}

export function getCreditBalances(method?: AdvertisementCheckoutPaymentMethod) {
  return {
    ad_credit: Math.max(
      toSafeNumber(method?.balances?.ad_credit, toSafeNumber(method?.balance)),
      0,
    ),
    special_credit: Math.max(toSafeNumber(method?.balances?.special_credit), 0),
    renew_credit: Math.max(toSafeNumber(method?.balances?.renew_credit), 0),
  };
}

export function sumCreditValues(values: Record<CheckoutCreditType, number>) {
  return values.ad_credit + values.special_credit + values.renew_credit;
}
