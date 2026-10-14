import { getApiAssetUrl } from "../../../../shared/api/api";
import { canonicalizeMediaPath } from "../utils";
import type { AdvertisementItem } from "../../api/advertisement.service";
import type { UploadedMediaFile } from "../types";

export function mediaSource(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";

  const record = value as Record<string, unknown>;

  for (const key of ["url", "path", "src", "file", "image", "video"]) {
    const candidate = record[key];
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }

  return "";
}

export function mediaName(source: string, fallback: string): string {
  const cleanSource = source.split("?")[0]?.split("#")[0] ?? source;
  return cleanSource.split("/").filter(Boolean).pop() || fallback;
}

export function getExistingPhotoMedia(ad: AdvertisementItem): UploadedMediaFile[] {
  const imageValues = Array.isArray(ad.images) ? ad.images : ad.image ? [ad.image] : [];

  const seen = new Set<string>();

  return imageValues.flatMap((value: any, index: number) => {
    const source = mediaSource(value);
    if (!source) return [];

    const canonical = canonicalizeMediaPath(source);
    const dedupeKey = canonical || source;
    if (seen.has(dedupeKey)) return [];
    seen.add(dedupeKey);

    return [
      {
        existingValue: canonical || source,
        id: `existing-image-${index}-${dedupeKey}`,
        name: mediaName(source, `image-${index + 1}`),
        previewUrl: getApiAssetUrl(source),
        size: 0,
        type: "image/*",
      } satisfies UploadedMediaFile,
    ];
  });
}

export function getExistingVideoMedia(ad: AdvertisementItem): UploadedMediaFile | null {
  const videoValues = Array.isArray(ad.videos)
    ? ad.videos
    : [ad.video, ad.video_url, ad.video_path].filter(Boolean);
  const value = videoValues[0];
  const source = mediaSource(value);

  if (!source) return null;

  const canonical = canonicalizeMediaPath(source);

  return {
    existingValue: canonical || source,
    id: `existing-video-${canonical || source}`,
    name: mediaName(source, "video.mp4"),
    previewUrl: getApiAssetUrl(source),
    size: 0,
    type: "video/mp4",
  };
}
