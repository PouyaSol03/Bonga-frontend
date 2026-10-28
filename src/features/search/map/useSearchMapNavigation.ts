import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { getSearchQuery } from "../searchFilters";
import type { SearchFilterChip } from "../searchMapData";
import type { SearchMapQuickFilterId } from "../components/SearchMapQuickFilterBottomSheet";
import type { SavedSearchItem } from "../api/saved-search.service";
import { quickFilterIds, SEARCH_FILTER_ENTRY_KEY } from "./constants";
import {
  buildFilterPageUrl,
  getSearchParams,
  writeSearchParams,
} from "./searchParamsHelpers";
import { removeFilterFromSearch } from "./chipHelpers";
import type { SearchMapMode } from "./types";
import { useSearchMapBackNavigation } from "./useSearchMapBackNavigation";

interface UseSearchMapNavigationOptions {
  setIsSearchOpen: (open: boolean) => void;
  setMode: (mode: SearchMapMode) => void;
  setQuickFilterId: (id: SearchMapQuickFilterId | null) => void;
  setSelectedListingId: (id: string | number | null) => void;
}

export function useSearchMapNavigation({
  setIsSearchOpen,
  setMode,
  setQuickFilterId,
  setSelectedListingId,
}: UseSearchMapNavigationOptions) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = getSearchParams();
    const hasLegacySearchQuery = params.has("qsearch") || params.has("q");

    if (!hasLegacySearchQuery) return;

    const query = getSearchQuery(params);

    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }

    params.delete("qsearch");
    params.delete("q");
    writeSearchParams(params, navigate, { replace: true });
  }, [navigate]);

  const toggleChip = useCallback(
    (chip: SearchFilterChip) => {
      if (chip.id !== "filters") {
        if (quickFilterIds.includes(chip.id as (typeof quickFilterIds)[number])) {
          setQuickFilterId(chip.id as SearchMapQuickFilterId);
          return;
        }
      }

      navigate(buildFilterPageUrl(chip), {
        state: { ...(window.history.state ?? {}), [SEARCH_FILTER_ENTRY_KEY]: true },
      });
    },
    [navigate, setQuickFilterId],
  );

  const handleQuickFilterApply = useCallback(
    (params: URLSearchParams) => {
      setSelectedListingId(null);
      writeSearchParams(params, navigate);
    },
    [navigate, setSelectedListingId],
  );

  const handleRemoveChip = useCallback(
    (chip: SearchFilterChip) => {
      removeFilterFromSearch(chip, navigate);
    },
    [navigate],
  );

  const handleSearchResult = useCallback(
    (item: { title: string }) => {
      const params = getSearchParams();

      params.set("query", item.title);
      params.delete("qsearch");
      params.delete("q");
      setIsSearchOpen(false);
      setSelectedListingId(null);
      writeSearchParams(params, navigate, { replace: true });
    },
    [navigate, setIsSearchOpen, setSelectedListingId],
  );

  const handleLiveSearchQueryChange = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();
      const params = getSearchParams();
      const currentQuery = getSearchQuery(params);

      if (!trimmedQuery && !currentQuery && !params.get("qsearch") && !params.get("q")) return;
      if (
        trimmedQuery &&
        currentQuery === trimmedQuery &&
        !params.get("qsearch") &&
        !params.get("q")
      )
        return;

      if (trimmedQuery) {
        params.set("query", trimmedQuery);
      } else {
        params.delete("query");
      }

      params.delete("qsearch");
      params.delete("q");
      setSelectedListingId(null);
      writeSearchParams(params, navigate, { replace: true });
    },
    [navigate, setSelectedListingId],
  );

  const handleSavedSearchSelect = useCallback(
    (item: SavedSearchItem) => {
      let params: URLSearchParams;

      if (item.url) {
        try {
          const savedUrl = new URL(item.url, window.location.origin);
          params = savedUrl.searchParams;
        } catch {
          params = new URLSearchParams();
        }
      } else {
        params = new URLSearchParams();
        Object.entries(item.filters).forEach(([key, value]) => {
          params.set(key, Array.isArray(value) ? value.join("_") : String(value));
        });
      }

      params.delete("focus");
      params.delete("view");
      writeSearchParams(params, navigate);
      setSelectedListingId(null);
      setMode("map");
    },
    [navigate, setMode, setSelectedListingId],
  );

  const { handleBack, navigateToLoginRequired } = useSearchMapBackNavigation();

  const changeViewMode = useCallback(
    (nextMode: "map" | "list") => {
      const params = getSearchParams();

      if (nextMode === "list") {
        params.set("view", "list");
        params.delete("focus");
      } else {
        params.delete("view");
      }

      const queryString = params.toString();
      const nextUrl = queryString ? `/search?${queryString}` : "/search";
      navigate(nextUrl, { replace: true });
      setSelectedListingId(null);
      setMode(nextMode);
    },
    [navigate, setMode, setSelectedListingId],
  );

  const returnToMapView = useCallback(() => {
    changeViewMode("map");
  }, [changeViewMode]);

  return {
    changeViewMode,
    handleBack,
    handleLiveSearchQueryChange,
    handleQuickFilterApply,
    handleRemoveChip,
    handleSearchResult,
    handleSavedSearchSelect,
    location,
    navigate,
    navigateToLoginRequired,
    returnToMapView,
    toggleChip,
  };
}
