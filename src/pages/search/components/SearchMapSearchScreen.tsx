import { useEffect, useRef, useState } from "react";

import BoldBookmarkSolid from "../../../components/(icons)/BoldBookmarkSolid";
import LinearBookmarkSolid from "../../../components/(icons)/LinearBookmarkSolid";
import SearchBarSearchIcon from "../../../components/(icons)/SearchBarSearchIcon";
import { TopBar } from "../../../components/TopBar";
import { AdCardSkeleton } from "../../../components/AdCardSkeleton";
import SearchErrors from "../../home/components/SearchErrors";
import { getStoredAuthSession } from "../../../auth/auth-storage";
import {
  useDeleteSearchHistoryMutation,
  useSearchHistoryQuery,
} from "../../../hooks/search-history.hooks";
import {
  useDeleteSavedSearchMutation,
  useSavedSearchesQuery,
  useSaveSearchMutation,
} from "../../../hooks/saved-search.hooks";
import type { SearchHistoryItem } from "../../../services/search-history.service";
import type {
  SavedSearchItem,
  SaveSearchInput,
} from "../../../services/saved-search.service";
import { Typography } from "../../../components/ui/Typography";
import { Button } from "../../../components/ui/Button";

type SearchMapSearchScreenProps = {
  initialQuery?: string;
  initialView?: "search" | "saved";
  isOpen: boolean;
  minSearchQueryLength?: number;
  onClose: () => void;
  onQueryChange: (query: string) => void;
  onSavedSelect: (item: SavedSearchItem) => void;
  onSubmit: (query: string) => void;
  saveInput?: SaveSearchInput | null;
};

const SWIPE_DELETE_THRESHOLD = 64;

function normalizeQuery(query: string) {
  return query.trim();
}

function toSavedSearchItem(item: SearchHistoryItem): SavedSearchItem {
  return {
    content: item.content,
    filters: item.filters,
    id: item.id,
    title: item.title,
    url: item.url,
  };
}

