import { SEO } from "../../shared/components/SEO";
import "./searchMap.css";
import { isNoConnectionError } from "../../shared/components/ErrorState";
export { readSearchFilters } from "./searchFilters";
import { SearchMapFloatingActions } from "./components/SearchMapFloatingActions";
import { SearchMapGeofenceControls } from "./components/SearchMapGeofenceControls";
import { SearchMapHeader } from "./components/SearchMapHeader";
import { SearchMapListingSlider } from "./components/SearchMapListingSlider";
import { SearchMapOfflineView } from "./components/SearchMapOfflineView";
import { SearchMapOverlays } from "./components/SearchMapOverlays";
import { SearchMapResultsSummary } from "./components/SearchMapResultsSummary";
import { SearchMapViewContainer } from "./components/SearchMapViewContainer";
import { SearchNoResultsView } from "./components/SearchNoResultsView";
import { getActiveFilterCount, getSearchParamsFromSnapshot } from "./map/searchParamsHelpers";
import { useSearchMapPageState } from "./map/useSearchMapPageState";

export function SearchMapPage() {
  const {
    closeSearch, currentSearch, geofence, handleBoundsChange, handleMapClick,
    handleSelectListing,
    handleSliderActiveListing,
    isSearchOpen,
    locationState,
    mapCenter,
    mapCenterSignal,
    mapResizeSignal,
    mode,
    nav,
    openSearch,
    queries,
    quickFilterId,
    saveAndRequest,
    searchInitialView,
    seenListingIds,
    selectedListingId,
    setQuickFilterId,
  } = useSearchMapPageState();

  const isListPreviewOpen = mode === "preview";
  const isFullListOpen = mode === "list";
  const showListEmptyState =
    queries.hasActiveSearchCriteria &&
    queries.listQuery.isSuccess &&
    !queries.isListLoading &&
    queries.apiListListings.length === 0;
  const showCurrentEmptyState = isFullListOpen && showListEmptyState;
  const isGeofenceEditorOpen =
    mode === "map" &&
    !showCurrentEmptyState &&
    (geofence.isDrawMode || geofence.drawingState === "preview" || geofence.drawingState === "invalid");

  if (locationState.isOffline || (queries.mapQuery.isError && isNoConnectionError(queries.mapQuery.error))) {
    return (
      <SearchMapOfflineView
        chips={queries.chips}
        isCurrentSearchSaved={saveAndRequest.isCurrentSearchSaved}
        isSaveSearchDisabled={!saveAndRequest.saveSearchInput}
        isSavingSearch={saveAndRequest.saveSearchMutation.isPending}
        onBack={nav.handleBack}
        onChipClick={nav.toggleChip}
        onChipRemove={nav.handleRemoveChip}
        onRetry={() => {
          locationState.setIsOffline(!window.navigator.onLine);
          void queries.mapQuery.refetch();
          void queries.listQuery.refetch();
        }}
        onSavedClick={saveAndRequest.handleSaveSearch}
        onSearchClick={openSearch}
        queryLabel={queries.queryLabel}
        savedCount={saveAndRequest.savedSearchesQuery.data?.length ?? 0}
      />
    );
  }

  const containerClass = isGeofenceEditorOpen
    ? "bg-surface-container fixed inset-y-0 left-1/2 z-[900] h-[100svh] w-full max-w-[500px] -translate-x-1/2 overflow-hidden"
    : "bg-surface-container relative h-full min-h-0 overflow-hidden";

  return (
    <div className={containerClass}>
      {mode === "map" && queries.isInitialMapLoading ? (
        <div className="pointer-events-none absolute inset-0 z-[450] flex items-center justify-center bg-black/10 backdrop-blur-[1px] transition-opacity">
          <div className="bg-surface-container-lowest flex items-center gap-2 rounded-xl px-4 py-2.5 shadow-lg [direction:rtl]">
            <div className="border-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
            <span className="text-on-surface text-sm font-medium">در حال بارگذاری نقشه...</span>
          </div>
        </div>
      ) : null}
      <SEO
        title="جستجوی روی نقشه املاک | خرید و اجاره آپارتمان، خانه و زمین"
        description="جستجوی پیشرفته و موقعیت‌محور املاک روی نقشه نشونو. به راحتی آپارتمان، خانه ویلایی، زمین و مغازه مورد نظر خود را در محله دلخواه برای خرید یا اجاره پیدا کنید."
        keywords="جستجوی املاک روی نقشه, نقشه املاک, خرید خانه در محله, قیمت آپارتمان در مناطق مختلف, اجاره آپارتمان از روی نقشه, نشونو, neshoono"
      />
      <h1 className="sr-only">جستجوی آگهی‌های املاک روی نقشه نشونو</h1>
      {!showCurrentEmptyState ? (
        <SearchMapViewContainer
          apiListListings={queries.apiListListings}
          bluePriceMarkerListingIds={queries.bluePriceMarkerListingIds}
          geofence={geofence}
          isFullListOpen={isFullListOpen}
          isGeofenceEditorOpen={isGeofenceEditorOpen}
          isListLoading={queries.isListLoading}
          mapCenter={mapCenter}
          mapCenterSignal={mapCenterSignal}
          mapResizeSignal={mapResizeSignal}
          neighborhoodGeofences={queries.selectedNeighborhoodGeofences}
          onBoundsChange={handleBoundsChange}
          onMapClick={handleMapClick}
          onReturnToMapView={nav.returnToMapView}
          onSelectListing={handleSelectListing}
          seenListingIds={seenListingIds}
          selectedListingId={selectedListingId}
          userLocation={locationState.userLocation}
          visibleListings={queries.visibleListings}
        />
      ) : null}

      {showCurrentEmptyState ? (
        <SearchNoResultsView
          hasFilters={getActiveFilterCount(getSearchParamsFromSnapshot(currentSearch)) > 0}
          mode={isFullListOpen ? "list" : "map"}
          onRequestSubmit={saveAndRequest.handleEmptyRequestSubmit}
          onToggleMode={() => nav.changeViewMode(isFullListOpen ? "map" : "list")}
        />
      ) : null}

      {!isGeofenceEditorOpen ? (
        <SearchMapHeader
          savedCount={saveAndRequest.savedSearchesQuery.data?.length ?? 0}
          isCurrentSearchSaved={saveAndRequest.isCurrentSearchSaved}
          isSavingSearch={saveAndRequest.saveSearchMutation.isPending}
          isSaveSearchDisabled={!saveAndRequest.saveSearchInput}
          chips={queries.chips}
          onChipClick={nav.toggleChip}
          onChipRemove={nav.handleRemoveChip}
          queryLabel={queries.queryLabel}
          onSearchClick={openSearch}
          onSavedClick={saveAndRequest.handleSaveSearch}
          onBack={nav.handleBack}
        />
      ) : null}

      {mode === "map" && !isGeofenceEditorOpen && !showCurrentEmptyState ? (
        <SearchMapResultsSummary
          count={queries.mapQuery.data?.length ?? 0}
          hasGeofence={geofence.isGeofenceConfirmed}
          isLoading={queries.isInitialMapLoading}
          onRemoveGeofence={geofence.clearConfirmedGeofence}
        />
      ) : null}

      <SearchMapFloatingActions
        isDrawing={geofence.isDrawMode}
        isEditorMode={isGeofenceEditorOpen}
        isHidden={mode !== "map" || showCurrentEmptyState || isGeofenceEditorOpen}
        isLocated={locationState.isLocated}
        isLocating={locationState.isLocating}
        onLocateClick={locationState.locateUser}
        onHandClick={geofence.startFreehandDrawing}
        onListClick={() => nav.changeViewMode("list")}
        showListButton={!isGeofenceEditorOpen}
      />

      {isGeofenceEditorOpen ? (
        <SearchMapGeofenceControls
          drawingState={geofence.drawingState}
          errorMessage={geofence.geofenceError}
          geofenceResult={geofence.geofenceResult}
          onBack={geofence.cancelFreehandDrawing}
          onConfirm={geofence.confirmGeofence}
          onDelete={geofence.deleteGeofenceAndRedraw}
        />
      ) : null}

      <SearchMapListingSlider
        isLoading={queries.isMapLoading}
        isOpen={isListPreviewOpen && !isGeofenceEditorOpen}
        listings={queries.visibleListings}
        selectedListingId={selectedListingId}
        onActiveListingChange={handleSliderActiveListing}
      />

      <SearchMapOverlays
        closeSearch={closeSearch}
        currentSearch={currentSearch}
        isSearchOpen={isSearchOpen}
        nav={nav}
        queries={queries}
        quickFilterId={quickFilterId}
        saveAndRequest={saveAndRequest}
        searchInitialView={searchInitialView}
        setQuickFilterId={setQuickFilterId}
      />
    </div>
  );
}
