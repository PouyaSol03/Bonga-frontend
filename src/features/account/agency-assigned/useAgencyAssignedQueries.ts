import {
  useAdvertisementArchiveStatusQuery,
  useAdvertisementHistoryQuery,
  useAdvertisementReRegisterStatusQuery,
  useAdvertisementSubmitResultStatusQuery,
  useCancelUserAssignmentMutation,
  useReassignAdToAgencyMutation,
  useRepublishAdAsPersonalMutation,
  useRestoreArchivedAdMutation,
} from "../../advertisements/api/agency-advertise-assignment.hooks";
import type { AgencyAssignedDeletedVariant } from "./types";

export function useAgencyAssignedQueries({
  ad,
  currentAdId,
  deletedVariant,
  statusKey,
}: {
  ad?: Record<string, unknown>;
  currentAdId?: string | number;
  deletedVariant?: AgencyAssignedDeletedVariant;
  statusKey: string;
}) {
  const cancelAssignmentMutation = useCancelUserAssignmentMutation();
  const restoreArchivedMutation = useRestoreArchivedAdMutation();
  const republishPersonalMutation = useRepublishAdAsPersonalMutation();
  const reassignAgencyMutation = useReassignAdToAgencyMutation();

  const isPublished = statusKey === "published";
  const isWaitForAdmin = statusKey === "pending";
  const isWaitForAgency = statusKey === "wait_for_agency";
  const isWaitForRepost = statusKey === "wait_for_repost";
  const isArchived = statusKey === "archived";
  const isWaitForDeal = statusKey === "wait_for_deal_confirmation";
  const isWaitForStop = statusKey === "wait_for_stop";
  const isDeleted = statusKey === "deleted" || statusKey === "incomplete_deleted";

  const effectiveDeletedVariant: AgencyAssignedDeletedVariant =
    deletedVariant ??
    (isWaitForDeal || ad?.deleted_reason === "agency_deal"
      ? "deal_confirmation"
      : isWaitForStop || ad?.deleted_reason === "user_stopped"
        ? "user_stopped"
        : "recovery_expired");

  const historyQuery = useAdvertisementHistoryQuery(currentAdId);
  const reRegisterStatusQuery = useAdvertisementReRegisterStatusQuery(currentAdId);
  const archiveStatusQuery = useAdvertisementArchiveStatusQuery(currentAdId);
  const submitResultStatusQuery = useAdvertisementSubmitResultStatusQuery(currentAdId);

  const showRepostSection =
    reRegisterStatusQuery.data !== undefined
      ? Boolean(reRegisterStatusQuery.data?.data?.status ?? reRegisterStatusQuery.data?.status)
      : isWaitForRepost;

  const showArchiveSection =
    archiveStatusQuery.data !== undefined
      ? Boolean(archiveStatusQuery.data?.data?.status ?? archiveStatusQuery.data?.status)
      : isArchived;

  const showSubmitResultSection =
    submitResultStatusQuery.data !== undefined
      ? Boolean(submitResultStatusQuery.data?.data?.status ?? submitResultStatusQuery.data?.status)
      : (isDeleted || isWaitForDeal) && effectiveDeletedVariant === "deal_confirmation";

  return {
    archiveStatusQuery,
    cancelAssignmentMutation,
    effectiveDeletedVariant,
    historyQuery,
    isArchived,
    isDeleted,
    isPublished,
    isWaitForAdmin,
    isWaitForAgency,
    isWaitForDeal,
    isWaitForRepost,
    isWaitForStop,
    reassignAgencyMutation,
    republishPersonalMutation,
    reRegisterStatusQuery,
    restoreArchivedMutation,
    showArchiveSection,
    showRepostSection,
    showSubmitResultSection,
    submitResultStatusQuery,
  };
}
