import { useEffect, useRef } from "react";
import {
  polygon,
  polyline,
  type Map as LeafletMap,
  type Point,
  type Polygon,
  type Polyline,
} from "leaflet";
import { useMap } from "react-leaflet";
import {
  CLOSE_SNAP_DISTANCE_METERS,
  finalizeGeofenceDrawing,
  geographicDistanceMeters,
  MIN_CAPTURE_DISTANCE_PX,
  SIMPLIFY_TOLERANCE_METERS,
} from "./geofenceGeometry";
import {
  resolveFreehandPointerTermination,
  restoreMapDragging,
} from "./geofenceInteraction";
import type {
  DrawingState,
  GeofenceCoordinate,
  GeofenceResult,
  GeofenceValidationResult,
} from "./geofenceTypes";

type InvalidGeofenceResult = Exclude<
  GeofenceValidationResult,
  { isValid: true }
>;

type UseFreehandGeofenceOptions = {
  enabled: boolean;
  geofenceResult: GeofenceResult | null;
  displayMode?: "editing" | "confirmed";
  resetSignal: number;
  minCaptureDistancePx?: number;
  closeSnapDistanceMeters?: number;
  simplifyToleranceMeters?: number;
  onCancelled: () => void;
  onComplete: (result: GeofenceResult) => void;
  onInvalid: (validation: InvalidGeofenceResult) => void;
  onStateChange: (state: DrawingState) => void;
};

const TEMPORARY_LINE_OPTIONS = {
  color: "#0048c4",
  opacity: 0.95,
  weight: 4,
};

const TEMPORARY_POLYGON_OPTIONS = {
  color: "#0048c4",
  fillColor: "#0048c4",
  fillOpacity: 0.08,
  opacity: 0.55,
  weight: 2,
};

const FINAL_POLYGON_OPTIONS = {
  color: "#0048c4",
  fillColor: "#0048c4",
  fillOpacity: 0.14,
  opacity: 1,
  weight: 3,
};

const INVALID_POLYGON_OPTIONS = {
  color: "#d92d20",
  dashArray: "7 7",
  fillColor: "#d92d20",
  fillOpacity: 0.08,
  opacity: 1,
  weight: 3,
};

function toLeafletCoordinates(coordinates: GeofenceCoordinate[]) {
  return coordinates.map(([longitude, latitude]) => [latitude, longitude] as [number, number]);
}

function stopPointerEvent(event: PointerEvent) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
}

function isSupportedDrawingPointer(event: PointerEvent) {
  if (!event.isPrimary) return false;
  if (event.pointerType === "mouse" && event.button !== 0) return false;

  return true;
}

function ensurePolyline(map: LeafletMap, layerRef: { current: Polyline | null }) {
  if (!layerRef.current) {
    layerRef.current = polyline([], TEMPORARY_LINE_OPTIONS).addTo(map);
  }

  return layerRef.current;
}

function ensureTemporaryPolygon(
  map: LeafletMap,
  layerRef: { current: Polygon | null },
) {
  if (!layerRef.current) {
    layerRef.current = polygon([], TEMPORARY_POLYGON_OPTIONS).addTo(map);
  }

  return layerRef.current;
}

function ensureFinalPolygon(map: LeafletMap, layerRef: { current: Polygon | null }) {
  if (!layerRef.current) {
    layerRef.current = polygon([], FINAL_POLYGON_OPTIONS).addTo(map);
  }

  return layerRef.current;
}

function ensureInvalidPolygon(
  map: LeafletMap,
  layerRef: { current: Polygon | null },
) {
  if (!layerRef.current) {
    layerRef.current = polygon([], INVALID_POLYGON_OPTIONS).addTo(map);
  }

  return layerRef.current;
}

