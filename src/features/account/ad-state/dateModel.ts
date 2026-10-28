import { toPersianDigits } from "../../../shared/lib/numberUtils";
import "../../advertisements/components/AdCard.css";

export function readDateLike(value: unknown, hoursAgo?: unknown) {
  if (typeof value !== "string" || !value.trim()) return "—";
  const raw = value.trim();
  const timestamp = Date.parse(raw);
  if (!Number.isFinite(timestamp)) return raw;
  const d = new Date(timestamp);
  const dateFormatted = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);

  const targetMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const now = new Date();
  const baseMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const days = Math.round((baseMidnight - targetMidnight) / 86_400_000);

  let relative = "امروز";
  if (days === 1) relative = "دیروز";
  else if (days > 1) relative = `${toPersianDigits(days)} روز پیش`;
  else if (typeof hoursAgo === "number" && hoursAgo >= 24) {
    const hDays = Math.floor(hoursAgo / 24);
    relative = hDays === 1 ? "دیروز" : `${toPersianDigits(hDays)} روز پیش`;
  }
  return `${relative} (${dateFormatted})`;
}

export function readExpirationRemaining(value: unknown, fallbackPublishedDate?: unknown) {
  const raw = typeof value === "string" && value.trim() ? value.trim() : "";
  let timestamp = raw ? Date.parse(raw) : NaN;

  if (
    !Number.isFinite(timestamp) &&
    typeof fallbackPublishedDate === "string" &&
    fallbackPublishedDate.trim()
  ) {
    const pubTime = Date.parse(fallbackPublishedDate.trim());
    if (Number.isFinite(pubTime)) {
      timestamp = pubTime + 30 * 86_400_000;
    }
  }

  if (!Number.isFinite(timestamp)) return raw || "—";

  const d = new Date(timestamp);
  const expirationDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);

  const targetMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const now = new Date();
  const baseMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const remainingDays = Math.round((targetMidnight - baseMidnight) / 86_400_000);

  if (remainingDays < 0) return `منقضی شده (${expirationDate})`;

  const remainingLabel =
    remainingDays === 0 ? "امروز" : `${toPersianDigits(remainingDays)} روز دیگر`;

  return `${remainingLabel} (${expirationDate})`;
}
