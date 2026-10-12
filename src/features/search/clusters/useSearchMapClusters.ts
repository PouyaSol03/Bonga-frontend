import { useMemo, useState } from "react";
import Supercluster from "supercluster";
import { useMap, useMapEvents } from "react-leaflet";
import type { SearchMapListing } from "../searchMapData";
import type {
  SearchMapListingFeatureProps,
  SearchMapPointFeature,
  SearchMapRenderItem,
} from "./searchMapClusterTypes";

interface UseSearchMapClustersOptions {
  listings: SearchMapListing[];
  radius?: number;
  maxZoom?: number;
  minPoints?: number;
}

function getBBox(map: ReturnType<typeof useMap>): [number, number, number, number] {
  const bounds = map.getBounds();
  return [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
}

export function useSearchMapClusters({
  listings,
  radius = 60,
  maxZoom = 17,
  minPoints = 2,
}: UseSearchMapClustersOptions): SearchMapRenderItem[] {
  const map = useMap();
  const [zoom, setZoom] = useState<number>(() => Math.round(map.getZoom()));
  const [bbox, setBBox] = useState<[number, number, number, number]>(() => getBBox(map));

  const clusterIndex = useMemo(() => {
    const index = new Supercluster<SearchMapListingFeatureProps>({
      radius,
      maxZoom,
      minPoints,
    });

    const points: SearchMapPointFeature[] = listings.map((listing) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [listing.longitude, listing.latitude],
      },
      properties: {
        cluster: false,
        listingId: listing.id,
        listing,
      },
    }));

    index.load(points);
    return index;
  }, [listings, radius, maxZoom, minPoints]);

  useMapEvents({
    moveend: () => {
      setZoom(Math.round(map.getZoom()));
      setBBox(getBBox(map));
    },
    zoomend: () => {
      setZoom(Math.round(map.getZoom()));
      setBBox(getBBox(map));
    },
  });

  return useMemo(() => {
    if (!clusterIndex || listings.length === 0) return [];

    const rawClusters = clusterIndex.getClusters(bbox, zoom);
    const results: SearchMapRenderItem[] = [];

    for (const item of rawClusters) {
      const [lng, lat] = item.geometry.coordinates;

      if (item.properties.cluster) {
        if (zoom >= maxZoom) {
          const leaves = clusterIndex.getLeaves(item.properties.cluster_id, Infinity);
          const leafCount = leaves.length;

          leaves.forEach((leaf, leafIndex) => {
            const angle = (leafIndex * 2 * Math.PI) / leafCount;
            const offsetDist = 0.00014;
            const leafLat = lat + offsetDist * Math.cos(angle);
            const leafLng = lng + offsetDist * Math.sin(angle);

            results.push({
              id: leaf.properties.listingId,
              latitude: leafLat,
              longitude: leafLng,
              isCluster: false,
              listing: leaf.properties.listing,
            });
          });
        } else {
          results.push({
            id: `cluster-${item.properties.cluster_id}`,
            latitude: lat,
            longitude: lng,
            isCluster: true,
            count: item.properties.point_count,
          });
        }
      } else {
        results.push({
          id: item.properties.listingId,
          latitude: lat,
          longitude: lng,
          isCluster: false,
          listing: item.properties.listing,
        });
      }
    }

    return results;
  }, [clusterIndex, bbox, zoom, listings.length, maxZoom]);
}
