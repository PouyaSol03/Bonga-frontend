import { api } from "../../../../shared/api/api";
import type { ApiDataResponse } from "../../../../shared/api/response";
import type {
  CreateMyAgencyPayload,
  CreateMyAgencyResponse,
  MyAgencyProfile,
  UpdateMyAgencyProfilePayload,
} from "./agency.types";

export function createMyAgency(payload: CreateMyAgencyPayload) {
  return api
    .post("me/agency/create", {
      json: {
        lat: payload.lat,
        lng: payload.lng,
        name: payload.name,
        neighborhood_ids: payload.neighborhood_ids,
      },
    })
    .json<CreateMyAgencyResponse>();
}

function appendAgencyFormValue(
  formData: FormData,
  key: string,
  value: string | number | null | undefined,
) {
  formData.append(key, value === null || value === undefined ? "" : String(value));
}

function normalizeOptionalAgencyValue(value: string | number | null | undefined) {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value.trim() || null;

  return value;
}

function normalizeAgencyNeighborhoodIds(value: unknown) {
  const values = Array.isArray(value)
    ? value
    : value === null || value === undefined
      ? []
      : [value];

  return Array.from(
    new Set(
      values
        .flatMap((item) => String(item ?? "").split(","))
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

export function normalizeMyAgencyProfile(profile: MyAgencyProfile): MyAgencyProfile {
  return {
    ...profile,
    neighborhood_ids: normalizeAgencyNeighborhoodIds(profile.neighborhood_ids),
  };
}

export function unwrapMyAgencyProfile(
  response:
    | ApiDataResponse<MyAgencyProfile>
    | { agency?: MyAgencyProfile; status?: boolean; membership?: unknown }
    | MyAgencyProfile,
) {
  const record = response as Record<string, unknown>;
  const membership = record.membership as MyAgencyProfile["membership"];

  let profile: MyAgencyProfile;
  if (record.agency && typeof record.agency === "object") {
    profile = normalizeMyAgencyProfile(record.agency as MyAgencyProfile);
  } else if (record.data && typeof record.data === "object") {
    profile = normalizeMyAgencyProfile(record.data as MyAgencyProfile);
  } else {
    profile = normalizeMyAgencyProfile(response as MyAgencyProfile);
  }

  if (membership && !profile.membership) {
    profile.membership = membership;
  }

  return profile;
}

export async function getMyAgencyProfile() {
  const response = await api
    .get("me/agency/show")
    .json<
      | ApiDataResponse<MyAgencyProfile>
      | { agency?: MyAgencyProfile; status?: boolean }
      | MyAgencyProfile
    >();

  return unwrapMyAgencyProfile(response);
}

export async function updateMyAgencyProfile(payload: UpdateMyAgencyProfilePayload) {
  const fields = {
    about_us: normalizeOptionalAgencyValue(payload.about_us),
    address: normalizeOptionalAgencyValue(payload.address),
    agency_type: normalizeOptionalAgencyValue(payload.agency_type),
    lat: normalizeOptionalAgencyValue(payload.lat),
    lng: normalizeOptionalAgencyValue(payload.lng),
    name: payload.name.trim(),
    neighborhood_id: normalizeOptionalAgencyValue(payload.neighborhood_id),
    neighborhood_ids: Array.from(
      new Set(payload.neighborhood_ids.map((item) => item.trim()).filter(Boolean)),
    ).join(","),
    phone1: normalizeOptionalAgencyValue(payload.phone1),
    phone2: normalizeOptionalAgencyValue(payload.phone2),
    phone3: normalizeOptionalAgencyValue(payload.phone3),
    telegram: normalizeOptionalAgencyValue(payload.telegram),
    whatsapp: normalizeOptionalAgencyValue(payload.whatsapp),
    instagram: normalizeOptionalAgencyValue(payload.instagram),
    working_hours: normalizeOptionalAgencyValue(payload.working_hours),
  };
  const hasFile = Boolean(payload.logo || payload.img);
  const request = hasFile
    ? (() => {
        const formData = new FormData();

        Object.entries(fields).forEach(([key, value]) => {
          appendAgencyFormValue(formData, key, value);
        });
        if (payload.logo) formData.append("logo", payload.logo);
        if (payload.img) formData.append("img", payload.img);

        return api.post("me/agency/update/profile", { body: formData });
      })()
    : api.post("me/agency/update/profile", { json: fields });

  const response = await request.json<
    | ApiDataResponse<MyAgencyProfile>
    | { agency?: MyAgencyProfile; status?: boolean }
    | MyAgencyProfile
  >();

  return unwrapMyAgencyProfile(response);
}

export function deleteMyBusiness() {
  return api.delete("me/agency/business").json<{ success: boolean; message: string }>();
}
