import { Polygon } from "react-leaflet";
import type { BoundaryItem, EditTarget } from "../types";
import {
  MAIN_BOUNDARY_COLOR,
  MUTED_BOUNDARY_COLOR,
  SUB_BOUNDARY_COLOR,
  getSubNeighborhoodColor,
} from "../constants";

export function MapBoundariesLayer({
  activeBoundaryId,
  boundaries,
  editTarget,
  onSelectBoundary,
  selectedNeighborhoodId,
  selectedSubId,
}: {
  activeBoundaryId: string;
  boundaries: BoundaryItem[];
  editTarget: EditTarget | null;
  onSelectBoundary: (neighborhoodId: string, subId: string) => void;
  selectedNeighborhoodId: string;
  selectedSubId: string;
}) {
  return (
    <>
      {boundaries.map((boundary) => {
        if (boundary.id === activeBoundaryId) return null;

        const isSelected =
          boundary.kind === "neighborhood"
            ? selectedNeighborhoodId === boundary.neighborhoodId && !selectedSubId
            : selectedNeighborhoodId === boundary.neighborhoodId &&
              selectedSubId === boundary.subId;

        const isParentOfSelectedSub =
          boundary.kind === "neighborhood" &&
          selectedNeighborhoodId === boundary.neighborhoodId &&
          Boolean(selectedSubId);

        const subNeighborhoodColor =
          boundary.kind === "sub-neighborhood"
            ? getSubNeighborhoodColor(
                `${boundary.neighborhoodId}:${boundary.subId ?? boundary.name}`,
              )
            : null;

        const color =
          boundary.kind === "sub-neighborhood"
            ? (subNeighborhoodColor ?? SUB_BOUNDARY_COLOR)
            : isSelected || isParentOfSelectedSub
              ? MAIN_BOUNDARY_COLOR
              : MUTED_BOUNDARY_COLOR;

        return (
          <Polygon
            eventHandlers={
              editTarget
                ? undefined
                : {
                    click: (event) => {
                      event.originalEvent.stopPropagation();
                      onSelectBoundary(boundary.neighborhoodId, boundary.subId ?? "");
                    },
                  }
            }
            interactive={!editTarget}
            key={boundary.id}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: isSelected
                ? 0.2
                : isParentOfSelectedSub
                  ? 0.07
                  : boundary.kind === "sub-neighborhood"
                    ? 0.11
                    : 0.05,
              opacity: isSelected
                ? 1
                : isParentOfSelectedSub
                  ? 0.55
                  : boundary.kind === "sub-neighborhood"
                    ? 0.82
                    : 0.65,
              weight: isSelected
                ? 3
                : isParentOfSelectedSub
                  ? 2.5
                  : boundary.kind === "sub-neighborhood"
                    ? 2.25
                    : 2,
            }}
            positions={boundary.points}
          />
        );
      })}
    </>
  );
}
