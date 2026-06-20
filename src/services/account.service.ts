import { api, getApiAssetUrl } from "../api/api";
import type { ApiDataResponse, ApiListResponse } from "../api/response";
import { unwrapList } from "../api/response";
import type { AdvertisementItem } from "./advertisement.service";

export type UserProfile = {
  _id?: string;
  authorized?: boolean | number | string;
  authorize_date?: string | null;
  avatar?: string | null;
  email?: string;
  family?: string;
  id?: string | number;
  mobile?: string;
  name?: string;
  nationalnumber?: string;
  phone?: string;
};

export type UpdateProfilePayload = {
  email: string;
  family: string;
  name: string;
  nationalnumber: string;
};

export type AuthorizePayload = {
  nationalnumber: string;
};

export type WalletPayment = Record<string, unknown> & {
  amount?: number | string;
  created_at?: string;
  id?: number | string;
  status?: string;
  tracking_code?: string;
};

export type WalletPaymentsResult = {
  balance?: number | string;
  payments: WalletPayment[];
};

export type MyAdsType = "all" | "active" | "deactive" | "pending";

export type AdvertiseBadgesPage = {
  adsIds: string[];
  data: BadgeItem[];
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

type AdvertiseBadgesResponse =
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

type MyNotesResponse =
  | ApiListResponse<NoteItem>
  | {
      data?: NoteItem[];
      notes?: NoteItem[];
      advertises?: NoteItem[];
      status?: boolean;
    }
  | NoteItem[];

function getNestedValue(source: unknown, keys: string[]) {
  if (!source || typeof source !== "object") return undefined;

  const record = source as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (value !== undefined && value !== null) return value;
  }

  return undefined;
}

export async function getMyProfile() {
  const response = await api
    .get("me/show")
    .json<ApiDataResponse<UserProfile> | { status?: boolean; user?: UserProfile } | UserProfile>();
  const record = response as Record<string, unknown>;
  const user =
    record.user && typeof record.user === "object"
      ? (record.user as UserProfile)
      : record.data && typeof record.data === "object"
        ? (record.data as UserProfile)
        : (response as UserProfile);

  return {
    ...user,
    avatar: typeof user.avatar === "string" && user.avatar
      ? getApiAssetUrl(user.avatar)
      : user.avatar,
    id: user.id ?? user._id,
    nationalnumber: user.nationalnumber ?? undefined,
  };
}

export function updateMyProfile(payload: UpdateProfilePayload) {
  return api
    .post("me/update/profile", { json: payload })
    .json<ApiDataResponse<UserProfile>>();
}

export function authorizeMe(payload: AuthorizePayload) {
  return api.post("me/authorize", { json: payload }).json<ApiDataResponse<unknown>>();
}

export async function getWalletPayments(): Promise<WalletPaymentsResult> {
  const response = await api.get("me/wallet/payments").json<
    | ApiDataResponse<
        WalletPayment[] | { balance?: number | string; payments?: WalletPayment[] }
      >
    | { balance?: number | string; payments?: WalletPayment[] }
    | WalletPayment[]
  >();
  const source = Array.isArray(response) ? { payments: response } : response;
  const sourceRecord = source as Record<string, unknown>;
  const data =
    sourceRecord.data && typeof sourceRecord.data === "object"
      ? (sourceRecord.data as Record<string, unknown>)
      : sourceRecord;

  if (Array.isArray(data)) return { payments: data };

  return {
    balance: getNestedValue(data, ["balance", "wallet", "credit"]) as
      | number
      | string
      | undefined,
    payments: Array.isArray(data.payments) ? (data.payments as WalletPayment[]) : [],
  };
}

export async function getMyAds({
  page = 1,
  type,
}: {
  page?: number;
  type: MyAdsType;
}) {
  return unwrapList(
    await api
      .get("me/myAds", { searchParams: { page, type } })
      .json<ApiListResponse<AdvertisementItem>>(),
  );
}

export async function getMyBadges() {
  const badges = unwrapList(
    await api.get("me/badges").json<ApiListResponse<BadgeItem>>(),
  );

  return badges.map((badge) => ({
    ...badge,
    image:
      typeof badge.image === "string"
        ? getApiAssetUrl(badge.image)
        : typeof badge.logo === "string"
          ? getApiAssetUrl(badge.logo)
          : badge.image,
  }));
}

export async function getAdvertiseBadges({
  page = 1,
  perPage = 10,
}: {
  page?: number;
  perPage?: number;
} = {}): Promise<AdvertiseBadgesPage> {
  const response = await api
    .get("me/badges", {
      searchParams: {
        page,
        per_page: perPage,
      },
    })
    .json<AdvertiseBadgesResponse>();
  const record = Array.isArray(response) ? {} : response;
  const data = Array.isArray(response)
    ? response
    : Array.isArray(record.advertises)
      ? record.advertises
      : Array.isArray(record.data)
        ? record.data
        : [];
  const currentPage = record.page ?? page;
  const resolvedPerPage = record.per_page ?? perPage;
  const total = record.total ?? data.length;

  return {
    adsIds: Array.isArray(record.AdsIds) ? record.AdsIds.map(String) : [],
    data,
    hasNextPage: currentPage * resolvedPerPage < total,
    page: currentPage,
    perPage: resolvedPerPage,
    total,
  };
}

export function toggleAdvertiseBadge(advertiseId: string) {
  return api
    .post(`me/advertise/badges/create/${advertiseId}`)
    .json<ApiDataResponse<unknown>>();
}

export function deleteAdvertiseBadge(advertiseId: string) {
  return api
    .delete(`me/advertise/badges/delete/${advertiseId}`)
    .json<ApiDataResponse<unknown>>();
}

export async function getMyNotes() {
  const response = await api.get("me/notes").json<MyNotesResponse>();

  if (Array.isArray(response)) return response;

  const record = response as Record<string, unknown>;

  if (Array.isArray(record.notes)) return record.notes as NoteItem[];
  if (Array.isArray(record.advertises)) return record.advertises as NoteItem[];

  return unwrapList(response as ApiListResponse<NoteItem>);
}

export function saveAdvertiseNote({ advertiseId, note }: SaveAdvertiseNotePayload) {
  return api
    .post(`me/advertise/note/add/${advertiseId}`, { json: { note } })
    .json<ApiDataResponse<NoteItem | unknown>>();
}

export function deleteAdvertiseNote(noteId: string) {
  return api
    .delete(`me/advertise/note/delete/${noteId}`)
    .json<ApiDataResponse<unknown>>();
}
