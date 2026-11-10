import { TopBar } from "../../../shared/components/TopBar";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { Typography } from "../../../shared/ui/Typography";
import { useMyAdvertisementDetailQuery } from "../../advertisements/api/advertisement.hooks";
import {
  useAdvertisementArchiveStatusQuery,
  useAdvertisementReRegisterStatusQuery,
  useAdvertisementSubmitResultStatusQuery,
} from "../../advertisements/api/agency-advertise-assignment.hooks";
import type { AdCardData } from "../../advertisements/components/AdCard";
import "../../advertisements/components/AdCard.css";
import { ActionDivider } from "../ad-state/ActionDivider";
import { AgencyActionsFooter } from "../ad-state/AgencyActionsFooter";
import { getStateActions } from "../ad-state/stateActions";
import { StateAdAction } from "../ad-state/StateAdAction";
import { StateAdSummary } from "../ad-state/StateAdSummary";
import { getMyAdStatusInfo } from "../myAdsStatus";
import { PersonalAdNotices } from "./PersonalAdNotices";
import { PersonalAdSheets } from "./PersonalAdSheets";
import { usePersonalAdMutations } from "./usePersonalAdMutations";

export function PersonalAdStatePage({
  statusInfo,
  sourceAd,
  card,
  adId,
  backTo,
  backState,
  handleBack,
  detailQuery,
  reRegisterStatusQuery,
  archiveStatusQuery,
  submitResultStatusQuery,
  showAgencyBottomBar,
  handleCallAgency,
  handleSendMessage,
}: {
  sourceAd?: Record<string, unknown>;
  card: AdCardData;
  adId?: string;
  backTo: string;
  backState?: { tab?: string };
  handleBack: () => void;
  detailQuery: ReturnType<typeof useMyAdvertisementDetailQuery>;
  reRegisterStatusQuery: ReturnType<typeof useAdvertisementReRegisterStatusQuery>;
  archiveStatusQuery: ReturnType<typeof useAdvertisementArchiveStatusQuery>;
  submitResultStatusQuery: ReturnType<typeof useAdvertisementSubmitResultStatusQuery>;
  showAgencyBottomBar: boolean;
  handleCallAgency: () => void;
  handleSendMessage: () => void;
  statusInfo: ReturnType<typeof getMyAdStatusInfo>;
}) {
  const {
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
  } = usePersonalAdMutations();
  const actions = getStateActions(
    statusInfo.key,
    adId ?? String(card.id),
    false,
    sourceAd,
    () => setIsStopPublishModalOpen(true),
    backTo,
  );

  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={backState}
        backTo={backTo}
        className="[&_a]:text-on-surface"
        onBack={handleBack}
        title="مدیریت آگهی"
      />

      <main className="bg-surface-container flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <section
          className="bg-surface-container-lowest shrink-0 px-4 pt-4 pb-4"
          aria-label={card.title}
        >
          <div className="flex justify-start">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className={`inline-flex h-10 items-center rounded-lg px-4 text-sm leading-5 font-medium ${statusInfo.badgeClassName}`}
            >
              {statusInfo.label}
            </Typography>
          </div>

          <StateAdSummary ad={sourceAd} card={card} />

          <PersonalAdNotices
            statusInfo={statusInfo}
            sourceAd={sourceAd}
            card={card}
            backTo={backTo}
            adId={adId}
            detailQuery={detailQuery}
            reRegisterStatusQuery={reRegisterStatusQuery}
            archiveStatusQuery={archiveStatusQuery}
            submitResultStatusQuery={submitResultStatusQuery}
            restoreArchivedMutation={restoreArchivedMutation}
            cancelStopRequestMutation={cancelStopRequestMutation}
            confirmDealResultMutation={confirmDealResultMutation}
            setIsCancelAssignmentModalOpen={setIsCancelAssignmentModalOpen}
            setIsRepostChoiceModalOpen={setIsRepostChoiceModalOpen}
          />
        </section>

        <div className="bg-surface-container h-2 shrink-0" aria-hidden="true" />

        <section
          className="bg-surface-container-lowest min-h-[300px] flex-1 shrink-0"
          aria-label="عملیات آگهی"
        >
          {actions.map((action, index) => (
            <div key={action.label}>
              <StateAdAction
                action={action}
                ad={sourceAd}
                card={card}
                deleteCompleteTo={backTo}
                returnTo={backTo}
                backTo={backTo}
              />
              {index < actions.length - 1 ? <ActionDivider /> : null}
            </div>
          ))}
        </section>
      </main>

      {showAgencyBottomBar ? (
        <AgencyActionsFooter onCallAgency={handleCallAgency} onSendMessage={handleSendMessage} />
      ) : null}

      <PersonalAdSheets
        adId={adId}
        card={card}
        detailQuery={detailQuery}
        isCancelAssignmentModalOpen={isCancelAssignmentModalOpen}
        setIsCancelAssignmentModalOpen={setIsCancelAssignmentModalOpen}
        isRepostChoiceModalOpen={isRepostChoiceModalOpen}
        setIsRepostChoiceModalOpen={setIsRepostChoiceModalOpen}
        isReassignAgencyModalOpen={isReassignAgencyModalOpen}
        setIsReassignAgencyModalOpen={setIsReassignAgencyModalOpen}
        isStopPublishModalOpen={isStopPublishModalOpen}
        setIsStopPublishModalOpen={setIsStopPublishModalOpen}
        cancelAssignmentMutation={cancelAssignmentMutation}
        republishPersonalMutation={republishPersonalMutation}
        reassignAgencyMutation={reassignAgencyMutation}
        createStopRequestMutation={createStopRequestMutation}
      />
    </PageFrame>
  );
}
