import { neighborhoodIdKey, subNeighborhoodIdKey } from "./data";
import type { FlowStep, NewAdFormValues } from "./types";

export const preserveNewAdDraftStateKey = "__bongaPreserveNewAdDraft";

type NewAdFlowSession = {
  step: FlowStep;
  values: NewAdFormValues;
  draftAdId?: string | null;
  neighborhoodId?: string | null;
  subNeighborhoodId?: string | null;
};

let activeSession: NewAdFlowSession | null = null;

function cloneValues(values: NewAdFormValues): NewAdFormValues {
  try {
    return structuredClone(values);
  } catch {
    return {
      ...values,
      dailyHotelRooms: values.dailyHotelRooms.map((room) => ({ ...room })),
      exchangeTargets: [...values.exchangeTargets],
      facilities: [...values.facilities],
      heatingCooling: [...values.heatingCooling],
      photos: values.photos.map((photo) => ({ ...photo })),
      projectDetails: values.projectDetails.map((item) => ({ ...item })),
      selectedSpecs: [...values.selectedSpecs],
      video: values.video ? { ...values.video } : null,
    };
  }
}

export function saveNewAdFlowSession(
  values: NewAdFormValues,
  step: FlowStep,
  draftAdId?: string | null,
  neighborhoodId?: string | null,
  subNeighborhoodId?: string | null,
) {
  const resolvedNeighborhoodId =
    neighborhoodId ??
    values.neighborhoodId ??
    (typeof window !== "undefined" ? window.localStorage.getItem(neighborhoodIdKey) : null);
  const resolvedSubNeighborhoodId =
    subNeighborhoodId ??
    values.subNeighborhoodId ??
    (typeof window !== "undefined" ? window.localStorage.getItem(subNeighborhoodIdKey) : null);

  activeSession = {
    step,
    values: cloneValues({
      ...values,
      neighborhoodId: resolvedNeighborhoodId ?? undefined,
      subNeighborhoodId: resolvedSubNeighborhoodId ?? undefined,
    }),
    draftAdId: draftAdId ?? activeSession?.draftAdId ?? null,
    neighborhoodId: resolvedNeighborhoodId,
    subNeighborhoodId: resolvedSubNeighborhoodId,
  };

  if (typeof window !== "undefined") {
    if (resolvedNeighborhoodId) {
      window.localStorage.setItem(neighborhoodIdKey, resolvedNeighborhoodId);
    }
    if (resolvedSubNeighborhoodId) {
      window.localStorage.setItem(subNeighborhoodIdKey, resolvedSubNeighborhoodId);
    }
  }
}

export function getNewAdFlowSession() {
  if (!activeSession) return null;

  if (typeof window !== "undefined") {
    if (activeSession.neighborhoodId && !window.localStorage.getItem(neighborhoodIdKey)) {
      window.localStorage.setItem(neighborhoodIdKey, activeSession.neighborhoodId);
    }
    if (activeSession.subNeighborhoodId && !window.localStorage.getItem(subNeighborhoodIdKey)) {
      window.localStorage.setItem(subNeighborhoodIdKey, activeSession.subNeighborhoodId);
    }
  }

  return {
    step: activeSession.step,
    values: cloneValues(activeSession.values),
    draftAdId: activeSession.draftAdId ?? null,
    neighborhoodId: activeSession.neighborhoodId ?? null,
    subNeighborhoodId: activeSession.subNeighborhoodId ?? null,
  } satisfies NewAdFlowSession;
}

export function updateNewAdFlowSessionLocation(
  location: string,
  options?: {
    neighborhoodId?: string | null;
    subNeighborhoodId?: string | null;
    lat?: string | null;
    lng?: string | null;
  },
) {
  if (!activeSession) return;

  activeSession = {
    ...activeSession,
    neighborhoodId: options?.neighborhoodId ?? activeSession.neighborhoodId,
    subNeighborhoodId: options?.subNeighborhoodId ?? activeSession.subNeighborhoodId,
    values: {
      ...cloneValues(activeSession.values),
      location,
      ...(options?.neighborhoodId ? { neighborhoodId: options.neighborhoodId } : {}),
      ...(options?.subNeighborhoodId !== undefined
        ? { subNeighborhoodId: options.subNeighborhoodId ?? undefined }
        : {}),
      ...(options?.lat ? { lat: options.lat } : {}),
      ...(options?.lng ? { lng: options.lng } : {}),
    },
  };
}

export function clearNewAdFlowSession() {
  activeSession = null;
}

export function shouldPreserveNewAdDraft(state: unknown) {
  if (!state || typeof state !== "object" || Array.isArray(state)) return false;
  const raw = state as Record<string, unknown>;
  const usr = raw.usr as Record<string, unknown> | undefined;
  return (
    raw[preserveNewAdDraftStateKey] === true ||
    (usr && typeof usr === "object" && usr[preserveNewAdDraftStateKey] === true)
  );
}
