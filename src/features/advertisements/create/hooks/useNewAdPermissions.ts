import { getActiveV2Role } from "../../../../shared/api/api";
import { getActiveAuthRole, getStoredAuthSession } from "../../../../shared/auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../../../shared/constants/roles.constants";
import type { AdvertisementItem } from "../../api/advertisement.service";
import { getEditAdRouteState } from "../routeState";
import { getParams } from "../utils";

export function useNewAdPermissions(
  editAdState: ReturnType<typeof getEditAdRouteState>,
  editAdData?: AdvertisementItem,
) {
  const routeParams = getParams();
  const authSession = getStoredAuthSession();
  const activeRole = getActiveAuthRole(authSession) ?? "";
  const activeV2Role = getActiveV2Role();
  const managerPermissions =
    authSession?.contextPermissions?.real_estate_consultant ??
    authSession?.managerPermissions;
  const hasAdManagementPermission = Boolean(
    managerPermissions?.manage_advertises ?? managerPermissions?.ad_management,
  );
  const hasConsultantManagementPermission = Boolean(
    managerPermissions?.manage_consultants,
  );
  const isAgencyConsultantManager =
    (activeRole === REAL_ESTATE_CONSULTANT || activeV2Role === "agency-consultant") &&
    hasAdManagementPermission &&
    hasConsultantManagementPermission;

  const isAgencyRole = activeRole === REAL_ESTATE_MANAGER;
  const isAgencyConsultantUser =
    activeRole === REAL_ESTATE_CONSULTANT ||
    routeParams.publisherType === "agent" ||
    routeParams.publisherType === "consultant";
  const isIndependentUser = activeRole === INDEPENDENT_CONSULTANT;

  const canChangePublisher =
    (!isIndependentUser &&
      !isAgencyConsultantUser &&
      (isAgencyRole || routeParams.publisherType === "agency")) ||
    isAgencyConsultantManager;

  const isAssigned = Boolean(
    (editAdState as any)?.isAssigned ||
      (editAdState.ad as any)?.isAssigned ||
      (editAdState.ad as any)?.assignment_status ||
      (editAdState.ad as any)?.assigned_agency_id ||
      (editAdData as any)?.isAssigned ||
      (editAdData as any)?.assignment_status ||
      (editAdData as any)?.assigned_agency_id ||
      (editAdState.card as any)?.isAssigned,
  );

  return {
    activeRole,
    activeV2Role,
    canChangePublisher,
    isAgencyConsultantManager,
    isAgencyConsultantUser,
    isAgencyRole,
    isAssigned,
    isIndependentUser,
    routeParams,
  };
}
