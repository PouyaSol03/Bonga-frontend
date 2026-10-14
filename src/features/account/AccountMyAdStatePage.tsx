import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getApiErrorMessage } from "../../shared/api/api";

import { getActiveAuthRole, getStoredAuthSession } from "../../shared/auth/auth-storage";
import {
  useMyAdvertisementDetailQuery,
  useRemoveAgencyAdvertisementMutation,
} from "../advertisements/api/advertisement.hooks";
import {
  useApproveAgencyStopRequestMutation,
  useCancelStopPublishRequestMutation,
  useCancelUserAssignmentMutation,
  useChangeAgencyAdvertiseConsultantMutation,
  useConfirmUserDealResultMutation,
  useCreateStopPublishRequestMutation,
  useReassignAdToAgencyMutation,
  useRejectAgencyStopRequestMutation,
  useRepublishAdAsPersonalMutation,
  useRestoreArchivedAdMutation,
  useAdvertisementArchiveStatusQuery,
  useAdvertisementReRegisterStatusQuery,
  useAdvertisementSubmitResultStatusQuery,
} from "../advertisements/api/agency-advertise-assignment.hooks";
import {
  formatStopPublishReason,
  type AdvertisementArchiveStatusResponse,
  type AdvertisementReRegisterStatusResponse,
  type AdvertisementSubmitResultStatusResponse,
} from "../advertisements/api/agency-advertise-assignment.service";
import {
  useAgencyConsultantsQuery,
  useAgencyInfiniteQuery,
  usePublicAgencyDetailQuery,
} from "../agencies/api/agency.hooks";
import { useMyAgencyProfileQuery } from "./api/account.hooks";
import { mapAdvertisementToAdCard } from "../advertisements/api/advertisement.service";
import {
  REAL_ESTATE_MANAGER,
  REAL_ESTATE_CONSULTANT,
  INDEPENDENT_CONSULTANT,
  USER,
} from "../../shared/constants/roles.constants";
import {
  ViewAdBusinessTabs,
  type ViewAdBusinessTabKey,
} from "../advertisements/view/components/ViewAdBusinessTabs";
import { ViewAdPerformanceSection } from "../advertisements/view/components/performance/ViewAdPerformanceSection";
import { ViewAdLeadsSection } from "../advertisements/view/components/ViewAdLeadsSection";
import "../advertisements/components/AdCard.css";

import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { BottomSheet } from "../../shared/components/BottomSheet";
import { RadioIndicator } from "../../shared/components/RadioIndicator";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import { SearchInputBar } from "../../shared/ui/SearchBar";
import type { AdCardData } from "../advertisements/components/AdCard";
import { Link, useNavigate } from "react-router";
import {
  adManagementPaths,
  getAdCloseResultPath,
  getAdEditPath,
  getAdIncreaseVisitsPath,
  getAdPaymentHistoryPath,
  getAdPaymentPath,
  getAdPreviewPath,
  getAdStatePath,
  getAdVisitStatisticsPath,
} from "./adManagement/adManagementData";
import { getMyAdStatusInfo, type MyAdStatusKey } from "./myAdsStatus";
import LinearFlag from "../../shared/icons/LinearFlag";
import LinearChartUp from "../../shared/icons/LinearChartUp";
import LinearDelete from "../../shared/icons/LinearDelete";
import LinearEdit2 from "../../shared/icons/LinearEdit2";
import LinearPreview from "../../shared/icons/LinearPreview";
import LinearAnalytics from "../../shared/icons/LinearAnalytics";
import LinearBuilding2 from "../../shared/icons/LinearBuilding2";
import LinearUserSolid from "../../shared/icons/LinearUserSolid";
import LinearArrowLeft1 from "../../shared/icons/LinearArrowLeft1";
import { ListItem } from "../../shared/ui/ListItem";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import LinearFactor from "../../shared/icons/LinearFactor";
import LinearPayment from "../../shared/icons/LinearPayment";
import LinearCall from "../../shared/icons/LinearCall";
import LinearChat from "../../shared/icons/LinearChat";
import LinearCancel from "../../shared/icons/LinearCancel";

import {
  AgencyAssignedUserAdView,
  formatExpireDuration,
  type AgencyAssignedDeletedVariant,
} from "./components/AgencyAssignedUserAdView";

type MyAdRouteState = {
  ad?: Record<string, unknown>;
  card?: AdCardData;
  status?: MyAdStatusKey | string;
  tab?: string;
  activeBusinessTab?: ViewAdBusinessTabKey;
  editReturnTo?: string;
  isEditMode?: boolean;
  returnTo?: string;
  isAssigned?: boolean;
  deletedVariant?: AgencyAssignedDeletedVariant;
  initialStopPublishOpen?: boolean;
  initialCancelAssignmentOpen?: boolean;
  initialDealResultOpen?: boolean;
};

type StateActionKey =
  | "call"
  | "chat"
  | "delete"
  | "edit"
  | "history"
  | "payment"
  | "preview"
  | "result"
  | "stats"
  | "stop_publish"
  | "upgrade";

type StateAction = {
  icon: StateActionKey;
  label: string;
  onClick?: () => void;
  to?: string;
};

export type AccountMyAdStatePageProps = {
  ad?: Record<string, unknown>;
  card?: AdCardData;
  status?: MyAdStatusKey | string;
  activeBusinessTab?: ViewAdBusinessTabKey;
  role?: string;
  backTo?: string;
  onBack?: () => void;
  isAssigned?: boolean;
  deletedVariant?: AgencyAssignedDeletedVariant;
  initialStopPublishOpen?: boolean;
  initialCancelAssignmentOpen?: boolean;
  initialDealResultOpen?: boolean;
};

function AgencyActionsFooter({
  onSendMessage,
  onCallAgency,
}: {
  onSendMessage: () => void;
  onCallAgency: () => void;
}) {
  return (
    <footer className="border-surface-container bg-surface-container-lowest shrink-0 border-t px-4 py-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)] [direction:rtl]">
      <div className="flex items-center gap-3">
        <Button
          unstyled
          className="border-primary text-primary active:bg-primary/10 flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] border bg-transparent text-sm font-medium transition-colors"
          onClick={onSendMessage}
          type="button"
        >
          <LinearChat className="text-primary h-5 w-5 shrink-0" />
          <span>ارسال پیام</span>
        </Button>

        <Button
          unstyled
          className="bg-primary text-on-primary active:bg-primary-600 flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] text-sm font-medium transition-colors"
          onClick={onCallAgency}
          type="button"
        >
          <span>تماس با آژانس</span>
        </Button>
      </div>
    </footer>
  );
}

