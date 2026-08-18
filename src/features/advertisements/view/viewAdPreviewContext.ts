import { getStoredBackTarget } from "../../../shared/navigation/navigation";
import { getActiveAuthRole, getStoredAuthSession } from "../../../shared/auth/auth-storage";
import {
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

export function shouldUseAgencyAllocationPreview() {
  if (typeof window === "undefined") return false;
  if (!window.location.pathname.startsWith("/preview-ad/")) return false;

  const activeRole = getActiveAuthRole(getStoredAuthSession());
  const isAgencyRole =
    activeRole === REAL_ESTATE_MANAGER || activeRole === REAL_ESTATE_CONSULTANT;

  if (!isAgencyRole) return false;

  if (isAgencyAllocationState(window.history.state)) return true;

  return isAgencyAllocationState(getStoredBackTarget()?.backState);
}
