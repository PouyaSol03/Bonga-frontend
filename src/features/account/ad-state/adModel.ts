import { readText } from "../../../shared/lib/textUtils";
import type { AdCardData } from "../../advertisements/components/AdCard";
import "../../advertisements/components/AdCard.css";

export function createUnavailableAdCard(
  adId: string | undefined,
  ad?: Record<string, unknown>,
): AdCardData {
  return {
    id: adId ?? readEntityId(ad) ?? "",
    title: readText(ad?.title ?? ad?.ad_title) || "آگهی",
    agency: readText(ad?.agency),
    status: readText(ad?.status),
    imageCount: "0",
    priceLabelPrimary: "",
    pricePrimary: "—",
    priceLabelSecondary: "",
    priceSecondary: "",
    area: "—",
    rooms: "—",
    year: "—",
    timeAndLocation: readText(ad?.timeAndLocation ?? ad?.time_and_location),
    imageClassName: "",
    badges: [],
  };
}

export function readEntityId(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const record = value as Record<string, unknown>;
  const id = record.id ?? record._id ?? record.advertise_id ?? record.advertiseId;
  if (typeof id === "string" && id.trim()) return id;
  if (typeof id === "number" && Number.isFinite(id)) return String(id);
  return undefined;
}

export function readModerationReasons(ad?: Record<string, unknown>) {
  if (!ad) return ["جزئیات اصلاح از سرور دریافت نشده است."];
  const values = [
    ad.rejection_reasons,
    ad.rejection_reason,
    ad.reject_reason,
    ad.edit_reason,
    ad.status_reason,
    ad.moderation_note,
  ];
  const reasons = values
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .map((value) => readText(value))
    .filter(Boolean);
  return reasons.length > 0
    ? Array.from(new Set(reasons))
    : ["جزئیات اصلاح از سرور دریافت نشده است."];
}
