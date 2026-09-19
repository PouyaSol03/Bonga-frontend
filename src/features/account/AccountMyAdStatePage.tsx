import { useMemo, useState } from "react";

import { getActiveAuthRole, getStoredAuthSession } from "../../shared/auth/auth-storage";
import { useMyAdvertisementDetailQuery } from "../advertisements/api/advertisement.hooks";
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
} from "../advertisements/api/agency-advertise-assignment.hooks";
import { useAgencyConsultantsQuery, useAgencyInfiniteQuery } from "../agencies/api/agency.hooks";
import { useMyAgencyProfileQuery } from "./api/account.hooks";
import { mapAdvertisementToAdCard } from "../advertisements/api/advertisement.service";
import { REAL_ESTATE_MANAGER, USER } from "../../shared/constants/roles.constants";
import "../advertisements/components/AdCard.css";

import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { RadioIndicator } from "../../shared/components/RadioIndicator";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import { SearchInputBar } from "../../shared/ui/SearchBar";
import type { AdCardData } from "../advertisements/components/AdCard";
import { RouteLink } from "../../shared/navigation/RouteLink";
import { pushRoute } from "../../shared/navigation/navigation";
import {
  adManagementPaths,
  getAdCloseResultPath,
  getAdEditPath,
  getAdIncreaseVisitsPath,
  getAdPaymentHistoryPath,
  getAdPaymentPath,
  getAdPreviewPath,
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
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import LinearFactor from "../../shared/icons/LinearFactor";
import LinearPayment from "../../shared/icons/LinearPayment";
import LinearCall from "../../shared/icons/LinearCall";
import LinearChat from "../../shared/icons/LinearChat";
import LinearCancelCircle from "../../shared/icons/LinearCancelCircle";

type MyAdRouteState = {
  ad?: Record<string, unknown>;
  card?: AdCardData;
  status?: MyAdStatusKey | string;
  tab?: string;
  editReturnTo?: string;
  isEditMode?: boolean;
  returnTo?: string;
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

export function AccountMyAdStatePage() {
  const routeState = readRouteState();
  const adId = readAdIdFromPath() ?? readEntityId(routeState.ad) ?? readEntityId(routeState.card);
  const detailQuery = useMyAdvertisementDetailQuery(adId ?? null);
  const statusQuery = new URLSearchParams(window.location.search).get("status") ?? undefined;
  const sourceAd = detailQuery.data ?? routeState.ad;
  const card = detailQuery.data
    ? mapAdvertisementToAdCard(detailQuery.data, 0)
    : routeState.card ?? createUnavailableAdCard(adId, sourceAd);
  const statusInfo = getMyAdStatusInfo(
    detailQuery.data ?? statusQuery ?? routeState.status ?? routeState.ad ?? routeState.card?.status,
  );
  const cameFromAdManagement = Boolean(routeState.tab || routeState.returnTo);
  const backTo = getStateAdBackPath(routeState);
  const backState = cameFromAdManagement ? { tab: routeState.tab } : undefined;
  const activeRole = getActiveAuthRole(getStoredAuthSession());

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

  const isAssigned = Boolean(
    sourceAd?.assigned_agency_id ||
    sourceAd?.assignedAgencyId ||
    sourceAd?.assignment_id ||
    sourceAd?.assignmentId ||
    sourceAd?.agency_id,
  );

  if (detailQuery.isLoading && !detailQuery.data && !routeState.ad && !routeState.card) {
    return <MyAdStateSkeleton backState={backState} backTo={backTo} />;
  }

  if (activeRole === REAL_ESTATE_MANAGER) {
    return (
      <RealEstateManagerAdStatePage
        ad={sourceAd}
        adId={adId ?? String(card.id)}
        backState={backState}
        backTo={backTo}
        card={card}
        statusInfo={statusInfo}
      />
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
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={backState}
        backTo={backTo}
        className="[&_a]:text-on-surface"
        title="مدیریت آگهی"
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-surface-container">
        <section className="shrink-0 bg-surface-container-lowest px-4 pb-4 pt-4" aria-label={card.title}>
          <div className="flex justify-start">
            <Typography as="span" variant="label" size="medium" weight="medium" className={`inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium leading-5 ${statusInfo.badgeClassName}`}>
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
          {statusInfo.key === "wait_for_repost" ? (
            <WaitForRepostNotice
              ad={sourceAd}
              onRepost={() => setIsRepostChoiceModalOpen(true)}
            />
          ) : null}
          {statusInfo.key === "archived" ? (
            <ArchivedNotice
              ad={sourceAd}
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
          {statusInfo.key === "wait_for_deal_confirmation" ? (
            <WaitForDealConfirmationNotice
              ad={sourceAd}
              isPending={confirmDealResultMutation.isPending}
              onConfirm={async (confirmed: boolean) => {
                if (adId) {
                  await confirmDealResultMutation.mutateAsync({ advertiseId: adId, confirmed });
                  void detailQuery.refetch();
                }
              }}
            />
          ) : null}
          {statusInfo.key === "wait_for_payment" ? <WaitForPaymentNotice /> : null}
          {statusInfo.key === "pending" ? <PendingReviewNotice /> : null}
          {statusInfo.key === "needs_edit" ? (
            <NeedsEditNotice ad={sourceAd} card={card} returnTo={backTo} />
          ) : null}
        </section>

        <div className="h-2 shrink-0 bg-surface-container" aria-hidden="true" />

        <section className="min-h-[300px] flex-1 bg-surface-container-lowest" aria-label="عملیات آگهی">
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

      {isCancelAssignmentModalOpen ? (
        <CancelAssignmentModal
          isPending={cancelAssignmentMutation.isPending}
          onCancel={() => setIsCancelAssignmentModalOpen(false)}
          onConfirm={async () => {
            if (adId) {
              await cancelAssignmentMutation.mutateAsync({ advertiseId: adId });
              setIsCancelAssignmentModalOpen(false);
              void detailQuery.refetch();
            }
          }}
        />
      ) : null}

      {isRepostChoiceModalOpen ? (
        <RepostChoiceModal
          isOpen={isRepostChoiceModalOpen}
          isPersonalPending={republishPersonalMutation.isPending}
          onClose={() => setIsRepostChoiceModalOpen(false)}
          onSelectPersonal={async () => {
            const currentAdId = adId ?? String(card.id);
            if (!currentAdId) return;
            await republishPersonalMutation.mutateAsync(currentAdId);
            setIsRepostChoiceModalOpen(false);
            pushRoute(getAdPaymentPath(currentAdId));
          }}
          onSelectAgency={() => {
            setIsRepostChoiceModalOpen(false);
            setIsReassignAgencyModalOpen(true);
          }}
        />
      ) : null}

      {isReassignAgencyModalOpen ? (
        <AgencyReassignModal
          isPending={reassignAgencyMutation.isPending}
          isOpen={isReassignAgencyModalOpen}
          onClose={() => setIsReassignAgencyModalOpen(false)}
          onConfirm={async (agencyId) => {
            const currentAdId = adId ?? String(card.id);
            if (!currentAdId) return;
            await reassignAgencyMutation.mutateAsync({
              advertiseId: currentAdId,
              agencyId,
            });
            setIsReassignAgencyModalOpen(false);
            void detailQuery.refetch();
          }}
        />
      ) : null}

      {isStopPublishModalOpen ? (
        <StopPublishModal
          isPending={createStopRequestMutation.isPending}
          onClose={() => setIsStopPublishModalOpen(false)}
          onConfirm={async (reason: string) => {
            if (adId) {
              await createStopRequestMutation.mutateAsync({ advertiseId: adId, reason });
              setIsStopPublishModalOpen(false);
              void detailQuery.refetch();
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
  ad,
  adId,
  backState,
  backTo,
  card,
  statusInfo,
}: {
  ad?: Record<string, unknown>;
  adId: string;
  backState?: unknown;
  backTo: string;
  card: AdCardData;
  statusInfo: ReturnType<typeof getMyAdStatusInfo>;
}) {
  const agencyQuery = useMyAgencyProfileQuery();
  const consultantsQuery = useAgencyConsultantsQuery({ page: 1, perPage: 100 });
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
      options.push({
        id: `consultant:${consultant.userId}`,
        image: consultant.avatar,
        name: consultant.name || `مشاور شماره ${consultant.userId}`,
        type: "consultant",
      });
    }

    return options;
  }, [agencyQuery.data, consultantsQuery.data]);
  const changeConsultantMutation = useChangeAgencyAdvertiseConsultantMutation();
  const approveStopMutation = useApproveAgencyStopRequestMutation();
  const rejectStopMutation = useRejectAgencyStopRequestMutation();
  const rawConsultantId = ad?.assigned_consultant_id ?? ad?.assignedConsultantId ?? ad?.consultant_id ?? ad?.consultantId;
  const assignedConsultantId = typeof rawConsultantId === "object" ? readEntityId(rawConsultantId) : (rawConsultantId ? String(rawConsultantId) : undefined);
  const [publisherId, setPublisherId] = useState(() => {
    if (assignedConsultantId) return `consultant:${assignedConsultantId}`;
    return "";
  });
  const publisher = publisherOptions.find((option) => option.id === publisherId) ?? publisherOptions[0];
  const [isPublisherPickerOpen, setIsPublisherPickerOpen] = useState(false);

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={backState}
        backTo={backTo}
        className="[&_a]:text-on-surface"
        title="مدیریت آگهی"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container pb-4">
        <section className="bg-surface-container-lowest px-4 pb-4 pt-4" aria-label={card.title}>
          <div className="flex justify-start">
            <Typography as="span" variant="label" size="medium" weight="medium" className={`inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium leading-5 ${statusInfo.badgeClassName}`}>
              {statusInfo.label}
            </Typography>
          </div>

          <ManagerAdSummary ad={ad} card={card} />

          <PublishedMeta ad={ad} />

          {statusInfo.key === "wait_for_stop" ? (
            <div className="mt-4 rounded-2xl border border-warning bg-warning-container p-4 text-right">
              <div className="flex items-center gap-2 text-warning">
                <AlertIcon className="h-5 w-5 shrink-0" />
                <Typography as="h3" variant="title" size="small" weight="medium" className="m-0 text-sm font-medium leading-5">
                  درخواست توقف انتشار توسط آگهی‌دهنده
                </Typography>
              </div>
              <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs leading-5 text-on-surface">
                کاربر درخواست توقف انتشار این آگهی را ثبت کرده است.
              </Typography>
              {ad?.delete_reason && typeof ad.delete_reason === "object" && (ad.delete_reason as Record<string, unknown>).reason ? (
                <div className="mt-2 rounded-lg bg-surface p-2.5 text-xs font-medium text-on-surface border border-outline-var">
                  علت درخواست: {String((ad.delete_reason as Record<string, unknown>).reason)}
                </div>
              ) : null}
              <div className="mt-3 flex gap-2">
                <Button
                  unstyled
                  className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-primary text-xs font-medium text-on-primary active:opacity-90 disabled:opacity-50"
                  disabled={approveStopMutation.isPending}
                  onClick={async () => {
                    await approveStopMutation.mutateAsync(adId);
                    window.location.reload();
                  }}
                  type="button"
                >
                  {approveStopMutation.isPending ? "در حال ثبت..." : "موافقت با توقف انتشار"}
                </Button>
                <Button
                  unstyled
                  className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-error bg-surface text-xs font-medium text-error active:bg-error-container disabled:opacity-50"
                  disabled={rejectStopMutation.isPending}
                  onClick={async () => {
                    await rejectStopMutation.mutateAsync(adId);
                    window.location.reload();
                  }}
                  type="button"
                >
                  {rejectStopMutation.isPending ? "در حال ثبت..." : "رد درخواست توقف"}
                </Button>
              </div>
            </div>
          ) : null}

          {statusInfo.key === "wait_for_deal_confirmation" ? (
            <div className="mt-4 rounded-2xl border border-primary bg-primary-container/20 p-4 text-right">
              <div className="flex items-center gap-2 text-primary">
                <ClockIcon className="h-5 w-5 shrink-0" />
                <Typography as="h3" variant="title" size="small" weight="medium" className="m-0 text-sm font-medium leading-5">
                  در انتظار تایید معامله توسط مشتری
                </Typography>
              </div>
              <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs leading-5 text-on-surface">
                نتیجه معامله ثبت شده و پیام تایید برای مشتری ارسال شده است (مهلت پاسخ مشتری: ۳ روز).
              </Typography>
            </div>
          ) : null}
        </section>

        <div className="h-2 bg-surface-container" aria-hidden="true" />

        <section className="bg-surface-container-lowest px-4 pb-4 pt-4" aria-label="مسئول آگهی">
          <Typography as="h2" variant="label" size="large" weight="medium" className="m-0 text-on-surface">مسئول آگهی (مشاور مسئول)</Typography>
          <div className="mt-3">
            <div className="flex items-center bg-surface rounded-xl p-3 justify-end gap-3 [direction:rtl]">
              {publisher ? <PublisherAvatar publisher={publisher} size="small" /> : <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface-container text-outline"><LinearUserSolid className="h-6 w-6" /></div>}
              <div className="flex-1 flex gap-1 flex-col justify-center text-right">
                <Typography as="p" variant="body" size="large" weight="medium" className="m-0 text-on-surface-var">{publisher?.name ?? "مسئول آگهی مشخص نیست"}</Typography>
                <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-outline">
                  {publisher ? (publisher.type === "agency" ? "مدیریت آژانس" : "مشاور مسئول") : "—"}
                </Typography>
              </div>
            </div>

            <Button unstyled
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-1 rounded-lg border border-primary bg-surface-container-lowest text-sm font-medium text-primary active:bg-primary-container"
              onClick={() => setIsPublisherPickerOpen(true)}
              type="button"
            >
              تغییر مشاور مسئول
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
          </div>
        </section>

        <div className="h-2 bg-surface-container" aria-hidden="true" />

        <section className="min-h-[244px] bg-surface-container-lowest" aria-label="عملیات آگهی">
          <StateAdAction action={{ icon: "preview", label: "پیش‌نمایش", to: getAdPreviewPath(adId) }} ad={ad} card={card} deleteCompleteTo={backTo} returnTo={backTo} />
          <ActionDivider />
          <StateAdAction action={{ icon: "edit", label: "ویرایش", to: getAdEditPath(adId) }} ad={ad} card={card} deleteCompleteTo={backTo} returnTo={backTo} />
          <ActionDivider />
          <StateAdAction action={{ icon: "result", label: "ثبت نتیجه آگهی", to: getAdCloseResultPath(adId) }} ad={ad} card={card} deleteCompleteTo={backTo} returnTo={backTo} />
          <ActionDivider />
          <StateAdAction action={{ icon: "upgrade", label: "ارتقای آگهی", to: getAdIncreaseVisitsPath(adId) }} ad={ad} card={card} deleteCompleteTo={backTo} returnTo={backTo} />
          <ActionDivider />
          <StateAdAction action={{ icon: "history", label: "تاریخچه پرداخت", to: getAdPaymentHistoryPath(adId) }} ad={ad} card={card} deleteCompleteTo={backTo} returnTo={backTo} />
        </section>
      </main>

      {isPublisherPickerOpen ? (
        <ManagerPublisherPickerPage
          onClose={() => setIsPublisherPickerOpen(false)}
          onConfirm={async (nextPublisher) => {
            const nextConsultantId = nextPublisher.type === "consultant"
              ? nextPublisher.id.replace("consultant:", "")
              : null;
            try {
              await changeConsultantMutation.mutateAsync({
                advertiseId: adId,
                consultantId: nextConsultantId,
              });
              setPublisherId(nextPublisher.id);
            } catch {
              setPublisherId(nextPublisher.id);
            }
            setIsPublisherPickerOpen(false);
          }}
          options={publisherOptions}
          selectedPublisher={publisher}
        />
      ) : null}
    </PageFrame>
  );
}

function ManagerAdSummary({
  ad,
  card,
}: {
  ad?: Record<string, unknown>;
  card: AdCardData;
}) {
  const subtitle = readText(ad?.category ?? ad?.category_title ?? ad?.categoryTitle ?? ad?.category_name ?? ad?.categoryName) || "—";

  return (
    <div className="mt-4 flex h-[68px] items-center rounded-2xl bg-surface px-3 shadow-[0_2px_8px_rgba(26,26,26,0.04)] [direction:ltr]">
      <div className="min-w-0 flex-1 text-right [direction:rtl]">
        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 truncate text-xs font-normal leading-4 text-on-surface-var">{subtitle}</Typography>
        <Typography as="h2" variant="title" size="small" weight="medium" className="m-0 mt-1 truncate text-sm font-medium leading-5 text-on-surface">{card.title}</Typography>
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
  const draftPublisher = options.find((publisher) => publisher.id === draftPublisherId) ?? selectedPublisher;

  return (
    <section
      aria-label="تغییر منتشرکننده"
      aria-modal="true"
      className="fixed inset-y-0 left-1/2 z-[1200] flex w-full max-w-[500px] -translate-x-1/2 flex-col overflow-hidden bg-surface-container-lowest text-on-surface [direction:rtl]"
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

      <main className="min-h-0 flex-1 overflow-y-auto bg-surface-container-lowest px-4 pb-24 pt-3">
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
          {visiblePublishers.length === 0 ? <SearchEmptyState /> : visiblePublishers.map((publisher) => {
            const selected = draftPublisherId === publisher.id;

            return (
              <Button unstyled
                aria-checked={selected}
                className="flex w-full py-2 px-4 items-center justify-between gap-3 rounded-lg bg-surface-container-lowest text-right [direction:ltr] active:bg-surface-container"
                key={publisher.id}
                onClick={() => setDraftPublisherId(publisher.id)}
                role="radio"
                type="button"
              >
                <RadioIndicator checked={selected} />
                <Typography as="span" variant="body" size="medium" weight="regular" className="flex min-w-0 flex-1 items-center gap-3 [direction:rtl]">
                  <PublisherAvatar publisher={publisher} size="large" />
                  <Typography as="span" variant="body" size="medium" weight="regular" className="text-on-surface">{publisher.name}</Typography>
                </Typography>
              </Button>
            );
          })}
        </div>
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-surface-container-lowest px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <Button unstyled
          className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium leading-5 text-on-primary active:opacity-90"
          disabled={!draftPublisher}
          onClick={() => { if (draftPublisher) onConfirm(draftPublisher); }}
          type="button"
        >
          انتخاب
        </Button>
      </footer>
    </section>
  );
}

function getStateAdBackPath(routeState: MyAdRouteState) {
  const activeRole = getActiveAuthRole(getStoredAuthSession());
  const returnTo = normalizeLocalPath(routeState.returnTo);

  if (returnTo) return returnTo;
  if (activeRole === USER) return "/account/my-ads";

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

  return state as MyAdRouteState;
}

function readAdIdFromPath() {
  const match = window.location.pathname.match(/^\/account\/my-ads\/([^/]+)\/state-ad\/?$/);

  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

function StateAdSummary({
  ad,
  card,
}: {
  ad?: Record<string, unknown>;
  card: AdCardData;
}) {
  const subtitle = readText(ad?.category ?? ad?.category_title ?? ad?.categoryTitle ?? ad?.category_name ?? ad?.categoryName) || "—";

  return (
    <div className="mt-4 flex h-[80px] items-center gap-4 rounded-2xl border border-outline-var bg-surface px-3 [direction:ltr]">
      <div className="min-w-0 flex-1 text-right [direction:rtl]">
        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 truncate text-xs font-normal leading-5 text-outline">
          {subtitle}
        </Typography>
        <Typography as="h2" variant="title" size="small" weight="medium" className="m-0 mt-1 truncate text-sm font-medium leading-5 text-on-surface">
          {card.title}
        </Typography>
      </div>

      <div
        aria-hidden="true"
        className={`ad-card__image ${card.imageClassName} h-[52px] w-[86px] shrink-0 rounded-lg bg-cover bg-center`}
        style={card.imageUrl ? { backgroundImage: `url(${card.imageUrl})` } : undefined}
      />
    </div>
  );
}

function PublishedMeta({ ad }: { ad?: Record<string, unknown> }) {
  const published = readDateLike(ad?.published_time_ago ?? ad?.published_at ?? ad?.created_at);
  const expires = readExpirationRemaining(
    ad?.expire_date ?? ad?.expires_at ?? ad?.expiration_date ?? ad?.expired_at ?? ad?.expires_time_ago,
  );

  return (
    <div className="mt-4 text-sm font-medium leading-5">
      <MetaRow label="انتشار" value={published} />
      <div className="border-t border-dashed border-outline-var" aria-hidden="true" />
      <MetaRow label="انقضا" value={expires} />
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-12 items-center justify-between gap-4 [direction:ltr]">
      <Typography as="span" variant="body" size="medium" weight="regular" className="text-on-surface [direction:rtl]">{value}</Typography>
      <Typography as="span" variant="body" size="medium" weight="regular" className="text-outline [direction:rtl]">{label}</Typography>
    </div>
  );
}

function PendingReviewNotice() {
  return (
    <div className="mt-4 rounded-lg border border-warning bg-warning-container px-4 py-3 text-right">
      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 text-sm font-normal leading-7 text-on-surface">
        این آگهی در صف بررسی سامانه قرار دارد.
      </Typography>
      <Typography as="p" variant="body" size="medium" weight="regular">
        پس از تایید، آگهی به صورت خودکار منتشر می‌شود.
      </Typography>

      <div className="mt-3 border-t border-dashed border-outline-var pt-3">
        <div className="flex h-6 items-center justify-between gap-4 text-xs font-normal leading-4 [direction:ltr]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-on-surface [direction:rtl]">بین 1 تا 6 ساعت</Typography>
          <Typography as="span" variant="body" size="medium" weight="regular" className="inline-flex items-center gap-2 text-on-surface-var [direction:rtl]">
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
    <div className="mt-4 rounded-2xl border border-warning bg-warning-container p-4 text-right">
      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 text-sm font-normal leading-7 text-on-surface">
        برای انتشار مجدد آگهی، لطفا موارد زیر را اصلاح کنید.
      </Typography>

      <div className="mt-3 rounded-lg border border-warning bg-surface-container-lowest px-3 py-3">
        <div className="flex items-center justify-start gap-2 text-warning">
          <AlertIcon className="h-5 w-5 shrink-0" />
          <Typography as="h3" variant="title" size="small" weight="medium" className="m-0 text-sm font-medium leading-5">دلیل توقف انتشار</Typography>
        </div>

        <ul className="m-0 mt-2 list-disc space-y-2 pr-5 text-xs font-normal leading-6 text-on-surface marker:text-outline">
          {readModerationReasons(ad).map((reason) => <li key={reason}>{reason}</li>)}
        </ul>
      </div>

      <RouteLink
        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium leading-5 text-on-primary no-underline"
        state={{
          ad,
          card,
          editReturnTo: window.location.pathname,
          isEditMode: true,
          returnTo,
        }}
        to={getAdEditPath(card.id)}
      >
        ویرایش آگهی
        <StateIcon icon="edit" />
      </RouteLink>
    </div>
  );
}

function WaitForPaymentNotice() {
  return (
    <div className="mt-4 rounded-xl bg-warning-container px-3 py-3 text-sm leading-6 text-warning">
      برای ادامه فرایند انتشار آگهی، پرداخت را تکمیل کنید.
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
  const edit: StateAction = { icon: "edit", label: "ویرایش", to: getAdEditPath(adId) };
  const remove: StateAction = {
    icon: "delete",
    label: "حذف",
    to: `${adManagementPaths.delete}?adId=${encodeURIComponent(adId)}`,
  };
  const upgrade: StateAction = { icon: "upgrade", label: "ارتقای آگهی", to: getAdIncreaseVisitsPath(adId) };
  const stats: StateAction = { icon: "stats", label: "آمار بازدید", to: getAdVisitStatisticsPath(adId) };
  const history: StateAction = { icon: "history", label: "تاریخچه پرداخت", to: getAdPaymentHistoryPath(adId) };
  const payment: StateAction = { icon: "payment", label: "پرداخت", to: getAdPaymentPath(adId) };

  const rawPhone =
    ad?.agency_phone ??
    (ad?.assigned_consultant && typeof ad.assigned_consultant === "object" ? (ad.assigned_consultant as Record<string, unknown>).phone : undefined) ??
    ad?.consultant_phone ??
    (ad?.agency && typeof ad.agency === "object" ? (ad.agency as Record<string, unknown>).phone : undefined) ??
    ad?.phone;
  const contactPhone = readText(rawPhone);

  const callAgency: StateAction = {
    icon: "call",
    label: "تماس با مسئول آگهی",
    onClick: () => {
      if (contactPhone) {
        window.location.href = `tel:${contactPhone}`;
      } else {
        alert("شماره تماس مسئول آگهی در دسترس نیست.");
      }
    },
  };

  const chatAgency: StateAction = {
    icon: "chat",
    label: "چت با مسئول آگهی",
    onClick: () => {
      window.location.href = `/messages?adId=${encodeURIComponent(adId)}`;
    },
  };

  const stopPublish: StateAction = {
    icon: "stop_publish",
    label: "درخواست توقف انتشار",
    onClick: onStopPublish,
  };

  if (status === "published") {
    if (isAssigned) {
      return [preview, stopPublish, callAgency, chatAgency, history];
    }
    return [preview, edit, remove, upgrade, stats, history];
  }
  if (status === "wait_for_agency") return [preview, history];
  if (status === "wait_for_stop") return [preview, callAgency, chatAgency, history];
  if (status === "wait_for_deal_confirmation") return [preview, history];
  if (status === "wait_for_repost" || status === "rejected_by_agency") return [preview, remove, history];
  if (status === "archived") return [preview, remove];
  if (status === "wait_for_payment") return [preview, edit, payment, remove, history];
  if (status === "pending") return [preview, edit, remove, history];
  if (status === "needs_edit") return [edit, preview, history];
  if (status === "incomplete") return [edit, payment, remove];
  if (status === "expired" || status === "deleted" || status === "incomplete_deleted") return [preview, history];

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
      <ChevronLeftIcon className="h-6 w-6 text-on-surface-var" />
      <Typography as="span" variant="label" size="large" weight="medium" className="inline-flex gap-2 [direction:rtl]">
        <StateIcon icon={action.icon} />
        {action.label}
      </Typography>
    </>
  );

  if (action.onClick) {
    return (
      <Button
        unstyled
        className="flex h-14 w-full items-center justify-between px-4 text-on-surface-var active:bg-surface-container [direction:ltr]"
        onClick={action.onClick}
        type="button"
      >
        {content}
      </Button>
    );
  }

  if (action.to) {
    return (
      <RouteLink
        className="flex h-14 w-full items-center justify-between px-4 text-on-surface-var no-underline [direction:ltr]"
        state={{
          ad: action.icon === "upgrade" && !ad ? card : ad,
          card,
          deleteCompleteTo: action.icon === "delete" ? deleteCompleteTo : undefined,
          deleteReturnTo: action.icon === "delete" ? window.location.pathname : undefined,
          editReturnTo: window.location.pathname,
          isEditMode: action.icon === "edit" ? true : undefined,
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
      </RouteLink>
    );
  }

  return (
    <Button unstyled
      className="flex h-14 w-full items-center justify-between px-4 text-on-surface [direction:ltr]"
      type="button"
    >
      {content}
    </Button>
  );
}

function ActionDivider() {
  return (
    <div className="flex h-[5px] items-center px-4" aria-hidden="true">
      <div className="h-px w-full bg-outline-var" />
    </div>
  );
}

function StateIcon({ icon }: { icon: StateActionKey }) {
  if (icon === "preview") return <LinearPreview className="h-6 w-6"/>;
  if (icon === "edit") return <LinearEdit2 className="h-6 w-6"/>;
  if (icon === "delete") return <LinearDelete className="h-6 w-6"/>;
  if (icon === "upgrade") return <LinearChartUp className="h-6 w-6"/>;
  if (icon === "payment") return <LinearPayment className="h-6 w-6"/>;
  if (icon === "result") return <LinearFlag className="w-6 h-6"/>;
  if (icon === "stats") return <LinearAnalytics className="h-6 w-6"/>;
  if (icon === "call") return <LinearCall className="h-6 w-6"/>;
  if (icon === "chat") return <LinearChat className="h-6 w-6"/>;
  if (icon === "stop_publish") return <LinearCancelCircle className="h-6 w-6 text-error"/>;

  return <LinearFactor className="h-6 w-6"/>;
}

function WaitForAgencyNotice({
  ad,
  onCancelAssignment,
}: {
  ad?: Record<string, unknown>;
  onCancelAssignment: () => void;
}) {
  const agencyName = readText(ad?.assigned_agency_name ?? ad?.agency_name ?? (ad?.agency && typeof ad.agency === "object" ? (ad.agency as Record<string, unknown>).name : undefined)) || "آژانس املاک";
  const deadlineRemaining = readAgencyDeadlineRemaining(ad?.created_at ?? ad?.createdAt);

  return (
    <div className="mt-4 rounded-2xl border border-warning bg-warning-container/30 p-4 text-right">
      <div className="flex items-center gap-2 text-warning">
        <ClockIcon className="h-5 w-5 shrink-0" />
        <Typography as="h3" variant="title" size="small" weight="medium" className="m-0 text-sm font-medium leading-5">
          در انتظار بررسی و تایید {agencyName}
        </Typography>
      </div>

      <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs leading-5 text-on-surface-var">
        آگهی شما با موفقیت برای این آژانس ارسال شده است. مهلت بررسی آژانس حداکثر ۲۴ ساعت است. در صورت تمایل می‌توانید پیش از تایید آژانس، واگذاری را لغو کنید.
      </Typography>

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-outline-var pt-3 text-xs text-outline [direction:ltr]">
        <Typography as="span" variant="body" size="small" weight="medium" className="text-on-surface [direction:rtl]">
          {deadlineRemaining}
        </Typography>
        <span className="[direction:rtl]">مهلت باقی‌مانده تایید آژانس:</span>
      </div>

      <Button
        unstyled
        className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg border border-error bg-transparent text-xs font-medium text-error active:bg-error-container"
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
  onRepost,
}: {
  ad?: Record<string, unknown>;
  onRepost: () => void;
}) {
  const repostRemaining = readDeadlineRemaining(
    ad?.delete_reason && typeof ad.delete_reason === "object"
      ? (ad.delete_reason as Record<string, unknown>).repost_deadline
      : undefined,
    7,
    ad?.updated_at ?? ad?.updatedAt
  );

  return (
    <div className="mt-4 rounded-2xl border border-warning bg-warning-container p-4 text-right">
      <div className="flex items-center gap-2 text-warning">
        <AlertIcon className="h-5 w-5 shrink-0" />
        <Typography as="h3" variant="title" size="small" weight="medium" className="m-0 text-sm font-medium leading-5">
          در انتظار انتشار مجدد
        </Typography>
      </div>

      <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs leading-5 text-on-surface">
        واگذاری این آگهی لغو شده است. شما ۷ روز فرصت دارید تا این آگهی را به آژانس دیگری واگذار کنید یا با پرداخت هزینه، مستقیماً منتشر نمایید.
      </Typography>

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-outline-var pt-3 text-xs text-outline [direction:ltr]">
        <Typography as="span" variant="body" size="small" weight="medium" className="text-on-surface [direction:rtl]">
          {repostRemaining}
        </Typography>
        <span className="[direction:rtl]">مهلت انتشار مجدد:</span>
      </div>

      <Button
        unstyled
        className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary text-xs font-medium text-on-primary active:opacity-90"
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
  isPending,
  onRestore,
}: {
  ad?: Record<string, unknown>;
  isPending: boolean;
  onRestore: () => void;
}) {
  const archiveRemaining = readDeadlineRemaining(
    ad?.delete_reason && typeof ad.delete_reason === "object"
      ? (ad.delete_reason as Record<string, unknown>).archive_deadline
      : undefined,
    30,
    ad?.updated_at ?? ad?.updatedAt
  );

  return (
    <div className="mt-4 rounded-2xl border border-outline-var bg-surface p-4 text-right">
      <div className="flex items-center gap-2 text-outline">
        <ClockIcon className="h-5 w-5 shrink-0" />
        <Typography as="h3" variant="title" size="small" weight="medium" className="m-0 text-sm font-medium leading-5 text-on-surface">
          آگهی بایگانی شده
        </Typography>
      </div>

      <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs leading-5 text-on-surface-var">
        مهلت انتشار مجدد این آگهی به پایان رسیده و آگهی به بایگانی منتقل شده است. تا ۱ ماه می‌توانید آگهی را بازیابی کنید. پس از آن برای همیشه حذف خواهد شد.
      </Typography>

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-outline-var pt-3 text-xs text-outline [direction:ltr]">
        <Typography as="span" variant="body" size="small" weight="medium" className="text-on-surface [direction:rtl]">
          {archiveRemaining}
        </Typography>
        <span className="[direction:rtl]">مهلت بازیابی از بایگانی:</span>
      </div>

      <Button
        unstyled
        className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg border border-primary bg-surface-container-lowest text-xs font-medium text-primary active:bg-primary-container disabled:opacity-50"
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
  const reason = (ad?.delete_reason && typeof ad.delete_reason === "object"
    ? (ad.delete_reason as Record<string, unknown>).reason
    : undefined) ?? ad?.reject_reason ?? ad?.rejection_reason ?? "عدم توافق در شرایط انتشار";

  return (
    <div className="mt-4 rounded-2xl border border-error bg-error-container/30 p-4 text-right">
      <div className="flex items-center gap-2 text-error">
        <AlertIcon className="h-5 w-5 shrink-0" />
        <Typography as="h3" variant="title" size="small" weight="medium" className="m-0 text-sm font-medium leading-5">
          رد درخواست توسط آژانس
        </Typography>
      </div>

      <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs leading-5 text-on-surface">
        آژانس انتخابی درخواست واگذاری این آگهی را با دلیل زیر رد کرده است:
      </Typography>

      <div className="mt-2 rounded-lg bg-surface p-2.5 text-xs font-medium text-on-surface border border-outline-var">
        علت رد: {String(reason)}
      </div>

      <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs leading-5 text-on-surface-var">
        می‌توانید آگهی را به آژانس دیگری واگذار نمایید یا مستقیماً به عنوان آگهی شخصی منتشر کنید.
      </Typography>

      <Button
        unstyled
        className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary text-xs font-medium text-on-primary active:opacity-90"
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
    <div className="mt-4 rounded-2xl border border-warning bg-warning-container p-4 text-right">
      <div className="flex items-center gap-2 text-warning">
        <ClockIcon className="h-5 w-5 shrink-0" />
        <Typography as="h3" variant="title" size="small" weight="medium" className="m-0 text-sm font-medium leading-5">
          در انتظار تایید توقف انتشار
        </Typography>
      </div>

      <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs leading-5 text-on-surface">
        درخواست توقف انتشار این آگهی برای آژانس ارسال شده و آگهی پس از بررسی آژانس از حالت انتشار خارج خواهد شد.
      </Typography>

      <Button
        unstyled
        className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg border border-outline-var bg-surface text-xs font-medium text-on-surface active:bg-surface-container disabled:opacity-50"
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
  isPending,
  onConfirm,
}: {
  ad?: Record<string, unknown>;
  isPending: boolean;
  onConfirm: (confirmed: boolean) => void;
}) {
  return (
    <div className="mt-4 rounded-2xl border-2 border-primary bg-primary-container/20 p-4 text-right shadow-sm">
      <div className="flex items-center gap-2 text-primary">
        <LinearFlag className="h-5 w-5 shrink-0" />
        <Typography as="h3" variant="title" size="small" weight="semibold" className="m-0 text-sm leading-5">
          آیا معامله این ملک با موفقیت انجام شد؟
        </Typography>
      </div>

      <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs leading-5 text-on-surface">
        آژانس وضعیت این آگهی را «معامله انجام شده» ثبت کرده است. لطفا جهت تایید نهایی و پایان فرایند، نتیجه را مشخص نمایید (مهلت پاسخ: ۳ روز).
      </Typography>

      <div className="mt-4 flex gap-2">
        <Button
          unstyled
          className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-on-primary active:opacity-90 disabled:opacity-50"
          disabled={isPending}
          onClick={() => onConfirm(true)}
          type="button"
        >
          بله، معامله انجام شد
        </Button>
        <Button
          unstyled
          className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-error bg-surface text-xs font-semibold text-error active:bg-error-container disabled:opacity-50"
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

function CancelAssignmentModal({
  isPending,
  onCancel,
  onConfirm,
}: {
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 p-4 [direction:rtl]"
      role="dialog"
    >
      <div className="w-full max-w-sm rounded-2xl bg-surface p-5 text-right shadow-xl">
        <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 text-base text-on-surface">
          لغو واگذاری به آژانس
        </Typography>
        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-3 text-xs leading-6 text-on-surface-var">
          آیا از لغو واگذاری این آگهی به آژانس اطمینان دارید؟ پس از لغو، ۷ روز مهلت خواهید داشت تا آن را به آژانس دیگری واگذار کنید یا مستقیماً منتشر نمایید.
        </Typography>

        <div className="mt-5 flex gap-2">
          <Button
            unstyled
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-error text-xs font-medium text-white active:opacity-90 disabled:opacity-50"
            disabled={isPending}
            onClick={onConfirm}
            type="button"
          >
            {isPending ? "در حال لغو..." : "بله، لغو واگذاری"}
          </Button>
          <Button
            unstyled
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-outline-var bg-surface text-xs font-medium text-on-surface active:bg-surface-container"
            disabled={isPending}
            onClick={onCancel}
            type="button"
          >
            انصراف
          </Button>
        </div>
      </div>
    </div>
  );
}

function RepostChoiceModal({
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
  if (!isOpen) return null;

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 [direction:rtl]"
      role="dialog"
    >
      <div className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-surface p-5 text-right shadow-xl">
        <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 text-base text-on-surface">
          انتخاب روش انتشار مجدد
        </Typography>
        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs leading-5 text-on-surface-var">
          تمایل دارید همین آگهی را به چه صورت مجدداً فعال و منتشر نمایید؟ تمامی مشخصات ثبت‌شده ملک حفظ می‌شود.
        </Typography>

        <div className="mt-4 space-y-2.5">
          <Button
            unstyled
            disabled={isPersonalPending}
            onClick={onSelectPersonal}
            className="flex h-12 w-full items-center justify-between rounded-xl border border-outline-var bg-surface px-4 text-xs font-medium text-on-surface disabled:opacity-50 active:bg-surface-container"
            type="button"
          >
            <span>{isPersonalPending ? "در حال انتقال به پرداخت..." : "انتشار شخصی و مستقیم (پرداخت آنلاین)"}</span>
            <ChevronLeftIcon className="h-5 w-5 text-outline" />
          </Button>

          <Button
            unstyled
            disabled={isPersonalPending}
            onClick={onSelectAgency}
            className="flex h-12 w-full items-center justify-between rounded-xl border border-outline-var bg-surface px-4 text-xs font-medium text-on-surface disabled:opacity-50 active:bg-surface-container"
            type="button"
          >
            <span>ارسال و واگذاری به آژانس املاک دیگر</span>
            <ChevronLeftIcon className="h-5 w-5 text-outline" />
          </Button>
        </div>

        <Button
          unstyled
          className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg border border-outline-var bg-transparent text-xs font-medium text-outline active:bg-surface-container"
          onClick={onClose}
          type="button"
        >
          انصراف
        </Button>
      </div>
    </div>
  );
}

function AgencyReassignModal({
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

  if (!isOpen) return null;

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[1250] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 [direction:rtl]"
      role="dialog"
    >
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-t-2xl sm:rounded-2xl bg-surface-container-lowest text-right shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-outline-var/30 px-4 py-3.5 bg-surface">
          <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 text-sm font-semibold text-on-surface">
            انتخاب آژانس املاک جدید
          </Typography>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-outline hover:bg-surface-container active:bg-surface-container"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="p-4 pb-2 bg-surface">
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

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 min-h-[200px]">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center text-xs text-outline">
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
                  className={`flex w-full items-center justify-between gap-3 rounded-xl p-3 text-right transition-colors border ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-outline-var/40 bg-surface hover:bg-surface-container"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary overflow-hidden">
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
                      <Typography as="p" variant="body" size="small" weight="medium" className="m-0 truncate text-xs text-on-surface">
                        {agency.name}
                      </Typography>
                      {agency.address && (
                        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-0.5 truncate text-[11px] text-on-surface-var">
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

        <div className="border-t border-outline-var/30 p-4 bg-surface">
          <Button
            unstyled
            disabled={!selectedAgencyId || isPending}
            onClick={() => {
              if (selectedAgencyId) onConfirm(selectedAgencyId);
            }}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary text-xs font-semibold text-on-primary disabled:opacity-40 active:opacity-90"
            type="button"
          >
            {isPending ? "در حال واگذاری..." : "تأیید و واگذاری به این آژانس"}
          </Button>
        </div>
      </div>
    </div>
  );
}


const STOP_PUBLISH_REASONS = [
  "معامله انجام شده",
  "دیگر تمایلی به انتشار ندارم",
  "سایر دلایل",
] as const;

function StopPublishModal({
  isPending,
  onClose,
  onConfirm,
}: {
  isPending: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [selectedReason, setSelectedReason] = useState<string>(STOP_PUBLISH_REASONS[0]);
  const [customReason, setCustomReason] = useState("");

  const handleSubmit = () => {
    const finalReason = selectedReason === "سایر دلایل" && customReason.trim()
      ? customReason.trim()
      : selectedReason;
    onConfirm(finalReason);
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 [direction:rtl]"
      role="dialog"
    >
      <div className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-surface p-5 text-right shadow-xl">
        <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 text-base text-on-surface">
          درخواست توقف انتشار
        </Typography>
        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs leading-5 text-on-surface-var">
          لطفا دلیل درخواست توقف انتشار را انتخاب کنید:
        </Typography>

        <div className="mt-4 space-y-2">
          {STOP_PUBLISH_REASONS.map((reason) => (
            <label
              key={reason}
              className="flex items-center justify-between rounded-xl border border-outline-var p-3 cursor-pointer hover:bg-surface-container"
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="stopReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="accent-primary h-4 w-4"
                />
                <span className="text-xs font-medium text-on-surface">{reason}</span>
              </div>
            </label>
          ))}
        </div>

        {selectedReason === "سایر دلایل" ? (
          <textarea
            className="mt-3 w-full rounded-xl border border-outline-var bg-surface p-3 text-xs text-on-surface focus:outline-primary"
            placeholder="توضیح کوتاه دلیل توقف..."
            rows={2}
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        ) : null}

        <div className="mt-5 flex gap-2">
          <Button
            unstyled
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-primary text-xs font-medium text-on-primary active:opacity-90 disabled:opacity-50"
            disabled={isPending}
            onClick={handleSubmit}
            type="button"
          >
            {isPending ? "در حال ثبت..." : "ثبت درخواست"}
          </Button>
          <Button
            unstyled
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-outline-var bg-surface text-xs font-medium text-on-surface active:bg-surface-container"
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

function readAgencyDeadlineRemaining(createdAt: unknown) {
  if (typeof createdAt !== "string" || !createdAt.trim()) return "۲۴ ساعت";
  const start = Date.parse(createdAt);
  if (!Number.isFinite(start)) return "۲۴ ساعت";
  const deadline = start + 24 * 60 * 60 * 1000;
  const diff = deadline - Date.now();
  if (diff <= 0) return "منقضی شده";
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
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
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m14 7-5 5 5 5" />
    </svg>
  );
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function AlertIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="M10.35 4.4 2.8 17.5A2 2 0 0 0 4.55 20.5h14.9a2 2 0 0 0 1.75-3L13.65 4.4a1.9 1.9 0 0 0-3.3 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function PublisherAvatar({ publisher, size }: { publisher: ManagerPublisher; size: "large" | "small" }) {
  const sizeClass = size === "large" ? "h-14 w-14" : "h-12 w-12";
  const radiusClass = publisher.type === "agency" ? "rounded-lg" : "rounded-full";

  if (publisher.image) {
    return <img alt="" className={`${sizeClass} shrink-0 object-cover ${radiusClass}`} draggable={false} src={publisher.image} />;
  }

  return (
    <div className={`grid ${sizeClass} shrink-0 place-items-center bg-surface-container text-outline ${radiusClass}`}>
      {publisher.type === "agency" ? <LinearBuilding2 className="h-6 w-6" /> : <LinearUserSolid className="h-6 w-6" />}
    </div>
  );
}

function createUnavailableAdCard(adId: string | undefined, ad?: Record<string, unknown>): AdCardData {
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

function readDateLike(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return "—";
  const raw = value.trim();
  const timestamp = Date.parse(raw);
  if (!Number.isFinite(timestamp)) return raw;
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(timestamp));
}

function readExpirationRemaining(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return "—";

  const raw = value.trim();
  const timestamp = Date.parse(raw);
  if (!Number.isFinite(timestamp)) return raw;

  const expirationDate = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(timestamp));
  const remainingMilliseconds = timestamp - Date.now();

  if (remainingMilliseconds < 0) return `${expirationDate} (منقضی شده)`;

  const remainingDays = Math.ceil(remainingMilliseconds / 86_400_000);
  const remainingLabel = remainingDays === 0
    ? "امروز"
    : `${toPersianDigits(remainingDays)} روز دیگر`;

  return `${expirationDate} (${remainingLabel})`;
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
    .flatMap((value) => Array.isArray(value) ? value : [value])
    .map((value) => readText(value))
    .filter(Boolean);
  return reasons.length > 0 ? Array.from(new Set(reasons)) : ["جزئیات اصلاح از سرور دریافت نشده است."];
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
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={backState}
        backTo={backTo}
        className="[&_a]:text-on-surface"
        title="مدیریت آگهی"
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-surface-container">
        <section className="shrink-0 space-y-3 bg-surface-container-lowest px-4 pb-4 pt-4" aria-label="در حال بارگذاری وضعیت آگهی">
          <div className="h-8 w-24 rounded-lg animate-skeleton" />
          <div className="flex gap-3 [direction:rtl]">
            <div className="h-[90px] w-[120px] shrink-0 rounded-xl animate-skeleton" />
            <div className="min-w-0 flex-1 space-y-2.5">
              <div className="h-5 w-3/4 rounded-md animate-skeleton" />
              <div className="h-4 w-1/2 rounded-md animate-skeleton" />
              <div className="h-4 w-2/3 rounded-md animate-skeleton" />
            </div>
          </div>
          <div className="flex justify-between border-t border-outline-var pt-2">
            <div className="h-4 w-28 rounded-md animate-skeleton" />
            <div className="h-4 w-20 rounded-md animate-skeleton" />
          </div>
        </section>

        <div className="h-2 shrink-0 bg-surface-container" aria-hidden="true" />

        <section className="min-h-[300px] flex-1 space-y-6 bg-surface-container-lowest p-4" aria-label="در حال بارگذاری عملیات آگهی">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-md animate-skeleton" />
                <div className="h-4 w-28 rounded-md animate-skeleton" />
              </div>
              <div className="h-4 w-4 rounded-md animate-skeleton" />
            </div>
          ))}
        </section>
      </main>
    </PageFrame>
  );
}
