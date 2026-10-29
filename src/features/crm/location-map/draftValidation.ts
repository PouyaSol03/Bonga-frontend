import type { LatLngTuple } from "leaflet";
import type { CrmRecord } from "../api/crm.service";
import { getCrmRecordId } from "../api/crm.service";
import {
  boundaryEntersAnyPolygon,
  getNeighborhoodPoints,
  getSubNeighborhoodPoints,
  isBoundaryInsidePolygon,
} from "./geometry";
import { parseSubNeighborhoods } from "./urlAndRecordHelpers";
import type { EditTarget } from "./types";

export function getSubNeighborhoodConstraintPolygons(
  editTarget: EditTarget | null,
  neighborhoods: CrmRecord[],
) {
  const activeSubParentNeighborhood =
    editTarget?.kind === "sub-neighborhood"
      ? neighborhoods.find((item) => getCrmRecordId(item) === editTarget.neighborhoodId)
      : undefined;

  const parentPolygon = activeSubParentNeighborhood
    ? getNeighborhoodPoints(activeSubParentNeighborhood)
    : [];

  const siblingPolygons =
    editTarget?.kind === "sub-neighborhood" && activeSubParentNeighborhood
      ? parseSubNeighborhoods(activeSubParentNeighborhood.sub_neighbors)
          .filter((subNeighborhood) => subNeighborhood.id !== editTarget.subId)
          .map(getSubNeighborhoodPoints)
          .filter((points) => points.length >= 3)
      : [];

  const constraintPolygons = [parentPolygon, ...siblingPolygons].filter(
    (points) => points.length >= 3,
  );

  return {
    constraintPolygons,
    parentPolygon,
    siblingPolygons,
  };
}

export function isAllowedSubNeighborhoodDraft({
  editTarget,
  notify,
  parentPolygon,
  points,
  showError = true,
  siblingPolygons,
}: {
  editTarget: EditTarget | null;
  notify?: (message: string, tone?: "error" | "success") => void;
  parentPolygon: LatLngTuple[];
  points: LatLngTuple[];
  showError?: boolean;
  siblingPolygons: LatLngTuple[][];
}) {
  if (editTarget?.kind !== "sub-neighborhood") return true;

  if (parentPolygon.length < 3 || !isBoundaryInsidePolygon(points, parentPolygon)) {
    if (showError) notify?.("محدوده زیرمحله باید کاملاً داخل محدوده محله اصلی باشد.", "error");
    return false;
  }

  if (boundaryEntersAnyPolygon(points, siblingPolygons)) {
    if (showError) {
      notify?.(
        "محدوده زیرمحله نمی‌تواند داخل یا روی محدوده زیرمحله دیگری هم‌پوشانی داشته باشد.",
        "error",
      );
    }
    return false;
  }

  return true;
}
