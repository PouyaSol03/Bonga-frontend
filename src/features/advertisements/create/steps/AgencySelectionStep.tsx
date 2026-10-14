import { useEffect, useMemo, useRef, useState } from "react";

import { BottomSheet } from "../../../../shared/components/BottomSheet";
import { TopBar } from "../../../../shared/components/TopBar";
import { RadioIndicator } from "../../../../shared/components/RadioIndicator";
import { SearchEmptyState } from "../../../../shared/components/SearchEmptyState";
import { SortIcon } from "../components/SortIcon";
import { useAgencyInfiniteQuery } from "../../../agencies/api/agency.hooks";
import { useNeighborhoodListQuery } from "../../../locations/api/neighborhood.hooks";
import { readStoredSelectedCity } from "../../../../shared/lib/selectedCityStorage";
import type { AgencySort, PublicAgencyDto } from "../../../agencies/api/agency.service";
import type { NeighborhoodDto } from "../../../locations/api/neighborhood.service";
import { AgencyNeighborhoodFilterPage } from "./AgencyNeighborhoodFilterPage";
import {
  AgencyDirectoryMapView,
  type AgencyDirectoryMapItem,
} from "../../../consultants/AgencyDirectoryMapView";
import LinearArrowLeft2 from "../../../../shared/icons/LinearArrowLeft2";
import LinearArrowRight2 from "../../../../shared/icons/LinearArrowRight2";
import LinearStar from "../../../../shared/icons/LinearStar";
import LinearRanking from "../../../../shared/icons/LinearRanking";
import LinearMapsLocation from "../../../../shared/icons/LinearMapsLocation";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";
import { useNavigate } from "react-router";
import { preserveNewAdDraftStateKey } from "../session";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";

type SelectedAgency = Pick<PublicAgencyDto, "id" | "name">;

const pageSize = 20;
const loadMoreRemainingCount = 10;

const sortOptions: Array<{ id: AgencySort; title: string }> = [
  { id: "score", title: "امتیاز" },
  { id: "rank", title: "رتبه" },
  { id: "newest", title: "جدیدترین" },
  { id: "oldest", title: "با سابقه‌ترین" },
];

function useDebouncedValue(value: string, delay = 300) {
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
      <path
        d="M15.8 8.2c0 3.9-5.8 8.3-5.8 8.3S4.2 12.1 4.2 8.2a5.8 5.8 0 1 1 11.6 0Z"
        stroke="currentColor"
        strokeWidth="1.45"
      />
      <circle cx="10" cy="8.1" r="2" stroke="currentColor" strokeWidth="1.45" />
    </svg>
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
      className={`mx-4 overflow-hidden rounded-[13px] border transition-colors ${selected ? "border-primary bg-primary-container/20" : "border-outline-var bg-surface-container-lowest"}`}
      ref={loadMoreRef}
    >
      <Button
        unstyled
        className="flex w-full gap-4 px-4 pt-4 pb-4 text-right"
        onClick={onSelect}
        type="button"
      >
        {image ? (
          <img alt="" className="h-[72px] w-[72px] shrink-0 rounded-xl object-cover" src={image} />
        ) : (
          <Typography
            as="span"
            variant="headline"
            size="small"
            className="bg-primary-container text-primary grid h-[72px] w-[72px] shrink-0 place-items-center rounded-xl text-2xl font-bold"
          >
            {agency.name.trim().charAt(0) || "آ"}
          </Typography>
        )}

        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="flex min-w-0 flex-1 flex-col justify-between py-1.5"
        >
          <strong className="text-on-surface-var truncate text-base font-medium">
            {agency.name}
          </strong>
          <Typography
            as="span"
            variant="body"
            size="small"
            weight="regular"
            className="text-on-surface flex items-center justify-between text-xs"
          >
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="flex items-center gap-1"
            >
              <LinearStar className="text-on-surface-var h-4 w-4" />
              <Typography as="span" variant="body" size="medium" weight="regular">
                امتیاز
              </Typography>
              <b className="text-tertiary px-2 font-semibold">{agency.score}</b>
            </Typography>
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="flex items-center gap-1"
            >
              <LinearRanking className="text-on-surface-var h-4 w-4" />
              <Typography as="span" variant="body" size="medium" weight="regular">
                رتبه
              </Typography>
              <b className="text-tertiary px-2 font-semibold">{agency.rank}</b>
            </Typography>
          </Typography>
        </Typography>
      </Button>

      <div className="bg-outline-var mx-4 h-px" />

      <div className="flex h-[58px] items-center justify-between gap-3 px-4" dir="rtl">
        <Button
          unstyled
          className="text-on-surface-var flex items-center gap-3"
          onClick={onSelect}
          type="button"
        >
          <RadioIndicator checked={selected} />
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-sm font-medium"
          >
            انتخاب
          </Typography>
        </Button>
        <Button
          unstyled
          className={`flex h-10 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 ${selected ? "border-primary text-primary" : "border-outline-var text-on-surface"}`}
          onClick={onOpenProfile}
          type="button"
        >
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-sm font-medium"
          >
            مشاهده پروفایل آژانس
          </Typography>
          <LinearArrowLeft2 className="text-on-surface-var h-5 w-5" />
        </Button>
      </div>
    </article>
  );
}

