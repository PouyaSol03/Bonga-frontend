import type { AdvertisementFeature, AdvertisementItem } from "../../api/advertisement.service";
import {
  readStoredSelectedCity,
  saveSelectedCity,
} from "../../../../shared/lib/selectedCityStorage";
import {
  locationKey,
  locationLatKey,
  locationLngKey,
  neighborhoodIdKey,
  subNeighborhoodIdKey,
} from "../data";
import { shouldPreserveNewAdDraft } from "../session";
import type { NewAdFormValues } from "../types";
import { readText, readTextValue } from "./featureReaders";

export function toFiniteCoordinate(value: unknown): string {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? String(parsed) : "";
  }
  return "";
}

export function syncEditLocationStorage(
  ad: AdvertisementItem,
  features: AdvertisementFeature[],
  values: NewAdFormValues,
) {
  if (typeof window === "undefined") return;

  if (shouldPreserveNewAdDraft(window.history?.state)) {
    return;
  }

  if (values.location) {
    window.localStorage.setItem(locationKey, values.location);
  }

  const lat = toFiniteCoordinate(
    ad.lat ??
      ad.latitude ??
      (ad.location as { coordinates?: [number, number] } | undefined)?.coordinates?.[1],
  );
  const lng = toFiniteCoordinate(
    ad.lng ??
      ad.long ??
      ad.longitude ??
      (ad.location as { coordinates?: [number, number] } | undefined)?.coordinates?.[0],
  );
  const neighborhoodId =
    readTextValue(ad, features, ["neighborhood_id"], ["neighborhood_id"]) ||
    readText(ad.neighborhood?.id) ||
    readText(ad.neighborhoodId);
  const subNeighborhoodId =
    readTextValue(ad, features, ["sub_neighborhood_id"], ["sub_neighborhood_id"]) ||
    readText(ad.sub_neighborhood?.id) ||
    readText(ad.subNeighborhoodId);

  if (lat) window.localStorage.setItem(locationLatKey, lat);
  if (lng) window.localStorage.setItem(locationLngKey, lng);
  if (neighborhoodId) window.localStorage.setItem(neighborhoodIdKey, neighborhoodId);
  if (subNeighborhoodId) {
    window.localStorage.setItem(subNeighborhoodIdKey, subNeighborhoodId);
  } else {
    window.localStorage.removeItem(subNeighborhoodIdKey);
  }

  const cityObj = ad.city && typeof ad.city === "object" ? (ad.city as Record<string, unknown>) : null;
  const cityId = readText(cityObj?.id) || readText(ad.city_id);
  const cityName = readText(cityObj?.name) || readText(ad.city_name);
  if (cityId || cityName) {
    const existingCity = readStoredSelectedCity();
    saveSelectedCity({
      id: cityId || existingCity?.id || undefined,
      name:
        cityName ||
        (existingCity?.id && cityId && existingCity.id === cityId ? existingCity.name : "") ||
        existingCity?.name ||
        "",
      latitude: lat ? Number(lat) : undefined,
      longitude: lng ? Number(lng) : undefined,
    });
  }
}
