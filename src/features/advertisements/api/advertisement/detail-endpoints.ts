import { type AdvertisementItem } from "./item-types";
import { api, publicApi } from "../../../../shared/api/api";
import {
  type AdvertisementShowResponse,
  type AdvertisementDailyViews,
  type AdvertisementDailyViewsResponse,
  type AdvertisementDailyViewPoint,
  type AdvertisementPayment,
  type AdvertisementAccountShowResponse,
} from "./detail-types";
import {
  unwrapAdvertisementShowResponse,
  asRecord,
  normalizeAdvertisementLoan,
} from "./detail-response";
import {
  getV2AdvertisementPayments,
  getV2Preview,
} from "../v2/advertisement-v2-lifecycle.service";

export async function getAdvertisementDetail(
  id: string,
): Promise<AdvertisementItem> {
  const response = await api
    .get(`public/advertise/${encodeURIComponent(id)}`)
    .json<AdvertisementShowResponse>();

  return unwrapAdvertisementShowResponse(response);
}

export async function getAdvertisementDailyViews(
  id: string,
): Promise<AdvertisementDailyViews> {
  const response = await publicApi
    .get(`public/advertise/view/preview-chart/${encodeURIComponent(id)}`)
    .json<AdvertisementDailyViewsResponse>();
  const data = Array.isArray(response.data)
    ? response.data
        .map((item) => {
          const count = Number(item.count ?? 0);
          const date = typeof item.date === "string" ? item.date.trim() : "";

          if (!date || !Number.isFinite(count)) return null;

          return {
            count: Math.max(0, count),
            date,
          } satisfies AdvertisementDailyViewPoint;
        })
        .filter((item): item is AdvertisementDailyViewPoint => item !== null)
    : [];
  const totalView = Number(response.total_view ?? 0);

  return {
    data,
    totalView: Number.isFinite(totalView) ? Math.max(0, totalView) : 0,
  };
}

export async function getAdvertisementPayments(
  id: string,
): Promise<AdvertisementPayment[]> {
  const response = await getV2AdvertisementPayments(id);
  return response.data;
}

export async function getAdvertisementPreview(
  id: string,
): Promise<AdvertisementItem> {
  const response = await getV2Preview(id);
  return unwrapAdvertisementShowResponse(response as AdvertisementShowResponse);
}

export async function getAgencyAdvertisementPreview(
  id: string,
): Promise<AdvertisementItem> {
  const response = await getV2Preview(id);
  return unwrapAdvertisementShowResponse(response as AdvertisementShowResponse);
}

export async function getMyAdvertisementDetail(
  id: string,
): Promise<AdvertisementItem> {
  const response = await api
    .get(`me/advertise/get/${encodeURIComponent(id)}`)
    .json<AdvertisementAccountShowResponse>();

  const advertise =
    "advertise" in response
      ? (asRecord(response.advertise) as AdvertisementItem | null)
      : null;
  if (advertise) {
    const normalized = normalizeAdvertisementLoan(advertise);
    const category =
      typeof response.category === "string" ? response.category.trim() : "";

    return category
      ? {
          ...normalized,
          category,
          category_title: normalized.category_title ?? category,
        }
      : normalized;
  }

  if ("data" in response && response.data)
    return normalizeAdvertisementLoan(response.data as AdvertisementItem);
  return normalizeAdvertisementLoan(response as AdvertisementItem);
}
