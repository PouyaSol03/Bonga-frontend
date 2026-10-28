import { api, apiV2 } from "../../../../shared/api/api";
import {
  type SubmitAdvertiseFeedbackPayload,
  type ApiMutationResponse,
  type AdvertiseReportReasonsResponse,
  type SubmitAdvertiseReportPayload,
  type AgencyRemoveAdPayload,
  type AdvertisementEngagementEventType,
} from "./interaction-types";
import { v7 as uuidv7 } from "uuid";

export async function deleteAdvertisement({
  advertiseId,
  deleteReasonId,
  description,
}: {
  advertiseId: string | number;
  deleteReasonId?: string;
  description?: string;
}) {
  const response = await api
    .post(`me/advertise/delete/${encodeURIComponent(String(advertiseId))}`, {
      json: {
        delete_reason_id: deleteReasonId,
        description,
      },
    })
    .json();

  return response;
}

export function submitAdvertiseFeedback({
  advertiseId,
  feedback,
}: SubmitAdvertiseFeedbackPayload) {
  return api
    .post(`me/advertise/feedback/${advertiseId}`, { json: feedback })
    .json<ApiMutationResponse>();
}

export async function getAdvertiseReportReasons() {
  const response = await apiV2
    .get("advertise/report-reasons")
    .json<AdvertiseReportReasonsResponse>();

  if (Array.isArray(response)) return response;

  if (Array.isArray(response.list)) return response.list;
  if (Array.isArray(response.data)) return response.data;

  return [];
}

export function submitAdvertiseReport({
  advertiseId,
  description,
  reportReasonId,
}: SubmitAdvertiseReportPayload) {
  return apiV2
    .post(`advertise/report/${encodeURIComponent(String(advertiseId))}`, {
      json: {
        description: description?.trim() || "",
        report_reason_id: Number(reportReasonId),
      },
    })
    .json<ApiMutationResponse>();
}

export async function removeAgencyAdvertisement(
  advertiseId: string | number,
  payload: AgencyRemoveAdPayload = {
    reason: "deal_done",
    description: "حذف توسط آژانس",
  },
) {
  const encId = encodeURIComponent(String(advertiseId));
  const response = await apiV2
    .delete(`advertise/${encId}`, {
      json: {
        reason: payload.reason || "deal_done",
        ...(payload.description?.trim()
          ? { description: payload.description.trim() }
          : {}),
      },
    })
    .json<Record<string, unknown>>();

  return response;
}

export async function reportAdvertisementEngagement(
  adId: string | number,
  eventType: AdvertisementEngagementEventType,
): Promise<void> {
  const cleanId = String(adId).trim();
  if (!cleanId || !/^[1-9]\d*$/.test(cleanId)) return;

  try {
    await api.post(`advertisements/${encodeURIComponent(cleanId)}/engagement`, {
      json: {
        event_type: eventType,
        idempotency_key: uuidv7(),
      },
    });
  } catch {
    return;
  }
}
