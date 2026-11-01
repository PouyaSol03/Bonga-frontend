import { describe, expect, test } from "vitest";
import type { AdvertisementCheckout } from "../../src/features/advertisements/api/advertisement.service";
import { getCheckoutPricing } from "../../src/features/account/adManagement/checkout/checkoutPricing";
import { toSafeNumber, aggregateCreditRequirements, getCreditBalances } from "../../src/features/account/adManagement/checkout/checkoutNumbers";
import { getUpgradeCheckoutItems, getUpgradeDescription, resolveUpgradeCheckoutItem } from "../../src/features/account/adManagement/checkout/checkoutUpgrades";
import { readCheckoutAdvertiseId } from "../../src/features/account/adManagement/checkout/checkoutLookup";
import type { CheckoutBalances } from "../../src/features/account/adManagement/checkout/useCheckoutBalances";
import type { CheckoutContext } from "../../src/features/account/adManagement/checkout/useCheckoutContext";

const checkout = {
  items: [
    { product: "advertise_publish", price: 100, credit_cost: 2, free_quota: { remaining: 3 } },
    { product: "advertise_update", price: 30, duration_days: 5, credit_requirements: [{ credit_type: "ad_credit", amount: 2 }] },
    { product: "advertise_special", price: -5, credit_requirements: [{ credit_type: "special_credit", amount: 1 }] },
    { product: "other_publish", price: 10 },
  ],
  payment_methods: [{ method: "free_quota", remaining: 1 }],
  summary: { total_price: 100, payable_amount: 80, credit_cost: 2 },
} as AdvertisementCheckout;
const balances = {
  gatewayMethod: { method: "gateway", required: 90 },
  packageCreditMethod: { method: "package_credit", balance: 1, required: 2 },
} as CheckoutBalances;
const context = { usesAgencyCheckoutOptions: false, isAgencyAllocationCheckout: false } as CheckoutContext;

describe("checkout numbers and upgrades", () => {
  test.each([["1,234", 1234], ["  ", 7], ["bad", 0], [Infinity, 7], ["-2.5", -2.5]])("preserves numeric parsing %s", (value, expected) => {
    expect(toSafeNumber(value, 7)).toBe(expected);
  });

  test("upgrade filtering excludes all publish aliases; mapping preserves identity", () => {
    expect(getUpgradeCheckoutItems(checkout)).toEqual(checkout.items.slice(1, 3));
    expect(resolveUpgradeCheckoutItem("refresh", checkout.items)).toBe(checkout.items[1]);
    expect(resolveUpgradeCheckoutItem("renew", checkout.items)).toBeUndefined();
    expect(getUpgradeDescription("refresh", checkout.items[1])).toContain("۵ روز");
    expect(getUpgradeDescription("special", { ...checkout.items[2], description: "  server description  " })).toBe("server description");
  });

  test("credit aggregation preserves recognized types and ignores negative amounts", () => {
    expect(aggregateCreditRequirements(checkout.items)).toEqual({ ad_credit: 2, special_credit: 1, renew_credit: 0 });
    expect(getCreditBalances({ method: "ad_credit", balance: 5, balances: { ad_credit: -1, special_credit: 2 } })).toEqual({ ad_credit: 0, special_credit: 2, renew_credit: 0 });
  });
});

describe("checkout pricing precedence", () => {
  test("unselected upgrades preserve summary; free quota uses maximum remaining", () => {
    expect(getCheckoutPricing(checkout, [], null, balances, context)).toMatchObject({
      publishPrice: 100, payableAmount: 80, totalPrice: 100, freeQuotaRemaining: 3,
      hasFreeQuota: true, agencyCreditMethod: "free_quota", agencyCreditAvailable: true,
      agencyCreditRemaining: 3, agencyCreditShortage: 0,
    });
  });

  test("selected upgrades retain list price, waive quota-covered publishing, clamp negative prices", () => {
    expect(getCheckoutPricing(checkout, ["advertise_update", "advertise_special"], null, balances, context)).toMatchObject({
      payableAmount: 30, totalPrice: 130,
    });
  });

  test("unavailable quota does not waive publishing; business role keeps credit shortage", () => {
    const unavailable = { ...checkout, payment_methods: [{ method: "free_quota", remaining: 10, available: false }] };
    expect(getCheckoutPricing(unavailable, ["advertise_update"], null, balances, { ...context, usesAgencyCheckoutOptions: true })).toMatchObject({
      hasFreeQuota: false, payableAmount: 130, agencyCreditMethod: "ad_credit",
      agencyCreditAvailable: false, agencyCreditShortage: 1,
    });
  });

  test("sufficient package credit takes precedence over free quota", () => {
    expect(getCheckoutPricing(checkout, [], null, { ...balances, packageCreditMethod: { method: "package_credit", balance: 2 } }, context).agencyCreditMethod).toBe("package_credit");
  });
});

test.each([
  ["/account/ad-management/payment/a%20b", "a b"],
  ["/ad-management/payment/42/", "42"],
  ["/account/ad-management/payment", null],
  ["/wrong/payment/42", null],
])("checkout route %s preserves ID parsing", (path, expected) => {
  window.history.replaceState({}, "", path);
  expect(readCheckoutAdvertiseId()).toBe(expected);
});
