import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { PageFrame } from "../../shared/layout/PageFrame";
import { BottomSheet } from "../../shared/components/BottomSheet";
import { getRequestErrorState } from "../../shared/components/ErrorState";
import { HorizontalFilterBar } from "../../shared/components/HorizontalFilterBar";
import { RadioIndicator } from "../../shared/components/RadioIndicator";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import { TopBar } from "../../shared/components/TopBar";
import { useAgencyInfiniteQuery, usePublicAgentsInfiniteQuery } from "../agencies/api/agency.hooks";
import { readStoredSelectedCity } from "../../shared/lib/selectedCityStorage";
import { pushRoute } from "../../shared/navigation/navigation";
import type { AgencySort, PublicAgencyDto, PublicAgentListDto } from "../agencies/api/agency.service";
import type { NeighborhoodDto } from "../locations/api/neighborhood.service";
import {
  AgencyDirectoryMapView,
  type AgencyDirectoryMapItem,
} from "./AgencyDirectoryMapView";
import LinearMapsLocation from "../../shared/icons/LinearMapsLocation";
import {
  clearConsultantsSelectedNeighborhood,
  readConsultantsSelectedNeighborhood,
} from "./consultantsNeighborhoodSelection";
import LinearLocation from "../../shared/icons/LinearLocation";
import LinearArrowDown1 from "../../shared/icons/LinearArrowDown1";
import LinearCancelSmall from "../../shared/icons/LinearCancelSmall";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import { DirectoryCard, DirectoryCardSkeleton } from "./components/DirectoryCard";
import { SEO } from "../../shared/components/SEO";

type DirectoryMode = "agency" | "consultant";

type DirectoryItem = AgencyDirectoryMapItem & {
  badge?: string;
};

type SortOptionId = AgencySort;

type SortOption = {
  id: SortOptionId;
  label: string;
};

const sortOptions: SortOption[] = [
  { id: "score", label: "امتیاز" },
  { id: "rank", label: "رتبه" },
  { id: "newest", label: "جدیدترین" },
  { id: "oldest", label: "قدیمی‌ترین" },
];

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const agencyPageSize = 20;
const loadMoreRemainingItemCount = 10;
const searchDebounceMs = 350;

function toPersianNumber(value: number | string) {
  return String(value).replace(
    /\d/g,
    (digit) => persianDigits[Number(digit)] ?? digit,
  );
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
}

function getNeighborhoodId(neighborhood: NeighborhoodDto) {
  return String(neighborhood.id ?? neighborhood._id ?? neighborhood.name);
}

function mapAgencyToDirectoryItem(agency: PublicAgencyDto): DirectoryItem {
  return {
    address: agency.address,
    id: agency.id,
    image: agency.logo ?? agency.img,
    latitude: agency.lat,
    longitude: agency.lng,
    name: agency.name,
    neighborhoodIds: agency.neighborhood_ids,
    rank: toPersianNumber(agency.rank),
    score: toPersianNumber(agency.score),
  };
}

function mapAgentToDirectoryItem(agent: PublicAgentListDto): DirectoryItem {
  return {
    badge: agent.agency?.name ? `مشاور ${agent.agency.name}` : "مشاور",
    id: agent.id,
    image: agent.avatar,
    name: agent.fullName,
    rank: toPersianNumber(agent.rank ?? 0),
    score: toPersianNumber(agent.score ?? 0),
  };
}

function getInitialMode(): DirectoryMode {
  const mode = new URLSearchParams(window.location.search).get("type");

  return mode === "consultant" ? "consultant" : "agency";
}

function navigateBack() {
  pushRoute("/home", undefined, { rememberCurrent: false });
}

function setRouteMode(mode: DirectoryMode) {
  const nextPath =
    mode === "consultant" ? "/consultants?type=consultant" : "/consultants";

  window.history.pushState({}, "", nextPath);
}

