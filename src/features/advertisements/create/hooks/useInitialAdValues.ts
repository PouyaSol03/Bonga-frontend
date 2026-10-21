import { useRef, useState } from "react";
import {
  blankValues,
  locationKey,
  locationLatKey,
  locationLngKey,
  neighborhoodIdKey,
  subNeighborhoodIdKey,
} from "../data";
import { loadAtomicDraft } from "../draft/adDraftStore";
import { readArrayValue } from "../edit-mapping/featureReaders";
import { mapAdvertisementToEditValues } from "../edit-mapping/mapAdvertisementToEditValues";
import { getEditAdRouteState } from "../routeState";
import { getNewAdFlowSession, shouldPreserveNewAdDraft } from "../session";
import type { FlowStep, NewAdFormValues } from "../types";
import { getDefaultValues } from "../utils";

function resolveRestoredSession(isEditMode: boolean) {
  const isPreserved =
    typeof window !== "undefined" && shouldPreserveNewAdDraft(window.history.state);

  // In edit mode without explicit preserve flag, edit ad from fresh record
  if (isEditMode && !isPreserved) {
    return null;
  }

  // 1. Try active session in memory
  const memSession = getNewAdFlowSession();
  if (memSession?.values && Object.keys(memSession.values).length > 0) {
    return memSession;
  }

  // 2. Try persistent atomic draft from localStorage
  const atomic = loadAtomicDraft();
  if (atomic?.values && Object.keys(atomic.values).length > 0) {
    return {
      draftAdId: atomic.draftAdId ?? null,
      neighborhoodId: atomic.neighborhoodId ?? null,
      step: atomic.step ?? "details",
      subNeighborhoodId: atomic.subNeighborhoodId ?? null,
      values: atomic.values as NewAdFormValues,
    };
  }

  return null;
}

export function useInitialAdValues(
  editAdState: ReturnType<typeof getEditAdRouteState>,
  editAdId: string | null,
) {
  const isEditMode = editAdState.isEditMode === true;
  const isInitialIncomplete =
    isEditMode &&
    (editAdState.status === "incomplete" ||
      String(editAdState.status) === "-5" ||
      editAdState.ad?.status === "incomplete" ||
      String(editAdState.ad?.status) === "-5" ||
      (editAdState.ad as Record<string, unknown> | undefined)?.status_code === -5 ||
      String((editAdState.ad as Record<string, unknown> | undefined)?.status_code) === "-5");

  const [restoredSession] = useState(() => resolveRestoredSession(isEditMode));

  const initialEditValuesRef = useRef<NewAdFormValues | null>(null);
  if (initialEditValuesRef.current === null && isEditMode && editAdState.ad) {
    initialEditValuesRef.current = mapAdvertisementToEditValues(
      editAdState.ad,
      getDefaultValues({ ...editAdState, isEditMode: true }),
    );
  }

  const [initialValues] = useState<NewAdFormValues>(() => {
    const restoredValues = restoredSession?.values;
    if (!restoredValues) return getDefaultValues(editAdState);

    const confirmedLocation = window.localStorage.getItem(locationKey)?.trim();
    const confirmedLat = window.localStorage.getItem(locationLatKey)?.trim();
    const confirmedLng = window.localStorage.getItem(locationLngKey)?.trim();
    const storedNeighborhoodId =
      restoredValues?.neighborhoodId || window.localStorage.getItem(neighborhoodIdKey) || undefined;
    const storedSubNeighborhoodId =
      restoredValues?.subNeighborhoodId ||
      window.localStorage.getItem(subNeighborhoodIdKey) ||
      undefined;

    if (storedNeighborhoodId && typeof window !== "undefined") {
      window.localStorage.setItem(neighborhoodIdKey, storedNeighborhoodId);
    }
    if (storedSubNeighborhoodId && typeof window !== "undefined") {
      window.localStorage.setItem(subNeighborhoodIdKey, storedSubNeighborhoodId);
    }
    if (confirmedLat && typeof window !== "undefined") {
      window.localStorage.setItem(locationLatKey, confirmedLat);
    }
    if (confirmedLng && typeof window !== "undefined") {
      window.localStorage.setItem(locationLngKey, confirmedLng);
    }

    return {
      ...blankValues,
      ...restoredValues,
      dailyHotelRooms:
        Array.isArray(restoredValues.dailyHotelRooms) && restoredValues.dailyHotelRooms.length
          ? restoredValues.dailyHotelRooms
          : blankValues.dailyHotelRooms,
      exchangeTargets: Array.isArray(restoredValues.exchangeTargets)
        ? restoredValues.exchangeTargets
        : [],
      facilities: Array.isArray(restoredValues.facilities) ? restoredValues.facilities : [],
      heatingCooling: Array.isArray(restoredValues.heatingCooling)
        ? restoredValues.heatingCooling
        : [],
      location: confirmedLocation || restoredValues.location || blankValues.location,
      lat: confirmedLat || (restoredValues.lat as string) || blankValues.lat,
      lng: confirmedLng || (restoredValues.lng as string) || blankValues.lng,
      neighborhoodId: storedNeighborhoodId,
      photos: Array.isArray(restoredValues.photos) ? restoredValues.photos : [],
      projectDetails: Array.isArray(restoredValues.projectDetails)
        ? restoredValues.projectDetails
        : [],
      selectedSpecs: Array.isArray(restoredValues.selectedSpecs)
        ? restoredValues.selectedSpecs
        : [],
      subNeighborhoodId: storedSubNeighborhoodId,
      suitableFor: readArrayValue(restoredValues.suitableFor),
      usageType: readArrayValue(restoredValues.usageType),
    };
  });

  const [initialStep] = useState<FlowStep>(() => restoredSession?.step ?? "details");
  const [initialDraftAdId] = useState<string | null>(
    () => restoredSession?.draftAdId ?? (isInitialIncomplete ? editAdId : null),
  );

  return {
    initialDraftAdId,
    initialEditValuesRef,
    initialStep,
    initialValues,
    isEditMode,
    isInitialIncomplete,
    restoredSession,
  };
}
