import type { AdvertisementItem } from "../../advertisements/api/advertisement.service";
import type { AgencySort } from "./agency-public.types";

export type PublicAgentAgencySummary = {
  address?: string;
  id?: string;
  logo?: string;
  name?: string;
};

export type PublicAgentListDto = {
  agencyId?: string;
  agency?: PublicAgentAgencySummary;
  avatar?: string;
  family?: string;
  fullName: string;
  id: string;
  levelSlug?: string;
  levelTitle?: string;
  mobile?: string;
  name?: string;
  rank?: number;
  role?: string;
  score?: number;
  status?: string;
  userId?: string;
};

export type PublicAgentsPage = {
  data: PublicAgentListDto[];
  hasNextPage: boolean;
  page: number;
  perPage: number;
  total: number;
};

export type PublicAgentListParams = {
  agencyId?: number | string;
  page?: number;
  perPage?: number;
  search?: string;
  sort?: AgencySort;
};

export type PublicAgentDetailDto = {
  active_advertises_count: number;
  about_us?: string;
  agencyId?: string;
  agency?: PublicAgentAgencySummary;
  avatar?: string;
  id: string;
  instagram?: string;
  level_slug?: string;
  level_title?: string;
  mobile?: string;
  name: string;
  neighborhood_ids: string[];
  rank: number;
  recent_advertises: AdvertisementItem[];
  role?: string;
  score: number;
  status?: string;
  telegram?: string;
  userId?: string;
  whatsapp?: string;
};

export type PublicAgentListApiItem = {
  _id?: unknown;
  agency?: unknown;
  agency_id?: unknown;
  avatar?: unknown;
  family?: unknown;
  full_name?: unknown;
  id?: unknown;
  level_slug?: unknown;
  level_title?: unknown;
  mobile?: unknown;
  name?: unknown;
  phonenumber?: unknown;
  rank?: unknown;
  role?: unknown;
  score?: unknown;
  status?: unknown;
  user_id?: unknown;
};

export type PublicAgentsApiResponse = {
  data?: PublicAgentListApiItem[];
  page?: unknown;
  per_page?: unknown;
  status?: boolean;
  total?: unknown;
};

export type PublicAgentDetailApiResponse = {
  agent?: Record<string, unknown>;
  consultant?: Record<string, unknown>;
  data?: Record<string, unknown>;
  status?: boolean;
};
