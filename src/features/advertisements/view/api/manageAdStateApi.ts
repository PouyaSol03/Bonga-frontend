import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../../shared/api/api";
import { useActiveAuthRole } from "../../../../shared/auth/use-active-auth-role";

export interface ManageAdOverviewData {
  id: number | string;
  title: string;
  thumbnail?: string;
  city?: string;
  district?: string;
  status: {
    code: number;
    key: string;
    label: string;
  };
  assignment_status?: string;
  confirm_date?: string;
  expire_date?: string;
  remaining_days?: number;
}

export interface ManageAdAssignmentData {
  ad_id: number | string;
  can_reassign: boolean;
  assigned_consultant?: {
    id: number;
    user_id?: number;
    full_name: string;
    phone?: string;
    avatar_url?: string;
  };
  agency?: {
    id: number;
    name: string;
    phone?: string;
  };
}

export interface ManageAdActionsData {
  can_ladder: boolean;
  can_extend: boolean;
  can_edit: boolean;
  can_change_publisher: boolean;
  can_close_deal: boolean;
  can_delete: boolean;
  can_stop_publish: boolean;
}

export async function getManageAdOverview(
  adId?: string | number,
  role?: string
): Promise<ManageAdOverviewData | null> {
  if (!adId) return null;
  try {
    const res = await api
      .get(`business/advertisements/${encodeURIComponent(String(adId))}/overview`, {
        searchParams: role ? { role } : undefined,
        headers: role ? { "X-Active-Role": role } : undefined,
      })
      .json<{ data: ManageAdOverviewData }>();
    return res.data;
  } catch {
    return null;
  }
}

export async function getManageAdAssignment(
  adId?: string | number,
  role?: string
): Promise<ManageAdAssignmentData | null> {
  if (!adId) return null;
  try {
    const res = await api
      .get(`business/advertisements/${encodeURIComponent(String(adId))}/assignment`, {
        searchParams: role ? { role } : undefined,
        headers: role ? { "X-Active-Role": role } : undefined,
      })
      .json<{ data: ManageAdAssignmentData }>();
    return res.data;
  } catch {
    return null;
  }
}

export async function getManageAdActions(
  adId?: string | number,
  role?: string
): Promise<ManageAdActionsData | null> {
  if (!adId) return null;
  try {
    const res = await api
      .get(`business/advertisements/${encodeURIComponent(String(adId))}/actions`, {
        searchParams: role ? { role } : undefined,
        headers: role ? { "X-Active-Role": role } : undefined,
      })
      .json<{ data: ManageAdActionsData }>();
    return res.data;
  } catch {
    return null;
  }
}

export function useManageAdOverviewQuery(
  adId?: string | number,
  fallbackAd?: Record<string, unknown>
) {
  const activeRole = useActiveAuthRole();
  return useQuery({
    queryKey: ["manage-ad-overview", adId, activeRole],
    queryFn: async () => {
      const live = await getManageAdOverview(adId, activeRole);
      if (live) return live;
      return {
        id: adId ?? "",
        title: String(fallbackAd?.title ?? ""),
        status: {
          code: Number(fallbackAd?.status_code ?? 3),
          key: String(fallbackAd?.status ?? "accepted"),
          label: "منتشر شده",
        },
        assignment_status: String(fallbackAd?.assignment_status ?? "approved"),
        confirm_date: String(fallbackAd?.confirm_date ?? ""),
        expire_date: String(fallbackAd?.expire_date ?? ""),
      };
    },
    enabled: Boolean(adId),
    staleTime: 60_000,
  });
}

export function useManageAdAssignmentQuery(
  adId?: string | number,
  fallbackAd?: Record<string, unknown>
) {
  const activeRole = useActiveAuthRole();
  return useQuery({
    queryKey: ["manage-ad-assignment", adId, activeRole],
    queryFn: async () => {
      const live = await getManageAdAssignment(adId, activeRole);
      if (live) return live;
      return {
        ad_id: adId ?? "",
        can_reassign: true,
        assigned_consultant: fallbackAd?.assigned_consultant as
          | ManageAdAssignmentData["assigned_consultant"]
          | undefined,
      };
    },
    enabled: Boolean(adId),
    staleTime: 60_000,
  });
}

export function useManageAdActionsQuery(adId?: string | number) {
  const activeRole = useActiveAuthRole();
  return useQuery({
    queryKey: ["manage-ad-actions", adId, activeRole],
    queryFn: async () => {
      const live = await getManageAdActions(adId, activeRole);
      if (live) return live;
      return {
        can_ladder: true,
        can_extend: true,
        can_edit: true,
        can_change_publisher: true,
        can_close_deal: true,
        can_delete: true,
        can_stop_publish: false,
      };
    },
    enabled: Boolean(adId),
    staleTime: 60_000,
  });
}

export function useReassignConsultantMutation(adId?: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (consultantId: number | string) => {
      return api
        .patch(`business/advertisements/${encodeURIComponent(String(adId))}/assignment`, {
          json: { consultant_id: consultantId },
        })
        .json();
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["manage-ad-assignment", adId] });
      void qc.invalidateQueries({ queryKey: ["manage-ad-overview", adId] });
    },
  });
}
