import { formatDetailPrice as formatPrice } from "../../../../shared/lib/MoneyHandler";
import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import { toText, type DetailInfoValue } from "./detailCore";
import {
  formatAreaDetailValue,
  formatMeterDetailValue,
  formatPercentDetailValue,
} from "./detailUnits";
import { isFilledValue } from "./featureValues";

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

export function normalizeDetailValue(label: string, value: unknown): DetailInfoValue {
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

  if (label === "min_stay_days") {
    const text = toText(value);
    return text ? `${text} روز` : "-";
  }

  if (label === "sale_terms_installment_months" || label === "min_contract_months") {
    const text = toText(value);
    return text ? `${text} ماه` : "-";
  }

  return toText(value, "-");
}
