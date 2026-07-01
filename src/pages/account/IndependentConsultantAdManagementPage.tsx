import { useMemo, useState } from "react";

import { PageFrame } from "../../app/PageFrame";
import LinearFilterHorizontal from "../../components/(icons)/LinearFilterHorizontal";
import { SwitchButton } from "../../components/SwitchButton";
import { TopBar } from "../../components/TopBar";
import { RouteLink } from "../../routes/RouteLink";
import { SearchIcon } from "./adManagement/AdManagementIcons";
import { ConsultantAdCard } from "./adManagement/ConsultantAdCard";
import {
  adManagementPaths,
  adManagementPropertyTypeLabels,
  adManagementPublisherOptions,
  getAdManagementRouteState,
  getAdsForTab,
  type AdManagementFilters,
  type AdManagementPropertyType,
  type AdsTab,
} from "./adManagement/adManagementData";

const adStatusLabels = ["در انتظار انتشار", "منتشر شده", "در انتظار انتشار", "منتشر شده"];

const emptyFilters: AdManagementFilters = {
  neighborhoods: [],
};

function hasActiveFilters(filters: AdManagementFilters) {
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

export function IndependentConsultantAdManagementPage() {
  const routeState = getAdManagementRouteState();
  const [activeTab, setActiveTab] = useState<AdsTab>(routeState.tab ?? "active");
  const [showMineOnly, setShowMineOnly] = useState(routeState.onlyMine ?? false);
  const [filters] = useState<AdManagementFilters>(routeState.filters ?? emptyFilters);
  const hasFilters = hasActiveFilters(filters);
  const ads = useMemo(
    () =>
      getAdsForTab(activeTab)
        .map((ad, index) => ({
          ...ad,
          publisher:
            adManagementPublisherOptions[index % adManagementPublisherOptions.length].name,
          status: adStatusLabels[index % adStatusLabels.length],
        }))
        .filter((ad) => {
          const matchesStatus = filters.status ? ad.status === filters.status : true;
          const matchesNeighborhood = filters.neighborhoods.length
            ? filters.neighborhoods.some((neighborhood) =>
                ad.timeAndLocation.includes(neighborhood.name),
              )
            : true;

          const matchesPublisher = filters.publisher ? ad.publisher === filters.publisher : true;

          return (
            matchesStatus &&
            matchesNeighborhood &&
            matchesPublisher &&
            matchesTransaction(ad.title, filters) &&
            matchesPropertyType(ad.title, filters.propertyTypes, filters.propertyType)
          );
        }),
    [activeTab, filters],
  );
  const filterLabel = hasFilters ? "فیلترها" : "فیلتر";

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
            تخصصی
          </button>
        </div>
      </section>

      <section
        aria-label="فیلترهای مدیریت آگهی"
        className="flex h-14 shrink-0 items-center justify-between bg-white px-4 [direction:ltr]"
      >
        <div className="flex items-center gap-2 [direction:rtl]">
          <span className="h-6 w-px bg-[#cccccc]" aria-hidden="true" />
          <span className="text-sm font-medium leading-5 text-[#4d4d4d]">آگهی من</span>
          <SwitchButton
            ariaLabel="نمایش آگهی‌های من"
            checked={showMineOnly}
            onChange={setShowMineOnly}
          />
        </div>

        <RouteLink
          className={`relative inline-flex items-center gap-1 rounded-lg border p-2 text-sm font-normal no-underline ${
            hasFilters
              ? "border-[#0048c4] bg-[#e6efff] text-[#0048c4]"
              : "border-[#cccccc] bg-white text-[#4d4d4d]"
          }`}
          state={{ filters, onlyMine: showMineOnly, tab: activeTab }}
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
          {filters.neighborhoods.map((neighborhood) => (
            <ActiveFilterChip key={neighborhood.id} label={neighborhood.name} />
          ))}
          {filters.transaction ? <ActiveFilterChip label={getTransactionLabel(filters.transaction)} /> : null}
          {getFilterPropertyTypes(filters).map((propertyType) => (
            <ActiveFilterChip
              key={propertyType}
              label={adManagementPropertyTypeLabels[propertyType]}
            />
          ))}
          {filters.status ? <ActiveFilterChip label={filters.status} /> : null}
          {filters.publisher ? <ActiveFilterChip label={filters.publisher} /> : null}
        </section>
      ) : null}

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pt-4">
        <div className="space-y-2">
          {ads.length > 0 ? (
            ads.map((ad, index) => (
              <ConsultantAdCard
                ad={ad}
                key={`${ad.title}-${index}`}
                showStatusBadge
                state={{ ad }}
              />
            ))
          ) : (
            <div className="mx-4 rounded-2xl bg-white px-4 py-8 text-center text-sm font-normal leading-6 text-[#808080]">
              آگهی‌ای با این فیلترها پیدا نشد.
            </div>
          )}
        </div>
      </main>
    </PageFrame>
  );
}

function ActiveFilterChip({ label }: { label: string }) {
  return (
    <span className="inline-flex h-8 shrink-0 items-center rounded-lg border border-[#0048c4] bg-[#e6efff] px-2 text-xs font-medium leading-4 text-[#0048c4]">
      {label}
    </span>
  );
}
