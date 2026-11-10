import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";

function trimTrailingZeros(text: string) {
  return text.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
}

export function formatRentNumberText(value: number) {
  const amount = Math.max(0, Math.round(value));
  // Snap to the nearest million so boundary artifacts like 999,999,999 render
  // as ۱ میلیارد instead of ۱۰۰۰ میلیون.
  const snapped = Math.round(amount / 1_000_000) * 1_000_000;

  if (snapped >= 1_000_000_000) {
    const billions = trimTrailingZeros((snapped / 1_000_000_000).toFixed(3));
    return `${toPersianDigits(billions)} میلیارد`;
  }
  if (amount >= 1_000_000) {
    const millions = trimTrailingZeros((amount / 1_000_000).toFixed(1));
    return `${toPersianDigits(millions)} میلیون`;
  }
  if (amount === 0) return "۰";
  return toPersianDigits(amount);
}
