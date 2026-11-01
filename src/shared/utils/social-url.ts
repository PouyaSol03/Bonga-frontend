import { toEnglishDigits } from "../lib/numberUtils";

export function normalizeSocialUrl(type: "instagram" | "telegram" | "whatsapp", value: string) {
  const cleanValue = value.trim();
  if (!cleanValue) return "";
  if (/^https?:\/\//i.test(cleanValue)) return cleanValue;

  if (type === "instagram") {
    const username = cleanValue.replace(/^@/, "").replace(/^instagram\.com\//i, "");
    return username ? `https://www.instagram.com/${username}` : "";
  }

  if (type === "telegram") {
    const username = cleanValue.replace(/^@/, "").replace(/^t\.me\//i, "");
    return username ? `https://t.me/${username}` : "";
  }

  const digits = toEnglishDigits(cleanValue).replace(/[^\d]/g, "");
  if (!digits) return "";
  const internationalNumber = digits.startsWith("0") ? `98${digits.slice(1)}` : digits;
  return `https://wa.me/${internationalNumber}`;
}
