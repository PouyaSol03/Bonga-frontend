import { useEffect, useRef, useState } from "react";

import LinearBookmarkSolid from "../../../components/(icons)/LinearBookmarkSolid";
import { TopBar } from "../../../components/TopBar";
import { getStoredAuthSession } from "../../../auth/auth-storage";
import { useSearchHistoryQuery } from "../../../hooks/search-history.hooks";
import { initialRecentSearches, initialSavedSearches } from "../../home/homeData";
import type { SearchHistoryItem } from "../../../services/search-history.service";

type SearchMapSearchScreenProps = {
  initialQuery?: string;
  initialView?: "search" | "saved";
  isOpen: boolean;
  minSearchQueryLength?: number;
  onClose: () => void;
  onQueryChange: (query: string) => void;
  onSubmit: (query: string) => void;
};

function normalizeQuery(query: string) {
  return query.trim();
}

export function SearchMapSearchScreen({
  initialQuery = "",
  initialView = "search",
  isOpen,
  minSearchQueryLength = 1,
  onClose,
  onQueryChange,
  onSubmit,
}: SearchMapSearchScreenProps) {
  const [query, setQuery] = useState(initialQuery);
  const [view, setView] = useState<"search" | "saved">(initialView);
  const wasOpenRef = useRef(false);
  const lastPublishedQueryRef = useRef(normalizeQuery(initialQuery));
  const normalizedInitialQuery = normalizeQuery(initialQuery);
  const normalizedQuery = normalizeQuery(query);
  const shouldSyncQueryFromUrl =
    normalizedInitialQuery !== lastPublishedQueryRef.current;
  const isAuthenticated = Boolean(getStoredAuthSession());
  const { data: apiRecentSearches = [], isLoading: isRecentSearchLoading } =
    useSearchHistoryQuery({
      enabled: isOpen && view === "search" && isAuthenticated && !normalizedQuery,
    });
  const recentSearches = isAuthenticated
    ? apiRecentSearches.length > 0
      ? apiRecentSearches
      : initialRecentSearches
    : [];

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
              isOpen={isOpen}
              onQueryChange={updateQuery}
              onSavedClick={() => setView("saved")}
              onSubmit={() => publishQuery(query, true)}
              query={query}
            />
          }
          contentClassName="px-2"
          onBack={view === "saved" ? () => setView("search") : closeScreen}
        />
        <div className="flex h-11 items-center justify-start px-4">
          <h2 className="m-0 text-right text-base font-medium leading-6 text-[#1a1a1a]">
            {view === "saved"
              ? "جستجوهای ذخیره شده"
              : normalizedQuery
                ? "جستجو در آگهی‌های نقشه"
                : "جستجوهای اخیر"}
          </h2>
        </div>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pt-4">
        {view === "saved" ? (
          <div className="flex flex-col">
            {initialSavedSearches.map((item) => (
              <button
                className="border-b border-[#e6e6e6] px-4 py-4 text-right last:border-b-0"
                key={item.id}
                onClick={() => publishQuery(item.title, true)}
                type="button"
              >
                <strong className="block text-base font-medium leading-6 text-[#1a1a1a]">
                  {item.title}
                </strong>
                <span className="mt-2 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      className="rounded-md bg-[#e9eaee] px-2 py-1 text-xs font-medium leading-4 text-[#4d4d4d]"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </button>
            ))}
          </div>
        ) : normalizedQuery ? (
          <div className="flex flex-col">
            <button
              className="flex min-h-[72px] w-full items-center justify-between gap-4 border-b border-[#cccccc] bg-white px-4 py-3 text-right [direction:ltr]"
              onClick={() => publishQuery(query, true)}
              type="button"
            >
              <span className="shrink-0 rounded-full bg-[#0048c414] px-2.5 py-1 text-xs font-medium leading-4 text-[#0048c4] [direction:rtl]">
                جستجو
              </span>
              <span className="flex min-w-0 flex-1 flex-col items-start [direction:rtl]">
                <strong className="text-base font-normal leading-6 text-[#1a1a1a]">
                  جستجوی «{normalizedQuery}»
                </strong>
                <span className="text-sm font-normal leading-5 text-[#a6a6a6]">
                  عبارت مستقیماً به جستجوی آگهی‌های نقشه ارسال می‌شود
                </span>
              </span>
            </button>
          </div>
        ) : isRecentSearchLoading ? (
          <div className="flex flex-col gap-4 px-4 py-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="h-14 rounded-xl bg-[#f0f0f0]" key={index} />
            ))}
          </div>
        ) : recentSearches.length > 0 ? (
          <div className="flex flex-col">
            {recentSearches.map((item) => (
              <RecentSearchButton
                item={item}
                key={item.id}
                onSelect={() => {
                  setQuery(item.title);
                  publishQuery(item.title, true);
                }}
              />
            ))}
          </div>
        ) : (
          <p className="m-0 px-4 py-8 text-center text-sm font-medium leading-6 text-[#808080]">
            هنوز جستجویی ثبت نشده است.
          </p>
        )}
      </main>
    </section>
  );
}

function SearchMapField({
  isOpen,
  onQueryChange,
  onSavedClick,
  onSubmit,
  query,
}: {
  isOpen: boolean;
  onQueryChange: (query: string) => void;
  onSavedClick: () => void;
  onSubmit: () => void;
  query: string;
}) {
  return (
    <form
      className="relative flex h-12 w-full min-w-0 items-center gap-2 rounded-xl border border-[#808080] bg-white px-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <button
        aria-label="جستجوی ذخیره شده"
        className="grid place-items-center text-[#4d4d4d]"
        onClick={onSavedClick}
        tabIndex={isOpen ? 0 : -1}
        type="button"
      >
        <LinearBookmarkSolid className="h-6 w-6" />
      </button>
      <div className="h-6 w-px bg-[#cccccc]" />
      <input
        aria-label="جستجو در آگهی‌های نقشه"
        autoFocus={isOpen}
        className="home-search-input h-full w-full appearance-none rounded-[inherit] border-0 bg-transparent text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="جستجو"
        tabIndex={isOpen ? 0 : -1}
        type="search"
        value={query}
      />
      {query ? (
        <button
          aria-label="پاک کردن جستجو"
          className="grid h-8 w-8 shrink-0 place-items-center text-[#808080]"
          onClick={() => onQueryChange("")}
          tabIndex={isOpen ? 0 : -1}
          type="button"
        >
          <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
            <path
              d="M15.15 15.15L8.85068 8.85M8.85136 15.15L15.1507 8.85M21 12C21 7.02943 16.9705 3 12 3C7.02943 3 3 7.02943 3 12C3 16.9705 7.02943 21 12 21C16.9705 21 21 16.9705 21 12Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      ) : null}
    </form>
  );
}

function RecentSearchButton({
  item,
  onSelect,
}: {
  item: SearchHistoryItem | (typeof initialRecentSearches)[number];
  onSelect: () => void;
}) {
  return (
    <button
      className="border-b border-[#e6e6e6] px-4 py-4 text-right last:border-b-0"
      onClick={onSelect}
      type="button"
    >
      <strong className="block text-base font-medium leading-6 text-[#1a1a1a]">
        {item.title}
      </strong>
      {item.subtitle ? (
        <span className="mt-1 block text-sm font-normal leading-5 text-[#808080]">
          {item.subtitle}
        </span>
      ) : null}
      {item.tags.length > 0 ? (
        <span className="mt-2 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              className="rounded-md bg-[#e9eaee] px-2 py-1 text-xs font-medium leading-4 text-[#4d4d4d]"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </span>
      ) : null}
    </button>
  );
}
