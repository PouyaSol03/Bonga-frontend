import { getApiAssetUrl } from "../../../../shared/api/api";
import { getAdvertisementImageUrls } from "../../utils/advertisement-images";
import type { AdvertisementItem } from "../../api/advertisement.service";
import { getFeatureValue } from "./featureValues";
import { toNumber, toText } from "./detailCore";

export type AlbumMediaItem = {
  src: string;
  type: "image" | "video";
};


export function isOwnAdvertisement(ad?: AdvertisementItem | null) {
  if (!ad) return false;
  const candidate = ad as { is_mine?: unknown; isMine?: unknown };
  return (
    candidate.is_mine === true ||
    candidate.is_mine === 1 ||
    candidate.is_mine === "true" ||
    candidate.isMine === true ||
    candidate.isMine === 1 ||
    candidate.isMine === "true"
  );
}

export function formatPublishedAge(
  ad: AdvertisementItem,
  features: NonNullable<AdvertisementItem["features"]>,
) {
  const publishedTimeAgo = toText(ad.published_time_ago);

  if (publishedTimeAgo) {
    return publishedTimeAgo;
  }

  const publishedDays =
    (ad as { published_days?: unknown }).published_days ??
    (ad as { published_date?: unknown }).published_date;
  const publishedDaysAgo = toNumber(publishedDays);

  if (publishedDays !== undefined && publishedDays !== null && publishedDaysAgo !== undefined) {
    return `${new Intl.NumberFormat("fa-IR").format(publishedDaysAgo)} روز پیش`;
  }

  const publishedDaysText = toText(publishedDays);

  if (publishedDaysText) {
    return `${publishedDaysText} روز پیش`;
  }

  return toText(getFeatureValue(features, "published_at"));
}

export function readVideoUrls(ad: AdvertisementItem): string[] {
  const candidate = ad as AdvertisementItem & {
    videos?: unknown;
    video_url?: unknown;
    video_path?: unknown;
  };
  const rawVideos = Array.isArray(candidate.videos) ? candidate.videos : [];
  const allCandidates: unknown[] = [
    ...rawVideos,
    candidate.video,
    candidate.video_url,
    candidate.video_path,
  ];

  return Array.from(
    new Set(
      allCandidates
        .map((entry) => {
          if (typeof entry === "string") return entry.trim();
          if (entry && typeof entry === "object") {
            const record = entry as Record<string, unknown>;
            const raw = record.url ?? record.path ?? record.src;
            return typeof raw === "string" ? raw.trim() : "";
          }
          return "";
        })
        .filter(Boolean)
        .map((rawPath) => getApiAssetUrl(rawPath)),
    ),
  );
}

export function readVideoUrl(ad: AdvertisementItem) {
  return readVideoUrls(ad)[0] ?? "";
}

export function getVirtualTourUrl(ad: AdvertisementItem) {
  return typeof ad.virtual_tour_link === "string" && ad.virtual_tour_link.trim()
    ? ad.virtual_tour_link.trim()
    : "";
}

export function hasTour3d(ad: AdvertisementItem) {
  return Boolean(getVirtualTourUrl(ad));
}

export function buildGalleryMediaItems(ad: AdvertisementItem) {
  const images = getAdvertisementImageUrls(ad);
  const videoItems: AlbumMediaItem[] = readVideoUrls(ad).map((src) => ({
    src,
    type: "video",
  }));
  const imageItems = images.map((src): AlbumMediaItem => ({ src, type: "image" }));

  return [...videoItems, ...imageItems];
}


