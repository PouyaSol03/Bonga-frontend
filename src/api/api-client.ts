import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import type { AdCardData } from "../components/AdCard";

export type AuthRole = {
  id: string;
  name: string;
  slug: string;
};

export type AuthSession = {
  accessToken: string;
  accountType: string;
  expiresAt: number | null;
  mobile: string;
  role: string;
  roles: AuthRole[];
};

const authSessionKey = "bonga-auth-session";
const pendingMobileKey = "bonga-pending-mobile";
const otpResendAtKey = "bonga-otp-resend-at";

export const otpResendCooldownMilliseconds = 60_000;

export function storeAuthSession(session: AuthSession) {
  window.localStorage.setItem(authSessionKey, JSON.stringify(session));
}

export function getStoredAuthSession() {
  const value = window.localStorage.getItem(authSessionKey);

  if (!value) return null;

  try {
    const session = JSON.parse(value) as AuthSession;

    if (session.expiresAt !== null && session.expiresAt <= Date.now()) {
      clearAuthSession();
      return null;
    }

    return session;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession() {
  window.localStorage.removeItem(authSessionKey);
}

export function storePendingOtpMobile(mobile: string) {
  window.sessionStorage.setItem(pendingMobileKey, mobile);
}

export function getPendingOtpMobile() {
  return window.sessionStorage.getItem(pendingMobileKey) ?? "";
}

export function startOtpResendCooldown() {
  window.sessionStorage.setItem(
    otpResendAtKey,
    String(Date.now() + otpResendCooldownMilliseconds),
  );
}

export function getOtpResendSecondsRemaining() {
  const resendAt = Number(window.sessionStorage.getItem(otpResendAtKey));

  if (!Number.isFinite(resendAt)) return 0;

  return Math.max(0, Math.ceil((resendAt - Date.now()) / 1000));
}

export function clearPendingOtpState() {
  window.sessionStorage.removeItem(pendingMobileKey);
  window.sessionStorage.removeItem(otpResendAtKey);
}

export function formatMobileForDisplay(mobile: string) {
  return mobile.replace(/^(\d{4})(\d{3})(\d{4})$/, "$1 $2 $3");
}

export type ApiQueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

type ApiRequestOptions = Omit<RequestInit, "body" | "method"> & {
  authenticated?: boolean;
  body?: BodyInit | null;
  json?: unknown;
  params?: ApiQueryParams;
  searchParams?: ApiQueryParams;
};

type ErrorPayload = Record<string, unknown> | null;

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  response?: Response;
  status: number;

  constructor(status: number, message: string, response?: Response) {
    super(message);
    this.name = "ApiError";
    this.response = response;
    this.status = status;
  }
}

function resolveEndpoint(path: string) {
  if (/^https?:\/\//i.test(path)) return path;

  return `${apiBaseUrl}/${path.replace(/^\/+/, "")}`;
}

export function createQueryString(params: ApiQueryParams = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

export function createEndpoint(path: string, params?: ApiQueryParams) {
  return `${path}${createQueryString(params)}`;
}

export function getApiAssetUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;

  return `${apiBaseUrl}/${path.replace(/^\/+/, "")}`;
}

async function parsePayload(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.text();

  if (!body || !contentType.includes("json")) return null;

  return JSON.parse(body) as unknown;
}

function readErrorMessage(payload: ErrorPayload) {
  if (!payload) return null;

  for (const key of ["message", "error", "detail"]) {
    const value = payload[key];

    if (typeof value === "string" && value.trim()) return value;
  }

  return null;
}

function createBody(options: Pick<ApiRequestOptions, "body" | "json">) {
  if (options.json !== undefined) return JSON.stringify(options.json);

  return options.body;
}

function createHeaders(headers: HeadersInit | undefined, hasJsonBody: boolean) {
  const resolvedHeaders = new Headers(headers);

  resolvedHeaders.set("Accept", "application/json");

  if (hasJsonBody && !resolvedHeaders.has("Content-Type")) {
    resolvedHeaders.set("Content-Type", "application/json");
  }

  return resolvedHeaders;
}

async function fetchApi(
  method: string,
  path: string,
  {
    authenticated = true,
    body,
    headers: inputHeaders,
    json,
    params,
    searchParams,
    ...init
  }: ApiRequestOptions = {},
) {
  const headers = createHeaders(inputHeaders, json !== undefined);

  if (authenticated) {
    const accessToken = getStoredAuthSession()?.accessToken;

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  const response = await fetch(
    resolveEndpoint(createEndpoint(path, searchParams ?? params)),
    {
      ...init,
      body: createBody({ body, json }),
      credentials: "include",
      headers,
      method,
    },
  );
  const payload = await parsePayload(response);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      readErrorMessage(payload as ErrorPayload) ?? "درخواست با خطا مواجه شد.",
      response,
    );
  }

  return { payload, response };
}

function createApiCall(method: string, path: string, options?: ApiRequestOptions) {
  let requestPromise: Promise<{ payload: unknown; response: Response }> | null = null;
  const run = () => {
    requestPromise ??= fetchApi(method, path, options);

    return requestPromise;
  };

  return {
    async blob() {
      const { response } = await run();

      return response.blob();
    },
    async json<T = unknown>() {
      const { payload } = await run();

      return payload as T;
    },
    async response() {
      const { response } = await run();

      return response;
    },
    async text() {
      const { response } = await run();

      return response.clone().text();
    },
  };
}

type ApiCall = ReturnType<typeof createApiCall>;
type ApiInstance = {
  delete(path: string, options?: ApiRequestOptions): ApiCall;
  extend(options: ApiRequestOptions): ApiInstance;
  get(path: string, options?: ApiRequestOptions): ApiCall;
  patch(path: string, options?: ApiRequestOptions): ApiCall;
  post(path: string, options?: ApiRequestOptions): ApiCall;
  put(path: string, options?: ApiRequestOptions): ApiCall;
  request<T = unknown>(path: string, options?: ApiRequestOptions & { method?: string }): Promise<T>;
};

function createApi(defaultOptions: ApiRequestOptions = {}): ApiInstance {
  const withDefaults = (options?: ApiRequestOptions) => ({
    ...defaultOptions,
    ...options,
    headers: {
      ...Object.fromEntries(new Headers(defaultOptions.headers).entries()),
      ...Object.fromEntries(new Headers(options?.headers).entries()),
    },
  });

  return {
    delete(path, options) {
      return createApiCall("DELETE", path, withDefaults(options));
    },
    extend(options) {
      return createApi({ ...defaultOptions, ...options });
    },
    get(path, options) {
      return createApiCall("GET", path, withDefaults(options));
    },
    patch(path, options) {
      return createApiCall("PATCH", path, withDefaults(options));
    },
    post(path, options) {
      return createApiCall("POST", path, withDefaults(options));
    },
    put(path, options) {
      return createApiCall("PUT", path, withDefaults(options));
    },
    async request<T = unknown>(
      path: string,
      { method = "GET", ...options }: ApiRequestOptions & { method?: string } = {},
    ) {
      const { payload } = await fetchApi(method, path, withDefaults(options));

      return payload as T;
    },
  };
}

export const api = createApi();
export const publicApi = api.extend({ authenticated: false });
export const uploadApi = api.extend({});

export async function apiRequest<T>(
  path: string,
  { method = "GET", ...options }: ApiRequestOptions & { method?: string } = {},
) {
  return api.request<T>(path, { ...options, method });
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function isTransientApiError(error: unknown) {
  if (error instanceof ApiError) return error.status >= 500;

  return error instanceof Error;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export const queryKeys = {
  account: {
    all: ["account"] as const,
    badges: () => [...queryKeys.account.all, "badges"] as const,
    bookmarks: () => [...queryKeys.account.all, "bookmarks"] as const,
    myAds: (filters: { page: number; type: string }) =>
      [...queryKeys.account.all, "my-ads", filters.type, filters.page] as const,
    notes: () => [...queryKeys.account.all, "notes"] as const,
    profile: () => [...queryKeys.account.all, "profile"] as const,
    walletPayments: () => [...queryKeys.account.all, "wallet-payments"] as const,
  },
  advertisements: {
    all: ["advertisements"] as const,
    detail: (id: string) => [...queryKeys.advertisements.all, "detail", id] as const,
    list: (filters: { categoryId?: string; cityId?: string; perPage: number }) =>
      [
        ...queryKeys.advertisements.all,
        "list",
        filters.cityId ?? "",
        filters.categoryId ?? "",
        filters.perPage,
      ] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: () => [...queryKeys.categories.all, "list"] as const,
  },
  cities: {
    all: ["cities"] as const,
    list: () => [...queryKeys.cities.all, "list"] as const,
    mostVisited: () => [...queryKeys.cities.all, "most-visited"] as const,
    search: (q?: string) => [...queryKeys.cities.all, "search", q ?? ""] as const,
  },
  searchHistory: {
    all: ["search-history"] as const,
    list: (qsearch?: string) =>
      [...queryKeys.searchHistory.all, "list", qsearch ?? ""] as const,
  },
};

type AuthRequestPayload = {
  mobile: string;
};

type VerifyOtpPayload = AuthRequestPayload & {
  code: string;
};

type StatusResponse = {
  message: string;
  status: boolean;
};

export type RequestOtpResponse = StatusResponse & {
  has_city: boolean;
  smsRes: StatusResponse;
};

export type VerifyOtpResponse = StatusResponse & {
  access_token: string;
  account_type: string;
  expires_in: number;
  role: string;
  roles: AuthRole[];
  token: string;
  tokens: {
    access_token: string;
  };
};

function requireSuccess<T extends StatusResponse>(response: T) {
  if (!response.status) {
    throw new ApiError(200, response.message || "درخواست با خطا مواجه شد.");
  }

  return response;
}

export async function requestOtp({ mobile }: AuthRequestPayload) {
  const response = requireSuccess(
    await api
      .post("public/auth/request-otp", {
        authenticated: false,
        json: { mobile },
      })
      .json<RequestOtpResponse>(),
  );

  storePendingOtpMobile(mobile);
  startOtpResendCooldown();

  return response;
}

export async function verifyOtp({ mobile, code }: VerifyOtpPayload) {
  const response = requireSuccess(
    await api
      .post("public/auth/verify-otp", {
        authenticated: false,
        json: { code, mobile },
      })
      .json<VerifyOtpResponse>(),
  );
  const accessToken =
    response.access_token || response.tokens?.access_token || response.token;

  if (!accessToken) {
    throw new ApiError(200, "توکن ورود از سرور دریافت نشد.");
  }

  storeAuthSession({
    accessToken,
    accountType: response.account_type,
    expiresAt: response.expires_in
      ? Date.now() + response.expires_in * 1000
      : null,
    mobile,
    role: response.role,
    roles: response.roles,
  });
  clearPendingOtpState();

  return response;
}

export async function resendOtp({ mobile }: AuthRequestPayload) {
  const response = requireSuccess(
    await api
      .post("public/auth/resend-otp", {
        authenticated: false,
        json: { mobile },
      })
      .json<RequestOtpResponse>(),
  );

  startOtpResendCooldown();

  return response;
}

export function getAuthenticatedUser<T = unknown>() {
  return api.get("me/auth/me").json<T>();
}

export async function logout() {
  try {
    return await api.get("me/auth/logout").json<StatusResponse>();
  } finally {
    clearAuthSession();
  }
}

export function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

export function normalizeMobile(value: string) {
  return normalizeDigits(value).replace(/\D/g, "").slice(0, 11);
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  return getApiErrorMessage(error, fallback);
}

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

export type CategoryItem = {
  id: string;
  name: string;
  parent_id: string | null;
  code: string;
  priority: number;
  priority_on_first_page: number;
  slug: string;
  slug_of_first_page: string;
  track_code: number;
  children: CategoryItem[];
};

type CategoryListResponse = {
  data: CategoryItem[];
  status: boolean;
};

export type CityDto = {
  _id?: string;
  code?: string;
  country_id?: string;
  id?: string;
  lat?: number;
  lng?: number;
  logo?: string;
  name: string;
};

type CityListResponse = {
  data: CityDto[];
  status: boolean;
};

export type AdvertisementItem = Record<string, unknown> & {
  _id?: string;
  agency?: string;
  area?: string | number;
  badges?: string[];
  city?: { name?: string };
  city_name?: string;
  created_at?: string;
  district?: { name?: string };
  district_name?: string;
  id?: string | number;
  image?: string;
  images?: Array<string | { path?: string; url?: string }>;
  features?: Array<{ label?: string; value?: string | number }>;
  label?: string;
  neighborhood?: { name?: string };
  neighborhood_name?: string;
  published_hours_ago?: number | string;
  short_description?: string;
  price?: string | number;
  price_label?: string;
  rooms?: string | number;
  title?: string;
  updated_at?: string;
  year?: string | number;
};

type PaginationMeta = {
  current_page?: number;
  last_page?: number;
  page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
};

type AdvertisementListResponse =
  | {
      data?: AdvertisementItem[];
      meta?: PaginationMeta;
      pagination?: PaginationMeta;
      status?: boolean;
    }
  | AdvertisementItem[];

type AdvertisementShowResponse =
  | {
      data?: AdvertisementItem;
      status?: boolean;
    }
  | AdvertisementItem;

export type AdvertisementListParams = {
  categoryId?: string;
  cityId?: string;
  page?: number;
  perPage?: number;
};

export type AdvertisementPage = {
  data: AdvertisementItem[];
  hasNextPage: boolean;
  page: number;
};

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

export type SearchHistoryDto = Record<string, unknown> & {
  _id?: string;
  category?: { name?: string };
  category_name?: string;
  city?: { name?: string };
  city_name?: string;
  filters?: unknown;
  id?: string | number;
  qsearch?: string;
  query?: string;
  search?: string;
  tags?: unknown;
  text?: string;
  title?: string;
};

export type SearchHistoryItem = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
};

type SearchHistoryResponse =
  | {
      data?: SearchHistoryDto[];
      status?: boolean;
    }
  | SearchHistoryDto[];

const defaultPerPage = 10;

function unwrapList<T>(response: ApiListResponse<T>): T[] {
  if (Array.isArray(response)) return response;

  const record = response as Record<string, unknown>;

  if (Array.isArray(record.data)) return record.data as T[];
  if (Array.isArray(record.items)) return record.items as T[];
  if (Array.isArray(record.list)) return record.list as T[];
  if (Array.isArray(record.result)) return record.result as T[];

  return [];
}

function getNestedValue(source: unknown, keys: string[]) {
  if (!source || typeof source !== "object") return undefined;

  const record = source as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (value !== undefined && value !== null) return value;
  }

  return undefined;
}

function toNumber(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function toText(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);

  return fallback;
}

function readNestedName(value: unknown) {
  if (typeof value === "string" && value.trim()) return value;

  if (value && typeof value === "object" && "name" in value) {
    return toText((value as { name?: unknown }).name);
  }

  return "";
}

function normalizeCityLogo(city: CityDto): CityDto {
  return {
    ...city,
    logo: city.logo ? getApiAssetUrl(city.logo) : city.logo,
  };
}

function formatPrice(value: unknown) {
  const numericValue = toNumber(value);

  if (numericValue === undefined) return toText(value, "توافقی");

  if (numericValue >= 1_000_000_000) {
    return `${new Intl.NumberFormat("fa-IR", {
      maximumFractionDigits: 1,
    }).format(numericValue / 1_000_000_000)} میلیارد`;
  }

  if (numericValue >= 1_000_000) {
    return `${new Intl.NumberFormat("fa-IR", {
      maximumFractionDigits: 1,
    }).format(numericValue / 1_000_000)} میلیون`;
  }

  return new Intl.NumberFormat("fa-IR").format(numericValue);
}

function readFeature(item: AdvertisementItem, labels: string[], fallback: string) {
  const features = Array.isArray(item.features) ? item.features : [];
  const feature = features.find((candidate) =>
    labels.some((label) => candidate.label?.includes(label)),
  );

  return toText(feature?.value, fallback);
}

function readNestedText(item: AdvertisementItem, keys: string[]) {
  for (const key of keys) {
    const value = item[key];

    if (typeof value === "string" && value.trim()) return value;

    if (value && typeof value === "object" && "name" in value) {
      const name = (value as { name?: unknown }).name;

      if (typeof name === "string" && name.trim()) return name;
    }
  }

  return "";
}

function readImages(item: AdvertisementItem) {
  const images = Array.isArray(item.images) ? item.images : [];

  return images
    .map((image) => {
      if (typeof image === "string") return image;

      return image.url ?? image.path ?? "";
    })
    .filter(Boolean);
}

function readSearchTags(item: SearchHistoryDto) {
  if (Array.isArray(item.tags)) return item.tags.map((tag) => toText(tag)).filter(Boolean);
  if (Array.isArray(item.filters)) return item.filters.map((tag) => toText(tag)).filter(Boolean);

  const filters = item.filters;

  if (filters && typeof filters === "object") {
    return Object.values(filters)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .map((tag) => readNestedName(tag) || toText(tag))
      .filter(Boolean);
  }

  return [
    readNestedName(item.city) || toText(item.city_name),
    readNestedName(item.category) || toText(item.category_name),
  ].filter(Boolean);
}

export function mapAdvertisementToAdCard(
  item: AdvertisementItem,
  index: number,
): AdCardData {
  const images = readImages(item);
  const location = readNestedText(item, [
    "neighborhood",
    "neighborhood_name",
    "district",
    "district_name",
    "city",
    "city_name",
  ]);
  const image = toText(item.image || images[0]);
  const publishedHoursAgo = toNumber(item.published_hours_ago);

  return {
    id: item.id ?? item._id ?? index + 1,
    agency: toText(item.agency),
    area: readFeature(item, ["متراژ"], item.area ? `${toText(item.area)} متر` : "-"),
    badges: Array.isArray(item.badges) ? item.badges : [],
    imageClassName: image ? "" : `ad-card__image--${(index % 4) + 1}`,
    imageCount: String(images.length || (image ? 1 : 0)),
    imageUrl: image ? getApiAssetUrl(image) : undefined,
    priceLabelPrimary: toText(item.price_label),
    priceLabelSecondary: "",
    pricePrimary: formatPrice(item.price),
    priceSecondary: "",
    rooms: readFeature(item, ["اتاق", "خواب"], item.rooms ? `${toText(item.rooms)} اتاق` : "-"),
    status: "",
    timeAndLocation:
      publishedHoursAgo !== undefined
        ? `${new Intl.NumberFormat("fa-IR").format(publishedHoursAgo)} ساعت پیش${location ? ` در ${location}` : ""}`
        : location
          ? `در ${location}`
          : "",
    title: toText(item.title ?? item.label, "آگهی ملک"),
    year: readFeature(item, ["سال ساخت"], toText(item.year, "-")),
  };
}

function mapSearchHistoryItem(
  item: SearchHistoryDto,
  index: number,
): SearchHistoryItem {
  const title = toText(
    item.title ?? item.qsearch ?? item.query ?? item.search ?? item.text,
    "جستجوی آگهی",
  );
  const subtitle = readNestedName(item.category) || toText(item.category_name);

  return {
    id: toText(item.id ?? item._id, String(index + 1)),
    subtitle,
    tags: readSearchTags(item),
    title,
  };
}

export function useCategoryListQuery() {
  return useQuery({
    queryFn: async () => {
      const response = await publicApi
        .get("public/category/list")
        .json<CategoryListResponse>();

      return response.data;
    },
    queryKey: queryKeys.categories.list(),
  });
}

export function useCityListQuery(options?: { enabled?: boolean }) {
  return useQuery({
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const response = await publicApi
        .get("public/city/list")
        .json<CityListResponse>();

      return response.data.map(normalizeCityLogo);
    },
    queryKey: queryKeys.cities.list(),
  });
}

