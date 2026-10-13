import { Link, useNavigate } from "react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import "../advertisements/components/AdCard.css";

import { PageFrame } from "../../shared/layout/PageFrame";
import { useActiveAuthRole } from "../../shared/auth/use-active-auth-role";
import { getApiErrorMessage, isForbiddenApiError } from "../../shared/api/api";
import { useToast } from "../../shared/hooks/useToast";
import { DeleteAdBottomSheet } from "./components/DeleteAdBottomSheet";
import { AccessDeniedState } from "../../shared/components/ErrorState";
import LinearArrowLeft2 from "../../shared/icons/LinearArrowLeft2";
import LinearFilterHorizontal from "../../shared/icons/LinearFilterHorizontal";
import { SwitchButton } from "../../shared/components/SwitchButton";
import { TopBar } from "../../shared/components/TopBar";
import { useAgencyAdvertiseAssignmentsInfiniteQuery } from "../advertisements/api/agency-advertise-assignment.hooks";
import { useDeleteAdvertisementMutation } from "../advertisements/api/advertisement.hooks";
import { useMyAdsInfiniteQuery } from "./api/account.hooks";
import type { AgencyAdvertiseAssignmentDto } from "../advertisements/api/agency-advertise-assignment.service";
import {
  getAdvertisementPublisherName,
  mapAdvertisementToAdCard,
  readFeatureValue,
} from "../advertisements/api/advertisement.service";
import {
  hasTour3d,
  readVideoUrl,
} from "../advertisements/view/viewAdDetails";
import { SearchIcon } from "./adManagement/AdManagementIcons";
import { ConsultantAdCard } from "./adManagement/ConsultantAdCard";
import { AdCardSkeleton } from "../advertisements/components/AdCardSkeleton";
import {
  adManagementPaths,
  adManagementPropertyTypeLabels,
  getAdManagementRouteState,
  getAllocationReviewPath,
  getAdEditPath,
  getAdStatePath,
  type AdManagementFilters,
  type AdManagementPropertyType,
  type AdsTab,
  type ConsultantAd,
} from "./adManagement/adManagementData";
import {
  AdCardAlbumIcon,
} from "../advertisements/components/AdCardIcons";
import { AdCardBody } from "../advertisements/components/AdCard";
import LinearVideo from "../../shared/icons/LinearVideo";
import Linear3d from "../../shared/icons/Linear3d";
import LinearUserSolid from "../../shared/icons/LinearUserSolid";
import LinearImage from "../../shared/icons/LinearImage";
import LinearClock from "../../shared/icons/LinearClock";
import LinearCancelCircle from "../../shared/icons/LinearCancelCircle";
import { useDebouncedValue } from "../../shared/hooks/useDebouncedValue";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import { getMyAdStatusInfo } from "./myAdsStatus";
import { AccountMyAdsEmptyState } from "./accountPageViews";
import { INDEPENDENT_CONSULTANT, REAL_ESTATE_CONSULTANT, REAL_ESTATE_MANAGER } from "../../shared/constants/roles.constants";

const assignmentPageSize = 20;
const loadMoreRemainingCount = 10;

const emptyFilters: AdManagementFilters = {
  neighborhoods: [],
};

type AssignmentCountdown = {
  hours: number;
  minutes: number;
  isExpired: boolean;
};

function isAssignedTab(tab: AdsTab) {
  return tab === "status";
}

function getScopedFilters(filters: AdManagementFilters, tab: AdsTab): AdManagementFilters {
  if (!isAssignedTab(tab)) return filters;

  return {
    neighborhoods: filters.neighborhoods,
    propertyType: filters.propertyType,
    propertyTypes: filters.propertyTypes,
    transaction: filters.transaction,
  };
}

function hasActiveFilters(filters: AdManagementFilters, tab: AdsTab) {
  if (isAssignedTab(tab)) {
    return Boolean(
      filters.neighborhoods.length ||
        filters.propertyType ||
        filters.propertyTypes?.length ||
        filters.transaction,
    );
  }

  return Boolean(
    filters.neighborhoods.length ||
      filters.propertyType ||
      filters.propertyTypes?.length ||
      filters.publisher ||
      filters.status ||
      filters.transaction,
  );
}

