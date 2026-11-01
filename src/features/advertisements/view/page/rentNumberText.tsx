import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";

export function formatRentNumberText(value: number) {
  const amount = Math.max(0, Math.round(value));
  if (amount >= 1_000_000_000 && amount % 1_000_000_000 === 0) {
    return `${toPersianDigits(amount / 1_000_000_000)} میلیارد`;
  }
  if (amount >= 1_000_000 && amount % 1_000_000 === 0) {
    return `${toPersianDigits(amount / 1_000_000)} میلیون`;
  }
  if (amount >= 1_000_000_000) {
    const b = (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, "");
    return `${toPersianDigits(b)} میلیارد`;
  }
  if (amount >= 1_000_000) {
    const m = (amount / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `${toPersianDigits(m)} میلیون`;
  }
  if (amount === 0) return "۰";
  return toPersianDigits(amount);
}
