import { isRecord, readText } from "../../../../shared/lib/textUtils";
import { getPrimaryAdvertisementImageUrl } from "../../../advertisements/utils/advertisement-images";
import type { getSelectedConsultantAd } from "../adManagementData";
import type { AdSummary, ChartMetric } from "./types";

export const statisticKeysByMetric: Record<ChartMetric, string[]> = {
  calls: ["call_count", "calls_count", "calls", "phone_clicks", "contact_count"],
  chats: ["chat_count", "chats_count", "chats", "conversation_count", "message_count"],
  searchDisplays: [
    "search_display_count",
    "impressions",
    "impression_count",
    "display_count",
    "shown_count",
  ],
  views: ["total_views", "views_count", "views", "visit_count", "view_count"],
};

export function formatFaNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function readAdIdFromPath() {
  const match = window.location.pathname.match(
    /^\/account\/(?:my-ads|manage-ads)\/([^/]+)\/visit-statistics\/?$/,
  );

  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

export function readQueryAdId() {
  return new URLSearchParams(window.location.search).get("adId") ?? undefined;
}

export function readEntityId(entity: unknown) {
  if (!isRecord(entity)) return undefined;

  const id = entity.id ?? entity._id ?? entity.advertise_id ?? entity.advertiseId;

  if (typeof id === "string" && id.trim()) return id;
  if (typeof id === "number") return String(id);

  return undefined;
}

export function readImageUrl(record: Record<string, unknown>) {
  return getPrimaryAdvertisementImageUrl(record);
}

export function readStatistic(ad: unknown, keys: string[]) {
  if (!isRecord(ad)) return "—";

  const statisticsContainers = [ad, ad.statistics, ad.stats, ad.report, ad.analytics].filter(
    isRecord,
  );

  for (const container of statisticsContainers) {
    for (const key of keys) {
      const value = container[key];

      if (typeof value === "number" && Number.isFinite(value)) return formatFaNumber(value);
      if (typeof value === "string" && value.trim()) return value;
    }
  }

  return "—";
}

export function createAdSummary(
  ad: unknown,
  card: ReturnType<typeof getSelectedConsultantAd>,
): AdSummary {
  const record: Record<string, unknown> = isRecord(ad) ? ad : {};
  const title = readText(record.title ?? record.ad_title ?? card.title, card.title);
  const category = readText(
    record.category_title ?? record.categoryTitle ?? record.category_name ?? record.categoryName,
    "—",
  );
  const timeAndLocation = readText(
    record.timeAndLocation ?? record.time_and_location,
    card.timeAndLocation,
  );

  return {
    category,
    imageClassName: readText(record.imageClassName ?? record.image_class_name, card.imageClassName),
    imageUrl: readImageUrl(record) ?? card.imageUrl,
    timeAndLocation,
    title,
  };
}
