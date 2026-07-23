import { useEffect, useMemo, useRef, useState } from "react";

import { BottomSheet } from "../../../components/BottomSheet";
import { TopBar } from "../../../components/TopBar";
import { useAgencyInfiniteQuery } from "../../../hooks/agency.hooks";
import { useNeighborhoodListQuery } from "../../../hooks/neighborhood.hooks";
import { readStoredSelectedCity } from "../../../lib/selectedCityStorage";
import type { AgencySort, PublicAgencyDto } from "../../../services/agency.service";
import type { NeighborhoodDto } from "../../../services/neighborhood.service";
import { AgencyNeighborhoodFilterPage } from "./AgencyNeighborhoodFilterPage";
import {
  AgencyDirectoryMapView,
  type AgencyDirectoryMapItem,
} from "../../consultants/AgencyDirectoryMapView";

const pageSize = 20;
const loadMoreRemainingCount = 10;
const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

const sortOptions: Array<{ id: AgencySort; title: string }> = [
  { id: "score", title: "امتیاز" },
  { id: "rank", title: "رتبه" },
  { id: "newest", title: "جدیدترین" },
  { id: "oldest", title: "با سابقه‌ترین" },
];

function toPersianNumber(value: number | string) {
  return String(value).replace(/\d/g, (digit) => persianDigits[Number(digit)] ?? digit);
}

function useDebouncedValue(value: string, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debounced;
}

function agencyToMapItem(agency: PublicAgencyDto): AgencyDirectoryMapItem {
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

function neighborhoodId(item: NeighborhoodDto) {
  return String(item.id ?? item._id ?? "");
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24">
      <circle cx="10.7" cy="10.7" r="6.7" stroke="currentColor" strokeWidth="1.7" />
      <path d="m15.7 15.7 4.6 4.6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <path d="M15.8 8.2c0 3.9-5.8 8.3-5.8 8.3S4.2 12.1 4.2 8.2a5.8 5.8 0 1 1 11.6 0Z" stroke="currentColor" strokeWidth="1.45" />
      <circle cx="10" cy="8.1" r="2" stroke="currentColor" strokeWidth="1.45" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <path d="M5 3.5v13m0 0-2.5-2.6M5 16.5l2.5-2.6M15 16.5v-13m0 0-2.5 2.6M15 3.5l2.5 2.6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M4 5.5 9 3l6 2.5L20 3v15.5L15 21l-6-2.5L4 21V5.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.55" />
      <path d="M9 3v15.5M15 5.5V21" stroke="currentColor" strokeWidth="1.55" />
      <path d="M18.2 10.1c0 2.3-3.2 5.7-3.2 5.7s-3.2-3.4-3.2-5.7a3.2 3.2 0 1 1 6.4 0Z" fill="#fff" stroke="currentColor" strokeWidth="1.35" />
      <circle cx="15" cy="10.1" r="1" fill="currentColor" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <path d="m10 2.4 2.2 4.4 4.9.7-3.5 3.4.8 4.9-4.4-2.3-4.4 2.3.8-4.9-3.5-3.4 4.9-.7L10 2.4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.35" />
    </svg>
  );
}

function RankIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <path d="M3 15.5h14M4.5 15.5v-4h3v4m1-7h3v7h-3v-7Zm4 3h3v4h-3v-4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
      <path d="m10 2 .7 1.5 1.7.2-1.2 1.2.3 1.7-1.5-.8-1.5.8.3-1.7-1.2-1.2 1.7-.2L10 2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.1" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <path d="M15.5 10H4.5m0 0 4-4m-4 4 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function Radio({ checked }: { checked: boolean }) {
  return (
    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${checked ? "border-[#0b55d4] bg-[#0b55d4]" : "border-[#8a8a8a] bg-white"}`}>
      {checked ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
    </span>
  );
}

function AgencyCard({
  agency,
  loadMoreRef,
  onOpenProfile,
  onSelect,
  selected,
}: {
  agency: PublicAgencyDto;
  loadMoreRef?: (node: HTMLElement | null) => void;
  onOpenProfile: () => void;
  onSelect: () => void;
  selected: boolean;
}) {
  const image = agency.logo ?? agency.img;

  return (
    <article
      className={`mx-4 overflow-hidden rounded-[13px] border transition-colors ${selected ? "border-[#0b55d4] bg-[#eef4ff]" : "border-[#d0d0d0] bg-white"}`}
      ref={loadMoreRef}
    >
      <button className="flex w-full gap-4 px-4 pb-4 pt-4 text-right" onClick={onSelect} type="button">
        {image ? (
          <img alt="" className="h-[72px] w-[72px] shrink-0 rounded-xl object-cover" src={image} />
        ) : (
          <span className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-xl bg-[#edf3ff] text-2xl font-bold text-[#0048c4]">
            {agency.name.trim().charAt(0) || "آ"}
          </span>
        )}

        <span className="flex min-w-0 flex-1 flex-col">
          <strong className="truncate text-base font-semibold leading-7 text-[#4d4d4d]">{agency.name}</strong>
          {agency.address ? <span className="mt-0.5 truncate text-[11px] leading-5 text-[#808080]">{agency.address}</span> : null}
          <span className="mt-auto flex items-center justify-between pt-4 text-sm text-[#1a1a1a]">
            <span className="flex items-center gap-1.5"><StarIcon /><span>امتیاز</span><b className="font-semibold text-[#00a66a]">{toPersianNumber(agency.score)}</b></span>
            <span className="flex items-center gap-1.5"><RankIcon /><span>رتبه</span><b className="font-semibold text-[#00a66a]">{toPersianNumber(agency.rank)}</b></span>
          </span>
        </span>
      </button>

      <div className="mx-4 h-px bg-[#d9d9d9]" />

      <div className="flex h-[58px] items-center justify-between gap-3 px-4" dir="rtl">
        <button className="flex items-center gap-2 text-base font-medium text-[#4d4d4d]" onClick={onSelect} type="button">
          <Radio checked={selected} />
          <span>انتخاب</span>
        </button>
        <button
          className={`flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold ${selected ? "border-[#0b55d4] text-[#0b55d4]" : "border-[#cccccc] text-[#1a1a1a]"}`}
          onClick={onOpenProfile}
          type="button"
        >
          <span className="truncate">مشاهده پروفایل آژانس</span>
          <ArrowIcon />
        </button>
      </div>
    </article>
  );
}

function Notice({ onClose }: { onClose: () => void }) {
  return (
    <aside className="mx-4 rounded-[13px] border border-[#ff6a00] bg-[#fff8ef] px-4 py-4 text-[#4d4d4d]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#ff6a00]">
          <span className="grid h-5 w-5 place-items-center rounded-full border border-current text-xs font-bold">!</span>
          <strong className="text-base">توجه!</strong>
        </div>
        <button aria-label="بستن پیام" className="grid h-8 w-8 place-items-center text-xl" onClick={onClose} type="button">×</button>
      </div>
      <ul className="m-0 mt-3 list-disc space-y-2 pr-5 text-sm leading-7">
        <li>پس از انتخاب آژانس، امکان ویرایش آگهی وجود نخواهد داشت.</li>
        <li>در انتخاب آژانس دقت کنید.</li>
      </ul>
    </aside>
  );
}

function LoadingCard() {
  return (
    <div className="mx-4 h-[164px] animate-pulse rounded-[13px] border border-[#e4e4e4] bg-white p-4">
      <div className="flex gap-4"><div className="h-[72px] w-[72px] rounded-xl bg-[#f0f0f0]" /><div className="flex-1"><div className="h-5 w-2/3 rounded bg-[#f0f0f0]" /><div className="mt-5 h-4 w-full rounded bg-[#f0f0f0]" /></div></div>
      <div className="mt-4 h-px bg-[#ededed]" /><div className="mt-3 h-9 rounded-xl bg-[#f0f0f0]" />
    </div>
  );
}

export function AgencySelectionStep({
  onBack,
  onConfirm,
  onSelect,
  selectedAgencyId,
}: {
  onBack: () => void;
  onConfirm: (agency: PublicAgencyDto) => void;
  onSelect: (agency: PublicAgencyDto | null) => void;
  selectedAgencyId: string;
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<AgencySort>("score");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodDto | null>(null);
  const [pendingNeighborhood, setPendingNeighborhood] = useState<NeighborhoodDto | null>(null);
  const [neighborhoodSearch, setNeighborhoodSearch] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isNeighborhoodOpen, setIsNeighborhoodOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(!selectedAgencyId);
  const [selectedAgencyCache, setSelectedAgencyCache] = useState<PublicAgencyDto | null>(null);
  const [view, setView] = useState<"list" | "map">("list");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const debouncedSearch = useDebouncedValue(search.trim());
  const debouncedNeighborhoodSearch = useDebouncedValue(neighborhoodSearch.trim(), 250);
  const selectedCity = readStoredSelectedCity();

  const agenciesQuery = useAgencyInfiniteQuery({
    neighborhoodId: selectedNeighborhood ? neighborhoodId(selectedNeighborhood) : undefined,
    perPage: pageSize,
    search: debouncedSearch,
    sort,
  });
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId: selectedCity?.id ?? "",
    enabled: isNeighborhoodOpen && Boolean(selectedCity?.id),
    perPage: 100,
    q: debouncedNeighborhoodSearch,
  });
  const agencies = useMemo(
    () => agenciesQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [agenciesQuery.data],
  );
  const selectedAgency = useMemo(
    () =>
      selectedAgencyCache?.id === selectedAgencyId
        ? selectedAgencyCache
        : agencies.find((agency) => agency.id === selectedAgencyId) ?? null,
    [agencies, selectedAgencyCache, selectedAgencyId],
  );
  const mapItems = useMemo(() => agencies.map(agencyToMapItem), [agencies]);
  const preloadIndex = Math.max(agencies.length - loadMoreRemainingCount - 1, 0);

  const loadMoreRef = (node: HTMLElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (!node || !agenciesQuery.hasNextPage || agenciesQuery.isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        void agenciesQuery.fetchNextPage();
      },
      { rootMargin: "160px 0px" },
    );
    observer.observe(node);
    observerRef.current = observer;
  };

  useEffect(() => () => observerRef.current?.disconnect(), []);

  const selectAgency = (agency: PublicAgencyDto) => {
    setSelectedAgencyCache(agency);
    onSelect(agency);
    setShowNotice(false);
  };

  const openProfile = (agency: PublicAgencyDto) => {
    window.open(`/agencies/${encodeURIComponent(agency.id)}`, "_blank", "noopener,noreferrer");
  };

  if (isNeighborhoodOpen) {
    return (
      <AgencyNeighborhoodFilterPage
        citySelected={Boolean(selectedCity?.id)}
        isError={neighborhoodsQuery.isError}
        isLoading={neighborhoodsQuery.isLoading}
        items={neighborhoodsQuery.data ?? []}
        onBack={() => setIsNeighborhoodOpen(false)}
        onConfirm={() => {
          setSelectedNeighborhood(pendingNeighborhood);
          setIsNeighborhoodOpen(false);
        }}
        onRetry={() => void neighborhoodsQuery.refetch()}
        onSearchChange={setNeighborhoodSearch}
        onSelect={setPendingNeighborhood}
        search={neighborhoodSearch}
        selectedId={pendingNeighborhood ? neighborhoodId(pendingNeighborhood) : ""}
      />
    );
  }

  if (view === "map") {
    return (
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AgencyDirectoryMapView
          confirmDisabled={!selectedAgency}
          items={mapItems}
          onBack={() => setView("list")}
          onConfirmSelection={() => selectedAgency && onConfirm(selectedAgency)}
          onOpenAgency={(item) => {
            const agency = agencies.find((candidate) => candidate.id === item.id);
            if (agency) openProfile(agency);
          }}
          onOpenList={() => setView("list")}
          onSearchChange={setSearch}
          onSelectAgency={(id) => {
            const agency = agencies.find((candidate) => candidate.id === id) ?? null;
            if (agency) {
              selectAgency(agency);
            } else {
              setSelectedAgencyCache(null);
              onSelect(null);
            }
          }}
          profileLabel="مشاهده صفحه"
          searchValue={search}
          selectedAgencyId={selectedAgencyId || null}
          title="ثبت آگهی / انتخاب آژانس"
          variant="selection"
        />
      </div>
    );
  }

  return (
    <>
      <TopBar onBack={onBack} title="ثبت آگهی / انتخاب آژانس" />
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-28" dir="rtl">
        <div className="sticky top-0 z-20 bg-[#f4f4f4] px-4 pb-3 pt-4 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
          <label className="flex h-12 items-center gap-3 rounded-xl border border-[#808080] bg-white px-4 text-[#4d4d4d] focus-within:border-[#0048c4]">
            <SearchIcon />
            <input
              className="min-w-0 flex-1 border-0 bg-transparent text-right text-base outline-none placeholder:text-[#a6a6a6]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="جستجوی آژانس"
              value={search}
            />
          </label>
          <div className="mt-2 flex items-center justify-start gap-2">
            <button className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm ${selectedNeighborhood ? "border-[#0048c4] bg-[#eaf2ff] text-[#0048c4]" : "border-[#cccccc] bg-white text-[#4d4d4d]"}`} onClick={() => {
                setPendingNeighborhood(selectedNeighborhood);
                setNeighborhoodSearch("");
                setIsNeighborhoodOpen(true);
              }} type="button">
              <LocationIcon /><span className="max-w-28 truncate">{selectedNeighborhood?.name ?? "محله"}</span>
            </button>
            <button className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm ${sort !== "score" ? "border-[#0048c4] bg-[#eaf2ff] text-[#0048c4]" : "border-[#cccccc] bg-white text-[#4d4d4d]"}`} onClick={() => setIsSortOpen(true)} type="button">
              <SortIcon /><span>{sort === "score" ? "مرتب سازی" : sortOptions.find((item) => item.id === sort)?.title}</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 py-4">
          {showNotice ? <Notice onClose={() => setShowNotice(false)} /> : null}

          {agenciesQuery.isLoading ? (
            <><LoadingCard /><LoadingCard /><LoadingCard /></>
          ) : agenciesQuery.isError ? (
            <div className="mx-4 rounded-xl border border-[#ffd1d1] bg-[#fff7f7] px-4 py-6 text-center text-sm leading-6 text-[#a43232]">
              دریافت فهرست آژانس‌ها با خطا مواجه شد.
              <button className="mt-3 block w-full font-semibold text-[#0048c4]" onClick={() => void agenciesQuery.refetch()} type="button">تلاش دوباره</button>
            </div>
          ) : agencies.length === 0 ? (
            <div className="mx-4 rounded-xl bg-[#f7f7f7] px-4 py-10 text-center text-sm leading-6 text-[#808080]">آژانسی با این مشخصات پیدا نشد.</div>
          ) : (
            agencies.map((agency, index) => (
              <AgencyCard
                agency={agency}
                key={agency.id}
                loadMoreRef={index === preloadIndex ? loadMoreRef : undefined}
                onOpenProfile={() => openProfile(agency)}
                onSelect={() => selectAgency(agency)}
                selected={selectedAgencyId === agency.id}
              />
            ))
          )}

          {agenciesQuery.isFetchingNextPage ? <LoadingCard /> : null}
        </div>
      </main>

      <footer className="absolute inset-x-0 bottom-0 z-30 flex h-[76px] items-center gap-3 border-t border-[#eeeeee] bg-white px-4" dir="rtl">
        <button className="flex h-12 w-[100px] shrink-0 items-center justify-center gap-2 rounded-xl border border-[#cccccc] bg-white text-base font-semibold text-[#1a1a1a] active:bg-[#f7f7f7]" onClick={() => setView("map")} type="button">
          <MapIcon /><span>نقشه</span>
        </button>
        <button
          className="h-12 min-w-0 flex-1 rounded-xl bg-[#0b55d4] px-4 text-base font-semibold text-white disabled:bg-[#e3e3e3] disabled:text-[#b3b3b3]"
          disabled={!selectedAgency}
          onClick={() => selectedAgency && onConfirm(selectedAgency)}
          type="button"
        >
          ارسال به آژانس
        </button>
      </footer>

      <BottomSheet
        ariaLabel="مرتب سازی"
        contentClassName="pb-5"
        heightClassName="h-[430px]"
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        panelPaddingClassName="pt-3"
        showHeader={false}
      >
        <div className="px-4" dir="rtl">
          <div className="flex h-14 items-center gap-2">
            <button
              aria-label="بستن مرتب سازی"
              className="grid h-10 w-10 shrink-0 place-items-center text-[#4d4d4d]"
              onClick={() => setIsSortOpen(false)}
              type="button"
            >
              <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path d="M4 12h16m-5-5 5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
              </svg>
            </button>
            <h2 className="m-0 text-lg font-semibold leading-7 text-[#1a1a1a]">مرتب سازی بر اساس:</h2>
          </div>

          <div className="pt-1">
            {sortOptions.map((item) => {
              const checked = sort === item.id;
              return (
                <button
                  className="flex h-[64px] w-full items-center justify-between text-right text-base font-normal text-[#1a1a1a] active:bg-[#fafafa]"
                  key={item.id}
                  onClick={() => {
                    setSort(item.id);
                    setIsSortOpen(false);
                  }}
                  type="button"
                >
                  <span>{item.title}</span>
                  <Radio checked={checked} />
                </button>
              );
            })}
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
