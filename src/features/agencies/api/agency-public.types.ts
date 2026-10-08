import type { AdvertisementItem } from "../../advertisements/api/advertisement.service";
import type { AgencyConsultantDto } from "./agency-consultants-types";

export type AgencySort = "score" | "rank" | "newest" | "oldest";

export type PublicAgencyDto = {
  address?: string;
  created_at?: string;
  id: string;
  img?: string;
  lat?: number;
  level_slug?: string;
  lng?: number;
  logo?: string;
  name: string;
  neighborhood_ids: string[];
  rank: number;
  score: number;
};

export type PublicAgencyPage = {
  data: PublicAgencyDto[];
  hasNextPage: boolean;
  page: number;
  perPage: number;
  total: number;
};

export type PublicAgencyListParams = {
  neighborhoodId?: string;
  page?: number;
  perPage?: number;
  search?: string;
  sort?: AgencySort;
};

export type PublicAgencyDetailDto = PublicAgencyDto & {
  active_advertises_count: number;
  about_us?: string;
  agency_type?: number;
  consultants: AgencyConsultantDto[];
  instagram?: string;
  phone1?: string;
  phone2?: string;
  phone3?: string;
  recent_advertises: AdvertisementItem[];
  telegram?: string;
  whatsapp?: string;
  working_hours?: string;
};

export type PublicAgencyApiItem = {
  address?: unknown;
  created_at?: unknown;
  id?: unknown;
  _id?: unknown;
  img?: unknown;
  lat?: unknown;
  level_slug?: unknown;
  lng?: unknown;
  logo?: unknown;
  name?: unknown;
  neighborhood_ids?: unknown;
  rank?: unknown;
  score?: unknown;
};

export type PublicAgencyApiResponse = {
  data?: PublicAgencyApiItem[];
  page?: unknown;
  per_page?: unknown;
  status?: boolean;
  total?: unknown;
};

export type PublicAgencyDetailApiResponse = {
  agency?: Record<string, unknown>;
  data?: Record<string, unknown>;
  status?: boolean;
};
