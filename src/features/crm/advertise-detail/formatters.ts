import { formatNumber, toNumericValue } from "../../../shared/lib/numberUtils";
import type { CrmRecord } from "../api/crm.service";
import { areaFeatureKeys, priceFeatureKeys } from "./constants";
import { getFormName, readText } from "./helpers";

export function formatMoney(value: unknown): string {
  const formatted = formatNumber(value);
  return !formatted ? "-" : `${formatted} تومان`;
}

export function formatArea(value: unknown): string {
  const formatted = formatNumber(value);
  return !formatted ? "-" : `${formatted} متر مربع`;
}

export function formatDate(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatDisplayValue(key: string, value: unknown): string {
  if (value === undefined || value === null || value === "") return "-";
  if (key === "form_code") return getFormName(String(value));
  if (priceFeatureKeys.has(key)) return formatMoney(value);
  if (areaFeatureKeys.has(key)) return formatArea(value);

  if (typeof value === "boolean") return value ? "دارد" : "ندارد";

  if (Array.isArray(value)) {
    const values = value
      .map((item) => formatDisplayValue("", item))
      .filter((item) => item && item !== "-");

    return values.length ? values.join("، ") : "-";
  }

  if (value && typeof value === "object") {
    const objectValue = value as CrmRecord;
    return readText(objectValue, ["name", "title", "label"], "-");
  }

  if (typeof value === "number") return formatNumber(value);

  const text = String(value).trim();
  if (text === "true" || text === "1") return "دارد";
  if (text === "false" || text === "0") return "ندارد";

  return text || "-";
}

export function resolvePricePresentation(
  formCode: string,
  featureMap: Record<string, unknown>,
  rootPrice: unknown,
  area: unknown,
) {
  if (formCode.startsWith("rent-")) {
    return {
      primaryLabel: "رهن",
      primaryValue: formatMoney(featureMap.mortgage_price),
      secondaryLabel: "اجاره",
      secondaryValue: formatMoney(featureMap.rent_price),
    };
  }

  if (formCode.startsWith("daily-")) {
    const minPrice = featureMap.min_price ?? featureMap.daily_price;
    const maxPrice = featureMap.max_price;

    return {
      primaryLabel: maxPrice === undefined ? "قیمت روزانه" : "حداقل قیمت",
      primaryValue: formatMoney(minPrice),
      secondaryLabel: "حداکثر قیمت",
      secondaryValue: maxPrice === undefined ? "-" : formatMoney(maxPrice),
    };
  }

  if (formCode === "presale-special") {
    const minPrice =
      featureMap.min_meter_price ?? featureMap.min_price ?? featureMap.meter_price ?? rootPrice;
    const maxPrice = featureMap.max_meter_price ?? featureMap.max_price;

    return {
      primaryLabel: maxPrice === undefined ? "قیمت متری" : "حداقل قیمت متری",
      primaryValue: formatMoney(minPrice),
      secondaryLabel: maxPrice === undefined ? "قیمت هر متر" : "حداکثر قیمت متری",
      secondaryValue: maxPrice === undefined ? formatMoney(minPrice) : formatMoney(maxPrice),
    };
  }

  const totalPrice = rootPrice ?? featureMap.price;
  const numericPrice = toNumericValue(totalPrice);
  const numericArea = toNumericValue(area);
  const pricePerMeter =
    numericPrice !== null && numericArea !== null && numericArea > 0
      ? formatMoney(Math.round(numericPrice / numericArea))
      : "محاسبه نشده";

  return {
    primaryLabel: "قیمت کل",
    primaryValue: formatMoney(totalPrice),
    secondaryLabel: "قیمت هر متر",
    secondaryValue: pricePerMeter,
  };
}
