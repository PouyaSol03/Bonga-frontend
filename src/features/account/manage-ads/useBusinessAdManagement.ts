import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { getApiErrorMessage, isForbiddenApiError } from "../../../shared/api/api";
import { useActiveAuthRole } from "../../../shared/auth/use-active-auth-role";
import { INDEPENDENT_CONSULTANT } from "../../../shared/constants/roles.constants";
import { useDebouncedValue } from "../../../shared/hooks/useDebouncedValue";
import { useToast } from "../../../shared/hooks/useToast";
import { useDeleteAdvertisementMutation } from "../../advertisements/api/advertisement.hooks";
import { useAgencyAdvertiseAssignmentsInfiniteQuery } from "../../advertisements/api/agency-advertise-assignment.hooks";
import {
  getAdvertisementPublisherName,
  mapAdvertisementToAdCard,
} from "../../advertisements/api/advertisement.service";
import {
  getAdManagementRouteState,
  type AdManagementFilters,
  type AdsTab,
} from "../adManagement/adManagementData";
import { useMyAdsInfiniteQuery } from "../api/account.hooks";
import { getMyAdStatusInfo } from "../myAdsStatus";
import {
  emptyBusinessFilters,
  getScopedFilters,
  hasActiveFilters,
  isAssignedTab,
  mapAssignmentToAd,
  matchesAdFilters,
} from "./businessAdFilters";

const assignmentPageSize = 20;
const loadMoreRemainingCount = 10;

export function useBusinessAdManagement() {
  const navigate = useNavigate();
  const routeState = getAdManagementRouteState();
  const activeRole = useActiveAuthRole();
  const canAccessAssignments = activeRole !== INDEPENDENT_CONSULTANT;
  const [activeTab, setActiveTab] = useState<AdsTab>(() =>
    canAccessAssignments ? (routeState.tab ?? "active") : "active",
  );
  const [showMineOnly, setShowMineOnly] = useState(routeState.onlyMine ?? false);
  const [filters] = useState<AdManagementFilters>(routeState.filters ?? emptyBusinessFilters);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery.trim(), 300);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const assignedTab = isAssignedTab(activeTab);
  const scopedFilters = getScopedFilters(filters, activeTab);
  const activeFiltersPresent = hasActiveFilters(scopedFilters, activeTab);

  const assignmentsQuery = useAgencyAdvertiseAssignmentsInfiniteQuery({
    enabled: canAccessAssignments && assignedTab,
    perPage: assignmentPageSize,
    status: "pending",
  });
  const adsQuery = useMyAdsInfiniteQuery({
    isMine: showMineOnly ? true : undefined,
    perPage: assignmentPageSize,
    search: isSearching && debouncedSearchQuery ? debouncedSearchQuery : undefined,
  });

  const [deletingAdId, setDeletingAdId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();
  const deleteMutation = useDeleteAdvertisementMutation();

  const handleOpenDelete = (targetAdId: string, event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    setDeletingAdId(targetAdId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAdId) return;
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync({
        advertiseId: deletingAdId,
        deleteReasonId: "other",
        description: "حذف آگهی نیمه کاره",
      });
      showToast("آگهی با موفقیت حذف شد.", undefined, "success");
      setDeletingAdId(null);
    } catch (err) {
      showToast(getApiErrorMessage(err, "حذف آگهی با خطا مواجه شد."), "خطا", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const assignmentItems = useMemo(
    () => assignmentsQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [assignmentsQuery.data],
  );
  const assignedAdvertisements = useMemo(
    () =>
      assignmentItems
        .map((assignment, index) => ({
          ad: mapAssignmentToAd(assignment, index),
          assignment,
        }))
        .filter(({ ad }) => matchesAdFilters(ad, scopedFilters, true))
        .filter(({ ad }) => {
          if (!isSearching || !debouncedSearchQuery) return true;
          const q = debouncedSearchQuery.toLowerCase();
          return Boolean(ad.title && ad.title.toLowerCase().includes(q));
        }),
    [assignmentItems, scopedFilters, isSearching, debouncedSearchQuery],
  );

  const activeAdvertisements = useMemo(
    () =>
      (adsQuery.data?.pages ?? [])
        .flatMap((page) => page.data)
        .map((sourceAd, index) => {
          const statusInfo = getMyAdStatusInfo(sourceAd);
          const card = {
            ...mapAdvertisementToAdCard(sourceAd, index),
            publisher: getAdvertisementPublisherName(sourceAd),
            status: sourceAd.status_label || statusInfo.label,
          };
          return { card, sourceAd, statusInfo };
        })
        .filter(({ card, sourceAd, statusInfo }) => {
          if (showMineOnly && sourceAd.is_mine === false) return false;
          return matchesAdFilters(card, scopedFilters, false, statusInfo.key, sourceAd);
        }),
    [adsQuery.data, scopedFilters, showMineOnly],
  );

  const visibleCount = assignedTab ? assignedAdvertisements.length : activeAdvertisements.length;
  const preloadIndex = Math.max(visibleCount - loadMoreRemainingCount - 1, 0);

  const loadMoreRef = (node: HTMLElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    const targetQuery = assignedTab ? assignmentsQuery : adsQuery;
    if (!node || !targetQuery.hasNextPage || targetQuery.isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        void targetQuery.fetchNextPage();
      },
      { rootMargin: "160px 0px" },
    );
    observer.observe(node);
    observerRef.current = observer;
  };

  useEffect(() => () => observerRef.current?.disconnect(), []);

  useEffect(() => {
    if (adsQuery.isError && isForbiddenApiError(adsQuery.error)) {
      navigate("/403", { replace: true });
    }
  }, [adsQuery.isError, adsQuery.error, navigate]);

  useEffect(() => {
    if (assignedTab && assignmentsQuery.isError && isForbiddenApiError(assignmentsQuery.error)) {
      navigate("/403", { replace: true });
    }
  }, [assignedTab, assignmentsQuery.isError, assignmentsQuery.error, navigate]);

  return {
    activeAdvertisements,
    activeFiltersPresent,
    activeRole,
    activeTab,
    assignedAdvertisements,
    assignedTab,
    assignmentsQuery,
    canAccessAssignments,
    deletingAdId,
    filters,
    handleConfirmDelete,
    handleOpenDelete,
    isDeleting,
    isSearching,
    loadMoreRef,
    preloadIndex,
    scopedFilters,
    searchQuery,
    setActiveTab,
    setDeletingAdId,
    setIsSearching,
    setSearchQuery,
    setShowMineOnly,
    showMineOnly,
    adsQuery,
  };
}
