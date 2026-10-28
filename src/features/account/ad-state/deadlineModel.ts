import { toPersianDigits } from "../../../shared/lib/numberUtils";
import "../../advertisements/components/AdCard.css";

export function getAgencyAssignmentStartDate(ad?: Record<string, unknown>): string | undefined {
  if (!ad) return undefined;
  if (Array.isArray(ad.status_logs)) {
    const logs = [...ad.status_logs].reverse();
    const waitLog = logs.find(
      (l) =>
        l &&
        typeof l === "object" &&
        ((l as Record<string, unknown>).status === "wait_for_agency" ||
          (l as Record<string, unknown>).status === 1 ||
          String((l as Record<string, unknown>).status) === "1" ||
          String((l as Record<string, unknown>).description ?? "").includes("agency") ||
          String((l as Record<string, unknown>).description ?? "").includes("آژانس")),
    );
    if (waitLog && typeof waitLog === "object") {
      const logDate =
        (waitLog as Record<string, unknown>).date ||
        (waitLog as Record<string, unknown>).created_at;
      if (logDate) return String(logDate);
    }
  }
  const updatedAt = ad.updated_at ?? ad.updatedAt;
  if (typeof updatedAt === "string" && updatedAt.trim()) {
    return updatedAt;
  }
  const createdAt = ad.created_at ?? ad.createdAt;
  if (typeof createdAt === "string" && createdAt.trim()) {
    return createdAt;
  }
  return undefined;
}

export function readAgencyDeadlineRemaining(startDate: unknown) {
  if (typeof startDate !== "string" || !startDate.trim()) return "۲۴ ساعت";
  const start = Date.parse(startDate);
  if (!Number.isFinite(start)) return "۲۴ ساعت";
  const deadline = start + 24 * 60 * 60 * 1000;
  const diff = deadline - Date.now();
  if (diff <= 0) return "مهلت ۲۴ ساعته به پایان رسیده است";
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  if (hours <= 0 && minutes <= 0) return "کمتر از ۱ دقیقه";
  if (hours <= 0) return `${toPersianDigits(minutes)} دقیقه`;
  return `${toPersianDigits(hours)} ساعت و ${toPersianDigits(minutes)} دقیقه`;
}

export function readDeadlineRemaining(
  deadlineDate: unknown,
  defaultDays: number,
  fallbackDate: unknown,
) {
  let targetTimestamp: number | null = null;
  if (typeof deadlineDate === "string" && deadlineDate.trim()) {
    const t = Date.parse(deadlineDate);
    if (Number.isFinite(t)) targetTimestamp = t;
  }
  if (!targetTimestamp && typeof fallbackDate === "string" && fallbackDate.trim()) {
    const t = Date.parse(fallbackDate);
    if (Number.isFinite(t)) targetTimestamp = t + defaultDays * 24 * 60 * 60 * 1000;
  }
  if (!targetTimestamp) return `${toPersianDigits(defaultDays)} روز`;
  const diff = targetTimestamp - Date.now();
  if (diff <= 0) return "مهلت به پایان رسیده است";
  const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
  return `${toPersianDigits(days)} روز دیگر`;
}
