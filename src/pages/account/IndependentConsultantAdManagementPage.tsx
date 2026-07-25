import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { PageFrame } from "../../app/PageFrame";
import LinearArrowLeft2 from "../../components/(icons)/LinearArrowLeft2";
import LinearFilterHorizontal from "../../components/(icons)/LinearFilterHorizontal";
import LinearTimeQuarter from "../../components/(icons)/LinearTimeQuarter";
import { SwitchButton } from "../../components/SwitchButton";
import { TopBar } from "../../components/TopBar";
import { useAgencyAdvertiseAssignmentsInfiniteQuery } from "../../hooks/agency-advertise-assignment.hooks";
import { RouteLink } from "../../routes/RouteLink";
import type { AgencyAdvertiseAssignmentDto } from "../../services/agency-advertise-assignment.service";
import { mapAdvertisementToAdCard } from "../../services/advertisement.service";
import { SearchIcon } from "./adManagement/AdManagementIcons";
import { ConsultantAdCard } from "./adManagement/ConsultantAdCard";
import {
  adManagementPaths,
  adManagementPropertyTypeLabels,
  adManagementPublisherOptions,
  getAdManagementRouteState,
  getAdsForTab,
  getAllocationReviewPath,
  getAdStatePath,
  type AdManagementFilters,
  type AdManagementPropertyType,
  type AdsTab,
  type ConsultantAd,
} from "./adManagement/adManagementData";

const adStatusLabels = ["در انتظار انتشار", "منتشر شده", "در انتظار انتشار", "منتشر شده"];
const assignmentPageSize = 20;
const loadMoreRemainingCount = 10;

const emptyFilters: AdManagementFilters = {
  neighborhoods: [],
};

type AssignmentCountdown = {
  hours: number;
  minutes: number;
} | null;

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
  if (!assignment.expiresAt) return null;

  const expiresAt = Date.parse(assignment.expiresAt);
  if (!Number.isFinite(expiresAt)) return null;

  const remainingMinutes = Math.max(0, Math.ceil((expiresAt - Date.now()) / 60_000));

  return {
    hours: Math.floor(remainingMinutes / 60),
    minutes: remainingMinutes % 60,
  };
}

