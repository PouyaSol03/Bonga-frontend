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
  priceSecondary?: string;
  landArea?: string;
  documentType?: string;
  commercialPosition?: string;
  landPosition?: string;
  floor?: string;
  buildingArea?: string;
  capacity?: string;
  stars?: string;
  rentalPeriod?: string;
  category?: string;
  formCode?: string;
  projectType?: string;
  totalFloors?: string;
  totalUnits?: string;
  builderShare?: string;
  currentStatus?: string;
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
  className: string;
};

export const searchMapTileConfig: SearchMapTileConfig = {
  urlTemplate: "https://map.exirfirm.com/tile/{z}/{x}/{y}.png",
  attribution: "© Exir Map",
  minZoom: 6,
  maxZoom: 19,
  isTms: false,
  // The tile server publishes a light basemap only, so dark mode tints the
  // raster tiles whenever the app root carries the `dark` class.
  className:
    "[.dark_&]:[filter:grayscale(0.86)_invert(1)_brightness(1.06)_contrast(0.94)]",
};

export const searchMapCenter: SearchMapCenter = {
  latitude: defaultSelectedCity.latitude,
  longitude: defaultSelectedCity.longitude,
  zoom: 15,
};
