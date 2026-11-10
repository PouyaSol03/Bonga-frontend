import { useState } from "react";
import { useNavigate } from "react-router";
import { getApiErrorMessage } from "../../../shared/api/api";
import { getAdPaymentPath } from "../adManagement/adManagementData";
import type { useCancelUserAssignmentMutation, useReassignAdToAgencyMutation, useRepublishAdAsPersonalMutation } from "../../advertisements/api/agency-advertise-assignment.hooks";

export function useAgencyAssignedModals({
  cancelAssignmentMutation,
  currentAdId,
  initialCancelAssignmentOpen = false,
  initialRepostChoiceOpen = false,
  onRefetch,
  reassignAgencyMutation,
  republishPersonalMutation,
}: {
  cancelAssignmentMutation: ReturnType<typeof useCancelUserAssignmentMutation>;
  currentAdId?: string | number;
  initialCancelAssignmentOpen?: boolean;
  initialRepostChoiceOpen?: boolean;
  onRefetch?: () => Promise<unknown> | void;
  reassignAgencyMutation: ReturnType<typeof useReassignAdToAgencyMutation>;
  republishPersonalMutation: ReturnType<typeof useRepublishAdAsPersonalMutation>;
}) {
  const navigate = useNavigate();
  const [isCancelAssignmentOpen, setIsCancelAssignmentOpen] = useState(initialCancelAssignmentOpen);
  const [isRepostChoiceOpen, setIsRepostChoiceOpen] = useState(initialRepostChoiceOpen);
  const [isReassignAgencyOpen, setIsReassignAgencyOpen] = useState(false);

  const handleCancelAssignmentConfirm = async () => {
    if (!currentAdId) return;
    try {
      await cancelAssignmentMutation.mutateAsync({ advertiseId: currentAdId });
      setIsCancelAssignmentOpen(false);
      if (onRefetch) await onRefetch();
    } catch (err) {
      alert(getApiErrorMessage(err, "لغو واگذاری با خطا مواجه شد."));
    }
  };

  const handleReassignAgencyConfirm = async (newAgencyId: string | number) => {
    if (!currentAdId) return;
    try {
      await reassignAgencyMutation.mutateAsync({
        advertiseId: currentAdId,
        agencyId: newAgencyId,
      });
      setIsReassignAgencyOpen(false);
      if (onRefetch) await onRefetch();
    } catch (err) {
      alert(getApiErrorMessage(err, "واگذاری مجدد به آژانس با خطا مواجه شد."));
    }
  };

  const handleSelectPersonalForRepost = async () => {
    if (!currentAdId) return;
    try {
      await republishPersonalMutation.mutateAsync(currentAdId);
      setIsRepostChoiceOpen(false);
      navigate(getAdPaymentPath(currentAdId));
    } catch (err) {
      alert(getApiErrorMessage(err, "ثبت مجدد آگهی با خطا مواجه شد."));
    }
  };

  const handleSelectAgencyForRepost = () => {
    setIsRepostChoiceOpen(false);
    setIsReassignAgencyOpen(true);
  };

  return {
    handleCancelAssignmentConfirm,
    handleReassignAgencyConfirm,
    handleSelectAgencyForRepost,
    handleSelectPersonalForRepost,
    isCancelAssignmentOpen,
    isReassignAgencyOpen,
    isRepostChoiceOpen,
    setIsCancelAssignmentOpen,
    setIsReassignAgencyOpen,
    setIsRepostChoiceOpen,
  };
}