function getTransactionLabel(transaction?: AdManagementFilters["transaction"]) {
  if (transaction === "sale") return "فروش";
  if (transaction === "rent") return "اجاره";
  if (transaction === "project") return "پروژه";

  return "";
}

function matchesTransaction(adTitle: string, filters: AdManagementFilters) {
  if (!filters.transaction) return true;

  if (filters.transaction === "rent") return adTitle.includes("اجاره");
  if (filters.transaction === "sale") return adTitle.includes("فروش") || !adTitle.includes("اجاره");

  return adTitle.includes("پروژه");
}

function matchesSinglePropertyType(adTitle: string, propertyType: AdManagementPropertyType) {
  if (propertyType === "apartment" || propertyType === "daily-apartment-suite") {
    return adTitle.includes("آپارتمان") || adTitle.includes("سوئیت") || adTitle.includes("سوییت");
  }

  if (propertyType === "garden-villa" || propertyType === "daily-garden-villa") {
    return adTitle.includes("باغ") || adTitle.includes("ویلا");
  }

  if (propertyType === "villa-house") {
    return adTitle.includes("خانه") || adTitle.includes("ویلایی");
  }

  if (propertyType === "land") return adTitle.includes("زمین");
  if (propertyType === "office" || propertyType === "daily-workspace") return adTitle.includes("اداری") || adTitle.includes("دفتر") || adTitle.includes("مطب");
  if (propertyType === "commercial-unit") return adTitle.includes("تجاری") || adTitle.includes("مغازه");
  if (propertyType === "warehouse") return adTitle.includes("انبار") || adTitle.includes("سوله");
  if (propertyType === "hotel-apartment" || propertyType === "daily-hotel-apartment") return adTitle.includes("هتل") || adTitle.includes("اقامتگاه");
  if (propertyType === "factory-workshop") return adTitle.includes("کارخانه") || adTitle.includes("کارگاه");

  return adTitle.includes("پروژه") || adTitle.includes("مشارکت") || adTitle.includes("پیش فروش");
}

function matchesPropertyType(
  adTitle: string,
  propertyTypes?: AdManagementPropertyType[],
  legacyPropertyType?: AdManagementPropertyType,
) {
  const selectedPropertyTypes =
    propertyTypes?.length ? propertyTypes : legacyPropertyType ? [legacyPropertyType] : [];

  if (!selectedPropertyTypes.length) return true;

  return selectedPropertyTypes.some((propertyType) =>
    matchesSinglePropertyType(adTitle, propertyType),
  );
}

function getFilterPropertyTypes(filters: AdManagementFilters) {
  return filters.propertyTypes?.length
    ? filters.propertyTypes
    : filters.propertyType
      ? [filters.propertyType]
      : [];
}

function matchesStatusFilter(statusLabel: string, statusKey?: string, filterStatus?: string) {
  if (!filterStatus) return true;
  if (filterStatus === "در انتظار") {
    return (
      statusKey === "pending" ||
      statusKey === "wait_for_payment" ||
      statusKey === "wait_for_agency" ||
      statusKey === "wait_for_repost" ||
      statusKey === "wait_for_stop" ||
      statusKey === "wait_for_deal_confirmation" ||
      statusLabel.includes("انتظار")
    );
  }
  if (filterStatus === "فعال") {
    return (
      statusKey === "published" ||
      statusKey === "deal_success" ||
      statusLabel === "فعال" ||
      statusLabel === "منتشر شده" ||
      statusLabel === "معامله موفق"
    );
  }
  if (filterStatus === "غیر فعال") {
    return (
      statusKey === "expired" ||
      statusKey === "deleted" ||
      statusKey === "deal_unsuccessful" ||
      statusKey === "rejected_by_agency" ||
      statusKey === "archived" ||
      statusKey === "incomplete_deleted" ||
      statusLabel.includes("غیر") ||
      statusLabel.includes("منقض") ||
      statusLabel.includes("حذف") ||
      statusLabel.includes("رد") ||
      statusLabel.includes("بایگانی")
    );
  }
  if (filterStatus === "نیمه کاره") {
    return statusKey === "incomplete" || statusLabel.includes("نیمه");
  }
  return statusLabel === filterStatus;
}

