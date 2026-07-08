import { useEffect, useRef, useState } from "react";

import {
  useDeleteSearchHistoryMutation,
  useSearchHistoryQuery,
} from "../../../hooks/search-history.hooks";
import { useAdvertisementListQuery } from "../../../hooks/advertisement.hooks";
import { TopBar } from "../../../components/TopBar";
import { getRequestErrorState } from "../../../components/ErrorState";
import SearchErrors from "./SearchErrors";
import type { SearchHistoryItem } from "../../../services/search-history.service";
import type { AdvertisementItem } from "../../../services/advertisement.service";
import { getStoredAuthSession } from "../../../auth/auth-storage";
import { readStoredSelectedCity } from "../../../lib/selectedCityStorage";
import {
  initialRecentSearches,
  initialSavedSearches,
} from "../homeData";

import type { RecentSearch, SavedSearch } from "../homeTypes";

type HomeSearchScreenProps = {
  initialQuery?: string;
  initialView?: "search" | "saved";
  isOpen: boolean;
  minSearchQueryLength?: number;
  onClose: () => void;
  onQuerySearchChange?: (query: string) => void;
  onSelectResult?: (item: SearchHistoryItem | { title: string }) => void;
};

const DEFAULT_MIN_SEARCH_QUERY_LENGTH = 1;
const REMOVE_TRANSITION_MS = 180;
const SWIPE_DELETE_THRESHOLD = 72;

const persianDigits: Record<string, string> = {
  "0": "۰",
  "1": "۱",
  "2": "۲",
  "3": "۳",
  "4": "۴",
  "5": "۵",
  "6": "۶",
  "7": "۷",
  "8": "۸",
  "9": "۹",
};

function toPersianDigits(value: string | number) {
  return String(value).replace(/\d/g, (digit) => persianDigits[digit] ?? digit);
}

function readNestedName(value: unknown) {
  if (typeof value === "string" && value.trim()) return value;

  if (value && typeof value === "object" && "name" in value) {
    const name = (value as { name?: unknown }).name;

    return typeof name === "string" ? name : "";
  }

  return "";
}

function readAdText(item: AdvertisementItem, keys: string[]) {
  for (const key of keys) {
    const value = item[key];
    const nestedName = readNestedName(value);

    if (nestedName) return nestedName;
    if (typeof value === "number") return String(value);
  }

  return "";
}

function mapAdToSearchResult(
  item: AdvertisementItem,
  index: number,
): SearchHistoryItem {
  const neighborhood = readAdText(item, [
    "neighborhood",
    "neighborhood_name",
    "district",
    "district_name",
  ]);
  const city = readAdText(item, ["city", "city_name"]);
  const category = readAdText(item, ["category", "category_name", "form_title"]);

  return {
    id: String(item.id ?? item._id ?? `ad-search-${index + 1}`),
    subtitle: [category, neighborhood || city].filter(Boolean).join("، "),
    tags: [city, neighborhood].filter(Boolean),
    title: readAdText(item, ["title", "label"]) || "آگهی ملک",
  };
}

