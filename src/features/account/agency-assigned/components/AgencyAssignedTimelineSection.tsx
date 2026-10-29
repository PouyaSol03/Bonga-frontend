import type { AgencyAssignedDeletedVariant } from "../types";
import { Typography } from "../../../../shared/ui/Typography";
import { formatHistoryDate } from "../dateHelpers";
import { TimelineItem } from "./TimelineItem";
import { TimelineFallbackList } from "./TimelineFallbackList";
import { AgencyAssignedSpecializedSections } from "./AgencyAssignedSpecializedSections";

export type HistoryItem = {
  action?: string;
  created_at?: string;
  message?: string;
};

type ExpirableStatus = {
  expire?: { hours?: number; minutes?: number; total_minutes?: number };
  expires_at?: string | null;
  reason?: string;
  agency?: { name?: string };
};

type TimelineSectionProps = {
  agencyName: string;
  archiveStatus?: ExpirableStatus;
  effectiveDeletedVariant: AgencyAssignedDeletedVariant;
  historyData?: HistoryItem[];
  isArchived: boolean;
  isDeleted: boolean;
  isHistoryLoading: boolean;
  isPublished: boolean;
  isRestoringArchived: boolean;
  isWaitForAdmin: boolean;
  isWaitForAgency: boolean;
  isWaitForDeal: boolean;
  isWaitForRepost: boolean;
  isWaitForStop: boolean;
  onNavigateToDealResult: () => void;
  onOpenRepostChoice: () => void;
  onRestoreArchived: () => void;
  reRegisterStatus?: ExpirableStatus;
  showArchiveSection: boolean;
  showRepostSection: boolean;
  showSubmitResultSection: boolean;
  submitResultStatus?: ExpirableStatus;
};

export function AgencyAssignedTimelineSection({
  agencyName,
  archiveStatus,
  effectiveDeletedVariant,
  historyData,
  isArchived,
  isDeleted,
  isHistoryLoading,
  isPublished,
  isRestoringArchived,
  isWaitForAdmin,
  isWaitForAgency,
  isWaitForDeal,
  isWaitForRepost,
  isWaitForStop,
  onNavigateToDealResult,
  onOpenRepostChoice,
  onRestoreArchived,
  reRegisterStatus,
  showArchiveSection,
  showRepostSection,
  showSubmitResultSection,
  submitResultStatus,
}: TimelineSectionProps) {
  return (
    <section className="bg-surface-container-lowest flex-1 px-4 pt-6 pb-8">
      <Typography
        as="h3"
        variant="title"
        size="medium"
        weight="semibold"
        className="text-on-surface m-0 mb-6 text-base font-bold"
      >
        آخرین تغییرات
      </Typography>

      <AgencyAssignedSpecializedSections
        agencyName={agencyName}
        archiveStatus={archiveStatus}
        isRestoringArchived={isRestoringArchived}
        onNavigateToDealResult={onNavigateToDealResult}
        onOpenRepostChoice={onOpenRepostChoice}
        onRestoreArchived={onRestoreArchived}
        reRegisterStatus={reRegisterStatus}
        showArchiveSection={showArchiveSection}
        showRepostSection={showRepostSection}
        showSubmitResultSection={showSubmitResultSection}
        submitResultStatus={submitResultStatus}
      />

      {isHistoryLoading ? (
        <div className="text-on-surface-var py-8 text-center text-xs">
          در حال دریافت آخرین تغییرات...
        </div>
      ) : historyData && historyData.length > 0 ? (
        <div className="divide-outline-var/20 divide-y">
          {historyData.map((item, index) => (
            <TimelineItem
              key={`${item.action}-${item.created_at}-${index}`}
              time={formatHistoryDate(item.created_at)}
              description={item.message}
            />
          ))}
        </div>
      ) : historyData && historyData.length === 0 ? (
        <div className="text-on-surface-var py-8 text-center text-xs">
          تغییری برای این آگهی ثبت نشده است.
        </div>
      ) : (
        <div className="divide-outline-var/20 divide-y">
          <TimelineFallbackList
            agencyName={agencyName}
            effectiveDeletedVariant={effectiveDeletedVariant}
            isArchived={isArchived}
            isDeleted={isDeleted}
            isPublished={isPublished}
            isWaitForAdmin={isWaitForAdmin}
            isWaitForAgency={isWaitForAgency}
            isWaitForDeal={isWaitForDeal}
            isWaitForRepost={isWaitForRepost}
            isWaitForStop={isWaitForStop}
          />
        </div>
      )}
    </section>
  );
}