export function useCitySearchQuery({
  enabled = true,
  q = "",
}: {
  enabled?: boolean;
  q?: string;
}) {
  return useQuery({
    enabled,
    queryFn: async () => {
      const response = await publicApi
        .get("public/city/search", { searchParams: { q } })
        .json<CityListResponse>();

      return response.data.map(normalizeCityLogo);
    },
    queryKey: queryKeys.cities.search(q),
  });
}

export function useMostVisitedCityListQuery() {
  return useQuery({
    queryFn: async () => {
      const response = await publicApi
        .get("public/city/mostVisitedList")
        .json<CityListResponse>();

      return response.data.map(normalizeCityLogo);
    },
    queryKey: queryKeys.cities.mostVisited(),
    staleTime: 1000 * 60 * 15,
  });
}

export function useMyProfileQuery() {
  return useQuery({
    queryFn: async () => {
      const response = await api
        .get("me/show")
        .json<ApiDataResponse<UserProfile> | UserProfile>();
      const record = response as Record<string, unknown>;

      return record.data && typeof record.data === "object"
        ? (record.data as UserProfile)
        : (response as UserProfile);
    },
    queryKey: queryKeys.account.profile(),
  });
}

export function useUpdateMyProfileMutation() {
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      api.post("me/update/profile", { json: payload }).json<ApiDataResponse<UserProfile>>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.profile(),
      });
    },
  });
}