function Notice({ onClose }: { onClose: () => void }) {
  return (
    <aside className="border-warning bg-warning-container/30 text-on-surface-var mx-4 rounded-[13px] border px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="text-warning flex items-center gap-2">
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="semibold"
            className="grid h-5 w-5 place-items-center rounded-full border border-current text-xs font-bold"
          >
            !
          </Typography>
          <strong className="text-base">توجه!</strong>
        </div>
        <Button
          unstyled
          aria-label="بستن پیام"
          className="grid h-8 w-8 place-items-center text-xl"
          onClick={onClose}
          type="button"
        >
          ×
        </Button>
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
    <div className="border-outline-var bg-surface-container-lowest mx-4 h-[164px] animate-pulse rounded-[13px] border p-4">
      <div className="flex gap-4">
        <div className="bg-surface-container h-[72px] w-[72px] rounded-xl" />
        <div className="flex-1">
          <div className="bg-surface-container h-5 w-2/3 rounded" />
          <div className="bg-surface-container mt-5 h-4 w-full rounded" />
        </div>
      </div>
      <div className="bg-outline-var mt-4 h-px" />
      <div className="bg-surface-container mt-3 h-9 rounded-xl" />
    </div>
  );
}

export function AgencySelectionStep({
  onBack,
  onConfirm,
  onSelect,
  selectedAgencyName,
  selectedAgencyId,
  submitDisabled = false,
}: {
  onBack: () => void;
  onConfirm: (agency: SelectedAgency) => void;
  onSelect: (agency: SelectedAgency | null) => void;
  selectedAgencyName?: string;
  selectedAgencyId?: string;
  submitDisabled?: boolean;
}) {
  const navigate = useNavigate();
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
  const debouncedNeighborhoodSearch = useDebouncedValue(neighborhoodSearch.trim(), 300);
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
  const selectedAgency = useMemo(() => {
    if (selectedAgencyCache?.id === selectedAgencyId) {
      return selectedAgencyCache;
    }

    const agencyFromCurrentResults = agencies.find((agency) => agency.id === selectedAgencyId);

    if (agencyFromCurrentResults) return agencyFromCurrentResults;

    if (!selectedAgencyId || !selectedAgencyName?.trim()) return null;

    return {
      id: selectedAgencyId,
      name: selectedAgencyName.trim(),
    } satisfies SelectedAgency;
  }, [agencies, selectedAgencyCache, selectedAgencyId, selectedAgencyName]);
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
    navigate(`/agencies/${encodeURIComponent(agency.id)}`, {
      state: { [preserveNewAdDraftStateKey]: true },
    });
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
          confirmDisabled={!selectedAgency || submitDisabled}
          items={mapItems}
          onBack={() => setView("list")}
          onConfirmSelection={() => {
            if (!submitDisabled && selectedAgency) onConfirm(selectedAgency);
          }}
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
      <main
        className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-28"
        dir="rtl"
      >
        <div className="bg-surface-container sticky top-0 z-20 px-4 pt-4 pb-3 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
          <label className="border-outline bg-surface-container-lowest text-on-surface-var focus-within:border-primary flex h-12 items-center gap-3 rounded-xl border px-4">
            <SearchIcon />
            <input
              className="placeholder:text-outline min-w-0 flex-1 border-0 bg-transparent text-right text-base outline-none"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="جستجوی آژانس"
              value={search}
            />
          </label>
          <div className="mt-2 flex items-center justify-start gap-2">
            <Button
              unstyled
              className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm ${selectedNeighborhood ? "border-primary bg-primary-container text-primary" : "border-outline-var bg-surface-container-lowest text-on-surface-var"}`}
              onClick={() => {
                setPendingNeighborhood(selectedNeighborhood);
                setNeighborhoodSearch("");
                setIsNeighborhoodOpen(true);
              }}
              type="button"
            >
              <LocationIcon />
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="max-w-28 truncate"
              >
                {selectedNeighborhood?.name ?? "محله"}
              </Typography>
            </Button>
            <Button
              unstyled
              className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm ${sort !== "score" ? "border-primary bg-primary-container text-primary" : "border-outline-var bg-surface-container-lowest text-on-surface-var"}`}
              onClick={() => setIsSortOpen(true)}
              type="button"
            >
              <SortIcon className="text-on-surface-var h-5 w-5" />
              <Typography as="span" variant="body" size="medium" weight="regular">
                {sort === "score"
                  ? "مرتب سازی"
                  : sortOptions.find((item) => item.id === sort)?.title}
              </Typography>
            </Button>
          </div>
        </div>

        <div className="space-y-4 py-4">
          {showNotice ? <Notice onClose={() => setShowNotice(false)} /> : null}

          {agenciesQuery.isLoading ? (
            <>
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </>
          ) : agenciesQuery.isError ? (
            <div className="border-error/30 bg-error-container/30 text-error mx-4 rounded-xl border px-4 py-6 text-center text-sm leading-6">
              دریافت فهرست آژانس‌ها با خطا مواجه شد.
              <Button
                unstyled
                className="text-primary mt-3 block w-full font-semibold"
                onClick={() => void agenciesQuery.refetch()}
                type="button"
              >
                تلاش دوباره
              </Button>
            </div>
          ) : agencies.length === 0 ? (
            <SearchEmptyState />
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

      <footer
        className="border-outline-var bg-surface-container-lowest absolute inset-x-0 bottom-0 z-30 flex h-[76px] items-center gap-3 border-t px-4"
        dir="rtl"
      >
        <Button
          unstyled
          className="border-outline-var bg-surface-container-lowest text-on-surface active:bg-surface-container flex h-12 w-[100px] shrink-0 items-center justify-center gap-2 rounded-xl border text-base font-semibold"
          onClick={() => setView("map")}
          type="button"
        >
          <LinearMapsLocation className="text-on-surface-var h-6 w-6" />
          <Typography as="span" variant="body" size="medium" weight="regular">
            نقشه
          </Typography>
        </Button>
        <Button
          unstyled
          className="bg-primary text-on-primary disabled:bg-surface-container-high disabled:text-outline h-12 min-w-0 flex-1 rounded-xl px-4 text-base font-semibold"
          disabled={!selectedAgency || submitDisabled}
          onClick={() => {
            if (!submitDisabled && selectedAgency) onConfirm(selectedAgency);
          }}
          type="button"
        >
          {submitDisabled ? "در حال ارسال..." : "ارسال به آژانس"}
        </Button>
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
        <div className="px-4 pt-4" dir="rtl">
          <div className="flex h-14 items-center gap-2">
            <Button
              unstyled
              aria-label="بازگشت"
              className="text-on-surface-var grid h-10 w-10 shrink-0 place-items-center"
              onClick={() => setIsSortOpen(false)}
              type="button"
            >
              <LinearArrowRight2 aria-hidden="true" className="h-6 w-6" />
            </Button>
            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="semibold"
              className="text-on-surface m-0 text-lg leading-7 font-semibold"
            >
              مرتب سازی بر اساس:
            </Typography>
          </div>

          <div className="pt-1">
            {sortOptions.map((item) => {
              const checked = sort === item.id;
              return (
                <Button
                  unstyled
                  className="text-on-surface active:bg-surface-container flex h-[64px] w-full items-center justify-between text-right text-base font-normal"
                  key={item.id}
                  onClick={() => {
                    setSort(item.id);
                    setIsSortOpen(false);
                  }}
                  type="button"
                >
                  <Typography as="span" variant="body" size="medium" weight="regular">
                    {item.title}
                  </Typography>
                  <RadioIndicator checked={checked} />
                </Button>
              );
            })}
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