function matchesAdFilters(
  ad: ConsultantAd & { publisher?: string },
  filters: AdManagementFilters,
  assignedTab: boolean,
  statusKey?: string,
) {
  const matchesStatus = assignedTab
    ? true
    : matchesStatusFilter(ad.status, statusKey, filters.status);
  const matchesNeighborhood = filters.neighborhoods.length
    ? filters.neighborhoods.some((neighborhood) =>
        ad.timeAndLocation.includes(neighborhood.name),
      )
    : true;
  const matchesPublisher = assignedTab ? true : filters.publisher ? ad.publisher === filters.publisher : true;
  const matchesType = matchesPropertyType(
    ad.title,
    filters.propertyTypes,
    filters.propertyType,
  );

  return (
    matchesStatus &&
    matchesNeighborhood &&
    matchesPublisher &&
    matchesTransaction(ad.title, filters) &&
    matchesType
  );
}

function mapAssignmentToAd(
  assignment: AgencyAdvertiseAssignmentDto,
  index: number,
): ConsultantAd {
  if (assignment.advertise) {
    return {
      ...mapAdvertisementToAdCard(assignment.advertise, index),
      id: assignment.advertiseId,
      status: "در انتظار انتشار",
    };
  }

  return {
    agency: "",
    area: "-",
    badges: [],
    id: assignment.advertiseId,
    imageClassName: `ad-card__image--${(index % 4) + 1}`,
    imageCount: "0",
    priceLabelPrimary: "",
    priceLabelSecondary: "",
    pricePrimary: "توافقی",
    priceSecondary: "",
    rooms: "-",
    status: "در انتظار انتشار",
    timeAndLocation: "",
    title: `آگهی شماره ${toPersianDigits(assignment.advertiseId)}`,
    year: "-",
  };
}

function getAssignmentCountdown(assignment: AgencyAdvertiseAssignmentDto): AssignmentCountdown {
  let targetTime: number | null = null;

  if (assignment.expiresAt) {
    const t = Date.parse(assignment.expiresAt);
    if (Number.isFinite(t)) targetTime = t;
  }

  if (!targetTime) {
    const startCandidate =
      assignment.createdAt ||
      (assignment.metadata?.created_at as string) ||
      (assignment.metadata?.assigned_at as string) ||
      (assignment.advertise?.updated_at as string) ||
      (assignment.advertise?.created_at as string);
    if (startCandidate) {
      const t = Date.parse(startCandidate);
      if (Number.isFinite(t)) targetTime = t + 24 * 60 * 60 * 1000;
    }
  }

  if (!targetTime) {
    targetTime = Date.now() + 24 * 60 * 60 * 1000;
  }

  const diff = targetTime - Date.now();
  if (diff <= 0) {
    return { hours: 0, minutes: 0, isExpired: true };
  }

  const remainingMinutes = Math.ceil(diff / 60_000);
  return {
    hours: Math.floor(remainingMinutes / 60),
    minutes: remainingMinutes % 60,
    isExpired: false,
  };
}

