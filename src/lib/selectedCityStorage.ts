export type StoredSelectedCity = {
  id?: string;
  latitude?: number;
  longitude?: number;
  name: string;
};

export const selectedCityStorageKeys = {
  id: "bonga-selected-city-id",
  latitude: "bonga-selected-city-lat",
  longitude: "bonga-selected-city-lng",
  name: "bonga-selected-city",
} as const;

function toFiniteNumber(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function isValidLatitude(value: number) {
  return Math.abs(value) <= 90;
}

function isValidLongitude(value: number) {
  return Math.abs(value) <= 180;
}

export function readStoredSelectedCity(): StoredSelectedCity | null {
  const name =
    window.localStorage.getItem(selectedCityStorageKeys.name) ??
    window.sessionStorage.getItem(selectedCityStorageKeys.name) ??
    "";

  if (!name) return null;

  const latitude = toFiniteNumber(
    window.localStorage.getItem(selectedCityStorageKeys.latitude),
  );
  const longitude = toFiniteNumber(
    window.localStorage.getItem(selectedCityStorageKeys.longitude),
  );

  return {
    id: window.localStorage.getItem(selectedCityStorageKeys.id) ?? undefined,
    latitude:
      latitude !== undefined && isValidLatitude(latitude) ? latitude : undefined,
    longitude:
      longitude !== undefined && isValidLongitude(longitude) ? longitude : undefined,
    name,
  };
}

export function saveSelectedCity(city: StoredSelectedCity) {
  window.localStorage.setItem(selectedCityStorageKeys.name, city.name);

  if (city.id) {
    window.localStorage.setItem(selectedCityStorageKeys.id, city.id);
  } else {
    window.localStorage.removeItem(selectedCityStorageKeys.id);
  }

  if (
    city.latitude !== undefined &&
    city.longitude !== undefined &&
    isValidLatitude(city.latitude) &&
    isValidLongitude(city.longitude)
  ) {
    window.localStorage.setItem(
      selectedCityStorageKeys.latitude,
      String(city.latitude),
    );
    window.localStorage.setItem(
      selectedCityStorageKeys.longitude,
      String(city.longitude),
    );
  } else {
    window.localStorage.removeItem(selectedCityStorageKeys.latitude);
    window.localStorage.removeItem(selectedCityStorageKeys.longitude);
  }
}