export function AccountMyAdStatePage(props?: AccountMyAdStatePageProps) {
  const navigate = useNavigate();
  const routeState = props ? { ...readRouteState(), ...props } : readRouteState();
  const adId =
    readAdIdFromPath() ??
    readEntityId(props?.ad) ??
    readEntityId(props?.card) ??
    readEntityId(routeState.ad) ??
    readEntityId(routeState.card);
  const detailQuery = useMyAdvertisementDetailQuery(
    props?.card || props?.ad ? null : (adId ?? null),
  );
  const statusQuery = new URLSearchParams(window.location.search).get("status") ?? undefined;
  const sourceAd = props?.ad ?? detailQuery.data ?? routeState.ad;
  const card =
    props?.card ??
    (detailQuery.data
      ? mapAdvertisementToAdCard(detailQuery.data, 0)
      : (routeState.card ?? createUnavailableAdCard(adId, sourceAd)));
  const statusInfo = getMyAdStatusInfo(
    props?.status ??
      detailQuery.data ??
      statusQuery ??
      routeState.status ??
      routeState.ad ??
      routeState.card?.status,
  );
  const isAssigned =
    statusInfo.key !== "wait_for_payment" &&
    Boolean(
      props?.isAssigned ??
      routeState.isAssigned ??
      (sourceAd?.assigned_agency_id ||
        sourceAd?.assignedAgencyId ||
        sourceAd?.assignment_id ||
        sourceAd?.assignmentId ||
        sourceAd?.assignment_status ||
        sourceAd?.assignmentStatus ||
        sourceAd?.is_assigned ||
        sourceAd?.isAssigned ||
        statusInfo.key === "wait_for_agency" ||
        statusInfo.key === "wait_for_repost" ||
        statusInfo.key === "wait_for_stop" ||
        statusInfo.key === "wait_for_deal_confirmation"),
    );
  const cameFromAdManagement = !isAssigned && Boolean(routeState.tab || routeState.returnTo);
  const backTo = props?.backTo ?? getStateAdBackPath(routeState, isAssigned);
  const backState = cameFromAdManagement ? { tab: routeState.tab } : undefined;
  const activeRole = props?.role ?? getActiveAuthRole(getStoredAuthSession());

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
  const currentAdId = adId ?? (card ? String(card.id) : undefined);
  const reRegisterStatusQuery = useAdvertisementReRegisterStatusQuery(currentAdId);
  const archiveStatusQuery = useAdvertisementArchiveStatusQuery(currentAdId);
  const submitResultStatusQuery = useAdvertisementSubmitResultStatusQuery(currentAdId);

  const agencyId = readText(
    sourceAd?.assigned_agency_id ??
      sourceAd?.assignedAgencyId ??
      sourceAd?.agency_id ??
      sourceAd?.agencyId ??
      sourceAd?.publisher_agency_id ??
      (sourceAd?.agency && typeof sourceAd.agency === "object"
        ? (sourceAd.agency as Record<string, unknown>).id
        : undefined),
  );

  const agencyDetailQuery = usePublicAgencyDetailQuery({
    id: agencyId,
    enabled: Boolean(agencyId),
  });

  useEffect(() => {
    if (statusInfo.key === "incomplete" && currentAdId) {
      navigate(getAdEditPath(currentAdId, backTo), { replace: true });
    }
  }, [statusInfo.key, currentAdId, backTo]);

  if (detailQuery.isLoading && !detailQuery.data && !routeState.ad && !routeState.card) {
    return <MyAdStateSkeleton backState={backState} backTo={backTo} />;
  }

  // Draft ads do not have a state page
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

  const agencyData = agencyDetailQuery.data as Record<string, unknown> | undefined;
  const agencyObj =
    agencyData?.agency && typeof agencyData.agency === "object"
      ? (agencyData.agency as Record<string, unknown>)
      : undefined;
  const queryPhone = readText(
    agencyData?.phone ??
      agencyData?.agency_phone ??
      agencyData?.mobile ??
      agencyObj?.phone ??
      agencyObj?.agency_phone ??
      agencyObj?.mobile,
  );

  const agencyPhone = readText(
    sourceAd?.assigned_agency_phone ??
      sourceAd?.agency_phone ??
      (sourceAd?.agency && typeof sourceAd.agency === "object"
        ? (sourceAd.agency as Record<string, unknown>).phone
        : undefined) ??
      (sourceAd?.assigned_consultant && typeof sourceAd.assigned_consultant === "object"
        ? (sourceAd.assigned_consultant as Record<string, unknown>).phone
        : undefined) ??
      sourceAd?.consultant_phone ??
      queryPhone ??
      sourceAd?.phone,
  );

  const consultantUserId = readText(
    sourceAd?.assigned_consultant_user_id ??
      sourceAd?.assigned_consultant_id ??
      sourceAd?.consultant_user_id ??
      (sourceAd?.assigned_consultant && typeof sourceAd.assigned_consultant === "object"
        ? (sourceAd.assigned_consultant as Record<string, unknown>).user_id
        : undefined),
  );

  const showAgencyBottomBar = Boolean(
    (isAssigned ||
      statusInfo.key === "wait_for_agency" ||
      statusInfo.key === "pending" ||
      statusInfo.key === "wait_for_stop") &&
    statusInfo.key !== "rejected_by_agency",
  );

  const handleCallAgency = () => {
    if (agencyPhone) {
      window.location.href = `tel:${agencyPhone}`;
    } else {
      alert("شماره تماس آژانس در دسترس نیست.");
    }
  };

  const handleSendMessage = () => {
    const chatQuery = new URLSearchParams();
    if (consultantUserId) {
      chatQuery.set("userId", consultantUserId);
    } else if (agencyId) {
      chatQuery.set("agencyId", agencyId);
    }
    const currentId = adId ?? (card ? String(card.id) : undefined);
    if (currentId) {
      chatQuery.set("adId", currentId);
    }
    window.location.href = `/chat?${chatQuery.toString()}`;
  };

  // State view for assigned ads
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

  const actions = getStateActions(
    statusInfo.key,
    adId ?? String(card.id),
    isAssigned,
    sourceAd,
    () => setIsStopPublishModalOpen(true),
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

          {statusInfo.key === "published" ? <PublishedMeta ad={sourceAd} /> : null}
          {statusInfo.key === "wait_for_agency" ? (
            <WaitForAgencyNotice
              ad={sourceAd}
              onCancelAssignment={() => setIsCancelAssignmentModalOpen(true)}
            />
          ) : null}
          {statusInfo.key === "wait_for_repost" &&
          (reRegisterStatusQuery.data !== undefined
            ? Boolean(
                reRegisterStatusQuery.data?.data?.status ?? reRegisterStatusQuery.data?.status,
              )
            : false) ? (
            <WaitForRepostNotice
              ad={sourceAd}
              reRegisterData={reRegisterStatusQuery.data}
              onRepost={() => setIsRepostChoiceModalOpen(true)}
            />
          ) : null}
          {statusInfo.key === "archived" &&
          (archiveStatusQuery.data !== undefined
            ? Boolean(archiveStatusQuery.data?.data?.status ?? archiveStatusQuery.data?.status)
            : false) ? (
            <ArchivedNotice
              ad={sourceAd}
              archiveData={archiveStatusQuery.data}
              isPending={restoreArchivedMutation.isPending}
              onRestore={async () => {
                if (adId) {
                  await restoreArchivedMutation.mutateAsync(adId);
                  void detailQuery.refetch();
                }
              }}
            />
          ) : null}
          {statusInfo.key === "rejected_by_agency" ? (
            <RejectedByAgencyNotice
              ad={sourceAd}
              onRepost={() => setIsRepostChoiceModalOpen(true)}
            />
          ) : null}
          {statusInfo.key === "wait_for_stop" ? (
            <WaitForStopNotice
              isPending={cancelStopRequestMutation.isPending}
              onCancelStop={async () => {
                if (adId) {
                  await cancelStopRequestMutation.mutateAsync(adId);
                  void detailQuery.refetch();
                }
              }}
            />
          ) : null}
          {statusInfo.key === "wait_for_deal_confirmation" &&
          (submitResultStatusQuery.data !== undefined
            ? Boolean(
                submitResultStatusQuery.data?.data?.status ?? submitResultStatusQuery.data?.status,
              )
            : false) ? (
            <WaitForDealConfirmationNotice
              ad={sourceAd}
              submitResultData={submitResultStatusQuery.data}
              isPending={confirmDealResultMutation.isPending}
              onConfirm={async (confirmed: boolean) => {
                if (adId) {
                  await confirmDealResultMutation.mutateAsync({ advertiseId: adId, confirmed });
                  void detailQuery.refetch();
                }
              }}
            />
          ) : null}
          {statusInfo.key === "wait_for_payment" ? (
            <WaitForPaymentNotice adId={adId ?? String(card.id)} />
          ) : null}
          {statusInfo.key === "pending" ? <PendingReviewNotice /> : null}
          {statusInfo.key === "needs_edit" ? (
            <NeedsEditNotice ad={sourceAd} card={card} returnTo={backTo} />
          ) : null}
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
              />
              {index < actions.length - 1 ? <ActionDivider /> : null}
            </div>
          ))}
        </section>
      </main>

      {showAgencyBottomBar ? (
        <AgencyActionsFooter onCallAgency={handleCallAgency} onSendMessage={handleSendMessage} />
      ) : null}

      <CancelAssignmentBottomSheet
        isOpen={isCancelAssignmentModalOpen}
        isPending={cancelAssignmentMutation.isPending}
        onCancel={() => setIsCancelAssignmentModalOpen(false)}
        onConfirm={async () => {
          if (!adId) return;
          try {
            await cancelAssignmentMutation.mutateAsync({ advertiseId: adId });
            setIsCancelAssignmentModalOpen(false);
            await detailQuery.refetch();
          } catch (err) {
            alert(getApiErrorMessage(err, "لغو واگذاری با خطا مواجه شد."));
          }
        }}
      />

      <RepostChoiceBottomSheet
        isOpen={isRepostChoiceModalOpen}
        isPersonalPending={republishPersonalMutation.isPending}
        onClose={() => setIsRepostChoiceModalOpen(false)}
        onSelectPersonal={async () => {
          const currentAdId = adId ?? String(card.id);
          if (!currentAdId) return;
          try {
            await republishPersonalMutation.mutateAsync(currentAdId);
            setIsRepostChoiceModalOpen(false);
            navigate(getAdPaymentPath(currentAdId));
          } catch (err) {
            alert(getApiErrorMessage(err, "ثبت مجدد آگهی با خطا مواجه شد."));
          }
        }}
        onSelectAgency={() => {
          setIsRepostChoiceModalOpen(false);
          setIsReassignAgencyModalOpen(true);
        }}
      />

      <AgencyReassignBottomSheet
        isPending={reassignAgencyMutation.isPending}
        isOpen={isReassignAgencyModalOpen}
        onClose={() => setIsReassignAgencyModalOpen(false)}
        onConfirm={async (agencyId) => {
          const currentAdId = adId ?? String(card.id);
          if (!currentAdId) return;
          try {
            await reassignAgencyMutation.mutateAsync({
              advertiseId: currentAdId,
              agencyId,
            });
            setIsReassignAgencyModalOpen(false);
            await detailQuery.refetch();
          } catch (err) {
            alert(getApiErrorMessage(err, "واگذاری مجدد به آژانس با خطا مواجه شد."));
          }
        }}
      />

      {isStopPublishModalOpen ? (
        <StopPublishModal
          isPending={createStopRequestMutation.isPending}
          onClose={() => setIsStopPublishModalOpen(false)}
          onConfirm={async (reason: string, description?: string) => {
            if (!adId) return;
            try {
              await createStopRequestMutation.mutateAsync({
                advertiseId: adId,
                reason,
                description,
              });
              setIsStopPublishModalOpen(false);
              await detailQuery.refetch();
            } catch (err) {
              alert(getApiErrorMessage(err, "ثبت درخواست توقف با خطا مواجه شد."));
            }
          }}
        />
      ) : null}
    </PageFrame>
  );
}

type ManagerPublisher = {
  id: string;
  image?: string;
  name: string;
  type: "agency" | "consultant";
};

