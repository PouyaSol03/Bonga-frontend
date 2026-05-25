import { useEffect, useRef, useState } from "react";

import { TopBar } from "../../../components/TopBar";
import {
  initialRecentSearches,
  initialSavedSearches,
  searchSuggestions,
} from "../homeData";

import type { RecentSearch, SavedSearch, SearchSuggestion } from "../homeTypes";

type HomeSearchScreenProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult?: (item: SearchSuggestion) => void;
};

const REMOVE_TRANSITION_MS = 180;

export function HomeSearchScreen({ isOpen, onClose, onSelectResult }: HomeSearchScreenProps) {
  const removeTimerRef = useRef<number | null>(null);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(initialRecentSearches);
  const [savedSearches, setSavedSearches] = useState(initialSavedSearches);
  const [isSavedView, setIsSavedView] = useState(false);
  const [removingRecentSearchId, setRemovingRecentSearchId] = useState<
    number | null
  >(null);

  const trimmedQuery = query.trim();
  const isResultsView = trimmedQuery.length > 0;

  useEffect(() => {
    return () => {
      if (removeTimerRef.current !== null) {
        window.clearTimeout(removeTimerRef.current);
      }
    };
  }, []);

  const closeSearch = () => {
    setIsSavedView(false);
    setQuery("");
    onClose();
  };

  const deleteRecentSearch = (id: number) => {
    if (removingRecentSearchId !== null) return;

    setRemovingRecentSearchId(id);
    removeTimerRef.current = window.setTimeout(() => {
      setRecentSearches((items) => items.filter((item) => item.id !== id));
      setRemovingRecentSearchId(null);
      removeTimerRef.current = null;
    }, REMOVE_TRANSITION_MS);
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

  return (
    <section
      className={`absolute inset-0 z-40 flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] transition-[opacity,transform,visibility] duration-300 ease-out [direction:rtl] ${
        isOpen
          ? "visible translate-y-0 opacity-100"
          : "invisible translate-y-3 opacity-0"
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
            />
          }
          // className="!bg-white"
          contentClassName="!items-start px-0"
          onBack={closeSearch}
        />
        <div className="flex h-11 items-center justify-between px-4">
          <h2 className="m-0 text-right text-base font-medium leading-6 text-[#1a1a1a]">
            {isResultsView ? "نتایج جستجو" : "جستجوهای اخیر"}
          </h2>

          <button
            className="inline-flex h-7 cursor-pointer items-center gap-1.5 bg-[#f0f0f0] text-xs font-medium leading-4 text-[#0048c4]"
            type="button"
            tabIndex={isOpen ? 0 : -1}
            onClick={() => setIsSavedView(true)}
          >
            ذخیره شده‌ها
            <span className="home-saved-link-icon" aria-hidden="true" />
          </button>
        </div>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pt-4">
        {isResultsView ? (
          <div className="flex flex-col">
            {searchSuggestions.map((item) => (
              <SearchSuggestionRow
                item={item}
                key={item.id}
                onSelect={() => onSelectResult?.(item)}
                query={trimmedQuery}
              />
            ))}
          </div>
        ) : recentSearches.length > 0 ? (
          <div className="flex flex-col">
            {recentSearches.map((item, index) => (
              <div
                className={`transition-[opacity,transform] duration-[180ms] ease-out ${
                  removingRecentSearchId === item.id
                    ? "-translate-x-3 opacity-0"
                    : "translate-x-0 opacity-100"
                }`}
                key={item.id}
              >
                <RecentSearchRow
                  item={item}
                  isDeleting={removingRecentSearchId === item.id}
                  onDelete={() => deleteRecentSearch(item.id)}
                />
                {index < recentSearches.length - 1 ? (
                  <div className="mx-4 flex h-[17px] items-center">
                    <span className="h-px w-full bg-[#cccccc]" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <SearchEmptyState
            title="هنوز چیزی جستجو نکرده‌اید!"
            subtitle="پس از اولین جستجو، سوابق در این بخش قرار می‌گیرند."
          />
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
  onDelete: (id: number) => void;
}) {
  const removeTimerRef = useRef<number | null>(null);
  const [removingSavedSearchId, setRemovingSavedSearchId] = useState<
    number | null
  >(null);

  useEffect(() => {
    return () => {
      if (removeTimerRef.current !== null) {
        window.clearTimeout(removeTimerRef.current);
      }
    };
  }, []);

  const deleteSavedSearch = (id: number) => {
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
      className={`absolute inset-0 z-40 flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] transition-[opacity,transform,visibility] duration-300 ease-out [direction:rtl] ${
        isOpen
          ? "visible translate-y-0 opacity-100"
          : "invisible translate-y-3 opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <TopBar onBack={onBack} title="جستجوی ذخیره شده" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        {savedSearches.length > 0 ? (
          <div className="flex flex-col gap-2 bg-[#f0f0f0]">
            {savedSearches.map((item) => (
              <div
                className={`transition-[opacity,transform] duration-[180ms] ease-out ${
                  removingSavedSearchId === item.id
                    ? "-translate-x-3 opacity-0"
                    : "translate-x-0 opacity-100"
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
          <SearchEmptyState
            title="هیچ جستجویی ذخیره نشده!"
            subtitle="می‌توانید جستجوهای موردنظر خود را برای دسترسی سریع‌تر ذخیره کنید."
          />
        )}
      </main>
    </section>
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
  return (
    <label className="relative flex h-12 min-w-0 flex-1 items-center rounded-xl border border-[#808080] bg-white">
      <input
        className="home-search-input h-full w-full appearance-none rounded-[inherit] border-0 bg-transparent py-0 pl-12 pr-4 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
        type="search"
        placeholder="جستجو"
        value={query}
        tabIndex={isOpen ? 0 : -1}
        onChange={(event) => onQueryChange(event.target.value)}
      />

      {query.length > 0 ? (
        <button
          className="absolute left-3 grid h-8 w-8 place-items-center text-[#808080]"
          type="button"
          aria-label="پاک کردن جستجو"
          tabIndex={isOpen ? 0 : -1}
          onClick={() => onQueryChange("")}
        >
          <span className="home-search-clear-icon" aria-hidden="true" />
        </button>
      ) : null}
    </label>
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
  return (
    <article className="h-[82px] bg-white px-4 pb-3">
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
    </article>
  );
}

function SearchSuggestionRow({
  item,
  onSelect,
  query,
}: {
  item: SearchSuggestion;
  onSelect: () => void;
  query: string;
}) {
  return (
    <button
      className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-3 border-b border-[#cccccc] bg-white px-4 py-2.5 text-right [direction:ltr] last:border-b-0 min-[390px]:min-h-[73px] min-[390px]:gap-4 min-[390px]:py-3"
      onClick={onSelect}
      type="button"
    >
      <span className="shrink-0 text-xs font-normal leading-4 text-[#a6a6a6]">
        {item.count}
      </span>

      <span className="flex min-w-0 flex-col items-end [direction:rtl]">
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

function SearchEmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-8 pb-20 pt-8 text-center">
      <span
        className="home-search-empty-illustration mb-6 min-[390px]:mb-8"
        aria-hidden="true"
      />
      <h3 className="m-0 text-base font-semibold leading-6 text-[#1a1a1a] min-[390px]:text-lg min-[390px]:leading-7">
        {title}
      </h3>
      <p className="m-0 mt-4 max-w-[190px] text-sm font-normal leading-5 text-[#4d4d4d]">
        {subtitle}
      </p>
    </div>
  );
}

function SmallCloseIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 9L15 15M15 9L9 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
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
