import type { AdvertisementItem } from "../../api/advertisement.service";
import type { IconName } from "../viewAdTypes";
import { getBuildingInfo } from "../../../../shared/lib/handleBuildingInfo";
import { formatDetailPrice as formatPrice } from "../../../../shared/lib/MoneyHandler";
import {
  type DetailInfoItem,
  type DetailInfoSection,
  PROPERTY_DETAIL_ICONS,
  getFeatureValue,
  getDetailIconByLabel,
  toText,
} from "../viewAdDetails";

export function isFilledValue(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some((item): boolean => isFilledValue(item));
  }

  return value !== undefined && value !== null && value !== "";
}

export function getFirstExistingFeatureValue(
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
) {
  for (const label of labels) {
    const value = getFeatureValue(features, label);

    if (isFilledValue(value)) {
      return value;
    }
  }

  return undefined;
}

export function toValueArray(value: unknown) {
  return Array.isArray(value) ? value.map((item) => toText(item)).filter(Boolean) : [];
}

export function toBooleanLike(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1 ? true : value === 0 ? false : undefined;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes", "y", "دارد", "بله", "هست"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no", "n", "ندارد", "خیر", "نیست"].includes(normalized)) {
      return false;
    }
  }

  return undefined;
}

export function appendSuffixIfNeeded(value: unknown, suffix: string) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes(suffix)) {
    return text;
  }

  return `${text} ${suffix}`;
}

export function formatAreaDetailValue(value: unknown) {
  const text = toText(value);
  if (!text) return "-";
  if (text.includes("مترمربع") || text.includes("متر مربع")) return text;
  if (text.includes("متر")) return text.replace(/متر/g, "مترمربع");
  return `${text} مترمربع`;
}

export function formatMeterDetailValue(value: unknown) {
  return appendSuffixIfNeeded(value, "متر");
}

export function formatPercentDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes("درصد") || text.includes("%")) {
    return text;
  }

  return `${text} درصد`;
}

export function formatAgeDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes("سال") || text.includes("نوساز")) {
    return text;
  }

  return `${text} سال`;
}

export function formatRoomDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes("اتاق") || text.includes("خواب")) {
    return text;
  }

  return `${text} اتاق`;
}

export function formatFloorDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes("طبقه")) {
    return text;
  }

  return `طبقه ${text}`;
}

export function formatTotalFloorsDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes("طبقه")) {
    return text;
  }

  return `${text} طبقه`;
}

export function formatUnitsPerFloorDetailValue(value: unknown) {
  const normalized = toText(value);
  const labelsByValue: Record<string, string> = {
    "1": "تک واحدی",
    "۱": "تک واحدی",
    "2": "دو واحدی",
    "۲": "دو واحدی",
    "3": "سه واحدی",
    "۳": "سه واحدی",
    "4": "چهار واحدی",
    "۴": "چهار واحدی",
    "5": "پنج واحدی",
    "۵": "پنج واحدی",
    "6": "شش واحدی",
    "۶": "شش واحدی",
    "7": "هفت واحدی",
    "۷": "هفت واحدی",
    "8": "هشت واحد بیشتر",
    "۸": "هشت واحد بیشتر",
  };
  return normalized ? (labelsByValue[normalized] ?? appendSuffixIfNeeded(value, "واحد")) : "-";
}

export function formatTomanDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "";
  }

  if (
    text.includes("تومان") ||
    text.includes("میلیون") ||
    text.includes("میلیارد") ||
    text.includes("همت")
  ) {
    return text;
  }

  return `${formatPrice(value)} تومان`;
}

export function createGridItem({
  features,
  labels,
  label,
  formatter,
  icon,
}: {
  features: NonNullable<AdvertisementItem["features"]>;
  labels: string[];
  label: string;
  formatter?: (value: unknown) => string;
  icon?: IconName;
}): DetailInfoItem | null {
  const rawValue = getFirstExistingFeatureValue(features, labels);

  if (!isFilledValue(rawValue)) {
    return null;
  }

  const value = formatter ? formatter(rawValue) : toText(rawValue, "-");

  if (!value || value === "-") {
    return null;
  }

  const iconInfo = getBuildingInfo(label, value);

  return {
    icon: icon ?? getDetailIconByLabel(label),
    iconSrc: iconInfo.iconSrc,
    label,
    value,
  };
}

export function createChoiceRow(
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
  label: string,
): DetailInfoItem | null {
  const rawValue = getFirstExistingFeatureValue(features, labels);

  if (!isFilledValue(rawValue)) {
    return null;
  }

  const values = Array.isArray(rawValue)
    ? rawValue.map((item) => toText(item)).filter(Boolean)
    : [toText(rawValue)].filter(Boolean);

  if (!values.length) {
    return null;
  }

  return {
    icon: "apartment",
    iconSrc: PROPERTY_DETAIL_ICONS.selected,
    label,
    value: values,
  };
}

export function createCheckBadge(
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
  label: string,
): DetailInfoItem | null {
  const rawValue = getFirstExistingFeatureValue(features, labels);
  const isActive = toBooleanLike(rawValue);

  if (isActive !== true) {
    return null;
  }

  return {
    badge: true,
    icon: "apartment",
    iconSrc: PROPERTY_DETAIL_ICONS.selected,
    label,
    tone: "neutral",
    value: label,
  };
}

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

export function createExchangeRow(features: NonNullable<AdvertisementItem["features"]>): DetailInfoItem {
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

export function filterDetailSections(sections: DetailInfoSection[]) {
  return sections.filter(
    (section) =>
      section.items.length > 0 ||
      Boolean(section.choiceRows && section.choiceRows.length > 0) ||
      Boolean(section.badges && section.badges.length > 0),
  );
}


