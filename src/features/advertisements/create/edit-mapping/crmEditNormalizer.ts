import type { CategoryItem } from "../../../categories/api/category.service";
import type { CrmAdvertisePayload, CrmRecord } from "../../../crm/api/crm.service";
import { uploadCrmAdvertiseImage } from "../../../crm/api/services/crmAdvertises.service";
import { type AdvertisementItem, type AdvertisementFeature  } from "../../api/advertisement.service";
import { locationLatKey, locationLngKey, neighborhoodIdKey } from "../data";

import type { NewAdFormValues } from "../types";

type EditableAdvertisementFeature = AdvertisementFeature & { key?: string };
import { buildPayload, getAdvertiseFormCode, getParams } from "../utils";
import { isCrmAdvertiseSource } from "./editRouteParams";
import { getAdvertisementFeatures, normalizeLookupText } from "./featureReaders";
import { mediaSource } from "./mediaMappers";

export { getAdvertisementFeatures };

export function normalizeCrmDynamicFields(value: unknown): EditableAdvertisementFeature[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
      .flatMap((item) => {
        const label = [item.label, item.name, item.code, item.key]
          .find(
            (candidate): candidate is string =>
              typeof candidate === "string" && Boolean(candidate.trim()),
          )
          ?.trim();

        if (!label) return [];

        return [
          {
            key: typeof item.key === "string" ? item.key : undefined,
            label,
            value: item.value,
          } satisfies EditableAdvertisementFeature,
        ];
      });
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).map(([label, fieldValue]) => ({
      label,
      value: fieldValue,
    }));
  }

  return [];
}

export function normalizeCrmAdvertiseForEdit(record: CrmRecord): AdvertisementItem {
  const advertise = record as AdvertisementItem;
  const existingFeatures = getAdvertisementFeatures(advertise);
  const dynamicFeatures = normalizeCrmDynamicFields(record.dynamic_fields ?? record.dynamicFields);

  return {
    ...advertise,
    features: existingFeatures.length ? existingFeatures : dynamicFeatures,
  };
}

export function nestedRecordId(record: CrmRecord, directKey: string, nestedKeys: string[]) {
  const directValue = record[directKey];
  if (directValue !== undefined && directValue !== null && String(directValue).trim()) {
    return String(directValue);
  }

  for (const key of nestedKeys) {
    const nestedValue = record[key];
    if (!nestedValue || typeof nestedValue !== "object" || Array.isArray(nestedValue)) continue;

    const nestedRecord = nestedValue as CrmRecord;
    const id = nestedRecord.id ?? nestedRecord._id;
    if (id !== undefined && id !== null && String(id).trim()) return String(id);
  }

  return "";
}

export function flattenCategories(categories: CategoryItem[]): CategoryItem[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children ?? []),
  ]);
}

export function findCategoryId(categories: CategoryItem[], value: string) {
  const target = normalizeLookupText(value).replace(/_/g, "-");
  const match = flattenCategories(categories).find((category) =>
    [category.id, category.code, category.slug]
      .map((candidate) => normalizeLookupText(candidate).replace(/_/g, "-"))
      .includes(target),
  );

  return match?.id ? String(match.id) : null;
}

export async function buildCrmAdvertisePayload(
  values: NewAdFormValues,
  original: CrmRecord = {},
  options?: { dynamicFieldKeys?: Iterable<string> },
): Promise<CrmAdvertisePayload> {
  const structuredPayload = buildPayload(values, options);
  const params = getParams();
  const formCode =
    structuredPayload.features.find((feature) => feature.key === "form_code")?.value ||
    getAdvertiseFormCode(params.transaction, params.category);
  const storedLat = window.localStorage.getItem(locationLatKey);
  const storedLng = window.localStorage.getItem(locationLngKey);
  const storedNeighborhoodId =
    values.neighborhoodId || window.localStorage.getItem(neighborhoodIdKey);
  const lat = Number(storedLat ?? original.lat ?? original.latitude);
  const lng = Number(storedLng ?? original.lng ?? original.long ?? original.longitude);
  const images = (
    await Promise.all(
      values.photos.map(async (photo) => {
        if (photo.file) {
          try {
            const uploaded = await uploadCrmAdvertiseImage(photo.file);
            if (uploaded) return uploaded;
          } catch {
            // ignore
          }
          return null;
        }

        const source = mediaSource(photo.existingValue || photo.previewUrl);
        return source && !source.startsWith("blob:") && !source.toLowerCase().includes("data:image/")
          ? source
          : null;
      }),
    )
  ).filter((img): img is string => Boolean(img));

  const isAgencyTarget =
    values.targetOwnerType === "agency" || Boolean(values.agencyId);

  const forbiddenFeatureKeys = new Set([
    "agency_id",
    "consultant_id",
    "publisher",
    "has_virtual_tour",
    "has_image",
    "has_video",
    "location",
    "form_code",
    "owner_type",
    "target_owner_type",
    "target_owner_id",
    "request_id",
    "reason",
  ]);

  const dynamicKeys = options?.dynamicFieldKeys ? new Set(options.dynamicFieldKeys) : null;

  const features = structuredPayload.features.filter((feature) => {
    if (forbiddenFeatureKeys.has(feature.key)) return false;
    if (isAgencyTarget && feature.key === "agency_id") return false;
    if (dynamicKeys && !dynamicKeys.has(feature.key)) return false;
    return true;
  });

  return {
    contact_type: structuredPayload.contact_type.map(String),
    description: values.description,
    features,
    form_code: typeof formCode === "string" ? formCode : String(formCode ?? ""),
    images: images.filter(Boolean),
    lat,
    lng,
    neighborhood_id:
      storedNeighborhoodId ||
      nestedRecordId(original, "neighborhood_id", ["neighborhood", "district"]),
    owner_phone: values.phoneNumber || String(original.owner_phone ?? ""),
    ...(isAgencyTarget
      ? {}
      : { owner_type: values.registrantType || String(original.owner_type ?? "") }),
    title: values.title,
    virtual_tour_link: values.virtualTourLink,
    ...(isCrmAdvertiseSource() && values.targetOwnerType && values.targetOwnerId
      ? {
          target_owner_type: values.targetOwnerType,
          target_owner_id: values.targetOwnerId,
        }
      : {}),
  };
}
