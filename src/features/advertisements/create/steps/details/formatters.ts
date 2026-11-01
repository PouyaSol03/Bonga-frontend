import { formatBigNumber } from "../../../../../shared/lib/MoneyHandler";

export function toggleArray(current: string[], id: string) {
  return current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
}

export function moneySupportingText(value: string, includeCurrency = true) {
  const number = Number(value.replace(/,/g, ""));

  if (!Number.isFinite(number) || number <= 0) return "";

  const formattedValue = formatBigNumber(number);

  return includeCurrency ? `${formattedValue} تومان` : formattedValue;
}

export function formatPersianCount(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function formatFacilityChipLabel(label: string, countStr?: string) {
  if (!countStr) return undefined;
  const num = parseInt(
    countStr.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))),
    10,
  );
  if (num > 1) {
    return `${label} (${formatPersianCount(num)})`;
  }
  return label;
}
