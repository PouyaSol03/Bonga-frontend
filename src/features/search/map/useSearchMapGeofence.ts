import { useCallback, useMemo, useState } from "react";
import type {
  DrawingState,
  GeofenceResult,
} from "../geofence/geofenceTypes";
import { serializeGeofenceForApi } from "../geofence/geofenceApi";
import type {
  GeofenceHistoryEntry,
  InvalidGeofenceResult,
  SearchMapMode,
} from "./types";

interface UseSearchMapGeofenceOptions {
  setMapResizeSignal: React.Dispatch<React.SetStateAction<number>>;
  setMode: (mode: SearchMapMode) => void;
  setSelectedListingId: (id: string | number | null) => void;
}

export function useSearchMapGeofence({
  setMapResizeSignal,
  setMode,
  setSelectedListingId,
}: UseSearchMapGeofenceOptions) {
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [drawingState, setDrawingState] = useState<DrawingState>("idle");
  const [geofenceResult, setGeofenceResult] = useState<GeofenceResult | null>(null);
  const [geofenceError, setGeofenceError] = useState<string | null>(null);
  const [geofenceHistory, setGeofenceHistory] = useState<GeofenceHistoryEntry | null>(null);
  const [geofenceResetSignal, setGeofenceResetSignal] = useState(0);

  const confirmedGeofence = useMemo(
    () =>
      drawingState === "confirmed" && geofenceResult
        ? serializeGeofenceForApi(geofenceResult)
        : undefined,
    [drawingState, geofenceResult],
  );

  const isGeofenceConfirmed = drawingState === "confirmed" && geofenceResult !== null;

  const startFreehandDrawing = useCallback(() => {
    if (geofenceResult) {
      setGeofenceHistory({
        result: geofenceResult,
        state: drawingState === "confirmed" ? "confirmed" : "preview",
      });
    } else if (drawingState !== "invalid") {
      setGeofenceHistory(null);
    }

    setSelectedListingId(null);
    setMode("map");
    setGeofenceResult(null);
    setGeofenceError(null);
    setDrawingState("idle");
    setGeofenceResetSignal((current) => current + 1);
    setMapResizeSignal((current) => current + 1);
    setIsDrawMode(true);
  }, [drawingState, geofenceResult, setMapResizeSignal, setMode, setSelectedListingId]);

  const cancelFreehandDrawing = useCallback(() => {
    setIsDrawMode(false);
    setGeofenceError(null);
    setGeofenceResetSignal((current) => current + 1);
    setMapResizeSignal((current) => current + 1);

    if (geofenceHistory) {
      setGeofenceResult(geofenceHistory.result);
      setDrawingState(geofenceHistory.state);
      setGeofenceHistory(null);
    } else {
      setGeofenceResult(null);
      setDrawingState("idle");
    }
  }, [geofenceHistory, setMapResizeSignal]);

  const handleGeofenceComplete = useCallback((result: GeofenceResult) => {
    setGeofenceResult(result);
    setGeofenceError(null);
    setDrawingState("preview");
    setIsDrawMode(false);
  }, []);

  const handleGeofenceInvalid = useCallback((validation: InvalidGeofenceResult) => {
    setGeofenceResult(null);
    setGeofenceError(validation.message);
    setDrawingState("invalid");
    setIsDrawMode(false);
  }, []);

  const deleteGeofenceAndRedraw = useCallback(() => {
    setDrawingState("idle");
    setGeofenceResult(null);
    setGeofenceError(null);
    setGeofenceHistory(null);
    setGeofenceResetSignal((current) => current + 1);
    setIsDrawMode(true);
  }, []);

  const confirmGeofence = useCallback(() => {
    if (!geofenceResult) return;

    setDrawingState("confirmed");
    setIsDrawMode(false);
    setGeofenceHistory(null);
    setMapResizeSignal((current) => current + 1);
    window.dispatchEvent(
      new CustomEvent<GeofenceResult>("search:geofence:confirmed", {
        detail: geofenceResult,
      }),
    );
  }, [geofenceResult, setMapResizeSignal]);

  const clearConfirmedGeofence = useCallback(() => {
    setDrawingState("idle");
    setGeofenceResult(null);
    setGeofenceError(null);
    setGeofenceHistory(null);
    setGeofenceResetSignal((current) => current + 1);
    setIsDrawMode(false);
  }, []);

  return {
    clearConfirmedGeofence,
    confirmGeofence,
    confirmedGeofence,
    deleteGeofenceAndRedraw,
    drawingState,
    geofenceError,
    geofenceResetSignal,
    geofenceResult,
    handleGeofenceComplete,
    handleGeofenceInvalid,
    isDrawMode,
    isGeofenceConfirmed,
    cancelFreehandDrawing,
    setDrawingState,
    startFreehandDrawing,
  };
}