export function SearchMapSearchScreen({
  initialQuery = "",
  initialView = "search",
  isOpen,
  minSearchQueryLength = 1,
  onClose,
  onQueryChange,
  onSavedSelect,
  onSubmit,
  saveInput,
}: SearchMapSearchScreenProps) {
  const [query, setQuery] = useState(initialQuery);
  const [view, setView] = useState<"search" | "saved">(initialView);
  const [savedSearchUrl, setSavedSearchUrl] = useState<string | null>(null);
  const wasOpenRef = useRef(false);
  const lastPublishedQueryRef = useRef(normalizeQuery(initialQuery));
  const normalizedInitialQuery = normalizeQuery(initialQuery);
  const normalizedQuery = normalizeQuery(query);
  const shouldSyncQueryFromUrl =
    normalizedInitialQuery !== lastPublishedQueryRef.current;
  const isAuthenticated = Boolean(getStoredAuthSession());
  const {
    data: recentSearches = [],
    isError: isRecentSearchError,
    isLoading: isRecentSearchLoading,
    refetch: refetchRecentSearches,
  } = useSearchHistoryQuery({
    enabled: isOpen && view === "search" && isAuthenticated && !normalizedQuery,
  });
  const {
    data: savedSearches = [],
    isError: isSavedSearchError,
    isLoading: isSavedSearchLoading,
    refetch: refetchSavedSearches,
  } = useSavedSearchesQuery(isOpen && view === "saved" && isAuthenticated);
  const saveMutation = useSaveSearchMutation();
  const deleteMutation = useDeleteSavedSearchMutation();
  const deleteHistoryMutation = useDeleteSearchHistoryMutation();
  const isCurrentSearchSaved = Boolean(
    saveInput &&
      (savedSearchUrl === saveInput.url ||
        savedSearches.some((item) => item.url === saveInput.url)),
  );

  const saveCurrentSearch = () => {
    if (!saveInput || saveMutation.isPending || isCurrentSearchSaved) return;

    saveMutation.mutate(saveInput, {
      onSuccess: () => setSavedSearchUrl(saveInput.url),
    });
  };

  useEffect(() => {
    if (!isOpen) {
      wasOpenRef.current = false;
      return;
    }

    if (wasOpenRef.current) return;

    const nextInitialQuery = normalizeQuery(initialQuery);
    setQuery(initialQuery);
    setView(initialView);
    lastPublishedQueryRef.current = nextInitialQuery;
    wasOpenRef.current = true;
  }, [initialQuery, initialView, isOpen]);

  useEffect(() => {
    if (!isOpen || !wasOpenRef.current || !shouldSyncQueryFromUrl) return;

    setQuery(initialQuery);
    lastPublishedQueryRef.current = normalizedInitialQuery;
  }, [initialQuery, isOpen, normalizedInitialQuery, shouldSyncQueryFromUrl]);

  const publishQuery = (nextQuery: string, closeAfterPublish = false) => {
    const normalized = normalizeQuery(nextQuery);

    if (normalized.length < minSearchQueryLength) return;

    lastPublishedQueryRef.current = normalized;
    onSubmit(normalized);

    if (closeAfterPublish) onClose();
  };

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    const normalized = normalizeQuery(nextQuery);

    if (normalized === lastPublishedQueryRef.current) return;

    lastPublishedQueryRef.current = normalized;
    onQueryChange(normalized);
  };

  const closeScreen = () => {
    const normalized = normalizeQuery(query);

    if (
      view === "search" &&
      normalized.length >= minSearchQueryLength &&
      normalized !== lastPublishedQueryRef.current
    ) {
      lastPublishedQueryRef.current = normalized;
      onQueryChange(normalized);
    }

    onClose();
  };

  return (
    <section
      aria-hidden={!isOpen}
      className={`absolute inset-0 z-[600] flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl] ${
        isOpen ? "visible" : "invisible pointer-events-none"
      }`}
    >
      <div className="shrink-0 bg-[#f0f0f0] py-2.5">
        <TopBar
          centerClassName="px-2"
          centerSlot={
            <SearchMapField
              isSaveDisabled={!saveInput}
              isSaved={isCurrentSearchSaved}
              isSaving={saveMutation.isPending}
              isOpen={isOpen}
              onQueryChange={updateQuery}
              onSavedClick={saveCurrentSearch}
              onSubmit={() => publishQuery(query, true)}
              query={query}
            />
          }
          contentClassName="px-2"
          onBack={view === "saved" ? () => setView("search") : closeScreen}
        />
        <div className="flex h-11 items-center justify-start px-4">
          <Typography as="h2" variant="title" size="medium" weight="medium" className="m-0 text-right text-base font-medium leading-6 text-[#1a1a1a]">
            {view === "saved"
              ? "جستجوهای ذخیره شده"
              : normalizedQuery
                ? "جستجو در آگهی‌های نقشه"
                : "جستجوهای اخیر"}
          </Typography>
        </div>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pt-4">
        {view === "saved" ? (
          <div className="flex flex-col">
            {saveInput ? (
              <div className="border-b border-[#e6e6e6] px-4 pb-4">
                <Button unstyled
                  className="flex h-11 w-full items-center justify-center rounded-xl bg-[#0048c4] px-4 text-sm font-bold text-white disabled:bg-[#a6b8d8]"
                  disabled={saveMutation.isPending || isCurrentSearchSaved}
                  onClick={() => saveMutation.mutate(saveInput)}
                  type="button"
                >
                  {saveMutation.isPending
                    ? "در حال ذخیره..."
                    : isCurrentSearchSaved
                      ? "این جستجو ذخیره شده است"
                      : "ذخیره جستجوی فعلی"}
                </Button>
                {saveMutation.isError ? (
                  <Typography as="p" variant="body" size="small" weight="regular" className="m-0 pt-2 text-center text-xs text-[#d92d20]">
                    ذخیره جستجو انجام نشد. دوباره تلاش کنید.
                  </Typography>
                ) : null}
              </div>
            ) : null}

            {isSavedSearchLoading ? (
              <div className="flex flex-col gap-4 px-4 py-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div className="h-20 rounded-xl bg-[#f0f0f0]" key={index} />
                ))}
              </div>
            ) : isSavedSearchError ? (
              <Button unstyled
                className="mx-4 my-8 rounded-xl border border-[#0048c4] px-4 py-3 text-sm font-medium text-[#0048c4]"
                onClick={() => void refetchSavedSearches()}
                type="button"
              >
                دریافت جستجوهای ذخیره‌شده ناموفق بود؛ تلاش دوباره
              </Button>
            ) : savedSearches.length > 0 ? (
              savedSearches.map((item) => (
                <SavedSearchRow
                  isDeleting={deleteMutation.isPending && deleteMutation.variables === item.id}
                  item={item}
                  key={item.id}
                  onDelete={() => deleteMutation.mutate(item.id)}
                  onSelect={() => {
                    onSavedSelect(item);
                    onClose();
                  }}
                />
              ))
            ) : (
              <SearchErrors className="min-h-[360px]" variant="no-saved-search" />
            )}
          </div>
        ) : normalizedQuery ? (
          <div className="flex flex-col">
            <Button unstyled
              className="flex min-h-[72px] w-full items-center justify-between gap-4 border-b border-[#cccccc] bg-white px-4 py-3 text-right [direction:ltr]"
              onClick={() => publishQuery(query, true)}
              type="button"
            >
              <Typography as="span" variant="label" size="small" weight="medium" className="shrink-0 rounded-full bg-[#0048c414] px-2.5 py-1 text-xs font-medium leading-4 text-[#0048c4] [direction:rtl]">
                جستجو
              </Typography>
              <Typography as="span" variant="body" size="medium" weight="regular" className="flex min-w-0 flex-1 flex-col items-start [direction:rtl]">
                <strong className="text-base font-normal leading-6 text-[#1a1a1a]">
                  جستجوی «{normalizedQuery}»
                </strong>
                <Typography as="span" variant="body" size="medium" weight="regular" className="text-sm font-normal leading-5 text-[#a6a6a6]">
                  عبارت مستقیماً به جستجوی آگهی‌های نقشه ارسال می‌شود
                </Typography>
              </Typography>
            </Button>
          </div>
        ) : isRecentSearchLoading ? (
          <div className="flex flex-col bg-[#f0f0f0]" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, index) => (
              <AdCardSkeleton key={index} />
            ))}
          </div>
        ) : isRecentSearchError ? (
          <Button unstyled
            className="mx-4 my-8 rounded-xl border border-[#0048c4] px-4 py-3 text-sm font-medium text-[#0048c4]"
            onClick={() => void refetchRecentSearches()}
            type="button"
          >
            دریافت جستجوهای اخیر ناموفق بود؛ تلاش دوباره
          </Button>
        ) : recentSearches.length > 0 ? (
          <div className="flex flex-col">
            {recentSearches.map((item) => (
              <SavedSearchRow
                isDeleting={
                  deleteHistoryMutation.isPending &&
                  deleteHistoryMutation.variables === item.id
                }
                item={toSavedSearchItem(item)}
                key={item.id}
                onDelete={() => deleteHistoryMutation.mutate(item.id)}
                onSelect={() => {
                  onSavedSelect(toSavedSearchItem(item));
                  onClose();
                }}
              />
            ))}
          </div>
        ) : (
          <SearchErrors className="min-h-[360px]" variant="no-search" />
        )}
      </main>
    </section>
  );
}

