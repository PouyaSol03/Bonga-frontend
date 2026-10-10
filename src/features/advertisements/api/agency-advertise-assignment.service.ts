import { api } from "../../../shared/api/api";
import {
  confirmV2DealResult,
  getV2ArchiveEligibility,
  getV2DealResultEligibility,
  getV2History,
  getV2ReRegisterEligibility,
  reRegisterV2,
  restoreV2Archive,
  submitV2DealResult,
} from "./v2";
import type { AdvertisementItem } from "./advertisement.service";

export type AgencyAdvertiseAssignmentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export type AgencyAdvertiseAssignmentTargetType = "agency" | "consultant";

export type AgencyAdvertiseAssignmentDto = {
  advertise?: AdvertisementItem;
  advertiseId: number | string;
  agencyId?: number | string;
  cancelReason?: string;
  consultantId?: number | string;
  createdAt?: string;
  decidedAt?: string;
  decidedByUserId?: number | string;
  expiresAt?: string;
  id: number | string;
  metadata: Record<string, unknown>;
  rejectReason?: string;
  requesterUserId?: number | string;
  status: AgencyAdvertiseAssignmentStatus;
  targetType: AgencyAdvertiseAssignmentTargetType;
};

export type AgencyAdvertiseAssignmentsParams = {
  advertiseId?: number | string;
  agencyId?: number | string;
  consultantId?: number | string;
  page?: number;
  perPage?: number;
  status?: AgencyAdvertiseAssignmentStatus;
  targetType?: AgencyAdvertiseAssignmentTargetType;
};

export type AgencyAdvertiseAssignmentsPage = {
  data: AgencyAdvertiseAssignmentDto[];
  hasNextPage: boolean;
  page: number;
  perPage: number;
  total: number;
};

export type RejectAgencyAdvertiseAssignmentPayload = {
  assignmentId: number | string;
  rejectReason: string;
};

type RejectAssignmentApiResponse = {
  assignment?: AssignmentApiItem;
  data?: { assignment?: AssignmentApiItem } | AssignmentApiItem;
  status?: boolean;
};

type AssignmentApiItem = Record<string, unknown> & {
  ad?: unknown;
  advertise?: unknown;
  advertise_summary?: unknown;
  advertisement?: unknown;
  advertise_id?: unknown;
  agency_id?: unknown;
  cancel_reason?: unknown;
  consultant_id?: unknown;
  decided_at?: unknown;
  decided_by_user_id?: unknown;
  expires_at?: unknown;
  id?: unknown;
  metadata?: unknown;
  reject_reason?: unknown;
  requester_user_id?: unknown;
  status?: unknown;
  target_agency_id?: unknown;
  target_consultant_id?: unknown;
  target_type?: unknown;
};

type AssignmentsApiResponse = {
  data?: AssignmentApiItem[];
  page?: unknown;
  per_page?: unknown;
  status?: boolean;
  total?: unknown;
};

function toText(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);

  return "";
}

function toId(value: unknown): number | string | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  const text = toText(value);
  return text || undefined;
}

function toNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeStatus(value: unknown): AgencyAdvertiseAssignmentStatus {
  const status = toText(value).toLowerCase();

  if (status === "approved" || status === "rejected" || status === "cancelled") {
    return status;
  }

  return "pending";
}

function normalizeTargetType(value: unknown): AgencyAdvertiseAssignmentTargetType {
  return toText(value).toLowerCase() === "consultant" ? "consultant" : "agency";
}

function normalizeAdvertise(value: unknown): AdvertisementItem | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;

  return value as AdvertisementItem;
}

