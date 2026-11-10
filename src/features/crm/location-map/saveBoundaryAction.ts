import type { LatLngTuple } from "leaflet";
import type { CrmRecord, CrmSubNeighborhoodPayload } from "../api/crm.service";
import { getCrmRecordId } from "../api/crm.service";
import { readText } from "../CrmLayout";
import {
  boundaryEntersAnyPolygon,
  isBoundaryInsidePolygon,
  pointsToGeoJson,
  polygonCenter,
} from "./geometry";
import { parseMaybeJson, parseSubNeighborhoods } from "./urlAndRecordHelpers";
import type { EditTarget } from "./types";

export async function saveBoundaryAction({
  cityCenter,
  cityId,
  draftName,
  draftPoints,
  editTarget,
  mutateNeighborhood,
  mutateSubNeighborhood,
  neighborhoods,
  notify,
  parentPolygonForActiveSub,
  onReset,
  onSuccessSubNeighborhood,
  siblingPolygonsForActiveSub,
}: {
  cityCenter: LatLngTuple;
  cityId: string;
  draftName: string;
  draftPoints: LatLngTuple[];
  editTarget: EditTarget;
  mutateNeighborhood: (params: { id: string | null; payload: CrmRecord }) => Promise<unknown>;
  mutateSubNeighborhood: (params: { id: string | null; payload: CrmSubNeighborhoodPayload }) => Promise<unknown>;
  neighborhoods: CrmRecord[];
  notify: (message: string, tone?: "error" | "success") => void;
  parentPolygonForActiveSub: LatLngTuple[];
  onReset: () => void;
  onSuccessSubNeighborhood?: () => void;
  siblingPolygonsForActiveSub: LatLngTuple[][];
}) {
  const name = draftName.trim();
  if (!name) {
    notify(
      editTarget.kind === "sub-neighborhood"
        ? "نام زیرمحله را وارد کنید."
        : "نام محله را وارد کنید.",
      "error",
    );
    return;
  }

  const requiresPolygon =
    editTarget.kind === "new-neighborhood" || editTarget.kind === "sub-neighborhood";
  if (requiresPolygon && draftPoints.length < 3) {
    notify("برای ذخیره محدوده حداقل سه نقطه انتخاب کنید.", "error");
    return;
  }
  if (draftPoints.length > 0 && draftPoints.length < 3) {
    notify(
      "برای تغییر مرزبندی حداقل سه نقطه انتخاب کنید، یا نقاط را کامل پاک کنید تا فقط نام ذخیره شود.",
      "error",
    );
    return;
  }

  const polygon = draftPoints.length >= 3 ? pointsToGeoJson(draftPoints) : null;
  const center = polygon ? polygonCenter(draftPoints, cityCenter) : cityCenter;

  if (editTarget.kind === "new-neighborhood") {
    if (!polygon) return;
    await mutateNeighborhood({
      id: null,
      payload: {
        city_id: cityId,
        lat: center[0],
        lng: center[1],
        name,
        polygon,
        sub_neighbors: [],
      },
    });
    onReset();
    return;
  }

  const neighborhood = neighborhoods.find(
    (item) => getCrmRecordId(item) === editTarget.neighborhoodId,
  );
  if (!neighborhood) {
    notify("محله انتخاب‌شده پیدا نشد. صفحه را تازه‌سازی کنید.", "error");
    return;
  }

  if (editTarget.kind === "neighborhood") {
    const duplicateNeighborhood = neighborhoods.find(
      (item) =>
        getCrmRecordId(item) !== editTarget.neighborhoodId &&
        readText(item, ["name"], "").trim() === name,
    );
    if (duplicateNeighborhood) {
      notify("محله‌ای با این نام در همین شهر وجود دارد.", "error");
      return;
    }

    await mutateNeighborhood({
      id: editTarget.neighborhoodId,
      payload: {
        city_id: neighborhood.city_id ?? cityId,
        lat: polygon ? center[0] : (neighborhood.lat ?? cityCenter[0]),
        lng: polygon ? center[1] : (neighborhood.lng ?? cityCenter[1]),
        name,
        polygon:
          polygon ?? parseMaybeJson(neighborhood.polygon ?? neighborhood.geofence) ?? undefined,
        sub_neighbors: parseSubNeighborhoods(neighborhood.sub_neighbors),
      },
    });
    onReset();
    return;
  }

  const duplicateSubNeighborhood = neighborhoods.find((item) => {
    const ownerId = getCrmRecordId(item);
    return parseSubNeighborhoods(item.sub_neighbors).some(
      (sub) =>
        sub.name.trim() === name &&
        !(ownerId === editTarget.neighborhoodId && sub.id === editTarget.subId),
    );
  });
  if (duplicateSubNeighborhood) {
    notify(
      `زیرمحله «${name}» قبلاً زیر محله «${readText(duplicateSubNeighborhood, ["name"], "")}» ثبت شده است.`,
      "error",
    );
    return;
  }

  if (polygon && !isBoundaryInsidePolygon(draftPoints, parentPolygonForActiveSub)) {
    notify("محدوده زیرمحله نمی‌تواند از محدوده محله اصلی خارج شود.", "error");
    return;
  }

  if (polygon && boundaryEntersAnyPolygon(draftPoints, siblingPolygonsForActiveSub)) {
    notify("محدوده زیرمحله نمی‌تواند با زیرمحله دیگری هم‌پوشانی داشته باشد.", "error");
    return;
  }

  const duplicateIdOwner = neighborhoods.find((item) => {
    if (getCrmRecordId(item) === editTarget.neighborhoodId) return false;
    return parseSubNeighborhoods(item.sub_neighbors).some((sub) => sub.id === editTarget.subId);
  });
  if (duplicateIdOwner) {
    notify(
      "این زیرمحله قبلاً به محله دیگری متصل شده و نمی‌تواند در دو محله قرار بگیرد.",
      "error",
    );
    return;
  }

  if (!polygon) return;

  const neighborhoodId = Number(editTarget.neighborhoodId);
  if (!Number.isInteger(neighborhoodId) || neighborhoodId <= 0) {
    notify("شناسه محله اصلی معتبر نیست.", "error");
    return;
  }

  await mutateSubNeighborhood({
    id: editTarget.isNew ? null : editTarget.subId,
    payload: {
      geofence: polygon,
      name,
      neighborhood_id: neighborhoodId,
    },
  });

  onSuccessSubNeighborhood?.();
  onReset();
}
