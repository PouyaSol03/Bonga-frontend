import { useCallback, useMemo, useState } from "react";
import Supercluster from "supercluster";
import { useMap, useMapEvents } from "react-leaflet";
import type { SearchMapListing, SearchMapListingId } from "../searchMapData";
import type {
  SearchMapClusterItem,
  SearchMapListingFeatureProps,
  SearchMapPointFeature,
  SearchMapRenderItem,
  SearchMapSingleItem,
} from "./searchMapClusterTypes";

interface UseSearchMapClustersOptions {
  listings: SearchMapListing[];
  selectedListingId?: SearchMapListingId | null;
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

function fanOutOverlappingSingles(items: SearchMapRenderItem[]): SearchMapRenderItem[] {
  const singles = items.filter((item): item is SearchMapSingleItem => !item.isCluster);
  if (singles.length < 2) return items;

  const visited = new Set<number>();
  const groups: SearchMapSingleItem[][] = [];

  for (let i = 0; i < singles.length; i += 1) {
    if (visited.has(i)) continue;
    visited.add(i);
    const seed = singles[i];
    const group: SearchMapSingleItem[] = [seed];

    for (let j = i + 1; j < singles.length; j += 1) {
      if (visited.has(j)) continue;
      const candidate = singles[j];
      if (
        Math.abs(candidate.latitude - seed.latitude) < SAME_SPOT_THRESHOLD_DEG &&
        Math.abs(candidate.longitude - seed.longitude) < SAME_SPOT_THRESHOLD_DEG
      ) {
        visited.add(j);
        group.push(candidate);
      }
    }

    if (group.length > 1) {
      groups.push(group);
    }
  }

  if (groups.length === 0) return items;

  const adjustedCoords = new Map<string, { latitude: number; longitude: number }>();
  for (const group of groups) {
    const centerLat = group.reduce((sum, item) => sum + item.latitude, 0) / group.length;
    const centerLng = group.reduce((sum, item) => sum + item.longitude, 0) / group.length;
    group.forEach((item, index) => {
      const angle = (index * 2 * Math.PI) / group.length;
      adjustedCoords.set(String(item.id), {
        latitude: centerLat + FAN_OUT_RADIUS_DEG * Math.cos(angle),
        longitude: centerLng + FAN_OUT_RADIUS_DEG * Math.sin(angle),
      });
    });
  }

  return items.map((item) => {
    if (item.isCluster) return item;
    const override = adjustedCoords.get(String(item.id));
    return override ? { ...item, ...override } : item;
  });
}

export const DEFAULT_CLUSTER_MAX_ZOOM = 14;

export function buildClusterIndex(
  listings: SearchMapListing[],
  options: { radius?: number; maxZoom?: number; minPoints?: number } = {},
) {
  const { radius = 48, maxZoom = DEFAULT_CLUSTER_MAX_ZOOM, minPoints = 2 } = options;
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
}

export function resolveClusterRenderItems({
  clusterIndex,
  bbox,
  zoom,
  maxZoom = DEFAULT_CLUSTER_MAX_ZOOM,
  selectedListingId = null,
}: {
  clusterIndex: Supercluster<SearchMapListingFeatureProps>;
  bbox: [number, number, number, number];
  zoom: number;
  maxZoom?: number;
  selectedListingId?: SearchMapListingId | null;
}): SearchMapRenderItem[] {
  const rawClusters = clusterIndex.getClusters(bbox, zoom);
  const results: SearchMapRenderItem[] = [];
  const selectedKey = selectedListingId == null ? null : String(selectedListingId);

  for (const item of rawClusters) {
    const [lng, lat] = item.geometry.coordinates;

    if (item.properties.cluster) {
      const shouldInspectLeaves = zoom >= maxZoom || selectedKey !== null;
      const leaves = shouldInspectLeaves
        ? clusterIndex.getLeaves(item.properties.cluster_id, Infinity)
        : null;
      const containsSelected =
        selectedKey !== null &&
        leaves !== null &&
        leaves.some((leaf) => String(leaf.properties.listingId) === selectedKey);

      if (zoom >= maxZoom || containsSelected) {
        for (const leaf of leaves ?? []) {
          const [origLng, origLat] = leaf.geometry.coordinates;
          results.push({
            id: leaf.properties.listingId,
            latitude: origLat,
            longitude: origLng,
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

  return fanOutOverlappingSingles(results);
}

export function useSearchMapClusters({
  listings,
  selectedListingId = null,
  radius = 48,
  maxZoom = DEFAULT_CLUSTER_MAX_ZOOM,
  mapMaxZoom = 19,
  minPoints = 2,
}: UseSearchMapClustersOptions): UseSearchMapClustersResult {
  const map = useMap();
  const [zoom, setZoom] = useState<number>(() => Math.round(map.getZoom()));
  const [bbox, setBBox] = useState<[number, number, number, number]>(() => getBBox(map));

  const clusterIndex = useMemo(
    () => buildClusterIndex(listings, { radius, maxZoom, minPoints }),
    [listings, radius, maxZoom, minPoints],
  );

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
    return resolveClusterRenderItems({
      clusterIndex,
      bbox,
      zoom,
      maxZoom,
      selectedListingId,
    });
  }, [clusterIndex, bbox, zoom, listings.length, maxZoom, selectedListingId]);

  return { items, zoom, expandCluster };
}
