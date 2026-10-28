import {
  type AdvertisementCheckoutResponse,
  type AdvertisementCheckout,
} from "./checkout-types";
import { ApiError, baseUrl } from "../../../../shared/api/api";

export function unwrapAdvertisementCheckoutResponse(
  response: AdvertisementCheckoutResponse,
): AdvertisementCheckout {
  if ("items" in response && Array.isArray(response.items)) {
    return response;
  }

  if (
    "data" in response &&
    response.data &&
    Array.isArray(response.data.items)
  ) {
    return response.data;
  }

  if (
    "result" in response &&
    response.result &&
    Array.isArray(response.result.items)
  ) {
    return response.result;
  }

  throw new ApiError(500, "اطلاعات پرداخت آگهی از سرور دریافت نشد.");
}

export function normalizeCheckoutUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;

  const normalizedValue = value.trim();

  if (
    !/^https?:\/\//i.test(normalizedValue) &&
    !normalizedValue.startsWith("/")
  ) {
    return null;
  }

  try {
    const fallbackOrigin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost";
    const resolvedBaseUrl = baseUrl
      ? new URL(baseUrl, fallbackOrigin).toString()
      : fallbackOrigin;
    const url = new URL(normalizedValue, resolvedBaseUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    return url.toString();
  } catch {
    return null;
  }
}

export function findCheckoutPaymentUrl(
  value: unknown,
  depth = 0,
): string | null {
  if (depth > 4) return null;

  const directUrl = normalizeCheckoutUrl(value);

  if (directUrl) return directUrl;
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;

  for (const key of [
    "payment_url",
    "paymentUrl",
    "gateway_url",
    "gatewayUrl",
    "redirect_url",
    "redirectUrl",
    "url",
  ]) {
    const url = normalizeCheckoutUrl(record[key]);

    if (url) return url;
  }

  for (const key of ["data", "result", "payment", "intent", "gateway"]) {
    const nestedUrl = findCheckoutPaymentUrl(record[key], depth + 1);

    if (nestedUrl) return nestedUrl;
  }

  return null;
}