function navigateToAgency(item: DirectoryItem) {
  if (!item.id) return;

  const params = new URLSearchParams();
  const selectedCity = readStoredSelectedCity();

  if (item.name) params.set("name", item.name);
  if (item.address) params.set("location", item.address);
  if (item.image) params.set("logo", item.image);
  if (selectedCity?.id) params.set("city_id", selectedCity.id);
  if (selectedCity?.name) params.set("city_name", selectedCity.name);
  if (item.neighborhoodIds?.length) {
    params.set("neighborhood_ids", item.neighborhoodIds.join(","));
  }
  if (item.rank) params.set("rank", item.rank);
  if (item.score) params.set("score", item.score);

  const queryString = params.toString();
  const path = `/agencies/${encodeURIComponent(item.id)}${queryString ? `?${queryString}` : ""}`;

  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function navigateToAgent(item: DirectoryItem) {
  if (!item.id) return;

  const params = new URLSearchParams();

  if (item.name) params.set("name", item.name);
  if (item.image) params.set("logo", item.image);

  const queryString = params.toString();
  const path = `/agents/${encodeURIComponent(item.id)}${queryString ? `?${queryString}` : ""}`;

  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M10.8 18.2a7.4 7.4 0 1 0 0-14.8 7.4 7.4 0 0 0 0 14.8ZM16.1 16.1 21 21"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M7.70833 14.5833C7.70833 14.0626 7.70782 13.7093 7.68555 13.4367C7.66389 13.1718 7.625 13.0381 7.57813 12.946C7.46325 12.7205 7.27939 12.5367 7.05404 12.4219C6.96189 12.375 6.82816 12.3361 6.56331 12.3145C6.29069 12.2922 5.93744 12.2917 5.41667 12.2917C4.89589 12.2917 4.54264 12.2922 4.27002 12.3145C4.00518 12.3361 3.87144 12.375 3.7793 12.4219C3.55395 12.5367 3.37008 12.7205 3.25521 12.946C3.20833 13.0381 3.16945 13.1718 3.14779 13.4367C3.12551 13.7093 3.125 14.0626 3.125 14.5833C3.125 15.1041 3.12551 15.4574 3.14779 15.73C3.16945 15.9949 3.20833 16.1286 3.25521 16.2207C3.37008 16.4461 3.55395 16.63 3.7793 16.7448C3.87144 16.7917 4.00518 16.8306 4.27002 16.8522C4.54264 16.8745 4.89589 16.875 5.41667 16.875C5.93744 16.875 6.29069 16.8745 6.56331 16.8522C6.82816 16.8306 6.96189 16.7917 7.05404 16.7448C7.27938 16.63 7.46325 16.4461 7.57813 16.2207C7.625 16.1286 7.66389 15.9949 7.68555 15.73C7.70782 15.4574 7.70833 15.1041 7.70833 14.5833ZM14.375 12.1151C14.375 10.1975 14.3619 9.42933 14.0584 8.76058C13.7549 8.09181 13.1854 7.57614 11.7424 6.31348L11.2549 5.88705L11.2093 5.84229C10.9932 5.61065 10.9832 5.24841 11.1963 5.00488C11.4094 4.76149 11.7698 4.7231 12.028 4.90641L12.0785 4.94629L12.5659 5.37272C13.9242 6.56118 14.7556 7.27143 15.1969 8.24382C15.6382 9.21624 15.625 10.3102 15.625 12.1151V14.6712C15.6985 14.5948 15.7813 14.5101 15.8724 14.4141L17.0467 13.1755L17.0923 13.1315C17.3323 12.9245 17.6947 12.9292 17.9297 13.1519C18.1802 13.3893 18.1907 13.7851 17.9533 14.0356L16.7798 15.2743C16.4797 15.5909 16.2114 15.8751 15.966 16.0726C15.7077 16.2805 15.3963 16.4583 15 16.4583C14.6037 16.4583 14.2923 16.2805 14.034 16.0726C13.7886 15.8751 13.5203 15.5909 13.2202 15.2743L12.0467 14.0356L12.0044 13.9868C11.8109 13.7361 11.8355 13.3744 12.0703 13.1519C12.3208 12.9146 12.7159 12.9251 12.9533 13.1755L14.1276 14.4141C14.2187 14.5101 14.3015 14.5948 14.375 14.6712V12.1151ZM7.70833 5.41667C7.70833 4.89589 7.70782 4.54264 7.68555 4.27002C7.66389 4.00517 7.62501 3.87144 7.57813 3.7793C7.46327 3.55389 7.27945 3.37006 7.05404 3.25521C6.9619 3.20833 6.82816 3.16944 6.56331 3.14779C6.29069 3.12551 5.93744 3.125 5.41667 3.125C4.89589 3.125 4.54264 3.12551 4.27002 3.14779C4.00517 3.16944 3.87144 3.20833 3.7793 3.25521C3.55389 3.37006 3.37006 3.55389 3.25521 3.7793C3.20833 3.87144 3.16944 4.00517 3.14779 4.27002C3.12551 4.54264 3.125 4.89589 3.125 5.41667C3.125 5.93744 3.12551 6.29069 3.14779 6.56331C3.16944 6.82816 3.20833 6.9619 3.25521 7.05404C3.37006 7.27945 3.55389 7.46327 3.7793 7.57813C3.87144 7.62501 4.00517 7.66389 4.27002 7.68555C4.54264 7.70782 4.89589 7.70833 5.41667 7.70833C5.93744 7.70833 6.29069 7.70782 6.56331 7.68555C6.82816 7.66389 6.9619 7.62501 7.05404 7.57813C7.27945 7.46327 7.46327 7.27945 7.57813 7.05404C7.62501 6.9619 7.66389 6.82816 7.68555 6.56331C7.70782 6.29069 7.70833 5.93744 7.70833 5.41667ZM8.95833 14.5833C8.95833 15.0835 8.95888 15.4964 8.93148 15.8317C8.90348 16.1743 8.84311 16.491 8.69141 16.7887C8.45678 17.249 8.08248 17.6234 7.62207 17.8581C7.32437 18.0097 7.00759 18.0701 6.66504 18.0981C6.32971 18.1255 5.91682 18.125 5.41667 18.125C4.91652 18.125 4.50362 18.1255 4.1683 18.0981C3.82575 18.0701 3.50897 18.0097 3.21126 17.8581C2.75085 17.6234 2.37655 17.249 2.14193 16.7887C1.99023 16.491 1.92986 16.1743 1.90186 15.8317C1.87446 15.4964 1.875 15.0835 1.875 14.5833C1.875 14.0832 1.87446 13.6703 1.90186 13.335C1.92986 12.9924 1.99023 12.6756 2.14193 12.3779C2.37655 11.9176 2.75085 11.5432 3.21126 11.3086C3.50897 11.1569 3.82575 11.0965 4.1683 11.0685C4.50362 11.0411 4.91652 11.0417 5.41667 11.0417C5.91682 11.0417 6.32971 11.0411 6.66504 11.0685C7.00759 11.0965 7.32437 11.1569 7.62207 11.3086C8.08248 11.5432 8.45678 11.9176 8.69141 12.3779C8.84311 12.6756 8.90348 12.9924 8.93148 13.335C8.95888 13.6703 8.95833 14.0832 8.95833 14.5833ZM8.95833 5.41667C8.95833 5.91682 8.95888 6.32971 8.93148 6.66504C8.90348 7.00759 8.8431 7.32436 8.69141 7.62207C8.45675 8.08244 8.08244 8.45675 7.62207 8.69141C7.32436 8.8431 7.00759 8.90348 6.66504 8.93148C6.32971 8.95888 5.91682 8.95833 5.41667 8.95833C4.91652 8.95833 4.50362 8.95888 4.1683 8.93148C3.82574 8.90348 3.50897 8.8431 3.21126 8.69141C2.7509 8.45675 2.37658 8.08244 2.14193 7.62207C1.99024 7.32436 1.92986 7.00759 1.90186 6.66504C1.87446 6.32971 1.875 5.91682 1.875 5.41667C1.875 4.91652 1.87446 4.50362 1.90186 4.1683C1.92986 3.82574 1.99024 3.50897 2.14193 3.21126C2.37658 2.7509 2.7509 2.37658 3.21126 2.14193C3.50897 1.99024 3.82574 1.92986 4.1683 1.90186C4.50362 1.87446 4.91652 1.875 5.41667 1.875C5.91682 1.875 6.32971 1.87446 6.66504 1.90186C7.00759 1.92986 7.32436 1.99024 7.62207 2.14193C8.08244 2.37658 8.45675 2.7509 8.69141 3.21126C8.8431 3.50897 8.90348 3.82574 8.93148 4.1683C8.95888 4.50362 8.95833 4.91652 8.95833 5.41667Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FilterChip({
  active = false,
  icon,
  label,
  onClick,
  onRemove,
}: {
  active?: boolean;
  icon?: "chevron" | "location" | "sort";
  label: string;
  onClick?: () => void;
  onRemove?: () => void;
}) {
  const chipIcon =
    icon === "chevron" ? (
      <LinearArrowDown1 className="w-5 h-5"/>
    ) : icon === "location" ? (
      <LinearLocation className="h-5 w-5"/>
    ) : icon === "sort" ? (
      <SortIcon />
    ) : null;

  const chipContent = (
    <>
      {icon !== "chevron" && chipIcon}
      <Typography as="span" variant="body" size="medium" weight="regular" className={onRemove ? "max-w-[92px] truncate" : undefined}>
        {label}
      </Typography>
      {icon === "chevron" && chipIcon}
    </>
  );

  const chipClassName = `inline-flex items-center justify-center gap-1 rounded-lg border p-2 text-sm! font-medium! transition-colors ${active
      ? "border-[#0048C4] bg-[#0048C416] text-[#0048c4]"
      : "border-[#cccccc] bg-white text-[#4d4d4d]"
    }`;

  if (onRemove) {
    return (
      <Typography as="span" variant="body" size="medium" weight="regular" className={`${chipClassName} overflow-hidden p-2`} dir="rtl">
        <Button unstyled
          className="inline-flex h-full min-w-0 items-center justify-center gap-1 text-inherit"
          onClick={onClick}
          type="button"
        >
          {chipContent}
        </Button>

        <Button unstyled
          aria-label={`حذف ${label}`}
          className="grid h-full shrink-0 place-items-center text-inherit active:bg-[#0048c414]"
          onClick={onRemove}
          type="button"
        >
          <LinearCancelSmall className="w-5 h-5" />
        </Button>
      </Typography>
    );
  }

  return (
    <Button unstyled
      className={chipClassName}
      dir="rtl"
      onClick={onClick}
      type="button"
    >
      {chipContent}
    </Button>
  );
}

