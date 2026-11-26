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

export const defaultSelectedCity: Readonly<Required<StoredSelectedCity>> = {
  id: "000000000000000000000101",
  latitude: 36.2605,
  longitude: 59.5986,
  name: "مشهد",
};

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

  if (!name) return { ...defaultSelectedCity };

  const storedId = window.localStorage.getItem(selectedCityStorageKeys.id) ?? undefined;
  const latitude = toFiniteNumber(window.localStorage.getItem(selectedCityStorageKeys.latitude));
  const longitude = toFiniteNumber(window.localStorage.getItem(selectedCityStorageKeys.longitude));
  const isDefaultCity = name.trim() === defaultSelectedCity.name;

  return {
    id: storedId ?? (isDefaultCity ? defaultSelectedCity.id : undefined),
    latitude:
      latitude !== undefined && isValidLatitude(latitude)
        ? latitude
        : isDefaultCity
          ? defaultSelectedCity.latitude
          : undefined,
    longitude:
      longitude !== undefined && isValidLongitude(longitude)
        ? longitude
        : isDefaultCity
          ? defaultSelectedCity.longitude
          : undefined,
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
    window.localStorage.setItem(selectedCityStorageKeys.latitude, String(city.latitude));
    window.localStorage.setItem(selectedCityStorageKeys.longitude, String(city.longitude));
  } else {
    window.localStorage.removeItem(selectedCityStorageKeys.latitude);
    window.localStorage.removeItem(selectedCityStorageKeys.longitude);
  }
}

export const initialDeepLinkStorageKey = "bonga-initial-deep-link";

export function isInternalAppPath(path: unknown): path is string {
  if (typeof path !== "string") return false;
  const trimmed = path.trim();
  return (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.includes("\\") &&
    !trimmed.startsWith("/\\")
  );
}

export function storeInitialDeepLinkPath(path: string) {
  if (typeof window === "undefined") return;
  if (!isInternalAppPath(path)) return;
  if (path === "/" || path === "/home" || path === "/onboarding") return;
  try {
    window.sessionStorage.setItem(initialDeepLinkStorageKey, path);
  } catch {
    // ignore sessionStorage errors
  }
}

export function getStoredInitialDeepLinkPath(): string {
  if (typeof window === "undefined") return "";
  try {
    const path = window.sessionStorage.getItem(initialDeepLinkStorageKey);
    return isInternalAppPath(path) ? path : "";
  } catch {
    return "";
  }
}

export function consumeInitialDeepLinkPath(): string {
  if (typeof window === "undefined") return "";
  try {
    const path = window.sessionStorage.getItem(initialDeepLinkStorageKey);
    if (path) {
      window.sessionStorage.removeItem(initialDeepLinkStorageKey);
    }
    return isInternalAppPath(path) ? path : "";
  } catch {
    return "";
  }
}

