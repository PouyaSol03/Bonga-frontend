import { useState } from "react";
import { useNavigate } from "react-router";
import { getApiErrorMessage } from "../../../shared/api/api";
import {
  useDeleteAdvertisementMutation,
  useRemoveAgencyAdvertisementMutation,
} from "../../advertisements/api/advertisement.hooks";

export function useManagerAdDeletion(
  adId: string,
  backTo: string,
  backState?: unknown,
  isIndependentConsultant = false,
) {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const removeAgencyAdMutation = useRemoveAgencyAdvertisementMutation();
  const deleteAdMutation = useDeleteAdvertisementMutation();

  const handleDeleteAd = async () => {
    setIsDeleting(true);
    try {
      if (isIndependentConsultant) {
        await deleteAdMutation.mutateAsync({
          advertiseId: adId,
          description: "حذف توسط مشاور",
        });
      } else {
        await removeAgencyAdMutation.mutateAsync({
          advertiseId: adId,
          payload: {
            reason: "other",
            description: "حذف توسط آژانس",
          },
        });
      }
      setIsDeleteDialogOpen(false);
      navigate(backTo, { state: backState ?? {} });
    } catch (err) {
      alert(getApiErrorMessage(err, "حذف آگهی با خطا مواجه شد."));
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleteDialogOpen, setIsDeleteDialogOpen, isDeleting, handleDeleteAd };
}