export function ConsultantsDirectoryPage() {
  const selectedCity = readStoredSelectedCity();
  const [mode, setMode] = useState<DirectoryMode>(getInitialMode);
  const [isModeSheetOpen, setIsModeSheetOpen] = useState(false);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const directoryHistoryState =
    window.history.state && typeof window.history.state === "object"
      ? (window.history.state as {
          consultantsDirectoryState?: {
            search?: string;
            selectedSort?: SortOptionId | null;
          };
        }).consultantsDirectoryState
      : undefined;
  const [search, setSearch] = useState(directoryHistoryState?.search ?? "");
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<NeighborhoodDto | null>(() =>
      readConsultantsSelectedNeighborhood(selectedCity?.id),
    );
  const [selectedSort, setSelectedSort] = useState<SortOptionId | null>(
    directoryHistoryState?.selectedSort ?? null,
  );
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedMapAgencyId, setSelectedMapAgencyId] = useState<string | null>(
    null,
  );
  const loadMoreObserverRef = useRef<IntersectionObserver | null>(null);

  const debouncedSearch = useDebouncedValue(search.trim(), searchDebounceMs);
  const selectedNeighborhoodId = selectedNeighborhood
    ? getNeighborhoodId(selectedNeighborhood)
    : undefined;
  const searchPlaceholder = mode === "agency" ? "جستجوی آژانس" : "جستجوی مشاور";
  const agenciesQuery = useAgencyInfiniteQuery({
    enabled: mode === "agency",
    neighborhoodId: selectedNeighborhoodId,
    perPage: agencyPageSize,
    search: debouncedSearch,
    sort: selectedSort ?? undefined,
  });
  const agentsQuery = usePublicAgentsInfiniteQuery({
    enabled: mode === "consultant",
    perPage: agencyPageSize,
    search: debouncedSearch,
    sort: selectedSort ?? undefined,
  });
  const agencyDirectoryItems = useMemo(
    () =>
      agenciesQuery.data?.pages.flatMap((page) =>
        page.data.map(mapAgencyToDirectoryItem),
      ) ?? [],
    [agenciesQuery.data],
  );
  const consultantDirectoryItems = useMemo(
    () =>
      agentsQuery.data?.pages.flatMap((page) =>
        page.data.map(mapAgentToDirectoryItem),
      ) ?? [],
    [agentsQuery.data],
  );
  const items =
    mode === "agency" ? agencyDirectoryItems : consultantDirectoryItems;
  const selectedSortOption = sortOptions.find(
    (option) => option.id === selectedSort,
  );
  const neighborhoodChipLabel = selectedNeighborhood?.name ?? "محله";
  const loadMoreTriggerIndex = Math.max(
    items.length - loadMoreRemainingItemCount - 1,
    0,
  );
  const activeQuery = mode === "agency" ? agenciesQuery : agentsQuery;
  const DirectoryErrorState = getRequestErrorState(activeQuery.error);
  const seoTitle =
    mode === "consultant"
      ? "مشاوران املاک | جستجو و مقایسه مشاوران در بنگاه"
      : "آژانس‌های املاک | جستجو و مقایسه آژانس‌ها در بنگاه";
  const seoDescription =
    mode === "consultant"
      ? "فهرست مشاوران املاک در بنگاه؛ مشاوران را بر اساس امتیاز، رتبه و محدوده فعالیت بررسی و مقایسه کنید."
      : "فهرست آژانس‌های املاک در بنگاه؛ آژانس‌ها را بر اساس امتیاز، رتبه، محدوده فعالیت و آگهی‌های فعال بررسی کنید.";
  const directorySeo = (
    <SEO
      title={seoTitle}
      description={seoDescription}
      keywords="مشاور املاک, آژانس املاک, بهترین مشاور املاک, بهترین آژانس املاک, بنگاه املاک"
    />
  );

  const loadMoreSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      loadMoreObserverRef.current?.disconnect();
      loadMoreObserverRef.current = null;

      if (
        !node ||
        !activeQuery.hasNextPage ||
        activeQuery.isFetchingNextPage
      ) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (
            entries[0]?.isIntersecting &&
            activeQuery.hasNextPage &&
            !activeQuery.isFetchingNextPage
          ) {
            void activeQuery.fetchNextPage();
          }
        },
        { root: null, rootMargin: "0px", threshold: 0.1 },
      );

      observer.observe(node);
      loadMoreObserverRef.current = observer;
    },
    [
      activeQuery.fetchNextPage,
      activeQuery.hasNextPage,
      activeQuery.isFetchingNextPage,
    ],
  );

  useEffect(
    () => () => {
      loadMoreObserverRef.current?.disconnect();
    },
    [],
  );

  useEffect(() => {
    if (mode !== "consultant") return;

    setIsMapOpen(false);
    setSelectedMapAgencyId(null);
  }, [mode]);

  const handleModeChange = (nextMode: DirectoryMode) => {
    setMode(nextMode);
    setIsMapOpen(false);
    setSelectedMapAgencyId(null);
    setSearch("");
    setIsModeSheetOpen(false);
    setIsSortSheetOpen(false);
    setRouteMode(nextMode);
  };

  const openNeighborhoodPage = () => {
    const currentState =
      window.history.state && typeof window.history.state === "object"
        ? window.history.state
        : {};

    window.history.replaceState(
      {
        ...currentState,
        consultantsDirectoryState: { search, selectedSort },
      },
      "",
      `${window.location.pathname}${window.location.search}`,
    );
    pushRoute("/consultants/neighborhood");
  };

  const clearNeighborhood = () => {
    clearConsultantsSelectedNeighborhood();
    setSelectedNeighborhood(null);
  };

  if (isMapOpen && mode === "agency") {
    const mapCenter =
      selectedCity?.latitude !== undefined &&
        selectedCity.longitude !== undefined
        ? {
          latitude: selectedCity.latitude,
          longitude: selectedCity.longitude,
        }
        : undefined;

    return (
      <PageFrame
        className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
        variant="flush"
      >
        {directorySeo}
        <h1 className="sr-only">{seoTitle}</h1>
        <AgencyDirectoryMapView
          center={mapCenter}
          items={agencyDirectoryItems}
          onBack={() => {
            setSelectedMapAgencyId(null);
            setIsMapOpen(false);
          }}
          onOpenAgency={navigateToAgency}
          onOpenList={() => {
            setSelectedMapAgencyId(null);
            setIsMapOpen(false);
          }}
          onSelectAgency={setSelectedMapAgencyId}
          selectedAgencyId={selectedMapAgencyId}
        />
      </PageFrame>
    );
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      {directorySeo}
      <h1 className="sr-only">{seoTitle}</h1>
      <div className="shrink-0 bg-[#f0f0f0]">
        <TopBar
          className="bg-[#f0f0f0]"
          onBack={navigateBack}
          placement="inline"
          title="مشاورین"
        />

        <div className="px-4 pt-2">
          <label className="relative flex items-center rounded-xl border border-[#808080] bg-white text-[#808080]">
            <input
              className="h-full w-full rounded-[inherit] border-0 bg-transparent px-4 py-3 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              type="search"
              value={search}
            />
            <Typography as="span" variant="body" size="medium" weight="regular" className="absolute left-5 top-1/2 -translate-y-1/2 text-[#808080]">
              <SearchIcon />
            </Typography>
          </label>
        </div>

        <HorizontalFilterBar
          ariaLabel="فیلتر مشاورین"
          className="h-[53px] py-0 pt-2"
        >
          <FilterChip
            active
            icon="chevron"
            label={mode === "agency" ? "آژانس" : "مشاور"}
            onClick={() => setIsModeSheetOpen(true)}
          />
          {mode === "agency" ? (
            <FilterChip
              active={Boolean(selectedNeighborhood)}
              icon="location"
              label={neighborhoodChipLabel}
              onClick={openNeighborhoodPage}
              onRemove={selectedNeighborhood ? clearNeighborhood : undefined}
            />
          ) : null}
          <FilterChip
            active={Boolean(selectedSort)}
            icon="sort"
            label={selectedSortOption?.label ?? "مرتب سازی"}
            onClick={() => setIsSortSheetOpen(true)}
            onRemove={selectedSort ? () => setSelectedSort(null) : undefined}
          />
        </HorizontalFilterBar>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white py-4 [-webkit-overflow-scrolling:touch]">
        {activeQuery.isLoading ? (
          <div className="space-y-4 pb-20">
            {Array.from({ length: 5 }, (_, index) => (
              <DirectoryCardSkeleton key={index} />
            ))}
          </div>
        ) : activeQuery.isError && items.length === 0 ? (
          <DirectoryErrorState
            className="min-h-[420px]"
            onRetry={() => void activeQuery.refetch()}
          />
        ) : items.length > 0 ? (
          <div className="space-y-4 pb-20">
            {items.map((item, index) => {
              const shouldAttachLoadMoreRef =
                activeQuery.hasNextPage && index === loadMoreTriggerIndex;

              return (
                <div
                  key={item.id ?? `${item.name}-${index}`}
                  ref={shouldAttachLoadMoreRef ? loadMoreSentinelRef : undefined}
                >
                  <DirectoryCard
                    item={item}
                    mode={mode}
                    onClick={
                      item.id
                        ? mode === "agency"
                          ? () => navigateToAgency(item)
                          : () => navigateToAgent(item)
                        : undefined
                    }
                  />
                </div>
              );
            })}
            {activeQuery.isFetchingNextPage ? (
              <>
                <DirectoryCardSkeleton />
                <DirectoryCardSkeleton />
              </>
            ) : null}
          </div>
        ) : (
          <SearchEmptyState />
        )}
      </main>

      {mode === "agency" ? (
        <Button unstyled
          className="absolute bottom-[16px] left-1/2 z-10 inline-flex -translate-x-1/2 items-center justify-center gap-2 rounded-2xl bg-[#0048c4] px-4 py-2 leading-6 text-white shadow-[0_10px_26px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          onClick={() => {
            setSelectedMapAgencyId(null);
            setIsMapOpen(true);
          }}
          type="button"
        >
          <LinearMapsLocation className="w-6 h-6 text-white" />
          <Typography as="span" variant="label" size="medium" weight="medium" className="font-medium">نقشه</Typography>
        </Button>
      ) : null}


      <BottomSheet
        ariaLabel="انتخاب نوع نمایش"
        className="rounded-t-[20px]"
        contentClassName=""
        heightClassName=""
        isOpen={isModeSheetOpen}
        onClose={() => setIsModeSheetOpen(false)}
        title="نمایش مشاورین"
      >
        <div className="pt-2" dir="rtl">
          {([
            { id: "agency" as const, label: "آژانس" },
            { id: "consultant" as const, label: "مشاور" },
          ]).map((option) => {
            const checked = mode === option.id;

            return (
              <Button unstyled
                aria-pressed={checked}
                className={`flex w-full px-4 py-6 items-center justify-between text-right font-medium leading-5 ${checked
                    ? "text-[#0048c4]"
                    : "bg-white text-[#1a1a1a]"
                  }`}
                key={option.id}
                onClick={() => handleModeChange(option.id)}
                type="button"
              >
                <Typography as="span" variant="body" size="medium" weight="regular">{option.label}</Typography>
                <RadioIndicator checked={checked} />
              </Button>
            );
          })}
        </div>
      </BottomSheet>


      <BottomSheet
        ariaLabel="مرتب سازی"
        className="rounded-t-[20px]"
        contentClassName=""
        heightClassName=""
        isOpen={isSortSheetOpen}
        onClose={() => setIsSortSheetOpen(false)}
        title="مرتب سازی بر اساس"
      >
        <div className="" dir="rtl">
          {sortOptions.map((option) => {
            const checked = selectedSort === option.id;

            return (
              <Button unstyled
                aria-pressed={checked}
                className={`flex w-full items-center justify-between py-6 px-4 text-right text-sm font-medium leading-5 ${checked
                    ? "text-[#0048c4]"
                    : "bg-white text-[#1a1a1a]"
                  }`}
                key={option.id}
                onClick={() => {
                  setSelectedSort(option.id);
                  setIsSortSheetOpen(false);
                }}
                type="button"
              >
                <Typography as="span" variant="body" size="medium" weight="regular">{option.label}</Typography>
                <RadioIndicator checked={checked} />
              </Button>
            );
          })}
        </div>
      </BottomSheet>
    </PageFrame>
  );
}
