import { getStoredAuthSession } from "./authSession";

type ApiRequestOptions = RequestInit & {
  authenticated?: boolean;
};

type ErrorPayload = Record<string, unknown> | null;

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function resolveEndpoint(path: string) {
  return `${apiBaseUrl}${path}`;
}

export function getApiAssetUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parsePayload(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.text();

  if (!body || !contentType.includes("json")) {
    return null;
  }

  return JSON.parse(body) as unknown;
}

function readErrorMessage(payload: ErrorPayload) {
  if (!payload) {
    return null;
  }

  for (const key of ["message", "error", "detail"]) {
    const value = payload[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

export async function apiRequest<T>(
  path: string,
  { authenticated = true, headers: inputHeaders, ...init }: ApiRequestOptions = {},
) {
  const headers = new Headers(inputHeaders);

  headers.set("Accept", "application/json");

  if (init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const accessToken = getStoredAuthSession()?.accessToken;

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  const response = await fetch(resolveEndpoint(path), {
    ...init,
    credentials: "include",
    headers,
  });
  const payload = await parsePayload(response);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      readErrorMessage(payload as ErrorPayload) ?? "درخواست با خطا مواجه شد.",
    );
  }

  return payload as T;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}
