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

function readErrorMessage(payload: ErrorPayload) {
  if (!payload) return null;

  for (const key of ["message", "error", "detail"]) {
    const value = payload[key];

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
  credentials: "include",
  headers: {
    Accept: "application/json",
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
    beforeError: [
      async ({ error }) => {
        if (error instanceof HTTPError) {
          if (error.response.status === 401) {
            clearStoredAuthSession();
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
export const uploadApi = api.extend({});

export function getApiErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function isUnauthorizedApiError(error: unknown) {
  if (error instanceof ApiError) return error.status === 401;
  if (error instanceof HTTPError) return error.response.status === 401;

  return false;
}

export function isTransientApiError(error: unknown) {
  if (error instanceof ApiError) return error.status >= 500;
  if (error instanceof HTTPError) return error.response.status >= 500;

  return error instanceof Error;
}

export function getApiAssetUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;

  return `${baseUrl}/${resolveAssetPath(path)}`;
}
