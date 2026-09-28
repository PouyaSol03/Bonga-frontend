import { getStoredBackTarget } from "../../../shared/navigation/navigation";
import { getActiveAuthRole, getStoredAuthSession } from "../../../shared/auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../../shared/constants/roles.constants";

const agencyAllocationPreviewFlow = "agency-allocation";

type PreviewNavigationState = {
  previewFlow?: unknown;
};

function isAgencyAllocationState(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  return (value as PreviewNavigationState).previewFlow === agencyAllocationPreviewFlow;
}

export function isAgencyAuthRole() {
  const activeRole = getActiveAuthRole(getStoredAuthSession());
  return (
    activeRole === REAL_ESTATE_MANAGER ||
    activeRole === REAL_ESTATE_CONSULTANT ||
    activeRole === INDEPENDENT_CONSULTANT
  );
}

export function shouldUseAgencyAllocationPreview(ad?: unknown) {
  if (typeof window === "undefined") return false;
  if (!window.location.pathname.startsWith("/preview-ad/")) return false;

  // 1. Explicit previewFlow in history state or backTarget
  if (isAgencyAllocationState(window.history.state)) return true;
  if (isAgencyAllocationState(getStoredBackTarget()?.backState)) return true;

  // 2. Query parameter indicator
  try {
    const searchParams = new URLSearchParams(window.location.search);
    if (
      searchParams.get("previewFlow") === agencyAllocationPreviewFlow ||
      searchParams.get("from") === "allocation"
    ) {
      return true;
    }
  } catch {
    // ignore
  }

  // 3. Ad object indicates assignment to agency / wait_for_agency
  if (ad && typeof ad === "object") {
    const raw = ad as Record<string, unknown>;
    const status = raw.status || raw.status_key;
    if (
      status === "wait_for_agency" ||
      status === "pending" ||
      Boolean(raw.is_assigned) ||
      Boolean(raw.isAssigned) ||
      Boolean(raw.assigned_agency_id) ||
      Boolean(raw.assignedAgencyId) ||
      Boolean(raw.agency_id) ||
      Boolean(raw.agencyId) ||
      Boolean(raw.agency) ||
      Boolean(raw.assignment) ||
      raw.deleted_reason === "agency_deal"
    ) {
      return true;
    }
  }

  // 4. Role check if the active user is an agency / consultant
  return isAgencyAuthRole();
}
