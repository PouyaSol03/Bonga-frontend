import { getStoredSelectedCityCenter } from "../../../shared/lib/selectedCityCenter";
import { searchMapCenter } from "../../search/searchMapData";
import type { NeighborhoodDto } from "../../locations/api/neighborhood.service";
import type { MyAgencyProfile } from "../../account/api/account.service";
import type { AgencyProfileMapCenter, SelectedNeighborhood } from "./types";

export const neighborhoodSearchDebounceMs = 250;
export const agencyImageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
export const selectedCityMapZoom = 12;

export function getInitialAgencyProfileMapCenter(): AgencyProfileMapCenter {
  const selectedCityCenter = getStoredSelectedCityCenter();

  if (selectedCityCenter) {
    return {
      lat: selectedCityCenter.lat,
      lng: selectedCityCenter.lng,
      zoom: selectedCityMapZoom,
    };
  }

  return {
    lat: searchMapCenter.latitude,
    lng: searchMapCenter.longitude,
    zoom: selectedCityMapZoom,
  };
}

export function getNeighborhoodId(neighborhood: NeighborhoodDto) {
  return String(neighborhood.id ?? neighborhood._id ?? neighborhood.name);
}

export function toSelectedNeighborhood(neighborhood: NeighborhoodDto): SelectedNeighborhood {
  return {
    id: getNeighborhoodId(neighborhood),
    lat: Number.isFinite(Number(neighborhood.lat)) ? Number(neighborhood.lat) : undefined,
    lng: Number.isFinite(Number(neighborhood.lng)) ? Number(neighborhood.lng) : undefined,
    name: neighborhood.name,
  };
}

export function normalizeOptionalText(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : null;
}

export function normalizeProfileText(value: string | null | undefined) {
  return value ?? "";
}

export function normalizeProfileCoordinate(value: MyAgencyProfile["lat"] | MyAgencyProfile["lng"]) {
  if (value === null || value === undefined || value === "") return null;
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

export function findNearestNeighborhood(
  lat: number,
  lng: number,
  neighborhoods: NeighborhoodDto[],
): SelectedNeighborhood | null {
  let nearest: NeighborhoodDto | null = null;
  let minDistance = Infinity;

  for (const n of neighborhoods) {
    const nLat = Number(n.lat);
    const nLng = Number(n.lng);
    if (Number.isFinite(nLat) && Number.isFinite(nLng)) {
      const d = (lat - nLat) ** 2 + (lng - nLng) ** 2;
      if (d < minDistance) {
        minDistance = d;
        nearest = n;
      }
    }
  }

  return nearest ? toSelectedNeighborhood(nearest) : null;
}

export function resolveNeighborhoodById(
  id: string | null | undefined,
  neighborhoods: NeighborhoodDto[],
): SelectedNeighborhood | null {
  if (!id) return null;

  const normalizedId = String(id);
  const neighborhood = neighborhoods.find((item) => getNeighborhoodId(item) === normalizedId);

  return neighborhood ? toSelectedNeighborhood(neighborhood) : null;
}

export function resolveProfileNeighborhoodIds(profile: MyAgencyProfile) {
  return Array.from(
    new Set(
      (profile.neighborhood_ids ?? [])
        .flatMap((value) => String(value).split(","))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}