export function IndependentConsultantAdManagementPage() {
  const navigate = useNavigate();
  const routeState = getAdManagementRouteState();
  const activeRole = useActiveAuthRole();
  const canAccessAssignments = activeRole !== INDEPENDENT_CONSULTANT;
  const [activeTab, setActiveTab] = useState<AdsTab>(() =>
    canAccessAssignments ? (routeState.tab ?? "active") : "active",
  );
  const [showMineOnly, setShowMineOnly] = useState(routeState.onlyMine ?? false);
  const [filters] = useState<AdManagementFilters>(routeState.filters ?? emptyFilters);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery.trim(), 300);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const assignedTab = isAssignedTab(activeTab);
  const scopedFilters = getScopedFilters(filters, activeTab);
  const hasFilters = hasActiveFilters(scopedFilters, activeTab);
  const assignmentsQuery = useAgencyAdvertiseAssignmentsInfiniteQuery({
    enabled: canAccessAssignments && assignedTab,
    perPage: assignmentPageSize,
    status: "pending",
  });
  const adsQuery = useMyAdsInfiniteQuery({
    isMine: showMineOnly ? true : undefined,
    perPage: assignmentPageSize,
    search: isSearching && debouncedSearchQuery ? debouncedSearchQuery : undefined,
  });
  const [deletingAdId, setDeletingAdId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();
  const deleteMutation = useDeleteAdvertisementMutation();

  const handleOpenDelete = (targetAdId: string, event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    setDeletingAdId(targetAdId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAdId) return;
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync({
        advertiseId: deletingAdId,
        deleteReasonId: "other",
        description: "حذف آگهی نیمه کاره",
      });
      showToast("آگهی با موفقیت حذف شد.", undefined, "success");
      setDeletingAdId(null);
    } catch (err) {
      showToast(getApiErrorMessage(err, "حذف آگهی با خطا مواجه شد."), "خطا", "error");
    } finally {
      setIsDeleting(false);
    }
  };
  const assignmentItems = useMemo(
    () => assignmentsQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [assignmentsQuery.data],
  );
  const assignedAdvertisements = useMemo(
    () =>
      assignmentItems
        .map((assignment, index) => ({
          ad: mapAssignmentToAd(assignment, index),
          assignment,
        }))
        .filter(({ ad }) => matchesAdFilters(ad, scopedFilters, true))
        .filter(({ ad }) => {
          if (!isSearching || !debouncedSearchQuery) return true;
          const q = debouncedSearchQuery.toLowerCase();
          return Boolean(ad.title && ad.title.toLowerCase().includes(q));
        }),
    [assignmentItems, scopedFilters, isSearching, debouncedSearchQuery],
  );
  const activeAdvertisements = useMemo(
    () =>
      (adsQuery.data?.pages ?? [])
        .flatMap((page) => page.data)
        .map((sourceAd, index) => {
          const statusInfo = getMyAdStatusInfo(sourceAd);
          const card = {
            ...mapAdvertisementToAdCard(sourceAd, index),
            publisher: getAdvertisementPublisherName(sourceAd),
            status: statusInfo.label,
          };

          return { card, sourceAd, statusInfo };
        })
        .filter(({ card, statusInfo }) =>
          matchesAdFilters(card, scopedFilters, false, statusInfo.key),
        ),
    [adsQuery.data, scopedFilters],
  );
  const visibleCount = assignedTab ? assignedAdvertisements.length : activeAdvertisements.length;
  const preloadIndex = Math.max(visibleCount - loadMoreRemainingCount - 1, 0);
  const filterLabel = hasFilters ? "فیلترها" : "فیلتر";

  const loadMoreRef = (node: HTMLElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;

    const targetQuery = assignedTab ? assignmentsQuery : adsQuery;
    if (!node || !targetQuery.hasNextPage || targetQuery.isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        void targetQuery.fetchNextPage();
      },
      { rootMargin: "160px 0px" },
    );
    observer.observe(node);
    observerRef.current = observer;
  };

  useEffect(() => () => observerRef.current?.disconnect(), []);

  useEffect(() => {
    if (adsQuery.isError && isForbiddenApiError(adsQuery.error)) {
      navigate("/403", { replace: true });
    }
  }, [adsQuery.isError, adsQuery.error]);

  useEffect(() => {
    if (assignedTab && assignmentsQuery.isError && isForbiddenApiError(assignmentsQuery.error)) {
      navigate("/403", { replace: true });
    }
  }, [assignedTab, assignmentsQuery.isError, assignmentsQuery.error]);

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={isSearching ? undefined : "/account"}
        onBack={
          isSearching
            ? () => {
                setIsSearching(false);
                setSearchQuery("");
              }
            : undefined
        }
        centerClassName="px-0"
        centerSlot={
          isSearching ? (
            <div className="flex h-10 w-full items-center rounded-xl border border-outline bg-surface-container-lowest px-3 [direction:rtl]">
              <input
                autoFocus
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-sm font-normal text-on-surface outline-none placeholder:text-outline"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در آگهی‌ها..."
                type="search"
                value={searchQuery}
              />
              {searchQuery ? (
                <Button unstyled
                  aria-label="پاک کردن"
                  className="grid h-6 w-6 shrink-0 place-items-center text-outline"
                  onClick={() => setSearchQuery("")}
                  type="button"
                >
                  <LinearCancelCircle className="h-5 w-5" />
                </Button>
              ) : null}
            </div>
          ) : (
            <Typography as="h1" variant="title" size="medium" weight="semibold" className="m-0 truncate text-right text-base font-semibold leading-6 text-on-surface">
              مدیریت آگهی‌ها
            </Typography>
          )
        }
        className="bg-surface-container"
        startSlot={
          isSearching ? undefined : (
            <Button unstyled
              aria-label="جستجو"
              className="grid h-12 w-12 place-items-center rounded-full text-on-surface focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-primary/40"
              onClick={() => setIsSearching(true)}
              type="button"
            >
              <SearchIcon className="h-6 w-6" />
            </Button>
          )
        }
      />

      {canAccessAssignments ? (
        <section className="shrink-0 bg-surface-container px-4 py-2" aria-label="بخش‌های مدیریت آگهی">
          <div className="grid h-10 grid-cols-2 overflow-hidden rounded-xl border border-outline bg-surface-container-lowest [direction:rtl]">
            <Button unstyled
              aria-current={activeTab === "active" ? "page" : undefined}
              className={`text-base font-medium leading-6 [direction:rtl] ${
                activeTab === "active" ? "bg-primary-container text-primary font-semibold" : "text-on-surface-var"
              }`}
              onClick={() => setActiveTab("active")}
              type="button"
            >
              آگهی‌ها
            </Button>
            <Button unstyled
              aria-current={activeTab === "status" ? "page" : undefined}
              className={`text-base font-medium leading-6 [direction:rtl] ${
                activeTab === "status" ? "bg-primary-container text-primary font-semibold" : "text-on-surface-var"
              }`}
              onClick={() => setActiveTab("status")}
              type="button"
            >
              تخصیصی‌ها
            </Button>
          </div>
        </section>
      ) : null}

      <section
        aria-label="فیلترهای مدیریت آگهی"
        className={`flex h-14 shrink-0 items-center bg-surface-container-lowest px-4 [direction:ltr] ${
          assignedTab ? "justify-end" : "justify-between"
        }`}
      >
        {!assignedTab ? (
          <div className="flex items-center gap-2 [direction:rtl]">
            <Typography as="span" variant="body" size="medium" weight="regular" className="h-6 w-px bg-outline-var" aria-hidden="true" />
            <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium leading-5 text-on-surface-var">آگهی من</Typography>
            <SwitchButton
              ariaLabel="نمایش آگهی‌های من"
              checked={showMineOnly}
              onChange={setShowMineOnly}
            />
          </div>
        ) : null}

        <Link
          className={`relative inline-flex items-center gap-1 rounded-lg border p-2 text-sm font-normal no-underline ${
            hasFilters
              ? "border-primary bg-primary-container text-primary"
              : "border-outline-var bg-surface-container-lowest text-on-surface-var"
          }`}
          state={{ filters: scopedFilters, onlyMine: assignedTab ? false : showMineOnly, tab: activeTab }}
          to={adManagementPaths.filter}
        >
          <Typography as="span" variant="body" size="medium" weight="regular">{filterLabel}</Typography>
          <LinearFilterHorizontal className="h-5 w-5" />
          {hasFilters ? (
            <Typography as="span" variant="body" size="medium" weight="regular" className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-surface-container-lowest" />
          ) : null}
        </Link>
      </section>

      {hasFilters ? (
        <section className="flex shrink-0 gap-2 overflow-x-auto bg-surface-container-lowest px-4 pb-3 [direction:rtl]">
          {scopedFilters.neighborhoods.map((neighborhood) => (
            <ActiveFilterChip key={neighborhood.id} label={neighborhood.name} />
          ))}
          {scopedFilters.transaction ? <ActiveFilterChip label={getTransactionLabel(scopedFilters.transaction)} /> : null}
          {getFilterPropertyTypes(scopedFilters).map((propertyType) => (
            <ActiveFilterChip
              key={propertyType}
              label={adManagementPropertyTypeLabels[propertyType]}
            />
          ))}
          {!assignedTab && filters.status ? <ActiveFilterChip label={filters.status} /> : null}
          {!assignedTab && filters.publisher ? <ActiveFilterChip label={filters.publisher} /> : null}
        </section>
      ) : null}

      <main
        className={`flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden ${
          (assignedTab
            ? !assignmentsQuery.isLoading && !assignmentsQuery.isError && assignedAdvertisements.length === 0
            : !adsQuery.isLoading && !adsQuery.isError && activeAdvertisements.length === 0)
            ? "bg-surface-container-lowest"
            : "bg-surface-container pb-4"
        }`}
      >
        <div
          className={
            (assignedTab
              ? !assignmentsQuery.isLoading && !assignmentsQuery.isError && assignedAdvertisements.length === 0
              : !adsQuery.isLoading && !adsQuery.isError && activeAdvertisements.length === 0)
              ? "flex min-h-0 flex-1 flex-col bg-surface-container-lowest"
              : assignedTab
                ? "space-y-3 pb-4"
                : "space-y-2"
          }
        >
          {assignedTab ? (
            assignmentsQuery.isLoading ? (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <AdCardSkeleton key={index} variant="assigned" />
                ))}
              </>
            ) : assignmentsQuery.isError ? (
              <AssignmentStatusMessage>
                {(assignmentsQuery.error as { status?: number })?.status === 403
                  ? "شما دسترسی لازم برای مشاهده آگهی‌های تخصیصی آژانس را ندارید."
                  : "دریافت آگهی‌های تخصیصی با خطا مواجه شد."}
                <Button unstyled
                  className="mt-3 block w-full font-semibold text-primary"
                  onClick={() => void assignmentsQuery.refetch()}
                  type="button"
                >
                  تلاش دوباره
                </Button>
              </AssignmentStatusMessage>
            ) : assignedAdvertisements.length > 0 ? (
              assignedAdvertisements.map(({ ad, assignment }, index) => (
                <AssignedConsultantAdCard
                  ad={ad}
                  assignment={assignment}
                  countdown={getAssignmentCountdown(assignment)}
                  key={String(assignment.id)}
                  loadMoreRef={index === preloadIndex ? loadMoreRef : undefined}
                />
              ))
            ) : (
              <AccountMyAdsEmptyState
                description="آگهی‌هایی که کاربران برای ثبت و انتشار به آژانس شما می‌سپارند، در این بخش نمایش داده می‌شوند."
                title="آگهی تخصیصی وجود ندارد"
              />
            )
          ) : adsQuery.isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <AdCardSkeleton key={index} variant="management" />
              ))}
            </>
          ) : adsQuery.isError ? (
            (adsQuery.error as { status?: number })?.status === 403 ? (
              <div className="flex flex-1 items-center justify-center py-10">
                <AccessDeniedState onBack={() => navigate("/account")} />
              </div>
            ) : (
              <AssignmentStatusMessage>
                دریافت آگهی‌ها با خطا مواجه شد.
                <Button
                  unstyled
                  className="mt-3 block w-full font-semibold text-primary"
                  onClick={() => void adsQuery.refetch()}
                  type="button"
                >
                  تلاش دوباره
                </Button>
              </AssignmentStatusMessage>
            )
          ) : activeAdvertisements.length > 0 ? (
            activeAdvertisements.map(({ card, sourceAd, statusInfo }, index) => {
              const isIncomplete = statusInfo.key === "incomplete";
              const destination = isIncomplete
                ? getAdEditPath(card.id, adManagementPaths.root)
                : getAdStatePath(card.id);
              const destinationState = isIncomplete
                ? {
                    card,
                    ad: sourceAd,
                    editReturnTo: adManagementPaths.root,
                    isEditMode: true,
                    returnTo: adManagementPaths.root,
                    tab: "active" as const,
                  }
                : { card, ad: sourceAd, returnTo: adManagementPaths.root, tab: "active" as const };

              return (
                <div
                  key={String(sourceAd.id ?? sourceAd._id ?? card.id)}
                  ref={index === preloadIndex ? loadMoreRef : undefined}
                >
                  <ConsultantAdCard
                    ad={card}
                    onDeleteIncomplete={isIncomplete ? (e) => handleOpenDelete(String(sourceAd.id ?? sourceAd._id ?? card.id), e) : undefined}
                    roleType={
                      activeRole === REAL_ESTATE_MANAGER
                        ? "agency"
                        : activeRole === REAL_ESTATE_CONSULTANT
                          ? "agent_in_agency"
                          : "agent"
                    }
                    showStatusBadge
                    sourceAd={sourceAd}
                    state={destinationState}
                    statusKey={statusInfo.key}
                    statusLabel={statusInfo.label}
                    to={destination}
                  />
                </div>
              );
            })
          ) : (
            <AccountMyAdsEmptyState filterLabel="همه" mode="compact" />
          )}

          {(assignedTab ? assignmentsQuery.isFetchingNextPage : adsQuery.isFetchingNextPage) ? (
            <AdCardSkeleton variant={assignedTab ? "assigned" : "management"} />
          ) : null}
        </div>
      </main>

      <DeleteAdBottomSheet
        isDeleting={isDeleting}
        isOpen={Boolean(deletingAdId)}
        onClose={() => !isDeleting && setDeletingAdId(null)}
        onConfirm={handleConfirmDelete}
      />
    </PageFrame>
  );
}