function normalizeAssignment(item: AssignmentApiItem): AgencyAdvertiseAssignmentDto | null {
  const id = toId(item.id);
  const advertiseId = toId(item.advertise_id);

  if (id === undefined || advertiseId === undefined) return null;

  const metadata = toRecord(item.metadata);
  const embeddedAdvertise =
    normalizeAdvertise(item.advertise) ??
    normalizeAdvertise(item.advertise_summary) ??
    normalizeAdvertise(item.advertisement) ??
    normalizeAdvertise(item.ad) ??
    normalizeAdvertise(metadata.advertise);
  const createdAt =
    toText(item.created_at) ||
    toText(metadata.created_at) ||
    undefined;
  const expiresAt =
    toText(item.expires_at) ||
    toText(metadata.expires_at) ||
    toText(metadata.deadline_at) ||
    toText(metadata.assignment_expires_at) ||
    (createdAt && Number.isFinite(Date.parse(createdAt))
      ? new Date(Date.parse(createdAt) + 24 * 60 * 60 * 1000).toISOString()
      : undefined);

  return {
    advertise: embeddedAdvertise,
    advertiseId,
    agencyId: toId(item.target_agency_id ?? item.agency_id),
    cancelReason: toText(item.cancel_reason) || undefined,
    consultantId: toId(item.target_consultant_id ?? item.consultant_id),
    createdAt,
    decidedAt: toText(item.decided_at) || undefined,
    decidedByUserId: toId(item.decided_by_user_id),
    expiresAt,
    id,
    metadata,
    rejectReason: toText(item.reject_reason) || undefined,
    requesterUserId: toId(item.requester_user_id),
    status: normalizeStatus(item.status),
    targetType: normalizeTargetType(item.target_type),
  };
}

export async function getMyAgencyAdvertiseAssignments({
  advertiseId,
  agencyId,
  consultantId,
  page = 1,
  perPage = 20,
  status,
  targetType,
}: AgencyAdvertiseAssignmentsParams = {}): Promise<AgencyAdvertiseAssignmentsPage> {
  const response = await api
    .get("me/agency/advertise/assignments", {
      searchParams: {
        advertise_id: advertiseId,
        agency_id: agencyId,
        consultant_id: consultantId,
        page,
        per_page: perPage,
        status,
        target_type: targetType,
      },
    })
    .json<AssignmentsApiResponse>();
  const data = (response.data ?? [])
    .map(normalizeAssignment)
    .filter((item): item is AgencyAdvertiseAssignmentDto => Boolean(item));
  const resolvedPage = Math.max(1, toNumber(response.page, page));
  const resolvedPerPage = Math.max(1, toNumber(response.per_page, perPage));
  const parsedTotal = Number(response.total);
  const hasTotal = Number.isFinite(parsedTotal);
  const total = hasTotal ? Math.max(0, parsedTotal) : data.length;

  return {
    data,
    hasNextPage: hasTotal
      ? resolvedPage * resolvedPerPage < total
      : data.length >= resolvedPerPage,
    page: resolvedPage,
    perPage: resolvedPerPage,
    total,
  };
}


export async function rejectAgencyAdvertiseAssignment({
  assignmentId,
  rejectReason,
}: RejectAgencyAdvertiseAssignmentPayload): Promise<AgencyAdvertiseAssignmentDto | null> {
  const normalizedReason = rejectReason.trim();

  if (!normalizedReason) {
    throw new Error("دلیل رد آگهی مشخص نشده است.");
  }

  const response = await api
    .post(
      `me/agency/advertise/assignments/${encodeURIComponent(String(assignmentId))}/reject`,
      {
        json: { reject_reason: normalizedReason },
      },
    )
    .json<RejectAssignmentApiResponse>();

  const responseData = response.data;
  const rawAssignment =
    response.assignment ??
    (responseData && typeof responseData === "object" && !Array.isArray(responseData)
      ? "assignment" in responseData
        ? responseData.assignment
        : responseData
      : undefined);

  return rawAssignment ? normalizeAssignment(rawAssignment as AssignmentApiItem) : null;
}

import {
  changeV2AdvertiseConsultant,
} from "./v2/advertisement-v2-lifecycle.service";

export type ChangeAgencyAdvertiseConsultantPayload = {
  advertiseId: string | number;
  consultantId: string | number | null;
};

export async function changeAgencyAdvertiseConsultant({
  advertiseId,
  consultantId,
}: ChangeAgencyAdvertiseConsultantPayload): Promise<unknown> {
  const numericConsultantId =
    consultantId !== null &&
    consultantId !== undefined &&
    String(consultantId).trim() !== "" &&
    !Number.isNaN(Number(consultantId))
      ? Number(consultantId)
      : null;

  return changeV2AdvertiseConsultant(advertiseId, numericConsultantId);
}

