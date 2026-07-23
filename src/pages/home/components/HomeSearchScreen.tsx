import { useEffect, useRef, useState } from "react";

import {
  useDeleteSavedSearchMutation,
  useSavedSearchesQuery,
} from "../../../hooks/saved-search.hooks";
import { useQuickAdvertisementSearchQuery } from "../../../hooks/quick-advertisement-search.hooks";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { TopBar } from "../../../components/TopBar";
import LinearDelete from "../../../components/(icons)/LinearDelete";
import { getRequestErrorState } from "../../../components/ErrorState";
import SearchErrors from "./SearchErrors";
import type { SearchHistoryItem } from "../../../services/search-history.service";
import { getStoredAuthSession } from "../../../auth/auth-storage";
import type { SavedSearchItem } from "../../../services/saved-search.service";
import type { QuickAdvertisementSearchItem } from "../../../services/quick-advertisement-search.service";

type HomeSearchScreenProps = {
  initialQuery?: string;
  initialView?: "search" | "saved";
  isOpen: boolean;
  minSearchQueryLength?: number;
  onClose: () => void;
  onQuerySearchChange?: (query: string) => void;
  onSelectResult?: (item: { formCode?: string; title: string }) => void;
};

const DEFAULT_MIN_SEARCH_QUERY_LENGTH = 1;
const REMOVE_TRANSITION_MS = 180;
const SWIPE_DELETE_THRESHOLD = 72;

function useDelayedSearchDelete(
  onDelete: (id: string | number) => void,
) {
  const removeTimerRef = useRef<number | null>(null);
  const [removingId, setRemovingId] = useState<string | number | null>(null);

  useEffect(() => {
    return () => {
      if (removeTimerRef.current !== null) {
        window.clearTimeout(removeTimerRef.current);
      }
    };
  }, []);

  const deleteItem = (id: string | number) => {
    if (removingId !== null) return;

    setRemovingId(id);
    removeTimerRef.current = window.setTimeout(() => {
      onDelete(id);
      setRemovingId(null);
      removeTimerRef.current = null;
    }, REMOVE_TRANSITION_MS);
  };

  return { deleteItem, removingId };
}

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

