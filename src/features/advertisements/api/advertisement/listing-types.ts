import { type AdvertisementItem } from "./item-types";

export type PaginationMeta = {
  current_page?: number;
  last_page?: number;
  page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
};

export type AdvertisementListResponse =
  | {
      data?: AdvertisementItem[];
      has_more?: boolean;
      meta?: PaginationMeta;
      page?: number;
      pagination?: PaginationMeta;
      per_page?: number;
      status?: boolean;
      total?: number;
    }
  | AdvertisementItem[];

export type TopViewedAdvertisementsResponse =
  | {
      data?: AdvertisementItem[];
      status?: boolean;
    }
  | AdvertisementItem[];

export type AdvertisementMapBounds = {
  east: number;
  north: number;
  south: number;
  west: number;
};

export type AdvertisementMapParams = AdvertisementMapBounds & {
  cityId?: string;
  filters?: AdvertisementSearchFilters;
  geofence?: string;
  limit?: number;
};

export type AdvertisementMapResponse =
  | {
      advertises?: AdvertisementItem[];
      data?: unknown;
      items?: AdvertisementItem[];
      list?: AdvertisementItem[];
      result?: unknown;
      results?: AdvertisementItem[];
      status?: boolean;
    }
  | AdvertisementItem[];

export type AdvertisementListParams = {
  cityId?: string;
  filters?: AdvertisementSearchFilters;
  page?: number;
  perPage?: number;
};

export type AdvertisementSearchFilters = {
  areaMax?: string | number;
  areaMin?: string | number;
  buildingAge?: string;
  categoryId?: string;
  floor?: string;
  formCode?: string;
  hasImage?: boolean | string;
  hasVideo?: boolean | string;
  isSpecial?: boolean | string;
  neighborhoodId?: string;
  priceMax?: string | number;
  priceMin?: string | number;
  publishedAt?: string;
  query?: string;
  rooms?: string;
  featureFilters?: Record<string, boolean | number | string>;
};

export type AdvertisementPage = {
  data: AdvertisementItem[];
  hasNextPage: boolean;
  page: number;
  total: number;
};

export type AdvertisementCardData = {
  id: number | string;
  title: string;
  agency: string;
  status: string;
  imageCount: string;
  priceLabelPrimary: string;
  pricePrimary: string;
  priceLabelSecondary: string;
  priceSecondary: string;
  area: string;
  rooms: string;
  year: string;
  landArea?: string;
  documentType?: string;
  commercialPosition?: string;
  landPosition?: string;
  floor?: string;
  buildingArea?: string;
  capacity?: string;
  stars?: string;
  rentalPeriod?: string;
  projectType?: string;
  totalFloors?: string;
  totalUnits?: string;
  builderShare?: string;
  currentStatus?: string;
  category?: string;
  formCode?: string;
  timeAndLocation: string;
  imageClassName: string;
  imageUrl?: string;
  badges: string[];
};