export function IndependentConsultantAdManagementPage() {
  const routeState = getAdManagementRouteState();
  const [activeTab, setActiveTab] = useState<AdsTab>(routeState.tab ?? "active");
  const [showMineOnly, setShowMineOnly] = useState(routeState.onlyMine ?? false);
  const [filters] = useState<AdManagementFilters>(routeState.filters ?? emptyFilters);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const assignedTab = isAssignedTab(activeTab);
  const scopedFilters = getScopedFilters(filters, activeTab);
  const hasFilters = hasActiveFilters(scopedFilters, activeTab);
  const assignmentsQuery = useAgencyAdvertiseAssignmentsInfiniteQuery({
    enabled: assignedTab,
    perPage: assignmentPageSize,
    status: "pending",
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
  const ads = useMemo(
    () =>
      getAdsForTab("active")
        .map((ad, index) => ({
          ...ad,
          publisher:
            adManagementPublisherOptions[index % adManagementPublisherOptions.length].name,
          status: adStatusLabels[index % adStatusLabels.length],
        }))
        .filter((ad) => matchesAdFilters(ad, scopedFilters, false)),
    [scopedFilters],
  );
  const preloadIndex = Math.max(assignedAdvertisements.length - loadMoreRemainingCount - 1, 0);
  const filterLabel = hasFilters ? "فیلترها" : "فیلتر";

  const loadMoreRef = (node: HTMLElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;

    if (!node || !assignmentsQuery.hasNextPage || assignmentsQuery.isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        void assignmentsQuery.fetchNextPage();
      },
      { rootMargin: "160px 0px" },
    );
    observer.observe(node);
    observerRef.current = observer;
  };

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account"
        centerClassName="px-0"
        centerSlot={
          <h1 className="m-0 truncate text-center text-base font-semibold leading-6 text-[#1a1a1a]">
            مدیریت آگهی‌ها
          </h1>
        }
        className="bg-[#f0f0f0]"
        startSlot={
          <button
            aria-label="جستجو"
            className="grid h-12 w-12 place-items-center rounded-full text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
            type="button"
          >
            <SearchIcon className="h-6 w-6" />
          </button>
        }
      />

      <section className="shrink-0 bg-[#f0f0f0] px-4 py-2" aria-label="بخش‌های مدیریت آگهی">
        <div className="grid h-10 grid-cols-2 overflow-hidden rounded-xl border border-[#808080] bg-white [direction:rtl]">
          <button
            aria-current={activeTab === "active" ? "page" : undefined}
            className={`text-base font-medium leading-6 [direction:rtl] ${
              activeTab === "active" ? "bg-[#0048c41f] text-[#002099]" : "text-[#4d4d4d]"
            }`}
            onClick={() => setActiveTab("active")}
            type="button"
          >
            آگهی‌ها
          </button>
          <button
            aria-current={activeTab === "status" ? "page" : undefined}
            className={`text-base font-medium leading-6 [direction:rtl] ${
              activeTab === "status" ? "bg-[#0048c41f] text-[#002099]" : "text-[#4d4d4d]"
            }`}
            onClick={() => setActiveTab("status")}
            type="button"
          >
            تخصیصی‌ها
          </button>
        </div>
      </section>

      <section
        aria-label="فیلترهای مدیریت آگهی"
        className={`flex h-14 shrink-0 items-center bg-white px-4 [direction:ltr] ${
          assignedTab ? "justify-end" : "justify-between"
        }`}
      >
        {!assignedTab ? (
          <div className="flex items-center gap-2 [direction:rtl]">
            <span className="h-6 w-px bg-[#cccccc]" aria-hidden="true" />
            <span className="text-sm font-medium leading-5 text-[#4d4d4d]">آگهی من</span>
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
              ? "border-[#0048c4] bg-[#e6efff] text-[#0048c4]"
              : "border-[#cccccc] bg-white text-[#4d4d4d]"
          }`}
          state={{ filters: scopedFilters, onlyMine: assignedTab ? false : showMineOnly, tab: activeTab }}
          to={adManagementPaths.filter}
        >
          <span>{filterLabel}</span>
          <LinearFilterHorizontal className="h-5 w-5" />
          {hasFilters ? (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#0048c4] ring-2 ring-white" />
          ) : null}
        </RouteLink>
      </section>

      {hasFilters ? (
        <section className="flex shrink-0 gap-2 overflow-x-auto bg-white px-4 pb-3 [direction:rtl]">
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

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pt-4">
        <div className={assignedTab ? "space-y-3 pb-4" : "space-y-2"}>
          {assignedTab ? (
            assignmentsQuery.isLoading ? (
              <AssignmentStatusMessage>در حال دریافت آگهی‌های تخصیصی...</AssignmentStatusMessage>
            ) : assignmentsQuery.isError ? (
              <AssignmentStatusMessage>
                دریافت آگهی‌های تخصیصی با خطا مواجه شد.
                <button
                  className="mt-3 block w-full font-semibold text-[#0048c4]"
                  onClick={() => void assignmentsQuery.refetch()}
                  type="button"
                >
                  تلاش دوباره
                </button>
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
          ) : ads.length > 0 ? (
            ads.map((ad, index) => (
              <ConsultantAdCard
                ad={ad}
                key={`${ad.title}-${index}`}
                showStatusBadge
                state={{ card: ad, ad, returnTo: adManagementPaths.root, tab: "active" }}
                to={getAdStatePath(ad.id)}
              />
            ))
          ) : (
            <AssignmentStatusMessage>آگهی‌ای با این فیلترها پیدا نشد.</AssignmentStatusMessage>
          )}

          {assignedTab && assignmentsQuery.isFetchingNextPage ? (
            <AssignmentStatusMessage>در حال دریافت موارد بیشتر...</AssignmentStatusMessage>
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
  const countdownClassName = getAllocationCountdownClassName(countdown?.hours);
  const routeState = {
    ad,
    assignment,
    assignmentId: assignment.id,
    returnTo: adManagementPaths.root,
    tab: "status" as const,
  };

  return (
    <article
      className="overflow-hidden bg-white shadow-[0_4px_16px_rgba(26,26,26,0.06)] [direction:rtl]"
      ref={loadMoreRef}
    >
      <div
        className={`flex gap-2 items-center rounded-4xl mt-4 mx-4 py-2 px-3 text-center text-sm font-medium ${countdownClassName}`}
      >
        <LinearTimeQuarter className="w-4 h-4"/>
        {countdown
          ? `${formatAllocationCountdown(countdown)} تا پایان مهلت تخصیص`
          : "زمان پایان مهلت تخصیص مشخص نیست"}
      </div>

      <ConsultantAdCard
        ad={ad}
        showStatusBadge
        state={routeState}
        to={getAllocationReviewPath(ad.id)}
      />

      <div className="px-4 pb-4 pt-1">
        <RouteLink
          className="flex h-11 w-full items-center justify-center rounded-lg bg-white text-sm font-medium leading-5 text-[#0048c4] no-underline border border-[#0048c4] active:bg-[#003aa0]"
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
    <div className="mx-4 rounded-2xl bg-white px-4 py-8 text-center text-sm font-normal leading-6 text-[#808080]">
      {children}
    </div>
  );
}

function formatAllocationCountdown({ hours, minutes }: { hours: number; minutes: number }) {
  return `${toPersianDigits(hours)} ساعت و ${toPersianDigits(minutes)} دقیقه`;
}

function getAllocationCountdownClassName(hours?: number) {
  if (hours !== undefined && hours < 3) return "bg-[#ffebed] text-[#ee3623]";
  if (hours !== undefined && hours < 12) return "bg-[#fff8e1] text-[#ff6d00]";

  return "bg-[#e6efff] text-[#0048c4]";
}

function toPersianDigits(value: number | string) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

function ActiveFilterChip({ label }: { label: string }) {
  return (
    <span className="inline-flex h-8 shrink-0 items-center rounded-lg border border-[#0048c4] bg-[#e6efff] px-2 text-xs font-medium leading-4 text-[#0048c4]">
      {label}
    </span>
  );
}
