import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActiveAuthRole } from "../../../../shared/auth/use-active-auth-role";
import { getV2Overview } from "../../api/v2";
import { getV2AdvertiseAssignment } from "../../api/agency-advertise-assignment.service";

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
): Promise<ManageAdOverviewData | null> {
  if (!adId) return null;
  try {
    const res = await getV2Overview(adId);
    const data = (res as { data?: ManageAdOverviewData })?.data ?? (res as ManageAdOverviewData);
    return data ?? null;
  } catch {
    return null;
  }
}

export async function getManageAdAssignment(
  adId?: string | number,
): Promise<ManageAdAssignmentData | null> {
  if (!adId) return null;
  try {
    const res = await getV2AdvertiseAssignment(adId);
    const raw = res?.data;
    if (Array.isArray(raw) && raw.length > 0) {
      const latest = raw[0] as Record<string, unknown>;
      return {
        ad_id: adId,
        can_reassign: true,
        agency: latest?.agency as ManageAdAssignmentData["agency"] ?? (latest?.target_agency_id ? { id: Number(latest.target_agency_id), name: String(latest.agency_name || "") } : undefined),
        assigned_consultant: latest?.consultant as ManageAdAssignmentData["assigned_consultant"] ?? (latest?.target_consultant_id ? { id: Number(latest.target_consultant_id), full_name: String(latest.consultant_name || "") } : undefined),
      };
    }
    if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      return {
        ad_id: adId,
        can_reassign: true,
        agency: (obj.agency as ManageAdAssignmentData["agency"]) ?? undefined,
        assigned_consultant: (obj.assigned_consultant as ManageAdAssignmentData["assigned_consultant"]) ?? undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getManageAdActions(
  adId?: string | number,
): Promise<ManageAdActionsData | null> {
  if (!adId) return null;
  return null;
}

export function useManageAdOverviewQuery(
  adId?: string | number,
  fallbackAd?: Record<string, unknown>
) {
  const activeRole = useActiveAuthRole();
  return useQuery({
    queryKey: ["manage-ad-overview", adId ? String(adId) : "", activeRole],
    queryFn: async () => {
      const live = await getManageAdOverview(adId);
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
    queryKey: ["manage-ad-assignment", adId ? String(adId) : "", activeRole],
    queryFn: async () => {
      const live = await getManageAdAssignment(adId);
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
    queryKey: ["manage-ad-actions", adId ? String(adId) : "", activeRole],
    queryFn: async () => {
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
  const activeRole = useActiveAuthRole();
  return useMutation({
    mutationFn: async () => {
      return null;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["manage-ad-assignment", String(adId), activeRole] });
      void qc.invalidateQueries({ queryKey: ["manage-ad-overview", String(adId), activeRole] });
    },
  });
}

