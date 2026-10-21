import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  locationKey,
  locationLatKey,
  locationLngKey,
  neighborhoodIdKey,
  subNeighborhoodIdKey,
} from "../data";
import { saveAtomicDraft } from "../draft/adDraftStore";
import { saveNewAdFlowSession, shouldPreserveNewAdDraft } from "../session";
import type { FlowStep, NewAdFieldErrors, NewAdFormValues } from "../types";
import { clearNewAdDraftStorage } from "../utils";

interface UseNewAdDraftSyncProps {
  draftAdId: string | null;
  fieldErrors: NewAdFieldErrors;
  isEditMode: boolean;
  methods: UseFormReturn<NewAdFormValues>;
  step: FlowStep;
}

export function useNewAdDraftSync({
  draftAdId,
  fieldErrors,
  isEditMode,
  methods,
  step,
}: UseNewAdDraftSyncProps) {
  useEffect(() => {
    const confirmedLocation = window.localStorage.getItem(locationKey)?.trim();
    if (confirmedLocation && methods.getValues("location") !== confirmedLocation) {
      methods.setValue("location", confirmedLocation, { shouldDirty: true });
    }
    const confirmedLat = window.localStorage.getItem(locationLatKey)?.trim();
    if (confirmedLat && methods.getValues("lat") !== confirmedLat) {
      methods.setValue("lat", confirmedLat, { shouldDirty: true });
    }
    const confirmedLng = window.localStorage.getItem(locationLngKey)?.trim();
    if (confirmedLng && methods.getValues("lng") !== confirmedLng) {
      methods.setValue("lng", confirmedLng, { shouldDirty: true });
    }
    const confirmedNeighborhoodId = window.localStorage.getItem(neighborhoodIdKey)?.trim();
    if (
      confirmedNeighborhoodId &&
      methods.getValues("neighborhoodId") !== confirmedNeighborhoodId
    ) {
      methods.setValue("neighborhoodId", confirmedNeighborhoodId, { shouldDirty: true });
    }
    const confirmedSubNeighborhoodId =
      window.localStorage.getItem(subNeighborhoodIdKey)?.trim() || "";
    if (methods.getValues("subNeighborhoodId") !== confirmedSubNeighborhoodId) {
      methods.setValue("subNeighborhoodId", confirmedSubNeighborhoodId, { shouldDirty: true });
    }

    const persistDraft = () => {
      const values = methods.getValues();
      const currentConfirmedLoc = window.localStorage.getItem(locationKey)?.trim();
      const currentLat = window.localStorage.getItem(locationLatKey)?.trim();
      const currentLng = window.localStorage.getItem(locationLngKey)?.trim();
      const resolvedLoc = values.location || currentConfirmedLoc || "";
      const currentNeighborhoodId =
        values.neighborhoodId || window.localStorage.getItem(neighborhoodIdKey)?.trim() || "";
      const currentSubNeighborhoodId =
        values.subNeighborhoodId ||
        window.localStorage.getItem(subNeighborhoodIdKey)?.trim() ||
        "";
      const resolvedLat = values.lat || currentLat || "";
      const resolvedLng = values.lng || currentLng || "";

      saveAtomicDraft({
        draftAdId,
        lat: resolvedLat,
        lng: resolvedLng,
        location: resolvedLoc,
        neighborhoodId: currentNeighborhoodId,
        step,
        subNeighborhoodId: currentSubNeighborhoodId,
        values: {
          ...values,
          lat: resolvedLat,
          lng: resolvedLng,
        },
      });

      saveNewAdFlowSession(
        {
          ...values,
          lat: resolvedLat,
          lng: resolvedLng,
          location: resolvedLoc,
          neighborhoodId: currentNeighborhoodId,
          subNeighborhoodId: currentSubNeighborhoodId,
        },
        step,
        draftAdId,
        currentNeighborhoodId,
        currentSubNeighborhoodId,
      );
    };

    persistDraft();
    const subscription = methods.watch(persistDraft);

    return () => subscription.unsubscribe();
  }, [draftAdId, isEditMode, methods, step]);

  useEffect(() => {
    if (Object.keys(fieldErrors).length > 0) {
      const timer = setTimeout(() => {
        const firstError = document.querySelector('[data-field-error="true"]');
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [fieldErrors]);

  useEffect(() => {
    const clearOnExit = () => {
      if (window.location.pathname.startsWith("/new-ad")) return;
      if (shouldPreserveNewAdDraft(window.history.state)) return;
      if (
        window.location.pathname.startsWith("/agencies") ||
        window.location.pathname.startsWith("/agents")
      ) {
        return;
      }

      clearNewAdDraftStorage();
    };

    window.addEventListener("popstate", clearOnExit);

    return () => {
      window.removeEventListener("popstate", clearOnExit);
    };
  }, []);
}