function SavedSearchRow({
  isDeleting,
  item,
  onDelete,
  onSelect,
}: {
  isDeleting: boolean;
  item: SavedSearchItem;
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
      className={`relative min-h-[92px] overflow-hidden border-b border-[#e6e6e6] bg-[#fdecec] last:border-b-0 ${isDeleting ? "opacity-60" : ""}`}
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
      <Button unstyled
        aria-label={`حذف ${item.title}`}
        className="absolute inset-y-0 left-0 flex w-20 items-center justify-center bg-[#fdecec] text-sm font-medium text-[#d92d20]"
        disabled={isDeleting}
        onClick={onDelete}
        type="button"
      >
        حذف
      </Button>
      <Button unstyled
        className="relative flex min-h-[92px] w-full flex-col justify-center bg-white px-4 py-4 text-right transition-transform duration-150 ease-out"
        disabled={isDeleting}
        onClick={() => {
          if (!didSwipeRef.current) onSelect();
        }}
        style={{ transform: `translateX(${dragOffset}px)` }}
        type="button"
      >
        <strong className="block text-base font-medium leading-6 text-[#1a1a1a]">
          {item.title}
        </strong>
        {item.content.length > 0 ? (
          <Typography as="span" variant="body" size="medium" weight="regular" className="mt-2 flex flex-wrap gap-2">
            {item.content.map((tag) => (
              <Typography as="span" variant="label" size="small" weight="medium"
                className="rounded-md bg-[#e9eaee] px-2 py-1 text-xs font-medium leading-4 text-[#4d4d4d]"
                key={tag}
              >
                {tag}
              </Typography>
            ))}
          </Typography>
        ) : null}
      </Button>
    </article>
  );
}