export async function cancelUserAdvertiseAssignment(advertiseId: string | number, reason?: string) {
  return api
    .post(`me/advertise/${encodeURIComponent(String(advertiseId))}/assignment/cancel`, {
      json: { cancel_reason: reason ?? "لغو واگذاری توسط کاربر" },
    })
    .json();
}

export async function restoreArchivedAdvertise(advertiseId: string | number, note?: string) {
  return restoreV2Archive(advertiseId, note);
}

export async function republishAdAsPersonal(advertiseId: string | number, note?: string) {
  return reRegisterV2(advertiseId, note);
}

export async function reassignAdToAgency({
  advertiseId,
  agencyId,
}: {
  advertiseId: string | number;
  agencyId: string | number;
}) {
  return api
    .post(`me/advertise/${encodeURIComponent(String(advertiseId))}/assignment`, {
      json: {
        target_type: "agency",
        agency_id: Number(agencyId),
      },
    })
    .json();
}

export type StopPublishReasonKey = "deal_done" | "no_longer_want_publish" | "other";

export function normalizeStopPublishReason(reason: string): StopPublishReasonKey {
  const clean = (reason ?? "").trim().toLowerCase();
  if (
    clean === "deal_done" ||
    clean.includes("معامله") ||
    clean.includes("انجام شده")
  ) {
    return "deal_done";
  }
  if (
    clean === "no_longer_want_publish" ||
    clean.includes("تمایل") ||
    clean.includes("منصرف") ||
    clean.includes("نمی‌خواهم") ||
    clean.includes("نمیخواهم")
  ) {
    return "no_longer_want_publish";
  }
  return "other";
}

export function formatStopPublishReason(reason: unknown): string {
  if (typeof reason !== "string") return "—";
  const trimmed = reason.trim();
  if (trimmed === "deal_done") return "معامله انجام شده است";
  if (trimmed === "no_longer_want_publish") return "دیگر تمایلی به انتشار آگهی ندارم";
  if (trimmed === "other") return "سایر دلایل";
  return trimmed;
}

export type CreateStopPublishRequestPayload = {
  advertiseId: string | number;
  reason: StopPublishReasonKey | string;
  description?: string;
};

export async function createStopPublishRequest({
  advertiseId,
  reason,
  description,
}: CreateStopPublishRequestPayload) {
  const normalizedReason = normalizeStopPublishReason(reason);
  const normalizedDescription =
    description?.trim() ||
    (reason !== normalizedReason && normalizedReason === "other" ? reason.trim() : undefined);

  return api
    .post(`me/advertise/${encodeURIComponent(String(advertiseId))}/stop-request`, {
      json: {
        reason: normalizedReason,
        ...(normalizedDescription ? { description: normalizedDescription } : {}),
      },
    })
    .json();
}

export async function cancelStopPublishRequest(advertiseId: string | number) {
  return api
    .post(`me/advertise/${encodeURIComponent(String(advertiseId))}/stop-request/cancel`)
    .json();
}

export async function approveAgencyStopRequest(
  payload: string | number | { requestId: string | number; agencyResponse?: string },
  maybeResponse?: string,
) {
  const requestId = typeof payload === "object" ? payload.requestId : payload;
  const agencyResponse = typeof payload === "object" ? payload.agencyResponse : maybeResponse;
  return api
    .post(`me/agency/advertise/stop-requests/${encodeURIComponent(String(requestId))}/approve`, {
      json: { agency_response: agencyResponse },
    })
    .json();
}

export async function rejectAgencyStopRequest(
  payload: string | number | { requestId: string | number; agencyResponse?: string },
  maybeResponse?: string,
) {
  const requestId = typeof payload === "object" ? payload.requestId : payload;
  const agencyResponse = typeof payload === "object" ? payload.agencyResponse : maybeResponse;
  return api
    .post(`me/agency/advertise/stop-requests/${encodeURIComponent(String(requestId))}/reject`, {
      json: { agency_response: agencyResponse },
    })
    .json();
}

