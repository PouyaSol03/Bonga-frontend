import { apiV2, publicApiV2 } from "../../../../shared/api/api";

export type ProfileFeedbackTargetType = "agency" | "consultant";

export type ProfileFeedbackItem = {
  id: number;
  title: string;
  sort_order: number;
  is_active: boolean;
};

export type SubmitProfileFeedbackPayload = {
  ratings: Array<{
    item_id: number;
    value: boolean;
  }>;
};

export type CrmProfileFeedbackItemPayload = {
  title: string;
  sort_order: number;
  is_active: boolean;
};

type ProfileFeedbackItemsResponse = {
  status?: boolean;
  data: ProfileFeedbackItem[];
};

/**
 * Public: fetch feedback items for feedback submission
 * GET /api/v2/public/profile-feedback/items
 */
export async function getPublicProfileFeedbackItems(): Promise<ProfileFeedbackItem[]> {
  const response = await publicApiV2
    .get("public/profile-feedback/items")
    .json<ProfileFeedbackItemsResponse>();
  return response?.data ?? [];
}

/**
 * Submit feedback for an agency or consultant
 * POST /api/v2/profile-feedback/{targetType}/{targetId}
 */
export async function submitProfileFeedback(
  targetType: ProfileFeedbackTargetType,
  targetId: number | string,
  payload: SubmitProfileFeedbackPayload
): Promise<void> {
  await apiV2.post(`profile-feedback/${targetType}/${targetId}`, {
    json: payload,
  });
}

/**
 * Panel (CRM): list all profile feedback items
 * GET /api/v2/panel/profile-feedback/items
 */
export async function listCrmProfileFeedbackItems(): Promise<ProfileFeedbackItem[]> {
  const response = await apiV2
    .get("panel/profile-feedback/items")
    .json<ProfileFeedbackItemsResponse>();
  return response?.data ?? [];
}

/**
 * Panel (CRM): create a profile feedback item
 * POST /api/v2/panel/profile-feedback/items
 */
export async function createCrmProfileFeedbackItem(
  payload: CrmProfileFeedbackItemPayload
): Promise<ProfileFeedbackItem> {
  const response = await apiV2
    .post("panel/profile-feedback/items", { json: payload })
    .json<{ status?: boolean; data: ProfileFeedbackItem }>();
  return response.data;
}

/**
 * Panel (CRM): update a profile feedback item
 * PATCH /api/v2/panel/profile-feedback/items/{id}
 */
export async function updateCrmProfileFeedbackItem(
  id: number,
  payload: Partial<CrmProfileFeedbackItemPayload>
): Promise<ProfileFeedbackItem> {
  const response = await apiV2
    .patch(`panel/profile-feedback/items/${id}`, { json: payload })
    .json<{ status?: boolean; data: ProfileFeedbackItem }>();
  return response.data;
}

/**
 * Panel (CRM): delete a profile feedback item
 * DELETE /api/v2/panel/profile-feedback/items/{id}
 */
export async function deleteCrmProfileFeedbackItem(id: number): Promise<void> {
  await apiV2.delete(`panel/profile-feedback/items/${id}`);
}