export function useAuthorizeMeMutation() {
  return useMutation({
    mutationFn: (payload: AuthorizePayload) =>
      api.post("me/authorize", { json: payload }).json<ApiDataResponse<unknown>>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.profile(),
      });
    },
  });
}

export function useWalletPaymentsQuery() {
  return useQuery({
    queryFn: async (): Promise<WalletPaymentsResult> => {
      const response = await api.get("me/wallet/payments").json<
        | ApiDataResponse<WalletPayment[] | { balance?: number | string; payments?: WalletPayment[] }>
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
    },
    queryKey: queryKeys.account.walletPayments(),
  });
}

export function useMyAdsQuery({ page = 1, type }: { page?: number; type: MyAdsType }) {
  return useQuery({
    queryFn: async () =>
      unwrapList(
        await api
          .get("me/myAds", { searchParams: { page, type } })
          .json<ApiListResponse<AdvertisementItem>>(),
      ),
    queryKey: queryKeys.account.myAds({ page, type }),
  });
}

async function getMyBadges() {
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

export function useMyBadgesQuery() {
  return useQuery({
    queryFn: getMyBadges,
    queryKey: queryKeys.account.badges(),
  });
}

export function useAdvertiseBadgesQuery() {
  return useQuery({
    queryFn: getMyBadges,
    queryKey: queryKeys.account.bookmarks(),
  });
}

export function useToggleAdvertiseBadgeMutation() {
  return useMutation({
    mutationFn: (advertiseId: string) =>
      api
        .post(`me/advertise/badges/create/${advertiseId}`)
        .json<ApiDataResponse<unknown>>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.bookmarks(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.badges(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.advertisements.all,
      });
    },
  });
}

