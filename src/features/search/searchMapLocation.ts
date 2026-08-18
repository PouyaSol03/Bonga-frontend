import type { SearchMapCenter } from "./searchMapData";

type IpLocationResponse = {
  lat?: number | string;
  latitude?: number | string;
  lon?: number | string;
  longitude?: number | string;
  success?: boolean;
};

const ipLocationTimeoutMs = 3500;

function toFiniteNumber(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function readIpLocationPayload(payload: IpLocationResponse): SearchMapCenter | null {
  if (payload.success === false) return null;

  const latitude = toFiniteNumber(payload.latitude ?? payload.lat);
  const longitude = toFiniteNumber(payload.longitude ?? payload.lon);

  if (latitude === null || longitude === null) return null;
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;

  return {
    latitude,
    longitude,
    zoom: 13,
  };
}

async function fetchIpLocation(url: string, signal: AbortSignal) {
  const response = await fetch(url, {
    cache: "no-store",
    credentials: "omit",
    signal,
  });

  if (!response.ok) return null;

  return readIpLocationPayload((await response.json()) as IpLocationResponse);
}

export async function getIpDefaultMapCenter(): Promise<SearchMapCenter | null> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), ipLocationTimeoutMs);

  try {
    return (
      (await fetchIpLocation("https://ipapi.co/json/", controller.signal)) ??
      (await fetchIpLocation("https://ipwho.is/", controller.signal))
    );
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}
