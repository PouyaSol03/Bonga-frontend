import { formatDetailPrice as formatPrice } from "../../../../shared/lib/MoneyHandler";
import { toText } from "./detailCore";

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
