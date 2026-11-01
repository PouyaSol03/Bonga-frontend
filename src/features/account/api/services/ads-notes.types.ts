import type { ApiListResponse } from "../../../../shared/api/response";
import type { AdvertisementItem } from "../../../advertisements/api/advertisement.service";

export type MyAdsType =
  | "all"
  | "active"
  | "deactive"
  | "pending"
  | "wait_for_payment"
  | "incomplete";

export type MyAdsPage = {
  data: AdvertisementItem[];
  hasNextPage: boolean;
  page: number;
  perPage: number;
  total: number;
};

export type BadgeItem = Record<string, unknown> & {
  active?: boolean;
  ad?: AdvertisementItem;
  advertise?: AdvertisementItem;
  advertisement?: AdvertisementItem;
  advertise_id?: string | number;
  advertiseId?: string | number;
  image?: string;
  logo?: string;
  name?: string;
  progress?: number | string;
  slug?: string;
};

export type AdvertiseBadgesPage = {
  adsIds: string[];
  data: BadgeItem[];
  hasNextPage: boolean;
  page: number;
  perPage: number;
  total: number;
};

export type AdvertiseBadgesResponse =
  | {
      AdsIds?: Array<string | number>;
      advertises?: BadgeItem[];
      advertisesTemp?: BadgeItem[];
      data?: BadgeItem[];
      page?: number;
      per_page?: number;
      status?: boolean;
      total?: number;
    }
  | BadgeItem[];

export type NoteItem = Record<string, unknown> & {
  _id?: number | string;
  ad?: AdvertisementItem;
  advertise?: AdvertisementItem;
  advertisement?: AdvertisementItem;
  advertise_id?: number | string;
  advertiseId?: number | string;
  created_at?: string;
  description?: string;
  id?: number | string;
  note?: string;
  noteId?: number | string;
  text?: string;
  updated_at?: string;
};

export type SaveAdvertiseNotePayload = {
  advertiseId: string;
  note: string;
};

export type UpdateAdvertiseNotePayload = {
  noteId: string;
  note: string;
};

export type MyNotesResponse =
  | ApiListResponse<NoteItem>
  | {
      data?: NoteItem[];
      notes?: NoteItem[];
      advertises?: NoteItem[];
      status?: boolean;
    }
  | NoteItem[];

export type MyAdsResponse =
  | ApiListResponse<AdvertisementItem>
  | {
      advertises?: AdvertisementItem[];
      data?: AdvertisementItem[];
      page?: number;
      per_page?: number;
      status?: boolean;
      total?: number;
    };

export type UpdateProfilePayload = {
  avatar?: File | null;
  email?: string | null;
  family?: string | null;
  instagram?: string | null;
  name?: string | null;
  neighborhood_ids?: string[];
  phone?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
};

export type AuthorizePayload = {
  nationalnumber: string;
};

export interface TransferSimOwnershipPayload {
  reason?: string;
  description?: string;
}