export function useDeleteAdvertiseBadgeMutation() {
  return useMutation({
    mutationFn: (advertiseId: string) =>
      api
        .delete(`me/advertise/badges/delete/${advertiseId}`)
        .json<ApiDataResponse<unknown>>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.bookmarks(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.badges(),
      });
    },
  });
}

export function useMyNotesQuery() {
  return useQuery({
    queryFn: async () =>
      unwrapList(await api.get("me/notes").json<ApiListResponse<NoteItem>>()),
    queryKey: queryKeys.account.notes(),
  });
}

async function getAdvertisementList({
  categoryId,
  cityId,
  page = 1,
  perPage = defaultPerPage,
}: AdvertisementListParams) {
  const response = await publicApi
    .get("public/advertise", {
      searchParams: {
        category_id: categoryId,
        city_id: cityId,
        page,
        per_page: perPage,
      },
    })
    .json<AdvertisementListResponse>();
  const data = Array.isArray(response) ? response : response.data ?? [];
  const meta = Array.isArray(response)
    ? undefined
    : response.meta ?? response.pagination;
  const currentPage = meta?.current_page ?? meta?.page ?? page;
  const lastPage = meta?.last_page ?? meta?.total_pages;
  const total = meta?.total;
  const resolvedPerPage = meta?.per_page ?? perPage;

  return {
    data,
    hasNextPage:
      typeof lastPage === "number"
        ? currentPage < lastPage
        : typeof total === "number"
          ? currentPage * resolvedPerPage < total
          : data.length >= perPage,
    page: currentPage,
  } satisfies AdvertisementPage;
}

