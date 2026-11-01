import { getBuildingInfo } from "../../../../shared/lib/handleBuildingInfo";
import { formatDetailPrice as formatPrice } from "../../../../shared/lib/MoneyHandler";
import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import type { AdvertisementItem } from "../../api/advertisement.service";
import type { IconName } from "../viewAdTypes";
import {
  type DetailInfoValue,
  getFeatureValue,
  toText,
} from "../viewAdDetails";
import {
  formatAreaDetailValue,
  formatMeterDetailValue,
  formatPercentDetailValue,
  getFirstExistingFeatureValue,
  isFilledValue,
} from "./detailFormatters";
import {
  type PropertyPreviewField,
  propertyPreviewFieldsByFormCode,
} from "./propertyPreviewFields";
import {
  ignoredFeatureLabels,
  propertyInfoLabelMap,
  propertyInfoOrder,
} from "./propertyInfoMaps";

export function buildPropertyPreviewItem(
  features: NonNullable<AdvertisementItem["features"]>,
  field: PropertyPreviewField,
): PropertyInfoItem | null {
  const rawValue = getFirstExistingFeatureValue(features, field.labels);

  if (!isFilledValue(rawValue)) return null;

  const value = field.formatter
    ? field.formatter(rawValue)
    : Array.isArray(rawValue)
      ? rawValue
          .map((item) => toText(item))
          .filter(Boolean)
          .join("، ")
      : normalizeDetailValue(field.labels[0], rawValue).toString();

  if (!value || value === "-") return null;

  const { formattedValue, iconSrc } = getBuildingInfo(field.labels[0], value);

  return {
    icon: field.icon ?? getDetailIconByLabel(field.label),
    iconSrc: iconSrc ?? null,
    label: field.label,
    value: field.formatter ? value : formattedValue,
  };
}

export function buildPropertyInfoPreviewItems(features: NonNullable<AdvertisementItem["features"]>) {
  const formCode = toText(getFeatureValue(features, "form_code"));
  const config = propertyPreviewFieldsByFormCode[formCode];

  if (!config) {
    return buildPropertyInfoItems(features).slice(0, 4);
  }

  const items = config
    .map((field) => buildPropertyPreviewItem(features, field))
    .filter((item): item is PropertyInfoItem => item !== null);

  return items.length ? items : buildPropertyInfoItems(features).slice(0, 4);
}

export function buildPropertyInfoItems(features: NonNullable<AdvertisementItem["features"]>) {
  const orderedItems = propertyInfoOrder
    .map((label) => {
      const feature = features.find((item) => item.label === label);

      if (!feature) {
        return null;
      }

      return buildPropertyInfoItem(label, feature.value);
    })
    .filter((item): item is PropertyInfoItem => item !== null);

  const extraItems = features
    .filter((feature) => {
      const label = feature.label ?? "";

      return label && !propertyInfoOrder.includes(label) && !ignoredFeatureLabels.has(label);
    })
    .map((feature) => buildPropertyInfoItem(feature.label ?? "", feature.value))
    .filter((item): item is PropertyInfoItem => item !== null);

  return [...orderedItems, ...extraItems];
}

type PropertyInfoItem = {
  icon: IconName;
  iconSrc: string | null;
  label: string;
  value: string;
};

function formatStructuredFeatureRows(label: string, value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;

  if (label === "project_details") {
    return value
      .map((item, index) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return "";
        const record = item as Record<string, unknown>;
        const parts = [
          record.meterage !== undefined ? `متراژ: ${formatAreaDetailValue(record.meterage)}` : "",
          isFilledValue(record.floors) ? `طبقات: ${toText(record.floors)}` : "",
          isFilledValue(record.rooms) ? `اتاق: ${toText(record.rooms)}` : "",
          isFilledValue(record.positions) ? `موقعیت: ${toText(record.positions)}` : "",
        ].filter(Boolean);

        return parts.length ? `واحد ${toPersianDigits(index + 1)} — ${parts.join("، ")}` : "";
      })
      .filter(Boolean);
  }

  if (label === "daily_hotel_rooms") {
    return value
      .map((item) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return "";
        const record = item as Record<string, unknown>;
        const roomLabel = toText(record.room_label ?? record.room_type, "اتاق");
        const parts = [
          isFilledValue(record.guest_count) ? `ظرفیت: ${toText(record.guest_count)} نفر` : "",
          isFilledValue(record.extra_guest_count)
            ? `نفر اضافه: ${toText(record.extra_guest_count)}`
            : "",
          isFilledValue(record.meal_plan) ? `پذیرایی: ${toText(record.meal_plan)}` : "",
          isFilledValue(record.normal_price) ? `عادی: ${formatPrice(record.normal_price)}` : "",
          isFilledValue(record.weekend_price)
            ? `آخر هفته: ${formatPrice(record.weekend_price)}`
            : "",
          isFilledValue(record.special_price) ? `ویژه: ${formatPrice(record.special_price)}` : "",
        ].filter(Boolean);

        return parts.length ? `${roomLabel} — ${parts.join("، ")}` : roomLabel;
      })
      .filter(Boolean);
  }

  return null;
}

