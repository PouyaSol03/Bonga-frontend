import type { AgencyConsultantPermissions } from "../../../../agencies/api/agency.service";
import { managerAccessItems, type AccessRole, type TeamConsultant } from "../teamTypes";

export function getAgencyConsultantAccessRole(consultant: TeamConsultant): AccessRole {
  return consultant.roleId === 2 ||
    ["مدیر", "مدیر آژانس"].includes(consultant.roleLabel?.trim() ?? "")
    ? "manager"
    : "consultant";
}

export function getManagerAccessFromPermissions(permissions?: AgencyConsultantPermissions) {
  if (!permissions) return [];

  return managerAccessItems
    .filter((item) => {
      switch (item.id) {
        case "ads":
          return permissions.manage_advertises;
        case "consultants":
          return permissions.manage_consultants;
        case "requests":
          return permissions.manage_requests;
        case "payments":
          return permissions.manage_credits;
        case "support":
          return permissions.support;
        default:
          return false;
      }
    })
    .map((item) => item.id);
}

export function buildManagerPermissions(
  accessRole: AccessRole,
  managerAccess: string[],
): AgencyConsultantPermissions | Record<string, never> {
  if (accessRole === "consultant") return {};

  return {
    manage_advertises: managerAccess.includes("ads"),
    manage_consultants: managerAccess.includes("consultants"),
    manage_credits: managerAccess.includes("payments"),
    manage_requests: managerAccess.includes("requests"),
    support: managerAccess.includes("support"),
  };
}
