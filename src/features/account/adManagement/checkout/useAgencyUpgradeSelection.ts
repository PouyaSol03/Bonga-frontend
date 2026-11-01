import { useEffect, useState } from "react";

import { formatShortPayment } from "../../../payments/components/formatShortPayment";
import { formatTariffToman } from ".././AdTariffOptionsView";
import type { AgencyCombinedCheckoutProps } from "./agencyCheckoutTypes";
import {
  aggregateCreditRequirements,
  getCreditBalances,
  sumCreditValues,
  toSafeNumber,
} from "./checkoutNumbers";
export function useAgencyUpgradeSelection({
  method,
  upgradeItems = [],
  price,
  payableAmount,
  walletMethod,
  gatewayMethod,
  creditCost,
  creditPaymentMethod,
  creditBalances: propCreditBalances,
  creditMethod,
  creditShortage,
  creditAvailable,
  showByConsultant = false,
  byConsultantMethod,
}: AgencyCombinedCheckoutProps) {
  const [selectedUpgradeProducts, setSelectedUpgradeProducts] = useState<string[]>([]);
  const upgradeSelectionEnabled = method !== "by_consultant";
  const selectedUpgradeItems = upgradeItems.filter((item) =>
    selectedUpgradeProducts.includes(item.product),
  );
  const selectedPayableAmount =
    price +
    selectedUpgradeItems.reduce((total, item) => total + Math.max(toSafeNumber(item.price), 0), 0);

  const walletBalance = toSafeNumber(walletMethod?.balance);
  const walletRequired = selectedPayableAmount || payableAmount;
  const walletDeficit = Math.max(walletRequired - walletBalance, 0);
  const walletSupported = Boolean(walletMethod);
  const walletAvailable = Boolean(walletMethod && walletDeficit <= 0);
  const walletSelectable = Boolean(walletMethod);

  const selectedRequirements = aggregateCreditRequirements(selectedUpgradeItems);
  selectedRequirements.ad_credit += Math.max(creditCost, 0);
  const selectedCreditCost = sumCreditValues(selectedRequirements);
  const fallbackBalances = getCreditBalances(creditPaymentMethod);
  const creditBalances = {
    ad_credit: propCreditBalances?.ad_credit ?? fallbackBalances.ad_credit,
    special_credit: propCreditBalances?.special_credit ?? fallbackBalances.special_credit,
    renew_credit: propCreditBalances?.renew_credit ?? fallbackBalances.renew_credit,
  };
  const selectedShortage = {
    ad_credit: Math.max(selectedRequirements.ad_credit - creditBalances.ad_credit, 0),
    special_credit: Math.max(
      selectedRequirements.special_credit - creditBalances.special_credit,
      0,
    ),
    renew_credit: Math.max(selectedRequirements.renew_credit - creditBalances.renew_credit, 0),
  };
  const selectedCreditShortage =
    creditMethod === "ad_credit" ? sumCreditValues(selectedShortage) : creditShortage;
  const selectedCreditAvailable =
    creditMethod === "ad_credit"
      ? Boolean(creditPaymentMethod) && selectedCreditShortage === 0
      : creditAvailable;
  const creditSelectable = Boolean(
    creditMethod && (selectedCreditAvailable || selectedCreditShortage > 0),
  );

  const gatewayAvailable = gatewayMethod?.available !== false && Boolean(gatewayMethod);
  const byConsultantAvailable = showByConsultant && byConsultantMethod?.available !== false;
  const selectedMethodAvailable =
    method === "free_quota" || method === "package_credit" || method === "ad_credit"
      ? Boolean(creditMethod && method === creditMethod && selectedCreditAvailable)
      : method === "by_consultant"
        ? byConsultantAvailable
        : method === "wallet"
          ? walletAvailable && walletDeficit <= 0
          : gatewayAvailable;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (upgradeSelectionEnabled) return;
      setSelectedUpgradeProducts([]);
    }, 0);
    return () => clearTimeout(timer);
  }, [upgradeSelectionEnabled]);

  function toggleUpgrade(product: string) {
    if (!upgradeSelectionEnabled) return;

    setSelectedUpgradeProducts((current) => {
      const isSelected = current.includes(product);
      if (isSelected) return current.filter((item) => item !== product);

      if (product === "advertise_update_special") {
        return [
          ...current.filter((item) => item !== "advertise_update" && item !== "advertise_special"),
          product,
        ];
      }

      if (product === "advertise_update" || product === "advertise_special") {
        return [...current.filter((item) => item !== "advertise_update_special"), product];
      }

      return [...current, product];
    });
  }

  const publishCostLabel =
    method === "ad_credit"
      ? `${new Intl.NumberFormat("fa-IR").format(Math.max(creditCost, 0))} اعتبار`
      : method === "free_quota" || method === "package_credit"
        ? creditCost > 0
          ? `${new Intl.NumberFormat("fa-IR").format(creditCost)} اعتبار`
          : creditAvailable
            ? "رایگان"
            : `${formatTariffToman(price)} تومان`
        : `${formatTariffToman(price)} تومان`;

  const submitLabel =
    method === "by_consultant"
      ? "ارسال به مشاور"
      : method === "free_quota" || method === "package_credit" || method === "ad_credit"
        ? selectedCreditCost > 0
          ? `انتشار آگهی - ${new Intl.NumberFormat("fa-IR").format(selectedCreditCost)} اعتبار`
          : "انتشار آگهی"
        : `پرداخت و انتشار - ${formatShortPayment(selectedPayableAmount)}`;

  const adCreditCount = creditBalances.ad_credit;
  const creditBalanceLabel = `مانده: ${new Intl.NumberFormat("fa-IR").format(adCreditCount)} اعتبار`;
  return {
    selectedUpgradeProducts,
    upgradeSelectionEnabled,
    creditBalances,
    toggleUpgrade,
    publishCostLabel,
    submitLabel,
    selectedMethodAvailable,
    byConsultantAvailable,
    creditSelectable,
    creditBalanceLabel,
    selectedCreditShortage,
    selectedCreditAvailable,
    walletSelectable,
    walletSupported,
    walletBalance,
    walletDeficit,
    gatewayAvailable,
  };
}
