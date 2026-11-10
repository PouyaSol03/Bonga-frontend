import { useCallback, useEffect, useState } from "react";
import { getStoredAuthSession } from "../../../shared/auth/auth-storage";
import { useToast } from "../../../shared/hooks/useToast";
import type {
  SearchMapBounds,
  SearchMapCenter,
  SearchMapListing,
  SearchMapListingId,
} from "../searchMapData";
import type { SearchMapQuickFilterId } from "../components/SearchMapQuickFilterBottomSheet";
import { getInitialMapCenter } from "./coordinateHelpers";
import { getInitialSearchMode } from "./searchParamsHelpers";
import type { SearchMapMode } from "./types";
import { useSearchMapGeofence } from "./useSearchMapGeofence";
import { useSearchMapNavigation } from "./useSearchMapNavigation";
import { useSearchMapQueries } from "./useSearchMapQueries";
import { useSearchMapSaveAndRequest } from "./useSearchMapSaveAndRequest";
import { useSearchMapUserLocation } from "./useSearchMapUserLocation";

export function useSearchMapPageState() {
  const [selectedListingId, setSelectedListingId] = useState<string | number | null>(null);
  const [seenListingIds, setSeenListingIds] = useState<Set<SearchMapListingId>>(() => new Set());
  const [mode, setMode] = useState<SearchMapMode>(getInitialSearchMode);
  const [quickFilterId, setQuickFilterId] = useState<SearchMapQuickFilterId | null>(null);
  const [searchInitialView, setSearchInitialView] = useState<"search" | "saved">("search");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<SearchMapCenter>(getInitialMapCenter);
  const [mapCenterSignal, setMapCenterSignal] = useState(0);
  const [mapResizeSignal, setMapResizeSignal] = useState(0);
  const [mapBounds, setMapBounds] = useState<SearchMapBounds | null>(null);

  const { showToast } = useToast();
  const showNotice = useCallback(
    (msg: string | null | undefined, variant?: "error" | "success" | "info" | "warning") => {
      if (!msg) return;
      const isError = /خطا|ناموفق|اشتباه|نشد/.test(msg);
      showToast(msg, undefined, variant ?? (isError ? "error" : "success"));
    },
    [showToast],
  );

  const isAuthenticated = Boolean(getStoredAuthSession());

  const nav = useSearchMapNavigation({
    setIsSearchOpen,
    setMode,
    setQuickFilterId,
    setSelectedListingId,
  });

  const geofence = useSearchMapGeofence({
    setMapResizeSignal,
    setMode,
    setSelectedListingId,
  });

  const locationState = useSearchMapUserLocation({
    setMapCenter,
    setMapCenterSignal,
    setMode,
    setSelectedListingId,
    showNotice,
  });

  const queries = useSearchMapQueries({
    confirmedGeofence: geofence.confirmedGeofence,
    currentSearch: nav.location.search,
    mapBounds,
    mapCenter,
    mode,
    selectedListingId,
    showNotice,
  });

  const openSavedSearches = useCallback(() => {
    setSearchInitialView("saved");
    setIsSearchOpen(true);
  }, []);

  const openSearch = useCallback(() => {
    setSearchInitialView("search");
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const saveAndRequest = useSearchMapSaveAndRequest({
    chips: queries.chips,
    currentSearch: nav.location.search,
    currentSearchQuery: queries.currentSearchQuery,
    isAuthenticated,
    navigateToLoginRequired: nav.navigateToLoginRequired,
    openSavedSearches,
    showNotice,
  });

  useEffect(() => {
    setMode(getInitialSearchMode());
    setSelectedListingId(null);
  }, [nav.location.search]);

  useEffect(() => {
    if (selectedListingId == null) return;
    const exists = queries.visibleListings.some(
      (listing) => String(listing.id) === String(selectedListingId),
    );
    if (!exists) {
      setSelectedListingId(null);
      setMode("map");
    }
  }, [queries.visibleListings, selectedListingId]);

  const handleBoundsChange = useCallback((bounds: SearchMapBounds) => {
    setMapBounds((current) => {
      if (
        current &&
        Math.abs(current.north - bounds.north) < 0.00001 &&
        Math.abs(current.south - bounds.south) < 0.00001 &&
        Math.abs(current.east - bounds.east) < 0.00001 &&
        Math.abs(current.west - bounds.west) < 0.00001
      ) {
        return current;
      }
      return bounds;
    });
  }, []);

  const handleSelectListing = useCallback((listing: SearchMapListing) => {
    setSeenListingIds((current) => {
      if (current.has(listing.id)) return current;
      const next = new Set(current);
      next.add(listing.id);
      return next;
    });
    setSelectedListingId(listing.id);
    setMode("preview");
  }, []);

  const handleMapClick = useCallback(() => {
    if (geofence.isDrawMode) return;
    setSelectedListingId(null);
    setMode("map");
  }, [geofence.isDrawMode]);

  const handleSliderActiveListing = useCallback((listing: SearchMapListing) => {
    setSelectedListingId(listing.id);
  }, []);

  return {
    closeSearch,
    currentSearch: nav.location.search,
    geofence,
    handleBoundsChange,
    handleMapClick,
    handleSelectListing,
    handleSliderActiveListing,
    isSearchOpen,
    locationState,
    mapBounds,
    mapCenter,
    mapCenterSignal,
    mapResizeSignal,
    mode,
    nav,
    openSavedSearches,
    openSearch,
    queries,
    quickFilterId,
    saveAndRequest,
    searchInitialView,
    seenListingIds,
    selectedListingId,
    setQuickFilterId,
  };
}