export function HomeSearchScreen({
  initialQuery = "",
  initialView = "search",
  isOpen,
  minSearchQueryLength = DEFAULT_MIN_SEARCH_QUERY_LENGTH,
  onClose,
  onQuerySearchChange,
  onSelectResult,
}: HomeSearchScreenProps) {
  const removeTimerRef = useRef<number | null>(null);
  const lastPublishedQueryRef = useRef("");
  const wasOpenRef = useRef(false);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(initialRecentSearches);
  const [savedSearches, setSavedSearches] = useState(initialSavedSearches);
  const [isSavedView, setIsSavedView] = useState(false);
  const [removingRecentSearchId, setRemovingRecentSearchId] = useState<
    string | number | null
  >(null);

  const trimmedQuery = query.trim();
  const isResultsView = trimmedQuery.length > 0;
  const isAuthenticated = Boolean(getStoredAuthSession());
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debouncedSearchQuery = debouncedQuery.trim();
  const hasEnoughSearchQueryLength = trimmedQuery.length >= minSearchQueryLength;
  const canFetchSearchResults =
    debouncedSearchQuery.length >= minSearchQueryLength;
  const isWaitingForSearchDebounce =
    hasEnoughSearchQueryLength && debouncedSearchQuery !== trimmedQuery;
  const selectedCity = readStoredSelectedCity();
  const {
    data: apiRecentSearches = [],
    error: recentSearchError,
    isError: isRecentSearchError,
    isLoading: isRecentSearchLoading,
    refetch: refetchRecentSearches,
  } = useSearchHistoryQuery({
    enabled: isOpen && isAuthenticated,
  });
  const {
    data: apiSearchResults = [],
    error: searchResultsError,
    isError: isSearchResultsError,
    isLoading: isSearchResultsLoading,
    refetch: refetchSearchResults,
  } = useSearchHistoryQuery({
    enabled: isOpen && isAuthenticated && hasEnoughSearchQueryLength && canFetchSearchResults,
    qsearch: canFetchSearchResults ? debouncedSearchQuery : undefined,
  });
  const {
    data: apiAdvertisementResults,
    error: advertisementSearchError,
    isError: isAdvertisementSearchError,
    isFetching: isAdvertisementSearchLoading,
    refetch: refetchAdvertisementSearch,
  } = useAdvertisementListQuery(
    isOpen && hasEnoughSearchQueryLength && canFetchSearchResults
      ? {
        cityId: selectedCity?.id,
        filters: { query: debouncedSearchQuery },
        page: 1,
        perPage: 12,
      }
      : null,
  );
  const deleteHistoryMutation = useDeleteSearchHistoryMutation();
  const visibleRecentSearches = isAuthenticated && apiRecentSearches.length > 0
    ? apiRecentSearches
    : isAuthenticated
      ? recentSearches
      : [];
  const advertisementResults = (apiAdvertisementResults?.data ?? []).map(
    mapAdToSearchResult,
  );
  const visibleSearchResults =
    advertisementResults.length > 0 ? advertisementResults : apiSearchResults;
  const RecentSearchErrorState = getRequestErrorState(recentSearchError);
  const SearchResultsErrorState = getRequestErrorState(searchResultsError);
  const AdvertisementSearchErrorState = getRequestErrorState(advertisementSearchError);
  const activeErrorState = isResultsView
    ? hasEnoughSearchQueryLength && canFetchSearchResults && isAdvertisementSearchError
      ? AdvertisementSearchErrorState
      : hasEnoughSearchQueryLength && canFetchSearchResults && isSearchResultsError
      ? SearchResultsErrorState
      : null
    : isRecentSearchError
      ? RecentSearchErrorState
      : null;
  const retryActiveError = isResultsView
    ? isAdvertisementSearchError
      ? () => void refetchAdvertisementSearch()
      : () => void refetchSearchResults()
    : () => void refetchRecentSearches();

  useEffect(() => {
    return () => {
      if (removeTimerRef.current !== null) {
        window.clearTimeout(removeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(trimmedQuery);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [trimmedQuery]);

  useEffect(() => {
    if (!isOpen) {
      wasOpenRef.current = false;
      return;
    }

    if (!wasOpenRef.current) {
      setQuery(initialQuery);
      setDebouncedQuery(initialQuery.trim());
      lastPublishedQueryRef.current = initialQuery.trim();
      setIsSavedView(initialView === "saved");
      wasOpenRef.current = true;
    }
  }, [initialQuery, initialView, isOpen]);

  useEffect(() => {
    if (!isOpen || !onQuerySearchChange) return;
    if (isSavedView) return;

    const nextQuery = canFetchSearchResults ? debouncedSearchQuery : "";
    if (nextQuery === lastPublishedQueryRef.current) return;

    lastPublishedQueryRef.current = nextQuery;
    onQuerySearchChange(nextQuery);
  }, [
    canFetchSearchResults,
    debouncedSearchQuery,
    isOpen,
    isSavedView,
    onQuerySearchChange,
  ]);

  const closeSearch = () => {
    setIsSavedView(false);
    setQuery("");
    onClose();
  };

  const deleteRecentSearch = (id: string | number) => {
    if (removingRecentSearchId !== null) return;

    setRemovingRecentSearchId(id);
    removeTimerRef.current = window.setTimeout(() => {
      setRecentSearches((items) => items.filter((item) => item.id !== id));
      deleteHistoryMutation.mutate(String(id));
      setRemovingRecentSearchId(null);
      removeTimerRef.current = null;
    }, REMOVE_TRANSITION_MS);
  };

  const handleDirectSearch = () => {
    if (!trimmedQuery) return;

    onSelectResult?.({ title: trimmedQuery });
  };

  if (isSavedView) {
    return (
      <SavedSearchesView
        isOpen={isOpen}
        savedSearches={savedSearches}
        onBack={() => setIsSavedView(false)}
        onDelete={(id) =>
          setSavedSearches((items) => items.filter((item) => item.id !== id))
        }
      />
    );
  }

  if (!isResultsView && activeErrorState) {
    const ActiveErrorState = activeErrorState;

    return (
      <section
        className={`absolute inset-0 z-40 overflow-hidden bg-white ${isOpen ? "visible" : "invisible"}`}
        aria-hidden={!isOpen}
      >
        <ActiveErrorState
          className="h-full"
          onRetry={retryActiveError}
        />
      </section>
    );
  }

  return (
    <section
      className={`absolute inset-0 z-40 flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl] ${isOpen
        ? "visible"
        : "invisible"
        }`}
      aria-hidden={!isOpen}
    >
      <div className="shrink-0 bg-[#f0f0f0] py-2.5">
        <TopBar
          centerClassName="pl-4"
          centerSlot={
            <SearchField
              isOpen={isOpen}
              query={query}
              onQueryChange={setQuery}
              onSavedClick={() => setIsSavedView(true)}
              onSubmit={handleDirectSearch}
            />
          }
          // className="!bg-white"
          contentClassName="!items-start px-0"
          onBack={closeSearch}
        />
        <div className="flex h-11 items-center justify-start px-4">
          <h2 className="m-0 text-right text-base font-medium leading-6 text-[#1a1a1a]">
            {isResultsView ? "نتایج جستجو" : "جستجوهای اخیر"}
          </h2>
        </div>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pt-4">
        {isResultsView ? (
          !hasEnoughSearchQueryLength ? (
            <div className="flex flex-col">
              <DirectSearchRow query={trimmedQuery} onSelect={handleDirectSearch} />
              <p className="m-0 px-4 py-3 text-right text-xs font-normal leading-5 text-[#808080]">
                برای دریافت نتایج، حداقل {toPersianDigits(String(minSearchQueryLength))} کاراکتر وارد کنید.
              </p>
            </div>
          ) : isWaitingForSearchDebounce || isAdvertisementSearchLoading ? (
            <SearchRowsSkeleton />
          ) : isAdvertisementSearchError ? (
            <AdvertisementSearchErrorState
              className="min-h-full"
              onRetry={() => void refetchAdvertisementSearch()}
            />
          ) : (
            <div className="flex flex-col">
              <DirectSearchRow query={trimmedQuery} onSelect={handleDirectSearch} />
              {isSearchResultsLoading ? (
                <p className="m-0 px-4 py-3 text-right text-xs font-normal leading-5 text-[#808080]">
                  در حال دریافت پیشنهادهای مرتبط...
                </p>
              ) : null}
              {!isSearchResultsError && visibleSearchResults.length > 0 ? (
                visibleSearchResults.map((item) => (
                  <SearchSuggestionRow
                    item={item}
                    key={item.id}
                    onSelect={() => onSelectResult?.(item)}
                    query={trimmedQuery}
                  />
                ))
              ) : null}
              {!isSearchResultsError && visibleSearchResults.length === 0 ? (
                <p className="m-0 px-4 py-3 text-right text-xs font-normal leading-5 text-[#808080]">
                  برای جستجوی همین عبارت، ردیف بالا را انتخاب کنید.
                </p>
              ) : null}
            </div>
          )
        ) : isRecentSearchLoading ? (
          <SearchRowsSkeleton />
        ) : isRecentSearchError ? (
          <RecentSearchErrorState
            className="min-h-full"
            onRetry={() => void refetchRecentSearches()}
          />
        ) : visibleRecentSearches.length > 0 ? (
          <div className="flex flex-col">
            {visibleRecentSearches.map((item, index) => (
              <div
                className={`${removingRecentSearchId === item.id
                  ? "hidden"
                  : ""
                  }`}
                key={item.id}
              >
                <RecentSearchRow
                  item={item}
                  isDeleting={removingRecentSearchId === item.id}
                  onDelete={() => deleteRecentSearch(item.id)}
                />
                {index < visibleRecentSearches.length - 1 ? (
                  <div className="mx-4 flex h-[17px] items-center">
                    <span className="h-px w-full bg-[#cccccc]" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <SearchErrors variant="no-search" />
        )}
      </main>
    </section>
  );
}

function SavedSearchesView({
  isOpen,
  savedSearches,
  onBack,
  onDelete,
}: {
  isOpen: boolean;
  savedSearches: SavedSearch[];
  onBack: () => void;
  onDelete: (id: string | number) => void;
}) {
  const removeTimerRef = useRef<number | null>(null);
  const [removingSavedSearchId, setRemovingSavedSearchId] = useState<
    string | number | null
  >(null);

  useEffect(() => {
    return () => {
      if (removeTimerRef.current !== null) {
        window.clearTimeout(removeTimerRef.current);
      }
    };
  }, []);

  const deleteSavedSearch = (id: string | number) => {
    if (removingSavedSearchId !== null) return;

    setRemovingSavedSearchId(id);
    removeTimerRef.current = window.setTimeout(() => {
      onDelete(id);
      setRemovingSavedSearchId(null);
      removeTimerRef.current = null;
    }, REMOVE_TRANSITION_MS);
  };

  return (
    <section
      className={`absolute inset-0 z-40 flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl] ${isOpen
        ? "visible"
        : "invisible"
        }`}
      aria-hidden={!isOpen}
    >
      <TopBar onBack={onBack} title="جستجوی ذخیره شده" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        {savedSearches.length > 0 ? (
          <div className="flex flex-col gap-2 bg-[#f0f0f0]">
            {savedSearches.map((item) => (
              <div
                className={`${removingSavedSearchId === item.id
                  ? "hidden"
                  : ""
                  }`}
                key={item.id}
              >
                <SavedSearchRow
                  item={item}
                  isDeleting={removingSavedSearchId === item.id}
                  onDelete={() => deleteSavedSearch(item.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <SearchErrors variant="no-saved-search" />
        )}
      </main>
    </section>
  );
}

function SearchRowsSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 py-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="h-14 rounded-xl bg-[#f0f0f0]" key={index} />
      ))}
    </div>
  );
}

function SearchField({
  isOpen,
  query,
  onQueryChange,
  onSavedClick,
  onSubmit,
}: {
  isOpen: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  onSavedClick: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="relative mt-2 flex h-12 min-w-0 flex-1 items-center rounded-xl border border-[#808080] bg-white">
      <input
        aria-label="جستجو"
        className="home-search-input h-full w-full appearance-none rounded-[inherit] border-0 bg-transparent py-0 pl-12 pr-12 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
        type="search"
        placeholder="جستجو"
        value={query}
        tabIndex={isOpen ? 0 : -1}
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;

          event.preventDefault();
          onSubmit();
        }}
      />


      <button
        className="absolute right-3 grid h-8 w-8 place-items-center text-[#1a1a1a]"
        type="button"
        aria-label="جستجوی ذخیره شده"
        tabIndex={isOpen ? 0 : -1}
        onClick={onSavedClick}
      >
        <SearchBookmarkIcon />
      </button>

      {query.length > 0 ? (
        <button
          className="absolute left-3 grid h-8 w-8 place-items-center text-[#808080]"
          type="button"
          aria-label="پاک کردن جستجو"
          tabIndex={isOpen ? 0 : -1}
          onClick={() => onQueryChange("")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.15 15.15L8.85068 8.85M8.85136 15.15L15.1507 8.85M21 12C21 7.02943 16.9705 3 12 3C7.02943 3 3 7.02943 3 12C3 16.9705 7.02943 21 12 21C16.9705 21 21 16.9705 21 12Z"
              stroke="#808080"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

function RecentSearchRow({
  item,
  isDeleting,
  onDelete,
}: {
  item: RecentSearch;
  isDeleting: boolean;
  onDelete: () => void;
}) {
  const pointerStartXRef = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const finishSwipe = () => {
    if (dragOffset >= SWIPE_DELETE_THRESHOLD) {
      onDelete();
    }

    setDragOffset(0);
    pointerStartXRef.current = null;
  };

  return (
    <article
      className="relative h-[82px] overflow-hidden bg-white"
      onPointerDown={(event) => {
        pointerStartXRef.current = event.clientX;
      }}
      onPointerMove={(event) => {
        if (pointerStartXRef.current === null || isDeleting) return;

        setDragOffset(Math.max(0, event.clientX - pointerStartXRef.current));
      }}
      onPointerCancel={finishSwipe}
      onPointerUp={finishSwipe}
    >
      <button
        className="absolute inset-y-0 left-0 flex w-[72px] flex-col items-center justify-center gap-1 bg-[#fdecec] text-xs font-medium leading-4 text-[#ee3623]"
        type="button"
        aria-label="Ø­Ø°Ù Ø¬Ø³ØªØ¬ÙˆÛŒ Ø§Ø®ÛŒØ±"
        disabled={isDeleting}
        onClick={onDelete}
      >
        <TrashIcon />
        <span>Ø­Ø°Ù</span>
      </button>
      <div
        className="h-full bg-white px-4 pb-3"
        style={{ transform: `translateX(${Math.min(dragOffset, 72)}px)` }}
      >
        <div className="relative h-12 w-full">
          <button
            className="absolute left-0 top-0 grid h-12 w-12 place-items-center text-[#4d4d4d]"
            type="button"
            aria-label="حذف جستجوی اخیر"
            disabled={isDeleting}
            onClick={onDelete}
          >
            <SmallCloseIcon />
          </button>

          <h3 className="m-0 flex h-12 w-full items-center justify-start pl-12 text-right text-base font-medium leading-6 text-[#1a1a1a]">
            {item.title}
          </h3>
        </div>

        <div className="flex h-5 w-full items-center justify-start gap-2">
          <span className="shrink-0 text-sm font-medium leading-5 text-[#808080]">
            {item.subtitle}
          </span>

          {item.tags.map((tag) => (
            <span
              className="flex h-5 shrink-0 items-center rounded-md bg-[#e9eaee] px-2 text-xs font-medium leading-4 text-[#4d4d4d]"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function DirectSearchRow({
  onSelect,
  query,
}: {
  onSelect: () => void;
  query: string;
}) {
  return (
    <button
      className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-3 border-b border-[#cccccc] bg-white px-4 py-2.5 text-right [direction:ltr] min-[390px]:min-h-[73px] min-[390px]:gap-4 min-[390px]:py-3"
      onClick={onSelect}
      type="button"
    >
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0048c414] px-2.5 py-1 text-xs font-medium leading-4 text-[#0048c4] [direction:rtl]">
        جستجو
      </span>

      <span className="flex min-w-0 flex-col items-start [direction:rtl]">
        <strong className="text-sm font-normal leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6">
          جستجوی «{query}»
        </strong>
        <span className="text-sm font-normal leading-5 text-[#a6a6a6]">
          نمایش آگهی‌های مرتبط با این عبارت
        </span>
      </span>
    </button>
  );
}

function SearchSuggestionRow({
  item,
  onSelect,
  query,
}: {
  item: SearchHistoryItem;
  onSelect: () => void;
  query: string;
}) {
  return (
    <button
      className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-3 border-b border-[#cccccc] bg-white px-4 py-2.5 text-right [direction:ltr] last:border-b-0 min-[390px]:min-h-[73px] min-[390px]:gap-4 min-[390px]:py-3"
      onClick={onSelect}
      type="button"
    >
      <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-normal leading-4 text-[#a6a6a6] [direction:ltr]">
        <span>آگهی</span>
      </span>

      <span className="flex min-w-0 flex-col items-start [direction:rtl]">
        <strong className="text-sm font-normal leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6">
          {query || item.title}
        </strong>
        {item.subtitle ? (
          <span className="text-sm font-normal leading-5 text-[#a6a6a6]">
            {item.subtitle}
          </span>
        ) : null}
      </span>
    </button>
  );
}

function SavedSearchRow({
  item,
  isDeleting,
  onDelete,
}: {
  item: SavedSearch;
  isDeleting: boolean;
  onDelete: () => void;
}) {
  return (
    <article className="h-[122px] shrink-0 bg-white px-4 pb-4 pt-2 [direction:rtl]">
      <div className="flex h-12 w-full items-center gap-2 [direction:ltr]">
        <button
          className="grid h-12 w-12 shrink-0 place-items-center text-[#4d4d4d]"
          type="button"
          aria-label="حذف جستجوی ذخیره شده"
          disabled={isDeleting}
          onClick={onDelete}
        >
          <TrashIcon />
        </button>

        <h3 className="m-0 flex h-12 min-w-0 flex-1 items-center justify-start text-right text-base font-medium leading-6 text-[#1a1a1a] [direction:rtl]">
          {item.title}
        </h3>

        <ApartmentIcon />
      </div>

      <div className="mt-0.5 flex h-12 w-full flex-wrap content-start justify-start gap-x-2 gap-y-2 pr-8 [direction:rtl]">
        {item.tags.map((tag) => (
          <span
            className="flex h-5 shrink-0 items-center rounded-md bg-[#e9eaee] px-2 text-xs font-medium leading-4 text-[#4d4d4d]"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}


function SearchBookmarkIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 4.5C6 3.11929 7.11929 2 8.5 2H15.5C16.8807 2 18 3.11929 18 4.5V21L12 17L6 21V4.5Z"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SmallCloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.15 15.15L8.85068 8.85M8.85136 15.15L15.1507 8.85M21 12C21 7.02943 16.9705 3 12 3C7.02943 3 3 7.02943 3 12C3 16.9705 7.02943 21 12 21C16.9705 21 21 16.9705 21 12Z"
        stroke="#808080"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.6667 6.15L17.879 19.3089C17.8221 20.2589 17.0445 21 16.1044 21H7.89552C6.95545 21 6.17787 20.2589 6.121 19.3089L5.33333 6.15M4 6.15H8.44444M8.44444 6.15L9.54689 3.54547C9.68696 3.21456 10.0083 3 10.3639 3H13.6361C13.9916 3 14.3131 3.21456 14.4531 3.54547L15.5556 6.15M8.44444 6.15H15.5556M20 6.15H15.5556M9.77778 16.05V10.65M14.2222 16.05V10.65"
        stroke="#4D4D4D"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function ApartmentIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.9492 21V5C17.9492 4.00589 16.9492 3 15.9492 3H7.94922C6.94922 3 5.94922 4.00589 5.94922 5V21M4 21H20M14 21V17C14 16.5 13.5 16 13 16H11C10.5 16 10 16.5 10 17V21M14 7H10M14 10H10M14 13H10"
        stroke="#4D4D4D"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
