import {
  draftKey,
  locationKey,
  locationLatKey,
  locationLngKey,
  neighborhoodIdKey,
  subNeighborhoodIdKey,
} from "../data";
import type { FlowStep, NewAdFormValues } from "../types";

export const ATOMIC_DRAFT_KEY = "bonga-ad-draft-atomic";

interface AtomicAdDraft {
  draftAdId?: string | null;
  lat?: string;
  lng?: string;
  location?: string;
  neighborhoodId?: string;
  step?: FlowStep;
  subNeighborhoodId?: string;
  updatedAt?: number;
  values?: Partial<NewAdFormValues>;
}

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function loadAtomicDraft(): AtomicAdDraft | null {
  if (typeof window === "undefined") return null;

  const stored = safeParse<AtomicAdDraft>(window.localStorage.getItem(ATOMIC_DRAFT_KEY));
  if (stored) return stored;

  // Fallback to legacy fragmented keys if atomic draft does not exist yet
  const legacyValues = safeParse<Partial<NewAdFormValues>>(window.localStorage.getItem(draftKey));
  const location = window.localStorage.getItem(locationKey)?.trim() || "";
  const lat = window.localStorage.getItem(locationLatKey)?.trim() || "";
  const lng = window.localStorage.getItem(locationLngKey)?.trim() || "";
  const neighborhoodId = window.localStorage.getItem(neighborhoodIdKey)?.trim() || "";
  const subNeighborhoodId = window.localStorage.getItem(subNeighborhoodIdKey)?.trim() || "";

  if (!legacyValues && !location && !neighborhoodId) return null;

  return {
    lat,
    lng,
    location,
    neighborhoodId,
    subNeighborhoodId,
    values: legacyValues ?? undefined,
  };
}

export function saveAtomicDraft(draft: AtomicAdDraft): void {
  if (typeof window === "undefined") return;

  const prev = loadAtomicDraft() ?? {};
  const merged: AtomicAdDraft = {
    ...prev,
    ...draft,
    updatedAt: Date.now(),
  };

  try {
    window.localStorage.setItem(ATOMIC_DRAFT_KEY, JSON.stringify(merged));
  } catch {
    // Ignore storage quota errors
  }

  // Synchronize legacy keys transparently for backward compatibility
  if (merged.values) {
    const safeDraftValues = {
      ...merged.values,
      hasVideo: false,
      location: merged.location || merged.values.location || "",
      neighborhoodId: merged.neighborhoodId || merged.values.neighborhoodId || "",
      photos: [],
      subNeighborhoodId: merged.subNeighborhoodId || merged.values.subNeighborhoodId || "",
      video: null,
    };
    try {
      window.localStorage.setItem(draftKey, JSON.stringify(safeDraftValues));
    } catch {
      // Ignore
    }
  }

  if (merged.location) window.localStorage.setItem(locationKey, merged.location);
  if (merged.lat) window.localStorage.setItem(locationLatKey, merged.lat);
  if (merged.lng) window.localStorage.setItem(locationLngKey, merged.lng);
  if (merged.neighborhoodId) window.localStorage.setItem(neighborhoodIdKey, merged.neighborhoodId);
  if (merged.subNeighborhoodId)
    window.localStorage.setItem(subNeighborhoodIdKey, merged.subNeighborhoodId);
}

export function clearAtomicDraft(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(ATOMIC_DRAFT_KEY);
  window.localStorage.removeItem(draftKey);
  window.localStorage.removeItem(locationKey);
  window.localStorage.removeItem(locationLatKey);
  window.localStorage.removeItem(locationLngKey);
  window.localStorage.removeItem(neighborhoodIdKey);
  window.localStorage.removeItem(subNeighborhoodIdKey);
}

