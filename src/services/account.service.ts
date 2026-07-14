import { ApiError, api, getApiAssetUrl } from "../api/api";
import {
  authRoleSlugs,
  getStoredAuthSession,
  setStoredAuthSession,
  type AuthRole,
  type AuthRoleSlug,
} from "../auth/auth-storage";
import type { ApiDataResponse, ApiListResponse } from "../api/response";
import { unwrapList } from "../api/response";
import type { AdvertisementItem } from "./advertisement.service";

export type UserProfile = {
  _id?: string;
  authorized?: number;
  authorize_date?: string | null;
  avatar?: string | null;
  city_id?: string | null;
  contact_social?: Record<string, unknown> | null;
  contacts?: Record<string, unknown> | null;
  email?: string | null;
  family?: string | null;
  id?: string | number;
  instagram?: string | null;
  mobile?: string;
  name?: string | null;
  nationalnumber?: string | null;
  neighborhood_id?: string | null;
  neighborhood_ids?: string[] | string | null;
  phone?: string;
  role?: string;
  roles?: Array<AuthRole | string | Record<string, unknown>>;
  social?: Record<string, unknown> | null;
  telegram?: string | null;
  whatsapp?: string | null;
};

function normalizeProfileRoleSlug(value: unknown): AuthRoleSlug | null {
  if (typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase().replace(/_/g, "-");
  if (
    normalized === "superadmin" ||
    normalized === "super admin" ||
    normalized === "super-admin"
  ) return "super-admin";

  const slug = value.trim().toLowerCase().replace(/-/g, "_") as AuthRoleSlug;
  return authRoleSlugs.includes(slug) ? slug : null;
}

function syncStoredRolesFromProfile(response: unknown, profile: UserProfile) {
  const session = getStoredAuthSession();
  if (!session) return;

  const responseRecord = response as Record<string, unknown>;
  const candidates = [
    responseRecord.roles,
    (responseRecord.user as Record<string, unknown> | undefined)?.roles,
    (responseRecord.data as Record<string, unknown> | undefined)?.roles,
    profile.roles,
  ];
  const rawRoles = candidates.find(Array.isArray);
  if (!Array.isArray(rawRoles)) return;

  const roles = rawRoles
    .map((role, index): AuthRole | null => {
      const record = role && typeof role === "object" ? role as Record<string, unknown> : null;
      const slug = normalizeProfileRoleSlug(typeof role === "string" ? role : record?.slug ?? record?.name);
      if (!slug) return null;

      return {
        id: String(record?.id ?? record?._id ?? index + 1),
        name: String(record?.name ?? slug),
        slug,
      };
    })
    .filter((role): role is AuthRole => role !== null)
    .filter((role, index, items) => items.findIndex((item) => item.slug === role.slug) === index);

  if (!roles.length) return;

  const activeRole: AuthRoleSlug = roles.some((role) => role.slug === session.activeRole)
    ? session.activeRole as AuthRoleSlug
    : roles.find((role) => role.slug === "user")?.slug ?? roles[0]!.slug;

  setStoredAuthSession({
    ...session,
    activeRole,
    accountType: activeRole,
    role: activeRole,
    roles,
  });
}

export function isUserIdentityVerified(profile?: UserProfile | null) {
  const authorizedValue = profile?.authorized;
  const isAuthorized =
    authorizedValue === 1 ||
    String(authorizedValue ?? "").trim() === "1" ||
    String(authorizedValue ?? "").toLowerCase().trim() === "true";
  const hasNationalNumber = Boolean(profile?.nationalnumber?.trim());

  return isAuthorized || hasNationalNumber;
}

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

export type CreateMyAgencyPayload = {
  name: string;
  neighborhood_ids: string[];
};

export type MyAgencyProfile = {
  _id?: string | number;
  id?: string | number;
  name?: string | null;
  neighborhood_id?: string | null;
  neighborhood_ids?: string[] | null;
  user_chat_ids?: string[];
  logo?: string | null;
  img?: string | null;
  status?: number | null;
  agency_type?: number | null;
  phone1?: string | null;
  phone2?: string | null;
  phone3?: string | null;
  working_hours?: string | null;
  address?: string | null;
  city_id?: string | null;
  city_name?: string | null;
  lat?: number | string | null;
  lng?: number | string | null;
  location?: unknown;
  about_us?: string | null;
  created_at?: string;
  updated_at?: string;
  status_text?: string;
};

export type UpdateMyAgencyProfilePayload = {
  name: string;
  neighborhood_id?: string | null;
  neighborhood_ids: string[];
  phone1?: string | null;
  phone2?: string | null;
  phone3?: string | null;
  working_hours?: string | null;
  address?: string | null;
  about_us?: string | null;
  lat?: number | null;
  lng?: number | null;
  agency_type?: number | null;
  logo?: File | null;
  img?: File | null;
};

export type WalletPayment = Record<string, unknown> & {
  created_at?: string;
  id?: string;
  price?: number | string;
  ref_id?: number | string | null;
  status?: number | string;
};

export type WalletResult = {
  credit: number | string;
};

export type WalletPaymentsResult = {
  page: number;
  perPage: number;
  payments: WalletPayment[];
  total: number;
};

export type ChargeWalletPayload = {
  price: number;
};

export type ChargeWalletResult = {
  authority?: string;
  paymentId?: string;
  paymentUrl: string;
};

export type PaymentCallbackPayload = {
  Authority: string;
  Status: string;
};

export type PaymentCallbackResult = {
  redirectUrl: string;
  success: boolean;
};

export type MyAdsType = "all" | "active" | "deactive" | "pending";

export type MyAdsPage = {
  data: AdvertisementItem[];
  hasNextPage: boolean;
  page: number;
  perPage: number;
  total: number;
};

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

type MyAdsResponse =
  | ApiListResponse<AdvertisementItem>
  | {
      advertises?: AdvertisementItem[];
      data?: AdvertisementItem[];
      page?: number;
      per_page?: number;
      status?: boolean;
      total?: number;
    };

export async function getMyProfile() {
  const response = await api
    .get("me/show")
    .json<ApiDataResponse<UserProfile> | { status?: boolean; user?: UserProfile } | UserProfile>();
  const record = response as Record<string, unknown>;

  const profile = record.user && typeof record.user === "object"
    ? record.user as UserProfile
    : record.data && typeof record.data === "object"
      ? record.data as UserProfile
      : response as UserProfile;

  syncStoredRolesFromProfile(response, profile);
  return profile;
}

export function updateMyProfile(payload: UpdateProfilePayload) {
  const { avatar, neighborhood_ids, ...profileFields } = payload;
  const normalizedProfileFields = {
    ...profileFields,
    ...(neighborhood_ids
      ? {
          neighborhood_ids: Array.from(
            new Set(neighborhood_ids.map((item) => item.trim()).filter(Boolean)),
          ).join(","),
        }
      : {}),
  };

  if (avatar) {
    const formData = new FormData();

    Object.entries(normalizedProfileFields).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    formData.append("avatar", avatar);

    return api
      .post("me/update/profile", { body: formData })
      .json<ApiDataResponse<UserProfile>>();
  }

  return api
    .post("me/update/profile", { json: normalizedProfileFields })
    .json<ApiDataResponse<UserProfile>>();
}

export function authorizeMe(payload: AuthorizePayload) {
  return api.post("me/authorize", { json: payload }).json<ApiDataResponse<unknown>>();
}

export function createMyAgency(payload: CreateMyAgencyPayload) {
  return api
    .post("me/agency/create", {
      json: {
        name: payload.name,
        neighborhood_ids: payload.neighborhood_ids,
      },
    })
    .json<ApiDataResponse<unknown>>();
}

function appendAgencyFormValue(
  formData: FormData,
  key: string,
  value: string | number | null | undefined,
) {
  formData.append(key, value === null || value === undefined ? "" : String(value));
}

function normalizeOptionalAgencyValue(value: string | number | null | undefined) {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value.trim() || null;

  return value;
}

function normalizeAgencyNeighborhoodIds(value: unknown) {
  const values = Array.isArray(value) ? value : value === null || value === undefined ? [] : [value];

  return Array.from(
    new Set(
      values
        .flatMap((item) => String(item ?? "").split(","))
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function normalizeMyAgencyProfile(profile: MyAgencyProfile): MyAgencyProfile {
  return {
    ...profile,
    neighborhood_ids: normalizeAgencyNeighborhoodIds(profile.neighborhood_ids),
  };
}

function unwrapMyAgencyProfile(
  response:
    | ApiDataResponse<MyAgencyProfile>
    | { agency?: MyAgencyProfile; status?: boolean }
    | MyAgencyProfile,
) {
  const record = response as Record<string, unknown>;

  if (record.agency && typeof record.agency === "object") {
    return normalizeMyAgencyProfile(record.agency as MyAgencyProfile);
  }

  if (record.data && typeof record.data === "object") {
    return normalizeMyAgencyProfile(record.data as MyAgencyProfile);
  }

  return normalizeMyAgencyProfile(response as MyAgencyProfile);
}

export async function getMyAgencyProfile() {
  const response = await api.get("me/agency/show").json<
    | ApiDataResponse<MyAgencyProfile>
    | { agency?: MyAgencyProfile; status?: boolean }
    | MyAgencyProfile
  >();

  return unwrapMyAgencyProfile(response);
}

export async function updateMyAgencyProfile(payload: UpdateMyAgencyProfilePayload) {
  const fields = {
    about_us: normalizeOptionalAgencyValue(payload.about_us),
    address: normalizeOptionalAgencyValue(payload.address),
    agency_type: normalizeOptionalAgencyValue(payload.agency_type),
    lat: normalizeOptionalAgencyValue(payload.lat),
    lng: normalizeOptionalAgencyValue(payload.lng),
    name: payload.name.trim(),
    neighborhood_ids: Array.from(
      new Set(payload.neighborhood_ids.map((item) => item.trim()).filter(Boolean)),
    ).join(","),
    phone1: normalizeOptionalAgencyValue(payload.phone1),
    phone2: normalizeOptionalAgencyValue(payload.phone2),
    phone3: normalizeOptionalAgencyValue(payload.phone3),
    working_hours: normalizeOptionalAgencyValue(payload.working_hours),
  };
  const hasFile = Boolean(payload.logo || payload.img);
  const request = hasFile
    ? (() => {
        const formData = new FormData();

        Object.entries(fields).forEach(([key, value]) => {
          appendAgencyFormValue(formData, key, value);
        });
        if (payload.logo) formData.append("logo", payload.logo);
        if (payload.img) formData.append("img", payload.img);

        return api.post("me/agency/update/profile", { body: formData });
      })()
    : api.post("me/agency/update/profile", { json: fields });

  const response = await request.json<
    | ApiDataResponse<MyAgencyProfile>
    | { agency?: MyAgencyProfile; status?: boolean }
    | MyAgencyProfile
  >();

  return unwrapMyAgencyProfile(response);
}

export async function getWallet(): Promise<WalletResult> {
  const response = await api.get("me/wallet").json<ApiDataResponse<WalletResult> | WalletResult>();
  const record = response as Record<string, unknown>;
  const data = record.data && typeof record.data === "object"
    ? record.data as Record<string, unknown>
    : record;

  return { credit: (data.credit as number | string | undefined) ?? 0 };
}

export async function getWalletPayments(page = 1): Promise<WalletPaymentsResult> {
  const response = await api.get("me/wallet/payments", {
    searchParams: { page },
  }).json<
    | ApiDataResponse<WalletPayment[]>
    | { page?: number; payments?: WalletPayment[]; per_page?: number; total?: number }
    | WalletPayment[]
  >();
  const source = Array.isArray(response) ? { payments: response } : response;
  const sourceRecord = source as Record<string, unknown>;
  const data =
    sourceRecord.data && typeof sourceRecord.data === "object"
      ? (sourceRecord.data as Record<string, unknown>)
      : sourceRecord;

  if (Array.isArray(data)) {
    return { page, payments: data, perPage: data.length, total: data.length };
  }

  return {
    page: typeof data.page === "number" ? data.page : page,
    perPage: typeof data.per_page === "number" ? data.per_page : 20,
    payments: Array.isArray(data.payments) ? (data.payments as WalletPayment[]) : [],
    total: typeof data.total === "number" ? data.total : 0,
  };
}

function readPaymentUrl(response: Record<string, unknown>) {
  const value = response.payment_url ?? response.url;

  if (typeof value !== "string" || !value.trim()) return null;

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    return url.toString();
  } catch {
    return null;
  }
}

export async function chargeWallet(
  payload: ChargeWalletPayload,
): Promise<ChargeWalletResult> {
  if (!Number.isSafeInteger(payload.price) || payload.price <= 0) {
    throw new ApiError(400, "مبلغ واردشده معتبر نیست.");
  }

  const response = await api.post("me/charge/wallet", { json: payload }).json<
    Record<string, unknown> & {
      authority?: string;
      payment_id?: string;
      payment_url?: string;
      status?: boolean;
      url?: string;
    }
  >();

  if (response.status === false) {
    throw new ApiError(400, "ایجاد درخواست پرداخت با خطا مواجه شد.");
  }

  const paymentUrl = readPaymentUrl(response);

  if (!paymentUrl) {
    throw new ApiError(500, "آدرس درگاه پرداخت از سرور دریافت نشد.");
  }

  return {
    authority: typeof response.authority === "string" ? response.authority : undefined,
    paymentId:
      typeof response.payment_id === "string" ? response.payment_id : undefined,
    paymentUrl,
  };
}

const paymentCallbackRequests = new Map<
  string,
  Promise<PaymentCallbackResult>
>();

export function verifyPaymentCallback(
  payload: PaymentCallbackPayload,
): Promise<PaymentCallbackResult> {
  const requestKey = `${payload.Authority}:${payload.Status.toUpperCase()}`;
  const existingRequest = paymentCallbackRequests.get(requestKey);

  if (existingRequest) return existingRequest;

  const request = api
    .post("me/payment/callback", {
      context: { allowNonJsonResponse: true },
      headers: { Accept: "*/*" },
      json: payload,
      redirect: "follow",
    })
    .then((response) => ({
      redirectUrl: response.url,
      success: payload.Status.trim().toUpperCase() === "OK",
    }));

  paymentCallbackRequests.set(requestKey, request);
  void request.then(
    () => paymentCallbackRequests.delete(requestKey),
    () => paymentCallbackRequests.delete(requestKey),
  );

  return request;
}

export async function getMyAds({
  page = 1,
  perPage = 20,
  type,
}: {
  page?: number;
  perPage?: number;
  type: MyAdsType;
}) {
  const response = await api
    .get("me/myAds", { searchParams: { page, per_page: perPage, type } })
    .json<MyAdsResponse>();
  const record = Array.isArray(response) ? {} : (response as Record<string, unknown>);
  const data = Array.isArray(response)
    ? response
    : Array.isArray(record.advertises)
      ? (record.advertises as AdvertisementItem[])
      : unwrapList(response as ApiListResponse<AdvertisementItem>);
  const currentPage = typeof record.page === "number" ? record.page : page;
  const resolvedPerPage = typeof record.per_page === "number" ? record.per_page : perPage;
  const total = typeof record.total === "number" ? record.total : data.length;

  return {
    data,
    hasNextPage: currentPage * resolvedPerPage < total,
    page: currentPage,
    perPage: resolvedPerPage,
    total,
  } satisfies MyAdsPage;
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
