import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LatLngTuple, Map as LeafletMap } from "leaflet";
import { CircleMarker, MapContainer, Polygon, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { pushRoute } from "../../../app/router/navigation";
import { getApiErrorMessage } from "../../../core/api/api";
import {
  getCrmRecordId,
  listCrmCities,
  listCrmNeighborhoods,
  saveCrmNeighborhood,
  type CrmRecord,
} from "../../../core/services/crm.service";
import { getNeighborhoodPolygonPoints } from "../../../core/services/neighborhood.service";
import { searchMapTileConfig } from "../../search/searchMapData";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { CrmIcon, DEFAULT_CENTER, readText, type CrmRoutePageProps } from "../CrmLayout";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";

type SubNeighborhoodRecord = CrmRecord & {
  geofence?: unknown;
  id: string;
  name: string;
};

type BoundaryKind = "neighborhood" | "sub-neighborhood";

type BoundaryItem = {
  id: string;
  kind: BoundaryKind;
  name: string;
  neighborhoodId: string;
  parentName?: string;
  points: LatLngTuple[];
  subId?: string;
};

type EditTarget =
  | {
    kind: "neighborhood";
    neighborhoodId: string;
  }
  | {
    kind: "new-neighborhood";
  }
  | {
    isNew: boolean;
    kind: "sub-neighborhood";
    neighborhoodId: string;
    subId: string;
  };

const MAIN_BOUNDARY_COLOR = "#0048c4";
const SUB_BOUNDARY_COLOR = "#11a366";
const MUTED_BOUNDARY_COLOR = "#7b8494";
const SNAP_DISTANCE_PX = 16;

function getCityIdFromUrl() {
  return new URLSearchParams(window.location.search).get("cityId")?.trim() ?? "";
}

function getSelectedNeighborhoodIdFromUrl() {
  return new URLSearchParams(window.location.search).get("neighborhoodId")?.trim() ?? "";
}

function getCitySnapshotFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const lat = Number(params.get("lat"));
  const lng = Number(params.get("lng"));

  return {
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
    name: params.get("cityName")?.trim() ?? "",
  };
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : String(value ?? "").trim();
}

function parseMaybeJson(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return value;
  }
}

function parseSubNeighborhoods(value: unknown): SubNeighborhoodRecord[] {
  const parsed = parseMaybeJson(value);
  const items = Array.isArray(parsed)
    ? parsed
    : typeof parsed === "string"
      ? parsed.split(/[،,|]/).map((item) => item.trim()).filter(Boolean)
      : [];

  return items.flatMap((item, index) => {
    if (typeof item === "string") {
      return [{ geofence: null, id: `legacy-${index + 1}`, name: item }];
    }

    if (!item || typeof item !== "object" || Array.isArray(item)) return [];

    const record = item as CrmRecord;
    const name = normalizeText(record.name ?? record.title ?? record.label);
    if (!name) return [];

    return [{
      ...record,
      geofence: record.geofence ?? record.polygon ?? null,
      id: normalizeText(record.id ?? record._id ?? `legacy-${index + 1}`),
      name,
    }];
  });
}

function createLocalSubNeighborhoodId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function pointsToGeoJson(points: LatLngTuple[]) {
  if (points.length < 3) return null;

  const coordinates = points.map(([lat, lng]) => [lng, lat]);
  coordinates.push([...coordinates[0]]);

  return { type: "Polygon", coordinates: [coordinates] };
}

function polygonCenter(points: LatLngTuple[], fallback: LatLngTuple): LatLngTuple {
  if (!points.length) return fallback;

  const totals = points.reduce<LatLngTuple>(
    (current, point) => [current[0] + point[0], current[1] + point[1]],
    [0, 0],
  );

  return [
    Number((totals[0] / points.length).toFixed(7)),
    Number((totals[1] / points.length).toFixed(7)),
  ];
}

function samePoint(first: LatLngTuple, second: LatLngTuple, epsilon = 0.0000001) {
  return Math.abs(first[0] - second[0]) <= epsilon && Math.abs(first[1] - second[1]) <= epsilon;
}

function isPointOnSegment(point: LatLngTuple, start: LatLngTuple, end: LatLngTuple) {
  const [py, px] = point;
  const [ay, ax] = start;
  const [by, bx] = end;
  const cross = (px - ax) * (by - ay) - (py - ay) * (bx - ax);
  if (Math.abs(cross) > 0.00000002) return false;

  const dot = (px - ax) * (bx - ax) + (py - ay) * (by - ay);
  if (dot < 0) return false;

  const squaredLength = (bx - ax) ** 2 + (by - ay) ** 2;
  return dot <= squaredLength;
}

