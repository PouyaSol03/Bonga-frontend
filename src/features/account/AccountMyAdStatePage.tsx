import { RequestErrorState } from "../../shared/components/ErrorState";
import { TopBar } from "../../shared/components/TopBar";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../shared/constants/roles.constants";
import { PageFrame } from "../../shared/layout/PageFrame";
import "../advertisements/components/AdCard.css";
import { AgencyActionsFooter } from "./ad-state/AgencyActionsFooter";
import { MyAdStateSkeleton } from "./ad-state/MyAdStateSkeleton";
import { getPersonalAdContacts } from "./ad-state/PersonalAdContacts";
import { PersonalAdStatePage } from "./ad-state/PersonalAdStatePage";
import { RealEstateManagerAdStatePage } from "./ad-state/RealEstateManagerAdStatePage";
import type { AccountMyAdStatePageProps } from "./ad-state/types";
import { useAdStateData } from "./ad-state/useAdStateData";
import { AgencyAssignedUserAdView } from "./components/AgencyAssignedUserAdView";

export function AccountMyAdStatePage(props?: AccountMyAdStatePageProps) {
  const {
    routeState,
    adId,
    isAfterEdit,
    detailQuery,
    sourceAd,
    card,
    statusInfo,
    isAssigned,
    backTo,
    backState,
    activeRole,
    handleBack,
    reRegisterStatusQuery,
    archiveStatusQuery,
    submitResultStatusQuery,
    agencyId,
    agencyDetailQuery,
  } = useAdStateData(props);
  if (detailQuery.isError && !detailQuery.data && !routeState.ad && !routeState.card) {
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
        <main className="bg-surface-container flex min-h-0 flex-1 flex-col items-center justify-center p-4">
          <RequestErrorState error={detailQuery.error} onRetry={() => void detailQuery.refetch()} />
        </main>
      </PageFrame>
    );
  }

  const hasLoadedData = Boolean(
    detailQuery.data || props?.ad || props?.card || routeState.ad || routeState.card,
  );

  const isPendingInitialData = !hasLoadedData && !detailQuery.isError;

  const isPendingEditUpdate =
    isAfterEdit && (detailQuery.isFetching || (detailQuery.isLoading && !detailQuery.data));

  if (isPendingInitialData || isPendingEditUpdate) {
    return <MyAdStateSkeleton backState={backState} backTo={backTo} onBack={handleBack} />;
  }

  if (statusInfo.key === "incomplete" || statusInfo.key === "incomplete_deleted") {
    return null;
  }

  if (
    activeRole === REAL_ESTATE_MANAGER ||
    activeRole === REAL_ESTATE_CONSULTANT ||
    activeRole === INDEPENDENT_CONSULTANT
  ) {
    return (
      <RealEstateManagerAdStatePage
        activeBusinessTab={props?.activeBusinessTab ?? routeState.activeBusinessTab}
        ad={sourceAd}
        adId={adId ?? String(card.id)}
        backState={backState}
        backTo={backTo}
        card={card}
        role={activeRole}
        statusInfo={statusInfo}
      />
    );
  }
  const { showAgencyBottomBar, handleCallAgency, handleSendMessage } = getPersonalAdContacts(
    sourceAd,
    agencyDetailQuery,
    isAssigned,
    statusInfo,
    agencyId,
    adId,
    card,
  );
  if (isAssigned) {
    return (
      <PageFrame
        className="text-on-surface relative flex min-h-0 flex-col overflow-hidden bg-white [direction:rtl]"
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
          <AgencyAssignedUserAdView
            ad={sourceAd}
            card={card}
            statusKey={statusInfo.key}
            adId={adId ?? String(card.id)}
            backTo={backTo}
            backState={backState}
            onRefetch={() => detailQuery.refetch()}
            deletedVariant={props?.deletedVariant ?? routeState.deletedVariant}
            initialCancelAssignmentOpen={
              props?.initialCancelAssignmentOpen ?? routeState.initialCancelAssignmentOpen
            }
          />
        </main>

        {showAgencyBottomBar ? (
          <AgencyActionsFooter onCallAgency={handleCallAgency} onSendMessage={handleSendMessage} />
        ) : null}
      </PageFrame>
    );
  }
  return (
    <PersonalAdStatePage
      sourceAd={sourceAd}
      card={card}
      adId={adId}
      backTo={backTo}
      backState={backState}
      handleBack={handleBack}
      detailQuery={detailQuery}
      reRegisterStatusQuery={reRegisterStatusQuery}
      archiveStatusQuery={archiveStatusQuery}
      submitResultStatusQuery={submitResultStatusQuery}
      showAgencyBottomBar={showAgencyBottomBar}
      handleCallAgency={handleCallAgency}
      handleSendMessage={handleSendMessage}
      statusInfo={statusInfo}
    />
  );
}
