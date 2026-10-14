import type { AdvertisementFeature, AdvertisementItem } from "../../api/advertisement.service";
import {
  locationKey,
  locationLatKey,
  locationLngKey,
  neighborhoodIdKey,
  subNeighborhoodIdKey,
} from "../data";
import type { NewAdFormValues } from "../types";
import { numericInputText, readText, readTextValue } from "./featureReaders";

export function syncEditLocationStorage(
  ad: AdvertisementItem,
  features: AdvertisementFeature[],
  values: NewAdFormValues,
) {
  const existingLocation = window.localStorage.getItem(locationKey);
  const existingLat = window.localStorage.getItem(locationLatKey);
  const existingLng = window.localStorage.getItem(locationLngKey);
  const existingNeighborhoodId = window.localStorage.getItem(neighborhoodIdKey);

  if (!existingLocation && values.location) {
    window.localStorage.setItem(locationKey, values.location);
  }

  const lat = numericInputText(ad.lat ?? ad.latitude ?? (ad.location as any)?.coordinates?.[1]);
  const lng = numericInputText(
    ad.lng ?? ad.long ?? ad.longitude ?? (ad.location as any)?.coordinates?.[0],
  );
  const neighborhoodId =
    readTextValue(ad, features, ["neighborhood_id"], ["neighborhood_id"]) ||
    readText((ad.neighborhood as any)?.id) ||
    readText((ad as any).neighborhoodId);
  const subNeighborhoodId =
    readTextValue(ad, features, ["sub_neighborhood_id"], ["sub_neighborhood_id"]) ||
    readText((ad.sub_neighborhood as any)?.id) ||
    readText((ad as any).subNeighborhoodId);

  if (!existingLat && lat) window.localStorage.setItem(locationLatKey, lat);
  if (!existingLng && lng) window.localStorage.setItem(locationLngKey, lng);
  if (!existingNeighborhoodId && neighborhoodId)
    window.localStorage.setItem(neighborhoodIdKey, neighborhoodId);
  if (!window.localStorage.getItem(subNeighborhoodIdKey) && subNeighborhoodId) {
    window.localStorage.setItem(subNeighborhoodIdKey, subNeighborhoodId);
  }
}