export function useAdvertisementInfiniteQuery({
  categoryId,
  cityId,
  perPage = 10,
}: Pick<AdvertisementListParams, "categoryId" | "cityId" | "perPage">) {
  return useInfiniteQuery<
    AdvertisementPage,
    Error,
    { pages: AdvertisementPage[]; pageParams: number[] },
    ReturnType<typeof queryKeys.advertisements.list>,
    number
  >({
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getAdvertisementList({
        categoryId,
        cityId,
        page: pageParam,
        perPage,
      }),
    queryKey: queryKeys.advertisements.list({ categoryId, cityId, perPage }),
  });
}

export function useAdvertisementDetailQuery(id: string | null) {
  return useQuery({
    enabled: Boolean(id),
    queryFn: async (): Promise<AdvertisementItem> => {
      const response = await publicApi
        .get(`public/advertise/${id ?? ""}`)
        .json<AdvertisementShowResponse>();

      return "data" in response && response.data
        ? (response.data as AdvertisementItem)
        : (response as AdvertisementItem);
    },
    queryKey: queryKeys.advertisements.detail(id ?? ""),
  });
}

export function useSearchHistoryQuery({
  enabled = true,
  qsearch,
}: {
  enabled?: boolean;
  qsearch?: string;
}) {
  return useQuery({
    enabled,
    queryFn: async () => {
      const response = await api
        .get("me/search-history/list", { searchParams: { qsearch } })
        .json<SearchHistoryResponse>();
      const data = Array.isArray(response) ? response : response.data ?? [];

      return data.map(mapSearchHistoryItem);
    },
    queryKey: queryKeys.searchHistory.list(qsearch),
  });
}

export function useDeleteSearchHistoryMutation() {
  return useMutation({
    mutationFn: (id: string) => api.delete(`me/search-history/${id}`).json(),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.searchHistory.all,
      });
    },
  });
}
