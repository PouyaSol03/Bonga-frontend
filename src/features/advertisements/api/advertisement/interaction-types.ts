export type ApiMutationResponse<T = unknown> = {
  data?: T;
  message?: string;
  status?: boolean;
};

export type AdvertiseFeedbackPayload = {
  response_speed: boolean;
  area_knowledge: boolean;
  honesty: boolean;
  effective_followup: boolean;
  ads_are_updated: boolean;
};

export type SubmitAdvertiseFeedbackPayload = {
  advertiseId: string;
  feedback: AdvertiseFeedbackPayload;
};

export type AdvertiseReportReason = {
  created_at?: string;
  id: string;
  name: string;
  updated_at?: string;
};

export type AdvertiseReportReasonsResponse =
  | {
      data?: AdvertiseReportReason[];
      list?: AdvertiseReportReason[];
      status?: boolean;
    }
  | AdvertiseReportReason[];

export type SubmitAdvertiseReportPayload = {
  advertiseId: string;
  description: string;
  reportReasonId: string;
};

export interface AgencyRemoveAdPayload {
  reason?: "deal_done" | "no_longer_want_publish" | "other" | string;
  description?: string;
}

export type AdvertisementEngagementEventType = "impression" | "call";
