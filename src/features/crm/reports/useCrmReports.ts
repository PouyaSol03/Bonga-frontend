import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../shared/api/api";
import {
  getStoredAuthSession,
  normalizeAuthRoleSlug,
} from "../../../shared/auth/auth-storage";
import { SUPPORT, SUPER_ADMIN } from "../../../shared/constants/roles.constants";
import { useDebouncedValue } from "../../../shared/hooks/useDebouncedValue";
import {
  listCrmReports,
  type CrmRecord,
  type CrmReportKind,
} from "../api/crm.service";
import {
  PAGE_SIZE,
  tabs,
  type CrmReportsViewProps,
  type ReportQueryState,
} from "./types";

export function useCrmReports({ notify, refreshNonce }: CrmReportsViewProps) {
  const session = getStoredAuthSession();
  const sessionRoles = new Set([
    normalizeAuthRoleSlug(session?.activeRole ?? session?.role),
    normalizeAuthRoleSlug(session?.role),
    ...(session?.roles ?? []).map((role) => normalizeAuthRoleSlug(role.slug ?? role.name)),
  ]);
  const isSupportOnlyReports = sessionRoles.has(SUPPORT) && !sessionRoles.has(SUPER_ADMIN);
  const allowedTabs = useMemo(
    () => (isSupportOnlyReports ? tabs.filter((tab) => tab.id === "user") : tabs),
    [isSupportOnlyReports],
  );
  const [activeKind, setActiveKind] = useState<CrmReportKind>(
    isSupportOnlyReports ? "user" : "advertise",
  );
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const [pages, setPages] = useState<Record<CrmReportKind, number>>({ advertise: 1, user: 1 });
  const [selectedReport, setSelectedReport] = useState<CrmRecord | null>(null);

  useEffect(() => {
    setPages({ advertise: 1, user: 1 });
  }, [debouncedSearch]);

  useEffect(() => {
    if (!allowedTabs.some((tab) => tab.id === activeKind)) {
      setActiveKind(allowedTabs[0]?.id ?? "user");
    }
  }, [activeKind, allowedTabs]);

  const advertiseQuery = useQuery({
    enabled: activeKind === "advertise" && allowedTabs.some((tab) => tab.id === "advertise"),
    queryFn: () =>
      listCrmReports("advertise", {
        page: pages.advertise,
        perPage: PAGE_SIZE,
        search: debouncedSearch,
      }),
    queryKey: ["crm", "reports", "advertise", pages.advertise, debouncedSearch, refreshNonce],
  });
  const userQuery = useQuery({
    enabled: activeKind === "user" && allowedTabs.some((tab) => tab.id === "user"),
    queryFn: () =>
      listCrmReports("user", { page: pages.user, perPage: PAGE_SIZE, search: debouncedSearch }),
    queryKey: ["crm", "reports", "user", pages.user, debouncedSearch, refreshNonce],
  });

  useEffect(() => {
    if (advertiseQuery.error) {
      notify(
        getApiErrorMessage(advertiseQuery.error, "دریافت گزارش‌های آگهی ناموفق بود."),
        "error",
      );
    }
  }, [advertiseQuery.error, notify]);

  useEffect(() => {
    if (userQuery.error) {
      notify(getApiErrorMessage(userQuery.error, "دریافت گزارش‌های کاربران ناموفق بود."), "error");
    }
  }, [notify, userQuery.error]);

  const activeQuery = (activeKind === "advertise" ? advertiseQuery : userQuery) as ReportQueryState;
  const reports = activeQuery.data?.data ?? [];
  const total = activeQuery.data?.total ?? 0;
  const currentPage = activeQuery.data?.page ?? pages[activeKind];
  const perPage = activeQuery.data?.perPage ?? PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const activeTab = allowedTabs.find((tab) => tab.id === activeKind) ?? allowedTabs[0] ?? tabs[1];

  const reportCounts = useMemo<Record<CrmReportKind, number>>(
    () => ({
      advertise: advertiseQuery.data?.total ?? 0,
      user: userQuery.data?.total ?? 0,
    }),
    [advertiseQuery.data?.total, userQuery.data?.total],
  );

  const changePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) return;
    setPages((current) => ({ ...current, [activeKind]: nextPage }));
  };

  return {
    activeKind,
    activeQuery,
    activeTab,
    allowedTabs,
    changePage,
    currentPage,
    debouncedSearch,
    pages,
    reportCounts,
    reports,
    search,
    selectedReport,
    setActiveKind,
    setSearch,
    setSelectedReport,
    tabLoading: {
      advertise: advertiseQuery.isLoading,
      user: userQuery.isLoading,
    },
    total,
    totalPages,
    perPage,
  };
}
