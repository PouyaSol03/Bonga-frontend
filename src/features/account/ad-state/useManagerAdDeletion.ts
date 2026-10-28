import { useState } from "react";
import { useNavigate } from "react-router";
import { getApiErrorMessage } from "../../../shared/api/api";
import { useRemoveAgencyAdvertisementMutation } from "../../advertisements/api/advertisement.hooks";

export function useManagerAdDeletion(adId: string, backTo: string, backState?: unknown) {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const removeAgencyAdMutation = useRemoveAgencyAdvertisementMutation();

  const handleDeleteAd = async () => {
    setIsDeleting(true);
    try {
      await removeAgencyAdMutation.mutateAsync({
        advertiseId: adId,
        payload: {
          reason: "other",
          description: "حذف توسط آژانس",
        },
      });
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
