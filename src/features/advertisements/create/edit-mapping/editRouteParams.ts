import type { AdvertisementItem } from "../../api/advertisement.service";
import { getEditAdRouteState } from "../routeState";
import { getAdvertisementFeatures } from "./crmEditNormalizer";
import { normalizeLookupText } from "./featureReaders";
import { readFormCode } from "./specMappers";

export const editRouteParamsByFormCode: Record<string, { category: string; transaction: string }> = {
  daily_hotel: { category: "hotel", transaction: "daily" },
  daily_house_villa: { category: "villa-house", transaction: "daily" },
  daily_residential: { category: "apartment", transaction: "daily" },
  daily_suite: { category: "suite", transaction: "daily" },
  partnership: { category: "partnership", transaction: "partnership" },
  pre_sale: { category: "pre-sale", transaction: "pre-sale" },
  rent_commercial: { category: "commercial", transaction: "rent" },
  rent_industrial: { category: "factory", transaction: "rent" },
  rent_land: { category: "land", transaction: "rent" },
  rent_office: { category: "office", transaction: "rent" },
  rent_residential: { category: "apartment", transaction: "rent" },
  rent_short_term: { category: "suite", transaction: "daily" },
  rent_villa: { category: "villa-house", transaction: "rent" },
  sale_commercial: { category: "commercial", transaction: "buy" },
  sale_industrial: { category: "factory", transaction: "buy" },
  sale_land: { category: "land", transaction: "buy" },
  sale_office: { category: "office", transaction: "buy" },
  sale_old_house: { category: "old-house", transaction: "buy" },
  sale_residential: { category: "apartment", transaction: "buy" },
  sale_villa: { category: "villa-house", transaction: "buy" },
};

export function getEditAdId(routeState: ReturnType<typeof getEditAdRouteState>) {
  const params = new URLSearchParams(window.location.search);
  const queryAdId = params.get("adId");
  const stateAdId = routeState.ad?.id ?? routeState.ad?._id ?? routeState.card?.id;

  return queryAdId || (stateAdId === undefined || stateAdId === null ? null : String(stateAdId));
}

export function isCrmAdvertiseSource() {
  return new URLSearchParams(window.location.search).get("editSource") === "crm";
}

export function getEditRouteParamsFromAd(ad: AdvertisementItem) {
  const features = getAdvertisementFeatures(ad);
  const formCode = readFormCode(ad, features);

  return editRouteParamsByFormCode[formCode] ?? null;
}

export function syncEditRouteParams(ad: AdvertisementItem) {
  const routeParams = getEditRouteParamsFromAd(ad);
  const searchParams = new URLSearchParams(window.location.search);
  let changed = false;

  Object.entries(routeParams ?? {}).forEach(([key, value]) => {
    if (searchParams.get(key) === value) return;

    searchParams.set(key, value);
    changed = true;
  });

  const publisherType = normalizeLookupText(ad.publisher_type);
  if (["user", "agency", "agent"].includes(publisherType) && searchParams.get("publisherType") !== publisherType) {
    searchParams.set("publisherType", publisherType);
    changed = true;
  }

  if (publisherType === "agency" || publisherType === "agent") {
    if (searchParams.get("registrantType") !== "personal") {
      searchParams.set("registrantType", "personal");
      changed = true;
    }
  }

  if (searchParams.get("edit") !== "true") {
    searchParams.set("edit", "true");
    changed = true;
  }

  if (changed) {
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}?${searchParams.toString()}`,
    );
  }

  return changed;
}
