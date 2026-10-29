import { api, apiV2 } from "../../../../shared/api/api";
import type {
  ConsultantProfileResponse,
  CreateMyAgentPayload,
  CreateMyAgentResponse,
  UpdateConsultantProfilePayload,
} from "./agency.types";

export function createMyAgent(payload: CreateMyAgentPayload) {
  const phonenumber = payload.phonenumber?.trim();

  return api
    .post("me/agent", {
      json: {
        agency_id: payload.agency_id ?? null,
        name: payload.name.trim(),
        ...(phonenumber ? { phonenumber } : {}),
      },
    })
    .json<CreateMyAgentResponse>();
}

export async function getConsultantProfile(): Promise<ConsultantProfileResponse> {
  const response = await apiV2
    .get("independent-consultant/profile")
    .json<ConsultantProfileResponse>();

  return response;
}

export async function updateConsultantProfile(
  payload: UpdateConsultantProfilePayload,
): Promise<unknown> {
  return await apiV2
    .patch("independent-consultant/profile", {
      json: payload,
    })
    .json<unknown>();
}
