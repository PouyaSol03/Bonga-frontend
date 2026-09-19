import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import "../advertisements/components/AdCard.css";

import { PageFrame } from "../../shared/layout/PageFrame";
import { useActiveAuthRole } from "../../shared/auth/use-active-auth-role";
import LinearArrowLeft2 from "../../shared/icons/LinearArrowLeft2";
import LinearFilterHorizontal from "../../shared/icons/LinearFilterHorizontal";
import LinearTimeQuarter from "../../shared/icons/LinearTimeQuarter";
import { SwitchButton } from "../../shared/components/SwitchButton";
import { TopBar } from "../../shared/components/TopBar";
import { useAgencyAdvertiseAssignmentsInfiniteQuery } from "../advertisements/api/agency-advertise-assignment.hooks";
import { useMyAdsInfiniteQuery } from "./api/account.hooks";
import { RouteLink } from "../../shared/navigation/RouteLink";
import type { AgencyAdvertiseAssignmentDto } from "../advertisements/api/agency-advertise-assignment.service";
import { getAdvertisementPublisherName, mapAdvertisementToAdCard } from "../advertisements/api/advertisement.service";
import { SearchIcon } from "./adManagement/AdManagementIcons";
import { ConsultantAdCard } from "./adManagement/ConsultantAdCard";
import { AdCardSkeleton } from "../advertisements/components/AdCardSkeleton";
import {
  adManagementPaths,
  adManagementPropertyTypeLabels,
  getAdManagementRouteState,
  getAllocationReviewPath,
  getAdStatePath,
  type AdManagementFilters,
  type AdManagementPropertyType,
  type AdsTab,
  type ConsultantAd,
} from "./adManagement/adManagementData";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import { getMyAdStatusInfo } from "./myAdsStatus";
import { AccountMyAdsEmptyState } from "./accountPageViews";
import { INDEPENDENT_CONSULTANT } from "../../shared/constants/roles.constants";

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

function matchesAdFilters(
  ad: ConsultantAd & { publisher?: string },
  filters: AdManagementFilters,
  assignedTab: boolean,
) {
  const matchesStatus = assignedTab ? true : filters.status ? ad.status === filters.status : true;
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
  const routeState = getAdManagementRouteState();
  const activeRole = useActiveAuthRole();
  const canAccessAssignments = activeRole !== INDEPENDENT_CONSULTANT;
  const [activeTab, setActiveTab] = useState<AdsTab>(() =>
    canAccessAssignments ? (routeState.tab ?? "active") : "active",
  );
  const [showMineOnly, setShowMineOnly] = useState(routeState.onlyMine ?? false);
  const [filters] = useState<AdManagementFilters>(routeState.filters ?? emptyFilters);
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
    perPage: assignmentPageSize,
  });
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
        .filter(({ ad }) => matchesAdFilters(ad, scopedFilters, true)),
    [assignmentItems, scopedFilters],
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

          return { card, sourceAd };
        })
        .filter(({ card }) => matchesAdFilters(card, scopedFilters, false)),
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

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account"
        centerClassName="px-0"
        centerSlot={
          <Typography as="h1" variant="title" size="medium" weight="semibold" className="m-0 truncate text-right text-base font-semibold leading-6 text-on-surface">
            مدیریت آگهی‌ها
          </Typography>
        }
        className="bg-surface-container"
        startSlot={
          <Button unstyled
            aria-label="جستجو"
            className="grid h-12 w-12 place-items-center rounded-full text-on-surface focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-primary/40"
            type="button"
          >
            <SearchIcon className="h-6 w-6" />
          </Button>
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

        <RouteLink
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
        </RouteLink>
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
          !assignedTab &&
          !adsQuery.isLoading &&
          !adsQuery.isError &&
          activeAdvertisements.length === 0
            ? "bg-surface-container-lowest"
            : "bg-surface-container pt-4"
        }`}
      >
        <div
          className={
            !assignedTab &&
            !adsQuery.isLoading &&
            !adsQuery.isError &&
            activeAdvertisements.length === 0
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
                دریافت آگهی‌های تخصیصی با خطا مواجه شد.
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
              <AssignmentStatusMessage>آگهی تخصیصی در انتظار بررسی وجود ندارد.</AssignmentStatusMessage>
            )
          ) : adsQuery.isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <AdCardSkeleton key={index} />
              ))}
            </>
          ) : adsQuery.isError ? (
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
          ) : activeAdvertisements.length > 0 ? (
            activeAdvertisements.map(({ card, sourceAd }, index) => (
              <div
                key={String(sourceAd.id ?? sourceAd._id ?? card.id)}
                ref={index === preloadIndex ? loadMoreRef : undefined}
              >
                <ConsultantAdCard
                  ad={card}
                  showStatusBadge
                  state={{ card, ad: sourceAd, returnTo: adManagementPaths.root, tab: "active" }}
                  to={getAdStatePath(card.id)}
                />
              </div>
            ))
          ) : (
            <AccountMyAdsEmptyState filterLabel="همه" mode="compact" />
          )}

          {(assignedTab ? assignmentsQuery.isFetchingNextPage : adsQuery.isFetchingNextPage) ? (
            <AdCardSkeleton variant={assignedTab ? "assigned" : "standard"} />
          ) : null}
        </div>
      </main>
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
  const countdownClassName = getAllocationCountdownClassName(countdown);
  const routeState = {
    ad,
    assignment,
    assignmentId: assignment.id,
    returnTo: adManagementPaths.root,
    tab: "status" as const,
  };

  return (
    <article
      className="overflow-hidden bg-surface-container-lowest shadow-[0_4px_16px_rgba(0,0,0,0.06)] [direction:rtl]"
      ref={loadMoreRef}
    >
      <div
        className={`flex gap-2 items-center rounded-xl mt-4 mx-4 py-2 px-3 text-center text-xs font-medium ${countdownClassName}`}
      >
        <LinearTimeQuarter className="w-4 h-4"/>
        {countdown.isExpired
          ? "مهلت تخصیص به پایان رسیده است"
          : `${formatAllocationCountdown(countdown)} تا پایان مهلت تخصیص`}
      </div>

      <ConsultantAdCard
        ad={ad}
        showStatusBadge
        state={routeState}
        to={getAllocationReviewPath(ad.id)}
      />

      <div className="px-4 pb-4 pt-1">
        <RouteLink
          className="flex h-11 w-full items-center justify-center rounded-lg bg-surface-container-lowest text-sm font-medium leading-5 text-primary no-underline border border-primary active:bg-primary/10"
          state={routeState}
          to={getAllocationReviewPath(ad.id)}
        >
          بررسی و تخصیص
          <LinearArrowLeft2 className="w-5 h-5"/>
        </RouteLink>
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

function getAllocationCountdownClassName(countdown: AssignmentCountdown) {
  if (countdown.isExpired || (countdown.hours <= 0 && countdown.minutes <= 0)) {
    return "bg-error-container text-error";
  }
  if (countdown.hours < 3) return "bg-error-container text-error";
  if (countdown.hours < 12) return "bg-warning-container text-warning";

  return "bg-tertiary-container text-tertiary";
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
