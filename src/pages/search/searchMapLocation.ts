import { searchMapCenter, type SearchMapCenter } from "./searchMapData";

const mapCenterStorageKey = "bonga-search-map-center";
const ipCenterStorageKey = "bonga-search-ip-map-center";
const ipCenterCacheMs = 6 * 60 * 60 * 1000;
const locateTimeoutMs = 8_000;

const ipLocationProviders = [
  {
    url: "https://ipwho.is/",
    readLatitude: (payload: Record<string, unknown>) => payload.latitude,
    readLongitude: (payload: Record<string, unknown>) => payload.longitude,
    isValidPayload: (payload: Record<string, unknown>) => payload.success !== false,
  },
  {
    url: "https://ipapi.co/json/",
    readLatitude: (payload: Record<string, unknown>) => payload.latitude,
    readLongitude: (payload: Record<string, unknown>) => payload.longitude,
    isValidPayload: (payload: Record<string, unknown>) => !payload.error,
  },
] as const;

type StoredMapCenter = SearchMapCenter & {
  savedAt?: number;
};

function toNumber(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function isValidCoordinate(latitude: number, longitude: number) {
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

function isBrowserStorageAvailable(storage: Storage | undefined) {
  return typeof storage !== "undefined";
}

function readStoredCenter(key: string, storage: Storage | undefined) {
  if (!isBrowserStorageAvailable(storage)) return null;

  try {
    const storedValue = storage.getItem(key);
    if (!storedValue) return null;

    const parsed = JSON.parse(storedValue) as Partial<StoredMapCenter>;
    const latitude = toNumber(parsed.latitude);
    const longitude = toNumber(parsed.longitude);
    const zoom = toNumber(parsed.zoom);

    if (latitude === undefined || longitude === undefined || !isValidCoordinate(latitude, longitude)) {
      return null;
    }

    return {
      latitude,
      longitude,
      savedAt: toNumber(parsed.savedAt),
      zoom: zoom ?? searchMapCenter.zoom,
    } satisfies StoredMapCenter;
  } catch {
    return null;
  }
}

function storeCenter(key: string, center: SearchMapCenter, storage: Storage | undefined) {
  if (!isBrowserStorageAvailable(storage)) return;

  try {
    storage.setItem(
      key,
      JSON.stringify({
        ...center,
        savedAt: Date.now(),
      } satisfies StoredMapCenter),
    );
  } catch {
    // The map still works when browser storage is blocked or full.
  }
}

function withTimeout(signal?: AbortSignal) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), locateTimeoutMs);

  if (signal) {
    signal.addEventListener(
      "abort",
      () => {
        controller.abort();
      },
      { once: true },
    );
  }

  return {
    clear: () => window.clearTimeout(timeoutId),
    signal: controller.signal,
  };
}

export function hasExplicitSearchCity() {
  const params = new URLSearchParams(window.location.search);

  return Boolean(
    params.get("city_id") ||
      params.get("cityId") ||
      window.localStorage.getItem("bonga-selected-city-id"),
  );
}

export function getInitialMapCenter() {
  return readStoredCenter(mapCenterStorageKey, window.localStorage) ?? searchMapCenter;
}

export function storeSearchMapCenter(center: SearchMapCenter) {
  storeCenter(mapCenterStorageKey, center, window.localStorage);
}

export function getBrowserMapCenter() {
  return new Promise<SearchMapCenter>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not available."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        if (!isValidCoordinate(latitude, longitude)) {
          reject(new Error("Invalid geolocation coordinates."));
          return;
        }

        resolve({
          latitude,
          longitude,
          zoom: 16,
        });
      },
      reject,
      {
        enableHighAccuracy: true,
        maximumAge: 30_000,
        timeout: 12_000,
      },
    );
  });
}

export async function getIpBasedMapCenter(signal?: AbortSignal) {
  const cachedCenter = readStoredCenter(ipCenterStorageKey, window.sessionStorage);

  if (cachedCenter?.savedAt && Date.now() - cachedCenter.savedAt < ipCenterCacheMs) {
    return {
      latitude: cachedCenter.latitude,
      longitude: cachedCenter.longitude,
      zoom: cachedCenter.zoom,
    } satisfies SearchMapCenter;
  }

  for (const provider of ipLocationProviders) {
    const timeout = withTimeout(signal);

    try {
      const response = await fetch(provider.url, {
        cache: "no-store",
        signal: timeout.signal,
      });

      if (!response.ok) continue;

      const payload = (await response.json()) as Record<string, unknown>;

      if (!provider.isValidPayload(payload)) continue;

      const latitude = toNumber(provider.readLatitude(payload));
      const longitude = toNumber(provider.readLongitude(payload));

      if (latitude === undefined || longitude === undefined || !isValidCoordinate(latitude, longitude)) {
        continue;
      }

      const center = {
        latitude,
        longitude,
        zoom: 13,
      } satisfies SearchMapCenter;

      storeCenter(ipCenterStorageKey, center, window.sessionStorage);

      return center;
    } catch {
      // Try the next IP-location provider.
    } finally {
      timeout.clear();
    }
  }

  return null;
}
