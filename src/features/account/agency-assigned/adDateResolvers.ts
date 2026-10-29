import { toPersianNumber as toPersianDigits } from "../../../shared/lib/numberUtils";
import { formatPersianDateNumber } from "./dateHelpers";

export function resolvePublishedDateText(ad?: Record<string, unknown>): string {
  const explicitText =
    typeof ad?.published_date_text === "string" ? ad.published_date_text.trim() : "";
  if (explicitText) return explicitText;

  const rawDate =
    ad?.confirm_date ??
    ad?.confirmDate ??
    ad?.published_at ??
    ad?.publishedAt ??
    ad?.published_date ??
    ad?.sort_date ??
    ad?.sortDate ??
    ad?.created_at ??
    ad?.createdAt;

  if (typeof rawDate === "string" && rawDate.trim()) {
    const timestamp = Date.parse(rawDate.trim());
    if (Number.isFinite(timestamp)) {
      const d = new Date(timestamp);
      const dateStr = formatPersianDateNumber(d);
      const targetMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const now = new Date();
      const baseMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const days = Math.round((baseMidnight - targetMidnight) / 86_400_000);
      let relative = "امروز";
      if (days === 1) {
        relative = "دیروز";
      } else if (days > 1) {
        relative = `${toPersianDigits(days)} روز پیش`;
      }
      return `${relative} (${dateStr})`;
    }
    return rawDate.trim();
  }

  if (typeof ad?.published_hours_ago === "number") {
    const hours = ad.published_hours_ago;
    if (hours < 1) return "لحظاتی پیش";
    if (hours < 24) return `${toPersianDigits(hours)} ساعت پیش`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "دیروز";
    return `${toPersianDigits(days)} روز پیش`;
  }

  if (typeof ad?.published_time_ago === "string" && ad.published_time_ago.trim()) {
    return ad.published_time_ago.trim();
  }
  if (typeof ad?.published_days === "number" || typeof ad?.published_days === "string") {
    return `${toPersianDigits(ad.published_days)} روز پیش`;
  }

  return "—";
}

export function resolveExpirationDateText(ad?: Record<string, unknown>): string {
  const explicitText = typeof ad?.expire_date_text === "string" ? ad.expire_date_text.trim() : "";
  if (explicitText) return explicitText;

  const rawExpire =
    ad?.expire_date ??
    ad?.expireDate ??
    ad?.expires_at ??
    ad?.expiresAt ??
    ad?.expiration_date ??
    ad?.expirationDate ??
    ad?.expired_at ??
    ad?.expiredAt ??
    (typeof ad?.expire === "object" && ad?.expire && "expires_at" in ad.expire
      ? (ad.expire as { expires_at?: unknown }).expires_at
      : undefined);

  let timestamp =
    typeof rawExpire === "string" && rawExpire.trim() ? Date.parse(rawExpire.trim()) : NaN;

  if (!Number.isFinite(timestamp)) {
    const rawPublished =
      ad?.confirm_date ??
      ad?.confirmDate ??
      ad?.published_at ??
      ad?.publishedAt ??
      ad?.published_date ??
      ad?.sort_date ??
      ad?.created_at ??
      ad?.createdAt;
    if (typeof rawPublished === "string" && rawPublished.trim()) {
      const pubTimestamp = Date.parse(rawPublished.trim());
      if (Number.isFinite(pubTimestamp)) {
        timestamp = pubTimestamp + 30 * 86_400_000;
      }
    }
  }

  if (Number.isFinite(timestamp)) {
    const d = new Date(timestamp);
    const dateStr = formatPersianDateNumber(d);
    const targetMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const now = new Date();
    const baseMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const days = Math.round((targetMidnight - baseMidnight) / 86_400_000);
    if (days < 0) {
      return `منقضی شده (${dateStr})`;
    }
    const relative = days === 0 ? "امروز" : `${toPersianDigits(days)} روز دیگر`;
    return `${relative} (${dateStr})`;
  }

  if (typeof ad?.expires_time_ago === "string" && ad.expires_time_ago.trim()) {
    return ad.expires_time_ago.trim();
  }

  return "—";
}
