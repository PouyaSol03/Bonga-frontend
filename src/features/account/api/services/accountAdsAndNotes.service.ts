import { api, apiV2, getActiveV2Role } from "../../../../shared/api/api";
import { type ApiDataResponse, type ApiListResponse, unwrapList } from "../../../../shared/api/response";
import type { AdvertisementItem } from "../../../advertisements/api/advertisement.service";
import type {
  AdvertiseBadgesPage,
  AdvertiseBadgesResponse,
  MyAdsPage,
  MyAdsResponse,
  MyAdsType,
  MyNotesResponse,
  NoteItem,
  SaveAdvertiseNotePayload,
  UpdateAdvertiseNotePayload,
} from "./ads-notes.types";

export async function getMyAds({
  isMine,
  neighborhoods,
  page = 1,
  perPage = 20,
  propertyType,
  propertyTypes,
  publisher,
  query,
  search,
  transaction,
  type,
}: {
  isMine?: boolean;
  neighborhoods?: Array<{ id?: string | number; name?: string } | string | number> | string;
  page?: number;
  perPage?: number;
  propertyType?: string;
  propertyTypes?: string[] | string;
  publisher?: string;
  query?: string;
  search?: string;
  transaction?: string;
  type?: MyAdsType;
}) {
  const v2Role = getActiveV2Role();
  const endpoint =
    v2Role === "agency"
      ? "agency/advertise"
      : v2Role === "agency-consultant"
        ? "agency-consultant/advertise"
        : v2Role === "independent-consultant"
          ? "independent-consultant/advertise"
          : "personal/advertise";

  const searchParams: Record<string, string | number | boolean> = { page, per_page: perPage };
  if (type && type !== "all") searchParams.type = type;
  if (isMine !== undefined) searchParams.is_mine = isMine;
  const searchTerm = (search ?? query)?.trim();
  if (searchTerm) searchParams.search = searchTerm;
  if (transaction) searchParams.transaction = transaction;
  if (propertyType) searchParams.property_type = propertyType;
  if (propertyTypes) {
    searchParams.property_types = Array.isArray(propertyTypes) ? propertyTypes.join(",") : propertyTypes;
  }
  if (publisher) searchParams.publisher = publisher;
  if (neighborhoods) {
    if (Array.isArray(neighborhoods)) {
      const ids = neighborhoods
        .map((n) => (typeof n === "object" && n ? (n.id || n.name) : String(n)))
        .filter(Boolean);
      if (ids.length) searchParams.neighborhoods = ids.join(",");
    } else {
      searchParams.neighborhoods = String(neighborhoods);
    }
  }

  const response = await apiV2.get(endpoint, { searchParams }).json<MyAdsResponse>();
  const record = Array.isArray(response) ? {} : (response as Record<string, unknown>);
  const data = Array.isArray(response)
    ? response
    : Array.isArray(record.advertises)
      ? (record.advertises as AdvertisementItem[])
      : Array.isArray(record.data)
        ? (record.data as AdvertisementItem[])
        : unwrapList(response as ApiListResponse<AdvertisementItem>);
  const currentPage = typeof record.page === "number" ? record.page : page;
  const resolvedPerPage = typeof record.per_page === "number" ? record.per_page : perPage;
  const total =
    typeof record.total === "number"
      ? record.total
      : typeof record.count === "number"
        ? record.count
        : data.length;

  return {
    data,
    hasNextPage: currentPage * resolvedPerPage < total,
    page: currentPage,
    perPage: resolvedPerPage,
    total,
  } satisfies MyAdsPage;
}

export async function getAdvertiseBadges({
  page = 1,
  perPage = 10,
}: {
  page?: number;
  perPage?: number;
} = {}): Promise<AdvertiseBadgesPage> {
  const response = await api
    .get("me/badges", {
      searchParams: {
        page,
        per_page: perPage,
      },
    })
    .json<AdvertiseBadgesResponse>();
  const record = Array.isArray(response) ? {} : response;
  const data = Array.isArray(response)
    ? response
    : Array.isArray(record.advertises)
      ? record.advertises
      : Array.isArray(record.data)
        ? record.data
        : [];
  const currentPage = record.page ?? page;
  const resolvedPerPage = record.per_page ?? perPage;
  const total = record.total ?? data.length;

  return {
    adsIds: Array.isArray(record.AdsIds) ? record.AdsIds.map(String) : [],
    data,
    hasNextPage: currentPage * resolvedPerPage < total,
    page: currentPage,
    perPage: resolvedPerPage,
    total,
  };
}

export function toggleAdvertiseBadge(advertiseId: string) {
  return api.post(`me/advertise/badges/create/${advertiseId}`).json<ApiDataResponse<unknown>>();
}

export function deleteAdvertiseBadge(advertiseId: string) {
  return api.delete(`me/advertise/badges/delete/${advertiseId}`).json<ApiDataResponse<unknown>>();
}

export async function getMyNotes() {
  const response = await api.get("me/notes").json<MyNotesResponse>();

  if (Array.isArray(response)) return response;

  const record = response as Record<string, unknown>;

  if (Array.isArray(record.notes)) return record.notes as NoteItem[];
  if (Array.isArray(record.advertises)) return record.advertises as NoteItem[];

  return unwrapList(response as ApiListResponse<NoteItem>);
}

export function saveAdvertiseNote({ advertiseId, note }: SaveAdvertiseNotePayload) {
  return api
    .post(`me/advertise/note/add/${advertiseId}`, { json: { note } })
    .json<ApiDataResponse<NoteItem | unknown>>();
}

export function updateAdvertiseNote({ noteId, note }: UpdateAdvertiseNotePayload) {
  return api
    .put(`me/advertise/note/update/${encodeURIComponent(noteId)}`, { json: { note } })
    .json<ApiDataResponse<NoteItem | unknown>>();
}

export function deleteAdvertiseNote(noteId: string) {
  return api.delete(`me/advertise/note/delete/${noteId}`).json<ApiDataResponse<unknown>>();
}
