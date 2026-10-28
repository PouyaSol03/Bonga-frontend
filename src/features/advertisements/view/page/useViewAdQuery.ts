import { getActiveAuthRole, getStoredAuthSession } from "../../../../shared/auth/auth-storage";
import { REAL_ESTATE_MANAGER } from "../../../../shared/constants/roles.constants";
import {
  useAgencyAdvertisementPreviewQuery,
  useAdvertisementDetailQuery,
  useAdvertisementPreviewQuery,
} from "../../api/advertisement.hooks";
import { shouldUseAgencyAllocationPreview } from "../viewAdPreviewContext";

export function useViewAdQuery(adId: string | null, isPreview: boolean) {
  const activeRole = getActiveAuthRole(getStoredAuthSession());
  const isAgencyManager = activeRole === REAL_ESTATE_MANAGER;
  const initialAgencyPreview = isPreview && (isAgencyManager || shouldUseAgencyAllocationPreview());
  const detailQuery = useAdvertisementDetailQuery(isPreview ? null : adId);
  const agencyPreviewQuery = useAgencyAdvertisementPreviewQuery(initialAgencyPreview ? adId : null);
  const previewQuery = useAdvertisementPreviewQuery(
    isPreview && (!initialAgencyPreview || agencyPreviewQuery.isError) ? adId : null,
  );
  const activePreviewQuery =
    initialAgencyPreview && !agencyPreviewQuery.isError ? agencyPreviewQuery : previewQuery;
  const {
    data: ad,
    error,
    isError,
    isLoading,
    refetch,
  } = isPreview ? activePreviewQuery : detailQuery;
  const useAgencyAllocationPreview =
    isPreview && (ad ? shouldUseAgencyAllocationPreview(ad) : shouldUseAgencyAllocationPreview());
  const isPersonalPreview =
    isPreview &&
    !useAgencyAllocationPreview &&
    (String(ad?.publisher_type ?? ad?.owner_type ?? "user").toLowerCase() === "user" ||
      String(ad?.publisher_type ?? ad?.owner_type ?? "").toLowerCase() === "personal");
  const showAgencyOwnerContact = isPreview && !useAgencyAllocationPreview && !isPersonalPreview;
  return {
    ad,
    error,
    isError,
    isLoading,
    refetch,
    useAgencyAllocationPreview,
    isPersonalPreview,
    showAgencyOwnerContact,
  };
}
