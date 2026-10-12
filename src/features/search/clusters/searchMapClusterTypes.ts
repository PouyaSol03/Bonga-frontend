import type { SearchMapListing, SearchMapListingId } from "../searchMapData";

export interface SearchMapListingFeatureProps {
  cluster: false;
  listingId: SearchMapListingId;
  listing: SearchMapListing;
}

export type SearchMapPointFeature = GeoJSON.Feature<
  GeoJSON.Point,
  SearchMapListingFeatureProps
>;

export interface SearchMapClusterItem {
  id: string | number;
  latitude: number;
  longitude: number;
  isCluster: true;
  count: number;
}

export interface SearchMapSingleItem {
  id: SearchMapListingId;
  latitude: number;
  longitude: number;
  isCluster: false;
  listing: SearchMapListing;
}

export type SearchMapRenderItem = SearchMapClusterItem | SearchMapSingleItem;
