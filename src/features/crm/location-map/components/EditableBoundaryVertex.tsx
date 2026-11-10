import { useMemo } from "react";
import { divIcon, type LatLngTuple, type Map as LeafletMap, type Marker as LeafletMarker } from "leaflet";
import { Marker, useMap } from "react-leaflet";
import type { BoundaryItem } from "../types";
import { closestSnapPoint } from "../projections";

export function EditableBoundaryVertex({
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
  const icon = useMemo(
    () =>
      divIcon({
        className: "",
        html: `<span style="display:block;width:${selected ? 18 : 16}px;height:${selected ? 18 : 16}px;border-radius:9999px;border:3px solid ${color};background:${selected ? color : "#fff"};box-shadow:0 2px 8px rgba(26,26,26,.22);cursor:grab"></span>`,
        iconAnchor: [selected ? 9 : 8, selected ? 9 : 8],
        iconSize: [selected ? 18 : 16, selected ? 18 : 16],
      }),
    [color, selected],
  );

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
