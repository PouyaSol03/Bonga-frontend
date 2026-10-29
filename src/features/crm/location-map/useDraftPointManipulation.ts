import type { Dispatch, SetStateAction } from "react";
import type { LatLngTuple, Map as LeafletMap } from "leaflet";
import { samePoint } from "./geometry";
import { closestSnapPoint, closestValidPoint } from "./projections";
import { isAllowedSubNeighborhoodDraft } from "./draftValidation";
import type { BoundaryItem, EditTarget } from "./types";

export function useDraftPointManipulation({
  constraintPolygons,
  draftPoints,
  editTarget,
  notify,
  parentPolygon,
  setDraftPoints,
  setLastSnapNotice,
  setSelectedDraftPointIndex,
  siblingPolygons,
  snapBoundaries,
}: {
  constraintPolygons: LatLngTuple[][];
  draftPoints: LatLngTuple[];
  editTarget: EditTarget | null;
  notify: (message: string, tone?: "error" | "success") => void;
  parentPolygon: LatLngTuple[];
  setDraftPoints: Dispatch<SetStateAction<LatLngTuple[]>>;
  setLastSnapNotice: (notice: boolean) => void;
  setSelectedDraftPointIndex: (index: number | null) => void;
  siblingPolygons: LatLngTuple[][];
  snapBoundaries: BoundaryItem[];
}) {
  const checkAllowedDraft = (pts: LatLngTuple[], showError = true) =>
    isAllowedSubNeighborhoodDraft({
      editTarget,
      notify,
      parentPolygon,
      points: pts,
      showError,
      siblingPolygons,
    });

  const addExactDraftPoint = (point: LatLngTuple, adjusted = false) => {
    if (!editTarget || draftPoints.some((current) => samePoint(current, point))) return false;
    const nextPoints = [...draftPoints, point];
    if (!checkAllowedDraft(nextPoints, false)) return false;
    setDraftPoints(nextPoints);
    setSelectedDraftPointIndex(draftPoints.length);
    if (adjusted) setLastSnapNotice(true);
    return true;
  };

  const addDraftPoint = (map: LeafletMap, rawPoint: LatLngTuple) => {
    if (!editTarget) return;
    const snappedPoint = closestSnapPoint(map, rawPoint, snapBoundaries);
    const isValidCandidate = (cand: LatLngTuple) =>
      !draftPoints.some((p) => samePoint(p, cand)) &&
      checkAllowedDraft([...draftPoints, cand], false);

    if (editTarget.kind !== "sub-neighborhood") {
      addExactDraftPoint(snappedPoint, !samePoint(rawPoint, snappedPoint));
      return;
    }
    let resolvedPoint = isValidCandidate(snappedPoint) ? snappedPoint : null;
    if (!resolvedPoint) {
      resolvedPoint = closestValidPoint(
        map,
        rawPoint,
        draftPoints.length ? draftPoints[draftPoints.length - 1] : null,
        constraintPolygons,
        isValidCandidate,
      );
    }
    if (!resolvedPoint) {
      notify("در این قسمت امکان قرار دادن نقطه وجود ندارد.", "error");
      return;
    }
    addExactDraftPoint(resolvedPoint, !samePoint(rawPoint, resolvedPoint));
  };

  const resolveAndMove = (
    idx: number,
    reqPoint: LatLngTuple,
    map: LeafletMap,
    notice: boolean,
  ) => {
    if (!editTarget) return null;
    const isValidCandidate = (cand: LatLngTuple) => {
      if (draftPoints.some((p, i) => i !== idx && samePoint(p, cand))) return false;
      return checkAllowedDraft(
        draftPoints.map((p, i) => (i === idx ? cand : p)),
        false,
      );
    };
    const resolved =
      editTarget.kind === "sub-neighborhood"
        ? closestValidPoint(
            map,
            reqPoint,
            draftPoints[idx] ?? null,
            constraintPolygons,
            isValidCandidate,
          )
        : isValidCandidate(reqPoint)
          ? reqPoint
          : null;
    if (!resolved) return null;
    setDraftPoints((prev) => prev.map((p, i) => (i === idx ? resolved : p)));
    setSelectedDraftPointIndex(idx);
    if (notice && !samePoint(reqPoint, resolved)) setLastSnapNotice(true);
    return resolved;
  };

  const insertDraftPointAfter = (index: number, point: LatLngTuple) => {
    if (!editTarget) return;
    const nextPoints = [
      ...draftPoints.slice(0, index + 1),
      point,
      ...draftPoints.slice(index + 1),
    ];
    if (!checkAllowedDraft(nextPoints)) return;
    setDraftPoints(nextPoints);
    setSelectedDraftPointIndex(index + 1);
  };

  const removeDraftPoint = (index: number) => {
    const nextPoints = draftPoints.filter((_, i) => i !== index);
    if (nextPoints.length > 0 && !checkAllowedDraft(nextPoints)) return;
    setDraftPoints(nextPoints);
    setSelectedDraftPointIndex(null);
  };

  return {
    addDraftPoint,
    addExactDraftPoint,
    insertDraftPointAfter,
    moveDraftPoint: (i: number, p: LatLngTuple, m: LeafletMap) => resolveAndMove(i, p, m, true),
    previewDraftPointMove: (i: number, p: LatLngTuple, m: LeafletMap) =>
      resolveAndMove(i, p, m, false),
    removeDraftPoint,
  };
}
