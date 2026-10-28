import type { AdvertisementItem } from "../../api/advertisement.service";
import { PROPERTY_DETAIL_ICONS, type DetailInfoItem } from "./detailCore";
import {
  getFirstExistingFeatureValue,
  isFilledValue,
  toValueArray,
  toBooleanLike,
} from "./featureValues";
import { formatTomanDetailValue } from "./detailUnits";

export function createLoanRow(
  ad: AdvertisementItem,
  features: NonNullable<AdvertisementItem["features"]>,
): DetailInfoItem {
  const loanStatusRaw = getFirstExistingFeatureValue(features, [
    "has_loan",
    "loan",
    "has_mortgage",
    "mortgage",
  ]);

  const loanAmountRaw =
    ad.loan?.amount ??
    getFirstExistingFeatureValue(features, [
      "loan_amount",
      "mortgage_amount",
      "loan_price",
      "loan_value",
    ]);

  const installmentRaw =
    ad.loan?.installment ??
    getFirstExistingFeatureValue(features, [
      "loan_installment",
      "installment_amount",
      "loan_payment",
      "monthly_installment",
    ]);

  const statusFromBoolean = toBooleanLike(loanStatusRaw);
  const hasValues = isFilledValue(loanAmountRaw) || isFilledValue(installmentRaw);
  const hasLoan = hasValues || statusFromBoolean === true;

  const extraRows =
    hasLoan === true
      ? [
          loanAmountRaw
            ? {
                label: "مبلغ وام:",
                value: formatTomanDetailValue(loanAmountRaw),
              }
            : null,
          installmentRaw
            ? {
                label: "مبلغ قسط:",
                value: formatTomanDetailValue(installmentRaw),
              }
            : null,
        ].filter(
          (item): item is { label: string; value: string } => item !== null && Boolean(item.value),
        )
      : [];

  return {
    badge: true,
    icon: "apartment",
    iconSrc: PROPERTY_DETAIL_ICONS.loan,
    label: "وام",
    tone: hasLoan ? "success" : "warning",
    value: hasLoan ? "دارای وام" : "بدون وام",
    extraRows,
  };
}

export function createExchangeRow(
  features: NonNullable<AdvertisementItem["features"]>,
): DetailInfoItem {
  const exchangeStatusRaw = getFirstExistingFeatureValue(features, [
    "has_exchange",
    "exchange",
    "is_exchangeable",
  ]);

  const exchangeWithRaw = getFirstExistingFeatureValue(features, [
    "exchange_with",
    "exchange_items",
    "exchange_types",
  ]);

  const exchangeValues = toValueArray(exchangeWithRaw);
  const statusFromBoolean = toBooleanLike(exchangeStatusRaw);
  const hasExchange = statusFromBoolean ?? exchangeValues.length > 0;

  if (hasExchange && exchangeValues.length > 0) {
    return {
      icon: "arrowLeft",
      iconSrc: PROPERTY_DETAIL_ICONS.exchange,
      label: "معاوضه با:",
      tone: "neutral",
      value: exchangeValues,
    };
  }

  return {
    badge: true,
    icon: "arrowLeft",
    iconSrc: PROPERTY_DETAIL_ICONS.exchange,
    label: "معاوضه با:",
    tone: hasExchange ? "success" : "warning",
    value: hasExchange ? "دارای معاوضه" : "بدون معاوضه",
  };
}
