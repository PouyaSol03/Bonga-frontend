import { getApiErrorMessage } from "../../../shared/api/api";
import type { AgencyAssignedUserAdViewProps } from "../agency-assigned/types";
import { resolvePublishedDateText, resolveExpirationDateText } from "../agency-assigned/adDateResolvers";
import { resolveAgencyName, resolveCategoryBreadcrumb } from "../agency-assigned/adEntityResolvers";
import { useAgencyAssignedQueries } from "../agency-assigned/useAgencyAssignedQueries";
import { useAgencyAssignedNavigation } from "../agency-assigned/useAgencyAssignedNavigation";
import { useAgencyAssignedModals } from "../agency-assigned/useAgencyAssignedModals";
import { AgencyAssignedHero } from "../agency-assigned/components/AgencyAssignedHero";
import { AgencyAssignedActions } from "../agency-assigned/components/AgencyAssignedActions";
import { AgencyAssignedTimelineSection } from "../agency-assigned/components/AgencyAssignedTimelineSection";
import { AgencyAssignedModals } from "../agency-assigned/components/AgencyAssignedModals";

export type { AgencyAssignedDeletedVariant } from "../agency-assigned/types";
export { formatExpireDuration } from "../agency-assigned/dateHelpers";

export function AgencyAssignedUserAdView({
  ad,
  card,
  statusKey,
  adId,
  onRefetch,
  initialCancelAssignmentOpen = false,
  initialRepostChoiceOpen = false,
  deletedVariant,
  onNavigateToStopPublish,
  onNavigateToDealResult,
}: AgencyAssignedUserAdViewProps) {
  const currentAdId = adId ?? card.id;

  const {
    archiveStatusQuery,
    cancelAssignmentMutation,
    effectiveDeletedVariant,
    historyQuery,
    isArchived,
    isDeleted,
    isPublished,
    isWaitForAdmin,
    isWaitForAgency,
    isWaitForDeal,
    isWaitForRepost,
    isWaitForStop,
    reassignAgencyMutation,
    republishPersonalMutation,
    reRegisterStatusQuery,
    restoreArchivedMutation,
    showArchiveSection,
    showRepostSection,
    showSubmitResultSection,
    submitResultStatusQuery,
  } = useAgencyAssignedQueries({
    ad,
    currentAdId,
    deletedVariant,
    statusKey,
  });

  const {
    handleEdit,
    handleGoToDealResult,
    handleGoToStopPublish,
    handlePreview,
  } = useAgencyAssignedNavigation({
    ad,
    card,
    currentAdId,
    onNavigateToDealResult,
    onNavigateToStopPublish,
    statusKey,
  });

  const {
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
  } = useAgencyAssignedModals({
    cancelAssignmentMutation,
    currentAdId,
    initialCancelAssignmentOpen,
    initialRepostChoiceOpen,
    onRefetch,
    reassignAgencyMutation,
    republishPersonalMutation,
  });

  const agencyName = resolveAgencyName(ad, card);
  const categoryBreadcrumb = resolveCategoryBreadcrumb(ad);
  const publishedDateText = resolvePublishedDateText(ad);
  const expirationDateText = resolveExpirationDateText(ad);

  return (
    <div className="bg-surface-container flex flex-col [direction:rtl]">
      {/* Section 1: Badge + Ad Card + Expiration/Dates or Notice */}
      <AgencyAssignedHero
        card={card}
        categoryBreadcrumb={categoryBreadcrumb}
        expirationDateText={expirationDateText}
        isArchived={isArchived}
        isDeleted={isDeleted}
        isPublished={isPublished}
        isWaitForAdmin={isWaitForAdmin}
        isWaitForAgency={isWaitForAgency}
        isWaitForDeal={isWaitForDeal}
        isWaitForRepost={isWaitForRepost}
        isWaitForStop={isWaitForStop}
        publishedDateText={publishedDateText}
      />

      {/* Section Divider 1 */}
      <div className="bg-surface-container h-2 shrink-0" aria-hidden="true" />

      {/* Section 2: Action list items */}
      <AgencyAssignedActions
        isDeleted={isDeleted}
        isPublished={isPublished}
        isWaitForAgency={isWaitForAgency}
        onCancelAssignment={() => setIsCancelAssignmentOpen(true)}
        onEdit={handleEdit}
        onPreview={handlePreview}
        onStopPublish={handleGoToStopPublish}
      />

      {/* Section Divider 2 */}
      <div className="bg-surface-container h-2 shrink-0" aria-hidden="true" />

      {/* Section 3: آخرین تغییرات (Timeline History) */}
      <AgencyAssignedTimelineSection
        agencyName={agencyName}
        archiveStatus={archiveStatusQuery.data}
        effectiveDeletedVariant={effectiveDeletedVariant}
        historyData={historyQuery.data}
        isArchived={isArchived}
        isDeleted={isDeleted}
        isHistoryLoading={historyQuery.isLoading}
        isPublished={isPublished}
        isRestoringArchived={restoreArchivedMutation.isPending}
        isWaitForAdmin={isWaitForAdmin}
        isWaitForAgency={isWaitForAgency}
        isWaitForDeal={isWaitForDeal}
        isWaitForRepost={isWaitForRepost}
        isWaitForStop={isWaitForStop}
        onNavigateToDealResult={handleGoToDealResult}
        onOpenRepostChoice={() => setIsRepostChoiceOpen(true)}
        onRestoreArchived={async () => {
          if (currentAdId) {
            try {
              await restoreArchivedMutation.mutateAsync(currentAdId);
              if (onRefetch) await onRefetch();
            } catch (err) {
              alert(getApiErrorMessage(err, "بازیابی آگهی با خطا مواجه شد."));
            }
          }
        }}
        reRegisterStatus={reRegisterStatusQuery.data}
        showArchiveSection={showArchiveSection}
        showRepostSection={showRepostSection}
        showSubmitResultSection={showSubmitResultSection}
        submitResultStatus={submitResultStatusQuery.data}
      />

      {/* BottomSheets */}
      <AgencyAssignedModals
        isCancelAssignmentOpen={isCancelAssignmentOpen}
        isCancelPending={cancelAssignmentMutation.isPending}
        isPersonalPending={republishPersonalMutation.isPending}
        isReassignAgencyOpen={isReassignAgencyOpen}
        isReassignPending={reassignAgencyMutation.isPending}
        isRepostChoiceOpen={isRepostChoiceOpen}
        onCancelAssignmentClose={() => setIsCancelAssignmentOpen(false)}
        onCancelAssignmentConfirm={handleCancelAssignmentConfirm}
        onReassignAgencyClose={() => setIsReassignAgencyOpen(false)}
        onReassignAgencyConfirm={handleReassignAgencyConfirm}
        onRepostChoiceClose={() => setIsRepostChoiceOpen(false)}
        onSelectAgencyForRepost={handleSelectAgencyForRepost}
        onSelectPersonalForRepost={handleSelectPersonalForRepost}
      />
    </div>
  );
}
