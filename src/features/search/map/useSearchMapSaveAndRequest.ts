import { useCallback, useMemo, useState } from "react";
import { getApiErrorMessage, isUnauthorizedApiError } from "../../../shared/api/api";
import { usePublisherOptions } from "../../advertisements/api/publisher-options.hooks";
import { useCreatePropertyRequestMutation } from "../../property-requests/api/property-request.hooks";
import { getPropertyRequestScope } from "../../property-requests/api/property-request.service";
import { useSavedSearchesQuery, useSaveSearchMutation } from "../api/saved-search.hooks";
import type { SearchFilterChip } from "../searchMapData";
import { buildSaveSearchInput } from "./queryParams";
import { getActiveFilterCount, getSearchParams } from "./searchParamsHelpers";
import type { PendingSearchRequest } from "./types";

interface UseSearchMapSaveAndRequestOptions {
  chips: SearchFilterChip[];
  currentSearch: string;
  currentSearchQuery: string;
  isAuthenticated: boolean;
  navigateToLoginRequired: (action: string) => void;
  openSavedSearches: () => void;
  showNotice: (
    msg: string | null | undefined,
    variant?: "error" | "success" | "info" | "warning",
  ) => void;
}

export function useSearchMapSaveAndRequest({
  chips,
  currentSearch,
  currentSearchQuery,
  isAuthenticated,
  navigateToLoginRequired,
  openSavedSearches,
  showNotice,
}: UseSearchMapSaveAndRequestOptions) {
  const [pendingSearchRequest, setPendingSearchRequest] = useState<PendingSearchRequest | null>(
    null,
  );
  const [isRequestSuccessOpen, setIsRequestSuccessOpen] = useState(false);
  const [savedSearchUrl, setSavedSearchUrl] = useState<string | null>(null);

  const requestSenderOptions = usePublisherOptions(pendingSearchRequest !== null);
  const createPropertyRequestMutation = useCreatePropertyRequestMutation();
  const requestResultsPath =
    getPropertyRequestScope().ownerType === "agency"
      ? "/account/dashboard/requests?tab=results"
      : "/account/requests?tab=results";
  const savedSearchesQuery = useSavedSearchesQuery(isAuthenticated);
  const saveSearchMutation = useSaveSearchMutation();

  const saveSearchInput = useMemo(
    () => buildSaveSearchInput(currentSearch, chips),
    [chips, currentSearch],
  );

  const isCurrentSearchSaved = Boolean(
    saveSearchInput &&
      (savedSearchUrl === saveSearchInput.url ||
        savedSearchesQuery.data?.some((item) => item.url === saveSearchInput.url)),
  );

  const handleEmptyRequestSubmit = useCallback(
    (title: string) => {
      if (!isAuthenticated) {
        navigateToLoginRequired("ثبت درخواست");
        return;
      }

      const params = getSearchParams();
      if (getActiveFilterCount(params) === 0) {
        showNotice("برای ثبت درخواست، ابتدا باید فیلترهای مورد نظر خود را انتخاب کنید.");
        return;
      }

      const requestFilters: Record<string, string> = {};
      params.forEach((value, key) => {
        requestFilters[key] = value;
      });

      const request = {
        createdAt: new Date().toISOString(),
        filters: requestFilters,
        id: `search-request-${Date.now()}`,
        title: title || currentSearchQuery || "درخواست ملک مشابه",
      };

      setPendingSearchRequest(request);
    },
    [currentSearchQuery, isAuthenticated, navigateToLoginRequired, showNotice],
  );

  const handleConfirmSearchRequest = useCallback(
    (senderId: string) => {
      if (!pendingSearchRequest || createPropertyRequestMutation.isPending) return;

      const owner_type =
        senderId === "personal"
          ? "user"
          : senderId === "independent-consultant"
            ? "agent"
            : "agency";

      createPropertyRequestMutation.mutate(
        {
          filters: pendingSearchRequest.filters,
          name: pendingSearchRequest.title,
          owner_type,
        },
        {
          onError: (error) => {
            showNotice(getApiErrorMessage(error, "ثبت درخواست با خطا مواجه شد."));
          },
          onSuccess: () => {
            setPendingSearchRequest(null);
            window.requestAnimationFrame(() => {
              setIsRequestSuccessOpen(true);
            });
          },
        },
      );
    },
    [createPropertyRequestMutation, pendingSearchRequest, showNotice],
  );

  const handleSaveSearch = useCallback(() => {
    if (!isAuthenticated) {
      navigateToLoginRequired("ذخیره جستجو");
      return;
    }

    if (isCurrentSearchSaved) {
      openSavedSearches();
      return;
    }

    if (!saveSearchInput || saveSearchMutation.isPending) return;

    saveSearchMutation.mutate(saveSearchInput, {
      onError: (error) => {
        if (isUnauthorizedApiError(error)) {
          navigateToLoginRequired("ذخیره جستجو");
          return;
        }

        showNotice(getApiErrorMessage(error, "ذخیره جستجو انجام نشد. دوباره تلاش کنید."));
      },
      onSuccess: () => {
        setSavedSearchUrl(saveSearchInput.url);
        showNotice("جستجوی شما ذخیره شد.");
      },
    });
  }, [
    isAuthenticated,
    isCurrentSearchSaved,
    navigateToLoginRequired,
    openSavedSearches,
    saveSearchInput,
    saveSearchMutation,
    showNotice,
  ]);

  return {
    createPropertyRequestMutation,
    handleConfirmSearchRequest,
    handleEmptyRequestSubmit,
    handleSaveSearch,
    isCurrentSearchSaved,
    isRequestSuccessOpen,
    pendingSearchRequest,
    requestResultsPath,
    requestSenderOptions,
    saveSearchInput,
    saveSearchMutation,
    savedSearchesQuery,
    setIsRequestSuccessOpen,
    setPendingSearchRequest,
  };
}
