import type {
  AgencyConsultantMetrics,
  AgencyConsultantPermissions,
} from "../../../agencies/api/agency.service";

export type ConsultantStatus = "active" | "pending";

export type TeamConsultant = {
  adQuota?: number;
  agencyName?: string;
  agentId?: number;
  avatarSrc?: string;
  id: number;
  isActive?: boolean;
  joinedDate?: string;
  levelSlug?: string;
  levelTitle?: string;
  metrics?: AgencyConsultantMetrics;
  name: string;
  permissions?: AgencyConsultantPermissions;
  phone: string;
  rankingScore?: number;
  renewQuota?: number;
  requestId?: number;
  roleId?: number;
  roleLabel?: string;
  scores: {
    ads: number;
    rocket: number;
    steps: number;
  };
  specialQuota?: number;
  status: ConsultantStatus;
  userId?: number;
};

export type TeamFilter = "consultants" | "pending";
export type AccessRole = "consultant" | "manager";

export const managerAccessItems = [
  { id: "ads", label: "مدیریت آگهی‌ها" },
  { id: "consultants", label: "مدیریت مشاورین" },
  { id: "requests", label: "مدیریت درخواست‌ها" },
  { id: "payments", label: "مدیریت اعتبار" },
  { id: "support", label: "پشتیبانی" },
];

export const consultantTeamPaths = {
  edit: "/account/dashboard/team/edit",
  info: "/account/dashboard/team/info",
  remove: "/account/dashboard/team/remove",
};

export type ConsultantRouteState = {
  consultant?: TeamConsultant;
};
