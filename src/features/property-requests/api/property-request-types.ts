import type {
  AdvertisementItem,
} from "../../advertisements/api/advertisement.service";

export type PropertyRequestOwnerType = "agency" | "user" | "agency-consultant";

export type PropertyRequestFilterValue =
  | boolean
  | number
  | string
  | Array<number | string>;

export type PropertyRequestApiFilter = {
  field: string;
  value: PropertyRequestFilterValue;
};

export type PropertyRequestQuota = {
  limit: number;
  remaining: number;
  used: number;
};

export type PropertySearchRequest = {
  adId?: number | string | null;
  agenciesId?: Array<number | string>;
  createdAt: string;
  filters: Record<string, string>;
  id: string;
  isNew?: boolean;
  myAgencyId?: number | string | null;
  senderLabel: string;
  senderRole: string;
  title: string;
  updatedAt?: string;
  userId?: number | string | null;
};

export type PropertyRequestCreateInput = {
  filters: PropertyRequestApiFilter[] | Record<string, string>;
  name: string;
  owner_type?: PropertyRequestOwnerType | "agent";
};

export type PropertyRequestCreateResult = {
  quota: PropertyRequestQuota;
  request: PropertySearchRequest;
  status: boolean;
};

export type PropertyRequestPage = {
  data: PropertySearchRequest[];
  hasMore: boolean;
  ownerType: PropertyRequestOwnerType;
  page: number;
  perPage: number;
  quota: PropertyRequestQuota;
  registeredCount: number;
  remaining: number;
  requestLimit: number;
  total: number;
};

export type PropertyRequestMatchesPage = {
  data: AdvertisementItem[];
  hasMore: boolean;
  page: number;
  perPage: number;
  total: number;
};

export type PropertyRequestScope = {
  apiVersion: "v1" | "v2";
  basePath: string;
  ownerType: PropertyRequestOwnerType;
  roleSegment: string;
};
