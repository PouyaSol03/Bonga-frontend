import type { AdvertisementItem } from "../../advertisements/api/advertisement.service";
import type {
  PropertyRequestApiFilter,
  PropertyRequestOwnerType,
  PropertyRequestQuota,
  PropertySearchRequest,
} from "./property-request-types";

type ApiRecord = Record<string, unknown>;

export const ignoredRequestFilterFields = new Set([
  "ad_id", "agencies_id", "focus", "q", "qsearch", "query", "search",
  "my_agency_id", "page", "per_page", "returnTo", "role", "user_id", "view",
]);

const booleanFields = new Set(["has_image", "has_loan", "has_video", "is_special"]);
const numericFields = new Set(["area_max", "area_min", "building_age", "loan_amount", "loan_installment", "price_max", "price_min"]);
const multiFields = new Set(["exchange_with", "floor", "neighborhood_id", "neighborhoods", "rooms"]);

export function asRecord(val: unknown): ApiRecord | undefined {
  return val && typeof val === "object" && !Array.isArray(val) ? (val as ApiRecord) : undefined;
}

export function readText(val: unknown) {
  if (typeof val === "string" && val.trim()) return val.trim();
  if (typeof val === "number") return String(val);
  return "";
}

export function readNumber(val: unknown, fallback = 0) {
  if (typeof val === "number" && Number.isFinite(val)) return val;
  if (typeof val === "string" && val.trim()) {
    const parsed = Number(val);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

export function readBoolean(val: unknown, fallback = false) {
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val !== 0;
  if (typeof val === "string") {
    if (val === "true" || val === "1") return true;
    if (val === "false" || val === "0") return false;
  }
  return fallback;
}

function readIdArray(val: unknown): Array<number | string> {
  if (!Array.isArray(val)) return [];
  const ids: Array<number | string> = [];
  val.forEach((item) => {
    if (typeof item === "string" && item.trim()) ids.push(item.trim());
    else if (typeof item === "number" && Number.isFinite(item)) ids.push(item);
  });
  return ids;
}

function serializeFilterValue(val: unknown): string {
  if (Array.isArray(val)) {
    return val.map((item) => readText(item)).filter(Boolean).join("_");
  }
  if (typeof val === "boolean") return String(val);
  return readText(val);
}

export function normalizeFilters(val: unknown): Record<string, string> {
  if (Array.isArray(val)) {
    return Object.fromEntries(
      val.flatMap((item) => {
        const record = asRecord(item);
        if (!record) return [];
        const field = readText(record.field);
        const serialized = serializeFilterValue(record.value);
        return field && serialized ? [[field, serialized]] : [];
      }),
    );
  }
  const record = asRecord(val);
  if (!record) return {};
  return Object.fromEntries(
    Object.entries(record).flatMap(([key, item]) => {
      const text = serializeFilterValue(item);
      return text ? [[key, text]] : [];
    }),
  );
}

function parseFilterValue(field: string, raw: string) {
  const trimmed = raw.trim();
  if (booleanFields.has(field)) return trimmed === "true" || trimmed === "1";
  if (multiFields.has(field)) {
    const list = trimmed.split(/[_،,]/).map((i) => i.trim()).filter(Boolean);
    return list.length > 0 ? list : trimmed;
  }
  if (numericFields.has(field) && /^-?\d+(?:\.\d+)?$/.test(trimmed)) {
    const num = Number(trimmed);
    if (Number.isFinite(num)) return num;
  }
  return trimmed;
}

export function buildPropertyRequestFilters(filters: Record<string, string>): PropertyRequestApiFilter[] {
  const norm = { ...filters };
  if (norm.form_code) delete norm.from_code;
  if (norm.neighborhood_id) delete norm.neighborhoods;
  delete norm.query; delete norm.q; delete norm.qsearch; delete norm.search;

  return Object.entries(norm).flatMap(([field, raw]) => {
    if (ignoredRequestFilterFields.has(field)) return [];
    const val = raw.trim();
    return val ? [{ field, value: parseFilterValue(field, val) }] : [];
  });
}

export function normalizeQuota(val: unknown, fallback: Partial<PropertyRequestQuota> = {}): PropertyRequestQuota {
  const rec = asRecord(val);
  const limit = readNumber(rec?.limit, fallback.limit ?? 0);
  const used = readNumber(rec?.used, fallback.used ?? 0);
  const remaining = readNumber(rec?.remaining, fallback.remaining ?? Math.max(0, limit - used));
  return { limit, remaining, used };
}

export function normalizePropertyRequest(
  val: unknown,
  index = 0,
  defaultOwner: PropertyRequestOwnerType = "user",
): PropertySearchRequest | null {
  const record = asRecord(val);
  if (!record) return null;

  const isAgency = record.my_agency_id !== undefined && record.my_agency_id !== null;
  const ownerType = isAgency ? "agency" : defaultOwner;
  const senderLabel = readText(record.senderLabel) || (ownerType === "agency" ? "آژانس املاک" : "آگهی شخصی");
  const senderRole = readText(record.senderRole) || (ownerType === "agency" ? "real_estate_manager" : "user");
  const id = readText(record.id) || `property-request-${index}`;

  return {
    adId: (record.ad_id as number | string | null | undefined) ?? (record.adId as number | string | null | undefined),
    agenciesId: readIdArray(record.agencies_id ?? record.agenciesId),
    createdAt: readText(record.createdAt ?? record.created_at),
    filters: normalizeFilters(record.filters),
    id,
    isNew: readBoolean(record.is_new ?? record.isNew ?? record.unread ?? record.is_unread, readText(record.status).toLowerCase() === "new"),
    myAgencyId: (record.my_agency_id as number | string | null | undefined) ?? (record.myAgencyId as number | string | null | undefined),
    senderLabel,
    senderRole,
    title: readText(record.name ?? record.title) || "درخواست ملک مشابه",
    updatedAt: readText(record.updatedAt ?? record.updated_at),
    userId: (record.user_id as number | string | null | undefined) ?? (record.userId as number | string | null | undefined),
  };
}

export function extractAdvertisementItems(val: unknown, depth = 0): AdvertisementItem[] {
  if (depth > 5 || val === null || val === undefined) return [];
  if (Array.isArray(val)) return val.flatMap((i) => extractAdvertisementItems(i, depth + 1));
  const record = asRecord(val);
  if (!record) return [];

  for (const k of ["advertises", "advertisements", "ads", "matches", "items", "list", "results", "data", "result", "advertise", "advertisement", "ad"]) {
    const list = extractAdvertisementItems(record[k], depth + 1);
    if (list.length > 0) return list;
  }

  const hasId = typeof record.id === "string" || typeof record.id === "number" || typeof record._id === "string";
  const hasData = [record.title, record.label, record.image, record.images, record.price, record.features].some((v) => v !== undefined && v !== null);
  return hasId && hasData ? [record as AdvertisementItem] : [];
}

export function readPaginationRecord(record: ApiRecord | undefined): ApiRecord | undefined {
  return asRecord(record?.meta) ?? asRecord(record?.pagination) ?? asRecord(record?.data) ?? record;
}
