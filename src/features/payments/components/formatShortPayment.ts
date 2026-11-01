import { formatTariffToman } from "../../account/adManagement/AdTariffOptionsView";

export function formatShortPayment(value: number) {
  if (value === 0) return "رایگان";
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const formatted = new Intl.NumberFormat("fa-IR", {
      maximumFractionDigits: millions % 1 === 0 ? 0 : 2,
    }).format(millions);
    return `${formatted} میلیون تومان`;
  }
  if (value % 1000 === 0) {
    return `${new Intl.NumberFormat("fa-IR").format(value / 1000)} هزار تومان`;
  }
  return `${formatTariffToman(value)} تومان`;
}
