import { AgencyCancelAssignmentBottomSheet } from "./AgencyCancelAssignmentBottomSheet";
import { RepostChoiceBottomSheet } from "./RepostChoiceBottomSheet";
import { AgencyReassignBottomSheet } from "./AgencyReassignBottomSheet";

export function AgencyAssignedModals({
  isCancelAssignmentOpen,
  isCancelPending,
  isPersonalPending,
  isReassignAgencyOpen,
  isReassignPending,
  isRepostChoiceOpen,
  onCancelAssignmentClose,
  onCancelAssignmentConfirm,
  onReassignAgencyClose,
  onReassignAgencyConfirm,
  onRepostChoiceClose,
  onSelectAgencyForRepost,
  onSelectPersonalForRepost,
}: {
  isCancelAssignmentOpen: boolean;
  isCancelPending: boolean;
  isPersonalPending: boolean;
  isReassignAgencyOpen: boolean;
  isReassignPending: boolean;
  isRepostChoiceOpen: boolean;
  onCancelAssignmentClose: () => void;
  onCancelAssignmentConfirm: () => void;
  onReassignAgencyClose: () => void;
  onReassignAgencyConfirm: (agencyId: string | number) => void;
  onRepostChoiceClose: () => void;
  onSelectAgencyForRepost: () => void;
  onSelectPersonalForRepost: () => void;
}) {
  return (
    <>
      <AgencyCancelAssignmentBottomSheet
        isOpen={isCancelAssignmentOpen}
        isPending={isCancelPending}
        onClose={onCancelAssignmentClose}
        onConfirm={onCancelAssignmentConfirm}
      />

      <RepostChoiceBottomSheet
        isOpen={isRepostChoiceOpen}
        isPersonalPending={isPersonalPending}
        onClose={onRepostChoiceClose}
        onSelectPersonal={onSelectPersonalForRepost}
        onSelectAgency={onSelectAgencyForRepost}
      />

      <AgencyReassignBottomSheet
        isOpen={isReassignAgencyOpen}
        isPending={isReassignPending}
        onClose={onReassignAgencyClose}
        onConfirm={onReassignAgencyConfirm}
      />
    </>
  );
}
