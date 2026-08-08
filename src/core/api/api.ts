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
  const normalizedValue = trimTrailingSlashes(value);

  if (!normalizedValue) return "";
  if (/\/api$/i.test(normalizedValue)) return normalizedValue;

  return `${normalizedValue}/api`;
}

function normalizeWebSocketBaseUrl(value: string) {
  return trimTrailingSlashes(value).replace(/\/api$/i, "");
}

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export const baseUrl = normalizeApiBaseUrl(configuredApiBaseUrl);

export const websocketBaseUrl = normalizeWebSocketBaseUrl(
  import.meta.env.VITE_WEBSOCKET_BASE_URL ?? configuredApiBaseUrl,
);

function getRequestPathname(request: Request) {
  try {
    return new URL(request.url).pathname;
  } catch {
    return "";
  }
}

function isPublicApiRequest(request: Request, options: Options) {
  if (options.context?.authenticated === false) return true;

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

function getApiUserType(): ApiUserType {
  const activeRole = getActiveAuthRole(getStoredAuthSession());

  // The frontend uses `super-admin` internally, while the backend header
  // contract expects `superadmin`. Keep that translation at the API boundary.
  const candidate = activeRole === "super-admin" ? "superadmin" : activeRole;

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
    clearStoredAuthSession();
    if (!window.location.pathname.startsWith("/login")) {
      const returnTo = `${window.location.pathname}${window.location.search}`;
      window.sessionStorage.setItem("bonga-login-redirect-path", returnTo);
      window.location.assign("/login");
    }
    return;
  }

  if (status === 403 && window.location.pathname !== "/403") {
    // window.location.assign("/403");
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
          if (response.status === 401 || response.status === 403) {
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
      async ({ error }) => {
        if (error instanceof HTTPError) {
          if (error.response.status === 401 || error.response.status === 403) {
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
          request.headers.set("user-type", getApiUserType());
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

export const api = ky.create(apiOptions);
export const publicApi = api.extend({
  context: {
    authenticated: false,
  },
});

export function getApiErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function isUnauthorizedApiError(error: unknown) {
  if (error instanceof ApiError) return error.status === 401;
  if (error instanceof HTTPError) return error.response.status === 401;

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
  return path;
}
