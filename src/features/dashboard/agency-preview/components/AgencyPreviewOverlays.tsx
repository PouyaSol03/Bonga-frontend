import type { BadgeDetailItem } from "../../components/BadgeDetailBottomSheet";
import { BadgeDetailBottomSheet } from "../../components/BadgeDetailBottomSheet";
import { ProfileFeedbackPage } from "../../components/ProfileFeedbackPage";
import type { AgencyPreviewContactInfo } from "../types";
import { AgencyContactBottomSheet } from "./AgencyContactBottomSheet";

interface AgencyPreviewOverlaysProps {
  contactInfo: AgencyPreviewContactInfo;
  entityId: string;
  entityName: string;
  isAgentPreview: boolean;
  isContactSheetOpen: boolean;
  isFeedbackModalOpen: boolean;
  onCloseContactSheet: () => void;
  onCloseFeedbackModal: () => void;
  onCloseSelectedBadge: () => void;
  selectedBadge: BadgeDetailItem | null;
}

export function AgencyPreviewOverlays({
  contactInfo,
  entityId,
  entityName,
  isAgentPreview,
  isContactSheetOpen,
  isFeedbackModalOpen,
  onCloseContactSheet,
  onCloseFeedbackModal,
  onCloseSelectedBadge,
  selectedBadge,
}: AgencyPreviewOverlaysProps) {
  return (
    <>
      <AgencyContactBottomSheet
        contactInfo={contactInfo}
        isOpen={isContactSheetOpen}
        onClose={onCloseContactSheet}
      />
      {entityId ? (
        <>
          {isFeedbackModalOpen ? (
            <ProfileFeedbackPage
              onClose={onCloseFeedbackModal}
              targetId={entityId}
              targetName={entityName}
              targetType={isAgentPreview ? "consultant" : "agency"}
            />
          ) : null}

          <BadgeDetailBottomSheet
            badge={selectedBadge}
            isOpen={Boolean(selectedBadge)}
            onClose={onCloseSelectedBadge}
          />
        </>
      ) : null}
    </>
  );
}
