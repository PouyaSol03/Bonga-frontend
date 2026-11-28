import { api } from "../../../../shared/api/api";
import { findPaginationRecord, normalizeRows, unwrapRecord, type CrmRecord } from "./crmBase";

export type AdvertiseStatus =
  | "wait_for_payment"
  | "wait_for_admin"
  | "wait_for_agency"
  | "accepted"
  | "needs_edit"
  | "rejected"
  | "deleted"
  | "expired"
  | "incomplete";

export type CrmAdvertiseFilters = {
  page?: number;
  perPage?: number;
  status?: AdvertiseStatus;
  trackCode?: string;
};

export type CrmAdvertisePage = {
  data: CrmRecord[];
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
};

export type CrmAdvertisePayload = {
  category_id?: string;
  form_code: string;
  title: string;
  neighborhood_id: string;
  lat: number;
  lng: number;
  contact_type: string[];
  owner_phone: string;
  description: string;
  owner_type?: string;
  virtual_tour_link: string;
  images: string[];
  target_owner_type?: "user" | "agency";
  target_owner_id?: string | number;
  features?: { key: string; value: unknown }[];
};

/**
 * Fetches a paginated list of CRM advertises with optional status and track-code filters.
 */
export async function listCrmAdvertisesPaginated(
  filters: CrmAdvertiseFilters = {},
): Promise<CrmAdvertisePage> {
  const page = filters.page ?? 1;
  const perPage = filters.perPage ?? 24;
  const body: Record<string, unknown> = {
    page,
    per_page: perPage,
  };

  if (filters.status !== undefined) body.status = filters.status;
  if (filters.trackCode?.trim()) body.track_code = filters.trackCode.trim();

  const payload = await api.post("panel/advertise/list", { json: body }).json<unknown>();
  const data = normalizeRows(payload);
  const pagination = findPaginationRecord(payload);
  const totalValue = Number(pagination.total ?? pagination.count ?? data.length);
  const pageValue = Number(pagination.page ?? pagination.current_page ?? page);
  const perPageValue = Number(pagination.per_page ?? pagination.perPage ?? perPage);
  const resolvedPerPage =
    Number.isFinite(perPageValue) && perPageValue > 0 ? perPageValue : perPage;
  const resolvedTotal = Number.isFinite(totalValue) && totalValue >= 0 ? totalValue : data.length;
  const explicitLastPage = Number(
    pagination.last_page ?? pagination.lastPage ?? pagination.total_pages,
  );
  const resolvedLastPage =
    Number.isFinite(explicitLastPage) && explicitLastPage > 0
      ? explicitLastPage
      : Math.max(1, Math.ceil(resolvedTotal / resolvedPerPage));

  return {
    data,
    page: Number.isFinite(pageValue) && pageValue > 0 ? pageValue : page,
    perPage: resolvedPerPage,
    total: resolvedTotal,
    lastPage: resolvedLastPage,
  };
}

export async function listCrmAdvertises(filters: CrmAdvertiseFilters = {}) {
  const result = await listCrmAdvertisesPaginated({
    ...filters,
    page: filters.page ?? 1,
    perPage: filters.perPage ?? 50,
  });
  return result.data;
}

export async function countCrmAdvertisesByStatus(
  status: AdvertiseStatus | string,
): Promise<number> {
  try {
    const res = await api
      .post("panel/advertise/list", {
        json: {
          page: 1,
          per_page: 1,
          status,
        },
      })
      .json<{ total?: number; count?: number }>();
    return Number(res.total ?? res.count ?? 0);
  } catch {
    return 0;
  }
}

export async function getCrmAdvertise(id: string) {
  return unwrapRecord(await api.get(`panel/advertise/show/${id}`).json<unknown>(), [
    "advertise",
    "data",
    "result",
  ]);
}

function buildCrmAdvertiseFormData(payload: CrmAdvertisePayload, files: File[]) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;

    if (key === "images") {
      const existingUrls = Array.isArray(value)
        ? value.filter((v): v is string => typeof v === "string" && !v.startsWith("data:image/"))
        : [];
      existingUrls.forEach((url) => {
        formData.append("existing_images", url);
      });
      continue;
    }

    if (Array.isArray(value) || typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      continue;
    }

    formData.append(key, String(value));
  }

  files.forEach((file) => {
    formData.append("images", file, file.name);
  });

  return formData;
}

