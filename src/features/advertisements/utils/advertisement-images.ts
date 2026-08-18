import { getApiAssetUrl } from "../../../shared/api/api";

type UnknownRecord = Record<string, unknown>;

type ImageCandidate = {
  isMain: boolean;
  source: string;
};

const directImageKeys = [
  "image",
  "imageUrl",
  "image_url",
  "cover",
  "coverImage",
  "cover_image",
  "thumbnail",
  "thumbnailUrl",
  "thumbnail_url",
] as const;

const nestedImageKeys = [
  "url",
  "path",
  "src",
  "image",
  "imageUrl",
  "image_url",
  "cover",
  "thumbnail",
] as const;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeImageString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  const source = value.trim();
  if (!source || source === "null" || source === "undefined") return undefined;

  return getApiAssetUrl(source);
}

function readNestedImageSource(value: unknown): string | undefined {
  const direct = normalizeImageString(value);
  if (direct) return direct;

  if (!isRecord(value)) return undefined;

  for (const key of nestedImageKeys) {
    const source = normalizeImageString(value[key]);
    if (source) return source;
  }

  return undefined;
}

function isMainImage(value: unknown) {
  if (!isRecord(value)) return false;

  return value.is_main === true || value.isMain === true || value.main === true;
}

/**
 * Normalizes every advertisement image shape currently returned by Bonga APIs.
 *
 * Supported examples:
 * - { image: "/uploads/a.jpg" }
 * - { images: ["/uploads/a.jpg"] }
 * - { images: [{ url: "...", is_main: true }] }
 * - legacy { path/src/image/thumbnail }
 *
 * Direct cover fields keep their historical priority. If they are absent,
 * images marked as main are preferred. Duplicate normalized URLs are removed.
 */
export function getAdvertisementImageUrls(source: unknown): string[] {
  if (!isRecord(source)) return [];

  const candidates: ImageCandidate[] = [];

  for (const key of directImageKeys) {
    const imageSource = readNestedImageSource(source[key]);
    if (imageSource) candidates.push({ isMain: true, source: imageSource });
  }

  const images = source.images;
  if (Array.isArray(images)) {
    const imageCandidates = images
      .map((image, index) => ({
        index,
        isMain: isMainImage(image),
        source: readNestedImageSource(image),
      }))
      .filter((image): image is { index: number; isMain: boolean; source: string } => Boolean(image.source))
      .sort((a, b) => Number(b.isMain) - Number(a.isMain) || a.index - b.index);

    for (const image of imageCandidates) {
      candidates.push({ isMain: image.isMain, source: image.source });
    }
  }

  const seen = new Set<string>();
  const result: string[] = [];

  for (const candidate of candidates) {
    if (seen.has(candidate.source)) continue;
    seen.add(candidate.source);
    result.push(candidate.source);
  }

  return result;
}

export function getPrimaryAdvertisementImageUrl(source: unknown): string | undefined {
  return getAdvertisementImageUrls(source)[0];
}

export function hasAdvertisementImage(source: unknown) {
  return Boolean(getPrimaryAdvertisementImageUrl(source));
}
