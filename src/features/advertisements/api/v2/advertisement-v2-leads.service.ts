import { apiV2 } from "../../../../shared/api/api";
import type { AdvertisementV2Activity, AdvertisementV2Lead } from "./advertisement-v2.types";

const enc = (id: string | number) => encodeURIComponent(String(id));

// Performance Sections
export const getV2AdvertisementPerformance = <T = unknown>(
  id: string | number,
  section: string,
  searchParams?: Record<string, string | number | boolean | undefined>,
) =>
  apiV2
    .get(`advertise/${enc(id)}/performance/${encodeURIComponent(section)}`, {
      searchParams,
    })
    .json<T>();

// Leads CRM
export const getV2AdvertisementLeads = (id: string | number) =>
  apiV2
    .get(`advertise/${enc(id)}/leads`)
    .json<{ leads: AdvertisementV2Lead[] } | AdvertisementV2Lead[]>();

export const getV2AdvertisementLeadDetail = (id: string | number, leadId: string | number) =>
  apiV2.get(`advertise/${enc(id)}/leads/${enc(leadId)}`).json<AdvertisementV2Lead>();

export const getV2AdvertisementLeadActivities = (id: string | number, leadId: string | number) =>
  apiV2
    .get(`advertise/${enc(id)}/leads/${enc(leadId)}/activities`)
    .json<{ activities: AdvertisementV2Activity[] } | AdvertisementV2Activity[]>();

export const updateV2AdvertisementLeadStage = (
  id: string | number,
  leadId: string | number,
  stageKey: string,
) =>
  apiV2
    .patch(`advertise/${enc(id)}/leads/${enc(leadId)}/stage`, { json: { stage_key: stageKey } })
    .json();
