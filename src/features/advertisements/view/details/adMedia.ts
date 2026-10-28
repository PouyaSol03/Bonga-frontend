import { getApiAssetUrl } from "../../../../shared/api/api";
import { getAdvertisementImageUrls } from "../../utils/advertisement-images";
import type { AdvertisementItem } from "../../api/advertisement.service";
import { getFeatureValue } from "./featureValues";
import { toNumber, toText } from "./detailCore";

export type AlbumMediaItem = {
  src: string;
  type: "image" | "video";
};


export function isOwnAdvertisement(ad: AdvertisementItem) {
  return (ad as { is_mine?: unknown }).is_mine === true;
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

export function readVideoUrl(ad: AdvertisementItem) {
  return typeof ad.video === "string" && ad.video.trim() ? getApiAssetUrl(ad.video) : "";
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
  const videoUrl = readVideoUrl(ad);
  const imageItems = images.map((src): AlbumMediaItem => ({ src, type: "image" }));

  if (!videoUrl) {
    return imageItems;
  }

  return [
    ...imageItems,
    {
      src: videoUrl,
      type: "video" as const,
    },
  ];
}


