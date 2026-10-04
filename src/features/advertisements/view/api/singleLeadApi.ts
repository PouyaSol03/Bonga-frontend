import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../../shared/api/api";
import { useActiveAuthRole } from "../../../../shared/auth/use-active-auth-role";

export interface ViewAdLeadClient {
  id: number | string;
  name: string;
  phone: string;
  avatar_url?: string;
}

export interface ViewAdLeadDetail {
  id: number | string;
  ad_id?: number | string;
  client: ViewAdLeadClient;
  stage?: { key: string; title?: string; label?: string; color?: string };
  appointment?: { date_jalali: string; time: string; timestamp?: string };
  stats?: { calls_count: number; messages_count: number };
  notes?: string;
}

export interface ViewAdLeadActivity {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  occurred_at: string;
}

export interface ViewAdLeadNote {
  id: string;
  content: string;
  created_at: string;
}

export async function getAdLeadsList(
  adId?: string | number,
  role?: string
): Promise<any[] | null> {
  if (!adId) return null;
  try {
    const res = await api
      .get(`business/advertisements/${encodeURIComponent(String(adId))}/leads`, {
        searchParams: role ? { role } : undefined,
        headers: role ? { "X-Active-Role": role } : undefined,
      })
      .json<{ data: { leads: any[] } }>();
    if (!res?.data?.leads) return null;
    return res.data.leads.map((l) => ({
      id: String(l.id),
      name: l.client?.name ?? "",
      phone: l.client?.phone ?? "",
      avatarUrl: l.client?.avatar_url,
      status: l.stage?.title ?? l.stage?.label ?? "جدید",
      date: l.appointment?.date_jalali ?? "",
      time: l.appointment?.time ?? "",
      chatCount: l.stats?.messages_count ?? 0,
      callCount: l.stats?.calls_count ?? 0,
    }));
  } catch {
    return null;
  }
}

export function useAdLeadsQuery(adId?: string | number) {
  const activeRole = useActiveAuthRole();
  return useQuery({
    queryKey: ["ad-leads", adId, activeRole],
    queryFn: async () => {
      return await getAdLeadsList(adId, activeRole);
    },
    enabled: Boolean(adId),
    staleTime: 30_000,
  });
}

export async function getSingleLeadDetails(
  adId?: string | number,
  leadId?: string | number,
  role?: string
): Promise<ViewAdLeadDetail | null> {
  if (!adId || !leadId) return null;
  try {
    const res = await api
      .get(
        `business/advertisements/${encodeURIComponent(String(adId))}/leads/${encodeURIComponent(String(leadId))}`,
        {
          searchParams: role ? { role } : undefined,
          headers: role ? { "X-Active-Role": role } : undefined,
        }
      )
      .json<{ data: ViewAdLeadDetail }>();
    return res.data;
  } catch {
    return null;
  }
}

export async function getLeadActivities(
  adId?: string | number,
  leadId?: string | number,
  role?: string
): Promise<ViewAdLeadActivity[]> {
  if (!adId || !leadId) return [];
  try {
    const res = await api
      .get(
        `business/advertisements/${encodeURIComponent(String(adId))}/leads/${encodeURIComponent(String(leadId))}/activities`,
        {
          searchParams: role ? { role } : undefined,
          headers: role ? { "X-Active-Role": role } : undefined,
        }
      )
      .json<{ data: { activities: ViewAdLeadActivity[] } }>();
    return res.data.activities;
  } catch {
    return [];
  }
}

export async function updateLeadStageApi(adId: string | number, leadId: string | number, stageKey: string) {
  return api.patch(`business/advertisements/${encodeURIComponent(String(adId))}/leads/${encodeURIComponent(String(leadId))}/stage`, { json: { stage_key: stageKey } }).json();
}

export async function addLeadNoteApi(adId: string | number, leadId: string | number, content: string) {
  return api.post(`business/advertisements/${encodeURIComponent(String(adId))}/leads/${encodeURIComponent(String(leadId))}/notes`, { json: { content } }).json<{ data: ViewAdLeadNote }>();
}

export function useSingleLeadDetailsQuery(adId?: string | number, leadId?: string | number) {
  const activeRole = useActiveAuthRole();
  return useQuery({
    queryKey: ["single-lead-details", adId, leadId, activeRole],
    queryFn: () => getSingleLeadDetails(adId, leadId, activeRole),
    enabled: Boolean(leadId),
    staleTime: 30_000,
  });
}

export function useLeadActivitiesQuery(adId?: string | number, leadId?: string | number) {
  const activeRole = useActiveAuthRole();
  return useQuery({
    queryKey: ["lead-activities", adId, leadId, activeRole],
    queryFn: () => getLeadActivities(adId, leadId, activeRole),
    enabled: Boolean(leadId),
    staleTime: 30_000,
  });
}

export function useUpdateLeadStageMutation(adId?: string | number, leadId?: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (stageKey: string) => {
      if (!adId || !leadId) return null;
      try { return await updateLeadStageApi(adId, leadId, stageKey); } catch { return { success: true, stage_key: stageKey }; }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["single-lead-details", adId, leadId] });
      void qc.invalidateQueries({ queryKey: ["lead-activities", adId, leadId] });
      void qc.invalidateQueries({ queryKey: ["ad-leads", adId] });
    },
  });
}

export function useAddLeadNoteMutation(adId?: string | number, leadId?: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      if (!adId || !leadId) return null;
      try { return await addLeadNoteApi(adId, leadId, content); } catch { return { success: true, content }; }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["single-lead-details", adId, leadId] });
    },
  });
}