export async function saveCrmAdvertise(
  id: string | null,
  payload: CrmAdvertisePayload,
  files: File[] = [],
) {
  const formData = buildCrmAdvertiseFormData(payload, files);

  return unwrapRecord(
    await api
      .post(id ? `panel/advertise/update/${id}` : "panel/advertise/create", { body: formData })
      .json<unknown>(),
    ["advertise", "data", "result"],
  );
}

export async function uploadCrmAdvertiseImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await api
      .post("me/img/upload/advertise", { body: formData })
      .json<Record<string, unknown>>();

    const data = (res.data || res.result || res) as Record<string, unknown>;
    const path =
      typeof data === "string"
        ? data
        : (data?.path || data?.url || data?.image || data?.file || res.path || res.url || res.image);
    if (typeof path === "string" && path.trim()) return path.trim();
  } catch {
    try {
      const res = await api
        .post("me/img/upload/advertiseImg", { body: formData })
        .json<Record<string, unknown>>();
      const data = (res.data || res.result || res) as Record<string, unknown>;
      const path =
        typeof data === "string"
          ? data
          : (data?.path || data?.url || data?.image || data?.file || res.path || res.url || res.image);
      if (typeof path === "string" && path.trim()) return path.trim();
    } catch {
      // ignore
    }
  }

  return "";
}

export type CreateCrmAgencyAdvertisePayload = {
  advertisement: Record<string, unknown>;
};

export async function createCrmAgencyAdvertise(
  agencyId: string | number,
  payload: CreateCrmAgencyAdvertisePayload,
) {
  const rawAd = (payload.advertisement || {}) as Record<string, unknown>;
  const { owner_type, target_owner_type, target_owner_id, ...cleanAd } = rawAd;

  const forbiddenFeatureKeys = new Set([
    "agency_id",
    "consultant_id",
    "publisher",
    "has_virtual_tour",
    "has_image",
    "has_video",
    "location",
    "form_code",
    "owner_type",
    "target_owner_type",
    "target_owner_id",
    "request_id",
    "reason",
  ]);

  const features = Array.isArray(cleanAd.features)
    ? (cleanAd.features as Array<{ key?: string; name?: string; label?: string }>).filter((f) => {
        const k = f?.key || f?.name || f?.label;
        return !k || !forbiddenFeatureKeys.has(k);
      })
    : cleanAd.features;

  const body: Record<string, unknown> = {
    advertisement: {
      ...cleanAd,
      ...(features !== undefined ? { features } : {}),
    },
  };

  return unwrapRecord(
    await api
      .post(`panel/agency/${encodeURIComponent(agencyId)}/advertise/create`, {
        json: body,
      })
      .json<unknown>(),
    ["advertise", "data", "result"],
  );
}

export type CreateCrmUserAdvertisePayload = {
  advertisement: Record<string, unknown>;
};

export async function createCrmUserAdvertise(
  userId: string | number,
  payload: CreateCrmUserAdvertisePayload,
) {
  const rawAd = (payload.advertisement || {}) as Record<string, unknown>;
  const { owner_type, target_owner_type, target_owner_id, ...cleanAd } = rawAd;

  const forbiddenFeatureKeys = new Set([
    "agency_id",
    "consultant_id",
    "publisher",
    "has_virtual_tour",
    "has_image",
    "has_video",
    "location",
    "form_code",
    "owner_type",
    "target_owner_type",
    "target_owner_id",
    "request_id",
    "reason",
  ]);

  const features = Array.isArray(cleanAd.features)
    ? (cleanAd.features as Array<{ key?: string; name?: string; label?: string }>).filter((f) => {
        const k = f?.key || f?.name || f?.label;
        return !k || !forbiddenFeatureKeys.has(k);
      })
    : cleanAd.features;

  const body: Record<string, unknown> = {
    advertisement: {
      ...cleanAd,
      ...(features !== undefined ? { features } : {}),
    },
  };

  return unwrapRecord(
    await api
      .post(`panel/personal/${encodeURIComponent(userId)}/advertise/create`, {
        json: body,
      })
      .json<unknown>(),
    ["advertise", "data", "result"],
  );
}

export function updateCrmAdvertiseStatus(id: string, status: AdvertiseStatus, reason?: string) {
  const payload: { reason?: string; status: AdvertiseStatus } = { status };

  if (reason !== undefined) {
    payload.reason = reason.trim();
  }

  return api.post(`panel/advertise/status/${id}`, { json: payload }).json<unknown>();
}

export async function listCrmAdvertiseForms() {
  return normalizeRows(await api.get("public/advertise-form").json<unknown>());
}
