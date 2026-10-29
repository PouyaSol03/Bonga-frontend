import { api } from "../../../../shared/api/api";
import { normalizeRows, unwrapRecord } from "./crmBase";

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
  status?: AdvertiseStatus;
  trackCode?: string;
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
  owner_type: string;
  virtual_tour_link: string;
  images: string[];
  target_owner_type?: "user" | "agency";
  target_owner_id?: string | number;
  features?: { key: string; value: unknown }[];
};

export async function listCrmAdvertises(filters: CrmAdvertiseFilters = {}) {
  const body: Record<string, unknown> = {
    page: 1,
    per_page: 50,
  };

  if (filters.status !== undefined) body.status = filters.status;
  if (filters.trackCode?.trim()) body.track_code = filters.trackCode.trim();

  return normalizeRows(await api.post("panel/advertise/list", { json: body }).json<unknown>());
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
      formData.append("existing_images", JSON.stringify(value));
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
