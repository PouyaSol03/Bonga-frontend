import { useEffect, useRef, useState } from 'react'

import { cityOptions, citySearchResults } from '../homeData'
import type { CityOption } from '../homeTypes'

type CitySelectionScreenProps = {
  currentCity: string
  isOpen: boolean
  onClose: () => void
  onConfirm: (city: string) => void
}

export function CitySelectionScreen({
  currentCity,
  isOpen,
  onClose,
  onConfirm,
}: CitySelectionScreenProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [draftCity, setDraftCity] = useState(currentCity)
  const [isSearching, setIsSearching] = useState(false)
  const [query, setQuery] = useState('')

  const normalizedQuery = query.trim()
  const hasSearchResults =
    normalizedQuery === '' ||
    'هاشمیه'.includes(normalizedQuery) ||
    normalizedQuery.toLowerCase().includes('hash')

  const visibleSearchResults = normalizedQuery.length > 0 && hasSearchResults ? citySearchResults : []

  useEffect(() => {
    if (!isOpen || !isSearching) return

    const focusTimer = window.setTimeout(() => {
      searchInputRef.current?.focus()
    }, 0)

    return () => window.clearTimeout(focusTimer)
  }, [isOpen, isSearching])

  const closeCityScreen = () => {
    setDraftCity(currentCity)
    setIsSearching(false)
    setQuery('')
    onClose()
  }

  return (
    <section
      className={`absolute inset-0 z-40 flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] transition-[opacity,transform,visibility] duration-300 ease-out [direction:rtl] ${
        isOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-3 opacity-0'
      }`}
      aria-hidden={!isOpen}
    >
      <header className="flex h-12 shrink-0 items-center bg-[#f0f0f0] px-4 min-[390px]:h-14">
        <button
          className="grid h-10 w-10 shrink-0 place-items-center text-[#4d4d4d] min-[390px]:h-12"
          type="button"
          aria-label="بازگشت"
          tabIndex={isOpen ? 0 : -1}
          onClick={closeCityScreen}
        >
          <span className="home-search-back-icon" aria-hidden="true" />
        </button>

        {isSearching ? (
          <input
            ref={searchInputRef}
            className="home-search-input min-w-0 flex-1 appearance-none border-0 bg-transparent px-4 text-right text-sm font-semibold leading-5 text-[#1a1a1a] caret-[#0048c4] outline-none min-[390px]:text-base min-[390px]:leading-6"
            type="search"
            value={query}
            tabIndex={isOpen ? 0 : -1}
            onChange={(event) => setQuery(event.target.value)}
          />
        ) : (
          <h2 className="m-0 min-w-0 flex-1 text-right text-sm font-semibold leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6">
            انتخاب شهر
          </h2>
        )}

        <button
          className="grid h-10 w-10 shrink-0 place-items-center text-[#4d4d4d] min-[390px]:h-12"
          type="button"
          aria-label="جستجوی شهر"
          tabIndex={isOpen ? 0 : -1}
          onClick={() => setIsSearching(true)}
        >
          {isSearching ? null : <span className="home-city-search-icon" aria-hidden="true" />}
        </button>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        {isSearching ? (
          normalizedQuery.length === 0 ? (
            <div className="h-full bg-white" />
          ) : visibleSearchResults.length > 0 ? (
            <div className="flex flex-col pt-2">
              {visibleSearchResults.map((city, index) => (
                <CitySearchResultRow
                  city={city}
                  key={`${city.name}-${index}`}
                  onSelect={() => setDraftCity(city.name)}
                />
              ))}
            </div>
          ) : (
            <CityEmptyState />
          )
        ) : (
          <div className="flex flex-col gap-1 px-3 pt-2 min-[390px]:gap-1.5 min-[390px]:pt-3">
            {cityOptions.map((city) => (
              <CityOptionRow
                city={city}
                isSelected={draftCity === city.name}
                key={city.name}
                onSelect={() => setDraftCity(city.name)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="shrink-0 bg-white px-4 py-3 shadow-[0_-12px_24px_rgba(26,26,26,0.06)] min-[390px]:py-3.5">
        <button
          className="h-10 w-full rounded-[10px] bg-[#0048c4] text-sm font-medium leading-5 text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          type="button"
          tabIndex={isOpen ? 0 : -1}
          onClick={() => onConfirm(draftCity)}
        >
          تایید
        </button>
      </footer>
    </section>
  )
}

function CityOptionRow({
  city,
  isSelected,
  onSelect,
}: {
  city: CityOption
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      className={`flex min-h-11 w-full cursor-pointer items-center justify-between rounded-2xl px-4 text-right transition-colors [direction:ltr] min-[390px]:min-h-12 min-[390px]:px-5 ${
        isSelected ? 'bg-[#e8eef9]' : 'bg-white'
      }`}
      type="button"
      onClick={onSelect}
    >
      <span className={`home-city-radio ${isSelected ? 'home-city-radio--selected' : ''}`} aria-hidden="true" />
      <span className="text-sm font-normal leading-5 text-[#1a1a1a] [direction:rtl] min-[390px]:text-base min-[390px]:leading-6">{city.name}</span>
    </button>
  )
}

function CitySearchResultRow({ city, onSelect }: { city: CityOption; onSelect: () => void }) {
  return (
    <button
      className="flex h-11 w-full cursor-pointer items-center justify-between border-b border-[#cccccc] bg-white px-4 text-right [direction:ltr] min-[390px]:h-12"
      type="button"
      onClick={onSelect}
    >
      <span className="shrink-0 text-xs font-normal leading-4 text-[#1a1a1a] [direction:ltr]">{city.count}</span>
      <span className="min-w-0 text-sm font-normal leading-5 text-[#1a1a1a] [direction:rtl] min-[390px]:text-base min-[390px]:leading-6">{city.name}</span>
    </button>
  )
}

function CityEmptyState() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-8 pb-16 pt-8 text-center">
      <span className="home-city-empty-illustration mb-6 min-[390px]:mb-8" aria-hidden="true" />
      <h3 className="m-0 text-base font-semibold leading-6 text-[#1a1a1a] min-[390px]:text-lg min-[390px]:leading-7">هیچ نتیجه‌ای یافت نشد!</h3>
      <p className="m-0 mt-4 text-sm font-normal leading-5 text-[#4d4d4d]">مجدد امتحان کنید</p>
    </div>
  )
}
