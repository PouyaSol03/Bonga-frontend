import ky, { HTTPError, type Options } from "ky";

import {
  clearStoredAuthSession,
  getStoredAccessToken,
} from "../auth/auth-storage";

export type ApiQueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

type ErrorPayload = Record<string, unknown> | null;

export const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(
  /\/$/,
  "",
);

function normalizeSearchParams(params?: ApiQueryParams) {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== undefined && value !== null && value !== "";
    }),
  ) as Record<string, string | number | boolean>;
}

function resolveAssetPath(path: string) {
  return path.replace(/^\/+/, "");
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
    window.location.assign("/403");
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
  response?: Response;
  status: number;

  constructor(status: number, message: string, response?: Response) {
    super(message);
    this.name = "ApiError";
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

          return new ApiError(
            error.response.status,
            readErrorMessage(payload) ?? "درخواست با خطا مواجه شد.",
            error.response,
          );
        }

        return error;
      },
    ],
    beforeRequest: [
      ({ request, options }) => {
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

export function getApiAssetUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;

  return `${baseUrl}/${resolveAssetPath(path)}`;
}
