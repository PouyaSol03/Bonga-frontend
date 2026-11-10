import { useMyAdvertisementDetailQuery } from "../../advertisements/api/advertisement.hooks";
import {
  useAdvertisementArchiveStatusQuery,
  useAdvertisementReRegisterStatusQuery,
  useAdvertisementSubmitResultStatusQuery,
} from "../../advertisements/api/agency-advertise-assignment.hooks";
import type { AdCardData } from "../../advertisements/components/AdCard";
import "../../advertisements/components/AdCard.css";
import { ArchivedNotice } from "../ad-state/ArchivedNotice";
import { NeedsEditNotice } from "../ad-state/NeedsEditNotice";
import { PendingReviewNotice } from "../ad-state/PendingReviewNotice";
import { PublishedMeta } from "../ad-state/PublishedMeta";
import { RejectedByAgencyNotice } from "../ad-state/RejectedByAgencyNotice";
import { WaitForAgencyNotice } from "../ad-state/WaitForAgencyNotice";
import { WaitForDealConfirmationNotice } from "../ad-state/WaitForDealConfirmationNotice";
import { WaitForRepostNotice } from "../ad-state/WaitForRepostNotice";
import { WaitForStopNotice } from "../ad-state/WaitForStopNotice";
import { getMyAdStatusInfo } from "../myAdsStatus";
import { usePersonalAdMutations } from "./usePersonalAdMutations";

export function PersonalAdNotices({
  statusInfo,
  sourceAd,
  card,
  backTo,
  adId,
  detailQuery,
  reRegisterStatusQuery,
  archiveStatusQuery,
  submitResultStatusQuery,
  restoreArchivedMutation,
  cancelStopRequestMutation,
  confirmDealResultMutation,
  setIsCancelAssignmentModalOpen,
  setIsRepostChoiceModalOpen,
}: {
  statusInfo: ReturnType<typeof getMyAdStatusInfo>;
  sourceAd?: Record<string, unknown>;
  card: AdCardData;
  backTo: string;
  adId?: string;
  detailQuery: ReturnType<typeof useMyAdvertisementDetailQuery>;
  reRegisterStatusQuery: ReturnType<typeof useAdvertisementReRegisterStatusQuery>;
  archiveStatusQuery: ReturnType<typeof useAdvertisementArchiveStatusQuery>;
  submitResultStatusQuery: ReturnType<typeof useAdvertisementSubmitResultStatusQuery>;
  restoreArchivedMutation: ReturnType<typeof usePersonalAdMutations>["restoreArchivedMutation"];
  cancelStopRequestMutation: ReturnType<typeof usePersonalAdMutations>["cancelStopRequestMutation"];
  confirmDealResultMutation: ReturnType<typeof usePersonalAdMutations>["confirmDealResultMutation"];
  setIsCancelAssignmentModalOpen: (open: boolean) => void;
  setIsRepostChoiceModalOpen: (open: boolean) => void;
}) {
  return (
    <>
      {statusInfo.key === "published" ? <PublishedMeta ad={sourceAd} /> : null}
      {statusInfo.key === "wait_for_agency" ? (
        <WaitForAgencyNotice
          ad={sourceAd}
          onCancelAssignment={() => setIsCancelAssignmentModalOpen(true)}
        />
      ) : null}
      {statusInfo.key === "wait_for_repost" &&
      (reRegisterStatusQuery.data !== undefined
        ? Boolean(reRegisterStatusQuery.data?.data?.status ?? reRegisterStatusQuery.data?.status)
        : false) ? (
        <WaitForRepostNotice
          ad={sourceAd}
          reRegisterData={reRegisterStatusQuery.data}
          onRepost={() => setIsRepostChoiceModalOpen(true)}
        />
      ) : null}
      {statusInfo.key === "archived" &&
      (archiveStatusQuery.data !== undefined
        ? Boolean(archiveStatusQuery.data?.data?.status ?? archiveStatusQuery.data?.status)
        : false) ? (
        <ArchivedNotice
          ad={sourceAd}
          archiveData={archiveStatusQuery.data}
          isPending={restoreArchivedMutation.isPending}
          onRestore={async () => {
            if (adId) {
              await restoreArchivedMutation.mutateAsync(adId);
              void detailQuery.refetch();
            }
          }}
        />
      ) : null}
      {statusInfo.key === "rejected_by_agency" ? (
        <RejectedByAgencyNotice ad={sourceAd} onRepost={() => setIsRepostChoiceModalOpen(true)} />
      ) : null}
      {statusInfo.key === "wait_for_stop" ? (
        <WaitForStopNotice
          isPending={cancelStopRequestMutation.isPending}
          onCancelStop={async () => {
            if (adId) {
              await cancelStopRequestMutation.mutateAsync(adId);
              void detailQuery.refetch();
            }
          }}
        />
      ) : null}
      {statusInfo.key === "wait_for_deal_confirmation" &&
      (submitResultStatusQuery.data !== undefined
        ? Boolean(
            submitResultStatusQuery.data?.data?.status ?? submitResultStatusQuery.data?.status,
          )
        : false) ? (
        <WaitForDealConfirmationNotice
          ad={sourceAd}
          submitResultData={submitResultStatusQuery.data}
          isPending={confirmDealResultMutation.isPending}
          onConfirm={async (confirmed: boolean) => {
            if (adId) {
              await confirmDealResultMutation.mutateAsync({ advertiseId: adId, confirmed });
              void detailQuery.refetch();
            }
          }}
        />
      ) : null}
      {statusInfo.key === "pending" ? <PendingReviewNotice /> : null}
      {statusInfo.key === "needs_edit" ? (
        <NeedsEditNotice ad={sourceAd} card={card} returnTo={backTo} />
      ) : null}
    </>
  );
}
