import { useNavigate } from "react-router";
import type { AdCardData } from "../../advertisements/components/AdCard";
import { getAdEditPath, getAdPreviewPath } from "../adManagement/adManagementData";

export function useAgencyAssignedNavigation({
  ad,
  card,
  currentAdId,
  onNavigateToDealResult,
  onNavigateToStopPublish,
  statusKey,
}: {
  ad?: Record<string, unknown>;
  card: AdCardData;
  currentAdId?: string | number;
  onNavigateToDealResult?: () => void;
  onNavigateToStopPublish?: () => void;
  statusKey: string;
}) {
  const navigate = useNavigate();

  const handlePreview = () => {
    if (currentAdId) {
      navigate(getAdPreviewPath(currentAdId), {
        state: {
          ad,
          previewFlow: "agency-allocation",
          userContact: {
            name:
              (ad?.owner_name as string) ??
              (ad?.user_name as string) ??
              (ad?.advertiser_name as string) ??
              undefined,
            phone:
              (ad?.phone as string) ??
              (ad?.user_phone as string) ??
              (ad?.mobile as string) ??
              undefined,
            smsPhone:
              (ad?.sms_phone as string) ??
              (ad?.phone as string) ??
              (ad?.user_phone as string) ??
              undefined,
            address: (ad?.address as string) ?? (ad?.location_address as string) ?? undefined,
            social:
              (ad?.social as Record<string, string>) ??
              (ad?.contacts as Record<string, string>) ??
              undefined,
          },
        },
      });
    }
  };

  const handleEdit = () => {
    if (!currentAdId) return;
    navigate(
      getAdEditPath(
        currentAdId,
        `/account/manage-ads/${encodeURIComponent(currentAdId)}/state-ad`,
        ad ?? card,
      ),
      {
        replace: true,
        state: {
          ad,
          card,
          editReturnTo: `/account/manage-ads/${encodeURIComponent(currentAdId)}/state-ad`,
          isAssigned: true,
          isEditMode: true,
          returnTo: `/account/manage-ads/${encodeURIComponent(currentAdId)}/state-ad`,
          status: statusKey,
        },
      },
    );
  };

  const handleGoToStopPublish = () => {
    if (onNavigateToStopPublish) {
      onNavigateToStopPublish();
    } else if (currentAdId) {
      navigate(`/account/manage-ads/${encodeURIComponent(currentAdId)}/stop-publish`);
    }
  };

  const handleGoToDealResult = () => {
    if (onNavigateToDealResult) {
      onNavigateToDealResult();
    } else if (currentAdId) {
      navigate(`/account/manage-ads/${encodeURIComponent(currentAdId)}/deal-result`);
    }
  };

  return {
    handleEdit,
    handleGoToDealResult,
    handleGoToStopPublish,
    handlePreview,
  };
}
