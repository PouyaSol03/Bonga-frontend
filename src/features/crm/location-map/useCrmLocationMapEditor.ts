import { useEffect, useMemo, useRef, useState } from "react";
import type { LatLngTuple } from "leaflet";
import type { CrmRecord } from "../api/crm.service";
import { targetBoundaryId } from "./urlAndRecordHelpers";
import { getSubNeighborhoodConstraintPolygons } from "./draftValidation";
import { saveBoundaryAction } from "./saveBoundaryAction";
import { useCrmLocationMapMutations } from "./useCrmLocationMapMutations";
import { useBoundaryEditorTarget } from "./useBoundaryEditorTarget";
import { useDraftPointManipulation } from "./useDraftPointManipulation";
import type { BoundaryItem } from "./types";

export function useCrmLocationMapEditor({
  boundaries,
  cityCenter,
  cityId,
  initialNeighborhoodId,
  neighborhoods,
  notify,
}: {
  boundaries: BoundaryItem[];
  cityCenter: LatLngTuple;
  cityId: string;
  initialNeighborhoodId: string;
  neighborhoods: CrmRecord[];
  notify: (message: string, tone?: "error" | "success") => void;
}) {
  const didApplyDefaultSelectionRef = useRef(false);
  const [expandedNeighborhoodId, setExpandedNeighborhoodId] = useState(initialNeighborhoodId);
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState(initialNeighborhoodId);
  const [selectedSubId, setSelectedSubId] = useState("");

  const mutations = useCrmLocationMapMutations({ cityId, notify });

  const targetState = useBoundaryEditorTarget({
    neighborhoods,
    notify,
    setExpandedNeighborhoodId,
    setSelectedNeighborhoodId,
    setSelectedSubId,
  });

  const activeBoundaryId = targetBoundaryId(targetState.editTarget);
  const snapBoundaries = useMemo(() => {
    const candidates = boundaries.filter((boundary) => boundary.id !== activeBoundaryId);
    const currentTarget = targetState.editTarget;
    if (!currentTarget) return candidates;
    if (currentTarget.kind === "sub-neighborhood") {
      return candidates.filter(
        (b) =>
          b.neighborhoodId === currentTarget.neighborhoodId &&
          (b.kind === "neighborhood" || b.kind === "sub-neighborhood"),
      );
    }
    return candidates.filter((b) => b.kind === "neighborhood");
  }, [activeBoundaryId, boundaries, targetState.editTarget]);

  const { constraintPolygons, parentPolygon, siblingPolygons } = useMemo(
    () => getSubNeighborhoodConstraintPolygons(targetState.editTarget, neighborhoods),
    [targetState.editTarget, neighborhoods],
  );

  const pointManipulation = useDraftPointManipulation({
    constraintPolygons,
    draftPoints: targetState.draftPoints,
    editTarget: targetState.editTarget,
    notify,
    parentPolygon,
    setDraftPoints: targetState.setDraftPoints,
    setLastSnapNotice: targetState.setLastSnapNotice,
    setSelectedDraftPointIndex: targetState.setSelectedDraftPointIndex,
    siblingPolygons,
    snapBoundaries,
  });

  useEffect(() => {
    if (didApplyDefaultSelectionRef.current || !boundaries.length) return;
    const preferredBoundary = initialNeighborhoodId
      ? (boundaries.find(
          (b) => b.neighborhoodId === initialNeighborhoodId && b.kind === "neighborhood",
        ) ?? boundaries.find((b) => b.neighborhoodId === initialNeighborhoodId))
      : undefined;
    const defaultBoundary = preferredBoundary ?? boundaries[0];
    if (!defaultBoundary) return;
    setSelectedNeighborhoodId(defaultBoundary.neighborhoodId);
    setSelectedSubId(defaultBoundary.subId ?? "");
    setExpandedNeighborhoodId(defaultBoundary.neighborhoodId);
    didApplyDefaultSelectionRef.current = true;
  }, [boundaries, initialNeighborhoodId]);

  useEffect(() => {
    if (!targetState.lastSnapNotice) return;
    const timer = window.setTimeout(() => targetState.setLastSnapNotice(false), 1600);
    return () => window.clearTimeout(timer);
  }, [targetState.lastSnapNotice, targetState.setLastSnapNotice]);

  const saveActiveBoundary = async () => {
    if (!targetState.editTarget) return;
    await saveBoundaryAction({
      cityCenter,
      cityId,
      draftName: targetState.draftName,
      draftPoints: targetState.draftPoints,
      editTarget: targetState.editTarget,
      mutateNeighborhood: mutations.saveMutation.mutateAsync,
      mutateSubNeighborhood: mutations.subNeighborhoodSaveMutation.mutateAsync,
      neighborhoods,
      notify,
      onReset: targetState.resetEditor,
      onSuccessSubNeighborhood: () => {
        if (targetState.editTarget?.kind === "sub-neighborhood" && targetState.editTarget.isNew) {
          setSelectedNeighborhoodId(targetState.editTarget.neighborhoodId);
          setSelectedSubId("");
          setExpandedNeighborhoodId(targetState.editTarget.neighborhoodId);
        }
      },
      parentPolygonForActiveSub: parentPolygon,
      siblingPolygonsForActiveSub: siblingPolygons,
    });
  };

  const deleteSubNeighborhood = async (subId: string) => {
    await mutations.subNeighborhoodDeleteMutation.mutateAsync(subId);
    if (selectedSubId === subId) setSelectedSubId("");
    if (targetState.editTarget?.kind === "sub-neighborhood" && targetState.editTarget.subId === subId) {
      targetState.resetEditor();
    }
  };

  return {
    activeBoundaryId,
    deleteSubNeighborhood,
    expandedNeighborhoodId,
    mutations,
    saveActiveBoundary,
    selectedNeighborhoodId,
    selectedSubId,
    setExpandedNeighborhoodId,
    setSelectedNeighborhoodId,
    setSelectedSubId,
    snapBoundaries,
    ...targetState,
    ...pointManipulation,
  };
}
