import { useEffect, useMemo, useState } from "react";
import type { PropertySearchRequest } from "../api/property-request.service";
import { getInitialRequestTab } from "./requestHelpers";
import type { RequestFilterId, RequestManagementTab } from "./types";

export function useRequestNavigationAndFilter({
  effectiveShowReceivedTab,
  requests,
}: {
  effectiveShowReceivedTab: boolean;
  requests: PropertySearchRequest[];
}) {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<RequestManagementTab>(() =>
    getInitialRequestTab(effectiveShowReceivedTab),
  );
  const [filters, setFilters] = useState<Record<RequestManagementTab, RequestFilterId>>({
    received: "all",
    requests: "all",
    results: "all",
  });

  const activeFilterId = filters[activeTab];
  const activeFilterTitle = useMemo(() => {
    if (activeFilterId === "all") return "همه درخواست‌ها";
    return requests.find((request) => request.id === activeFilterId)?.title || "همه درخواست‌ها";
  }, [activeFilterId, requests]);

  useEffect(() => {
    if (activeFilterId === "all" || requests.some((request) => request.id === activeFilterId)) {
      return;
    }
    setFilters((current) => ({ ...current, [activeTab]: "all" }));
  }, [activeFilterId, activeTab, requests]);

  const selectFilter = (filterId: RequestFilterId) => {
    setFilters((current) => ({ ...current, [activeTab]: filterId }));
  };

  const changeTab = (tab: RequestManagementTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    const query = params.toString();
    window.history.replaceState(
      window.history.state ?? {},
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}`,
    );
  };

  return {
    activeFilterId,
    activeFilterTitle,
    activeTab,
    changeTab,
    isFilterSheetOpen,
    selectFilter,
    setIsFilterSheetOpen,
  };
}