function AssignedConsultantAdCard({
  ad,
  assignment,
  countdown,
  loadMoreRef,
}: {
  ad: ConsultantAd;
  assignment: AgencyAdvertiseAssignmentDto;
  countdown: AssignmentCountdown;
  loadMoreRef?: (node: HTMLElement | null) => void;
}) {
  const countdownBadge = getAllocationCountdownBadge(countdown);
  const routeState = {
    ad,
    assignment,
    assignmentId: assignment.id,
    returnTo: adManagementPaths.root,
    tab: "status" as const,
  };

  const imageSrc = ad.imageUrl;
  const imageCountNum = Number(ad.imageCount || 1) || 1;

  const rawAd = assignment.advertise;
  const hasVideoMedia = Boolean(
    (rawAd && readVideoUrl(rawAd)) ||
    (rawAd?.videos && Array.isArray(rawAd.videos) && rawAd.videos.length > 0) ||
    (rawAd && (readFeatureValue(rawAd, ["has_video"]) === true || readFeatureValue(rawAd, ["has_video"]) === "true"))
  );

  const hasTour3dMedia = Boolean(
    (rawAd && hasTour3d(rawAd)) ||
    (rawAd && (readFeatureValue(rawAd, ["has_virtual_tour", "virtual_tour", "tour_3d", "tour3d"]) === true || readFeatureValue(rawAd, ["has_virtual_tour"]) === "true"))
  );

  const publisherType = String(
    rawAd?.publisher_type ??
    rawAd?.owner_type ??
    (rawAd ? readFeatureValue(rawAd, ["advertiser_type"]) : "") ??
    ""
  ).toLowerCase();
  const isPersonalAd = Boolean(
    publisherType.includes("user") ||
    publisherType.includes("personal") ||
    publisherType.includes("شخصی")
  );

  return (
    <article
      className="w-full overflow-hidden rounded-none bg-surface-container-lowest p-4 [direction:rtl]"
      ref={loadMoreRef}
    >
      {/* Top Countdown Pill Banner */}
      <div
        className={`flex h-9 items-center justify-center gap-2 rounded-xl px-3 text-center text-xs font-medium ${countdownBadge.className}`}
      >
        <LinearClock className="h-4 w-4 shrink-0" />
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="medium"
          className="text-xs font-medium"
        >
          {countdownBadge.text}
        </Typography>
      </div>

      {/* Media Image with Top-Right Meta Badge Overlay */}
      <div className="relative mt-4 aspect-[328/219.3] w-full shrink-0 overflow-hidden rounded-2xl bg-primary-container">
        {imageSrc ? (
          <img
            alt={ad.title}
            className="h-full w-full object-cover object-center"
            draggable={false}
            src={imageSrc}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-outline" aria-hidden="true">
            <LinearImage className="h-12 w-12" />
          </div>
        )}

        {/* Media indicators pill overlay */}
        <div className="absolute right-2 top-2 z-10 inline-flex h-7 items-center overflow-hidden rounded-[9px] bg-black/65 text-white shadow-sm [direction:ltr]">
          {/* Virtual tour 360 icon */}
          {hasTour3dMedia ? (
            <div className="grid h-7 min-w-7 place-items-center border-r border-white/30 px-1">
              <Linear3d className="h-4 w-4" />
            </div>
          ) : null}
          {/* Video icon */}
          {hasVideoMedia ? (
            <div className="grid h-7 min-w-7 place-items-center border-r border-white/30 px-1">
              <LinearVideo className="h-4 w-4" />
            </div>
          ) : null}
          {/* Personal advertiser icon */}
          {isPersonalAd ? (
            <div className="grid h-7 min-w-7 place-items-center border-r border-white/30 px-1">
              <LinearUserSolid className="h-4 w-4" />
            </div>
          ) : null}
          {/* Album icon + count */}
          <div className="inline-flex h-7 items-center gap-0.5 px-1.5">
            <AdCardAlbumIcon className="h-4 w-4" />
            <Typography as="span" variant="label" size="small" weight="medium" className="text-[10px] font-medium leading-none">
              {toPersianDigits(imageCountNum)}
            </Typography>
          </div>
        </div>
      </div>

      {/* Dynamic Ad Body according to ad category & specs */}
      <AdCardBody
        ad={ad}
        className="pt-0"
        hasSecondaryPrice={Boolean(ad.priceSecondary && ad.priceSecondary !== "—")}
        showBadges={Boolean(ad.badges && ad.badges.length > 0)}
      />

      {/* CTA Button: بررسی و تخصیص */}
      <div className="mt-4 pt-1">
        <Link
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-primary bg-surface-container-lowest text-sm font-medium leading-5 text-primary no-underline active:bg-primary/10"
          state={routeState}
          to={getAllocationReviewPath(ad.id)}
        >
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-sm font-medium text-primary"
          >
            بررسی و تخصیص
          </Typography>
          <LinearArrowLeft2 className="h-5 w-5" />
        </Link>
      </div>
    </article>
  );
}