export function useFreehandGeofence({
  enabled,
  geofenceResult,
  displayMode = "editing",
  resetSignal,
  minCaptureDistancePx = MIN_CAPTURE_DISTANCE_PX,
  closeSnapDistanceMeters = CLOSE_SNAP_DISTANCE_METERS,
  simplifyToleranceMeters = SIMPLIFY_TOLERANCE_METERS,
  onCancelled,
  onComplete,
  onInvalid,
  onStateChange,
}: UseFreehandGeofenceOptions) {
  const map = useMap();
  const activePointerIdRef = useRef<number | null>(null);
  const rawCoordinatesRef = useRef<GeofenceCoordinate[]>([]);
  const lastAcceptedPointRef = useRef<Point | null>(null);
  const wasDraggingEnabledRef = useRef(true);
  const renderFrameRef = useRef<number | null>(null);
  const temporaryLineRef = useRef<Polyline | null>(null);
  const temporaryPolygonRef = useRef<Polygon | null>(null);
  const finalPolygonRef = useRef<Polygon | null>(null);
  const invalidPolygonRef = useRef<Polygon | null>(null);

  useEffect(() => {
    const finalLayer = ensureFinalPolygon(map, finalPolygonRef);

    // Preview and confirmed polygons are persistent React-Leaflet layers.
    // This hook only owns the temporary layer used during an active gesture.
    finalLayer.setLatLngs([]);
  }, [displayMode, geofenceResult, map]);

  useEffect(() => {
    temporaryLineRef.current?.setLatLngs([]);
    temporaryPolygonRef.current?.setLatLngs([]);
    invalidPolygonRef.current?.setLatLngs([]);
    if (!geofenceResult) {
      finalPolygonRef.current?.setLatLngs([]);
    }
    rawCoordinatesRef.current = [];
    lastAcceptedPointRef.current = null;
  }, [geofenceResult, resetSignal]);

  useEffect(() => {
    const container = map.getContainer();
    const previousTouchAction = container.style.touchAction;
    const previousUserSelect = container.style.userSelect;
    const previousCursor = container.style.cursor;

    function restoreDragging() {
      restoreMapDragging(wasDraggingEnabledRef.current, map.dragging);
    }

    function cancelAnimationFrameIfNeeded() {
      if (renderFrameRef.current !== null) {
        window.cancelAnimationFrame(renderFrameRef.current);
        renderFrameRef.current = null;
      }
    }

    function clearTemporaryLayers() {
      temporaryLineRef.current?.setLatLngs([]);
      temporaryPolygonRef.current?.setLatLngs([]);
    }

    function renderTemporaryPath() {
      renderFrameRef.current = null;
      const coordinates = rawCoordinatesRef.current;
      const leafletCoordinates = toLeafletCoordinates(coordinates);

      ensurePolyline(map, temporaryLineRef).setLatLngs(leafletCoordinates);

      if (coordinates.length >= 3) {
        ensureTemporaryPolygon(map, temporaryPolygonRef).setLatLngs(
          leafletCoordinates,
        );
      } else {
        temporaryPolygonRef.current?.setLatLngs([]);
      }
    }

    function scheduleTemporaryRender() {
      if (renderFrameRef.current !== null) return;
      renderFrameRef.current = window.requestAnimationFrame(renderTemporaryPath);
    }

    function getPointerCoordinate(event: PointerEvent): GeofenceCoordinate {
      const point = map.mouseEventToContainerPoint(event);
      const latLng = map.containerPointToLatLng(point);

      return [latLng.lng, latLng.lat];
    }

    function acceptPointerCoordinate(
      event: PointerEvent,
      options: { force?: boolean } = {},
    ) {
      const point = map.mouseEventToContainerPoint(event);
      const previousPoint = lastAcceptedPointRef.current;
      const distancePixels = previousPoint?.distanceTo(point) ?? Number.POSITIVE_INFINITY;

      if (
        !options.force &&
        distancePixels < minCaptureDistancePx
      ) {
        return;
      }

      const coordinate = getPointerCoordinate(event);
      const previousCoordinate = rawCoordinatesRef.current.at(-1);

      if (
        previousCoordinate &&
        geographicDistanceMeters(previousCoordinate, coordinate) <= 0.05
      ) {
        return;
      }

      rawCoordinatesRef.current.push(coordinate);
      lastAcceptedPointRef.current = point;
      scheduleTemporaryRender();
    }

    function releasePointerCapture(pointerId: number) {
      if (!container.hasPointerCapture(pointerId)) return;

      try {
        container.releasePointerCapture(pointerId);
      } catch {
        // The browser can release capture automatically before this cleanup runs.
      }
    }

    function resetPointerSession(pointerId: number) {
      activePointerIdRef.current = null;
      releasePointerCapture(pointerId);
      lastAcceptedPointRef.current = null;
      cancelAnimationFrameIfNeeded();
      restoreDragging();
    }

    function renderInvalidCoordinates(coordinates: GeofenceCoordinate[]) {
      const layer = ensureInvalidPolygon(map, invalidPolygonRef);
      layer.setLatLngs(toLeafletCoordinates(coordinates));
      layer.bringToFront();
    }

    function finishDrawing(event: PointerEvent) {
      const action = resolveFreehandPointerTermination(
        activePointerIdRef.current,
        event.pointerId,
        "pointerup",
      );
      if (action !== "finish") return;

      stopPointerEvent(event);
      acceptPointerCoordinate(event);
      const pointerId = event.pointerId;
      const capturedCoordinates = [...rawCoordinatesRef.current];
      resetPointerSession(pointerId);
      clearTemporaryLayers();

      const finalized = finalizeGeofenceDrawing(capturedCoordinates, {
        closeSnapDistanceMeters: closeSnapDistanceMeters,
        simplifyToleranceMeters: simplifyToleranceMeters,
      });

      if (!finalized.result) {
        renderInvalidCoordinates(capturedCoordinates);
        onInvalid(finalized.validation);
        return;
      }

      invalidPolygonRef.current?.setLatLngs([]);
      const finalLayer = ensureFinalPolygon(map, finalPolygonRef);
      finalLayer.setStyle(FINAL_POLYGON_OPTIONS);
      finalLayer.setLatLngs(
        toLeafletCoordinates(finalized.result.simplifiedCoordinates),
      );
      finalLayer.bringToFront();
      onComplete(finalized.result);
    }

    function cancelDrawing(
      eventType: "pointercancel" | "lostpointercapture" | "manual",
      event?: PointerEvent,
    ) {
      const activePointerId = activePointerIdRef.current;
      if (activePointerId === null) return;

      if (event && eventType !== "manual") {
        const action = resolveFreehandPointerTermination(
          activePointerId,
          event.pointerId,
          eventType,
        );
        if (action !== "cancel") return;
        stopPointerEvent(event);
      }

      resetPointerSession(activePointerId);
      clearTemporaryLayers();
      rawCoordinatesRef.current = [];
      onCancelled();
    }

    function handlePointerDown(event: PointerEvent) {
      if (!enabled || activePointerIdRef.current !== null) return;
      if (!isSupportedDrawingPointer(event)) return;

      stopPointerEvent(event);
      invalidPolygonRef.current?.setLatLngs([]);
      finalPolygonRef.current?.setLatLngs([]);
      rawCoordinatesRef.current = [];
      lastAcceptedPointRef.current = null;
      activePointerIdRef.current = event.pointerId;
      wasDraggingEnabledRef.current = map.dragging.enabled();
      map.dragging.disable();
      container.setPointerCapture(event.pointerId);
      onStateChange("drawing");
      acceptPointerCoordinate(event, { force: true });
    }

    function handlePointerMove(event: PointerEvent) {
      if (activePointerIdRef.current !== event.pointerId) return;

      stopPointerEvent(event);
      acceptPointerCoordinate(event);
    }

    function handlePointerCancel(event: PointerEvent) {
      cancelDrawing("pointercancel", event);
    }

    function handleLostPointerCapture(event: PointerEvent) {
      cancelDrawing("lostpointercapture", event);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || activePointerIdRef.current === null) return;

      event.preventDefault();
      cancelDrawing("manual");
    }

    container.addEventListener("pointerdown", handlePointerDown, true);
    container.addEventListener("pointermove", handlePointerMove, true);
    container.addEventListener("pointerup", finishDrawing, true);
    container.addEventListener("pointercancel", handlePointerCancel, true);
    container.addEventListener(
      "lostpointercapture",
      handleLostPointerCapture,
      true,
    );
    window.addEventListener("pointerup", finishDrawing, true);
    window.addEventListener("pointercancel", handlePointerCancel, true);
    window.addEventListener("keydown", handleKeyDown);

    if (enabled) {
      container.style.touchAction = "none";
      container.style.userSelect = "none";
      container.style.cursor = "crosshair";
    }

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown, true);
      container.removeEventListener("pointermove", handlePointerMove, true);
      container.removeEventListener("pointerup", finishDrawing, true);
      container.removeEventListener("pointercancel", handlePointerCancel, true);
      container.removeEventListener(
        "lostpointercapture",
        handleLostPointerCapture,
        true,
      );
      window.removeEventListener("pointerup", finishDrawing, true);
      window.removeEventListener("pointercancel", handlePointerCancel, true);
      window.removeEventListener("keydown", handleKeyDown);
      container.style.touchAction = previousTouchAction;
      container.style.userSelect = previousUserSelect;
      container.style.cursor = previousCursor;

      if (activePointerIdRef.current !== null) {
        const pointerId = activePointerIdRef.current;
        resetPointerSession(pointerId);
        clearTemporaryLayers();
      }
    };
  }, [
    closeSnapDistanceMeters,
    enabled,
    map,
    minCaptureDistancePx,
    onCancelled,
    onComplete,
    onInvalid,
    onStateChange,
    simplifyToleranceMeters,
  ]);

  useEffect(() => {
    if (enabled || activePointerIdRef.current === null) return;

    const pointerId = activePointerIdRef.current;
    activePointerIdRef.current = null;
    lastAcceptedPointRef.current = null;
    rawCoordinatesRef.current = [];
    temporaryLineRef.current?.setLatLngs([]);
    temporaryPolygonRef.current?.setLatLngs([]);

    if (map.getContainer().hasPointerCapture(pointerId)) {
      map.getContainer().releasePointerCapture(pointerId);
    }

    restoreMapDragging(wasDraggingEnabledRef.current, map.dragging);
  }, [enabled, map]);

  useEffect(
    () => () => {
      const layers = [
        temporaryLineRef.current,
        temporaryPolygonRef.current,
        finalPolygonRef.current,
        invalidPolygonRef.current,
      ];

      layers.forEach((layer) => {
        if (layer && map.hasLayer(layer)) map.removeLayer(layer);
      });
    },
    [map],
  );
}
