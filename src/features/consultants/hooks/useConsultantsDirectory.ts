import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  useAgencyInfiniteQuery,
  usePublicAgentsInfiniteQuery,
} from "../../agencies/api/agency.hooks";
import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import { toPersianNumber } from "../../../shared/lib/numberUtils";
import type { PublicAgencyDto, PublicAgentListDto } from "../../agencies/api/agency.service";
import type { NeighborhoodDto } from "../../locations/api/neighborhood.service";
import { readConsultantsSelectedNeighborhood } from "../consultantsNeighborhoodSelection";
import {
  DIRECTORY_PAGE_SIZE,
  LOAD_MORE_REMAINING_ITEM_COUNT,
  SEARCH_DEBOUNCE_MS,
  SORT_OPTIONS,
} from "../constants";
import type { DirectoryItem, DirectoryMode, SortOptionId } from "../types";

function mapAgencyToDirectoryItem(agency: PublicAgencyDto): DirectoryItem {
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

function mapAgentToDirectoryItem(agent: PublicAgentListDto): DirectoryItem {
  return {
    badge: agent.agency?.name ? `مشاور ${agent.agency.name}` : "مشاور",
    id: agent.id,
    image: agent.avatar,
    name: agent.fullName,
    rank: toPersianNumber(agent.rank ?? 0),
    score: toPersianNumber(agent.score ?? 0),
  };
}

function getInitialMode(): DirectoryMode {
  const mode = new URLSearchParams(window.location.search).get("type");
  return mode === "consultant" ? "consultant" : "agency";
}

export function useConsultantsDirectory() {
  const navigate = useNavigate();
  const selectedCity = readStoredSelectedCity();
  const [mode, setMode] = useState<DirectoryMode>(getInitialMode);
  const [isModeSheetOpen, setIsModeSheetOpen] = useState(false);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedMapAgencyId, setSelectedMapAgencyId] = useState<string | null>(null);

  const directoryHistoryState =
    window.history.state && typeof window.history.state === "object"
      ? (
          window.history.state as {
            consultantsDirectoryState?: {
              search?: string;
              selectedSort?: SortOptionId | null;
            };
          }
        ).consultantsDirectoryState
      : undefined;

  const [search, setSearch] = useState(directoryHistoryState?.search ?? "");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodDto | null>(() =>
    readConsultantsSelectedNeighborhood(selectedCity?.id),
  );
  const [selectedSort, setSelectedSort] = useState<SortOptionId | null>(
    directoryHistoryState?.selectedSort ?? null,
  );

  const [debouncedSearch, setDebouncedSearch] = useState(search.trim());
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const selectedNeighborhoodId = selectedNeighborhood
    ? String(selectedNeighborhood.id ?? selectedNeighborhood._id ?? selectedNeighborhood.name)
    : undefined;

  const agenciesQuery = useAgencyInfiniteQuery({
    enabled: mode === "agency",
    neighborhoodId: selectedNeighborhoodId,
    perPage: DIRECTORY_PAGE_SIZE,
    search: debouncedSearch,
    sort: selectedSort ?? undefined,
  });

  const agentsQuery = usePublicAgentsInfiniteQuery({
    enabled: mode === "consultant",
    perPage: DIRECTORY_PAGE_SIZE,
    search: debouncedSearch,
    sort: selectedSort ?? undefined,
  });

  const agencyDirectoryItems = useMemo(
    () =>
      agenciesQuery.data?.pages.flatMap((page) => page.data.map(mapAgencyToDirectoryItem)) ?? [],
    [agenciesQuery.data],
  );

  const consultantDirectoryItems = useMemo(
    () => agentsQuery.data?.pages.flatMap((page) => page.data.map(mapAgentToDirectoryItem)) ?? [],
    [agentsQuery.data],
  );

  const items = mode === "agency" ? agencyDirectoryItems : consultantDirectoryItems;
  const activeQuery = mode === "agency" ? agenciesQuery : agentsQuery;

  const loadMoreTriggerIndex = Math.max(items.length - LOAD_MORE_REMAINING_ITEM_COUNT - 1, 0);

  const loadMoreObserverRef = useRef<IntersectionObserver | null>(null);
  const loadMoreSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      loadMoreObserverRef.current?.disconnect();
      if (!node || !activeQuery.hasNextPage || activeQuery.isFetchingNextPage) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (
            entries[0]?.isIntersecting &&
            activeQuery.hasNextPage &&
            !activeQuery.isFetchingNextPage
          ) {
            void activeQuery.fetchNextPage();
          }
        },
        { threshold: 0.1 },
      );
      observer.observe(node);
      loadMoreObserverRef.current = observer;
    },
    [activeQuery.fetchNextPage, activeQuery.hasNextPage, activeQuery.isFetchingNextPage],
  );

  const handleModeChange = useCallback((nextMode: DirectoryMode) => {
    setMode(nextMode);
    setIsModeSheetOpen(false);
    const nextPath = nextMode === "consultant" ? "/consultants?type=consultant" : "/consultants";
    window.history.replaceState(window.history.state ?? {}, "", nextPath);
  }, []);

  const navigateToAgency = useCallback(
    (item: DirectoryItem) => {
      if (!item.id) return;
      const params = new URLSearchParams();
      if (item.name) params.set("name", item.name);
      if (item.address) params.set("location", item.address);
      if (item.image) params.set("logo", item.image);
      if (selectedCity?.id) params.set("city_id", selectedCity.id);
      if (selectedCity?.name) params.set("city_name", selectedCity.name);
      if (item.neighborhoodIds?.length)
        params.set("neighborhood_ids", item.neighborhoodIds.join(","));
      if (item.rank) params.set("rank", item.rank);
      if (item.score) params.set("score", item.score);
      navigate(
        `/agencies/${encodeURIComponent(item.id)}${params.toString() ? `?${params.toString()}` : ""}`,
      );
    },
    [navigate, selectedCity],
  );

  const navigateToAgent = useCallback(
    (item: DirectoryItem) => {
      if (!item.id) return;
      const params = new URLSearchParams();
      if (item.name) params.set("name", item.name);
      if (item.image) params.set("logo", item.image);
      navigate(
        `/agents/${encodeURIComponent(item.id)}${params.toString() ? `?${params.toString()}` : ""}`,
      );
    },
    [navigate],
  );

  return {
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
    selectedSortOption: SORT_OPTIONS.find((opt) => opt.id === selectedSort),
    setIsMapOpen,
    setIsModeSheetOpen,
    setIsSortSheetOpen,
    setSearch,
    setSelectedMapAgencyId,
    setSelectedNeighborhood,
    setSelectedSort,
  };
}
