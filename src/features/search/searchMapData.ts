import { defaultSelectedCity } from "../../shared/lib/selectedCityStorage";

export type SearchFilterChip = {
  id: string;
  label: string;
  isActive?: boolean;
  removable?: boolean;
};

export type SearchMapListingId = number | string;

export type SearchMapListing = {
  id: SearchMapListingId;
  dotId: string;
  title: string;
  priceLabel: string;
  priceValue: string;
  priceUnit?: string;
  latitude: number;
  longitude: number;
  area: string;
  rooms: string;
  year: string;
  locationLabel: string;
  postedAt: string;
  agencyName: string;
  badges?: string[];
  imageSrc?: string;
  images: string[];
  showPriceMarker?: boolean;
  imageClassName?: string;
};

export type SearchMapDotMarker = {
  id: string;
  listingId: SearchMapListingId;
  latitude: number;
  longitude: number;
};

export type SearchMapCenter = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type SearchMapBounds = {
  east: number;
  north: number;
  south: number;
  west: number;
};

export type SearchMapTileConfig = {
  urlTemplate: string;
  attribution: string;
  minZoom?: number;
  maxZoom?: number;
  isTms: boolean;
};

export const searchMapTileConfig: SearchMapTileConfig = {
  urlTemplate: "https://map.exirfirm.com/tile/{z}/{x}/{y}.png",
  attribution: "© Exir Map",
  minZoom: 6,
  maxZoom: 19,
  isTms: false,
};

export const searchMapCenter: SearchMapCenter = {
  latitude: defaultSelectedCity.latitude,
  longitude: defaultSelectedCity.longitude,
  zoom: 15,
};