function normalizeDetailValue(label: string, value: unknown): DetailInfoValue {
  const structuredRows = formatStructuredFeatureRows(label, value);
  if (structuredRows) return structuredRows;

  if (Array.isArray(value)) {
    return value.map((item) => toText(item)).filter(Boolean);
  }

  if (typeof value === "boolean") {
    if (label === "has_loan") {
      return value ? "دارای وام" : "بدون وام";
    }

    if (label === "exchange_with") {
      return value ? "دارای معاوضه" : "بدون معاوضه";
    }

    return value ? "دارد" : "ندارد";
  }

  if (["area", "land_area", "building_area"].includes(label)) {
    return formatAreaDetailValue(value);
  }

  if (["land_width", "street_width", "height"].includes(label)) {
    return formatMeterDetailValue(value);
  }

  if (
    [
      "price",
      "meter_price",
      "daily_price",
      "min_price",
      "max_price",
      "mortgage_price",
      "rent_price",
      "normal_daily_price",
      "weekend_daily_price",
      "special_daily_price",
      "extra_person_price",
      "evacuation_guarantee",
      "loan_amount",
      "loan_installment",
    ].includes(label)
  ) {
    return `${formatPrice(value)} تومان`;
  }

  if (["sale_terms_percent", "builder_share"].includes(label)) {
    return formatPercentDetailValue(value);
  }

  if (label === "sale_terms_installment_months" || label === "min_contract_months") {
    const text = toText(value);
    return text ? `${text} ماه` : "-";
  }

  return toText(value, "-");
}

export function getDetailIconByLabel(label: string): IconName {
  const l = label.toLowerCase();
  if (
    l.includes("متراژ") ||
    l.includes("area") ||
    l.includes("زیربنا") ||
    l.includes("بنا") ||
    l.includes("زمین")
  )
    return "area";
  if (l.includes("اتاق") || l.includes("خواب") || l.includes("rooms") || l.includes("تخت"))
    return "bed";
  if (
    l.includes("سن") ||
    l.includes("سال ساخت") ||
    l.includes("طبقه") ||
    l.includes("ساختمان") ||
    l.includes("واحد") ||
    l.includes("پروژه") ||
    l.includes("سازنده")
  )
    return "building";
  if (
    l.includes("سند") ||
    l.includes("قرارداد") ||
    l.includes("مجوز") ||
    l.includes("شرایط") ||
    l.includes("مالکیت")
  )
    return "document";
  if (
    l.includes("موقعیت") ||
    l.includes("جهت") ||
    l.includes("دسترسی") ||
    l.includes("تجاری") ||
    l.includes("اداری")
  )
    return "location";
  if (
    l.includes("تاریخ") ||
    l.includes("تحویل") ||
    l.includes("ساعت") ||
    l.includes("روز") ||
    l.includes("دوره") ||
    l.includes("اقساط")
  )
    return "calendar";
  if (l.includes("نفر") || l.includes("ظرفیت") || l.includes("مدیریت")) return "profile";
  if (l.includes("عرض") || l.includes("ارتفاع") || l.includes("گذر") || l.includes("سقف"))
    return "ruler";
  if (
    l.includes("قیمت") ||
    l.includes("مبلغ") ||
    l.includes("تومان") ||
    l.includes("رهن") ||
    l.includes("اجاره") ||
    l.includes("ودیعه") ||
    l.includes("تضمین")
  )
    return "tooman";
  if (l.includes("کابینت") || l.includes("آشپزخانه")) return "cabinet";
  if (l.includes("کف") || l.includes("سرامیک")) return "ceramic";
  return "apartment";
}

function buildPropertyInfoItem(label: string, rawValue: unknown) {
  const displayLabel = propertyInfoLabelMap[label] ?? label;
  const normalizedValue = normalizeDetailValue(label, rawValue);
  const iconLookupLabel = propertyInfoLabelMap[label] ? label : displayLabel;
  const { formattedValue, iconSrc } = getBuildingInfo(
    iconLookupLabel,
    Array.isArray(normalizedValue) ? normalizedValue.join("، ") : normalizedValue,
  );

  return {
    icon: getDetailIconByLabel(displayLabel),
    iconSrc: iconSrc ?? null,
    label: displayLabel,
    value: formattedValue,
  };
}


