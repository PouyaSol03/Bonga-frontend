import { useNavigate } from "react-router";
import { getApiErrorMessage } from "../../../shared/api/api";
import { useMyAdvertisementDetailQuery } from "../../advertisements/api/advertisement.hooks";
import type { AdCardData } from "../../advertisements/components/AdCard";
import "../../advertisements/components/AdCard.css";
import { AgencyReassignBottomSheet } from "../ad-state/AgencyReassignBottomSheet";
import { CancelAssignmentBottomSheet } from "../ad-state/CancelAssignmentBottomSheet";
import { RepostChoiceBottomSheet } from "../ad-state/RepostChoiceBottomSheet";
import { StopPublishModal } from "../ad-state/StopPublishModal";
import { getAdPaymentPath } from "../adManagement/adManagementData";
import { usePersonalAdMutations } from "./usePersonalAdMutations";

export function PersonalAdSheets({
  adId,
  card,
  detailQuery,
  isCancelAssignmentModalOpen,
  setIsCancelAssignmentModalOpen,
  isRepostChoiceModalOpen,
  setIsRepostChoiceModalOpen,
  isReassignAgencyModalOpen,
  setIsReassignAgencyModalOpen,
  isStopPublishModalOpen,
  setIsStopPublishModalOpen,
  cancelAssignmentMutation,
  republishPersonalMutation,
  reassignAgencyMutation,
  createStopRequestMutation,
}: {
  adId?: string;
  card: AdCardData;
  detailQuery: ReturnType<typeof useMyAdvertisementDetailQuery>;
  isCancelAssignmentModalOpen: ReturnType<
    typeof usePersonalAdMutations
  >["isCancelAssignmentModalOpen"];
  setIsCancelAssignmentModalOpen: ReturnType<
    typeof usePersonalAdMutations
  >["setIsCancelAssignmentModalOpen"];
  isRepostChoiceModalOpen: ReturnType<typeof usePersonalAdMutations>["isRepostChoiceModalOpen"];
  setIsRepostChoiceModalOpen: ReturnType<
    typeof usePersonalAdMutations
  >["setIsRepostChoiceModalOpen"];
  isReassignAgencyModalOpen: ReturnType<typeof usePersonalAdMutations>["isReassignAgencyModalOpen"];
  setIsReassignAgencyModalOpen: ReturnType<
    typeof usePersonalAdMutations
  >["setIsReassignAgencyModalOpen"];
  isStopPublishModalOpen: ReturnType<typeof usePersonalAdMutations>["isStopPublishModalOpen"];
  setIsStopPublishModalOpen: ReturnType<typeof usePersonalAdMutations>["setIsStopPublishModalOpen"];
  cancelAssignmentMutation: ReturnType<typeof usePersonalAdMutations>["cancelAssignmentMutation"];
  republishPersonalMutation: ReturnType<typeof usePersonalAdMutations>["republishPersonalMutation"];
  reassignAgencyMutation: ReturnType<typeof usePersonalAdMutations>["reassignAgencyMutation"];
  createStopRequestMutation: ReturnType<typeof usePersonalAdMutations>["createStopRequestMutation"];
}) {
  const navigate = useNavigate();
  return (
    <>
      <CancelAssignmentBottomSheet
        isOpen={isCancelAssignmentModalOpen}
        isPending={cancelAssignmentMutation.isPending}
        onCancel={() => setIsCancelAssignmentModalOpen(false)}
        onConfirm={async () => {
          if (!adId) return;
          try {
            await cancelAssignmentMutation.mutateAsync({ advertiseId: adId });
            setIsCancelAssignmentModalOpen(false);
            await detailQuery.refetch();
          } catch (err) {
            alert(getApiErrorMessage(err, "لغو واگذاری با خطا مواجه شد."));
          }
        }}
      />

      <RepostChoiceBottomSheet
        isOpen={isRepostChoiceModalOpen}
        isPersonalPending={republishPersonalMutation.isPending}
        onClose={() => setIsRepostChoiceModalOpen(false)}
        onSelectPersonal={async () => {
          const currentAdId = adId ?? String(card.id);
          if (!currentAdId) return;
          try {
            await republishPersonalMutation.mutateAsync(currentAdId);
            setIsRepostChoiceModalOpen(false);
            navigate(getAdPaymentPath(currentAdId));
          } catch (err) {
            alert(getApiErrorMessage(err, "ثبت مجدد آگهی با خطا مواجه شد."));
          }
        }}
        onSelectAgency={() => {
          setIsRepostChoiceModalOpen(false);
          setIsReassignAgencyModalOpen(true);
        }}
      />

      <AgencyReassignBottomSheet
        isPending={reassignAgencyMutation.isPending}
        isOpen={isReassignAgencyModalOpen}
        onClose={() => setIsReassignAgencyModalOpen(false)}
        onConfirm={async (agencyId) => {
          const currentAdId = adId ?? String(card.id);
          if (!currentAdId) return;
          try {
            await reassignAgencyMutation.mutateAsync({
              advertiseId: currentAdId,
              agencyId,
            });
            setIsReassignAgencyModalOpen(false);
            await detailQuery.refetch();
          } catch (err) {
            alert(getApiErrorMessage(err, "واگذاری مجدد به آژانس با خطا مواجه شد."));
          }
        }}
      />

      {isStopPublishModalOpen ? (
        <StopPublishModal
          isPending={createStopRequestMutation.isPending}
          onClose={() => setIsStopPublishModalOpen(false)}
          onConfirm={async (reason: string, description?: string) => {
            if (!adId) return;
            try {
              await createStopRequestMutation.mutateAsync({
                advertiseId: adId,
                reason,
                description,
              });
              setIsStopPublishModalOpen(false);
              await detailQuery.refetch();
            } catch (err) {
              alert(getApiErrorMessage(err, "ثبت درخواست توقف با خطا مواجه شد."));
            }
          }}
        />
      ) : null}
    </>
  );
}
