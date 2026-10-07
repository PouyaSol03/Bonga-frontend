import { ApiError, api, apiV2 } from "../../../shared/api/api";
import {
  asRecord,
  buildPropertyRequestFilters,
  extractAdvertisementItems,
  ignoredRequestFilterFields,
  normalizePropertyRequest,
  normalizeQuota,
  readBoolean,
  readNumber,
  readPaginationRecord,
  readText,
} from "./property-request-normalizer";
import {
  resolvePropertyRequestOwnerType,
  resolvePropertyRequestScope,
} from "./property-request-endpoint";
import type {
  PropertyRequestCreateInput,
  PropertyRequestCreateResult,
  PropertyRequestMatchesPage,
  PropertyRequestPage,
  PropertyRequestScope,
  PropertySearchRequest,
} from "./property-request-types";

export * from "./property-request-types";
export * from "./property-request-constants";
export * from "./property-request-formatter";
export * from "./property-request-normalizer";
export * from "./property-request-endpoint";

export const getPropertyRequestScope = () => resolvePropertyRequestScope();
const getClient = (scope: PropertyRequestScope) => (scope.apiVersion === "v2" ? apiV2 : api);

function ensureSuccessful(record: Record<string, unknown> | undefined) {
  if (record?.status === false) {
    throw new ApiError(400, readText(record.message) || "درخواست با خطا مواجه شد.");
  }
}

export async function createPropertyRequest(
  input: PropertyRequestCreateInput,
): Promise<PropertyRequestCreateResult> {
  const scope = resolvePropertyRequestScope();
  const filters = (Array.isArray(input.filters)
    ? input.filters
    : buildPropertyRequestFilters(input.filters)
  ).filter((f) => !ignoredRequestFilterFields.has(f.field));

  const response = await getClient(scope)
    .post(scope.apiVersion === "v2" ? scope.basePath : "me/requests", {
      json: {
        filters,
        name: input.name.trim() || "درخواست ملک مشابه",
        ...(scope.apiVersion === "v1" ? {owner_type: input.owner_type ?? scope.ownerType} : {}),
      },
    })
    .json<unknown>();

  const record = asRecord(response);
  const payload = asRecord(record?.data);
  ensureSuccessful(record);

  const request = normalizePropertyRequest(
    record?.request ?? payload?.request ?? record?.data,
    0,
    scope.ownerType,
  );
  if (!request) throw new ApiError(500, "خطا در دریافت اطلاعات درخواست ثبت شده.");

  return { quota: normalizeQuota(record?.quota ?? payload?.quota), request, status: readBoolean(record?.status, true) };
}

export async function getPropertyRequests(page = 1, perPage = 20): Promise<PropertyRequestPage> {
  const scope = resolvePropertyRequestScope();
  const response = await getClient(scope)
    .get(scope.basePath, { searchParams: { page, per_page: perPage } })
    .json<unknown>();

  const record = asRecord(response);
  ensureSuccessful(record);

  const payload = asRecord(record?.data);
  const rawItems = Array.isArray(response)
    ? response
    : Array.isArray(record?.data)
      ? record.data
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  const data = rawItems
    .map((item, index) => normalizePropertyRequest(item, index, scope.ownerType))
    .filter((item): item is PropertySearchRequest => item !== null);

  const total = readNumber(record?.total ?? payload?.total, data.length);
  const registeredCount = readNumber(record?.registered_count ?? payload?.registered_count, total);
  const requestLimit = readNumber(record?.request_limit ?? payload?.request_limit, 0);
  const remaining = readNumber(record?.remaining ?? payload?.remaining, Math.max(0, requestLimit - registeredCount));

  return {
    data,
    hasMore: readBoolean(record?.has_more ?? payload?.has_more, page * perPage < total),
    ownerType: readText(record?.owner_type ?? payload?.owner_type) === "agency" ? "agency" : scope.ownerType,
    page: readNumber(record?.page ?? payload?.page, page),
    perPage: readNumber(record?.per_page ?? payload?.per_page, perPage),
    quota: normalizeQuota(record?.quota ?? payload?.quota, { limit: requestLimit, remaining, used: registeredCount }),
    registeredCount,
    remaining,
    requestLimit,
    total,
  };
}

export async function renamePropertyRequest(requestId: string, name: string) {
  const ownerType = resolvePropertyRequestOwnerType();
  const scope = resolvePropertyRequestScope();
  const response = await getClient(scope)
    .patch(`${scope.basePath}/${encodeURIComponent(requestId)}`, { json: { name: name.trim() } })
    .json<unknown>();

  const record = asRecord(response);
  ensureSuccessful(record);

  return normalizePropertyRequest(
    record?.request ?? asRecord(record?.data)?.request ?? record?.data,
    0,
    ownerType,
  );
}

export async function deletePropertyRequest(requestId: string) {
  const scope = resolvePropertyRequestScope();
  const response = await getClient(scope)
    .delete(`${scope.basePath}/${encodeURIComponent(requestId)}`)
    .json<unknown>();

  const record = asRecord(response);
  ensureSuccessful(record);

  return { id: readText(record?.id) || requestId, status: readBoolean(record?.status, true) };
}

export async function getPropertyRequestMatches(
  requestId: string,
  page = 1,
  perPage = 20,
): Promise<PropertyRequestMatchesPage> {
  const scope = resolvePropertyRequestScope();
  const response = await getClient(scope)
    .get(`${scope.basePath}/matches`, { searchParams: { page, per_page: perPage, request_id: requestId } })
    .json<unknown>();

  const record = asRecord(response);
  ensureSuccessful(record);

  const data = extractAdvertisementItems(response);
  const pagination = readPaginationRecord(record);
  const total = readNumber(pagination?.total, data.length);
  const currentPage = readNumber(pagination?.current_page ?? pagination?.page, page);
  const resolvedPerPage = readNumber(pagination?.per_page, perPage);
  const lastPage = readNumber(pagination?.last_page ?? pagination?.total_pages, 0);

  return {
    data,
    hasMore: lastPage > 0 ? currentPage < lastPage : readBoolean(record?.has_more, currentPage * resolvedPerPage < total),
    page: currentPage,
    perPage: resolvedPerPage,
    total,
  };
}