function isPointInsideOrOnPolygon(point: LatLngTuple, polygon: LatLngTuple[]) {
  if (polygon.length < 3) return false;

  for (let index = 0; index < polygon.length; index += 1) {
    const nextIndex = (index + 1) % polygon.length;
    if (isPointOnSegment(point, polygon[index], polygon[nextIndex])) return true;
  }

  const [lat, lng] = point;
  let inside = false;

  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const [currentLat, currentLng] = polygon[index];
    const [previousLat, previousLng] = polygon[previous];
    const intersects =
      currentLat > lat !== previousLat > lat &&
      lng < ((previousLng - currentLng) * (lat - currentLat)) / (previousLat - currentLat || Number.EPSILON) + currentLng;

    if (intersects) inside = !inside;
  }

  return inside;
}

function isBoundaryInsidePolygon(points: LatLngTuple[], parentPolygon: LatLngTuple[]) {
  if (points.length < 3 || parentPolygon.length < 3) return false;

  return points.every((point, index) => {
    if (!isPointInsideOrOnPolygon(point, parentPolygon)) return false;
    const next = points[(index + 1) % points.length];
    const midpoint: LatLngTuple = [
      (point[0] + next[0]) / 2,
      (point[1] + next[1]) / 2,
    ];
    return isPointInsideOrOnPolygon(midpoint, parentPolygon);
  });
}

function getNeighborhoodPoints(neighborhood: CrmRecord) {
  return getNeighborhoodPolygonPoints(neighborhood.polygon ?? neighborhood.geofence) as LatLngTuple[];
}

function getSubNeighborhoodPoints(subNeighborhood: SubNeighborhoodRecord) {
  return getNeighborhoodPolygonPoints(subNeighborhood.geofence ?? subNeighborhood.polygon) as LatLngTuple[];
}

function buildBoundaryItems(neighborhoods: CrmRecord[]): BoundaryItem[] {
  return neighborhoods.flatMap((neighborhood) => {
    const neighborhoodId = getCrmRecordId(neighborhood);
    const neighborhoodName = readText(neighborhood, ["name"], "محله");
    const mainPoints = getNeighborhoodPoints(neighborhood);
    const mainBoundary: BoundaryItem[] = mainPoints.length >= 3
      ? [{
        id: `n:${neighborhoodId}`,
        kind: "neighborhood",
        name: neighborhoodName,
        neighborhoodId,
        points: mainPoints,
      }]
      : [];

    const subBoundaries = parseSubNeighborhoods(neighborhood.sub_neighbors).flatMap((subNeighborhood) => {
      const points = getSubNeighborhoodPoints(subNeighborhood);
      if (points.length < 3) return [];

      return [{
        id: `s:${neighborhoodId}:${subNeighborhood.id}`,
        kind: "sub-neighborhood" as const,
        name: subNeighborhood.name,
        neighborhoodId,
        parentName: neighborhoodName,
        points,
        subId: subNeighborhood.id,
      }];
    });

    return [...mainBoundary, ...subBoundaries];
  });
}

function targetBoundaryId(target: EditTarget | null) {
  if (!target) return "";
  if (target.kind === "neighborhood") return `n:${target.neighborhoodId}`;
  if (target.kind === "sub-neighborhood" && !target.isNew) {
    return `s:${target.neighborhoodId}:${target.subId}`;
  }
  return "";
}

function MapViewport({ center, points }: { center: LatLngTuple; points: LatLngTuple[] }) {
  const map = useMap();
  const fitSignature = points.map((point) => `${point[0].toFixed(5)}:${point[1].toFixed(5)}`).join("|");
  const centerLat = center[0];
  const centerLng = center[1];

  useEffect(() => {
    if (points.length >= 2) {
      map.fitBounds(points, { padding: [42, 42], maxZoom: 15 });
      return;
    }

    map.setView(points[0] ?? [centerLat, centerLng], points.length ? 15 : 13);
  }, [centerLat, centerLng, fitSignature, map]);

  return null;
}

function MapResizeOnFullscreen({ fullscreen }: { fullscreen: boolean }) {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(timer);
  }, [fullscreen, map]);

  return null;
}

function closestSnapPoint(
  map: LeafletMap,
  point: LatLngTuple,
  boundaries: BoundaryItem[],
) {
  const clickPoint = map.latLngToLayerPoint(point);
  let best: { distance: number; point: LatLngTuple } | null = null;

  const consider = (candidate: LatLngTuple) => {
    const candidatePoint = map.latLngToLayerPoint(candidate);
    const distance = clickPoint.distanceTo(candidatePoint);
    if (distance > SNAP_DISTANCE_PX) return;
    if (!best || distance < best.distance) best = { distance, point: candidate };
  };

  boundaries.forEach((boundary) => {
    boundary.points.forEach(consider);

    boundary.points.forEach((start, index) => {
      const end = boundary.points[(index + 1) % boundary.points.length];
      const startPoint = map.latLngToLayerPoint(start);
      const endPoint = map.latLngToLayerPoint(end);
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const lengthSquared = dx * dx + dy * dy;
      if (!lengthSquared) return;

      const t = Math.max(
        0,
        Math.min(
          1,
          ((clickPoint.x - startPoint.x) * dx + (clickPoint.y - startPoint.y) * dy) / lengthSquared,
        ),
      );
      const projected = map.layerPointToLatLng([
        startPoint.x + t * dx,
        startPoint.y + t * dy,
      ]);
      consider([projected.lat, projected.lng]);
    });
  });

  return best?.point ?? point;
}

