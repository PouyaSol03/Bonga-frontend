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
import { SearchInputBar } from "../../../components/ui/SearchBar";
import SearchErrors from "./SearchErrors";
import type { SearchHistoryItem } from "../../../services/search-history.service";
import { getStoredAuthSession } from "../../../auth/auth-storage";
import type { SavedSearchItem } from "../../../services/saved-search.service";
import type { QuickAdvertisementSearchItem } from "../../../services/quick-advertisement-search.service";
import { Typography } from "../../../components/ui/Typography";
import LinearArrowLeft1 from "../../../components/(icons)/LinearArrowLeft1";
import { Button } from "../../../components/ui/Button";

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
const SWIPE_REVEAL_WIDTH = 59;
const SWIPE_REVEAL_THRESHOLD = 28;

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
          centerClassName="pr-1"
          centerSlot={
            <SearchField
              isOpen={isOpen}
              query={query}
              onQueryChange={updateQuery}
            />
          }
          contentClassName="pl-4 pr-1"
          onBack={closeSearch}
        />
        <div className="flex h-11 items-center justify-between gap-4 px-4">
          <Typography as="p" variant="title" size="medium" weight="semibold" className="text-[#1a1a1a]">
            {isResultsView ? "نتایج جستجو" : "جستجوهای اخیر"}
          </Typography>

          <Button unstyled
            className="flex shrink-0 items-center gap-1 text-sm font-medium leading-5 text-[#0048c4] [direction:ltr]"
            onClick={() => setIsSavedView(true)}
            type="button"
          >
            <LinearArrowLeft1 className="w-4 h-4" />
            <Typography as="span" variant="label" size="small" weight="medium" className="[direction:rtl]">ذخیره شده‌ها</Typography>
          </Button>
        </div>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#fafafa]">
        {isResultsView ? (
          !hasEnoughSearchQueryLength ? (
            <div className="flex flex-col">
              <Typography as="p" variant="body" size="small" weight="regular" className="m-0 px-4 py-3 text-right text-xs font-normal leading-5 text-[#808080]">
                برای دریافت نتایج، حداقل {toPersianDigits(String(minSearchQueryLength))} کاراکتر وارد کنید.
              </Typography>
            </div>
          ) : isWaitingForDebounce || isQuickSearchFetching ? (
            <SearchRowsSkeleton variant="results" />
          ) : isQuickSearchError ? (
            <QuickSearchErrorState
              className="min-h-full"
              onRetry={() => void refetchQuickSearch()}
            />
          ) : quickSearchResults.length > 0 ? (
            <div className="flex flex-col bg-[#fafafa] pt-4">
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
          <SearchRowsSkeleton variant="records" />
        ) : savedSearchesQuery.isError ? (
          <RecentSearchErrorState
            className="min-h-full"
            onRetry={() => void savedSearchesQuery.refetch()}
          />
        ) : visibleRecentSearches.length > 0 ? (
          <div className="flex flex-col bg-[#fafafa]">
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

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#fafafa]">
        {isLoading ? (
          <SearchRowsSkeleton variant="records" />
        ) : isError ? (
          <Button unstyled
            className="mx-4 my-8 rounded-xl border border-[#0048c4] px-4 py-3 text-sm font-medium text-[#0048c4]"
            onClick={onRetry}
            type="button"
          >
            دریافت جستجوهای ذخیره‌شده ناموفق بود؛ تلاش دوباره
          </Button>
        ) : savedSearches.length > 0 ? (
          <div className="flex flex-col bg-[#fafafa]">
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

function SearchRowsSkeleton({ variant }: { variant: "records" | "results" }) {
  const isRecords = variant === "records";

  return (
    <div
      className={`flex flex-col bg-[#fafafa] ${isRecords ? "" : "pt-4"}`}
      aria-hidden="true"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="bg-[#fafafa]" key={index}>
          {isRecords ? (
            <div className="flex h-[118px] flex-col justify-center px-4 py-4">
              <div className="flex items-center justify-end gap-2">
                <div className="h-6 w-6 animate-pulse rounded bg-[#f0f0f0]" />
                <div className="h-5 w-32 animate-pulse rounded-full bg-[#f0f0f0]" />
              </div>
              <div className="mt-2 flex flex-wrap justify-end gap-2 pr-8">
                <div className="h-6 w-24 animate-pulse rounded-md bg-[#f0f0f0]" />
                <div className="h-6 w-28 animate-pulse rounded-md bg-[#f0f0f0]" />
                <div className="h-6 w-20 animate-pulse rounded-md bg-[#f0f0f0]" />
              </div>
            </div>
          ) : (
            <div className="flex h-[72px] items-center justify-between gap-4 px-4">
              <div className="h-4 w-16 animate-pulse rounded-full bg-[#f0f0f0]" />
              <div className="flex flex-1 flex-col items-end gap-2">
                <div className="h-4 w-16 animate-pulse rounded-full bg-[#f0f0f0]" />
                <div className="h-4 w-28 animate-pulse rounded-full bg-[#f0f0f0]" />
              </div>
            </div>
          )}
          {index < 5 ? (
            <div
              className={isRecords ? "h-px bg-[#f0f0f0]" : "mx-4 h-px bg-[#f0f0f0]"}
            />
          ) : null}
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
    <SearchInputBar
      aria-label="جستجو"
      containerClassName="[direction:rtl]"
      inputClassName="home-search-input"
      onClear={() => onQueryChange("")}
      onValueChange={onQueryChange}
      placeholder="جستجو"
      ref={inputRef}
      showSearchIcon={false}
      size="compact"
      tabIndex={isOpen ? 0 : -1}
      type="search"
      value={query}
    />
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
  const pointerStartOffsetRef = useRef(0);
  const didSwipeRef = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const tags =
    item.content.length > 0
      ? item.content
      : "subtitle" in item && item.subtitle
        ? [item.subtitle]
        : [];

  const finishSwipe = () => {
    const shouldSuppressClick = didSwipeRef.current;
    setDragOffset((currentOffset) =>
      currentOffset >= SWIPE_REVEAL_THRESHOLD ? SWIPE_REVEAL_WIDTH : 0,
    );
    pointerStartXRef.current = null;
    pointerStartOffsetRef.current = 0;

    if (shouldSuppressClick) {
      window.setTimeout(() => {
        didSwipeRef.current = false;
      }, 0);
    }
  };

  return (
    <article
      className={`relative h-[119px] overflow-hidden bg-[#fafafa] ${isDeleting ? "opacity-60" : ""}`}
      onPointerCancel={finishSwipe}
      onPointerDown={(event) => {
        if (isDeleting) return;
        pointerStartXRef.current = event.clientX;
        pointerStartOffsetRef.current = dragOffset;
        didSwipeRef.current = false;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (pointerStartXRef.current === null || isDeleting) return;
        const delta = event.clientX - pointerStartXRef.current;
        const offset = Math.min(
          SWIPE_REVEAL_WIDTH,
          Math.max(0, pointerStartOffsetRef.current + delta),
        );
        if (Math.abs(delta) > 5) didSwipeRef.current = true;
        setDragOffset(offset);
      }}
      onPointerUp={finishSwipe}
      style={{ touchAction: "pan-y" }}
    >
      <div className="relative h-[118px] overflow-hidden bg-[#fdecec]">
        <Button unstyled
          aria-label={`حذف ${item.title}`}
          className="absolute inset-y-0 left-0 flex w-[59px] flex-col items-center justify-center gap-1 bg-[#fdecec] text-[#d92d20]"
          disabled={isDeleting}
          onClick={onDelete}
          type="button"
        >
          <LinearDelete className="h-6 w-6" />
          <Typography as="span" variant="label" size="small" weight="medium" className="text-[#d92d20]">
            حذف
          </Typography>
        </Button>

        <Button unstyled
          className="relative flex h-[118px] w-full flex-col bg-[#fafafa] px-4 py-4 text-right transition-transform duration-150 ease-out"
          disabled={isDeleting}
          onClick={() => {
            if (didSwipeRef.current) return;
            if (dragOffset > 0) {
              setDragOffset(0);
              return;
            }
            onSelect();
          }}
          style={{ transform: `translateX(${dragOffset}px)` }}
          type="button"
        >
          <span className="flex w-full items-center gap-2 [direction:rtl]">
            <span className="grid h-6 w-6 shrink-0 place-items-center text-[#4d4d4d]">
              <ApartmentIcon />
            </span>
            <Typography
              as="span"
              variant="body"
              size="large"
              weight="medium"
              className="min-w-0 flex-1 whitespace-normal break-words text-right leading-6 text-[#1a1a1a]"
            >
              {item.title}
            </Typography>
          </span>

          {tags.length > 0 ? (
            <span className="mt-2 flex w-full flex-wrap justify-start gap-2 pr-8 [direction:rtl]">
              {tags.map((tag) => (
                <Typography
                  as="span"
                  variant="body"
                  size="small"
                  weight="regular"
                  className="inline-flex h-6 max-w-full items-center rounded-[6px] bg-[#f0f0f0] px-2 text-right text-[#4d4d4d]"
                  key={tag}
                >
                  {tag}
                </Typography>
              ))}
            </span>
          ) : null}
        </Button>
      </div>

      <div aria-hidden="true" className="h-px bg-[#f0f0f0]" />
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
    <div className="bg-[#fafafa]">
      <Button unstyled
        className="flex h-[72px] w-full cursor-pointer items-center justify-between gap-4 bg-[#fafafa] px-4 text-right [direction:ltr]"
        onClick={onSelect}
        type="button"
      >
        <Typography
          as="span"
          variant="body"
          size="small"
          weight="regular"
          className="inline-flex shrink-0 text-[#a6a6a6] [direction:rtl]"
        >
          {formattedCount}
        </Typography>

        <span className="flex min-w-0 flex-1 flex-col items-start [direction:rtl]">
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="semibold"
            className="max-w-full truncate text-[#1a1a1a]"
          >
            {item.title}
          </Typography>
          {item.category ? (
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="max-w-full truncate text-[#a6a6a6]"
            >
              {item.category}
            </Typography>
          ) : null}
        </span>
      </Button>
      <div aria-hidden="true" className="mx-4 h-px bg-[#f0f0f0]" />
    </div>
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