export function HomeSearchScreen({
  initialQuery = "",
  initialView = "search",
  isOpen,
  minSearchQueryLength = DEFAULT_MIN_SEARCH_QUERY_LENGTH,
  onClose,
  onQuerySearchChange,
  onSelectResult,
}: HomeSearchScreenProps) {
  const lastPublishedQueryRef = useRef("");
  const wasOpenRef = useRef(false);
  const [query, setQuery] = useState("");
  const [isSavedView, setIsSavedView] = useState(false);

  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery, 250);
  const isResultsView = trimmedQuery.length > 0;
  const isAuthenticated = Boolean(getStoredAuthSession());
  const hasEnoughSearchQueryLength = trimmedQuery.length >= minSearchQueryLength;
  const hasEnoughDebouncedQueryLength =
    debouncedQuery.length >= minSearchQueryLength;
  const isWaitingForDebounce =
    hasEnoughSearchQueryLength && trimmedQuery !== debouncedQuery;
  const savedSearchesQuery = useSavedSearchesQuery(isOpen && isAuthenticated);
  const deleteSavedSearchMutation = useDeleteSavedSearchMutation();
  const {
    data: quickSearchResults = [],
    error: quickSearchError,
    isError: isQuickSearchError,
    isFetching: isQuickSearchFetching,
    refetch: refetchQuickSearch,
  } = useQuickAdvertisementSearchQuery({
    enabled: isOpen && hasEnoughDebouncedQueryLength,
    query: debouncedQuery,
  });
  const {
    deleteItem: deleteRecentSearch,
    removingId: removingRecentSearchId,
  } = useDelayedSearchDelete((id) => {
    deleteSavedSearchMutation.mutate(String(id));
  });
  const visibleRecentSearches = isAuthenticated
    ? savedSearchesQuery.data ?? []
    : [];
  const RecentSearchErrorState = getRequestErrorState(savedSearchesQuery.error);
  const QuickSearchErrorState = getRequestErrorState(quickSearchError);
  const activeErrorState = isResultsView
    ? hasEnoughSearchQueryLength && !isWaitingForDebounce && isQuickSearchError
      ? QuickSearchErrorState
      : null
    : savedSearchesQuery.isError
      ? RecentSearchErrorState
      : null;
  const retryActiveError = isResultsView
    ? () => void refetchQuickSearch()
    : () => void savedSearchesQuery.refetch();

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

    const nextQuery = hasEnoughSearchQueryLength ? trimmedQuery : "";
    if (nextQuery === lastPublishedQueryRef.current) return;

    lastPublishedQueryRef.current = nextQuery;
    onQuerySearchChange(nextQuery);
  }, [
    hasEnoughSearchQueryLength,
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

          <button
            className="flex shrink-0 items-center gap-1 text-sm font-medium leading-5 text-[#0048c4] [direction:ltr]"
            onClick={() => setIsSavedView(true)}
            type="button"
          >
            <SavedSearchChevronIcon />
            <span className="[direction:rtl]">ذخیره شده‌ها</span>
          </button>
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
          ) : isWaitingForDebounce || isQuickSearchFetching ? (
            <SearchRowsSkeleton />
          ) : isQuickSearchError ? (
            <QuickSearchErrorState
              className="min-h-full"
              onRetry={() => void refetchQuickSearch()}
            />
          ) : quickSearchResults.length > 0 ? (
            <div className="flex flex-col">
              {quickSearchResults.map((item) => (
                <QuickSearchResultRow
                  item={item}
                  key={`${item.formCode}-${item.category}-${item.title}`}
                  onSelect={() =>
                    onSelectResult?.({
                      formCode: item.formCode,
                      title: item.title,
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <SearchErrors variant="no-search" />
          )
        ) : savedSearchesQuery.isLoading ? (
          <SearchRowsSkeleton />
        ) : savedSearchesQuery.isError ? (
          <RecentSearchErrorState
            className="min-h-full"
            onRetry={() => void savedSearchesQuery.refetch()}
          />
        ) : visibleRecentSearches.length > 0 ? (
          <div className="flex flex-col">
            {visibleRecentSearches.map((item) => (
              <SearchRecordRow
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

                  onSelectResult?.({ title: item.title });
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
  const {
    deleteItem: deleteSavedSearch,
    removingId: removingSavedSearchId,
  } = useDelayedSearchDelete(onDelete);

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
              <SearchRecordRow
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
    <div className="flex flex-col bg-white" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          className="flex min-h-[73px] items-center justify-between gap-4 border-b border-[#f0f0f0] px-4 py-3"
          key={index}
        >
          <div className="h-4 w-16 animate-pulse rounded-full bg-[#f0f0f0]" />
          <div className="flex flex-1 flex-col items-end gap-2">
            <div className="h-5 w-24 animate-pulse rounded-full bg-[#f0f0f0]" />
            <div className="h-4 w-40 max-w-full animate-pulse rounded-full bg-[#f0f0f0]" />
          </div>
        </div>
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
    <div className="relative flex h-12 w-full min-w-0 items-center rounded-xl border-2 border-[#0048c4] bg-white px-3">
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

function SearchRecordRow({
  item,
  isDeleting,
  onDelete,
  onSelect,
}: {
  item: SearchHistoryItem | SavedSearchItem;
  isDeleting: boolean;
  onDelete: () => void;
  onSelect: () => void;
}) {
  const pointerStartXRef = useRef<number | null>(null);
  const didSwipeRef = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const tags =
    item.content.length > 0
      ? item.content
      : "subtitle" in item && item.subtitle
        ? [item.subtitle]
        : [];

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
      className={`relative min-h-[118px] overflow-hidden border-b border-[#e6e6e6] bg-[#fdecec] last:border-b-0 ${isDeleting ? "opacity-60" : ""}`}
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
        className="absolute inset-y-0 left-0 flex w-20 flex-col items-center justify-center gap-1 bg-[#fdecec] text-[#d92d20]"
        disabled={isDeleting}
        onClick={onDelete}
        type="button"
      >
        <LinearDelete className="h-6 w-6" />
        <span className="text-xs font-medium!">حذف</span>
      </button>

      <button
        className="relative flex min-h-[118px] w-full flex-col bg-white px-3 py-4 text-right transition-transform duration-150 ease-out"
        disabled={isDeleting}
        onClick={() => {
          if (!didSwipeRef.current) onSelect();
        }}
        style={{ transform: `translateX(${dragOffset}px)` }}
        type="button"
      >
        <span className="flex w-full items-center justify-start gap-2">
          <span className="shrink-0">
            <ApartmentIcon />
          </span>
          <strong className="min-w-0 flex-1 whitespace-normal break-words text-base font-medium leading-6 text-[#1a1a1a]">
            {item.title}
          </strong>
        </span>

        {tags.length > 0 ? (
          <span className="mt-2 flex w-full flex-wrap justify-start gap-2 pr-8">
            {tags.map((tag) => (
              <span
                className="max-w-full whitespace-normal break-words rounded-md bg-[#f0f0f0] px-2 py-1 text-right text-xs font-medium leading-4 text-[#4d4d4d]"
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

function QuickSearchResultRow({
  item,
  onSelect,
}: {
  item: QuickAdvertisementSearchItem;
  onSelect: () => void;
}) {
  const formattedCount =
    item.count >= 1000
      ? `${toPersianDigits(1000)}+ آگهی`
      : `${toPersianDigits(item.count)} آگهی`;

  return (
    <button
      className="flex min-h-[73px] w-full cursor-pointer justify-between gap-4 border-b border-[#f0f0f0] bg-white px-4 py-3 text-right [direction:ltr] last:border-b-0 active:bg-[#fafafa]"
      onClick={onSelect}
      type="button"
    >
      <span className="inline-flex shrink-0 text-xs font-normal leading-5 text-[#a6a6a6] [direction:rtl]">
        {formattedCount}
      </span>

      <span className="flex min-w-0 flex-1 flex-col items-start [direction:rtl]">
        <strong className="max-w-full truncate text-base font-normal leading-6 text-[#1a1a1a]">
          {item.title}
        </strong>
        {item.category ? (
          <span className="max-w-full truncate text-sm font-normal leading-5 text-[#a6a6a6]">
            {item.category}
          </span>
        ) : null}
      </span>
    </button>
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
