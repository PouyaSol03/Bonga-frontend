import ky, { HTTPError, type Options } from "ky";

import {
  clearStoredAuthSession,
  getActiveAuthRole,
  getStoredAccessToken,
  getStoredAuthSession,
} from "../auth/auth-storage";

export type ApiQueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

type ErrorPayload = Record<string, unknown> | null;

function trimTrailingSlashes(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function normalizeApiBaseUrl(value: string) {
  const trimmed = trimTrailingSlashes(value);
  if (import.meta.env?.DEV && trimmed) {
    try {
      if (/^https?:\/\//i.test(trimmed)) {
        const url = new URL(trimmed);
        if (!url.hostname.includes("bonga.exirfirm.com")) {
          return trimTrailingSlashes(url.pathname);
        }
      }
    } catch {
      // ignore
    }
  }
  return trimmed;
}

function normalizeWebSocketBaseUrl(value: string) {
  return trimTrailingSlashes(value).replace(/\/(?:api(?:\/v\d+)?)?$/i, "");
}

const configuredApiBaseUrl = import.meta.env?.VITE_API_BASE_URL ?? "";
const configuredApiBaseUrlV2 =
  import.meta.env?.VITE_API_BASE_URL_V2 ??
  (configuredApiBaseUrl
    ? /\/v1\/?$/i.test(configuredApiBaseUrl)
      ? configuredApiBaseUrl.replace(/\/v1\/?$/i, "/v2")
      : `${configuredApiBaseUrl.replace(/\/+$/, "")}/v2`
    : "/api/v2");

export const baseUrl = normalizeApiBaseUrl(configuredApiBaseUrl);
export const baseUrlV2 = normalizeApiBaseUrl(configuredApiBaseUrlV2);
export const baseUrl_v2 = baseUrlV2;

export const websocketBaseUrl = normalizeWebSocketBaseUrl(
  import.meta.env?.VITE_WEBSOCKET_BASE_URL ?? configuredApiBaseUrl,
);

function getRequestPathname(request: Request) {
  try {
    return new URL(request.url).pathname;
  } catch {
    return "";
  }
}

function isPublicApiRequest(request: Request, options?: Options) {
  if (options?.context?.authenticated === false) return true;

  return /(?:^|\/)public(?:\/|$)/i.test(getRequestPathname(request));
}

function isAuthApiRequest(request: Request) {
  const pathname = getRequestPathname(request);

  return (
    /(?:^|\/)auth(?:\/|$)/i.test(pathname) ||
    /(?:^|\/)(?:login|logout|otp|request-otp|verify-otp|resend-otp)(?:\/|$)/i.test(pathname)
  );
}

type ApiUserType =
  | "superadmin"
  | "user"
  | "real_estate_manager"
  | "real_estate_consultant"
  | "independent_consultant"
  | "crm_advertise_manager"
  | "crm_finance_manager"
  | "support";

const allowedApiUserTypes = new Set<ApiUserType>([
  "superadmin",
  "user",
  "real_estate_manager",
  "real_estate_consultant",
  "independent_consultant",
  "crm_advertise_manager",
  "crm_finance_manager",
  "support",
]);

function isCrmOrAdminContext(request?: Request): boolean {
  if (typeof window !== "undefined" && window.location?.pathname) {
    const pagePath = window.location.pathname.toLowerCase();
    if (
      pagePath.startsWith("/crm") ||
      pagePath.startsWith("/super-admin") ||
      pagePath.startsWith("/superadmin")
    ) {
      return true;
    }
  }

  if (request) {
    const requestPath = getRequestPathname(request).toLowerCase();
    if (
      requestPath.startsWith("/crm") ||
      requestPath.startsWith("/panel") ||
      requestPath.startsWith("/super-admin") ||
      requestPath.startsWith("/superadmin")
    ) {
      return true;
    }
  }

  return false;
}

export function getApiUserType(request?: Request): ApiUserType {
  const activeRole = getActiveAuthRole(getStoredAuthSession());

  // The frontend uses `super-admin` internally, while the backend header
  // contract expects `superadmin`. Keep that translation at the API boundary.
  const candidate = activeRole === "super-admin" ? "superadmin" : activeRole;

  if (
    candidate === "superadmin" ||
    candidate === "crm_advertise_manager" ||
    candidate === "crm_finance_manager" ||
    candidate === "support"
  ) {
    if (isCrmOrAdminContext(request)) {
      return candidate as ApiUserType;
    }
    return "user";
  }

  if (candidate && allowedApiUserTypes.has(candidate as ApiUserType)) {
    return candidate as ApiUserType;
  }

  return "user";
}

function normalizeSearchParams(params?: ApiQueryParams) {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== undefined && value !== null && value !== "";
    }),
  ) as Record<string, string | number | boolean>;
}

function redirectForAuthError(status: number) {
  if (typeof window === "undefined") return;

  if (status === 401) {
    const hasSession = Boolean(getStoredAccessToken());
    clearStoredAuthSession();
    if (hasSession && !window.location.pathname.startsWith("/login")) {
      const returnTo = `${window.location.pathname}${window.location.search}`;
      window.sessionStorage.setItem("bonga-login-redirect-path", returnTo);
      window.location.assign("/login/phone");
    }
    return;
  }
}

