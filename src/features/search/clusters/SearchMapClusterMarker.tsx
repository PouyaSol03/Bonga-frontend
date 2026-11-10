import { memo, useMemo } from "react";
import { DivIcon, DomEvent } from "leaflet";
import { Marker } from "react-leaflet";
import { toPersianNumber } from "../../../shared/lib/numberUtils";
import type { SearchMapClusterItem } from "./searchMapClusterTypes";

interface SearchMapClusterMarkerProps {
  cluster: SearchMapClusterItem;
  onSelect: (cluster: SearchMapClusterItem) => void;
}

const CLUSTER_HIT_AREA_SIZE: [number, number] = [44, 44];

function resolveClusterBadgeClass(count: number): string {
  if (count < 10) {
    return "search-map-cluster-marker--small";
  }
  if (count < 50) {
    return "search-map-cluster-marker--medium";
  }
  return "search-map-cluster-marker--large";
}

function createClusterIcon(count: number): DivIcon {
  const sizeClass = resolveClusterBadgeClass(count);
  const formattedCount = toPersianNumber(count);

  return new DivIcon({
    className: "search-map-marker-wrapper search-map-marker-wrapper--cluster",
    html: `
      <div class="search-map-cluster-hit-area">
        <div class="search-map-cluster-marker ${sizeClass}">
          <span>${formattedCount}</span>
        </div>
      </div>
    `,
    iconSize: CLUSTER_HIT_AREA_SIZE,
    iconAnchor: [CLUSTER_HIT_AREA_SIZE[0] / 2, CLUSTER_HIT_AREA_SIZE[1] / 2],
  });
}

function SearchMapClusterMarkerComponent({ cluster, onSelect }: SearchMapClusterMarkerProps) {
  const icon = useMemo(() => createClusterIcon(cluster.count), [cluster.count]);

  return (
    <Marker
      position={[cluster.latitude, cluster.longitude]}
      icon={icon}
      zIndexOffset={2000}
      eventHandlers={{
        click: (event) => {
          if (event.originalEvent) {
            DomEvent.stop(event.originalEvent);
          }
          onSelect(cluster);
        },
      }}
    />
  );
}

export const SearchMapClusterMarker = memo(SearchMapClusterMarkerComponent);
