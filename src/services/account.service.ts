import { api, getApiAssetUrl } from "../api/api";
import type { ApiDataResponse, ApiListResponse } from "../api/response";
import { unwrapList } from "../api/response";
import type { AdvertisementItem } from "./advertisement.service";

export type UserProfile = {
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

export type NoteItem = Record<string, unknown> & {
  ad?: AdvertisementItem;
  advertise?: AdvertisementItem;
  description?: string;
  id?: number | string;
  note?: string;
  text?: string;
};

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
    .json<ApiDataResponse<UserProfile> | UserProfile>();
  const record = response as Record<string, unknown>;

  return record.data && typeof record.data === "object"
    ? (record.data as UserProfile)
    : (response as UserProfile);
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
  return unwrapList(await api.get("me/notes").json<ApiListResponse<NoteItem>>());
}
