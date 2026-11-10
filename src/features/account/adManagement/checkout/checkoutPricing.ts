import type { AdvertisementCheckout } from "../../../advertisements/api/advertisement.service";
import { type ValidateDiscountCodeResult } from "../../../crm/api/crm-discount.service";
import { getCheckoutItem, getCheckoutMethod, getFreeQuotaRemaining } from "./checkoutLookup";
import { toSafeNumber } from "./checkoutNumbers";
import type { AgencyPaymentMethod } from "./checkoutTypes";
import { getUpgradeCheckoutItems } from "./checkoutUpgrades";
import type { CheckoutBalances } from "./useCheckoutBalances";
import type { CheckoutContext } from "./useCheckoutContext";
export function getCheckoutPricing(
  checkout: AdvertisementCheckout | undefined,
  selectedUpgradeProducts: string[],
  appliedDiscount: ValidateDiscountCodeResult | null,
  { gatewayMethod, packageCreditMethod }: CheckoutBalances,
  { isAgencyAllocationCheckout, usesAgencyCheckoutOptions }: CheckoutContext,
) {
  const upgradeItems = getUpgradeCheckoutItems(checkout);
  const selectedUpgradeItems = upgradeItems.filter((item) =>
    selectedUpgradeProducts.includes(item.product),
  );
  const selectedUpgradePrice = selectedUpgradeItems.reduce(
    (total, item) => total + Math.max(toSafeNumber(item.price), 0),
    0,
  );
  const publishItem = checkout ? getCheckoutItem(checkout, "advertise_publish") : undefined;
  const freeQuotaRemaining = checkout ? getFreeQuotaRemaining(checkout, publishItem) : 0;
  const freeQuotaMethod = checkout ? getCheckoutMethod(checkout, "free_quota") : undefined;
  const hasFreeQuota = Boolean(
    freeQuotaRemaining > 0 &&
    freeQuotaMethod?.available !== false &&
    publishItem?.free_quota?.available !== false,
  );
  const publishPrice = toSafeNumber(
    publishItem?.price,
    toSafeNumber(checkout?.summary.total_price, toSafeNumber(gatewayMethod?.required)),
  );
  const totalWithUpgrades = (hasFreeQuota ? 0 : publishPrice) + selectedUpgradePrice;
  const payableAmount =
    selectedUpgradeProducts.length > 0
      ? totalWithUpgrades
      : toSafeNumber(
          checkout?.summary.payable_amount,
          toSafeNumber(gatewayMethod?.required, publishPrice),
        );
  const totalPrice =
    selectedUpgradeProducts.length > 0
      ? publishPrice + selectedUpgradePrice
      : toSafeNumber(checkout?.summary.total_price, publishPrice);
  const finalPayable = appliedDiscount ? appliedDiscount.final_price : payableAmount;
  const is100PercentDiscount = Boolean(
    appliedDiscount?.is_free ||
    appliedDiscount?.disable_gateway ||
    (appliedDiscount && finalPayable === 0),
  );
  const creditCost = Math.max(
    toSafeNumber(publishItem?.credit_cost, toSafeNumber(checkout?.summary.credit_cost)),
    0,
  );
  const packageCreditRemaining = Math.max(
    toSafeNumber(packageCreditMethod?.remaining, toSafeNumber(packageCreditMethod?.balance)),
    0,
  );
  const packageCreditRequired = Math.max(
    toSafeNumber(packageCreditMethod?.required, creditCost),
    creditCost,
  );
  const packageCreditShortage = Math.max(
    toSafeNumber(packageCreditMethod?.shortage, packageCreditRequired - packageCreditRemaining),
    0,
  );
  const packageCreditAvailable = Boolean(
    packageCreditMethod && packageCreditMethod.available !== false && packageCreditShortage <= 0,
  );
  const agencyCreditCost = packageCreditMethod ? packageCreditRequired : creditCost;
  const agencyCreditMethod: AgencyPaymentMethod | null = isAgencyAllocationCheckout
    ? "ad_credit"
    : usesAgencyCheckoutOptions
      ? "ad_credit"
      : packageCreditAvailable
        ? "package_credit"
        : hasFreeQuota
          ? "free_quota"
          : packageCreditMethod
            ? "package_credit"
            : null;
  const agencyCreditAvailable =
    agencyCreditMethod === "free_quota" ? hasFreeQuota : packageCreditAvailable;
  const agencyCreditRemaining =
    agencyCreditMethod === "free_quota" ? freeQuotaRemaining : packageCreditRemaining;
  const agencyCreditShortage = agencyCreditMethod === "free_quota" ? 0 : packageCreditShortage;
  return {
    upgradeItems,
    freeQuotaRemaining,
    hasFreeQuota,
    payableAmount,
    totalPrice,
    finalPayable,
    is100PercentDiscount,
    publishPrice,
    agencyCreditCost,
    agencyCreditMethod,
    agencyCreditAvailable,
    agencyCreditRemaining,
    agencyCreditShortage,
  };
}
export type CheckoutPricing = ReturnType<typeof getCheckoutPricing>;
