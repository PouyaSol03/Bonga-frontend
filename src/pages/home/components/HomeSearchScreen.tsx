import { useEffect, useRef, useState } from 'react'

import {
  initialRecentSearches,
  initialSavedSearches,
  searchSuggestions,
} from '../homeData'

import type {
  RecentSearch,
  SavedSearch,
  SearchSuggestion,
} from '../homeTypes'

type HomeSearchScreenProps = {
  isOpen: boolean
  onClose: () => void
}

export function HomeSearchScreen({ isOpen, onClose }: HomeSearchScreenProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState(initialRecentSearches)
  const [savedSearches, setSavedSearches] = useState(initialSavedSearches)
  const [isSavedView, setIsSavedView] = useState(false)

  const trimmedQuery = query.trim()
  const isResultsView = trimmedQuery.length > 0

  useEffect(() => {
    if (!isOpen || isSavedView) return

    const focusTimer = window.setTimeout(() => {
      searchInputRef.current?.focus()
    }, 0)

    return () => window.clearTimeout(focusTimer)
  }, [isOpen, isSavedView])

  const closeSearch = () => {
    setIsSavedView(false)
    setQuery('')
    onClose()
  }

  if (isSavedView) {
    return (
      <SavedSearchesView
        isOpen={isOpen}
        savedSearches={savedSearches}
        onBack={() => setIsSavedView(false)}
        onDelete={(id) => setSavedSearches((items) => items.filter((item) => item.id !== id))}
      />
    )
  }

  return (
    <section
      className={`absolute inset-0 z-40 flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] transition-[opacity,transform,visibility] duration-300 ease-out [direction:rtl] ${
        isOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-3 opacity-0'
      }`}
      aria-hidden={!isOpen}
    >
      <header className="shrink-0 bg-white px-4 pt-2">
        <div className="flex h-12 items-center gap-2 [direction:rtl] min-[390px]:h-14">
          <button
            className="grid h-10 w-10 shrink-0 place-items-center text-[#4d4d4d] min-[390px]:h-12"
            type="button"
            aria-label="بازگشت"
            tabIndex={isOpen ? 0 : -1}
            onClick={closeSearch}
          >
            <span className="home-search-back-icon" aria-hidden="true" />
          </button>

          <label className="relative flex h-11 min-w-0 flex-1 items-center rounded-xl border border-[#808080] bg-white focus-within:border-[#0048c4] focus-within:ring-2 focus-within:ring-[#0048c420] min-[390px]:h-12">
            <input
              ref={searchInputRef}
              className="home-search-input h-full w-full appearance-none rounded-[inherit] border-0 bg-transparent py-0 pl-12 pr-4 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] min-[390px]:text-base min-[390px]:leading-6"
              type="search"
              placeholder="جستجو"
              value={query}
              tabIndex={isOpen ? 0 : -1}
              onChange={(event) => setQuery(event.target.value)}
            />

            {query.length > 0 ? (
              <button
                className="absolute left-3 grid h-8 w-8 place-items-center text-[#808080]"
                type="button"
                aria-label="پاک کردن جستجو"
                tabIndex={isOpen ? 0 : -1}
                onClick={() => setQuery('')}
              >
                <span className="home-search-clear-icon" aria-hidden="true" />
              </button>
            ) : null}
          </label>
        </div>

        <div className="flex h-11 items-center justify-between">
          <h2 className="m-0 text-right text-sm font-medium leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6">
            {isResultsView ? 'نتایج جستجو' : 'جستجوهای اخیر'}
          </h2>

          <button
            className="inline-flex h-8 cursor-pointer items-center gap-1.5 bg-white text-xs font-medium leading-4 text-[#0048c4]"
            type="button"
            tabIndex={isOpen ? 0 : -1}
            onClick={() => setIsSavedView(true)}
          >
            <span className="home-saved-link-icon" aria-hidden="true" />
            ذخیره شده‌ها
          </button>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        {isResultsView ? (
          <div className="flex flex-col">
            {searchSuggestions.map((item) => (
              <SearchSuggestionRow item={item} key={item.id} query={trimmedQuery} />
            ))}
          </div>
        ) : recentSearches.length > 0 ? (
          <div className="flex flex-col">
            {recentSearches.map((item) => (
              <RecentSearchRow
                item={item}
                key={item.id}
                onDelete={() => setRecentSearches((items) => items.filter((recent) => recent.id !== item.id))}
              />
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
  )
}

function SavedSearchesView({
  isOpen,
  savedSearches,
  onBack,
  onDelete,
}: {
  isOpen: boolean
  savedSearches: SavedSearch[]
  onBack: () => void
  onDelete: (id: number) => void
}) {
  return (
    <section
      className={`absolute inset-0 z-40 flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] transition-[opacity,transform,visibility] duration-300 ease-out [direction:rtl] ${
        isOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-3 opacity-0'
      }`}
      aria-hidden={!isOpen}
    >
      <header className="flex h-[88px] shrink-0 items-end bg-[#f0f0f0] px-4 pb-3 min-[390px]:h-[100px] min-[390px]:pb-4">
        <button
          className="grid h-10 w-10 shrink-0 place-items-center text-[#4d4d4d]"
          type="button"
          aria-label="بازگشت"
          tabIndex={isOpen ? 0 : -1}
          onClick={onBack}
        >
          <span className="home-search-back-icon" aria-hidden="true" />
        </button>

        <h2 className="m-0 min-w-0 flex-1 text-right text-sm font-semibold leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6">
          جستجوی ذخیره شده
        </h2>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        {savedSearches.length > 0 ? (
          <div className="flex flex-col">
            {savedSearches.map((item) => (
              <SavedSearchRow item={item} key={item.id} onDelete={() => onDelete(item.id)} />
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
  )
}

function RecentSearchRow({ item, onDelete }: { item: RecentSearch; onDelete: () => void }) {
  return (
    <article className="flex min-h-[84px] items-start gap-2.5 border-b border-[#cccccc] bg-white px-4 py-3 [direction:ltr] last:border-b-0 min-[390px]:min-h-[99px] min-[390px]:gap-3 min-[390px]:py-4">
      <button
        className="grid h-9 w-9 shrink-0 place-items-center text-[#4d4d4d] min-[390px]:h-10 min-[390px]:w-10"
        type="button"
        aria-label="حذف جستجوی اخیر"
        onClick={onDelete}
      >
        <span className="home-search-remove-icon" aria-hidden="true" />
      </button>

      <div className="flex min-w-0 flex-1 flex-col items-end gap-2 text-right [direction:rtl] min-[390px]:gap-3">
        <div className="flex flex-col items-end gap-1">
          <h3 className="m-0 text-sm font-medium leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6">{item.title}</h3>
        </div>

        <div className="flex max-w-full flex-wrap items-center justify-end gap-2">
          <span className="text-sm font-medium leading-5 text-[#808080]">{item.subtitle}</span>

          {item.tags.map((tag) => (
            <span className="rounded-lg bg-[#e9eaee] px-3 py-1 text-xs font-medium leading-4 text-[#4d4d4d]" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

function SearchSuggestionRow({ item, query }: { item: SearchSuggestion; query: string }) {
  return (
    <button
      className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-3 border-b border-[#cccccc] bg-white px-4 py-2.5 text-right [direction:ltr] last:border-b-0 min-[390px]:min-h-[73px] min-[390px]:gap-4 min-[390px]:py-3"
      type="button"
    >
      <span className="shrink-0 text-xs font-normal leading-4 text-[#a6a6a6]">{item.count}</span>

      <span className="flex min-w-0 flex-col items-end [direction:rtl]">
        <strong className="text-sm font-normal leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6">{query || item.title}</strong>
        {item.subtitle ? <span className="text-sm font-normal leading-5 text-[#a6a6a6]">{item.subtitle}</span> : null}
      </span>
    </button>
  )
}

function SavedSearchRow({ item, onDelete }: { item: SavedSearch; onDelete: () => void }) {
  return (
    <article className="flex min-h-[108px] items-start gap-3 border-b-[12px] border-[#f0f0f0] bg-white px-4 py-4 [direction:ltr] last:border-b-0 min-[390px]:min-h-[130px] min-[390px]:gap-4 min-[390px]:border-b-[16px] min-[390px]:py-6">
      <button
        className="grid h-9 w-9 shrink-0 place-items-center text-[#4d4d4d] min-[390px]:h-10 min-[390px]:w-10"
        type="button"
        aria-label="حذف جستجوی ذخیره شده"
        onClick={onDelete}
      >
        <span className="home-search-trash-icon" aria-hidden="true" />
      </button>

      <div className="flex min-w-0 flex-1 flex-col items-end gap-2 text-right [direction:rtl] min-[390px]:gap-3">
        <div className="flex items-center gap-3">
          <span className="home-search-building-icon text-[#4d4d4d]" aria-hidden="true" />
          <h3 className="m-0 text-base font-normal leading-6 text-[#1a1a1a] min-[390px]:text-lg min-[390px]:leading-7">{item.title}</h3>
        </div>

        <div className="flex max-w-full flex-wrap justify-end gap-2">
          {item.tags.map((tag) => (
            <span className="rounded-lg bg-[#e9eaee] px-3 py-1 text-xs font-medium leading-4 text-[#4d4d4d]" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

function SearchEmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-8 pb-20 pt-8 text-center">
      <span className="home-search-empty-illustration mb-6 min-[390px]:mb-8" aria-hidden="true" />
      <h3 className="m-0 text-base font-semibold leading-6 text-[#1a1a1a] min-[390px]:text-lg min-[390px]:leading-7">{title}</h3>
      <p className="m-0 mt-4 max-w-[190px] text-sm font-normal leading-5 text-[#4d4d4d]">{subtitle}</p>
    </div>
  )
}