function SearchMapField({
  isSaveDisabled,
  isSaved,
  isSaving,
  isOpen,
  onQueryChange,
  onSavedClick,
  onSubmit,
  query,
}: {
  isSaveDisabled: boolean;
  isSaved: boolean;
  isSaving: boolean;
  isOpen: boolean;
  onQueryChange: (query: string) => void;
  onSavedClick: () => void;
  onSubmit: () => void;
  query: string;
}) {
  return (
    <form
      className={`flex h-12 w-full min-w-0 items-center rounded-[12px] border bg-white px-3 text-right transition focus-within:outline-3 focus-within:outline-offset-[-3px] focus-within:outline-[#0048c440] ${
        query ? "border-[#0048c4]" : "border-[#808080]"
      }`}
      dir="rtl"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <SearchBarSearchIcon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#4d4d4d]" />
      <div aria-hidden="true" className="mx-3 h-6 w-px shrink-0 bg-[#cccccc]" />
      <input
        aria-label="جستجو در آگهی‌های نقشه"
        autoFocus={isOpen}
        className="home-search-input min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-right text-base font-normal leading-6 text-[#1a1a1a] caret-[#0048c4] outline-none placeholder:text-[#a6a6a6]"
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="جستجو"
        tabIndex={isOpen ? 0 : -1}
        type="search"
        value={query}
      />
      {query ? (
        <Button unstyled
          aria-label="پاک کردن جستجو"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#808080] transition active:bg-[#f0f0f0]"
          onClick={() => onQueryChange("")}
          tabIndex={isOpen ? 0 : -1}
          type="button"
        >
          ×
        </Button>
      ) : null}
      <Button unstyled
        aria-label={isSaved ? "جستجو ذخیره شده است" : "ذخیره جستجوی فعلی"}
        aria-pressed={isSaved}
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-transparent transition-colors disabled:cursor-not-allowed ${
          isSaved || isSaving
            ? "text-[#1a1a1a]"
            : "text-[#4d4d4d] active:bg-[#0048c414]"
        }`}
        disabled={isSaveDisabled || isSaving || isSaved}
        onClick={onSavedClick}
        tabIndex={isOpen ? 0 : -1}
        type="button"
      >
        {isSaved || isSaving ? (
          <BoldBookmarkSolid className="h-6 w-6" />
        ) : (
          <LinearBookmarkSolid className="h-6 w-6" />
        )}
      </Button>
    </form>
  );
}
