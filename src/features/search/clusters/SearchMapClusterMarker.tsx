import { memo, useMemo } from "react";
import { DivIcon, DomEvent } from "leaflet";
import { Marker } from "react-leaflet";
import { toPersianNumber } from "../../../shared/lib/numberUtils";
import type { SearchMapClusterItem } from "./searchMapClusterTypes";

interface SearchMapClusterMarkerProps {
  cluster: SearchMapClusterItem;
}

function resolveClusterBadgeClass(count: number): {
  sizeClass: string;
  size: [number, number];
} {
  if (count < 10) {
    return {
      sizeClass: "search-map-cluster-marker--small",
      size: [36, 36],
    };
  }
  if (count < 50) {
    return {
      sizeClass: "search-map-cluster-marker--medium",
      size: [42, 42],
    };
  }
  return {
    sizeClass: "search-map-cluster-marker--large",
    size: [48, 48],
  };
}

function createClusterIcon(count: number): DivIcon {
  const { sizeClass, size } = resolveClusterBadgeClass(count);
  const formattedCount = toPersianNumber(count);

  return new DivIcon({
    className: "search-map-marker-wrapper search-map-marker-wrapper--cluster",
    html: `
      <div class="search-map-cluster-marker ${sizeClass}">
        <span>${formattedCount}</span>
      </div>
    `,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
  });
}

function SearchMapClusterMarkerComponent({ cluster }: SearchMapClusterMarkerProps) {
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
        },
      }}
    />
  );
}

export const SearchMapClusterMarker = memo(SearchMapClusterMarkerComponent);
