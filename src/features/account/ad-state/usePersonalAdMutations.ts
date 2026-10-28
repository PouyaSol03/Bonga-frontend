import { useState } from "react";
import {
  useCancelStopPublishRequestMutation,
  useCancelUserAssignmentMutation,
  useConfirmUserDealResultMutation,
  useCreateStopPublishRequestMutation,
  useReassignAdToAgencyMutation,
  useRepublishAdAsPersonalMutation,
  useRestoreArchivedAdMutation,
} from "../../advertisements/api/agency-advertise-assignment.hooks";
import "../../advertisements/components/AdCard.css";

export function usePersonalAdMutations() {
  const [isCancelAssignmentModalOpen, setIsCancelAssignmentModalOpen] = useState(false);
  const [isRepostChoiceModalOpen, setIsRepostChoiceModalOpen] = useState(false);
  const [isReassignAgencyModalOpen, setIsReassignAgencyModalOpen] = useState(false);
  const [isStopPublishModalOpen, setIsStopPublishModalOpen] = useState(false);

  const cancelAssignmentMutation = useCancelUserAssignmentMutation();
  const restoreArchivedMutation = useRestoreArchivedAdMutation();
  const republishPersonalMutation = useRepublishAdAsPersonalMutation();
  const reassignAgencyMutation = useReassignAdToAgencyMutation();
  const createStopRequestMutation = useCreateStopPublishRequestMutation();
  const cancelStopRequestMutation = useCancelStopPublishRequestMutation();
  const confirmDealResultMutation = useConfirmUserDealResultMutation();
  return {
    isCancelAssignmentModalOpen,
    setIsCancelAssignmentModalOpen,
    isRepostChoiceModalOpen,
    setIsRepostChoiceModalOpen,
    isReassignAgencyModalOpen,
    setIsReassignAgencyModalOpen,
    isStopPublishModalOpen,
    setIsStopPublishModalOpen,
    cancelAssignmentMutation,
    restoreArchivedMutation,
    republishPersonalMutation,
    reassignAgencyMutation,
    createStopRequestMutation,
    cancelStopRequestMutation,
    confirmDealResultMutation,
  };
}
