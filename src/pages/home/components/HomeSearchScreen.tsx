import { useEffect, useRef, useState } from "react";

import {
  useDeleteSearchHistoryMutation,
  useSearchHistoryQuery,
} from "../../../hooks/search-history.hooks";
import {
  useDeleteSavedSearchMutation,
  useSavedSearchesQuery,
} from "../../../hooks/saved-search.hooks";
import { useAdvertisementListQuery } from "../../../hooks/advertisement.hooks";
import { TopBar } from "../../../components/TopBar";
import { AdCardSkeleton } from "../../../components/AdCardSkeleton";
import LinearDelete from "../../../components/(icons)/LinearDelete";
import { getRequestErrorState } from "../../../components/ErrorState";
import SearchErrors from "./SearchErrors";
import type { SearchHistoryItem } from "../../../services/search-history.service";
import type { AdvertisementItem } from "../../../services/advertisement.service";
import { getStoredAuthSession } from "../../../auth/auth-storage";
import { readStoredSelectedCity } from "../../../lib/selectedCityStorage";
import type { SavedSearchItem } from "../../../services/saved-search.service";

type HomeSearchScreenProps = {
  advertisementSearchCityId?: string;
  advertisementSearchPerPage?: number;
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

  const title = readAdText(item, ["title", "label"]) || "آگهی ملک";
  const tags = [city, neighborhood].filter(Boolean);

  return {
    content: tags,
    filters: {},
    id: String(item.id ?? item._id ?? `ad-search-${index + 1}`),
    subtitle: [category, neighborhood || city].filter(Boolean).join("، "),
    tags,
    title,
    url: `/search?query=${encodeURIComponent(title)}`,
  };
}

