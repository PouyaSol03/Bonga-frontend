import { api } from "../../../shared/api/api";
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
  const expiresAt =
    toText(item.expires_at) ||
    toText(metadata.expires_at) ||
    toText(metadata.deadline_at) ||
    toText(metadata.assignment_expires_at) ||
    undefined;

  return {
    advertise: embeddedAdvertise,
    advertiseId,
    agencyId: toId(item.target_agency_id ?? item.agency_id),
    cancelReason: toText(item.cancel_reason) || undefined,
    consultantId: toId(item.target_consultant_id ?? item.consultant_id),
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

export type ChangeAgencyAdvertiseConsultantPayload = {
  advertiseId: string | number;
  consultantId: string | number | null;
};

export async function changeAgencyAdvertiseConsultant({
  advertiseId,
  consultantId,
}: ChangeAgencyAdvertiseConsultantPayload): Promise<unknown> {
  const response = await api
    .post(
      `me/agency/advertise/assignments/advertise/${encodeURIComponent(String(advertiseId))}/change-consultant`,
      {
        json: {
          consultant_id: consultantId !== null && consultantId !== undefined && String(consultantId).trim() !== ""
            ? String(consultantId).trim()
            : null,
        },
      },
    )
    .json();

  return response;
}

export async function cancelUserAdvertiseAssignment(advertiseId: string | number, reason?: string) {
  return api
    .post(`me/advertise/${encodeURIComponent(String(advertiseId))}/assignment/cancel`, {
      json: { cancel_reason: reason ?? "لغو واگذاری توسط کاربر" },
    })
    .json();
}

export async function restoreArchivedAdvertise(advertiseId: string | number) {
  return api
    .post(`me/advertise/${encodeURIComponent(String(advertiseId))}/assignment/restore`)
    .json();
}

export async function republishAdAsPersonal(advertiseId: string | number) {
  return api
    .post(`me/advertise/${encodeURIComponent(String(advertiseId))}/assignment/republish-personal`)
    .json();
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

export type CreateStopPublishRequestPayload = {
  advertiseId: string | number;
  reason: string;
  description?: string;
};

export async function createStopPublishRequest({
  advertiseId,
  reason,
  description,
}: CreateStopPublishRequestPayload) {
  return api
    .post(`me/advertise/${encodeURIComponent(String(advertiseId))}/stop-request`, {
      json: { reason, description },
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
  result: "successful" | "failed" | "unresponsive";
  description?: string;
};

export async function submitAdvertiseDealResult({
  advertiseId,
  result,
  description,
}: SubmitDealResultPayload) {
  return api
    .post(`me/advertise/${encodeURIComponent(String(advertiseId))}/result`, {
      json: { result, description },
    })
    .json();
}

export async function confirmUserDealResult(advertiseId: string | number, confirmed: boolean) {
  return api
    .post(`me/advertise/${encodeURIComponent(String(advertiseId))}/result/confirm`, {
      json: { confirmed },
    })
    .json();
}

