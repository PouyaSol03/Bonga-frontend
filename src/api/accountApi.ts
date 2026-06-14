import {
  apiRequest,
  createEndpoint,
  getApiAssetUrl,
  type ApiQueryParams,
} from "./apiClient";
import type { AdvertisementItem } from "./advertiseApi";

type ApiDataResponse<T> = {
  data?: T;
  message?: string;
  status?: boolean;
};

type ApiListResponse<T> =
  | ApiDataResponse<T[]>
  | {
      items?: T[];
      list?: T[];
      result?: T[];
    }
  | T[];

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

function unwrapList<T>(response: ApiListResponse<T>): T[] {
  if (Array.isArray(response)) {
    return response;
  }

  const record = response as Record<string, unknown>;

  if (Array.isArray(record.data)) {
    return record.data as T[];
  }

  if (Array.isArray(record.items)) {
    return record.items as T[];
  }

  if (Array.isArray(record.list)) {
    return record.list as T[];
  }

  if (Array.isArray(record.result)) {
    return record.result as T[];
  }

  return [];
}

function getNestedValue(source: unknown, keys: string[]) {
  if (!source || typeof source !== "object") {
    return undefined;
  }

  const record = source as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (value !== undefined && value !== null) {
      return value;
    }
  }

  return undefined;
}

function withQuery(path: string, params: ApiQueryParams) {
  return createEndpoint(path, params);
}

export async function getMyProfile(): Promise<UserProfile> {
  const response = await apiRequest<ApiDataResponse<UserProfile> | UserProfile>(
    "/me/show",
    {
      method: "GET",
    },
  );

  const record = response as Record<string, unknown>;

  return record.data && typeof record.data === "object"
    ? (record.data as UserProfile)
    : (response as UserProfile);
}

export async function updateMyProfile(payload: UpdateProfilePayload) {
  return apiRequest<ApiDataResponse<UserProfile>>("/me/update/profile", {
    body: JSON.stringify(payload),
    method: "POST",
  });
}

export async function authorizeMe(payload: AuthorizePayload) {
  return apiRequest<ApiDataResponse<unknown>>("/me/authorize", {
    body: JSON.stringify(payload),
    method: "POST",
  });
}

export async function getWalletPayments(): Promise<WalletPaymentsResult> {
  const response = await apiRequest<
    | ApiDataResponse<WalletPayment[] | { balance?: number | string; payments?: WalletPayment[] }>
    | { balance?: number | string; payments?: WalletPayment[] }
    | WalletPayment[]
  >("/me/wallet/payments", {
    method: "GET",
  });

  const source = Array.isArray(response) ? { payments: response } : response;
  const sourceRecord = source as Record<string, unknown>;
  const data =
    sourceRecord.data && typeof sourceRecord.data === "object"
      ? (sourceRecord.data as Record<string, unknown>)
      : sourceRecord;

  if (Array.isArray(data)) {
    return { payments: data } satisfies WalletPaymentsResult;
  }

  return {
    balance: getNestedValue(data, ["balance", "wallet", "credit"]) as
      | number
      | string
      | undefined,
    payments: Array.isArray(data.payments) ? (data.payments as WalletPayment[]) : [],
  } satisfies WalletPaymentsResult;
}

export async function getMyAds({
  page = 1,
  type = "all",
}: {
  page?: number;
  type?: MyAdsType;
}): Promise<AdvertisementItem[]> {
  const response = await apiRequest<ApiListResponse<AdvertisementItem>>(
    withQuery("/me/myAds", { page, type }),
    {
      method: "GET",
    },
  );

  return unwrapList(response);
}

export async function getMyBadges(): Promise<BadgeItem[]> {
  const badges = unwrapList(
    await apiRequest<ApiListResponse<BadgeItem>>("/me/badges", {
      method: "GET",
    }),
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

export async function getMyNotes(): Promise<NoteItem[]> {
  return unwrapList(
    await apiRequest<ApiListResponse<NoteItem>>("/me/notes", {
      method: "GET",
    }),
  );
}
