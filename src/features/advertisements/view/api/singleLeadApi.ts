import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActiveAuthRole } from "../../../../shared/auth/use-active-auth-role";
import {
  addV2AdvertisementLeadNote,
  getV2AdvertisementLeadActivities,
  getV2AdvertisementLeadDetail,
  getV2AdvertisementLeads,
  updateV2AdvertisementLeadStage,
} from "../../api/v2";
import type {
  AdvertisementV2Activity,
  AdvertisementV2Lead,
  AdvertisementV2Note,
} from "../../api/v2";

export type ViewAdLeadClient = NonNullable<AdvertisementV2Lead["client"]>;
export type ViewAdLeadDetail = AdvertisementV2Lead;
export type ViewAdLeadActivity = AdvertisementV2Activity;
export type ViewAdLeadNote = AdvertisementV2Note;

export interface NormalizedAdLeadItem {
  id: string;
  name: string;
  phone: string;
  avatarUrl?: string;
  status: string;
  date: string;
  time: string;
  chatCount: number;
  callCount: number;
}

export async function getAdLeadsList(adId?: string | number): Promise<NormalizedAdLeadItem[] | null> {
  if (!adId) return null;
  const res = await getV2AdvertisementLeads(adId);
  const resUnknown = res as unknown;
  const leads = Array.isArray(resUnknown)
    ? resUnknown
    : (resUnknown as { data?: unknown[] })?.data
      ? (resUnknown as { data: unknown[] }).data
      : (resUnknown as { leads?: unknown[] })?.leads ?? [];

  return leads.map((item: any) => {
    const rawDate = item.created_at || item.date || item.appointment?.date_jalali;
    let formattedDate = "";
    if (rawDate) {
      try {
        formattedDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
          month: "2-digit",
          day: "2-digit",
        }).format(new Date(rawDate));
      } catch {
        formattedDate = String(rawDate);
      }
    }

    return {
      id: String(item.id),
      name: item.client?.name ?? item.name ?? "کاربر",
      phone: item.client?.phone ?? item.phone ?? "",
      avatarUrl: item.client?.avatar_url ?? item.avatar_url,
      status: item.stage?.title ?? item.stage?.label ?? (typeof item.status === "string" ? item.status : item.status?.new ? "جدید" : "جدید"),
      date: formattedDate,
      time: item.time ?? item.appointment?.time ?? "",
      chatCount: item.stats?.messages_count ?? Number(item.chat_count ?? 0),
      callCount: item.stats?.calls_count ?? Number(item.call_count ?? 0),
    };
  });
}

export function useAdLeadsQuery(adId?: string | number) {
  const activeRole = useActiveAuthRole();
  return useQuery({
    queryKey: ["ad-leads", adId ? String(adId) : "", activeRole],
    queryFn: () => getAdLeadsList(adId),
    enabled: Boolean(adId),
    staleTime: 30_000,
  });
}

export async function getSingleLeadDetails(adId?: string | number, leadId?: string | number): Promise<ViewAdLeadDetail | null> {
  if (!adId || !leadId) return null;
  return getV2AdvertisementLeadDetail(adId, leadId);
}

export async function getLeadActivities(adId?: string | number, leadId?: string | number): Promise<ViewAdLeadActivity[]> {
  if (!adId || !leadId) return [];
  const res = await getV2AdvertisementLeadActivities(adId, leadId);
  return Array.isArray(res) ? res : res?.activities ?? [];
}

export function useSingleLeadDetailsQuery(adId?: string | number, leadId?: string | number) {
  const activeRole = useActiveAuthRole();
  return useQuery({
    queryKey: ["single-lead-details", adId ? String(adId) : "", leadId ? String(leadId) : "", activeRole],
    queryFn: () => getSingleLeadDetails(adId, leadId),
    enabled: Boolean(adId && leadId),
    staleTime: 30_000,
  });
}

export function useLeadActivitiesQuery(adId?: string | number, leadId?: string | number) {
  const activeRole = useActiveAuthRole();
  return useQuery({
    queryKey: ["lead-activities", adId ? String(adId) : "", leadId ? String(leadId) : "", activeRole],
    queryFn: () => getLeadActivities(adId, leadId),
    enabled: Boolean(adId && leadId),
    staleTime: 30_000,
  });
}

export function useUpdateLeadStageMutation(adId?: string | number, leadId?: string | number) {
  const qc = useQueryClient();
  const activeRole = useActiveAuthRole();
  return useMutation({
    mutationFn: (stageKey: string) => {
      if (!adId || !leadId) throw new Error("Missing ad or lead id");
      return updateV2AdvertisementLeadStage(adId, leadId, stageKey);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["single-lead-details", String(adId), String(leadId), activeRole] });
      void qc.invalidateQueries({ queryKey: ["lead-activities", String(adId), String(leadId), activeRole] });
      void qc.invalidateQueries({ queryKey: ["ad-leads", String(adId), activeRole] });
    },
  });
}

export function useAddLeadNoteMutation(adId?: string | number, leadId?: string | number) {
  const qc = useQueryClient();
  const activeRole = useActiveAuthRole();
  return useMutation({
    mutationFn: (content: string) => {
      if (!adId || !leadId) throw new Error("Missing ad or lead id");
      return addV2AdvertisementLeadNote(adId, leadId, content);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["single-lead-details", String(adId), String(leadId), activeRole] });
    },
  });
}