function AssignmentStatusMessage({ children }: { children: ReactNode }) {
  return (
    <div className="mx-4 rounded-2xl bg-surface-container-lowest px-4 py-8 text-center text-sm font-normal leading-6 text-outline">
      {children}
    </div>
  );
}

function formatAllocationCountdown({ hours, minutes, isExpired }: AssignmentCountdown) {
  if (isExpired || (hours <= 0 && minutes <= 0)) return "مهلت به پایان رسیده است";
  if (hours <= 0) return `${toPersianDigits(minutes)} دقیقه`;
  return `${toPersianDigits(hours)} ساعت و ${toPersianDigits(minutes)} دقیقه`;
}

function getAllocationCountdownBadge(countdown: AssignmentCountdown) {
  if (countdown.isExpired || (countdown.hours <= 0 && countdown.minutes <= 0)) {
    return {
      className: "bg-error-container text-error",
      text: "مهلت تایید تخصیص به پایان رسیده است",
    };
  }

  const text = `${formatAllocationCountdown(countdown)} تا پایان مهلت تایید تخصیص`;

  if (countdown.hours < 4) {
    return {
      className: "bg-error-container text-error",
      text,
    };
  }
  if (countdown.hours < 12) {
    return {
      className: "bg-warning-container text-on-warning-container",
      text,
    };
  }

  return {
    className: "bg-tertiary-container text-tertiary",
    text,
  };
}

function toPersianDigits(value: number | string) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

function ActiveFilterChip({ label }: { label: string }) {
  return (
    <Typography as="span" variant="label" size="small" weight="medium" className="inline-flex h-8 shrink-0 items-center rounded-lg border border-primary bg-primary-container px-2 text-xs font-medium leading-4 text-primary">
      {label}
    </Typography>
  );
}
