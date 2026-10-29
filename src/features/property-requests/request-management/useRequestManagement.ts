import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "../../../shared/api/api";
import {
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
  USER,
} from "../../../shared/constants/roles.constants";
import {
  getActiveAuthRole,
  getStoredAuthSession,
} from "../../../shared/auth/auth-storage";
import { usePropertyRequestsQuery } from "../api/property-request.hooks";
import type { PropertyRequestResultsStatus } from "../PropertyRequestResults";
import {
  getTabs,
  isReceivedRequestNew,
} from "./requestHelpers";
import {
  receivedRequestsGuideStorageKey,
  type RequestToast,
} from "./types";
import { useRequestMutations } from "./useRequestMutations";
import { useRequestNavigationAndFilter } from "./useRequestNavigationAndFilter";

export function useRequestManagement(showReceivedTab = false) {
  const session = getStoredAuthSession();
  const activeRole = getActiveAuthRole(session);
  const canManageRequests = Boolean(session?.managerPermissions?.manage_requests);
  const effectiveShowReceivedTab =
    showReceivedTab ||
    activeRole === REAL_ESTATE_MANAGER ||
    (activeRole === REAL_ESTATE_CONSULTANT && canManageRequests);
  const isPersonal = !activeRole || activeRole === USER;

  const [toast, setToast] = useState<RequestToast | null>(null);
  const [isReceivedGuideVisible, setIsReceivedGuideVisible] = useState(() => {
    try {
      return window.sessionStorage.getItem(receivedRequestsGuideStorageKey) !== "1";
    } catch {
      return true;
    }
  });
  const [resultStatuses, setResultStatuses] = useState<
    Record<string, PropertyRequestResultsStatus>
  >({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const requestsQuery = usePropertyRequestsQuery(1, 20);
  const requests = useMemo(() => requestsQuery.data?.data ?? [], [requestsQuery.data?.data]);
  const tabs = useMemo(() => getTabs(effectiveShowReceivedTab), [effectiveShowReceivedTab]);

  const showToast = useCallback(
    (message: string, title = "موفق", variant: RequestToast["variant"] = "success") => {
      setToast({ message, title, variant });
    },
    [],
  );

  const nav = useRequestNavigationAndFilter({
    effectiveShowReceivedTab,
    requests,
  });

  const mutations = useRequestMutations({
    requests,
    showToast,
  });

  const filteredRequests = useMemo(
    () =>
      nav.activeFilterId === "all"
        ? requests
        : requests.filter((request) => request.id === nav.activeFilterId),
    [nav.activeFilterId, requests],
  );

  const resultsAreSettled =
    filteredRequests.length > 0 &&
    filteredRequests.every((request) => {
      const status = resultStatuses[request.id];
      return Boolean(status && !status.isLoading);
    });
  const hasVisibleResults = filteredRequests.some(
    (request) => (resultStatuses[request.id]?.visibleCount ?? 0) > 0,
  );
  const hasResultErrors = filteredRequests.some((request) => resultStatuses[request.id]?.isError);
  const showResultsEmpty =
    filteredRequests.length === 0 || (resultsAreSettled && !hasVisibleResults && !hasResultErrors);

  const handleResultStatusChange = useCallback((status: PropertyRequestResultsStatus) => {
    setResultStatuses((current) => {
      const previous = current[status.requestId];
      if (
        previous &&
        previous.isError === status.isError &&
        previous.isLoading === status.isLoading &&
        previous.visibleCount === status.visibleCount
      ) {
        return current;
      }
      return { ...current, [status.requestId]: status };
    });
  }, []);

  const receivedRequests = useMemo(
    () => requests.filter((request) => !mutations.dismissedReceivedRequestIds.has(String(request.id))),
    [mutations.dismissedReceivedRequestIds, requests],
  );
  const hasNewReceivedRequests = receivedRequests.some(isReceivedRequestNew);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    setResultStatuses({});
  }, [filteredRequests]);

  const refreshRequests = () => {
    setIsRefreshing(true);
    mutations.setDismissedReceivedRequestIds(new Set<string>());

    void requestsQuery
      .refetch()
      .then((result) => {
        setTimeout(() => setIsRefreshing(false), 600);
        if (result.isError) {
          showToast(
            getApiErrorMessage(result.error, "بروزرسانی درخواست‌ها با خطا مواجه شد."),
            "خطا",
            "error",
          );
          return;
        }
        showToast("درخواست‌ها بروزرسانی شدند.");
      })
      .catch(() => {
        setTimeout(() => setIsRefreshing(false), 600);
      });
  };

  const dismissReceivedGuide = () => {
    setIsReceivedGuideVisible(false);
    try {
      window.sessionStorage.setItem(receivedRequestsGuideStorageKey, "1");
    } catch {}
  };

  const requestLoadState = requestsQuery.isLoading
    ? { description: "در حال دریافت درخواست‌های شما هستیم.", title: "در حال بارگذاری درخواست‌ها" }
    : requestsQuery.isError
      ? {
          description: getApiErrorMessage(
            requestsQuery.error,
            "دریافت درخواست‌ها با خطا مواجه شد. از دکمه بروزرسانی استفاده کنید.",
          ),
          title: "دریافت درخواست‌ها ناموفق بود",
        }
      : null;

  return {
    activeFilterId: nav.activeFilterId,
    activeFilterTitle: nav.activeFilterTitle,
    activeRole,
    activeTab: nav.activeTab,
    cancelRequest: mutations.cancelRequest,
    changeTab: nav.changeTab,
    closeEditSheet: mutations.closeEditSheet,
    confirmEdit: mutations.confirmEdit,
    deleteReceivedRequest: mutations.deleteReceivedRequest,
    dismissReceivedGuide,
    editTitle: mutations.editTitle,
    editingRequest: mutations.editingRequest,
    filteredRequests,
    handleResultStatusChange,
    hasNewReceivedRequests,
    isFilterSheetOpen: nav.isFilterSheetOpen,
    isPersonal,
    isReceivedGuideVisible,
    isRefreshing: isRefreshing || requestsQuery.isFetching,
    openEditSheet: mutations.openEditSheet,
    refreshRequests,
    receivedRequests,
    requestLoadState,
    requests,
    requestsQuery,
    selectFilter: nav.selectFilter,
    setEditTitle: mutations.setEditTitle,
    setIsFilterSheetOpen: nav.setIsFilterSheetOpen,
    showResultsEmpty,
    tabs,
    toast,
  };
}
