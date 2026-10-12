import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { SEO } from "../../shared/components/SEO";
import { Typography } from "../../shared/ui/Typography";
import { pushRoute } from "../../shared/navigation/navigation";
import { defaultSelectedCity } from "../../shared/lib/selectedCityStorage";
import { clearConsultantsSelectedNeighborhood } from "./consultantsNeighborhoodSelection";
import { AgencyDirectoryMapView } from "./AgencyDirectoryMapView";
import { DirectoryFilterBar } from "./components/DirectoryFilterBar";
import { SearchIcon } from "./components/DirectoryIcons";
import { DirectoryList } from "./components/DirectoryList";
import { DirectoryMapButton } from "./components/DirectoryMapButton";
import { DirectoryModeSheet } from "./components/DirectoryModeSheet";
import { DirectorySortSheet } from "./components/DirectorySortSheet";
import { useConsultantsDirectory } from "./hooks/useConsultantsDirectory";

export function ConsultantsDirectoryPage() {
  const {
    activeQuery,
    agencyDirectoryItems,
    handleModeChange,
    isMapOpen,
    isModeSheetOpen,
    isSortSheetOpen,
    items,
    loadMoreSentinelRef,
    loadMoreTriggerIndex,
    mode,
    navigateToAgency,
    navigateToAgent,
    search,
    selectedCity,
    selectedMapAgencyId,
    selectedNeighborhood,
    selectedSort,
    selectedSortOption,
    setIsMapOpen,
    setIsModeSheetOpen,
    setIsSortSheetOpen,
    setSearch,
    setSelectedMapAgencyId,
    setSelectedNeighborhood,
    setSelectedSort,
  } = useConsultantsDirectory();

  const isConsultant = mode === "consultant";
  const seoTitle = isConsultant
    ? "مشاوران املاک | جستجو و مقایسه مشاوران در بنگاه"
    : "آژانس‌های املاک | جستجو و مقایسه آژانس‌ها در بنگاه";
  const seoDescription = isConsultant
    ? "فهرست مشاوران املاک در بنگاه؛ مشاوران را بر اساس امتیاز، رتبه و محدوده فعالیت بررسی و مقایسه کنید."
    : "فهرست آژانس‌های املاک در بنگاه؛ آژانس‌ها را بر اساس امتیاز، رتبه، محدوده فعالیت و آگهی‌های فعال بررسی کنید.";

  const directorySeo = (
    <SEO
      description={seoDescription}
      keywords="مشاور املاک, آژانس املاک, بهترین مشاور املاک, بهترین آژانس املاک, بنگاه املاک"
      title={seoTitle}
    />
  );

  const searchPlaceholder = mode === "agency" ? "جستجوی آژانس" : "جستجوی مشاور";
  const neighborhoodChipLabel = selectedNeighborhood?.name ?? "محله";

  const openNeighborhoodPage = () => {
    const state = typeof window.history.state === "object" && window.history.state ? window.history.state : {};
    window.history.replaceState({ ...state, consultantsDirectoryState: { search, selectedSort } }, "", `${window.location.pathname}${window.location.search}`);
    pushRoute("/consultants/neighborhood");
  };

  const clearNeighborhood = () => {
    clearConsultantsSelectedNeighborhood();
    setSelectedNeighborhood(null);
  };

  if (isMapOpen && mode === "agency") {
    const mapCenter =
      selectedCity?.latitude !== undefined &&
      selectedCity.longitude !== undefined
        ? { latitude: selectedCity.latitude, longitude: selectedCity.longitude }
        : {
            latitude: defaultSelectedCity.latitude,
            longitude: defaultSelectedCity.longitude,
          };

    return (
      <PageFrame className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container text-on-surface [direction:rtl]" variant="flush">
        {directorySeo}
        <h1 className="sr-only">{seoTitle}</h1>
        <AgencyDirectoryMapView
          center={mapCenter}
          items={agencyDirectoryItems}
          onBack={() => { setSelectedMapAgencyId(null); setIsMapOpen(false); }}
          onOpenAgency={navigateToAgency}
          onOpenList={() => { setSelectedMapAgencyId(null); setIsMapOpen(false); }}
          onSelectAgency={setSelectedMapAgencyId}
          selectedAgencyId={selectedMapAgencyId}
        />
      </PageFrame>
    );
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container-lowest text-on-surface [direction:rtl]"
      variant="flush"
    >
      {directorySeo}
      <h1 className="sr-only">{seoTitle}</h1>
      <div className="shrink-0 bg-surface-container-lowest">
        <TopBar
          className="bg-surface-container-lowest"
          onBack={() => pushRoute("/home", undefined, { rememberCurrent: false })}
          placement="inline"
          title="مشاورین"
        />

        <div className="px-4 pt-2">
          <label className="relative flex items-center rounded-xl border border-outline bg-surface-container-lowest text-outline">
            <input
              className="h-full w-full rounded-[inherit] border-0 bg-transparent px-4 py-3 text-right text-base font-normal leading-6 text-on-surface outline-none placeholder:text-outline"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              type="search"
              value={search}
            />
            <Typography as="span" variant="body" size="medium" weight="regular" className="absolute left-5 top-1/2 -translate-y-1/2 text-outline">
              <SearchIcon />
            </Typography>
          </label>
        </div>

        <DirectoryFilterBar
          mode={mode}
          neighborhoodChipLabel={neighborhoodChipLabel}
          onClearNeighborhood={clearNeighborhood}
          onOpenModeSheet={() => setIsModeSheetOpen(true)}
          onOpenNeighborhoodSelect={openNeighborhoodPage}
          onOpenSortSheet={() => setIsSortSheetOpen(true)}
          selectedNeighborhood={selectedNeighborhood}
          selectedSortOption={selectedSortOption}
        />
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container-lowest py-4 [-webkit-overflow-scrolling:touch]">
        <DirectoryList
          error={activeQuery.error}
          hasNextPage={Boolean(activeQuery.hasNextPage)}
          isError={activeQuery.isError}
          isFetchingNextPage={activeQuery.isFetchingNextPage}
          isLoading={activeQuery.isLoading}
          items={items}
          loadMoreSentinelRef={loadMoreSentinelRef}
          loadMoreTriggerIndex={loadMoreTriggerIndex}
          mode={mode}
          onItemClick={mode === "agency" ? navigateToAgency : navigateToAgent}
          onRetry={() => void activeQuery.refetch()}
        />
      </main>

      {mode === "agency" ? (
        <DirectoryMapButton
          onClick={() => {
            setSelectedMapAgencyId(null);
            setIsMapOpen(true);
          }}
        />
      ) : null}

      <DirectoryModeSheet
        isOpen={isModeSheetOpen}
        mode={mode}
        onClose={() => setIsModeSheetOpen(false)}
        onSelectMode={handleModeChange}
      />

      <DirectorySortSheet
        isOpen={isSortSheetOpen}
        onClose={() => setIsSortSheetOpen(false)}
        onSelectSort={(sort) => {
          setSelectedSort(sort);
          setIsSortSheetOpen(false);
        }}
        selectedSort={selectedSort}
      />
    </PageFrame>
  );
}
