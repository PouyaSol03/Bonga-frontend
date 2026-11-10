import type { LatLngTuple, Map as LeafletMap } from "leaflet";
import { CircleMarker, Polygon } from "react-leaflet";
import type { BoundaryItem, EditTarget } from "../types";
import { MAIN_BOUNDARY_COLOR, getSubNeighborhoodColor } from "../constants";
import { getEdgeMidpoint } from "../geometry/pointUtils";
import { EditableBoundaryVertex } from "./EditableBoundaryVertex";

export function MapEditorOverlayLayers({
  boundaries,
  draftPoints,
  editTarget,
  onAddExactPoint,
  onInsertMidpoint,
  onMoveVertex,
  onPreviewMoveVertex,
  onSelectVertexIndex,
  selectedDraftPointIndex,
  snapBoundaries,
}: {
  boundaries: BoundaryItem[];
  draftPoints: LatLngTuple[];
  editTarget: EditTarget | null;
  onAddExactPoint: (point: LatLngTuple, adjusted: boolean) => void;
  onInsertMidpoint: (index: number, point: LatLngTuple) => void;
  onMoveVertex: (index: number, point: LatLngTuple, map: LeafletMap) => LatLngTuple | null;
  onPreviewMoveVertex: (index: number, point: LatLngTuple, map: LeafletMap) => LatLngTuple | null;
  onSelectVertexIndex: (index: number) => void;
  selectedDraftPointIndex: number | null;
  snapBoundaries: BoundaryItem[];
}) {
  if (!editTarget) return null;

  const targetColor =
    editTarget.kind === "sub-neighborhood"
      ? getSubNeighborhoodColor(`${editTarget.neighborhoodId}:${editTarget.subId}`)
      : MAIN_BOUNDARY_COLOR;

  return (
    <>
      {draftPoints.length >= 3 ? (
        <Polygon
          pathOptions={{
            color: targetColor,
            fillColor: targetColor,
            fillOpacity: 0.2,
            weight: 3,
          }}
          positions={draftPoints}
        />
      ) : null}

      {snapBoundaries.flatMap((boundary) =>
        boundary.points.map((point, index) => (
          <CircleMarker
            center={point}
            eventHandlers={{
              click: (event) => {
                event.originalEvent.stopPropagation();
                onAddExactPoint(point, true);
              },
            }}
            key={`snap:${boundary.id}:${index}`}
            pathOptions={{
              color: "#ffffff",
              fillColor: "#6f7b8d",
              fillOpacity: 1,
              weight: 2,
            }}
            radius={4}
          />
        )),
      )}

      {draftPoints.length >= 3
        ? draftPoints.map((point, index) => {
            const nextPoint = draftPoints[(index + 1) % draftPoints.length];
            const midpoint = getEdgeMidpoint(point, nextPoint);

            return (
              <CircleMarker
                center={midpoint}
                eventHandlers={{
                  click: (event) => {
                    event.originalEvent.stopPropagation();
                    onInsertMidpoint(index, midpoint);
                  },
                }}
                key={`edge-add:${index}:${midpoint[0]}:${midpoint[1]}`}
                pathOptions={{
                  color: "#ffffff",
                  fillColor: targetColor,
                  fillOpacity: 0.92,
                  weight: 2,
                }}
                radius={5}
              />
            );
          })
        : null}

      {draftPoints.map((point, index) => (
        <EditableBoundaryVertex
          boundaries={boundaries}
          color={targetColor}
          index={index}
          key={`draft:${index}`}
          onMove={onMoveVertex}
          onPreviewMove={onPreviewMoveVertex}
          onSelect={onSelectVertexIndex}
          point={point}
          selected={selectedDraftPointIndex === index}
        />
      ))}
    </>
  );
}
