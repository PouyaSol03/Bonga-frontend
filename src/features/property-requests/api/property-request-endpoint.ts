import { getActiveV2Role, type V2RoleSegment } from "../../../shared/api/api";
import {
  getActiveAuthRole,
  getStoredAuthSession,
} from "../../../shared/auth/auth-storage";
import type {
  PropertyRequestOwnerType,
  PropertyRequestScope,
} from "./property-request-types";

const V2_SUPPORTED_REQUEST_ROLES: ReadonlySet<V2RoleSegment> = new Set<V2RoleSegment>([
  "agency",
  "agency-consultant",
]);

export function resolvePropertyRequestOwnerType(): PropertyRequestOwnerType {
  const activeRole = getActiveAuthRole(getStoredAuthSession());
  if (activeRole === "real_estate_manager") return "agency";
  if (activeRole === "real_estate_consultant") return "agency-consultant";
  return "user";
}

export function resolvePropertyRequestScope(
  overrideOwner?: PropertyRequestOwnerType,
): PropertyRequestScope {
  const v2Role = getActiveV2Role();
  const ownerType = overrideOwner ?? resolvePropertyRequestOwnerType();

  const isV2Supported = V2_SUPPORTED_REQUEST_ROLES.has(v2Role);

  if (isV2Supported) {
    return {
      apiVersion: "v2",
      basePath: `${v2Role}/requests`,
      ownerType,
      roleSegment: v2Role,
    };
  }

  return {
    apiVersion: "v1",
    basePath: ownerType === "agency" ? "agency/requests" : "me/requests",
    ownerType,
    roleSegment: v2Role,
  };
}

export function buildPropertyRequestPath(subPath?: string): string {
  const scope = resolvePropertyRequestScope();
  const cleanSubPath = subPath ? subPath.replace(/^\/+/, "") : "";
  return cleanSubPath ? `${scope.basePath}/${cleanSubPath}` : scope.basePath;
}

export function getRequestSenderInfo(ownerType: PropertyRequestOwnerType) {
  if (ownerType === "agency") {
    return {
      senderLabel: "آژانس املاک",
      senderRole: "real_estate_manager",
    };
  }

  if (ownerType === "agency-consultant") {
    return {
      senderLabel: "مشاور آژانس",
      senderRole: "real_estate_consultant",
    };
  }

  const activeRole = getActiveAuthRole(getStoredAuthSession());
  if (activeRole === "independent_consultant") {
    return {
      senderLabel: "مشاور مستقل",
      senderRole: "independent_consultant",
    };
  }

  return {
    senderLabel: "آگهی شخصی",
    senderRole: "user",
  };
}
