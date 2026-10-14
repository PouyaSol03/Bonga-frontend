import type { CategoryItem } from "../../../categories/api/category.service";
import type { CrmAdvertisePayload, CrmRecord } from "../../../crm/api/crm.service";
import { type AdvertisementItem, type AdvertisementFeature  } from "../../api/advertisement.service";
import { locationLatKey, locationLngKey, neighborhoodIdKey } from "../data";

import type { NewAdFormValues } from "../types";

export type EditableAdvertisementFeature = AdvertisementFeature & { key?: string };
import { buildPayload } from "../utils";
import { isCrmAdvertiseSource } from "./editRouteParams";
import { normalizeLookupText } from "./featureReaders";
import { mediaSource } from "./mediaMappers";

export function getAdvertisementFeatures(
  ad: AdvertisementItem | Record<string, unknown> | undefined,
) {
  if (!ad || !Array.isArray(ad.features)) return [];

  return ad.features.flatMap((feature) => {
    if (!feature || typeof feature !== "object") return [];
    const item = feature as Record<string, unknown>;
    const label =
      (typeof item.label === "string" && item.label.trim()) ||
      (typeof item.key === "string" && item.key.trim()) ||
      (typeof item.name === "string" && item.name.trim()) ||
      "";
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
): Promise<CrmAdvertisePayload> {
  const structuredPayload = buildPayload(values);
  const formCode = structuredPayload.features.find((feature) => feature.key === "form_code")?.value;
  const storedLat = window.localStorage.getItem(locationLatKey);
  const storedLng = window.localStorage.getItem(locationLngKey);
  const storedNeighborhoodId =
    values.neighborhoodId || window.localStorage.getItem(neighborhoodIdKey);
  const lat = Number(storedLat ?? original.lat ?? original.latitude);
  const lng = Number(storedLng ?? original.lng ?? original.long ?? original.longitude);
  const images = values.photos.flatMap((photo) => {
    if (photo.file) return [];

    const source = mediaSource(photo.existingValue);
    return source && !source.toLowerCase().includes("data:image/") ? [source] : [];
  });

  return {
    contact_type: structuredPayload.contact_type.map(String),
    description: values.description,
    features: structuredPayload.features,
    form_code: typeof formCode === "string" ? formCode : String(formCode ?? ""),
    images: images.filter(Boolean),
    lat,
    lng,
    neighborhood_id:
      storedNeighborhoodId ||
      nestedRecordId(original, "neighborhood_id", ["neighborhood", "district"]),
    owner_phone: values.phoneNumber || String(original.owner_phone ?? ""),
    owner_type: values.registrantType || String(original.owner_type ?? ""),
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
