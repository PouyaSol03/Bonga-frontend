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

  // 1. If ad object is provided, it is the ground truth
  if (ad && typeof ad === "object") {
    const raw = ad as Record<string, unknown>;
    if (raw.is_assigned === false || raw.isAssigned === false) {
      return false;
    }
    const status = raw.status || raw.status_key;
    if (
      status === "wait_for_agency" ||
      raw.assignment_status === "pending" ||
      raw.assignment_status === "accepted" ||
      Boolean(raw.is_assigned) ||
      Boolean(raw.isAssigned) ||
      raw.deleted_reason === "agency_deal"
    ) {
      return true;
    }
    return false;
  }

  // 2. Explicit previewFlow in history state or backTarget
  if (isAgencyAllocationState(window.history.state)) return true;
  if (isAgencyAllocationState(getStoredBackTarget()?.backState)) return true;

  // 3. Query parameter indicator
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

  return false;
}