function readErrorMessage(payload: ErrorPayload) {
  if (!payload) return null;

  for (const key of ["message", "error", "detail"]) {
    const value = payload[key];

    if (Array.isArray(value)) {
      const messages = value
        .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        .map((item) => item.trim());

      if (messages.length > 0) return messages.join("، ");
    }

    if (typeof value === "string" && value.trim()) return value;
  }

  return null;
}

export class ApiError extends Error {
  code?: string;
  errors?: Record<string, unknown>;
  response?: Response;
  status: number;

  constructor(
    status: number,
    message: string,
    response?: Response,
    details?: { code?: string; errors?: Record<string, unknown> },
  ) {
    super(message);
    this.name = "ApiError";
    this.code = details?.code;
    this.errors = details?.errors;
    this.response = response;
    this.status = status;
  }
}

const apiOptions: Options = {
  cache: "no-store",
  credentials: "include",
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  hooks: {
    init: [
      (options) => {
        if (
          options.searchParams &&
          typeof options.searchParams === "object" &&
          !Array.isArray(options.searchParams) &&
          !(options.searchParams instanceof URLSearchParams)
        ) {
          options.searchParams = normalizeSearchParams(
            options.searchParams as ApiQueryParams,
          );
        }
      },
    ],
    afterResponse: [
      ({ request, options, response }) => {
        if (options.context?.allowNonJsonResponse === true) {
          return;
        }

        if (request.method === "HEAD" || response.status === 204 || response.status === 205) {
          return;
        }

        const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
        const isJsonResponse =
          contentType.includes("application/json") ||
          contentType.includes("application/problem+json") ||
          /\bapplication\/[a-z0-9.+-]+\+json\b/.test(contentType);

        if (!isJsonResponse) {
          if (
            response.status === 401 &&
            !isAuthApiRequest(request) &&
            !isPublicApiRequest(request, options)
          ) {
            redirectForAuthError(response.status);
          }

          const message = contentType.includes("text/html")
            ? "پاسخ HTML غیرمنتظره از سرور دریافت شد. مسیر API یا نشست کاربر را بررسی کنید."
            : "پاسخ API باید با فرمت JSON ارسال شود.";

          throw new ApiError(response.status || 500, message, response);
        }
      },
    ],
    beforeError: [
      async ({ error, request }) => {
        if (error instanceof HTTPError) {
          const isAuth = request ? isAuthApiRequest(request) : false;
          const isPublic = request ? isPublicApiRequest(request) : false;
          if (error.response.status === 401 && !isAuth && !isPublic) {
            redirectForAuthError(error.response.status);
          }

          const payload =
            error.data && typeof error.data === "object"
              ? (error.data as ErrorPayload)
              : null;

          const code = typeof payload?.code === "string" ? payload.code : undefined;
          const errors = payload?.errors && typeof payload.errors === "object" && !Array.isArray(payload.errors)
            ? payload.errors as Record<string, unknown>
            : undefined;

          return new ApiError(
            error.response.status,
            readErrorMessage(payload) ?? "درخواست با خطا مواجه شد.",
            error.response,
            { code, errors },
          );
        }

        return error;
      },
    ],
    beforeRequest: [
      ({ request, options }) => {
        const shouldOmitUserType =
          isPublicApiRequest(request, options) || isAuthApiRequest(request);

        if (shouldOmitUserType) {
          // Public and authentication flows must never receive the active account type.
          request.headers.delete("user-type");
        } else {
          request.headers.set("user-type", getApiUserType(request));
        }

        if (options.context.authenticated === false) return;

        const accessToken = getStoredAccessToken();

        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
  },
  parseJson: (text) => (text ? JSON.parse(text) : null),
  prefix: baseUrl || "/",
  retry: 0,
};

export type V2RoleSegment =
  | "agency"
  | "independent-consultant"
  | "personal"
  | "agency-consultant"
  | "superadmin";

export function getV2RoleSegment(role?: string | null): V2RoleSegment {
  switch (role) {
    case "agency":
    case "real_estate_manager":
      return "agency";
    case "independent-consultant":
    case "independent_consultant":
      return "independent-consultant";
    case "agency-consultant":
    case "real_estate_consultant":
      return "agency-consultant";
    case "superadmin":
    case "super-admin":
      return "superadmin";
    case "personal":
    case "user":
    default:
      return "personal";
  }
}

export function getActiveV2Role(): V2RoleSegment {
  const session = getStoredAuthSession();
  const activeRole = getActiveAuthRole(session);
  return getV2RoleSegment(activeRole);
}

export function resolveV2Url(inputUrl: string): string {
  const base = baseUrlV2 || "/api/v2";
  if (!base) return inputUrl;

  try {
    const fallbackOrigin =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "http://localhost";
    const parsedBase = new URL(base, fallbackOrigin);
    const currentUrl = new URL(inputUrl, parsedBase.origin);

    const basePath = parsedBase.pathname.replace(/\/+$/, "");
    let endpoint = currentUrl.pathname;
    if (endpoint.startsWith(basePath)) {
      endpoint = endpoint.slice(basePath.length);
    }
    endpoint = endpoint.replace(/^\/+/, "");

    const v2Roles: V2RoleSegment[] = [
      "agency",
      "independent-consultant",
      "personal",
      "agency-consultant",
      "superadmin",
    ];

    const isGlobalEndpoint =
      endpoint === "auth" ||
      endpoint.startsWith("auth/") ||
      endpoint === "public" ||
      endpoint.startsWith("public/");

    const isShowEndpoint = /(?:^|\/)show(?:\/|$)/.test(endpoint);
    if (!isGlobalEndpoint && !isShowEndpoint && /^superadmin(?:\/|$)/.test(endpoint)) {
      endpoint = endpoint.replace(/^superadmin(?=\/|$)/, "personal");
    }

    const hasRole =
      isGlobalEndpoint ||
      v2Roles.some((r) => endpoint === r || endpoint.startsWith(`${r}/`));

    const activeRole = hasRole ? "" : getActiveV2Role();
    const role = activeRole === "superadmin" && !isShowEndpoint ? "personal" : activeRole;
    const finalEndpoint = hasRole
      ? endpoint
      : endpoint
        ? `${role}/${endpoint}`
        : role;
    const finalPath = `${basePath}/${finalEndpoint}`.replace(/\/+/g, "/");

    return `${currentUrl.origin}${finalPath}${currentUrl.search}`;
  } catch {
    return inputUrl;
  }
}

const apiOptionsV2: Options = {
  ...apiOptions,
  prefix: baseUrlV2 || "/api/v2",
  hooks: {
    ...apiOptions.hooks,
    beforeRequest: [
      async ({ request, options }) => {
        // v2 does not send user-type
        request.headers.delete("user-type");

        if (options.context?.authenticated !== false) {
          const accessToken = getStoredAccessToken();
          if (accessToken) {
            request.headers.set("Authorization", `Bearer ${accessToken}`);
          }
        }

        const resolvedUrl = resolveV2Url(request.url);
        if (resolvedUrl !== request.url) {
          const hasBody = !["GET", "HEAD"].includes(request.method);
          const body =
            hasBody && request.body
              ? await request.clone().arrayBuffer()
              : undefined;
          return new Request(resolvedUrl, {
            body,
            cache: request.cache,
            credentials: request.credentials,
            headers: request.headers,
            integrity: request.integrity,
            keepalive: request.keepalive,
            method: request.method,
            mode: request.mode,
            referrer: request.referrer,
            referrerPolicy: request.referrerPolicy,
            signal: request.signal,
          });
        }
      },
    ],
  },
};

export const api = ky.create(apiOptions);
export const apiV1 = api;
export const clientV1 = api;

export const apiV2 = ky.create(apiOptionsV2);
export const clientV2 = apiV2;

export const publicApi = api.extend({
  context: {
    authenticated: false,
  },
});

export const publicApiV2 = apiV2.extend({
  context: {
    authenticated: false,
  },
});

export const client = {
  v1: apiV1,
  v2: apiV2,
};

export function getApiErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function isUnauthorizedApiError(error: unknown) {
  if (error instanceof ApiError) return error.status === 401;
  if (error instanceof HTTPError) return error.response.status === 401;

  return false;
}

export function isForbiddenApiError(error: unknown) {
  if (error instanceof ApiError) return error.status === 403;
  if (error instanceof HTTPError) return error.response.status === 403;
  if (Boolean(error) && typeof error === "object") {
    const err = error as { status?: number; response?: { status?: number } };
    return err.status === 403 || err.response?.status === 403;
  }

  return false;
}


export function getApiErrorCode(error: unknown) {
  return error instanceof ApiError ? error.code : undefined;
}

export function getApiFieldError(error: unknown, field: string) {
  if (!(error instanceof ApiError) || !error.errors) return null;

  const value = error.errors[field];
  if (typeof value === "string" && value.trim()) return value.trim();

  if (Array.isArray(value)) {
    const message = value.find((item): item is string => typeof item === "string" && item.trim().length > 0);
    return message?.trim() ?? null;
  }

  return null;
}

export function getApiAssetUrl(path: string) {
  const normalizedPath = path.trim();

  if (!normalizedPath || normalizedPath.toLowerCase().includes("data:image/")) {
    return "";
  }

  if (normalizedPath.startsWith("http://") || normalizedPath.startsWith("https://")) {
    return normalizedPath;
  }

  const backendOrigin = (import.meta as any).env?.VITE_API_URL
    ? String((import.meta as any).env.VITE_API_URL).replace(/\/api.*$/, "").replace(/\/+$/, "")
    : "";

  if (backendOrigin && normalizedPath.startsWith("/")) {
    return `${backendOrigin}${normalizedPath}`;
  }

  return normalizedPath;
}