function RealEstateManagerAdStatePage({
  activeBusinessTab,
  ad,
  adId,
  backState,
  backTo,
  card,
  role,
  statusInfo,
}: {
  activeBusinessTab?: ViewAdBusinessTabKey;
  ad?: Record<string, unknown>;
  adId: string;
  backState?: unknown;
  backTo: string;
  card: AdCardData;
  role?: string | null;
  statusInfo: ReturnType<typeof getMyAdStatusInfo>;
}) {
  const navigate = useNavigate();
  const currentRole = role ?? getActiveAuthRole(getStoredAuthSession());
  const isIndependentConsultant =
    currentRole === INDEPENDENT_CONSULTANT || currentRole === "independent-consultant";

  const agencyQuery = useMyAgencyProfileQuery({ enabled: !isIndependentConsultant });
  const consultantsQuery = useAgencyConsultantsQuery({
    enabled: !isIndependentConsultant,
    page: 1,
    perPage: 100,
  });
  const publisherOptions = useMemo<ManagerPublisher[]>(() => {
    const options: ManagerPublisher[] = [];
    const agency = agencyQuery.data;
    const agencyId = readEntityId(agency);
    const agencyName = readText(agency?.name);

    if (agencyId && agencyName) {
      options.push({
        id: `agency:${agencyId}`,
        image: readText(agency?.logo ?? agency?.img) || undefined,
        name: agencyName,
        type: "agency",
      });
    }

    for (const consultant of consultantsQuery.data?.data ?? []) {
      const consultantIdentifier = consultant.agentId ?? consultant.userId;
      options.push({
        id: `consultant:${consultantIdentifier}`,
        image: consultant.avatar,
        name: consultant.name || `مشاور شماره ${consultantIdentifier}`,
        type: "consultant",
      });
    }

    return options;
  }, [agencyQuery.data, consultantsQuery.data]);
  const changeConsultantMutation = useChangeAgencyAdvertiseConsultantMutation();
  const approveStopMutation = useApproveAgencyStopRequestMutation();
  const rejectStopMutation = useRejectAgencyStopRequestMutation();
  const publisherType = String(ad?.publisher_type ?? ad?.owner_type ?? "").toLowerCase();
  const publisherAgentId =
    ad?.publisher_agent_id ??
    ad?.assigned_consultant_id ??
    ad?.assignedConsultantId ??
    ad?.consultant_id ??
    ad?.consultantId;
  const publisherAgencyId = ad?.publisher_agency_id ?? ad?.agency_id ?? ad?.agencyId;
  const rawConsultantId = publisherType === "agency" ? undefined : publisherAgentId;
  const assignedConsultantId =
    typeof rawConsultantId === "object"
      ? readEntityId(rawConsultantId)
      : rawConsultantId
        ? String(rawConsultantId)
        : undefined;
  const resolvedAgencyId =
    typeof publisherAgencyId === "object"
      ? readEntityId(publisherAgencyId)
      : publisherAgencyId
        ? String(publisherAgencyId)
        : undefined;

  const [publisherId, setPublisherId] = useState(() => {
    if (publisherType === "agency" && resolvedAgencyId) return `agency:${resolvedAgencyId}`;
    if (assignedConsultantId) return `consultant:${assignedConsultantId}`;
    if (publisherType === "agency")
      return publisherOptions.find((o) => o.type === "agency")?.id ?? "";
    return "";
  });
  const publisher = useMemo(() => {
    if (publisherId) {
      const found = publisherOptions.find((option) => option.id === publisherId);
      if (found) return found;
    }
    if (publisherType === "agency") {
      if (resolvedAgencyId) {
        const agencyOption = publisherOptions.find(
          (option) => option.id === `agency:${resolvedAgencyId}`,
        );
        if (agencyOption) return agencyOption;
      }
      const agencyFallback = publisherOptions.find((option) => option.type === "agency");
      if (agencyFallback) return agencyFallback;
    }
    if (assignedConsultantId) {
      const consultant = (consultantsQuery.data?.data ?? []).find(
        (c) =>
          String(c.agentId) === String(assignedConsultantId) ||
          String(c.userId) === String(assignedConsultantId),
      );
      if (consultant) {
        const id = consultant.agentId ?? consultant.userId;
        const opt = publisherOptions.find((option) => option.id === `consultant:${id}`);
        if (opt) return opt;
      }
      const directOpt = publisherOptions.find(
        (option) => option.id === `consultant:${assignedConsultantId}`,
      );
      if (directOpt) return directOpt;
    }
    return publisherOptions[0];
  }, [
    publisherId,
    publisherType,
    resolvedAgencyId,
    assignedConsultantId,
    publisherOptions,
    consultantsQuery.data?.data,
  ]);
  const [businessTab, setBusinessTab] = useState<ViewAdBusinessTabKey>(() => {
    const queryTab =
      new URLSearchParams(window.location.search).get("businessTab") ||
      new URLSearchParams(window.location.search).get("tab");
    if (queryTab === "performance" || queryTab === "lead" || queryTab === "management") {
      return queryTab;
    }
    return activeBusinessTab ?? "management";
  });
  const [isPublisherPickerOpen, setIsPublisherPickerOpen] = useState(false);
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

  const isAdDeleted =
    statusInfo.key === "deleted" ||
    statusInfo.key === "incomplete_deleted" ||
    statusInfo.label === "حذف شده";

  const managerActions = getManagerActions(
    statusInfo.key,
    adId,
    () => setIsDeleteDialogOpen(true),
    isAdDeleted,
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
        title="مدیریت آگهی"
      />

      <main className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <section className="bg-surface-container-lowest px-4 pt-4 pb-4" aria-label={card.title}>
          <div className="flex justify-start">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className={`inline-flex h-9 items-center rounded-lg px-3 text-sm leading-5 font-medium ${statusInfo.badgeClassName}`}
            >
              {statusInfo.label}
            </Typography>
          </div>

          <ManagerAdSummary ad={ad} card={card} />

          {statusInfo.key === "wait_for_payment" ? <WaitForPaymentNotice adId={adId} /> : null}

          {["published", "wait_for_stop", "wait_for_deal_confirmation"].includes(statusInfo.key) ? (
            <PublishedMeta ad={ad} />
          ) : null}

          {statusInfo.key === "wait_for_stop" ? (
            <div className="border-warning bg-warning-container mt-4 rounded-2xl border p-4 text-right">
              <div className="text-warning flex items-center gap-2">
                <AlertIcon className="h-5 w-5 shrink-0" />
                <Typography
                  as="h3"
                  variant="title"
                  size="small"
                  weight="medium"
                  className="m-0 text-sm leading-5 font-medium"
                >
                  درخواست توقف انتشار توسط آگهی‌دهنده
                </Typography>
              </div>
              <Typography
                as="p"
                variant="body"
                size="small"
                weight="regular"
                className="text-on-surface m-0 mt-2 text-xs leading-5"
              >
                کاربر درخواست توقف انتشار این آگهی را ثبت کرده است.
              </Typography>
              {ad?.delete_reason &&
              typeof ad.delete_reason === "object" &&
              (ad.delete_reason as Record<string, unknown>).reason ? (
                <div className="bg-surface text-on-surface border-outline-var mt-2 rounded-lg border p-2.5 text-xs font-medium">
                  علت درخواست:{" "}
                  {formatStopPublishReason((ad.delete_reason as Record<string, unknown>).reason)}
                </div>
              ) : null}
              {(() => {
                const pendingStopRequestId =
                  (ad?.stop_request as Record<string, unknown> | undefined)?.id ??
                  (ad?.pending_stop_request as Record<string, unknown> | undefined)?.id ??
                  (ad?.delete_reason as Record<string, unknown> | undefined)?.stop_request_id ??
                  (ad?.delete_reason as Record<string, unknown> | undefined)?.stopRequestId;

                return (
                  <div className="mt-3 flex gap-2">
                    <Button
                      unstyled
                      className="bg-primary text-on-primary inline-flex h-9 flex-1 items-center justify-center rounded-lg text-xs font-medium active:opacity-90 disabled:opacity-50"
                      disabled={approveStopMutation.isPending || !pendingStopRequestId}
                      onClick={async () => {
                        if (!pendingStopRequestId) return;
                        try {
                          await approveStopMutation.mutateAsync({
                            requestId: String(pendingStopRequestId),
                          });
                          window.location.reload();
                        } catch (err) {
                          alert(
                            getApiErrorMessage(err, "تأیید درخواست توقف انتشار با خطا مواجه شد."),
                          );
                        }
                      }}
                      type="button"
                    >
                      {approveStopMutation.isPending ? "در حال ثبت..." : "موافقت با توقف انتشار"}
                    </Button>
                    <Button
                      unstyled
                      className="border-error bg-surface text-error active:bg-error-container inline-flex h-9 flex-1 items-center justify-center rounded-lg border text-xs font-medium disabled:opacity-50"
                      disabled={rejectStopMutation.isPending || !pendingStopRequestId}
                      onClick={async () => {
                        if (!pendingStopRequestId) return;
                        try {
                          await rejectStopMutation.mutateAsync({
                            requestId: String(pendingStopRequestId),
                          });
                          window.location.reload();
                        } catch (err) {
                          alert(getApiErrorMessage(err, "رد درخواست توقف انتشار با خطا مواجه شد."));
                        }
                      }}
                      type="button"
                    >
                      {rejectStopMutation.isPending ? "در حال ثبت..." : "رد درخواست توقف"}
                    </Button>
                  </div>
                );
              })()}
            </div>
          ) : null}

          {statusInfo.key === "wait_for_deal_confirmation" ? (
            <div className="border-primary bg-primary-container/20 mt-4 rounded-2xl border p-4 text-right">
              <div className="text-primary flex items-center gap-2">
                <ClockIcon className="h-5 w-5 shrink-0" />
                <Typography
                  as="h3"
                  variant="title"
                  size="small"
                  weight="medium"
                  className="m-0 text-sm leading-5 font-medium"
                >
                  در انتظار تایید معامله توسط مشتری
                </Typography>
              </div>
              <Typography
                as="p"
                variant="body"
                size="small"
                weight="regular"
                className="text-on-surface m-0 mt-2 text-xs leading-5"
              >
                نتیجه معامله ثبت شده و پیام تایید برای مشتری ارسال شده است (مهلت پاسخ مشتری: ۳ روز).
              </Typography>
            </div>
          ) : null}
        </section>

        <div className="bg-surface-container h-2" aria-hidden="true" />

        <ViewAdBusinessTabs activeTab={businessTab} adId={adId} onTabChange={setBusinessTab} />

        <AnimatePresence mode="wait">
          <motion.div
            key={businessTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {businessTab === "lead" ? (
              <ViewAdLeadsSection adId={adId} />
            ) : businessTab === "performance" ? (
              <ViewAdPerformanceSection adId={adId} ad={ad as Record<string, unknown>} />
            ) : (
              <>
                {!isIndependentConsultant ? (
                  <>
                    <section
                      className="bg-surface-container-lowest px-4 pt-4 pb-4"
                      aria-label="مسئول آگهی"
                    >
                      <Typography
                        as="h2"
                        variant="label"
                        size="large"
                        weight="medium"
                        className="text-on-surface m-0"
                      >
                        مسئول آگهی (مشاور مسئول)
                      </Typography>
                      <div className="mt-3">
                        <div className="bg-surface flex items-center justify-end gap-3 rounded-xl p-3 [direction:rtl]">
                          {publisher ? (
                            <PublisherAvatar publisher={publisher} size="small" />
                          ) : (
                            <div className="bg-surface-container text-outline grid h-12 w-12 shrink-0 place-items-center rounded-full">
                              <LinearUserSolid className="h-6 w-6" />
                            </div>
                          )}
                          <div className="flex flex-1 flex-col justify-center gap-1 text-right">
                            <Typography
                              as="p"
                              variant="body"
                              size="large"
                              weight="medium"
                              className="text-on-surface-var m-0"
                            >
                              {publisher?.name ?? "مسئول آگهی مشخص نیست"}
                            </Typography>
                            <Typography
                              as="p"
                              variant="body"
                              size="small"
                              weight="regular"
                              className="text-outline m-0"
                            >
                              {publisher
                                ? publisher.type === "agency"
                                  ? "مدیریت آژانس"
                                  : "مشاور مسئول"
                                : "—"}
                            </Typography>
                          </div>
                        </div>

                        <Button
                          unstyled
                          className="border-primary bg-surface-container-lowest text-primary active:bg-primary-container mt-3 inline-flex h-10 w-full items-center justify-center gap-1 rounded-lg border text-sm font-medium"
                          onClick={() => setIsPublisherPickerOpen(true)}
                          type="button"
                        >
                          تغییر مشاور مسئول
                          <ChevronLeftIcon className="h-5 w-5" />
                        </Button>
                      </div>
                    </section>

                    <div className="bg-surface-container h-2" aria-hidden="true" />
                  </>
                ) : null}

                <section
                  className="bg-surface-container-lowest min-h-[244px]"
                  aria-label="عملیات آگهی"
                >
                  {managerActions.map((action, index) => (
                    <div key={action.label}>
                      <StateAdAction
                        action={action}
                        ad={ad}
                        card={card}
                        deleteCompleteTo={backTo}
                        returnTo={backTo}
                      />
                      {index < managerActions.length - 1 ? <ActionDivider /> : null}
                    </div>
                  ))}
                </section>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {isPublisherPickerOpen && !isIndependentConsultant ? (
        <ManagerPublisherPickerPage
          onClose={() => setIsPublisherPickerOpen(false)}
          onConfirm={async (nextPublisher) => {
            const nextConsultantId =
              nextPublisher.type === "consultant"
                ? Number(nextPublisher.id.replace("consultant:", ""))
                : null;
            try {
              await changeConsultantMutation.mutateAsync({
                advertiseId: adId,
                consultantId: nextConsultantId,
              });
              setPublisherId(nextPublisher.id);
              setIsPublisherPickerOpen(false);
            } catch (err) {
              console.error("Failed to change consultant:", err);
            }
          }}
          options={publisherOptions}
          selectedPublisher={publisher}
        />
      ) : null}

      <BottomSheet
        ariaLabel="حذف آگهی"
        className="rounded-t-[24px]!"
        contentClassName="min-h-0 overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
        headerButtonAriaLabel="بستن"
        headerClassName="h-10! gap-1! px-2!"
        isOpen={isDeleteDialogOpen}
        onClose={() => !isDeleting && setIsDeleteDialogOpen(false)}
        title="حذف آگهی"
        variant="confirm"
        zIndexClassName="z-2000"
      >
        <div className="px-4 pt-1 pb-4 text-right [direction:rtl]">
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="medium"
            className="text-on-surface m-0 text-sm leading-6"
          >
            آیا از حذف آگهی مطمئن هستید؟
          </Typography>

          <div className="mt-6 flex gap-3">
            <Button
              unstyled
              className="bg-error inline-flex h-11 flex-1 items-center justify-center rounded-xl text-sm font-medium text-white shadow-sm active:opacity-90 disabled:opacity-50"
              disabled={isDeleting}
              onClick={handleDeleteAd}
              type="button"
            >
              {isDeleting ? "در حال حذف..." : "بله"}
            </Button>
            <Button
              unstyled
              className="border-outline-var bg-surface text-on-surface active:bg-surface-container inline-flex h-11 flex-1 items-center justify-center rounded-xl border text-sm font-medium"
              disabled={isDeleting}
              onClick={() => setIsDeleteDialogOpen(false)}
              type="button"
            >
              خیر
            </Button>
          </div>
        </div>
      </BottomSheet>
    </PageFrame>
  );
}

function getManagerActions(
  status: MyAdStatusKey,
  adId: string,
  onDelete?: () => void,
  isAdDeleted?: boolean,
): StateAction[] {
  const preview: StateAction = { icon: "preview", label: "پیش‌نمایش", to: getAdPreviewPath(adId) };
  const edit: StateAction = {
    icon: "edit",
    label: "ویرایش",
    to: getAdEditPath(adId, getAdStatePath(adId)),
  };
  const payment: StateAction = { icon: "payment", label: "پرداخت", to: getAdPaymentPath(adId) };
  const result: StateAction = {
    icon: "result",
    label: "ثبت نتیجه آگهی",
    to: getAdCloseResultPath(adId),
  };
  const remove: StateAction = { icon: "delete", label: "حذف", onClick: onDelete };
  const upgrade: StateAction = {
    icon: "upgrade",
    label: "ارتقای آگهی",
    to: getAdIncreaseVisitsPath(adId),
  };
  const history: StateAction = {
    icon: "history",
    label: "تاریخچه پرداخت",
    to: getAdPaymentHistoryPath(adId),
  };

  if (isAdDeleted || status === "deleted" || status === "incomplete_deleted") {
    return [preview, history];
  }
  if (status === "published") {
    return [preview, edit, result, remove, upgrade, history];
  }
  if (status === "wait_for_stop" || status === "wait_for_deal_confirmation") {
    return [preview, edit, remove, history];
  }
  if (status === "wait_for_payment") {
    return [preview, edit, payment, remove, history];
  }
  if (status === "incomplete" || status === "needs_edit") {
    return [preview, edit, payment, remove, history];
  }
  if (status === "pending") {
    return [preview, edit, remove, history];
  }
  if (status === "expired") {
    return [preview, result, remove, history];
  }
  return [preview, edit, history];
}

function ManagerAdSummary({ ad, card }: { ad?: Record<string, unknown>; card: AdCardData }) {
  const subtitle =
    readText(
      ad?.category ??
        ad?.category_title ??
        ad?.categoryTitle ??
        ad?.category_name ??
        ad?.categoryName,
    ) || "—";

  return (
    <div className="bg-surface mt-4 flex h-[68px] items-center rounded-2xl px-3 shadow-[0_2px_8px_rgba(26,26,26,0.04)] [direction:ltr]">
      <div className="min-w-0 flex-1 text-right [direction:rtl]">
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-on-surface-var m-0 truncate text-xs leading-4 font-normal"
        >
          {subtitle}
        </Typography>
        <Typography
          as="h2"
          variant="title"
          size="small"
          weight="medium"
          className="text-on-surface m-0 mt-1 truncate text-sm leading-5 font-medium"
        >
          {card.title}
        </Typography>
      </div>
      <div
        aria-hidden="true"
        className={`ad-card__image ${card.imageClassName} h-[52px] w-[78px] shrink-0 rounded-lg bg-cover bg-center`}
        style={card.imageUrl ? { backgroundImage: `url(${card.imageUrl})` } : undefined}
      />
    </div>
  );
}

function ManagerPublisherPickerPage({
  onClose,
  onConfirm,
  options,
  selectedPublisher,
}: {
  onClose: () => void;
  onConfirm: (publisher: ManagerPublisher) => void;
  options: ManagerPublisher[];
  selectedPublisher?: ManagerPublisher;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [draftPublisherId, setDraftPublisherId] = useState(selectedPublisher?.id ?? "");
  const normalizedSearch = searchValue.trim();
  const visiblePublishers = normalizedSearch
    ? options.filter((publisher) => publisher.name.includes(normalizedSearch))
    : options;
  const draftPublisher =
    options.find((publisher) => publisher.id === draftPublisherId) ?? selectedPublisher;

  return (
    <section
      aria-label="تغییر منتشرکننده"
      aria-modal="true"
      className="bg-surface-container-lowest text-on-surface fixed inset-y-0 left-1/2 z-[1200] flex w-full max-w-[500px] -translate-x-1/2 flex-col overflow-hidden [direction:rtl]"
      role="dialog"
    >
      <TopBar
        placement="inline"
        centerClassName="px-0"
        className="bg-surface-container"
        onBack={onClose}
        reserveStartSpace
        title="تغییر منتشرکننده"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-y-auto px-4 pt-3 pb-24">
        <SearchInputBar
          aria-label="جستجوی مشاور"
          containerClassName="rounded-lg border-outline-var"
          inputClassName="text-xs leading-5"
          onClear={() => setSearchValue("")}
          onValueChange={setSearchValue}
          placeholder="جستجوی مشاور"
          size="dense"
          type="search"
          value={searchValue}
        />

        <div className="mt-5 grid gap-2" role="radiogroup" aria-label="انتخاب منتشرکننده">
          {visiblePublishers.length === 0 ? (
            <SearchEmptyState />
          ) : (
            visiblePublishers.map((publisher) => {
              const selected = draftPublisherId === publisher.id;

              return (
                <Button
                  unstyled
                  aria-checked={selected}
                  className="bg-surface-container-lowest active:bg-surface-container flex w-full items-center justify-between gap-3 rounded-lg px-4 py-2 text-right [direction:ltr]"
                  key={publisher.id}
                  onClick={() => setDraftPublisherId(publisher.id)}
                  role="radio"
                  type="button"
                >
                  <RadioIndicator checked={selected} />
                  <Typography
                    as="span"
                    variant="body"
                    size="medium"
                    weight="regular"
                    className="flex min-w-0 flex-1 items-center gap-3 [direction:rtl]"
                  >
                    <PublisherAvatar publisher={publisher} size="large" />
                    <Typography
                      as="span"
                      variant="body"
                      size="medium"
                      weight="regular"
                      className="text-on-surface"
                    >
                      {publisher.name}
                    </Typography>
                  </Typography>
                </Button>
              );
            })
          )}
        </div>
      </main>

      <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <Button
          unstyled
          className="bg-primary text-on-primary inline-flex h-10 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium active:opacity-90"
          disabled={!draftPublisher}
          onClick={() => {
            if (draftPublisher) onConfirm(draftPublisher);
          }}
          type="button"
        >
          انتخاب
        </Button>
      </footer>
    </section>
  );
}

function getStateAdBackPath(routeState: MyAdRouteState, isAssigned = false) {
  const activeRole = getActiveAuthRole(getStoredAuthSession());
  const returnTo = normalizeLocalPath(routeState.returnTo);

  if (isAssigned) {
    if (
      returnTo &&
      !returnTo.startsWith("/account/manage-ads") &&
      !returnTo.startsWith("/account/ad-management")
    ) {
      return returnTo;
    }
    return "/account/my-ads";
  }

  if (returnTo) return returnTo;
  if (activeRole === USER || !activeRole) return "/account/my-ads";

  if (routeState.tab) return getBusinessAdManagementFallbackPath();

  if (activeRole) return getBusinessAdManagementFallbackPath();

  return "/account/my-ads";
}

function getBusinessAdManagementFallbackPath() {
  return window.matchMedia("(min-width: 501px)").matches
    ? "/account/dashboard/ads"
    : adManagementPaths.root;
}

function normalizeLocalPath(path?: string) {
  if (!path || !path.startsWith("/")) return undefined;
  if (path.startsWith("//")) return undefined;

  return path;
}

function readRouteState(): MyAdRouteState {
  const state = window.history.state;

  if (!state || typeof state !== "object") return {};

  const usr = (state as Record<string, unknown>).usr;
  if (usr && typeof usr === "object") {
    return { ...(state as MyAdRouteState), ...(usr as MyAdRouteState) };
  }

  return state as MyAdRouteState;
}

function readAdIdFromPath() {
  const match = window.location.pathname.match(
    /^\/(?:account\/my-ads|account\/manage-ads|manage-ads)\/([^/]+)\/state-ads?\/?$/,
  );

  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

function StateAdSummary({ ad, card }: { ad?: Record<string, unknown>; card: AdCardData }) {
  const subtitle =
    readText(
      ad?.category ??
        ad?.category_title ??
        ad?.categoryTitle ??
        ad?.category_name ??
        ad?.categoryName,
    ) || "—";

  return (
    <div className="border-surface-container-high bg-surface-container-low mt-4 flex h-[80px] items-center gap-3 rounded-2xl border px-4 [direction:rtl]">
      {/* Ad image */}
      <div
        aria-hidden="true"
        className={`ad-card__image ${card.imageClassName} h-[52px] w-[70px] shrink-0 rounded-lg bg-cover bg-center`}
        style={
          card.imageUrl
            ? { backgroundImage: `url(${card.imageUrl})` }
            : { backgroundColor: "#E0E0E0" }
        }
      />

      {/* Ad info */}
      <div className="min-w-0 flex-1 text-right">
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-on-surface-var m-0 truncate text-xs leading-5 font-normal"
        >
          {subtitle}
        </Typography>
        <Typography
          as="h2"
          variant="title"
          size="small"
          weight="medium"
          className="text-on-surface m-0 mt-1 truncate text-sm leading-5 font-semibold"
        >
          {card.title}
        </Typography>
      </div>
    </div>
  );
}

function PublishedMeta({ ad }: { ad?: Record<string, unknown> }) {
  const publishedRaw =
    ad?.confirm_date ??
    ad?.confirmDate ??
    ad?.published_at ??
    ad?.publishedAt ??
    ad?.published_date ??
    ad?.sort_date ??
    ad?.sortDate ??
    ad?.created_at ??
    ad?.createdAt ??
    ad?.published_time_ago;

  const published = readDateLike(publishedRaw, ad?.published_hours_ago);
  const expires = readExpirationRemaining(
    ad?.expire_date ??
      ad?.expireDate ??
      ad?.expires_at ??
      ad?.expiresAt ??
      ad?.expiration_date ??
      ad?.expirationDate ??
      ad?.expired_at ??
      (typeof ad?.expire === "object" && ad?.expire && "expires_at" in ad.expire
        ? (ad.expire as { expires_at?: unknown }).expires_at
        : undefined) ??
      ad?.expires_time_ago,
    publishedRaw,
  );

  return (
    <div className="mt-4 text-sm leading-5 font-medium">
      <MetaRow label="انتشار" value={published} />
      <div className="border-outline-var border-t border-dashed" aria-hidden="true" />
      <MetaRow label="انقضا" value={expires} />
    </div>
  );
}

function renderDateWithRelative(text: string) {
  if (!text) return null;

  const match1 = text.match(/^(.*?)\s*(\([0-9/\u06F0-\u06F9\-.]+\))$/);
  if (match1) {
    const relative = match1[1].trim();
    const date = match1[2].trim();
    return (
      <span className="inline-flex items-center gap-1.5 [direction:rtl]">
        <span className="text-outline text-sm font-medium">{relative}</span>
        <span className="text-on-surface text-sm font-medium">{date}</span>
      </span>
    );
  }

  const match2 = text.match(/^(.*?)\s*\((.*?(?:پیش|دیگر|مانده|قبل).*?)\)$/);
  if (match2) {
    const date = match2[1].trim();
    const relative = `(${match2[2].trim()})`;
    return (
      <span className="inline-flex items-center gap-1.5 [direction:rtl]">
        <span className="text-on-surface text-sm font-medium">{date}</span>
        <span className="text-outline text-sm font-medium">{relative}</span>
      </span>
    );
  }

  if (
    text.includes("پیش") ||
    text.includes("دیگر") ||
    text.includes("قبل") ||
    text.includes("مانده")
  ) {
    return <span className="text-outline text-sm font-medium">{text}</span>;
  }

  return <span className="text-on-surface text-sm font-medium">{text}</span>;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-12 items-center justify-between gap-4 [direction:ltr]">
      <div className="[direction:rtl]">{renderDateWithRelative(value)}</div>
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="text-outline [direction:rtl]"
      >
        {label}
      </Typography>
    </div>
  );
}

function PendingReviewNotice() {
  return (
    <div className="border-warning bg-warning-container mt-4 rounded-lg border px-4 py-3 text-right">
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface m-0 text-sm leading-7 font-normal"
      >
        این آگهی در صف بررسی سامانه قرار دارد.
      </Typography>
      <Typography as="p" variant="body" size="medium" weight="regular">
        پس از تایید، آگهی به صورت خودکار منتشر می‌شود.
      </Typography>

      <div className="border-outline-var mt-3 border-t border-dashed pt-3">
        <div className="flex h-6 items-center justify-between gap-4 text-xs leading-4 font-normal [direction:ltr]">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface [direction:rtl]"
          >
            بین 1 تا 6 ساعت
          </Typography>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface-var inline-flex items-center gap-2 [direction:rtl]"
          >
            <ClockIcon className="h-5 w-5" />
            زمان تقریبی بررسی:
          </Typography>
        </div>
      </div>
    </div>
  );
}

function NeedsEditNotice({
  ad,
  card,
  returnTo,
}: {
  ad?: Record<string, unknown>;
  card: AdCardData;
  returnTo: string;
}) {
  return (
    <div className="border-warning bg-warning-container mt-4 rounded-2xl border p-4 text-right">
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface m-0 text-sm leading-7 font-normal"
      >
        برای انتشار مجدد آگهی، لطفا موارد زیر را اصلاح کنید.
      </Typography>

      <div className="border-warning bg-surface-container-lowest mt-3 rounded-lg border px-3 py-3">
        <div className="text-warning flex items-center justify-start gap-2">
          <AlertIcon className="h-5 w-5 shrink-0" />
          <Typography
            as="h3"
            variant="title"
            size="small"
            weight="medium"
            className="m-0 text-sm leading-5 font-medium"
          >
            دلیل توقف انتشار
          </Typography>
        </div>

        <ul className="text-on-surface marker:text-outline m-0 mt-2 list-disc space-y-2 pr-5 text-xs leading-6 font-normal">
          {readModerationReasons(ad).map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>

      <Link
        className="bg-primary text-on-primary mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm leading-5 font-medium no-underline"
        state={{
          ad,
          card,
          editReturnTo: window.location.pathname,
          isEditMode: true,
          returnTo,
        }}
        to={getAdEditPath(card.id, getAdStatePath(card.id))}
      >
        ویرایش آگهی
        <StateIcon icon="edit" />
      </Link>
    </div>
  );
}

function WaitForPaymentNotice({ adId }: { adId?: string }) {
  return (
    <div className="bg-warning-container text-on-warning-container mt-4 flex items-center justify-between rounded-xl p-3">
      <span className="text-sm font-medium">
        برای ادامه فرایند انتشار آگهی، پرداخت را تکمیل کنید.
      </span>
      {adId ? (
        <Link
          className="bg-primary text-on-primary inline-flex h-8 items-center justify-center rounded-lg px-3 text-xs font-medium no-underline"
          to={getAdPaymentPath(adId)}
          state={{ paymentFlow: "new-ad" }}
        >
          پرداخت
        </Link>
      ) : null}
    </div>
  );
}

function getStateActions(
  status: MyAdStatusKey,
  adId: string,
  isAssigned?: boolean,
  ad?: Record<string, unknown>,
  onStopPublish?: () => void,
): StateAction[] {
  const preview: StateAction = { icon: "preview", label: "پیش‌نمایش", to: getAdPreviewPath(adId) };
  const edit: StateAction = {
    icon: "edit",
    label: "ویرایش",
    to: getAdEditPath(adId, getAdStatePath(adId)),
  };
  const remove: StateAction = {
    icon: "delete",
    label: "حذف",
    to: `${adManagementPaths.delete}?adId=${encodeURIComponent(adId)}`,
  };
  const upgrade: StateAction = {
    icon: "upgrade",
    label: "ارتقای آگهی",
    to: getAdIncreaseVisitsPath(adId),
  };
  const stats: StateAction = {
    icon: "stats",
    label: "آمار بازدید",
    to: getAdVisitStatisticsPath(adId),
  };
  const history: StateAction = {
    icon: "history",
    label: "تاریخچه پرداخت",
    to: getAdPaymentHistoryPath(adId),
  };
  const payment: StateAction = { icon: "payment", label: "پرداخت", to: getAdPaymentPath(adId) };

  const rawPhone =
    ad?.assigned_agency_phone ??
    ad?.agency_phone ??
    (ad?.assigned_consultant && typeof ad.assigned_consultant === "object"
      ? (ad.assigned_consultant as Record<string, unknown>).phone
      : undefined) ??
    ad?.consultant_phone ??
    (ad?.agency && typeof ad.agency === "object"
      ? (ad.agency as Record<string, unknown>).phone
      : undefined) ??
    ad?.phone;
  const contactPhone = readText(rawPhone);
  const agencyId = readText(
    ad?.assigned_agency_id ??
      ad?.agency_id ??
      (ad?.agency && typeof ad.agency === "object"
        ? (ad.agency as Record<string, unknown>).id
        : undefined),
  );

  const consultantUserId = readText(
    ad?.assigned_consultant_id ??
      ad?.user_chat_id ??
      (ad?.assigned_consultant && typeof ad.assigned_consultant === "object"
        ? (ad.assigned_consultant as Record<string, unknown>).user_id
        : undefined),
  );

  const callAgency: StateAction = {
    icon: "call",
    label: isAssigned || status === "wait_for_agency" ? "تماس با آژانس" : "تماس با مسئول آگهی",
    onClick: () => {
      if (contactPhone) {
        window.location.href = `tel:${contactPhone}`;
      } else {
        alert("شماره تماس در دسترس نیست.");
      }
    },
  };

  const chatAgency: StateAction = {
    icon: "chat",
    label: isAssigned || status === "wait_for_agency" ? "پیام به آژانس" : "چت با مسئول آگهی",
    onClick: () => {
      const chatQuery = new URLSearchParams();
      if (consultantUserId) {
        chatQuery.set("userId", consultantUserId);
      } else if (agencyId) {
        chatQuery.set("agencyId", agencyId);
      }
      chatQuery.set("adId", adId);
      window.location.href = `/chat?${chatQuery.toString()}`;
    },
  };

  const stopPublish: StateAction = {
    icon: "stop_publish",
    label: "درخواست توقف انتشار",
    onClick: onStopPublish,
  };

  if (status === "published") {
    if (isAssigned) {
      return [preview, edit, stopPublish, callAgency, chatAgency, history];
    }
    return [preview, edit, remove, upgrade, stats, history];
  }
  if (status === "wait_for_agency") return [preview, edit, callAgency, chatAgency, history];
  if (status === "wait_for_stop") return [preview, edit, callAgency, chatAgency, history];
  if (status === "wait_for_deal_confirmation") return [preview, history];
  if (status === "wait_for_repost" || status === "rejected_by_agency")
    return [preview, remove, history];
  if (status === "archived") return [preview, remove];
  if (status === "wait_for_payment") return [preview, edit, payment, remove, history];
  if (status === "pending") {
    if (isAssigned) {
      return [preview, edit, callAgency, chatAgency, history];
    }
    return [preview, edit, remove, history];
  }
  if (status === "needs_edit") return [edit, preview, history];
  if (status === "incomplete") return [edit, payment, remove];
  if (status === "expired" || status === "deleted" || status === "incomplete_deleted")
    return [preview, history];

  return [preview, history];
}

function StateAdAction({
  action,
  ad,
  card,
  deleteCompleteTo,
  returnTo,
}: {
  action: StateAction;
  ad?: Record<string, unknown>;
  card: AdCardData;
  deleteCompleteTo: string;
  returnTo: string;
}) {
  const content = (
    <>
      <ChevronLeftIcon className="text-on-surface-var h-6 w-6" />
      <Typography
        as="span"
        variant="label"
        size="large"
        weight="medium"
        className="inline-flex gap-2 [direction:rtl]"
      >
        <StateIcon icon={action.icon} />
        {action.label}
      </Typography>
    </>
  );

  if (action.onClick) {
    return (
      <Button
        unstyled
        className="text-on-surface-var active:bg-surface-container flex h-14 w-full items-center justify-between px-4 [direction:ltr]"
        onClick={action.onClick}
        type="button"
      >
        {content}
      </Button>
    );
  }

  if (action.to) {
    const isAdAssigned = Boolean(
      ad?.is_assigned ||
      ad?.isAssigned ||
      ad?.assignment_status === "pending" ||
      ad?.assignment_status === "accepted" ||
      ad?.status === "wait_for_agency" ||
      ad?.status_key === "wait_for_agency",
    );

    return (
      <Link
        className="text-on-surface-var flex h-14 w-full items-center justify-between px-4 no-underline [direction:ltr]"
        state={{
          ad: action.icon === "upgrade" && !ad ? card : ad,
          card,
          deleteCompleteTo: action.icon === "delete" ? deleteCompleteTo : undefined,
          deleteReturnTo: action.icon === "delete" ? window.location.pathname : undefined,
          editReturnTo: window.location.pathname,
          isEditMode: action.icon === "edit" ? true : undefined,
          previewFlow: action.icon === "preview" && isAdAssigned ? "agency-allocation" : undefined,
          paymentFlow:
            action.icon === "upgrade"
              ? "upgrade"
              : action.icon === "payment"
                ? "new-ad"
                : undefined,
          paymentHistoryReturnTo: action.icon === "history" ? window.location.pathname : undefined,
          visitStatisticsReturnTo: action.icon === "stats" ? window.location.pathname : undefined,
          returnTo,
        }}
        to={action.to}
      >
        {content}
      </Link>
    );
  }

  return (
    <Button
      unstyled
      className="text-on-surface flex h-14 w-full items-center justify-between px-4 [direction:ltr]"
      type="button"
    >
      {content}
    </Button>
  );
}

function ActionDivider() {
  return (
    <div className="flex h-[5px] items-center px-4" aria-hidden="true">
      <div className="bg-outline-var h-px w-full" />
    </div>
  );
}

function StateIcon({ icon }: { icon: StateActionKey }) {
  if (icon === "preview") return <LinearPreview className="h-6 w-6" />;
  if (icon === "edit") return <LinearEdit2 className="h-6 w-6" />;
  if (icon === "delete") return <LinearDelete className="h-6 w-6" />;
  if (icon === "upgrade") return <LinearChartUp className="h-6 w-6" />;
  if (icon === "payment") return <LinearPayment className="h-6 w-6" />;
  if (icon === "result") return <LinearFlag className="h-6 w-6" />;
  if (icon === "stats") return <LinearAnalytics className="h-6 w-6" />;
  if (icon === "call") return <LinearCall className="h-6 w-6" />;
  if (icon === "chat") return <LinearChat className="h-6 w-6" />;
  if (icon === "stop_publish") return <LinearCancel className="h-6 w-6" />;

  return <LinearFactor className="h-6 w-6" />;
}

function WaitForAgencyNotice({
  ad,
  onCancelAssignment,
}: {
  ad?: Record<string, unknown>;
  onCancelAssignment: () => void;
}) {
  const agencyName =
    readText(
      ad?.assigned_agency_name ??
        ad?.agency_name ??
        (ad?.agency && typeof ad.agency === "object"
          ? (ad.agency as Record<string, unknown>).name
          : undefined),
    ) || "آژانس املاک";
  const agencyStartDate = getAgencyAssignmentStartDate(ad);
  const deadlineRemaining = readAgencyDeadlineRemaining(agencyStartDate);

  return (
    <div className="border-warning bg-warning-container/30 mt-4 rounded-2xl border p-4 text-right">
      <div className="text-warning flex items-center gap-2">
        <ClockIcon className="h-5 w-5 shrink-0" />
        <Typography
          as="h3"
          variant="title"
          size="small"
          weight="medium"
          className="m-0 text-sm leading-5 font-medium"
        >
          در انتظار بررسی و تایید {agencyName}
        </Typography>
      </div>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface-var m-0 mt-2 text-xs leading-5"
      >
        آگهی شما با موفقیت برای این آژانس ارسال شده است. مهلت بررسی آژانس حداکثر ۲۴ ساعت است. در
        صورت تمایل می‌توانید پیش از تایید آژانس، با آژانس ارتباط بگیرید یا واگذاری را لغو کنید.
      </Typography>

      <div className="border-outline-var text-outline mt-3 flex items-center justify-between border-t border-dashed pt-3 text-xs [direction:ltr]">
        <Typography
          as="span"
          variant="body"
          size="small"
          weight="medium"
          className="text-on-surface [direction:rtl]"
        >
          {deadlineRemaining}
        </Typography>
        <span className="[direction:rtl]">مهلت باقی‌مانده تایید آژانس:</span>
      </div>

      <Button
        unstyled
        className="border-error text-error active:bg-error-container mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg border bg-transparent text-xs font-medium"
        onClick={onCancelAssignment}
        type="button"
      >
        لغو واگذاری به آژانس
      </Button>
    </div>
  );
}

function WaitForRepostNotice({
  ad,
  reRegisterData,
  onRepost,
}: {
  ad?: Record<string, unknown>;
  reRegisterData?: AdvertisementReRegisterStatusResponse;
  onRepost: () => void;
}) {
  const fallbackRemaining = readDeadlineRemaining(
    ad?.delete_reason && typeof ad.delete_reason === "object"
      ? (ad.delete_reason as Record<string, unknown>).repost_deadline
      : undefined,
    7,
    ad?.updated_at ?? ad?.updatedAt,
  );
  const repostRemaining =
    reRegisterData?.expire || reRegisterData?.expires_at || reRegisterData?.reason
      ? formatExpireDuration(
          reRegisterData.expire,
          reRegisterData.expires_at,
          reRegisterData.reason || fallbackRemaining,
        )
      : fallbackRemaining;

  return (
    <div className="border-warning bg-warning-container mt-4 rounded-2xl border p-4 text-right">
      <div className="text-warning flex items-center gap-2">
        <AlertIcon className="h-5 w-5 shrink-0" />
        <Typography
          as="h3"
          variant="title"
          size="small"
          weight="medium"
          className="m-0 text-sm leading-5 font-medium"
        >
          در انتظار انتشار مجدد
        </Typography>
      </div>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface m-0 mt-2 text-xs leading-5"
      >
        واگذاری این آگهی لغو شده است. شما ۷ روز فرصت دارید تا این آگهی را به آژانس دیگری واگذار کنید
        یا با پرداخت هزینه، مستقیماً منتشر نمایید.
      </Typography>

      <div className="border-outline-var text-outline mt-3 flex items-center justify-between border-t border-dashed pt-3 text-xs [direction:ltr]">
        <Typography
          as="span"
          variant="body"
          size="small"
          weight="medium"
          className="text-on-surface [direction:rtl]"
        >
          {repostRemaining}
        </Typography>
        <span className="[direction:rtl]">مهلت انتشار مجدد:</span>
      </div>

      <Button
        unstyled
        className="bg-primary text-on-primary mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg text-xs font-medium active:opacity-90"
        onClick={onRepost}
        type="button"
      >
        انتشار مجدد آگهی
      </Button>
    </div>
  );
}

function ArchivedNotice({
  ad,
  archiveData,
  isPending,
  onRestore,
}: {
  ad?: Record<string, unknown>;
  archiveData?: AdvertisementArchiveStatusResponse;
  isPending: boolean;
  onRestore: () => void;
}) {
  const fallbackRemaining = readDeadlineRemaining(
    ad?.delete_reason && typeof ad.delete_reason === "object"
      ? (ad.delete_reason as Record<string, unknown>).archive_deadline
      : undefined,
    30,
    ad?.updated_at ?? ad?.updatedAt,
  );
  const archiveRemaining =
    archiveData?.expire || archiveData?.expires_at || archiveData?.reason
      ? formatExpireDuration(
          archiveData.expire,
          archiveData.expires_at,
          archiveData.reason || fallbackRemaining,
        )
      : fallbackRemaining;

  return (
    <div className="border-outline-var bg-surface mt-4 rounded-2xl border p-4 text-right">
      <div className="text-outline flex items-center gap-2">
        <ClockIcon className="h-5 w-5 shrink-0" />
        <Typography
          as="h3"
          variant="title"
          size="small"
          weight="medium"
          className="text-on-surface m-0 text-sm leading-5 font-medium"
        >
          آگهی بایگانی شده
        </Typography>
      </div>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface-var m-0 mt-2 text-xs leading-5"
      >
        مهلت انتشار مجدد این آگهی به پایان رسیده و آگهی به بایگانی منتقل شده است. تا ۱ ماه می‌توانید
        آگهی را بازیابی کنید. پس از آن برای همیشه حذف خواهد شد.
      </Typography>

      <div className="border-outline-var text-outline mt-3 flex items-center justify-between border-t border-dashed pt-3 text-xs [direction:ltr]">
        <Typography
          as="span"
          variant="body"
          size="small"
          weight="medium"
          className="text-on-surface [direction:rtl]"
        >
          {archiveRemaining}
        </Typography>
        <span className="[direction:rtl]">مهلت بازیابی از بایگانی:</span>
      </div>

      <Button
        unstyled
        className="border-primary bg-surface-container-lowest text-primary active:bg-primary-container mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg border text-xs font-medium disabled:opacity-50"
        disabled={isPending}
        onClick={onRestore}
        type="button"
      >
        {isPending ? "در حال بازیابی..." : "بازیابی و بازگشت به آگهی‌های در انتظار"}
      </Button>
    </div>
  );
}

function RejectedByAgencyNotice({
  ad,
  onRepost,
}: {
  ad?: Record<string, unknown>;
  onRepost: () => void;
}) {
  const reason =
    (ad?.delete_reason && typeof ad.delete_reason === "object"
      ? (ad.delete_reason as Record<string, unknown>).reason
      : undefined) ??
    ad?.reject_reason ??
    ad?.rejection_reason ??
    "عدم توافق در شرایط انتشار";

  return (
    <div className="border-error bg-error-container/30 mt-4 rounded-2xl border p-4 text-right">
      <div className="text-error flex items-center gap-2">
        <AlertIcon className="h-5 w-5 shrink-0" />
        <Typography
          as="h3"
          variant="title"
          size="small"
          weight="medium"
          className="m-0 text-sm leading-5 font-medium"
        >
          رد درخواست توسط آژانس
        </Typography>
      </div>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface m-0 mt-2 text-xs leading-5"
      >
        آژانس انتخابی درخواست واگذاری این آگهی را با دلیل زیر رد کرده است:
      </Typography>

      <div className="bg-surface text-on-surface border-outline-var mt-2 rounded-lg border p-2.5 text-xs font-medium">
        علت رد: {String(reason)}
      </div>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface-var m-0 mt-2 text-xs leading-5"
      >
        می‌توانید آگهی را به آژانس دیگری واگذار نمایید یا مستقیماً به عنوان آگهی شخصی منتشر کنید.
      </Typography>

      <Button
        unstyled
        className="bg-primary text-on-primary mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg text-xs font-medium active:opacity-90"
        onClick={onRepost}
        type="button"
      >
        انتخاب مجدد روش انتشار
      </Button>
    </div>
  );
}

function WaitForStopNotice({
  isPending,
  onCancelStop,
}: {
  isPending: boolean;
  onCancelStop: () => void;
}) {
  return (
    <div className="border-warning bg-warning-container mt-4 rounded-2xl border p-4 text-right">
      <div className="text-warning flex items-center gap-2">
        <ClockIcon className="h-5 w-5 shrink-0" />
        <Typography
          as="h3"
          variant="title"
          size="small"
          weight="medium"
          className="m-0 text-sm leading-5 font-medium"
        >
          در انتظار تایید توقف انتشار
        </Typography>
      </div>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface m-0 mt-2 text-xs leading-5"
      >
        درخواست توقف انتشار این آگهی برای آژانس ارسال شده و آگهی پس از بررسی آژانس از حالت انتشار
        خارج خواهد شد.
      </Typography>

      <Button
        unstyled
        className="border-outline-var bg-surface text-on-surface active:bg-surface-container mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg border text-xs font-medium disabled:opacity-50"
        disabled={isPending}
        onClick={onCancelStop}
        type="button"
      >
        {isPending ? "در حال انصراف..." : "انصراف از درخواست توقف"}
      </Button>
    </div>
  );
}

function WaitForDealConfirmationNotice({
  ad: _ad,
  submitResultData,
  isPending,
  onConfirm,
}: {
  ad?: Record<string, unknown>;
  submitResultData?: AdvertisementSubmitResultStatusResponse;
  isPending: boolean;
  onConfirm: (confirmed: boolean) => void;
}) {
  const agencyName = submitResultData?.agency?.name ?? "آژانس";
  const deadlineText =
    submitResultData?.expire || submitResultData?.expires_at || submitResultData?.reason
      ? formatExpireDuration(
          submitResultData.expire,
          submitResultData.expires_at,
          submitResultData.reason || "مهلت پاسخ: ۳ روز",
        )
      : "مهلت پاسخ: ۳ روز";

  return (
    <div className="border-primary bg-primary-container/20 mt-4 rounded-2xl border-2 p-4 text-right shadow-sm">
      <div className="text-primary flex items-center gap-2">
        <LinearFlag className="h-5 w-5 shrink-0" />
        <Typography
          as="h3"
          variant="title"
          size="small"
          weight="semibold"
          className="m-0 text-sm leading-5"
        >
          آیا معامله این ملک با موفقیت انجام شد؟
        </Typography>
      </div>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface m-0 mt-2 text-xs leading-5"
      >
        {agencyName} وضعیت این آگهی را «معامله انجام شده» ثبت کرده است. لطفا جهت تایید نهایی و پایان
        فرایند، نتیجه را مشخص نمایید ({deadlineText}).
      </Typography>

      <div className="mt-4 flex gap-2">
        <Button
          unstyled
          className="bg-primary text-on-primary inline-flex h-10 flex-1 items-center justify-center rounded-lg text-xs font-semibold active:opacity-90 disabled:opacity-50"
          disabled={isPending}
          onClick={() => onConfirm(true)}
          type="button"
        >
          بله، معامله انجام شد
        </Button>
        <Button
          unstyled
          className="border-error bg-surface text-error active:bg-error-container inline-flex h-10 flex-1 items-center justify-center rounded-lg border text-xs font-semibold disabled:opacity-50"
          disabled={isPending}
          onClick={() => onConfirm(false)}
          type="button"
        >
          خیر، معامله انجام نشد
        </Button>
      </div>
    </div>
  );
}

function CancelAssignmentBottomSheet({
  isOpen,
  isPending,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <BottomSheet
      ariaLabel="لغو واگذاری به آژانس"
      className="rounded-t-[24px]!"
      contentClassName="min-h-0 overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
      headerButtonAriaLabel="بستن"
      headerClassName="h-10! gap-1! px-2!"
      isOpen={isOpen}
      onClose={onCancel}
      title="لغو واگذاری به آژانس"
      variant="confirm"
      zIndexClassName="z-2000"
    >
      <div className="px-4 pt-1 pb-4 text-right [direction:rtl]">
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="medium"
          className="text-on-surface m-0 text-sm leading-6"
        >
          آیا از لغو واگذاری این آگهی به آژانس اطمینان دارید؟
        </Typography>
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-on-surface-var m-0 mt-2 text-xs leading-5"
        >
          پس از لغو، ۷ روز مهلت خواهید داشت تا آن را به آژانس دیگری واگذار کنید یا مستقیماً منتشر
          نمایید.
        </Typography>

        <div className="mt-6 flex gap-3">
          <Button
            unstyled
            className="bg-error inline-flex h-11 flex-1 items-center justify-center rounded-xl text-sm font-medium text-white shadow-sm active:opacity-90 disabled:opacity-50"
            disabled={isPending}
            onClick={onConfirm}
            type="button"
          >
            {isPending ? "در حال لغو..." : "بله، لغو واگذاری"}
          </Button>
          <Button
            unstyled
            className="border-outline-var bg-surface text-on-surface active:bg-surface-container inline-flex h-11 flex-1 items-center justify-center rounded-xl border text-sm font-medium"
            disabled={isPending}
            onClick={onCancel}
            type="button"
          >
            انصراف
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}

function RepostChoiceBottomSheet({
  isOpen,
  onClose,
  onSelectAgency,
  onSelectPersonal,
  isPersonalPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectAgency: () => void;
  onSelectPersonal: () => void;
  isPersonalPending: boolean;
}) {
  return (
    <BottomSheet
      ariaLabel="انتخاب روش انتشار مجدد"
      className="rounded-t-[24px]!"
      contentClassName="min-h-0 overflow-y-auto overscroll-contain pb-[max(0.875rem,env(safe-area-inset-bottom,0px))]"
      headerButtonAriaLabel="بستن"
      headerClassName="h-10! gap-1! px-2!"
      isOpen={isOpen}
      onClose={onClose}
      title="انتخاب روش انتشار مجدد"
      variant="actions"
      zIndexClassName="z-2000"
    >
      <div className="px-4 pb-2 text-right [direction:rtl]">
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-on-surface-var m-0 text-xs leading-5"
        >
          تمایل دارید همین آگهی را به چه صورت مجدداً فعال و منتشر نمایید؟ تمامی مشخصات ثبت‌شده ملک
          حفظ می‌شود.
        </Typography>
      </div>

      <div className="divide-outline-var divide-y">
        <ListItem
          description="پرداخت هزینه انتشار و انتشار فوری آگهی به صورت شخصی"
          disabled={isPersonalPending}
          leading={<LinearUserSolid aria-hidden="true" className="text-on-surface-var h-6 w-6" />}
          onClick={onSelectPersonal}
          tabIndex={isOpen ? 0 : -1}
          title={
            isPersonalPending
              ? "در حال انتقال به پرداخت..."
              : "انتشار شخصی و مستقیم (پرداخت آنلاین)"
          }
          trailing={<LinearArrowLeft1 aria-hidden="true" className="text-on-surface-var h-6 w-6" />}
        />

        <ListItem
          description="ارسال و واگذاری این آگهی به آژانس املاک برای مدیریت و انتشار"
          disabled={isPersonalPending}
          leading={<LinearBuilding2 aria-hidden="true" className="text-on-surface-var h-6 w-6" />}
          onClick={onSelectAgency}
          tabIndex={isOpen ? 0 : -1}
          title="ارسال و واگذاری به آژانس املاک دیگر"
          trailing={<LinearArrowLeft1 aria-hidden="true" className="text-on-surface-var h-6 w-6" />}
        />
      </div>
    </BottomSheet>
  );
}

function AgencyReassignBottomSheet({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (agencyId: string | number) => void;
  isPending: boolean;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);

  const { data, isLoading } = useAgencyInfiniteQuery({
    search: searchValue.trim(),
    enabled: isOpen,
    perPage: 20,
  });

  const agencies = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  return (
    <BottomSheet
      ariaLabel="انتخاب آژانس املاک جدید"
      className="max-h-[85svh] rounded-t-[24px]!"
      contentClassName="min-h-0 overflow-y-auto overscroll-contain"
      headerButtonAriaLabel="بستن"
      headerClassName="h-10! gap-1! px-2!"
      heightClassName="h-[min(100svh,640px)]"
      isOpen={isOpen}
      onClose={onClose}
      title="انتخاب آژانس املاک جدید"
      variant="full-height"
      zIndexClassName="z-2000"
    >
      <div className="flex min-h-0 flex-1 flex-col [direction:rtl]">
        <div className="px-4 pb-3">
          <SearchInputBar
            aria-label="جستجوی آژانس"
            containerClassName="rounded-xl border-outline-var/60"
            inputClassName="text-xs leading-5"
            onClear={() => setSearchValue("")}
            onValueChange={setSearchValue}
            placeholder="جستجوی نام آژانس..."
            size="dense"
            type="search"
            value={searchValue}
          />
        </div>

        <div className="min-h-[220px] flex-1 space-y-2 overflow-y-auto px-4 py-1">
          {isLoading ? (
            <div className="text-outline flex h-36 items-center justify-center text-xs">
              در حال بارگذاری آژانس‌ها...
            </div>
          ) : agencies.length === 0 ? (
            <SearchEmptyState />
          ) : (
            agencies.map((agency) => {
              const isSelected = String(agency.id) === String(selectedAgencyId);
              return (
                <button
                  key={agency.id}
                  type="button"
                  onClick={() => setSelectedAgencyId(String(agency.id))}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-right transition-colors ${
                    isSelected ? "border-primary bg-primary/5" : "border-outline-var/40 bg-surface"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="bg-surface-container text-primary flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                      {agency.logo || agency.img ? (
                        <img
                          src={agency.logo || agency.img}
                          alt={agency.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <LinearBuilding2 className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Typography
                        as="p"
                        variant="body"
                        size="small"
                        weight="medium"
                        className="text-on-surface m-0 truncate text-xs"
                      >
                        {agency.name}
                      </Typography>
                      {agency.address && (
                        <Typography
                          as="p"
                          variant="body"
                          size="small"
                          weight="regular"
                          className="text-on-surface-var m-0 mt-0.5 truncate text-[11px]"
                        >
                          {agency.address}
                        </Typography>
                      )}
                    </div>
                  </div>
                  <RadioIndicator checked={isSelected} />
                </button>
              );
            })
          )}
        </div>

        <div className="border-outline-var/30 bg-surface-container-lowest mt-auto border-t p-4">
          <Button
            unstyled
            disabled={!selectedAgencyId || isPending}
            onClick={() => {
              if (selectedAgencyId) onConfirm(selectedAgencyId);
            }}
            className="bg-primary text-on-primary inline-flex h-11 w-full items-center justify-center rounded-xl text-xs font-semibold active:opacity-90 disabled:opacity-40"
            type="button"
          >
            {isPending ? "در حال واگذاری..." : "تأیید و واگذاری به این آژانس"}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}

const STOP_PUBLISH_REASONS = [
  { id: "deal_done", label: "معامله انجام شده است" },
  { id: "no_longer_want_publish", label: "دیگر تمایلی به انتشار آگهی ندارم" },
  { id: "other", label: "سایر دلایل" },
] as const;

function StopPublishModal({
  isPending,
  onClose,
  onConfirm,
}: {
  isPending: boolean;
  onClose: () => void;
  onConfirm: (reason: string, description?: string) => void;
}) {
  const [selectedReason, setSelectedReason] = useState<string>(STOP_PUBLISH_REASONS[0].id);
  const [customReason, setCustomReason] = useState("");

  const handleSubmit = () => {
    const description =
      selectedReason === "other" && customReason.trim() ? customReason.trim() : undefined;
    onConfirm(selectedReason, description);
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/50 p-0 [direction:rtl] sm:items-center sm:p-4"
      role="dialog"
    >
      <div className="bg-surface w-full max-w-sm rounded-t-2xl p-5 text-right shadow-xl sm:rounded-2xl">
        <Typography
          as="h3"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-on-surface m-0 text-base"
        >
          درخواست توقف انتشار
        </Typography>
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-on-surface-var m-0 mt-2 text-xs leading-5"
        >
          لطفا دلیل درخواست توقف انتشار را انتخاب کنید:
        </Typography>

        <div className="mt-4 space-y-2">
          {STOP_PUBLISH_REASONS.map((option) => (
            <label
              key={option.id}
              className="border-outline-var flex cursor-pointer items-center justify-between rounded-xl border p-3"
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="stopReason"
                  value={option.id}
                  checked={selectedReason === option.id}
                  onChange={() => setSelectedReason(option.id)}
                  className="accent-primary h-4 w-4"
                />
                <span className="text-on-surface text-xs font-medium">{option.label}</span>
              </div>
            </label>
          ))}
        </div>

        {selectedReason === "other" ? (
          <textarea
            className="border-outline-var bg-surface text-on-surface focus:outline-primary mt-3 w-full rounded-xl border p-3 text-xs"
            placeholder="توضیح کوتاه دلیل توقف..."
            rows={2}
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        ) : null}

        <div className="mt-5 flex gap-2">
          <Button
            unstyled
            className="bg-primary text-on-primary inline-flex h-10 flex-1 items-center justify-center rounded-lg text-xs font-medium active:opacity-90 disabled:opacity-50"
            disabled={isPending}
            onClick={handleSubmit}
            type="button"
          >
            {isPending ? "در حال ثبت..." : "ثبت درخواست"}
          </Button>
          <Button
            unstyled
            className="border-outline-var bg-surface text-on-surface active:bg-surface-container inline-flex h-10 flex-1 items-center justify-center rounded-lg border text-xs font-medium"
            disabled={isPending}
            onClick={onClose}
            type="button"
          >
            انصراف
          </Button>
        </div>
      </div>
    </div>
  );
}

function getAgencyAssignmentStartDate(ad?: Record<string, unknown>): string | undefined {
  if (!ad) return undefined;
  if (Array.isArray(ad.status_logs)) {
    const logs = [...ad.status_logs].reverse();
    const waitLog = logs.find(
      (l) =>
        l &&
        typeof l === "object" &&
        ((l as Record<string, unknown>).status === "wait_for_agency" ||
          (l as Record<string, unknown>).status === 1 ||
          String((l as Record<string, unknown>).status) === "1" ||
          String((l as Record<string, unknown>).description ?? "").includes("agency") ||
          String((l as Record<string, unknown>).description ?? "").includes("آژانس")),
    );
    if (waitLog && typeof waitLog === "object") {
      const logDate =
        (waitLog as Record<string, unknown>).date ||
        (waitLog as Record<string, unknown>).created_at;
      if (logDate) return String(logDate);
    }
  }
  const updatedAt = ad.updated_at ?? ad.updatedAt;
  if (typeof updatedAt === "string" && updatedAt.trim()) {
    return updatedAt;
  }
  const createdAt = ad.created_at ?? ad.createdAt;
  if (typeof createdAt === "string" && createdAt.trim()) {
    return createdAt;
  }
  return undefined;
}

function readAgencyDeadlineRemaining(startDate: unknown) {
  if (typeof startDate !== "string" || !startDate.trim()) return "۲۴ ساعت";
  const start = Date.parse(startDate);
  if (!Number.isFinite(start)) return "۲۴ ساعت";
  const deadline = start + 24 * 60 * 60 * 1000;
  const diff = deadline - Date.now();
  if (diff <= 0) return "مهلت ۲۴ ساعته به پایان رسیده است";
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  if (hours <= 0 && minutes <= 0) return "کمتر از ۱ دقیقه";
  if (hours <= 0) return `${toPersianDigits(minutes)} دقیقه`;
  return `${toPersianDigits(hours)} ساعت و ${toPersianDigits(minutes)} دقیقه`;
}

function readDeadlineRemaining(deadlineDate: unknown, defaultDays: number, fallbackDate: unknown) {
  let targetTimestamp: number | null = null;
  if (typeof deadlineDate === "string" && deadlineDate.trim()) {
    const t = Date.parse(deadlineDate);
    if (Number.isFinite(t)) targetTimestamp = t;
  }
  if (!targetTimestamp && typeof fallbackDate === "string" && fallbackDate.trim()) {
    const t = Date.parse(fallbackDate);
    if (Number.isFinite(t)) targetTimestamp = t + defaultDays * 24 * 60 * 60 * 1000;
  }
  if (!targetTimestamp) return `${toPersianDigits(defaultDays)} روز`;
  const diff = targetTimestamp - Date.now();
  if (diff <= 0) return "مهلت به پایان رسیده است";
  const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
  return `${toPersianDigits(days)} روز دیگر`;
}

function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="m14 7-5 5 5 5" />
    </svg>
  );
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function AlertIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M10.35 4.4 2.8 17.5A2 2 0 0 0 4.55 20.5h14.9a2 2 0 0 0 1.75-3L13.65 4.4a1.9 1.9 0 0 0-3.3 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function PublisherAvatar({
  publisher,
  size,
}: {
  publisher: ManagerPublisher;
  size: "large" | "small";
}) {
  const sizeClass = size === "large" ? "h-14 w-14" : "h-12 w-12";
  const radiusClass = publisher.type === "agency" ? "rounded-lg" : "rounded-full";

  if (publisher.image) {
    return (
      <img
        alt=""
        className={`${sizeClass} shrink-0 object-cover ${radiusClass}`}
        draggable={false}
        src={publisher.image}
      />
    );
  }

  return (
    <div
      className={`grid ${sizeClass} bg-surface-container text-outline shrink-0 place-items-center ${radiusClass}`}
    >
      {publisher.type === "agency" ? (
        <LinearBuilding2 className="h-6 w-6" />
      ) : (
        <LinearUserSolid className="h-6 w-6" />
      )}
    </div>
  );
}

function createUnavailableAdCard(
  adId: string | undefined,
  ad?: Record<string, unknown>,
): AdCardData {
  return {
    id: adId ?? readEntityId(ad) ?? "",
    title: readText(ad?.title ?? ad?.ad_title) || "آگهی",
    agency: readText(ad?.agency),
    status: readText(ad?.status),
    imageCount: "0",
    priceLabelPrimary: "",
    pricePrimary: "—",
    priceLabelSecondary: "",
    priceSecondary: "",
    area: "—",
    rooms: "—",
    year: "—",
    timeAndLocation: readText(ad?.timeAndLocation ?? ad?.time_and_location),
    imageClassName: "",
    badges: [],
  };
}

function readEntityId(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const record = value as Record<string, unknown>;
  const id = record.id ?? record._id ?? record.advertise_id ?? record.advertiseId;
  if (typeof id === "string" && id.trim()) return id;
  if (typeof id === "number" && Number.isFinite(id)) return String(id);
  return undefined;
}

function readDateLike(value: unknown, hoursAgo?: unknown) {
  if (typeof value !== "string" || !value.trim()) return "—";
  const raw = value.trim();
  const timestamp = Date.parse(raw);
  if (!Number.isFinite(timestamp)) return raw;
  const d = new Date(timestamp);
  const dateFormatted = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);

  const targetMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const now = new Date();
  const baseMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const days = Math.round((baseMidnight - targetMidnight) / 86_400_000);

  let relative = "امروز";
  if (days === 1) relative = "دیروز";
  else if (days > 1) relative = `${toPersianDigits(days)} روز پیش`;
  else if (typeof hoursAgo === "number" && hoursAgo >= 24) {
    const hDays = Math.floor(hoursAgo / 24);
    relative = hDays === 1 ? "دیروز" : `${toPersianDigits(hDays)} روز پیش`;
  }
  return `${relative} (${dateFormatted})`;
}

function readExpirationRemaining(value: unknown, fallbackPublishedDate?: unknown) {
  const raw = typeof value === "string" && value.trim() ? value.trim() : "";
  let timestamp = raw ? Date.parse(raw) : NaN;

  if (
    !Number.isFinite(timestamp) &&
    typeof fallbackPublishedDate === "string" &&
    fallbackPublishedDate.trim()
  ) {
    const pubTime = Date.parse(fallbackPublishedDate.trim());
    if (Number.isFinite(pubTime)) {
      timestamp = pubTime + 30 * 86_400_000;
    }
  }

  if (!Number.isFinite(timestamp)) return raw || "—";

  const d = new Date(timestamp);
  const expirationDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);

  const targetMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const now = new Date();
  const baseMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const remainingDays = Math.round((targetMidnight - baseMidnight) / 86_400_000);

  if (remainingDays < 0) return `منقضی شده (${expirationDate})`;

  const remainingLabel =
    remainingDays === 0 ? "امروز" : `${toPersianDigits(remainingDays)} روز دیگر`;

  return `${remainingLabel} (${expirationDate})`;
}

function toPersianDigits(value: number | string) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

function readModerationReasons(ad?: Record<string, unknown>) {
  if (!ad) return ["جزئیات اصلاح از سرور دریافت نشده است."];
  const values = [
    ad.rejection_reasons,
    ad.rejection_reason,
    ad.reject_reason,
    ad.edit_reason,
    ad.status_reason,
    ad.moderation_note,
  ];
  const reasons = values
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .map((value) => readText(value))
    .filter(Boolean);
  return reasons.length > 0
    ? Array.from(new Set(reasons))
    : ["جزئیات اصلاح از سرور دریافت نشده است."];
}

function readText(value: unknown) {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);

  return "";
}

function MyAdStateSkeleton({
  backState,
  backTo,
}: {
  backState?: Record<string, unknown>;
  backTo: string;
}) {
  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={backState}
        backTo={backTo}
        className="[&_a]:text-on-surface"
        title="مدیریت آگهی"
      />

      <main className="bg-surface-container flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <section
          className="bg-surface-container-lowest shrink-0 space-y-3 px-4 pt-4 pb-4"
          aria-label="در حال بارگذاری وضعیت آگهی"
        >
          <div className="animate-skeleton h-8 w-24 rounded-lg" />
          <div className="flex gap-3 [direction:rtl]">
            <div className="animate-skeleton h-[90px] w-[120px] shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2.5">
              <div className="animate-skeleton h-5 w-3/4 rounded-md" />
              <div className="animate-skeleton h-4 w-1/2 rounded-md" />
              <div className="animate-skeleton h-4 w-2/3 rounded-md" />
            </div>
          </div>
          <div className="border-outline-var flex justify-between border-t pt-2">
            <div className="animate-skeleton h-4 w-28 rounded-md" />
            <div className="animate-skeleton h-4 w-20 rounded-md" />
          </div>
        </section>

        <div className="bg-surface-container h-2 shrink-0" aria-hidden="true" />

        <section
          className="bg-surface-container-lowest min-h-[300px] flex-1 space-y-6 p-4"
          aria-label="در حال بارگذاری عملیات آگهی"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="animate-skeleton h-5 w-5 rounded-md" />
                <div className="animate-skeleton h-4 w-28 rounded-md" />
              </div>
              <div className="animate-skeleton h-4 w-4 rounded-md" />
            </div>
          ))}
        </section>
      </main>
    </PageFrame>
  );
}
