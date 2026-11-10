import { useCallback, useMemo, useState } from "react";
import Supercluster from "supercluster";
import { useMap, useMapEvents } from "react-leaflet";
import type { SearchMapListing } from "../searchMapData";
import type {
  SearchMapClusterItem,
  SearchMapListingFeatureProps,
  SearchMapPointFeature,
  SearchMapRenderItem,
} from "./searchMapClusterTypes";

interface UseSearchMapClustersOptions {
  listings: SearchMapListing[];
  radius?: number;
  maxZoom?: number;
  mapMaxZoom?: number;
  minPoints?: number;
}

interface UseSearchMapClustersResult {
  items: SearchMapRenderItem[];
  zoom: number;
  expandCluster: (cluster: SearchMapClusterItem) => void;
}

const SAME_SPOT_THRESHOLD_DEG = 0.00008;
const FAN_OUT_RADIUS_DEG = 0.00014;

function getBBox(map: ReturnType<typeof useMap>): [number, number, number, number] {
  const bounds = map.getBounds();
  return [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
}

export function useSearchMapClusters({
  listings,
  radius = 48,
  maxZoom = 16,
  mapMaxZoom = 19,
  minPoints = 2,
}: UseSearchMapClustersOptions): UseSearchMapClustersResult {
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

  const expandCluster = useCallback(
    (cluster: SearchMapClusterItem) => {
      const expansionZoom = clusterIndex.getClusterExpansionZoom(cluster.clusterId);
      const nextZoom = Math.min(Math.max(expansionZoom, zoom + 1), mapMaxZoom);
      map.setView([cluster.latitude, cluster.longitude], nextZoom, {
        animate: true,
      });
    },
    [clusterIndex, map, mapMaxZoom, zoom],
  );

  const items = useMemo(() => {
    if (!clusterIndex || listings.length === 0) return [];

    const rawClusters = clusterIndex.getClusters(bbox, zoom);
    const results: SearchMapRenderItem[] = [];

    for (const item of rawClusters) {
      const [lng, lat] = item.geometry.coordinates;

      if (item.properties.cluster) {
        if (zoom >= maxZoom) {
          const leaves = clusterIndex.getLeaves(item.properties.cluster_id, Infinity);
          const stackedLeaves = leaves.filter((leaf) => {
            const [leafLng, leafLat] = leaf.geometry.coordinates;
            return (
              Math.abs(leafLat - lat) < SAME_SPOT_THRESHOLD_DEG &&
              Math.abs(leafLng - lng) < SAME_SPOT_THRESHOLD_DEG
            );
          });
          let stackedIndex = 0;

          for (const leaf of leaves) {
            const [origLng, origLat] = leaf.geometry.coordinates;
            const isStacked =
              stackedLeaves.length > 1 &&
              Math.abs(origLat - lat) < SAME_SPOT_THRESHOLD_DEG &&
              Math.abs(origLng - lng) < SAME_SPOT_THRESHOLD_DEG;

            let leafLat = origLat;
            let leafLng = origLng;

            if (isStacked) {
              const angle = (stackedIndex * 2 * Math.PI) / stackedLeaves.length;
              leafLat = lat + FAN_OUT_RADIUS_DEG * Math.cos(angle);
              leafLng = lng + FAN_OUT_RADIUS_DEG * Math.sin(angle);
              stackedIndex += 1;
            }

            results.push({
              id: leaf.properties.listingId,
              latitude: leafLat,
              longitude: leafLng,
              isCluster: false,
              listing: leaf.properties.listing,
            });
          }
        } else {
          results.push({
            id: `cluster-${item.properties.cluster_id}`,
            clusterId: item.properties.cluster_id,
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

  return { items, zoom, expandCluster };
}