export function HomeSearchScreen({
  advertisementSearchCityId,
  advertisementSearchPerPage = 12,
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
  const [isSavedView, setIsSavedView] = useState(false);
  const [removingRecentSearchId, setRemovingRecentSearchId] = useState<
    string | number | null
  >(null);

  const trimmedQuery = query.trim();
  const isResultsView = trimmedQuery.length > 0;
  const isAuthenticated = Boolean(getStoredAuthSession());
  const hasEnoughSearchQueryLength = trimmedQuery.length >= minSearchQueryLength;
  const canFetchSearchResults = hasEnoughSearchQueryLength;
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
    qsearch: canFetchSearchResults ? trimmedQuery : undefined,
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
        cityId: advertisementSearchCityId ?? selectedCity?.id,
        filters: { query: trimmedQuery },
        page: 1,
        perPage: advertisementSearchPerPage,
      }
      : null,
  );
  const deleteHistoryMutation = useDeleteSearchHistoryMutation();
  const savedSearchesQuery = useSavedSearchesQuery(
    isOpen && isSavedView && isAuthenticated,
  );
  const deleteSavedSearchMutation = useDeleteSavedSearchMutation();
  const visibleRecentSearches = isAuthenticated ? apiRecentSearches : [];
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
    if (!isOpen) {
      wasOpenRef.current = false;
      return;
    }

    if (!wasOpenRef.current) {
      setQuery(initialQuery);
      lastPublishedQueryRef.current = initialQuery.trim();
      setIsSavedView(initialView === "saved");
      wasOpenRef.current = true;
    }
  }, [initialQuery, initialView, isOpen]);

  useEffect(() => {
    if (!isOpen || !onQuerySearchChange) return;
    if (isSavedView) return;

    const nextQuery = canFetchSearchResults ? trimmedQuery : "";
    if (nextQuery === lastPublishedQueryRef.current) return;

    lastPublishedQueryRef.current = nextQuery;
    onQuerySearchChange(nextQuery);
  }, [
    canFetchSearchResults,
    isOpen,
    isSavedView,
    onQuerySearchChange,
    trimmedQuery,
  ]);

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);

    if (nextQuery.trim()) return;

    if (
      !isSavedView &&
      onQuerySearchChange &&
      lastPublishedQueryRef.current !== ""
    ) {
      lastPublishedQueryRef.current = "";
      onQuerySearchChange("");
    }
  };

  const closeSearch = () => {
    setIsSavedView(false);
    setQuery("");
    onClose();
  };

  const deleteRecentSearch = (id: string | number) => {
    if (removingRecentSearchId !== null) return;

    setRemovingRecentSearchId(id);
    removeTimerRef.current = window.setTimeout(() => {
      deleteHistoryMutation.mutate(String(id));
      setRemovingRecentSearchId(null);
      removeTimerRef.current = null;
    }, REMOVE_TRANSITION_MS);
  };

  const handleDirectSearch = () => {
    if (trimmedQuery.length < minSearchQueryLength) return;

    onSelectResult?.({ title: trimmedQuery });
  };

  if (isSavedView) {
    return (
      <SavedSearchesView
        isOpen={isOpen}
        isError={savedSearchesQuery.isError}
        isLoading={savedSearchesQuery.isLoading}
        savedSearches={savedSearchesQuery.data ?? []}
        onBack={() => setIsSavedView(false)}
        onDelete={(id) => deleteSavedSearchMutation.mutate(String(id))}
        onRetry={() => void savedSearchesQuery.refetch()}
        onSelect={(item) => {
          setIsSavedView(false);
          setQuery("");
          onClose();

          if (item.url.startsWith("/")) {
            window.history.pushState({}, "", item.url);
            window.dispatchEvent(new PopStateEvent("popstate"));
            return;
          }

          onSelectResult?.({ title: item.title });
        }}
      />
    );
  }

  if (!isResultsView && activeErrorState) {
    const ActiveErrorState = activeErrorState;

    return (
      <section
        className={`absolute inset-0 z-[600] overflow-hidden bg-white ${isOpen ? "visible" : "invisible"}`}
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
      className={`absolute inset-0 z-[600] flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl] ${isOpen
        ? "visible"
        : "invisible"
        }`}
      aria-hidden={!isOpen}
    >
      <div className="shrink-0 bg-[#f0f0f0]">
        <TopBar
          centerClassName="px-2"
          centerSlot={
            <SearchField
              isOpen={isOpen}
              query={query}
              onQueryChange={updateQuery}
            />
          }
          contentClassName="px-2"
          onBack={closeSearch}
        />
        <div className="flex h-11 items-center justify-between gap-4 px-4">
          <h2 className="m-0 text-right text-base font-medium leading-6 text-[#1a1a1a]">
            {isResultsView ? "نتایج جستجو" : "جستجوهای اخیر"}
          </h2>

          {!isResultsView ? (
            <button
              className="flex shrink-0 items-center gap-1 text-sm font-medium leading-5 text-[#0048c4] [direction:ltr]"
              onClick={() => setIsSavedView(true)}
              type="button"
            >
              <SavedSearchChevronIcon />
              <span className="[direction:rtl]">ذخیره شده‌ها</span>
            </button>
          ) : null}
        </div>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        {isResultsView ? (
          !hasEnoughSearchQueryLength ? (
            <div className="flex flex-col">
              <p className="m-0 px-4 py-3 text-right text-xs font-normal leading-5 text-[#808080]">
                برای دریافت نتایج، حداقل {toPersianDigits(String(minSearchQueryLength))} کاراکتر وارد کنید.
              </p>
            </div>
          ) : isAdvertisementSearchLoading ? (
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
            {visibleRecentSearches.map((item) => (
              <RecentSearchRow
                item={item}
                isDeleting={removingRecentSearchId === item.id}
                key={item.id}
                onDelete={() => deleteRecentSearch(item.id)}
                onSelect={() => {
                  if (item.url) {
                    setQuery("");
                    onClose();
                    window.history.pushState({}, "", item.url);
                    window.dispatchEvent(new PopStateEvent("popstate"));
                    return;
                  }

                  onSelectResult?.(item);
                }}
              />
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
  isError,
  isLoading,
  savedSearches,
  onBack,
  onDelete,
  onRetry,
  onSelect,
}: {
  isOpen: boolean;
  isError: boolean;
  isLoading: boolean;
  savedSearches: SavedSearchItem[];
  onBack: () => void;
  onDelete: (id: string | number) => void;
  onRetry: () => void;
  onSelect: (item: SavedSearchItem) => void;
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
      className={`absolute inset-0 z-[600] flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl] ${isOpen
        ? "visible"
        : "invisible"
        }`}
      aria-hidden={!isOpen}
    >
      <TopBar onBack={onBack} title="جستجوی ذخیره شده" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        {isLoading ? (
          <SearchRowsSkeleton />
        ) : isError ? (
          <button
            className="mx-4 my-8 rounded-xl border border-[#0048c4] px-4 py-3 text-sm font-medium text-[#0048c4]"
            onClick={onRetry}
            type="button"
          >
            دریافت جستجوهای ذخیره‌شده ناموفق بود؛ تلاش دوباره
          </button>
        ) : savedSearches.length > 0 ? (
          <div className="flex flex-col bg-white">
            {savedSearches.map((item) => (
              <SavedSearchRow
                item={item}
                isDeleting={removingSavedSearchId === item.id}
                key={item.id}
                onDelete={() => deleteSavedSearch(item.id)}
                onSelect={() => onSelect(item)}
              />
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
    <div className="flex flex-col bg-[#f0f0f0]" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <AdCardSkeleton key={index} />
      ))}
    </div>
  );
}

function SearchField({
  isOpen,
  query,
  onQueryChange,
}: {
  isOpen: boolean;
  query: string;
  onQueryChange: (query: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const animationFrame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [isOpen]);

  return (
    <div className="relative flex h-12 w-full min-w-0 items-center rounded-xl border border-[#808080] bg-white px-3">
      <input
        aria-label="جستجو"
        className="home-search-input h-full w-full appearance-none rounded-[inherit] border-0 bg-transparent pl-9 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
        type="search"
        placeholder="جستجو"
        ref={inputRef}
        value={query}
        tabIndex={isOpen ? 0 : -1}
        onChange={(event) => onQueryChange(event.target.value)}
      />

      {query.length > 0 ? (
        <button
          className="absolute left-2 grid h-8 w-8 place-items-center text-[#808080]"
          type="button"
          aria-label="پاک کردن جستجو"
          tabIndex={isOpen ? 0 : -1}
          onClick={() => onQueryChange("")}
        >
          <ClearSearchIcon />
        </button>
      ) : null}
    </div>
  );
}

function RecentSearchRow({
  item,
  isDeleting,
  onDelete,
  onSelect,
}: {
  item: SearchHistoryItem;
  isDeleting: boolean;
  onDelete: () => void;
  onSelect: () => void;
}) {
  const pointerStartXRef = useRef<number | null>(null);
  const didSwipeRef = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const tags = item.tags.length > 0 ? item.tags : item.subtitle ? [item.subtitle] : [];

  const finishSwipe = () => {
    if (dragOffset >= SWIPE_DELETE_THRESHOLD && !isDeleting) onDelete();
    const shouldSuppressClick = didSwipeRef.current;
    setDragOffset(0);
    pointerStartXRef.current = null;

    if (shouldSuppressClick) {
      window.setTimeout(() => {
        didSwipeRef.current = false;
      }, 0);
    }
  };

  return (
    <article
      className={`relative h-[96px] overflow-hidden border-b border-[#e6e6e6] bg-[#fdecec] last:border-b-0 ${isDeleting ? "opacity-60" : ""}`}
      onPointerCancel={finishSwipe}
      onPointerDown={(event) => {
        if (isDeleting) return;
        pointerStartXRef.current = event.clientX;
        didSwipeRef.current = false;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (pointerStartXRef.current === null || isDeleting) return;
        const offset = Math.min(80, Math.max(0, event.clientX - pointerStartXRef.current));
        if (offset > 5) didSwipeRef.current = true;
        setDragOffset(offset);
      }}
      onPointerUp={finishSwipe}
      style={{ touchAction: "pan-y" }}
    >
      <button
        aria-label={`حذف ${item.title}`}
        className="absolute inset-y-0 left-0 flex w-20 items-center justify-center bg-[#fdecec] text-[#d92d20]"
        disabled={isDeleting}
        onClick={onDelete}
        type="button"
      >
        <LinearDelete className="h-6 w-6" />
      </button>

      <button
        className="relative flex w-full flex-col justify-center bg-white px-4 py-3 text-right transition-transform duration-150 ease-out"
        disabled={isDeleting}
        onClick={() => {
          if (!didSwipeRef.current) onSelect();
        }}
        style={{ transform: `translateX(${dragOffset}px)` }}
        type="button"
      >
        <span className="flex w-full items-center justify-start gap-2">
          <ApartmentIcon />
          <strong className="min-w-0 flex-1 text-base font-medium leading-6 text-[#1a1a1a]">
            {item.title}
          </strong>
        </span>

        {tags.length > 0 ? (
          <span className="mt-2 flex max-h-7 flex-nowrap justify-start gap-2 overflow-hidden pr-8">
            {tags.map((tag) => (
              <span
                className="rounded-md bg-[#f0f0f0] px-2 py-1 text-xs font-medium leading-4 text-[#4d4d4d]"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </span>
        ) : null}
      </button>
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
  onSelect,
}: {
  item: SavedSearchItem;
  isDeleting: boolean;
  onDelete: () => void;
  onSelect: () => void;
}) {
  const pointerStartXRef = useRef<number | null>(null);
  const didSwipeRef = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);

  const finishSwipe = () => {
    if (dragOffset >= SWIPE_DELETE_THRESHOLD && !isDeleting) onDelete();
    const shouldSuppressClick = didSwipeRef.current;
    setDragOffset(0);
    pointerStartXRef.current = null;

    if (shouldSuppressClick) {
      window.setTimeout(() => {
        didSwipeRef.current = false;
      }, 0);
    }
  };

  return (
    <article
      className={`relative h-[96px] overflow-hidden border-b border-[#e6e6e6] bg-[#fdecec] last:border-b-0 ${isDeleting ? "opacity-60" : ""}`}
      onPointerCancel={finishSwipe}
      onPointerDown={(event) => {
        if (isDeleting) return;
        pointerStartXRef.current = event.clientX;
        didSwipeRef.current = false;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (pointerStartXRef.current === null || isDeleting) return;
        const offset = Math.min(80, Math.max(0, event.clientX - pointerStartXRef.current));
        if (offset > 5) didSwipeRef.current = true;
        setDragOffset(offset);
      }}
      onPointerUp={finishSwipe}
      style={{ touchAction: "pan-y" }}
    >
      <button
        aria-label={`حذف ${item.title}`}
        className="absolute inset-y-0 left-0 flex w-20 items-center justify-center bg-[#fdecec] text-[#d92d20]"
        disabled={isDeleting}
        onClick={onDelete}
        type="button"
      >
        <LinearDelete className="h-6 w-6" />
      </button>

      <button
        className="relative flex w-full flex-col justify-center bg-white px-4 py-3 text-right transition-transform duration-150 ease-out"
        disabled={isDeleting}
        onClick={() => {
          if (!didSwipeRef.current) onSelect();
        }}
        style={{ transform: `translateX(${dragOffset}px)` }}
        type="button"
      >
        <span className="flex w-full items-center justify-start gap-2">
          <ApartmentIcon />
          <strong className="min-w-0 flex-1 text-base font-medium leading-6 text-[#1a1a1a]">
            {item.title}
          </strong>
        </span>

        {item.content.length > 0 ? (
          <span className="mt-2 flex max-h-7 flex-nowrap justify-start gap-2 overflow-hidden pr-8">
            {item.content.map((tag) => (
              <span
                className="rounded-md bg-[#f0f0f0] px-2 py-1 text-xs font-medium leading-4 text-[#4d4d4d]"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </span>
        ) : null}
      </button>
    </article>
  );
}

function ClearSearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path
        d="M15.15 15.15L8.85068 8.85M8.85136 15.15L15.1507 8.85M21 12C21 7.02943 16.9705 3 12 3C7.02943 3 3 7.02943 3 12C3 16.9705 7.02943 21 12 21C16.9705 21 21 16.9705 21 12Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function SavedSearchChevronIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path
        d="M9.5 4.5L6 8L9.5 11.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
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
