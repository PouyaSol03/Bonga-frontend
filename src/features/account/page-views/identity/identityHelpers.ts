import { toEnglishDigits } from "../../../../shared/lib/numberUtils";

export function normalizeNumericInput(value: string) {
  return toEnglishDigits(value).replace(/\D/g, "");
}

export function formatPersianMonthYear(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      month: "long",
      year: "numeric",
    });
    const parts = formatter.formatToParts(date);
    const month = parts.find((p) => p.type === "month")?.value;
    const year = parts.find((p) => p.type === "year")?.value;
    if (month && year) {
      return `${month} ${year}`;
    }
    return formatter.format(date);
  } catch {
    return "";
  }
}
