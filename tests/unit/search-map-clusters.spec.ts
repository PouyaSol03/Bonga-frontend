import { expect, test } from "vitest";
import {
  buildClusterIndex,
  DEFAULT_CLUSTER_MAX_ZOOM,
  resolveClusterRenderItems,
} from "../../src/features/search/clusters/useSearchMapClusters";
import type { SearchMapListing } from "../../src/features/search/searchMapData";

function makeListing(id: number, latitude: number, longitude: number): SearchMapListing {
  return {
    id,
    title: `آگهی ${id}`,
    priceLabel: "قیمت",
    priceValue: "5,000,000,000",
    area: "100",
    rooms: "2",
    year: "1402",
    locationLabel: "تهران",
    postedAt: "امروز",
    images: [],
    imageSrc: "",
    latitude,
    longitude,
    category: "apartment",
    transaction: "sale",
  } as unknown as SearchMapListing;
}

const TEHRAN_BBOX: [number, number, number, number] = [51.0, 35.5, 51.8, 35.9];

test("opens the cluster containing selectedListingId while keeping other clusters collapsed", () => {
  const listings = [
    // Cluster A (nearby points)
    makeListing(1, 35.7, 51.4),
    makeListing(2, 35.7001, 51.4001),
    // Cluster B (far away from A, nearby each other)
    makeListing(3, 35.78, 51.48),
    makeListing(4, 35.7801, 51.4801),
  ];

  const clusterIndex = buildClusterIndex(listings);

  // Without selection at zoom 12, both groups are clustered
  const withoutSelection = resolveClusterRenderItems({
    clusterIndex,
    bbox: TEHRAN_BBOX,
    zoom: 12,
    selectedListingId: null,
  });
  expect(withoutSelection.filter((item) => item.isCluster)).toHaveLength(2);

  // With listing 1 selected at zoom 12, Cluster A opens to reveal listings 1 & 2, while Cluster B remains clustered
  const withSelection = resolveClusterRenderItems({
    clusterIndex,
    bbox: TEHRAN_BBOX,
    zoom: 12,
    selectedListingId: 1,
  });
  const clusters = withSelection.filter((item) => item.isCluster);
  const singles = withSelection.filter((item) => !item.isCluster);
  expect(clusters).toHaveLength(1);
  expect(singles.map((item) => item.id).sort()).toEqual([1, 2]);
});

test("renders all listings without clustering at DEFAULT_CLUSTER_MAX_ZOOM (14) and above", () => {
  const listings = [
    makeListing(10, 35.7, 51.4),
    makeListing(11, 35.7, 51.4),
    makeListing(12, 35.701, 51.401),
  ];

  const clusterIndex = buildClusterIndex(listings);
  const items = resolveClusterRenderItems({
    clusterIndex,
    bbox: TEHRAN_BBOX,
    zoom: DEFAULT_CLUSTER_MAX_ZOOM,
    selectedListingId: null,
  });

  expect(items.some((item) => item.isCluster)).toBe(false);
  expect(items).toHaveLength(3);
  // Overlapping same-spot listings (10 & 11) are fanned out to distinct coordinates
  const item10 = items.find((item) => item.id === 10)!;
  const item11 = items.find((item) => item.id === 11)!;
  expect(item10.latitude !== item11.latitude || item10.longitude !== item11.longitude).toBe(true);
});
