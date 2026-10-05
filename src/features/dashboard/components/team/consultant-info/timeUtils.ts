import { toPersianNumber } from "../../../../../shared/lib/numberUtils";

export function formatRelativeTime(isoOrText: string): string {
  if (!isoOrText) return "";
  const parsed = Date.parse(isoOrText);
  if (!Number.isFinite(parsed)) return isoOrText;
  const diffMs = Date.now() - parsed;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "چند لحظه پیش";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${toPersianNumber(diffMin)} دقیقه پیش`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${toPersianNumber(diffHours)} ساعت پیش`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "دیروز";
  if (diffDays < 30) return `${toPersianNumber(diffDays)} روز پیش`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${toPersianNumber(diffMonths)} ماه پیش`;
  return `${toPersianNumber(Math.floor(diffMonths / 12))} سال پیش`;
}
