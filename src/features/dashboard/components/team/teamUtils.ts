import type { AgencyConsultantDto } from "../../../agencies/api/agency.service";
import { toEnglishDigits, toPersianNumber } from "../../../../shared/lib/numberUtils";
import type { ConsultantRouteState, TeamConsultant } from "./teamTypes";

export function getTeamRoleLabel(role: string) {
  switch (role.trim().toLowerCase()) {
    case "owner":
      return "مدیر آژانس";
    case "manager":
      return "مدیر";
    case "consultant":
    case "member":
      return "مشاور";
    default:
      return role.trim() || "مشاور";
  }
}

export function mapAgencyConsultantToTeamConsultant(
  consultant: AgencyConsultantDto,
): TeamConsultant {
  return {
    adQuota: consultant.adQuota,
    agencyName: consultant.agencyName,
    agentId: consultant.agentId,
    avatarSrc: consultant.avatar,
    id: consultant.agentId ?? consultant.userId,
    isActive: consultant.isActive,
    joinedDate: consultant.joinedDate,
    levelSlug: consultant.ranking?.levelSlug,
    levelTitle: consultant.ranking?.levelTitle,
    metrics: consultant.metrics,
    name: consultant.name,
    permissions: consultant.permissions,
    phone: consultant.mobile,
    rankingScore: consultant.ranking?.score ?? consultant.metrics.rankingScore,
    renewQuota: consultant.renewQuota,
    requestId: consultant.requestId,
    roleId: consultant.roleId,
    roleLabel: getTeamRoleLabel(consultant.role),
    scores: {
      ads: consultant.metrics.publishedAdvertises,
      rocket: consultant.metrics.specialUsed,
      steps: consultant.metrics.renewUsed,
    },
    specialQuota: consultant.specialQuota,
    status: consultant.isActive ? "active" : "pending",
    userId: consultant.userId,
  };
}

export function getRouteConsultantId() {
  const routeConsultantId = window.location.pathname.match(
    /\/team\/(?:info|edit|remove)\/([^/]+)\/?$/,
  )?.[1];
  const parsedId = Number(routeConsultantId);

  return Number.isFinite(parsedId) && parsedId > 0 ? parsedId : undefined;
}

export function getRouteConsultant(): TeamConsultant {
  const routeState = window.history.state as ConsultantRouteState | null;
  const routeConsultantId = getRouteConsultantId();
  const stateConsultant = routeState?.consultant;

  if (
    stateConsultant &&
    routeConsultantId !== undefined &&
    (stateConsultant.agentId === routeConsultantId || stateConsultant.id === routeConsultantId)
  ) {
    return stateConsultant;
  }

  return {
    id: routeConsultantId ?? 0,
    name: "—",
    phone: "",
    scores: { ads: 0, rocket: 0, steps: 0 },
    status: "active",
  };
}

export function formatPhoneNumber(phone?: string) {
  if (!phone) return "";
  const enDigits = toEnglishDigits(phone).replace(/\D/g, "");
  if (enDigits.length === 11 && enDigits.startsWith("09")) {
    return toPersianNumber(
      `${enDigits.slice(0, 4)} ${enDigits.slice(4, 7)} ${enDigits.slice(7)}`,
    );
  }
  return toPersianNumber(phone);
}