function BoundaryDrawCollector({
  boundaries,
  enabled,
  onAdd,
}: {
  boundaries: BoundaryItem[];
  enabled: boolean;
  onAdd: (point: LatLngTuple, snapped: boolean) => void;
}) {
  const map = useMapEvents({
    click(event) {
      if (!enabled) return;

      const rawPoint: LatLngTuple = [event.latlng.lat, event.latlng.lng];
      const snappedPoint = closestSnapPoint(map, rawPoint, boundaries);
      onAdd(snappedPoint, !samePoint(rawPoint, snappedPoint));
    },
  });

  return null;
}



export function CrmLocationMapPage({ notify, refreshNonce }: CrmRoutePageProps) {
  const queryClient = useQueryClient();
  const cityId = getCityIdFromUrl();
  const citySnapshot = getCitySnapshotFromUrl();
  const initialNeighborhoodId = getSelectedNeighborhoodIdFromUrl();
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const [expandedNeighborhoodId, setExpandedNeighborhoodId] = useState(initialNeighborhoodId);
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState(initialNeighborhoodId);
  const [selectedSubId, setSelectedSubId] = useState("");
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [draftPoints, setDraftPoints] = useState<LatLngTuple[]>([]);
  const [draftName, setDraftName] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [showNewSubInputFor, setShowNewSubInputFor] = useState("");
  const [showNewNeighborhoodInput, setShowNewNeighborhoodInput] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [lastSnapNotice, setLastSnapNotice] = useState(false);

  const citiesQuery = useQuery({
    queryFn: () => listCrmCities(),
    queryKey: ["crm", "cities", "map", refreshNonce],
  });
  const neighborhoodsQuery = useQuery({
    enabled: Boolean(cityId),
    queryFn: () => listCrmNeighborhoods({ cityId, perPage: 500 }),
    queryKey: ["crm", "neighborhoods", cityId, refreshNonce],
  });

  const neighborhoods = neighborhoodsQuery.data ?? [];
  const city = citiesQuery.data?.find((item) => getCrmRecordId(item) === cityId);
  const cityName = city ? readText(city, ["name"], citySnapshot.name || `شهر ${cityId}`) : citySnapshot.name || `شهر ${cityId}`;
  const cityLat = Number(city?.lat);
  const cityLng = Number(city?.lng);
  const cityCenter: LatLngTuple = [
    city && Number.isFinite(cityLat) ? cityLat : (citySnapshot.lat ?? DEFAULT_CENTER[0]),
    city && Number.isFinite(cityLng) ? cityLng : (citySnapshot.lng ?? DEFAULT_CENTER[1]),
  ];
  const boundaries = useMemo(() => buildBoundaryItems(neighborhoods), [neighborhoods]);
  const allBoundaryPoints = useMemo(() => boundaries.flatMap((item) => item.points), [boundaries]);
  const activeBoundaryId = targetBoundaryId(editTarget);
  const snapBoundaries = useMemo(() => {
    const candidates = boundaries.filter((boundary) => boundary.id !== activeBoundaryId);
    if (!editTarget) return candidates;

    if (editTarget.kind === "sub-neighborhood") {
      return candidates.filter((boundary) =>
        boundary.neighborhoodId === editTarget.neighborhoodId &&
        (boundary.kind === "neighborhood" || boundary.kind === "sub-neighborhood"),
      );
    }

    return candidates.filter((boundary) => boundary.kind === "neighborhood");
  }, [activeBoundaryId, boundaries, editTarget]);
  const parentPolygonForActiveSub = editTarget?.kind === "sub-neighborhood"
    ? getNeighborhoodPoints(neighborhoods.find((item) => getCrmRecordId(item) === editTarget.neighborhoodId) ?? {})
    : [];

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!lastSnapNotice) return;
    const timer = window.setTimeout(() => setLastSnapNotice(false), 1600);
    return () => window.clearTimeout(timer);
  }, [lastSnapNotice]);

  const invalidateNeighborhoods = async () => {
    await queryClient.invalidateQueries({ queryKey: ["crm", "neighborhoods", cityId] });
    await queryClient.invalidateQueries({ queryKey: ["crm", "neighborhoods"] });
  };

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmRecord }) => saveCrmNeighborhood(id, payload),
    onError: (error) => notify(getApiErrorMessage(error, "ذخیره محدوده جغرافیایی با خطا مواجه شد."), "error"),
    onSuccess: async () => {
      await invalidateNeighborhoods();
      notify("محدوده جغرافیایی با موفقیت ذخیره شد.");
    },
  });

  const isPending = saveMutation.isPending;

  const resetEditor = () => {
    setEditTarget(null);
    setDraftPoints([]);
    setDraftName("");
    setLastSnapNotice(false);
  };

  const startNeighborhoodBoundary = (neighborhood: CrmRecord) => {
    const neighborhoodId = getCrmRecordId(neighborhood);
    setSelectedNeighborhoodId(neighborhoodId);
    setSelectedSubId("");
    setExpandedNeighborhoodId(neighborhoodId);
    setEditTarget({ kind: "neighborhood", neighborhoodId });
    setDraftName(readText(neighborhood, ["name"], ""));
    setDraftPoints(getNeighborhoodPoints(neighborhood));
  };

  const startNewNeighborhood = () => {
    const name = draftName.trim();
    if (!name) {
      notify("ابتدا نام محله جدید را وارد کنید.", "error");
      return;
    }

    if (neighborhoods.some((item) => readText(item, ["name"], "").trim() === name)) {
      notify("محله‌ای با این نام در همین شهر وجود دارد.", "error");
      return;
    }

    setSelectedNeighborhoodId("");
    setSelectedSubId("");
    setEditTarget({ kind: "new-neighborhood" });
    setDraftPoints([]);
    setShowNewNeighborhoodInput(false);
  };

  const startSubNeighborhoodBoundary = (
    neighborhood: CrmRecord,
    subNeighborhood: SubNeighborhoodRecord,
  ) => {
    const neighborhoodId = getCrmRecordId(neighborhood);
    const parentPoints = getNeighborhoodPoints(neighborhood);
    if (parentPoints.length < 3) {
      notify("ابتدا محدوده محله اصلی را ترسیم و ذخیره کنید.", "error");
      return;
    }

    setSelectedNeighborhoodId(neighborhoodId);
    setSelectedSubId(subNeighborhood.id);
    setExpandedNeighborhoodId(neighborhoodId);
    setEditTarget({
      isNew: false,
      kind: "sub-neighborhood",
      neighborhoodId,
      subId: subNeighborhood.id,
    });
    setDraftName(subNeighborhood.name);
    setDraftPoints(getSubNeighborhoodPoints(subNeighborhood));
  };

  const startNewSubNeighborhood = (neighborhood: CrmRecord) => {
    const name = newSubName.trim();
    if (!name) {
      notify("نام زیرمحله را وارد کنید.", "error");
      return;
    }

    const neighborhoodId = getCrmRecordId(neighborhood);
    const parentPoints = getNeighborhoodPoints(neighborhood);
    if (parentPoints.length < 3) {
      notify("ابتدا محدوده محله اصلی را ترسیم و ذخیره کنید.", "error");
      return;
    }

    const duplicateOwner = neighborhoods.find((item) =>
      parseSubNeighborhoods(item.sub_neighbors).some((sub) => sub.name.trim() === name),
    );
    if (duplicateOwner) {
      notify(`زیرمحله «${name}» قبلاً زیر محله «${readText(duplicateOwner, ["name"], "")}» ثبت شده است.`, "error");
      return;
    }

    const subId = createLocalSubNeighborhoodId();
    setSelectedNeighborhoodId(neighborhoodId);
    setSelectedSubId(subId);
    setEditTarget({ isNew: true, kind: "sub-neighborhood", neighborhoodId, subId });
    setDraftName(name);
    setDraftPoints([]);
    setNewSubName("");
    setShowNewSubInputFor("");
  };

  const addDraftPoint = (point: LatLngTuple, snapped: boolean) => {
    if (!editTarget) return;

    if (editTarget.kind === "sub-neighborhood") {
      if (parentPolygonForActiveSub.length < 3 || !isPointInsideOrOnPolygon(point, parentPolygonForActiveSub)) {
        notify("تمام نقاط زیرمحله باید داخل محدوده محله اصلی باشند.", "error");
        return;
      }
    }

    if (draftPoints.some((current) => samePoint(current, point))) return;
    setDraftPoints((current) => [...current, point]);
    if (snapped) setLastSnapNotice(true);
  };

  const saveActiveBoundary = async () => {
    if (!editTarget) return;
    const name = draftName.trim();
    if (!name) {
      notify(editTarget.kind === "sub-neighborhood" ? "نام زیرمحله را وارد کنید." : "نام محله را وارد کنید.", "error");
      return;
    }
    if (draftPoints.length < 3) {
      notify("برای ذخیره محدوده حداقل سه نقطه انتخاب کنید.", "error");
      return;
    }

    const polygon = pointsToGeoJson(draftPoints);
    if (!polygon) return;
    const center = polygonCenter(draftPoints, cityCenter);

    if (editTarget.kind === "new-neighborhood") {
      await saveMutation.mutateAsync({
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
      resetEditor();
      return;
    }

    const neighborhood = neighborhoods.find((item) => getCrmRecordId(item) === editTarget.neighborhoodId);
    if (!neighborhood) {
      notify("محله انتخاب‌شده پیدا نشد. صفحه را تازه‌سازی کنید.", "error");
      return;
    }

    if (editTarget.kind === "neighborhood") {
      await saveMutation.mutateAsync({
        id: editTarget.neighborhoodId,
        payload: {
          city_id: neighborhood.city_id ?? cityId,
          lat: center[0],
          lng: center[1],
          name,
          polygon,
          sub_neighbors: parseSubNeighborhoods(neighborhood.sub_neighbors),
        },
      });
      resetEditor();
      return;
    }

    if (!isBoundaryInsidePolygon(draftPoints, parentPolygonForActiveSub)) {
      notify("محدوده زیرمحله نمی‌تواند از محدوده محله اصلی خارج شود.", "error");
      return;
    }

    const subNeighborhoods = parseSubNeighborhoods(neighborhood.sub_neighbors);
    const duplicateIdOwner = neighborhoods.find((item) => {
      if (getCrmRecordId(item) === editTarget.neighborhoodId) return false;
      return parseSubNeighborhoods(item.sub_neighbors).some((sub) => sub.id === editTarget.subId);
    });
    if (duplicateIdOwner) {
      notify("این زیرمحله قبلاً به محله دیگری متصل شده و نمی‌تواند در دو محله قرار بگیرد.", "error");
      return;
    }

    const nextSubNeighborhoods = editTarget.isNew
      ? [...subNeighborhoods, { geofence: polygon, id: editTarget.subId, name }]
      : subNeighborhoods.map((item) =>
        item.id === editTarget.subId
          ? { ...item, geofence: polygon, name }
          : item,
      );

    await saveMutation.mutateAsync({
      id: editTarget.neighborhoodId,
      payload: {
        city_id: neighborhood.city_id ?? cityId,
        lat: neighborhood.lat ?? cityCenter[0],
        lng: neighborhood.lng ?? cityCenter[1],
        name: readText(neighborhood, ["name"], ""),
        polygon: parseMaybeJson(neighborhood.polygon ?? neighborhood.geofence) ?? undefined,
        sub_neighbors: nextSubNeighborhoods,
      },
    });
    resetEditor();
  };

  const deleteSubNeighborhood = async (neighborhood: CrmRecord, subId: string) => {
    const neighborhoodId = getCrmRecordId(neighborhood);
    const nextSubNeighborhoods = parseSubNeighborhoods(neighborhood.sub_neighbors).filter((item) => item.id !== subId);

    await saveMutation.mutateAsync({
      id: neighborhoodId,
      payload: {
        city_id: neighborhood.city_id ?? cityId,
        lat: neighborhood.lat ?? cityCenter[0],
        lng: neighborhood.lng ?? cityCenter[1],
        name: readText(neighborhood, ["name"], ""),
        polygon: parseMaybeJson(neighborhood.polygon ?? neighborhood.geofence) ?? undefined,
        sub_neighbors: nextSubNeighborhoods,
      },
    });

    if (selectedSubId === subId) setSelectedSubId("");
    if (editTarget?.kind === "sub-neighborhood" && editTarget.subId === subId) resetEditor();
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await workspaceRef.current?.requestFullscreen();
      }
    } catch {
      notify("مرورگر اجازه نمایش تمام‌صفحه را نداد.", "error");
    }
  };

  if (!cityId) {
    return (
      <div className="grid h-full min-h-[520px] place-items-center rounded-xl bg-white p-8 text-center">
        <div>
          <Typography as="h1" variant="title" size="medium" weight="semibold" className="m-0 text-[#1a1a1a]">شهری انتخاب نشده است</Typography>
          <Typography as="p" variant="body" size="medium" weight="regular" className="mt-2 text-[#808080]">از صفحه مدیریت موقعیت‌ها یک شهر را انتخاب و سپس نقشه را باز کنید.</Typography>
          <Button className="mt-5" onClick={() => pushRoute("/crm/locations")} size="x-medium" variant="primary">بازگشت به موقعیت‌ها</Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={workspaceRef} className="relative h-full min-h-[620px] overflow-hidden rounded-xl bg-white" dir="rtl">
      <div className="grid h-full min-h-0 grid-cols-[360px_minmax(0,1fr)] overflow-hidden">
        <aside className="z-[500] flex min-h-0 flex-col border-l border-[#e6e8ec] bg-white shadow-[-8px_0_30px_rgba(26,26,26,0.05)]">
          <div className="shrink-0 border-b border-[#eeeeee] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Typography as="h1" variant="title" size="medium" weight="semibold" className="m-0 truncate text-[#1a1a1a]">محله‌های {cityName}</Typography>
                <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-1 text-[#808080]">محله اصلی را باز کنید تا زیرمحله‌های همان محدوده دیده شوند.</Typography>
              </div>
              <Button aria-label="بازگشت" onClick={() => pushRoute("/crm/locations")} size="small" variant="neutral-outline">
                <CrmIcon name="close" size={16} />
              </Button>
            </div>

            <div className="mt-4">
              <Button
                disabled={isPending}
                onClick={() => {
                  resetEditor();
                  setDraftName("");
                  setShowNewNeighborhoodInput((current) => !current);
                }}
                size="x-medium"
                variant="primary"
                fullWidth
              >
                محله جدید
              </Button>
            </div>

            {showNewNeighborhoodInput ? (
              <div className="mt-3 flex gap-2 rounded-xl bg-[#f7f8fa] p-2">
                <input
                  autoFocus
                  className="h-10 min-w-0 flex-1 rounded-lg border border-[#cccccc] bg-white px-3 text-sm outline-none focus:border-[#0048c4]"
                  onChange={(event) => setDraftName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") startNewNeighborhood();
                  }}
                  placeholder="نام محله جدید"
                  value={draftName}
                />
                <Button onClick={startNewNeighborhood} size="x-medium" variant="primary">ترسیم</Button>
              </div>
            ) : null}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {neighborhoodsQuery.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 7 }, (_, index) => <div className="h-14 animate-pulse rounded-xl bg-[#f3f4f6]" key={index} />)}
              </div>
            ) : neighborhoodsQuery.isError ? (
              <div className="rounded-xl bg-[#fff3f3] p-4 text-sm text-[#c11004]">
                دریافت محله‌ها با خطا مواجه شد.
                <Button className="mt-3" onClick={() => void neighborhoodsQuery.refetch()} size="small" variant="secondary">تلاش دوباره</Button>
              </div>
            ) : neighborhoods.length ? (
              <div className="space-y-2">
                {neighborhoods.map((neighborhood) => {
                  const neighborhoodId = getCrmRecordId(neighborhood);
                  const neighborhoodName = readText(neighborhood, ["name"], "محله");
                  const subNeighborhoods = parseSubNeighborhoods(neighborhood.sub_neighbors);
                  const isExpanded = expandedNeighborhoodId === neighborhoodId;
                  const isSelected = selectedNeighborhoodId === neighborhoodId && !selectedSubId;
                  const hasBoundary = getNeighborhoodPoints(neighborhood).length >= 3;

                  return (
                    <section className={`overflow-hidden rounded-xl border ${isSelected ? "border-[#0048c4]" : "border-[#e6e8ec]"}`} key={neighborhoodId}>
                      <div className={`flex items-center gap-2 px-3 py-2.5 ${isSelected ? "bg-[#f2f6ff]" : "bg-white"}`}>
                        <Button
                          unstyled
                          className="flex min-w-0 flex-1 items-center gap-2 text-right"
                          onClick={() => {
                            const willOpen = expandedNeighborhoodId !== neighborhoodId;
                            setSelectedNeighborhoodId(neighborhoodId);
                            setSelectedSubId("");
                            setExpandedNeighborhoodId(willOpen ? neighborhoodId : "");
                            setShowNewSubInputFor("");
                            setNewSubName("");
                          }}
                          type="button"
                        >
                          <span className="min-w-0 flex-1">
                            <Typography as="span" variant="label" size="medium" weight="semibold" className="block truncate text-[#1a1a1a]">{neighborhoodName}</Typography>
                            <Typography as="span" variant="body" size="small" weight="regular" className="mt-0.5 block text-[#808080]">
                              {subNeighborhoods.length ? `${subNeighborhoods.length} زیرمحله` : "بدون زیرمحله"} · {hasBoundary ? "مرزبندی شده" : "بدون مرزبندی"}
                            </Typography>
                          </span>
                        </Button>
                        <Button onClick={() => startNeighborhoodBoundary(neighborhood)} size="small" variant="secondary">مرزبندی</Button>
                        <LinearArrowLeft1 className={`w-5 h-5 ${isExpanded ? "rotate-90" : ""}`} />
                      </div>

                      {isExpanded ? (
                        <div className="border-t border-[#eeeeee] bg-[#fafafa] p-2">
                          <div className="space-y-1.5">
                            {subNeighborhoods.map((subNeighborhood) => {
                              const isSubSelected = selectedNeighborhoodId === neighborhoodId && selectedSubId === subNeighborhood.id;
                              const hasSubBoundary = getSubNeighborhoodPoints(subNeighborhood).length >= 3;

                              return (
                                <div className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${isSubSelected ? "border-[#11a366] bg-[#f0fbf6]" : "border-[#eeeeee] bg-white"}`} key={subNeighborhood.id}>
                                  <Button
                                    unstyled
                                    className="min-w-0 flex-1 text-right"
                                    onClick={() => {
                                      setSelectedNeighborhoodId(neighborhoodId);
                                      setSelectedSubId(subNeighborhood.id);
                                    }}
                                    type="button"
                                  >
                                    <Typography as="span" variant="body" size="medium" weight="medium" className="block truncate text-[#333333]">{subNeighborhood.name}</Typography>
                                    <Typography as="span" variant="body" size="small" weight="regular" className="block text-[#909090]">{hasSubBoundary ? "مرزبندی شده" : "بدون مرزبندی"}</Typography>
                                  </Button>
                                  <Button onClick={() => startSubNeighborhoodBoundary(neighborhood, subNeighborhood)} size="small" variant="neutral-outline">مرز</Button>
                                  <Button
                                    aria-label={`حذف ${subNeighborhood.name}`}
                                    disabled={isPending}
                                    onClick={() => {
                                      if (!window.confirm(`زیرمحله «${subNeighborhood.name}» حذف شود؟`)) return;
                                      void deleteSubNeighborhood(neighborhood, subNeighborhood.id);
                                    }}
                                    size="small"
                                    variant="text"
                                  >
                                    حذف
                                  </Button>
                                </div>
                              );
                            })}
                          </div>

                          {showNewSubInputFor === neighborhoodId ? (
                            <div className="mt-2 flex gap-2 rounded-lg border border-dashed border-[#cdd7e7] bg-white p-2">
                              <input
                                autoFocus
                                className="h-9 min-w-0 flex-1 rounded-lg border border-[#cccccc] px-2.5 text-sm outline-none focus:border-[#0048c4]"
                                onChange={(event) => setNewSubName(event.target.value)}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") startNewSubNeighborhood(neighborhood);
                                }}
                                placeholder="نام زیرمحله"
                                value={newSubName}
                              />
                              <Button onClick={() => startNewSubNeighborhood(neighborhood)} size="small" variant="primary">ترسیم</Button>
                            </div>
                          ) : (
                            <Button
                              className="mt-2"
                              onClick={() => {
                                setNewSubName("");
                                setShowNewSubInputFor(neighborhoodId);
                              }}
                              size="small"
                              variant="ghost"
                              fullWidth
                            >
                              + افزودن زیرمحله به {neighborhoodName}
                            </Button>
                          )}
                        </div>
                      ) : null}
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#d9dce2] p-5 text-center">
                <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 text-[#808080]">هنوز محله‌ای برای این شهر ثبت نشده است.</Typography>
              </div>
            )}
          </div>
        </aside>

        <section className="relative min-h-0 min-w-0 overflow-hidden bg-[#eef1f5]">
          <MapContainer center={cityCenter} className="h-full w-full" scrollWheelZoom zoom={13}>
            <TileLayer
              attribution={searchMapTileConfig.attribution}
              tms={searchMapTileConfig.isTms}
              url={searchMapTileConfig.urlTemplate}
            />
            <MapViewport center={cityCenter} points={allBoundaryPoints} />
            <MapResizeOnFullscreen fullscreen={isFullscreen} />
            <BoundaryDrawCollector
              boundaries={snapBoundaries}
              enabled={Boolean(editTarget)}
              onAdd={addDraftPoint}
            />

            {boundaries.map((boundary) => {
              if (boundary.id === activeBoundaryId) return null;
              const isSelected = boundary.kind === "neighborhood"
                ? selectedNeighborhoodId === boundary.neighborhoodId && !selectedSubId
                : selectedNeighborhoodId === boundary.neighborhoodId && selectedSubId === boundary.subId;
              const color = isSelected
                ? boundary.kind === "neighborhood" ? MAIN_BOUNDARY_COLOR : SUB_BOUNDARY_COLOR
                : MUTED_BOUNDARY_COLOR;

              return (
                <Polygon
                  eventHandlers={editTarget ? undefined : {
                    click: (event) => {
                      event.originalEvent.stopPropagation();
                      setSelectedNeighborhoodId(boundary.neighborhoodId);
                      setExpandedNeighborhoodId(boundary.neighborhoodId);
                      setSelectedSubId(boundary.subId ?? "");
                    },
                  }}
                  interactive={!editTarget}
                  key={boundary.id}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.18 : boundary.kind === "sub-neighborhood" ? 0.08 : 0.05,
                    opacity: isSelected ? 1 : 0.65,
                    weight: isSelected ? 3 : 2,
                  }}
                  positions={boundary.points}
                />
              );
            })}

            {editTarget && draftPoints.length >= 3 ? (
              <Polygon
                pathOptions={{
                  color: editTarget.kind === "sub-neighborhood" ? SUB_BOUNDARY_COLOR : MAIN_BOUNDARY_COLOR,
                  fillColor: editTarget.kind === "sub-neighborhood" ? SUB_BOUNDARY_COLOR : MAIN_BOUNDARY_COLOR,
                  fillOpacity: 0.2,
                  weight: 3,
                }}
                positions={draftPoints}
              />
            ) : null}

            {editTarget ? snapBoundaries.flatMap((boundary) =>
              boundary.points.map((point, index) => (
                <CircleMarker
                  center={point}
                  eventHandlers={{
                    click: (event) => {
                      event.originalEvent.stopPropagation();
                      addDraftPoint(point, true);
                    },
                  }}
                  key={`snap:${boundary.id}:${index}`}
                  pathOptions={{ color: "#ffffff", fillColor: "#6f7b8d", fillOpacity: 1, weight: 2 }}
                  radius={4}
                />
              )),
            ) : null}

            {draftPoints.map((point, index) => (
              <CircleMarker
                center={point}
                key={`draft:${point[0]}:${point[1]}:${index}`}
                pathOptions={{
                  color: editTarget?.kind === "sub-neighborhood" ? SUB_BOUNDARY_COLOR : MAIN_BOUNDARY_COLOR,
                  fillColor: "#ffffff",
                  fillOpacity: 1,
                  weight: 3,
                }}
                radius={6}
              />
            ))}
          </MapContainer>

          <div className="pointer-events-none absolute left-4 right-4 top-4 z-[600] flex items-start justify-between gap-4" dir="rtl">
            <div className="pointer-events-auto max-w-[680px] rounded-2xl border border-white/70 bg-white/95 p-3 shadow-[0_12px_34px_rgba(31,46,70,0.14)] backdrop-blur">
              {editTarget ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="min-w-[210px] flex-1">
                      <Typography as="p" variant="label" size="small" weight="semibold" className="m-0 mb-1 text-[#596477]">
                        {editTarget.kind === "sub-neighborhood" ? "نام زیرمحله" : "نام محله"}
                      </Typography>
                      <input
                        className="h-10 w-full rounded-lg border border-[#cccccc] bg-white px-3 text-sm outline-none focus:border-[#0048c4]"
                        onChange={(event) => setDraftName(event.target.value)}
                        value={draftName}
                      />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button disabled={!draftPoints.length || isPending} onClick={() => setDraftPoints((current) => current.slice(0, -1))} size="x-medium" variant="neutral-outline">حذف آخرین نقطه</Button>
                      <Button disabled={!draftPoints.length || isPending} onClick={() => setDraftPoints([])} size="x-medium" variant="neutral-outline">پاک کردن</Button>
                      <Button disabled={isPending} onClick={resetEditor} size="x-medium" variant="secondary">انصراف</Button>
                      <Button disabled={draftPoints.length < 3} loading={saveMutation.isPending} onClick={() => void saveActiveBoundary()} size="x-medium" variant="primary">ذخیره مرزبندی</Button>
                    </div>
                  </div>
                  <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 leading-5 text-[#596477]">
                    روی نقشه نقطه بگذارید. نزدیک شدن به نقطه یا خط مرز موجود، نقطه را خودکار به همان مرز متصل می‌کند تا بین دو محدوده فضای خالی ایجاد نشود.
                    {editTarget.kind === "sub-neighborhood" ? " نقاط زیرمحله فقط داخل محله اصلی پذیرفته می‌شوند." : ""}
                  </Typography>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eef4ff] text-[#0048c4]"><CrmIcon name="location" size={20} /></span>
                  <div>
                    <Typography as="p" variant="label" size="medium" weight="semibold" className="m-0 text-[#1a1a1a]">نقشه مرزبندی {cityName}</Typography>
                    <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-1 text-[#596477]">تمام محدوده‌های ثبت‌شده همزمان نمایش داده می‌شوند. از فهرست سمت راست یک محله یا زیرمحله را برای ویرایش انتخاب کنید.</Typography>
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="absolute bottom-4 left-4 z-[650]" dir="rtl">
            <Button onClick={toggleFullscreen} size="x-medium" variant="neutral-outline">
              {isFullscreen ? "خروج از تمام صفحه" : "تمام صفحه"}
            </Button>
          </div>

          {lastSnapNotice ? (
            <div className="pointer-events-none absolute bottom-5 left-1/2 z-[700] -translate-x-1/2 rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white shadow-lg">
              نقطه به مرز موجود متصل شد
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
