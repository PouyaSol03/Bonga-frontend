import { type AdvertisementItem } from "../../api/advertisement.service";
import { getMyAdStatusInfo } from "../../../account/myAdsStatus";

export function isPublishedAdvertisement(ad: unknown): boolean {
  if (!ad) return false;
  const statusInfo = getMyAdStatusInfo(ad);
  if (statusInfo.key === "published" || statusInfo.label === "منتشر شده") {
    return true;
  }
  const record = typeof ad === "object" ? (ad as Record<string, unknown>) : null;
  const rawStatus = String(
    record?.status ?? record?.ad_status ?? record?.status_label ?? "",
  ).toLowerCase();
  return (
    rawStatus === "published" ||
    rawStatus === "accepted" ||
    rawStatus === "3" ||
    rawStatus.includes("منتشر")
  );
}

export function readAdvertisementBookmarkState(advertisement: AdvertisementItem | undefined) {
  return typeof advertisement?.is_bookmarked === "boolean"
    ? advertisement.is_bookmarked
    : undefined;
}