export type SubmitDealResultPayload = {
  advertiseId: string | number;
  result: "successful" | "failed" | "unresponsive" | string;
  description?: string;
  client_name?: string;
  client_phone?: string;
  contract_price?: string;
  commission_amount?: string;
  request_id?: number;
  assignment_id?: number;
};

export async function submitAdvertiseDealResult({
  advertiseId,
  result,
  description,
  client_name,
  client_phone,
  contract_price,
  commission_amount,
  request_id,
  assignment_id,
}: SubmitDealResultPayload) {
  return submitV2DealResult(advertiseId, {
    result,
    description,
    client_name,
    client_phone,
    contract_price,
    commission_amount,
    request_id,
    assignment_id,
  });
}

export async function confirmUserDealResult(advertiseId: string | number, confirmed: boolean) {
  return confirmV2DealResult(advertiseId, confirmed);
}

export type AdvertisementHistoryItem = {
  action: string;
  message: string;
  created_at: string;
};

export type AdvertisementHistoryResponse = {
  status: boolean;
  data: AdvertisementHistoryItem[];
};

export type AdvertisementExpireInfo = {
  hours?: number;
  minutes?: number;
  total_minutes?: number;
};

export type AdvertisementReRegisterStatusResponse = {
  status: boolean;
  expires_at?: string | null;
  expire?: AdvertisementExpireInfo;
  reason?: string;
  available?: boolean;
  data?: AdvertisementReRegisterStatusResponse;
};

export type AdvertisementSubmitResultStatusResponse = {
  status: boolean;
  expires_at?: string | null;
  expire?: AdvertisementExpireInfo;
  reason?: string;
  available?: boolean;
  submit_request?: boolean;
  submitted_by?: string;
  agency?: {
    id: number | string;
    name: string;
  };
  result?: {
    id?: number | string;
    advertise_id?: number | string;
    agency_id?: number | string;
    agency_name?: string;
    result?: string;
    description?: string;
  } | null;
  agency_result?: unknown;
  user_result?: unknown;
  data?: AdvertisementSubmitResultStatusResponse;
};

export type AdvertisementArchiveStatusResponse = {
  status: boolean;
  expires_at?: string | null;
  expire?: AdvertisementExpireInfo;
  reason?: string;
  available?: boolean;
  data?: AdvertisementArchiveStatusResponse;
};

function unwrapEligibilityResponse<T extends { status: boolean }>(res: unknown): T {
  if (res && typeof res === "object") {
    const raw = res as Record<string, unknown>;
    const data =
      raw.data && typeof raw.data === "object"
        ? (raw.data as Record<string, unknown>)
        : raw;
    const status =
      typeof data.status === "boolean"
        ? data.status
        : typeof raw.status === "boolean"
          ? raw.status
          : false;

    return {
      ...data,
      status,
      data,
    } as unknown as T;
  }
  return { status: false } as unknown as T;
}

export async function getAdvertisementHistory(
  advertiseId: string | number,
): Promise<AdvertisementHistoryItem[]> {
  try {
    const res = await getV2History(advertiseId);
    return Array.isArray(res?.data) ? (res.data as AdvertisementHistoryItem[]) : [];
  } catch {
    return [];
  }
}

export async function getAdvertisementReRegisterStatus(
  advertiseId: string | number,
): Promise<AdvertisementReRegisterStatusResponse> {
  try {
    const res = await getV2ReRegisterEligibility(advertiseId);
    return unwrapEligibilityResponse<AdvertisementReRegisterStatusResponse>(res);
  } catch {
    return { status: false };
  }
}

export async function getAdvertisementSubmitResultStatus(
  advertiseId: string | number,
): Promise<AdvertisementSubmitResultStatusResponse> {
  try {
    const res = await getV2DealResultEligibility(advertiseId);
    return unwrapEligibilityResponse<AdvertisementSubmitResultStatusResponse>(res);
  } catch {
    return { status: false };
  }
}

export async function getAdvertisementArchiveStatus(
  advertiseId: string | number,
): Promise<AdvertisementArchiveStatusResponse> {
  try {
    const res = await getV2ArchiveEligibility(advertiseId);
    return unwrapEligibilityResponse<AdvertisementArchiveStatusResponse>(res);
  } catch {
    return { status: false };
  }
}
