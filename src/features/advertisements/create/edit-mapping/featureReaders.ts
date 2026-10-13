import type { AdvertisementFeature, AdvertisementItem } from "../../api/advertisement.service";
import type { NewAdFormValues } from "../types";
import {
  normalizeLookupText,
  readText,
} from "./featureFormatters";

export function readFeatureValue(features: AdvertisementFeature[], labels: string[]): unknown {
  const normalizedLabels = labels.map(normalizeLookupText);
  const feature = features.find((item: any) => {
    const lookupValues = [item.key, item.label, (item as any).name]
      .map(normalizeLookupText)
      .filter(Boolean);

    return lookupValues.some((value) => normalizedLabels.includes(value));
  });

  return feature?.value;
}

export function readFirstValue(
  ad: AdvertisementItem,
  features: AdvertisementFeature[],
  labels: string[],
  keys: string[] = labels,
): unknown {
  const featureValue = readFeatureValue(features, labels);

  if (featureValue !== undefined && featureValue !== null && featureValue !== "") return featureValue;

  for (const key of keys) {
    const value = ad[key];

    if (value !== undefined && value !== null && value !== "") return value;
  }

  return undefined;
}

export function readTextValue(
  ad: AdvertisementItem,
  features: AdvertisementFeature[],
  labels: string[],
  keys: string[] = labels,
): string {
  return readText(readFirstValue(ad, features, labels, keys));
}

export function readContactTypes(ad: AdvertisementItem): string[] {
  const contactTypes = Array.isArray(ad.contact_type) ? ad.contact_type : [];

  return contactTypes.map((item: any) => normalizeLookupText(item));
}

export function readSocialValue(ad: AdvertisementItem, key: "telegram" | "whatsapp"): string {
  for (const sourceKey of ["contacts", "contact_social", "social"]) {
    const source = ad[sourceKey];

    if (source && typeof source === "object") {
      const value = readText((source as Record<string, unknown>)[key]);

      if (value) return value;
    }
  }

  return readText(ad[key]);
}

export function readPublisherName(ad: AdvertisementItem, features: AdvertisementFeature[]): string {
  const publisherType = normalizeLookupText(ad.publisher_type ?? ad.owner_type);
  if (publisherType === "agent") {
    const agent = ad.agent && typeof ad.agent === "object" ? (ad.agent as Record<string, unknown>) : null;
    const consultant = ad.consultant && typeof ad.consultant === "object" ? (ad.consultant as Record<string, unknown>) : null;
    const ownerProfile = ad.owner_profile && typeof ad.owner_profile === "object" ? (ad.owner_profile as Record<string, unknown>) : null;
    const name = readText(agent?.name ?? consultant?.name ?? ownerProfile?.name);
    if (name) return name;
  }

  if (publisherType === "agency") {
    const agency = ad.agency && typeof ad.agency === "object" ? (ad.agency as Record<string, unknown>) : null;
    const name = readText(agency?.name);
    if (name) return name;
  }

  return readTextValue(ad, features, ["publisher", "publisher_name", "agency"], [
    "publisher",
    "publisherName",
    "publisher_name",
    "agency",
    "agency_name",
  ]);
}

export function readRegistrantType(ad: AdvertisementItem, features: AdvertisementFeature[]): NewAdFormValues["registrantType"] {
  const publisherType = normalizeLookupText(ad.publisher_type);

  if (publisherType === "agency" || publisherType === "agent") return "personal";

  const ownerType = normalizeLookupText(ad.owner_type);
  const advertiserType = normalizeLookupText(readFeatureValue(features, ["advertiser_type"]));

  if (ownerType.includes("agency") || advertiserType.includes("مشاور") || advertiserType.includes("املاک") || advertiserType.includes("آژانس")) {
    return "agency";
  }

  if (ownerType.includes("owner") || ownerType.includes("personal") || advertiserType.includes("شخصی")) {
    return "personal";
  }

  return "";
}

export * from "./featureFormatters";

