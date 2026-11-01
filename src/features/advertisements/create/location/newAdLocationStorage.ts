import {
  defaultSelectedCity,
  readStoredSelectedCity,
} from "../../../../shared/lib/selectedCityStorage";
import {
  getStoredSelectedCityCenter,
  readStoredCoordinate,
} from "../../../../shared/lib/selectedCityCenter";
import {
  locationKey,
  locationLatKey,
  locationLngKey,
  neighborhoodIdKey,
} from "../data";
import type {
  NeighborhoodDto,
  SubNeighborhoodDto,
} from "../../../locations/api/neighborhood.service";
import { getNeighborhoodSubNeighborhoods } from "../../../locations/api/neighborhood.service";

export type NewAdMapCenter = {
  lat: number;
  lng: number;
  zoom: number;
};

export const defaultMapCenter: NewAdMapCenter = {
  lat: defaultSelectedCity.latitude,
  lng: defaultSelectedCity.longitude,
  zoom: 15,
};

export const selectedCityMapZoom = 12;
export const selectedNeighborhoodMapZoom = 16;
export const minNeighborhoodSearchLength = 3;

export function getStoredCityId() {
  return readStoredSelectedCity()?.id ?? "";
}

export function getStoredMapCenter(): NewAdMapCenter {
  const storedLat = readStoredCoordinate(locationLatKey);
  const storedLng = readStoredCoordinate(locationLngKey);

  if (
    storedLat !== null &&
    Math.abs(storedLat) <= 90 &&
    storedLng !== null &&
    Math.abs(storedLng) <= 180
  ) {
    return {
      lat: storedLat,
      lng: storedLng,
      zoom: selectedNeighborhoodMapZoom,
    };
  }

  const selectedCityCenter = getStoredSelectedCityCenter();

  if (selectedCityCenter) {
    return {
      lat: selectedCityCenter.lat,
      lng: selectedCityCenter.lng,
      zoom: selectedCityMapZoom,
    };
  }

  return { ...defaultMapCenter, zoom: selectedCityMapZoom };
}

export function getNeighborhoodId(neighborhood: NeighborhoodDto | null) {
  return String(neighborhood?.id ?? neighborhood?._id ?? "");
}

export function getSubNeighborhoodId(subNeighborhood: SubNeighborhoodDto | null) {
  return String(subNeighborhood?.id ?? "");
}

export function normalizeLocationName(value: string) {
  return value.trim().toLocaleLowerCase("fa");
}

export function createStoredNeighborhood(): NeighborhoodDto | null {
  const id = window.localStorage.getItem(neighborhoodIdKey) ?? "";
  const name = window.localStorage.getItem(locationKey) ?? "";
  const lat = readStoredCoordinate(locationLatKey);
  const lng = readStoredCoordinate(locationLngKey);

  if (!id || !name) return null;

  return {
    id,
    lat: lat ?? undefined,
    lng: lng ?? undefined,
    name,
  };
}

export function findMatchingSubNeighborhood(
  neighborhood: NeighborhoodDto,
  selectedSubNeighborhood: SubNeighborhoodDto | null,
) {
  if (!selectedSubNeighborhood) return null;

  const subNeighborhoods = getNeighborhoodSubNeighborhoods(neighborhood);
  const selectedId = getSubNeighborhoodId(selectedSubNeighborhood);

  if (selectedId) {
    const idMatch = subNeighborhoods.find(
      (item: SubNeighborhoodDto) => getSubNeighborhoodId(item) === selectedId,
    );
    if (idMatch) return idMatch;
  }

  const selectedName = normalizeLocationName(selectedSubNeighborhood.name);
  if (!selectedName) return null;

  return (
    subNeighborhoods.find(
      (item: SubNeighborhoodDto) => normalizeLocationName(item.name) === selectedName,
    ) ?? null
  );
}
