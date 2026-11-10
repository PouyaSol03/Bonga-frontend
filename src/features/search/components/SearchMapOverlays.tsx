import { searchMapMinQueryLength } from "../searchFilters";
import type { SavedSearchItem } from "../api/saved-search.service";
import type { useSearchMapNavigation } from "../map/useSearchMapNavigation";
import type { useSearchMapQueries } from "../map/useSearchMapQueries";
import type { useSearchMapSaveAndRequest } from "../map/useSearchMapSaveAndRequest";
import { SearchMapQuickFilterBottomSheet, type SearchMapQuickFilterId } from "./SearchMapQuickFilterBottomSheet";
import { SearchMapSearchScreen } from "./SearchMapSearchScreen";
import { SearchRequestSenderBottomSheet } from "./SearchRequestBottomSheets";

interface SearchMapOverlaysProps {
  closeSearch: () => void;
  currentSearch: string;
  isSearchOpen: boolean;
  nav: ReturnType<typeof useSearchMapNavigation>;
  queries: ReturnType<typeof useSearchMapQueries>;
  quickFilterId: SearchMapQuickFilterId | null;
  saveAndRequest: ReturnType<typeof useSearchMapSaveAndRequest>;
  searchInitialView: "search" | "saved";
  setQuickFilterId: (id: SearchMapQuickFilterId | null) => void;
}

export function SearchMapOverlays({
  closeSearch,
  currentSearch,
  isSearchOpen,
  nav,
  queries,
  quickFilterId,
  saveAndRequest,
  searchInitialView,
  setQuickFilterId,
}: SearchMapOverlaysProps) {
  const resultCount =
    queries.listQuery.data?.total ??
    queries.listQuery.data?.data.length ??
    queries.mapQuery.data?.length ??
    0;

  return (
    <>
      <SearchMapSearchScreen
        initialQuery={queries.currentSearchQuery}
        initialView={searchInitialView}
        isOpen={isSearchOpen}
        minSearchQueryLength={searchMapMinQueryLength}
        onBack={nav.handleBack}
        onClose={closeSearch}
        onQueryChange={nav.handleLiveSearchQueryChange}
        onSavedSelect={(item: SavedSearchItem) => nav.handleSavedSearchSelect(item)}
        onSubmit={(query: string) => nav.handleSearchResult({ title: query })}
        saveInput={saveAndRequest.saveSearchInput}
      />
      <SearchMapQuickFilterBottomSheet
        filterId={quickFilterId}
        isOpen={quickFilterId !== null}
        onApply={nav.handleQuickFilterApply}
        onClose={() => setQuickFilterId(null)}
        resultCount={resultCount}
        search={currentSearch}
      />
      <SearchRequestSenderBottomSheet
        isOpen={saveAndRequest.pendingSearchRequest !== null || saveAndRequest.isRequestSuccessOpen}
        isSuccess={saveAndRequest.isRequestSuccessOpen}
        onClose={() => {
          if (saveAndRequest.createPropertyRequestMutation.isPending) return;
          saveAndRequest.setPendingSearchRequest(null);
          saveAndRequest.setIsRequestSuccessOpen(false);
        }}
        onOpenResults={() => {
          window.location.assign(saveAndRequest.requestResultsPath);
        }}
        onSelect={saveAndRequest.handleConfirmSearchRequest}
        options={saveAndRequest.requestSenderOptions}
      />
    </>
  );
}
