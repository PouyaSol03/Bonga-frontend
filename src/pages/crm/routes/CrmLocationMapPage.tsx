import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { divIcon, type LatLngTuple, type Map as LeafletMap, type Marker as LeafletMarker } from "leaflet";
import { CircleMarker, MapContainer, Marker, Polygon, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { pushRoute } from "../../../app/router/navigation";
import { getApiErrorMessage } from "../../../core/api/api";
import {
  createCrmSubNeighborhood,
  deleteCrmSubNeighborhood,
  getCrmRecordId,
  listCrmCities,
  listCrmNeighborhoods,
  listCrmSubNeighborhoods,
  saveCrmNeighborhood,
  updateCrmSubNeighborhood,
  type CrmSubNeighborhoodPayload,
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
const SUB_BOUNDARY_COLORS = [
  "#e11d48", // rose
  "#7c3aed", // violet
  "#0891b2", // cyan
  "#d97706", // amber
  "#16a34a", // green
  "#db2777", // pink
  "#4f46e5", // indigo
  "#ea580c", // orange
  "#0f766e", // teal
  "#9333ea", // purple
  "#65a30d", // lime
  "#dc2626", // red
] as const;
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

function getSubNeighborhoodColor(key: string) {
  if (!key) return SUB_BOUNDARY_COLOR;

  let hash = 0;
  for (let index = 0; index < key.length; index += 1) {
    hash = ((hash << 5) - hash + key.charCodeAt(index)) | 0;
  }

  return SUB_BOUNDARY_COLORS[Math.abs(hash) % SUB_BOUNDARY_COLORS.length];
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

function orientation(a: LatLngTuple, b: LatLngTuple, c: LatLngTuple) {
  const value = (b[1] - a[1]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[1] - a[1]);
  if (Math.abs(value) <= 0.00000002) return 0;
  return value > 0 ? 1 : -1;
}

function segmentsProperlyIntersect(a: LatLngTuple, b: LatLngTuple, c: LatLngTuple, d: LatLngTuple) {
  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);
  return o1 !== 0 && o2 !== 0 && o3 !== 0 && o4 !== 0 && o1 !== o2 && o3 !== o4;
}

function segmentStaysInsidePolygon(start: LatLngTuple, end: LatLngTuple, polygon: LatLngTuple[]) {
  if (!isPointInsideOrOnPolygon(start, polygon) || !isPointInsideOrOnPolygon(end, polygon)) return false;

  for (let index = 0; index < polygon.length; index += 1) {
    const parentStart = polygon[index];
    const parentEnd = polygon[(index + 1) % polygon.length];
    if (segmentsProperlyIntersect(start, end, parentStart, parentEnd)) return false;
  }

  // Also sample the edge so a line passing exactly through a concave parent vertex
  // cannot briefly leave the parent polygon without a proper segment intersection.
  for (let step = 1; step < 16; step += 1) {
    const t = step / 16;
    const point: LatLngTuple = [
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t,
    ];
    if (!isPointInsideOrOnPolygon(point, polygon)) return false;
  }

  return true;
}

function isBoundaryInsidePolygon(points: LatLngTuple[], parentPolygon: LatLngTuple[]) {
  if (!points.length || parentPolygon.length < 3) return false;
  if (!points.every((point) => isPointInsideOrOnPolygon(point, parentPolygon))) return false;
  if (points.length === 1) return true;

  const edgeCount = points.length >= 3 ? points.length : points.length - 1;
  for (let index = 0; index < edgeCount; index += 1) {
    const nextIndex = points.length >= 3 ? (index + 1) % points.length : index + 1;
    if (!segmentStaysInsidePolygon(points[index], points[nextIndex], parentPolygon)) return false;
  }

  return true;
}

function isPointStrictlyInsidePolygon(point: LatLngTuple, polygon: LatLngTuple[]) {
  if (polygon.length < 3) return false;

  for (let index = 0; index < polygon.length; index += 1) {
    if (isPointOnSegment(point, polygon[index], polygon[(index + 1) % polygon.length])) return false;
  }

  return isPointInsideOrOnPolygon(point, polygon);
}

function segmentEntersPolygon(start: LatLngTuple, end: LatLngTuple, polygon: LatLngTuple[]) {
  if (isPointStrictlyInsidePolygon(start, polygon) || isPointStrictlyInsidePolygon(end, polygon)) return true;

  for (let index = 0; index < polygon.length; index += 1) {
    if (segmentsProperlyIntersect(start, end, polygon[index], polygon[(index + 1) % polygon.length])) return true;
  }

  // Sampling also catches a segment that enters/leaves through an exact polygon vertex.
  for (let step = 1; step < 20; step += 1) {
    const t = step / 20;
    const point: LatLngTuple = [
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t,
    ];
    if (isPointStrictlyInsidePolygon(point, polygon)) return true;
  }

  return false;
}

function polygonsShareInterior(first: LatLngTuple[], second: LatLngTuple[]) {
  if (first.length < 3 || second.length < 3) return false;

  if (first.some((point) => isPointStrictlyInsidePolygon(point, second))) return true;
  if (second.some((point) => isPointStrictlyInsidePolygon(point, first))) return true;

  for (let firstIndex = 0; firstIndex < first.length; firstIndex += 1) {
    const firstStart = first[firstIndex];
    const firstEnd = first[(firstIndex + 1) % first.length];

    for (let secondIndex = 0; secondIndex < second.length; secondIndex += 1) {
      if (segmentsProperlyIntersect(
        firstStart,
        firstEnd,
        second[secondIndex],
        second[(secondIndex + 1) % second.length],
      )) return true;
    }
  }

  // Coincident/mostly coincident polygons can have no strict vertex containment or
  // proper edge crossing. Sample their overlapping bounding box to detect shared area.
  const firstLats = first.map((point) => point[0]);
  const firstLngs = first.map((point) => point[1]);
  const secondLats = second.map((point) => point[0]);
  const secondLngs = second.map((point) => point[1]);
  const minLat = Math.max(Math.min(...firstLats), Math.min(...secondLats));
  const maxLat = Math.min(Math.max(...firstLats), Math.max(...secondLats));
  const minLng = Math.max(Math.min(...firstLngs), Math.min(...secondLngs));
  const maxLng = Math.min(Math.max(...firstLngs), Math.max(...secondLngs));

  if (minLat >= maxLat || minLng >= maxLng) return false;

  for (let row = 1; row < 8; row += 1) {
    for (let column = 1; column < 8; column += 1) {
      const point: LatLngTuple = [
        minLat + ((maxLat - minLat) * row) / 8,
        minLng + ((maxLng - minLng) * column) / 8,
      ];
      if (isPointStrictlyInsidePolygon(point, first) && isPointStrictlyInsidePolygon(point, second)) return true;
    }
  }

  return false;
}

function boundaryEntersAnyPolygon(points: LatLngTuple[], polygons: LatLngTuple[][]) {
  for (const polygon of polygons) {
    if (points.some((point) => isPointStrictlyInsidePolygon(point, polygon))) return true;

    if (points.length >= 2) {
      const edgeCount = points.length >= 3 ? points.length : points.length - 1;
      for (let index = 0; index < edgeCount; index += 1) {
        const nextIndex = points.length >= 3 ? (index + 1) % points.length : index + 1;
        if (segmentEntersPolygon(points[index], points[nextIndex], polygon)) return true;
      }
    }

    if (points.length >= 3 && polygonsShareInterior(points, polygon)) return true;
  }

  return false;
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

function layerDistance(map: LeafletMap, first: LatLngTuple, second: LatLngTuple) {
  return map.latLngToLayerPoint(first).distanceTo(map.latLngToLayerPoint(second));
}

function projectedPointOnSegment(
  map: LeafletMap,
  point: LatLngTuple,
  start: LatLngTuple,
  end: LatLngTuple,
): LatLngTuple {
  const pointPx = map.latLngToLayerPoint(point);
  const startPx = map.latLngToLayerPoint(start);
  const endPx = map.latLngToLayerPoint(end);
  const dx = endPx.x - startPx.x;
  const dy = endPx.y - startPx.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return start;

  const t = Math.max(
    0,
    Math.min(1, ((pointPx.x - startPx.x) * dx + (pointPx.y - startPx.y) * dy) / lengthSquared),
  );
  const projected = map.layerPointToLatLng([
    startPx.x + t * dx,
    startPx.y + t * dy,
  ]);
  return [projected.lat, projected.lng];
}

function closestValidPoint(
  map: LeafletMap,
  requestedPoint: LatLngTuple,
  anchorPoint: LatLngTuple | null,
  constraintPolygons: LatLngTuple[][],
  isValid: (point: LatLngTuple) => boolean,
) {
  if (isValid(requestedPoint)) return requestedPoint;

  const candidates: LatLngTuple[] = [];

  // First clamp along the exact direction the user moved the pointer. This makes
  // dragging feel continuous: the handle reaches the last legal point instead of
  // jumping back to its old position when the cursor crosses a forbidden area.
  if (anchorPoint) {
    let low = 0;
    let high = 1;
    let best: LatLngTuple | null = null;

    for (let iteration = 0; iteration < 28; iteration += 1) {
      const t = (low + high) / 2;
      const candidate: LatLngTuple = [
        anchorPoint[0] + (requestedPoint[0] - anchorPoint[0]) * t,
        anchorPoint[1] + (requestedPoint[1] - anchorPoint[1]) * t,
      ];

      if (isValid(candidate)) {
        best = candidate;
        low = t;
      } else {
        high = t;
      }
    }

    if (best) candidates.push(best);
  }

  // If the pointer is outside the parent or inside a sibling, also consider the
  // geometrically nearest legal border point. This is especially useful when a
  // user clicks well outside the allowed area while adding a new vertex.
  constraintPolygons.forEach((polygon) => {
    polygon.forEach((start, index) => {
      const end = polygon[(index + 1) % polygon.length];
      candidates.push(start, projectedPointOnSegment(map, requestedPoint, start, end));
    });
  });

  let bestPoint: LatLngTuple | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  candidates.forEach((candidate) => {
    if (!isValid(candidate)) return;
    const distance = layerDistance(map, requestedPoint, candidate);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestPoint = candidate;
    }
  });

  return bestPoint;
}

function closestSnapPoint(
  map: LeafletMap,
  point: LatLngTuple,
  boundaries: BoundaryItem[],
) {
  const clickPoint = map.latLngToLayerPoint(point);
  let bestDistance = Number.POSITIVE_INFINITY;
  let bestPoint: LatLngTuple | null = null;

  const consider = (candidate: LatLngTuple) => {
    const candidatePoint = map.latLngToLayerPoint(candidate);
    const distance = clickPoint.distanceTo(candidatePoint);
    if (distance > SNAP_DISTANCE_PX) return;
    if (distance < bestDistance) {
      bestDistance = distance;
      bestPoint = candidate;
    }
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

  return bestPoint ?? point;
}

function BoundaryDrawCollector({
  enabled,
  onAdd,
}: {
  enabled: boolean;
  onAdd: (map: LeafletMap, point: LatLngTuple) => void;
}) {
  const map = useMapEvents({
    click(event) {
      if (!enabled) return;

      const rawPoint: LatLngTuple = [event.latlng.lat, event.latlng.lng];
      onAdd(map, rawPoint);
    },
  });

  return null;
}

function EditableBoundaryVertex({
  boundaries,
  color,
  index,
  onMove,
  onPreviewMove,
  onSelect,
  point,
  selected,
}: {
  boundaries: BoundaryItem[];
  color: string;
  index: number;
  onMove: (index: number, point: LatLngTuple, map: LeafletMap) => LatLngTuple | null;
  onPreviewMove: (index: number, point: LatLngTuple, map: LeafletMap) => LatLngTuple | null;
  onSelect: (index: number) => void;
  point: LatLngTuple;
  selected: boolean;
}) {
  const map = useMap();
  const icon = useMemo(() => divIcon({
    className: "",
    html: `<span style="display:block;width:${selected ? 18 : 16}px;height:${selected ? 18 : 16}px;border-radius:9999px;border:3px solid ${color};background:${selected ? color : "#fff"};box-shadow:0 2px 8px rgba(26,26,26,.22);cursor:grab"></span>`,
    iconAnchor: [selected ? 9 : 8, selected ? 9 : 8],
    iconSize: [selected ? 18 : 16, selected ? 18 : 16],
  }), [color, selected]);

  return (
    <Marker
      draggable
      eventHandlers={{
        click: (event) => {
          event.originalEvent.stopPropagation();
          onSelect(index);
        },
        drag: (event) => {
          const marker = event.target as LeafletMarker;
          const latLng = marker.getLatLng();
          const rawPoint: LatLngTuple = [latLng.lat, latLng.lng];
          const resolvedPoint = onPreviewMove(index, rawPoint, map);
          if (resolvedPoint) marker.setLatLng(resolvedPoint);
          else marker.setLatLng(point);
        },
        dragend: (event) => {
          const marker = event.target as LeafletMarker;
          const latLng = marker.getLatLng();
          const rawPoint: LatLngTuple = [latLng.lat, latLng.lng];
          const snappedPoint = closestSnapPoint(map, rawPoint, boundaries);
          const resolvedPoint = onMove(index, snappedPoint, map);
          if (resolvedPoint) marker.setLatLng(resolvedPoint);
          else marker.setLatLng(point);
        },
      }}
      icon={icon}
      position={point}
      zIndexOffset={selected ? 1200 : 1100}
    />
  );
}

function getEdgeMidpoint(start: LatLngTuple, end: LatLngTuple): LatLngTuple {
  return [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
}

export function CrmLocationMapPage({ notify, refreshNonce }: CrmRoutePageProps) {
  const queryClient = useQueryClient();
  const cityId = getCityIdFromUrl();
  const citySnapshot = getCitySnapshotFromUrl();
  const initialNeighborhoodId = getSelectedNeighborhoodIdFromUrl();
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const didApplyDefaultSelectionRef = useRef(false);
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
  const [selectedDraftPointIndex, setSelectedDraftPointIndex] = useState<number | null>(null);

  const citiesQuery = useQuery({
    queryFn: () => listCrmCities(),
    queryKey: ["crm", "cities", "map", refreshNonce],
  });
  const neighborhoodsQuery = useQuery({
    enabled: Boolean(cityId),
    queryFn: () => listCrmNeighborhoods({ cityId, perPage: 500 }),
    queryKey: ["crm", "neighborhoods", cityId, refreshNonce],
  });

  const baseNeighborhoods = neighborhoodsQuery.data ?? [];
  const neighborhoodIds = useMemo(
    () => baseNeighborhoods.map((item) => getCrmRecordId(item)).filter(Boolean),
    [baseNeighborhoods],
  );
  const subNeighborhoodsQuery = useQuery({
    enabled: Boolean(cityId) && neighborhoodIds.length > 0,
    queryFn: async () => {
      const entries = await Promise.all(
        neighborhoodIds.map(async (neighborhoodId) => [
          neighborhoodId,
          await listCrmSubNeighborhoods({ neighborhoodId }),
        ] as const),
      );

      return Object.fromEntries(entries) as Record<string, CrmRecord[]>;
    },
    queryKey: ["crm", "sub-neighborhoods", "map", cityId, neighborhoodIds.join(","), refreshNonce],
  });
  const neighborhoods = useMemo<CrmRecord[]>(
    () => baseNeighborhoods.map((neighborhood) => {
      const neighborhoodId = getCrmRecordId(neighborhood);
      const standaloneSubNeighborhoods = subNeighborhoodsQuery.data?.[neighborhoodId];
      const enrichedNeighborhood: CrmRecord = {
        ...neighborhood,
        sub_neighbors: standaloneSubNeighborhoods ?? (
          subNeighborhoodsQuery.isSuccess ? [] : parseSubNeighborhoods(neighborhood.sub_neighbors)
        ),
      };

      return enrichedNeighborhood;
    }),
    [baseNeighborhoods, subNeighborhoodsQuery.data, subNeighborhoodsQuery.isSuccess],
  );
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
  const activeSubParentNeighborhood = editTarget?.kind === "sub-neighborhood"
    ? neighborhoods.find((item) => getCrmRecordId(item) === editTarget.neighborhoodId)
    : undefined;
  const parentPolygonForActiveSub = activeSubParentNeighborhood
    ? getNeighborhoodPoints(activeSubParentNeighborhood)
    : [];
  const siblingPolygonsForActiveSub = editTarget?.kind === "sub-neighborhood" && activeSubParentNeighborhood
    ? parseSubNeighborhoods(activeSubParentNeighborhood.sub_neighbors)
      .filter((subNeighborhood) => subNeighborhood.id !== editTarget.subId)
      .map(getSubNeighborhoodPoints)
      .filter((points) => points.length >= 3)
    : [];

  useEffect(() => {
    if (didApplyDefaultSelectionRef.current || !boundaries.length) return;

    const preferredBoundary = initialNeighborhoodId
      ? boundaries.find((boundary) => boundary.neighborhoodId === initialNeighborhoodId && boundary.kind === "neighborhood")
        ?? boundaries.find((boundary) => boundary.neighborhoodId === initialNeighborhoodId)
      : undefined;
    const defaultBoundary = preferredBoundary ?? boundaries[0];
    if (!defaultBoundary) return;

    setSelectedNeighborhoodId(defaultBoundary.neighborhoodId);
    setSelectedSubId(defaultBoundary.subId ?? "");
    setExpandedNeighborhoodId(defaultBoundary.neighborhoodId);
    didApplyDefaultSelectionRef.current = true;
  }, [boundaries, initialNeighborhoodId]);

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
    await queryClient.invalidateQueries({ queryKey: ["crm", "sub-neighborhoods"] });
  };

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmRecord }) => saveCrmNeighborhood(id, payload),
    onError: (error) => notify(getApiErrorMessage(error, "ذخیره محدوده جغرافیایی با خطا مواجه شد."), "error"),
    onSuccess: async () => {
      await invalidateNeighborhoods();
      notify("محدوده جغرافیایی با موفقیت ذخیره شد.");
    },
  });

  const subNeighborhoodSaveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmSubNeighborhoodPayload }) =>
      id ? updateCrmSubNeighborhood(id, payload) : createCrmSubNeighborhood(payload),
    onError: (error) => notify(getApiErrorMessage(error, "ذخیره زیرمحله با خطا مواجه شد."), "error"),
    onSuccess: async () => {
      await invalidateNeighborhoods();
      notify("زیرمحله با موفقیت ذخیره شد.");
    },
  });

  const subNeighborhoodDeleteMutation = useMutation({
    mutationFn: deleteCrmSubNeighborhood,
    onError: (error) => notify(getApiErrorMessage(error, "حذف زیرمحله با خطا مواجه شد."), "error"),
    onSuccess: async () => {
      await invalidateNeighborhoods();
      notify("زیرمحله با موفقیت حذف شد.");
    },
  });

  const isPending = saveMutation.isPending || subNeighborhoodSaveMutation.isPending || subNeighborhoodDeleteMutation.isPending;

  const resetEditor = () => {
    setEditTarget(null);
    setDraftPoints([]);
    setDraftName("");
    setLastSnapNotice(false);
    setSelectedDraftPointIndex(null);
  };

  const cancelActiveBoundary = () => {
    if (editTarget?.kind === "sub-neighborhood" && editTarget.isNew) {
      setSelectedNeighborhoodId(editTarget.neighborhoodId);
      setSelectedSubId("");
      setExpandedNeighborhoodId(editTarget.neighborhoodId);
    }

    resetEditor();
  };

  const startNeighborhoodBoundary = (neighborhood: CrmRecord) => {
    const neighborhoodId = getCrmRecordId(neighborhood);
    setSelectedNeighborhoodId(neighborhoodId);
    setSelectedSubId("");
    setExpandedNeighborhoodId(neighborhoodId);
    setEditTarget({ kind: "neighborhood", neighborhoodId });
    setDraftName(readText(neighborhood, ["name"], ""));
    setDraftPoints(getNeighborhoodPoints(neighborhood));
    setSelectedDraftPointIndex(null);
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
    setSelectedDraftPointIndex(null);
    setShowNewNeighborhoodInput(false);
  };

  const startSubNeighborhoodBoundary = (
    neighborhood: CrmRecord,
    subNeighborhood: SubNeighborhoodRecord,
  ) => {
    const neighborhoodId = getCrmRecordId(neighborhood);

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
    setSelectedDraftPointIndex(null);
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
    setSelectedDraftPointIndex(null);
    setNewSubName("");
    setShowNewSubInputFor("");
  };

  const isAllowedSubNeighborhoodDraft = (points: LatLngTuple[], showError = true) => {
    if (editTarget?.kind !== "sub-neighborhood") return true;

    if (parentPolygonForActiveSub.length < 3 || !isBoundaryInsidePolygon(points, parentPolygonForActiveSub)) {
      if (showError) notify("محدوده زیرمحله باید کاملاً داخل محدوده محله اصلی باشد.", "error");
      return false;
    }

    if (boundaryEntersAnyPolygon(points, siblingPolygonsForActiveSub)) {
      if (showError) notify("محدوده زیرمحله نمی‌تواند داخل یا روی محدوده زیرمحله دیگری هم‌پوشانی داشته باشد.", "error");
      return false;
    }

    return true;
  };

  const subNeighborhoodConstraintPolygons = editTarget?.kind === "sub-neighborhood"
    ? [parentPolygonForActiveSub, ...siblingPolygonsForActiveSub].filter((points) => points.length >= 3)
    : [];

  const addExactDraftPoint = (point: LatLngTuple, adjusted = false) => {
    if (!editTarget) return false;
    if (draftPoints.some((current) => samePoint(current, point))) return false;

    const nextPoints = [...draftPoints, point];
    if (!isAllowedSubNeighborhoodDraft(nextPoints, false)) return false;

    setDraftPoints(nextPoints);
    setSelectedDraftPointIndex(draftPoints.length);
    if (adjusted) setLastSnapNotice(true);
    return true;
  };

  const addDraftPoint = (map: LeafletMap, rawPoint: LatLngTuple) => {
    if (!editTarget) return;

    const snappedPoint = closestSnapPoint(map, rawPoint, snapBoundaries);
    const isValidCandidate = (candidate: LatLngTuple) => {
      if (draftPoints.some((current) => samePoint(current, candidate))) return false;
      return isAllowedSubNeighborhoodDraft([...draftPoints, candidate], false);
    };

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
        subNeighborhoodConstraintPolygons,
        isValidCandidate,
      );
    }

    if (!resolvedPoint) {
      notify("در این قسمت امکان قرار دادن نقطه وجود ندارد.", "error");
      return;
    }

    addExactDraftPoint(resolvedPoint, !samePoint(rawPoint, resolvedPoint));
  };

  const resolveAndMoveDraftPoint = (
    index: number,
    requestedPoint: LatLngTuple,
    map: LeafletMap,
    showAdjustmentNotice: boolean,
  ) => {
    if (!editTarget) return null;

    const isValidCandidate = (candidate: LatLngTuple) => {
      if (draftPoints.some((currentPoint, currentIndex) => currentIndex !== index && samePoint(currentPoint, candidate))) {
        return false;
      }

      const nextPoints = draftPoints.map((currentPoint, currentIndex) =>
        currentIndex === index ? candidate : currentPoint,
      );
      return isAllowedSubNeighborhoodDraft(nextPoints, false);
    };

    const resolvedPoint = editTarget.kind === "sub-neighborhood"
      ? closestValidPoint(
        map,
        requestedPoint,
        draftPoints[index] ?? null,
        subNeighborhoodConstraintPolygons,
        isValidCandidate,
      )
      : isValidCandidate(requestedPoint) ? requestedPoint : null;

    if (!resolvedPoint) return null;

    const nextPoints = draftPoints.map((currentPoint, currentIndex) =>
      currentIndex === index ? resolvedPoint : currentPoint,
    );
    setDraftPoints(nextPoints);
    setSelectedDraftPointIndex(index);

    if (showAdjustmentNotice && !samePoint(requestedPoint, resolvedPoint)) {
      setLastSnapNotice(true);
    }

    return resolvedPoint;
  };

  const moveDraftPoint = (index: number, point: LatLngTuple, map: LeafletMap) =>
    resolveAndMoveDraftPoint(index, point, map, true);

  const previewDraftPointMove = (index: number, point: LatLngTuple, map: LeafletMap) =>
    resolveAndMoveDraftPoint(index, point, map, false);

  const insertDraftPointAfter = (index: number, point: LatLngTuple) => {
    if (!editTarget) return;

    const nextPoints = [
      ...draftPoints.slice(0, index + 1),
      point,
      ...draftPoints.slice(index + 1),
    ];
    if (!isAllowedSubNeighborhoodDraft(nextPoints)) return;

    setDraftPoints(nextPoints);
    setSelectedDraftPointIndex(index + 1);
  };

  const removeDraftPoint = (index: number) => {
    const nextPoints = draftPoints.filter((_, currentIndex) => currentIndex !== index);
    if (nextPoints.length > 0 && !isAllowedSubNeighborhoodDraft(nextPoints)) return;

    setDraftPoints(nextPoints);
    setSelectedDraftPointIndex(null);
  };

  const saveActiveBoundary = async () => {
    if (!editTarget) return;
    const name = draftName.trim();
    if (!name) {
      notify(editTarget.kind === "sub-neighborhood" ? "نام زیرمحله را وارد کنید." : "نام محله را وارد کنید.", "error");
      return;
    }

    const requiresPolygon = editTarget.kind === "new-neighborhood" || editTarget.kind === "sub-neighborhood";
    if (requiresPolygon && draftPoints.length < 3) {
      notify("برای ذخیره محدوده حداقل سه نقطه انتخاب کنید.", "error");
      return;
    }
    if (draftPoints.length > 0 && draftPoints.length < 3) {
      notify("برای تغییر مرزبندی حداقل سه نقطه انتخاب کنید، یا نقاط را کامل پاک کنید تا فقط نام ذخیره شود.", "error");
      return;
    }

    const polygon = draftPoints.length >= 3 ? pointsToGeoJson(draftPoints) : null;
    const center = polygon ? polygonCenter(draftPoints, cityCenter) : cityCenter;

    if (editTarget.kind === "new-neighborhood") {
      if (!polygon) return;
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
      const duplicateNeighborhood = neighborhoods.find((item) =>
        getCrmRecordId(item) !== editTarget.neighborhoodId &&
        readText(item, ["name"], "").trim() === name,
      );
      if (duplicateNeighborhood) {
        notify("محله‌ای با این نام در همین شهر وجود دارد.", "error");
        return;
      }

      await saveMutation.mutateAsync({
        id: editTarget.neighborhoodId,
        payload: {
          city_id: neighborhood.city_id ?? cityId,
          lat: polygon ? center[0] : neighborhood.lat ?? cityCenter[0],
          lng: polygon ? center[1] : neighborhood.lng ?? cityCenter[1],
          name,
          polygon: polygon ?? parseMaybeJson(neighborhood.polygon ?? neighborhood.geofence) ?? undefined,
          sub_neighbors: parseSubNeighborhoods(neighborhood.sub_neighbors),
        },
      });
      resetEditor();
      return;
    }

    const duplicateSubNeighborhood = neighborhoods.find((item) => {
      const ownerId = getCrmRecordId(item);
      return parseSubNeighborhoods(item.sub_neighbors).some((sub) =>
        sub.name.trim() === name &&
        !(ownerId === editTarget.neighborhoodId && sub.id === editTarget.subId),
      );
    });
    if (duplicateSubNeighborhood) {
      notify(`زیرمحله «${name}» قبلاً زیر محله «${readText(duplicateSubNeighborhood, ["name"], "")}» ثبت شده است.`, "error");
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
      notify("این زیرمحله قبلاً به محله دیگری متصل شده و نمی‌تواند در دو محله قرار بگیرد.", "error");
      return;
    }

    if (!polygon) return;

    const neighborhoodId = Number(editTarget.neighborhoodId);
    if (!Number.isInteger(neighborhoodId) || neighborhoodId <= 0) {
      notify("شناسه محله اصلی معتبر نیست.", "error");
      return;
    }

    await subNeighborhoodSaveMutation.mutateAsync({
      id: editTarget.isNew ? null : editTarget.subId,
      payload: {
        neighborhood_id: neighborhoodId,
        name,
        geofence: polygon,
      },
    });

    if (editTarget.isNew) {
      setSelectedNeighborhoodId(editTarget.neighborhoodId);
      setSelectedSubId("");
      setExpandedNeighborhoodId(editTarget.neighborhoodId);
    }
    resetEditor();
  };

  const deleteSubNeighborhood = async (subId: string) => {
    await subNeighborhoodDeleteMutation.mutateAsync(subId);

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
            {neighborhoodsQuery.isLoading || (neighborhoodIds.length > 0 && subNeighborhoodsQuery.isLoading) ? (
              <div className="space-y-2">
                {Array.from({ length: 7 }, (_, index) => <div className="h-14 animate-pulse rounded-xl bg-[#f3f4f6]" key={index} />)}
              </div>
            ) : neighborhoodsQuery.isError || subNeighborhoodsQuery.isError ? (
              <div className="rounded-xl bg-[#fff3f3] p-4 text-sm text-[#c11004]">
                دریافت محله‌ها یا زیرمحله‌ها با خطا مواجه شد.
                <Button
                  className="mt-3"
                  onClick={() => {
                    void neighborhoodsQuery.refetch();
                    void subNeighborhoodsQuery.refetch();
                  }}
                  size="small"
                  variant="secondary"
                >
                  تلاش دوباره
                </Button>
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
                        <Button onClick={() => startNeighborhoodBoundary(neighborhood)} size="small" variant="secondary">ویرایش</Button>
                        <LinearArrowLeft1 className={`w-5 h-5 ${isExpanded ? "rotate-90" : ""}`} />
                      </div>

                      {isExpanded ? (
                        <div className="border-t border-[#eeeeee] bg-[#fafafa] p-2">
                          <div className="space-y-1.5">
                            {subNeighborhoods.map((subNeighborhood) => {
                              const subNeighborhoodColor = getSubNeighborhoodColor(`${neighborhoodId}:${subNeighborhood.id}`);
                              const isSubSelected = selectedNeighborhoodId === neighborhoodId && selectedSubId === subNeighborhood.id;
                              const hasSubBoundary = getSubNeighborhoodPoints(subNeighborhood).length >= 3;

                              return (
                                <div
                                  className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${isSubSelected ? "" : "border-[#eeeeee] bg-white"}`}
                                  key={subNeighborhood.id}
                                  style={isSubSelected ? {
                                    backgroundColor: `${subNeighborhoodColor}12`,
                                    borderColor: subNeighborhoodColor,
                                  } : undefined}
                                >
                                  <Button
                                    unstyled
                                    className="min-w-0 flex-1 text-right"
                                    onClick={() => {
                                      setSelectedNeighborhoodId(neighborhoodId);
                                      setSelectedSubId(subNeighborhood.id);
                                    }}
                                    type="button"
                                  >
                                    <span className="flex min-w-0 items-center gap-2">
                                      <span
                                        aria-hidden="true"
                                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                                        style={{ backgroundColor: subNeighborhoodColor }}
                                      />
                                      <Typography as="span" variant="body" size="medium" weight="medium" className="block min-w-0 truncate text-[#333333]">{subNeighborhood.name}</Typography>
                                    </span>
                                    <Typography as="span" variant="body" size="small" weight="regular" className="block text-[#909090]">{hasSubBoundary ? "مرزبندی شده" : "بدون مرزبندی"}</Typography>
                                  </Button>
                                  <Button onClick={() => startSubNeighborhoodBoundary(neighborhood, subNeighborhood)} size="small" variant="neutral-outline">ویرایش</Button>
                                  <Button
                                    aria-label={`حذف ${subNeighborhood.name}`}
                                    disabled={isPending}
                                    onClick={() => {
                                      if (!window.confirm(`زیرمحله «${subNeighborhood.name}» حذف شود؟`)) return;
                                      void deleteSubNeighborhood(subNeighborhood.id);
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
                            <div className="mt-2 rounded-lg border border-dashed border-[#cdd7e7] bg-white p-2">
                              <div className="mb-2 flex items-center gap-2 rounded-lg bg-[#f2f6ff] px-2.5 py-2">
                                <Typography as="span" variant="body" size="small" weight="regular" className="text-[#596477]">محله انتخاب‌شده:</Typography>
                                <Typography as="strong" variant="label" size="small" weight="semibold" className="truncate text-[#0048c4]">{neighborhoodName}</Typography>
                              </div>
                              <div className="flex gap-2">
                                <input
                                  autoFocus
                                  className="h-9 min-w-0 flex-1 rounded-lg border border-[#cccccc] px-2.5 text-sm outline-none focus:border-[#0048c4]"
                                  onChange={(event) => setNewSubName(event.target.value)}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") startNewSubNeighborhood(neighborhood);
                                  }}
                                  placeholder={`نام زیرمحله برای ${neighborhoodName}`}
                                  value={newSubName}
                                />
                                <Button onClick={() => startNewSubNeighborhood(neighborhood)} size="small" variant="primary">ترسیم</Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              className="mt-2"
                              onClick={() => {
                                setSelectedNeighborhoodId(neighborhoodId);
                                setSelectedSubId("");
                                setExpandedNeighborhoodId(neighborhoodId);
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
              enabled={Boolean(editTarget) && (draftPoints.length < 3 || editTarget?.kind === "new-neighborhood" || (editTarget?.kind === "sub-neighborhood" && editTarget.isNew))}
              onAdd={addDraftPoint}
            />

            {boundaries.map((boundary) => {
              if (boundary.id === activeBoundaryId) return null;
              const isSelected = boundary.kind === "neighborhood"
                ? selectedNeighborhoodId === boundary.neighborhoodId && !selectedSubId
                : selectedNeighborhoodId === boundary.neighborhoodId && selectedSubId === boundary.subId;
              const isParentOfSelectedSub =
                boundary.kind === "neighborhood" &&
                selectedNeighborhoodId === boundary.neighborhoodId &&
                Boolean(selectedSubId);
              const subNeighborhoodColor = boundary.kind === "sub-neighborhood"
                ? getSubNeighborhoodColor(`${boundary.neighborhoodId}:${boundary.subId ?? boundary.name}`)
                : null;
              const color = boundary.kind === "sub-neighborhood"
                ? subNeighborhoodColor ?? SUB_BOUNDARY_COLOR
                : isSelected || isParentOfSelectedSub
                  ? MAIN_BOUNDARY_COLOR
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
                    fillOpacity: isSelected ? 0.2 : isParentOfSelectedSub ? 0.07 : boundary.kind === "sub-neighborhood" ? 0.11 : 0.05,
                    opacity: isSelected ? 1 : isParentOfSelectedSub ? 0.55 : boundary.kind === "sub-neighborhood" ? 0.82 : 0.65,
                    weight: isSelected ? 3 : isParentOfSelectedSub ? 2.5 : boundary.kind === "sub-neighborhood" ? 2.25 : 2,
                  }}
                  positions={boundary.points}
                />
              );
            })}

            {editTarget && draftPoints.length >= 3 ? (
              <Polygon
                pathOptions={{
                  color: editTarget.kind === "sub-neighborhood"
                    ? getSubNeighborhoodColor(`${editTarget.neighborhoodId}:${editTarget.subId}`)
                    : MAIN_BOUNDARY_COLOR,
                  fillColor: editTarget.kind === "sub-neighborhood"
                    ? getSubNeighborhoodColor(`${editTarget.neighborhoodId}:${editTarget.subId}`)
                    : MAIN_BOUNDARY_COLOR,
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
                      addExactDraftPoint(point, true);
                    },
                  }}
                  key={`snap:${boundary.id}:${index}`}
                  pathOptions={{ color: "#ffffff", fillColor: "#6f7b8d", fillOpacity: 1, weight: 2 }}
                  radius={4}
                />
              )),
            ) : null}

            {editTarget && draftPoints.length >= 3 ? draftPoints.map((point, index) => {
              const nextPoint = draftPoints[(index + 1) % draftPoints.length];
              const midpoint = getEdgeMidpoint(point, nextPoint);

              return (
                <CircleMarker
                  center={midpoint}
                  eventHandlers={{
                    click: (event) => {
                      event.originalEvent.stopPropagation();
                      insertDraftPointAfter(index, midpoint);
                    },
                  }}
                  key={`edge-add:${index}:${midpoint[0]}:${midpoint[1]}`}
                  pathOptions={{
                    color: "#ffffff",
                    fillColor: editTarget.kind === "sub-neighborhood"
                      ? getSubNeighborhoodColor(`${editTarget.neighborhoodId}:${editTarget.subId}`)
                      : MAIN_BOUNDARY_COLOR,
                    fillOpacity: 0.92,
                    weight: 2,
                  }}
                  radius={5}
                />
              );
            }) : null}

            {editTarget ? draftPoints.map((point, index) => (
              <EditableBoundaryVertex
                boundaries={snapBoundaries}
                color={editTarget.kind === "sub-neighborhood"
                  ? getSubNeighborhoodColor(`${editTarget.neighborhoodId}:${editTarget.subId}`)
                  : MAIN_BOUNDARY_COLOR}
                index={index}
                key={`draft:${index}`}
                onMove={moveDraftPoint}
                onPreviewMove={previewDraftPointMove}
                onSelect={setSelectedDraftPointIndex}
                point={point}
                selected={selectedDraftPointIndex === index}
              />
            )) : null}
          </MapContainer>

          {editTarget ? (
            <div className="absolute left-1/2 top-4 z-[700] -translate-x-1/2" dir="rtl">
              <div className="flex items-center gap-2 rounded-xl border border-[#e1e4e8] bg-white p-2 shadow-[0_8px_28px_rgba(26,26,26,0.14)]">
                <Button
                  disabled={isPending}
                  loading={subNeighborhoodSaveMutation.isPending || saveMutation.isPending}
                  onClick={() => void saveActiveBoundary()}
                  size="x-medium"
                  variant="primary"
                >
                  ثبت تغییرات
                </Button>
                <Button
                  disabled={isPending}
                  onClick={cancelActiveBoundary}
                  size="x-medium"
                  variant="neutral-outline"
                >
                  انصراف
                </Button>
                {selectedDraftPointIndex !== null ? (
                  <Button
                    disabled={isPending}
                    onClick={() => removeDraftPoint(selectedDraftPointIndex)}
                    size="x-medium"
                    variant="danger"
                  >
                    حذف نقطه
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="absolute bottom-4 left-4 z-[650]" dir="rtl">
            <Button onClick={toggleFullscreen} size="x-medium" variant="neutral-outline">
              {isFullscreen ? "خروج از تمام صفحه" : "تمام صفحه"}
            </Button>
          </div>

          {lastSnapNotice ? (
            <div className="pointer-events-none absolute bottom-5 left-1/2 z-[700] -translate-x-1/2 rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white shadow-lg">
              نقطه به نزدیک‌ترین مرز یا موقعیت مجاز منتقل شد
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
