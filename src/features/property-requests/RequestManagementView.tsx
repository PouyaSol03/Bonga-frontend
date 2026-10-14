import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

import { getApiErrorMessage } from "../../shared/api/api";
import { PageFrame } from "../../shared/layout/PageFrame";
import LinearCancel from "../../shared/icons/LinearCancel";
import LinearCity from "../../shared/icons/LinearCity";
import LinearDelete from "../../shared/icons/LinearDelete";
import LinearEdit2 from "../../shared/icons/LinearEdit2";
import LinearInfoCircle from "../../shared/icons/LinearInfoCircle";
import LinearRefresh from "../../shared/icons/LinearRefresh";
import { BottomSheet } from "../../shared/components/BottomSheet";
import { HorizontalFilterBar } from "../../shared/components/HorizontalFilterBar";
import { TopBar } from "../../shared/components/TopBar";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import { RequestFilterBottomSheet } from "./RequestFilterBottomSheet";
import LinearArrowDown1 from "../../shared/icons/LinearArrowDown1";
import { getActiveAuthRole, getStoredAuthSession } from "../../shared/auth/auth-storage";
import {
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
  USER,
} from "../../shared/constants/roles.constants";
import {
  useDeletePropertyRequestMutation,
  usePropertyRequestsQuery,
  useRenamePropertyRequestMutation,
} from "./api/property-request.hooks";
import {
  getCollapsedPropertyRequestDetails,
  getPropertyRequestDetails,
  toPersianDigits,
  type PropertySearchRequest,
} from "./api/property-request.service";
import {
  PropertyRequestResults,
  type PropertyRequestResultsStatus,
} from "./PropertyRequestResults";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

type RequestManagementTab = "received" | "requests" | "results";
type RequestFilterId = "all" | string;

type RequestManagementViewProps = {
  backTo: string;
  showReceivedTab?: boolean;
  variant?: "account" | "default";
};

type RequestTabItem = {
  id: RequestManagementTab;
  label: string;
};

type RequestToast = {
  message: string;
  title: string;
  variant: "error" | "success" | "info" | "warning";
};

const receivedRequestsGuideStorageKey = "bonga-received-requests-guide-dismissed";

function getRequestCreatedAt(request: PropertySearchRequest) {
  const createdAt = new Date(request.createdAt);

  return Number.isNaN(createdAt.getTime()) ? null : createdAt;
}

function isReceivedRequestNew(request: PropertySearchRequest) {
  if (request.isNew) return true;

  const createdAt = getRequestCreatedAt(request);
  if (!createdAt) return false;

  const age = Date.now() - createdAt.getTime();
  return age >= 0 && age < 24 * 60 * 60 * 1000;
}

function formatReceivedRequestDate(request: PropertySearchRequest) {
  const createdAt = getRequestCreatedAt(request);
  if (!createdAt) return "";

  const age = Math.max(0, Date.now() - createdAt.getTime());
  const hours = Math.floor(age / (60 * 60 * 1000));
  const days = Math.floor(age / (24 * 60 * 60 * 1000));

  if (hours < 1) return "امروز";
  if (hours < 24) return `${toPersianDigits(hours)} ساعت پیش`;
  if (days < 7) return `${toPersianDigits(days)} روز پیش`;
  if (days < 14) return "هفته پیش";

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(createdAt)
    .replace(/[\u200e\u200f]/g, "");
}

function getReceivedRequestDetailPriority(detail: string) {
  if (detail.includes("خوابه") || detail === "بدون اتاق") return 0;
  if (detail.startsWith("سال ساخت")) return 1;
  if (detail.startsWith("قیمت") || detail.startsWith("رهن") || detail.startsWith("اجاره")) {
    return 2;
  }
  if (detail.startsWith("متراژ")) return 3;
  if (detail.startsWith("محله")) return 4;
  return 5;
}

function getReceivedRequestDetails(request: PropertySearchRequest, maxVisibleItems = 6) {
  const details = getPropertyRequestDetails(request)
    .map((detail, index) => ({ detail, index }))
    .sort(
      (left, right) =>
        getReceivedRequestDetailPriority(left.detail) -
          getReceivedRequestDetailPriority(right.detail) || left.index - right.index,
    )
    .map(({ detail }) => detail);
  const safeMaxVisibleItems = Math.max(1, Math.floor(maxVisibleItems));

  if (details.length <= safeMaxVisibleItems) {
    return { hiddenCount: 0, visibleDetails: details };
  }

  const visibleDetailCount = Math.max(0, safeMaxVisibleItems - 1);

  return {
    hiddenCount: details.length - visibleDetailCount,
    visibleDetails: details.slice(0, visibleDetailCount),
  };
}

function getTabs(showReceivedTab: boolean): RequestTabItem[] {
  return showReceivedTab
    ? [
        { id: "results", label: "نتایج" },
        { id: "requests", label: "درخواست‌ها" },
        { id: "received", label: "دریافتی‌ها" },
      ]
    : [
        { id: "results", label: "نتایج" },
        { id: "requests", label: "درخواست‌ها" },
      ];
}

function getInitialRequestTab(showReceivedTab: boolean): RequestManagementTab {
  const requestedTab = new URLSearchParams(window.location.search).get("tab");

  if (requestedTab === "results" || requestedTab === "requests") {
    return requestedTab;
  }
  if (requestedTab === "received" && showReceivedTab) return "received";

  return showReceivedTab ? "results" : "requests";
}

export function RequestManagementView({
  backTo,
  showReceivedTab = false,
  variant = "default",
}: RequestManagementViewProps) {
  const session = getStoredAuthSession();
  const activeRole = getActiveAuthRole(session);
  const canManageRequests = Boolean(session?.managerPermissions?.manage_requests);
  const effectiveShowReceivedTab =
    showReceivedTab ||
    activeRole === REAL_ESTATE_MANAGER ||
    (activeRole === REAL_ESTATE_CONSULTANT && canManageRequests);
  const isPersonal = !activeRole || activeRole === USER;
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<RequestManagementTab>(() =>
    getInitialRequestTab(effectiveShowReceivedTab),
  );
  const [filters, setFilters] = useState<Record<RequestManagementTab, RequestFilterId>>({
    received: "all",
    requests: "all",
    results: "all",
  });
  const requestsQuery = usePropertyRequestsQuery(1, 20);
  const renameRequestMutation = useRenamePropertyRequestMutation();
  const deleteRequestMutation = useDeletePropertyRequestMutation();
  const requests = useMemo(() => requestsQuery.data?.data ?? [], [requestsQuery.data?.data]);
  const requestLoadState = requestsQuery.isLoading
    ? {
        description: "در حال دریافت درخواست‌های شما هستیم.",
        title: "در حال بارگذاری درخواست‌ها",
      }
    : requestsQuery.isError
      ? {
          description: getApiErrorMessage(
            requestsQuery.error,
            "دریافت درخواست‌ها با خطا مواجه شد. از دکمه بروزرسانی استفاده کنید.",
          ),
          title: "دریافت درخواست‌ها ناموفق بود",
        }
      : null;
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [toast, setToast] = useState<RequestToast | null>(null);
  const [dismissedReceivedRequestIds, setDismissedReceivedRequestIds] = useState<Set<string>>(
    () => new Set(),
  );
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
  const tabs = useMemo(() => getTabs(effectiveShowReceivedTab), [effectiveShowReceivedTab]);
  const activeFilterId = filters[activeTab];
  const activeFilterTitle = useMemo(() => {
    if (activeFilterId === "all") return "همه درخواست‌ها";
    return requests.find((request) => request.id === activeFilterId)?.title || "همه درخواست‌ها";
  }, [activeFilterId, requests]);
  const editingRequest = requests.find((request) => request.id === editingRequestId) ?? null;
  const filteredRequests = useMemo(
    () =>
      activeFilterId === "all"
        ? requests
        : requests.filter((request) => request.id === activeFilterId),
    [activeFilterId, requests],
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
    () => requests.filter((request) => !dismissedReceivedRequestIds.has(String(request.id))),
    [dismissedReceivedRequestIds, requests],
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

  useEffect(() => {
    if (activeFilterId === "all" || requests.some((request) => request.id === activeFilterId)) {
      return;
    }

    setFilters((current) => ({ ...current, [activeTab]: "all" }));
  }, [activeFilterId, activeTab, requests]);

  const selectFilter = (filterId: RequestFilterId) => {
    setFilters((current) => ({ ...current, [activeTab]: filterId }));
  };

  const showToast = (
    message: string,
    title = "موفق",
    variant: "error" | "success" | "info" | "warning" = "success",
  ) => {
    setToast({ message, title, variant });
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshRequests = () => {
    setIsRefreshing(true);
    setDismissedReceivedRequestIds(new Set<string>());

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

  const openEditSheet = (request: PropertySearchRequest) => {
    setEditingRequestId(request.id);
    setEditTitle(request.title);
  };

  const closeEditSheet = () => {
    setEditingRequestId(null);
    setEditTitle("");
  };

  const confirmEdit = () => {
    const nextTitle = editTitle.trim();

    if (!editingRequest || !nextTitle) {
      showToast("عنوان درخواست را وارد کنید.", "خطا", "error");
      return;
    }

    if (renameRequestMutation.isPending) return;

    renameRequestMutation.mutate(
      { id: editingRequest.id, name: nextTitle },
      {
        onError: (error) => {
          showToast(getApiErrorMessage(error, "ویرایش درخواست با خطا مواجه شد."), "خطا", "error");
        },
        onSuccess: () => {
          closeEditSheet();
          showToast("درخواست با موفقیت ویرایش شد.");
        },
      },
    );
  };

  const cancelRequest = (requestId: string) => {
    if (deleteRequestMutation.isPending) return;

    deleteRequestMutation.mutate(requestId, {
      onError: (error) => {
        showToast(getApiErrorMessage(error, "لغو درخواست با خطا مواجه شد."), "خطا", "error");
      },
      onSuccess: () => {
        showToast("درخواست لغو شد.");
      },
    });
  };

  const deleteReceivedRequest = (requestId: string) => {
    if (deleteRequestMutation.isPending) return;

    setDismissedReceivedRequestIds((current) => {
      const next = new Set(current);
      next.add(requestId);
      return next;
    });

    deleteRequestMutation.mutate(requestId, {
      onError: (error) => {
        setDismissedReceivedRequestIds((current) => {
          const next = new Set(current);
          next.delete(requestId);
          return next;
        });
        showToast(
          getApiErrorMessage(error, "حذف درخواست دریافتی با خطا مواجه شد."),
          "خطا",
          "error",
        );
      },
      onSuccess: () => {
        showToast("درخواست دریافتی حذف شد.");
      },
    });
  };

  const dismissReceivedGuide = () => {
    setIsReceivedGuideVisible(false);

    try {
      window.sessionStorage.setItem(receivedRequestsGuideStorageKey, "1");
    } catch {
      // The guide can still close when browser storage is unavailable.
    }
  };

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        actions={[
          {
            icon: (
              <LinearRefresh
                className={`h-6 w-6 transition-transform ${
                  isRefreshing || requestsQuery.isFetching ? "animate-spin" : ""
                }`}
              />
            ),
            id: "refresh-requests",
            label: "بروزرسانی درخواست‌ها",
            onClick: refreshRequests,
          },
        ]}
        backTo={backTo}
        className={
          variant === "account"
            ? "border-outline-var bg-surface-container border-b"
            : "bg-surface-container"
        }
        contentClassName="px-2"
        heightClassName={variant === "account" ? "h-14" : "h-12"}
        centerSlot={
          <Typography
            as="h1"
            variant="title"
            size="medium"
            weight="semibold"
            className="text-on-surface m-0 truncate text-right"
          >
            درخواست‌ها
          </Typography>
        }
      />

      <main className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
        <div
          className={variant === "account" ? "bg-surface-container" : "bg-surface-container-lowest"}
        >
          <RequestTabs
            activeTab={activeTab}
            hasReceivedIndicator={hasNewReceivedRequests}
            onChange={changeTab}
            tabs={tabs}
            variant={variant}
          />

          {activeTab === "results" && requests.length > 0 ? (
            isPersonal ? (
              <HorizontalFilterBar
                ariaLabel="فیلتر نتایج بر اساس درخواست"
                className="border-outline-var bg-surface-container-lowest border-t py-2"
              >
                <Button
                  unstyled
                  className={`focus-visible:outline-primary/40 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[10px] border px-3 py-1.5 text-sm leading-5 font-medium transition focus-visible:outline-[3px] focus-visible:outline-offset-2 ${
                    activeFilterId === "all"
                      ? "border-primary bg-primary/16 text-primary"
                      : "border-outline-var bg-surface-container-lowest text-on-surface"
                  }`}
                  onClick={() => selectFilter("all")}
                  type="button"
                >
                  <Typography as="span" variant="label" size="medium" weight="medium">
                    همه
                  </Typography>
                </Button>
                {requests.map((request) => {
                  const isSelected = activeFilterId === request.id;
                  return (
                    <Button
                      unstyled
                      key={request.id}
                      className={`focus-visible:outline-primary/40 inline-flex max-w-[200px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border px-3 py-1.5 text-sm leading-5 font-medium transition focus-visible:outline-[3px] focus-visible:outline-offset-2 ${
                        isSelected
                          ? "border-primary bg-primary/16 text-primary"
                          : "border-outline-var bg-surface-container-lowest text-on-surface"
                      }`}
                      onClick={() => selectFilter(request.id)}
                      type="button"
                    >
                      <Typography
                        as="span"
                        variant="label"
                        size="medium"
                        weight="medium"
                        className="truncate"
                      >
                        {request.title}
                      </Typography>
                    </Button>
                  );
                })}
              </HorizontalFilterBar>
            ) : (
              <div className="bg-surface-container-lowest px-4 py-2 shadow-[0_4px_16px_rgba(26,26,26,0.08)]">
                <Button
                  unstyled
                  aria-label="انتخاب درخواست"
                  aria-haspopup="dialog"
                  aria-expanded={isFilterSheetOpen}
                  onClick={() => setIsFilterSheetOpen(true)}
                  className="border-outline-var text-on-surface focus-visible:outline-primary flex h-10 w-full items-center justify-between gap-3 rounded-xl border px-3 [direction:rtl] focus-visible:outline-2"
                  type="button"
                >
                  <Typography
                    as="span"
                    variant="body"
                    size="medium"
                    weight="regular"
                    className="min-w-0 truncate"
                  >
                    {activeFilterId === "all" ? "همه" : activeFilterTitle}
                  </Typography>
                  <LinearArrowDown1
                    aria-hidden="true"
                    className="text-on-surface-var h-6 w-6 shrink-0 opacity-40"
                  />
                </Button>
              </div>
            )
          ) : null}
        </div>

        {activeTab === "requests" ? (
          requestsQuery.isLoading ? (
            <CriteriaRequestsSkeleton />
          ) : requestsQuery.isError ? (
            <EmptyRequestState
              description={
                requestLoadState?.description ??
                "دریافت درخواست‌ها با خطا مواجه شد. از دکمه بروزرسانی استفاده کنید."
              }
              title={requestLoadState?.title ?? "دریافت درخواست‌ها ناموفق بود"}
              variant={variant}
            />
          ) : (
            <div
              className={
                requests.length > 0
                  ? "bg-surface-container space-y-2"
                  : "bg-surface-container-lowest"
              }
            >
              {requests.map((request) => (
                <CriteriaRequestCard
                  key={request.id}
                  onCancel={() => cancelRequest(request.id)}
                  onEdit={() => openEditSheet(request)}
                  request={request}
                />
              ))}
              {requests.length === 0 ? (
                <EmptyRequestState
                  description="پس از ثبت درخواست، اینجا نمایش داده می‌شود."
                  title="هنوز درخواستی ثبت نشده است"
                  variant={variant}
                />
              ) : null}
            </div>
          )
        ) : activeTab === "results" ? (
          requestsQuery.isLoading ? (
            <CriteriaRequestsSkeleton />
          ) : requestsQuery.isError ? (
            <EmptyRequestState
              description={
                requestLoadState?.description ??
                "دریافت درخواست‌ها با خطا مواجه شد. از دکمه بروزرسانی استفاده کنید."
              }
              title={requestLoadState?.title ?? "دریافت درخواست‌ها ناموفق بود"}
              variant={variant}
            />
          ) : (
            <div
              className={
                showResultsEmpty ? "bg-surface-container-lowest" : "bg-surface-container space-y-2"
              }
            >
              {filteredRequests.map((request) => (
                <PropertyRequestResults
                  bare
                  className="bg-surface-container-lowest pb-5"
                  compact
                  hideWhenEmpty
                  key={request.id}
                  maxResults={4}
                  onStatusChange={handleResultStatusChange}
                  request={request}
                  showDismissAction
                  showHeading={false}
                />
              ))}
              {showResultsEmpty ? (
                activeFilterId !== "all" ? (
                  <SearchEmptyState />
                ) : (
                  <EmptyRequestState
                    description="پس از ثبت درخواست، نتیجه بررسی‌ها و پاسخ‌های مرتبط از اینجا نمایش داده می‌شود."
                    title="هنوز نتیجه‌ای ثبت نشده است"
                    variant={variant}
                  />
                )
              ) : null}
            </div>
          )
        ) : (
          <div className="bg-surface-container">
            {isReceivedGuideVisible ? (
              <ReceivedRequestsGuide onClose={dismissReceivedGuide} />
            ) : null}

            {requestsQuery.isLoading ? (
              <ReceivedRequestsSkeleton />
            ) : requestsQuery.isError ? (
              <EmptyRequestState
                description={
                  requestLoadState?.description ?? "دریافت درخواست‌های دریافتی با خطا مواجه شد."
                }
                title={requestLoadState?.title ?? "دریافت درخواست‌ها ناموفق بود"}
                variant={variant}
              />
            ) : receivedRequests.length > 0 ? (
              <div aria-label="درخواست‌های دریافتی">
                {receivedRequests.map((request) => (
                  <ReceivedRequestCard
                    isNew={isReceivedRequestNew(request)}
                    key={`received-${request.id}`}
                    onDelete={() => deleteReceivedRequest(request.id)}
                    request={request}
                  />
                ))}
              </div>
            ) : (
              <EmptyRequestState
                description="درخواست‌های ملکی کاربران که برای آژانس شما ارسال شده‌اند، اینجا نمایش داده می‌شوند."
                title="هنوز درخواست دریافتی وجود ندارد"
                variant={variant}
              />
            )}
          </div>
        )}
      </main>

      <RequestEditBottomSheet
        isOpen={Boolean(editingRequest)}
        onClose={closeEditSheet}
        onConfirm={confirmEdit}
        onValueChange={setEditTitle}
        value={editTitle}
      />

      <RequestFilterBottomSheet
        agencyStyle={activeRole === REAL_ESTATE_MANAGER}
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        onSelect={(filterId) => selectFilter(filterId)}
        requests={requests}
        selectedId={activeFilterId}
      />
    </PageFrame>
  );
}

function RequestTabs({
  activeTab,
  hasReceivedIndicator,
  onChange,
  tabs,
  variant,
}: {
  activeTab: RequestManagementTab;
  hasReceivedIndicator: boolean;
  onChange: (tab: RequestManagementTab) => void;
  tabs: RequestTabItem[];
  variant: "account" | "default";
}) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTab),
  );
  const count = tabs.length || 1;

  return (
    <section className={variant === "account" ? "px-4 py-2" : "bg-surface-container px-4 py-4"}>
      <div
        className={`border-outline bg-surface-container-lowest relative grid overflow-hidden border [direction:rtl] ${
          variant === "account"
            ? "h-10 rounded-xl"
            : "h-10 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
        }`}
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        <motion.div
          aria-hidden="true"
          className="bg-primary-container pointer-events-none absolute inset-y-0 right-0"
          style={{ width: `${100 / count}%` }}
          animate={{ x: `${-activeIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 400, damping: 32, mass: 0.8 }}
        />
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <Button
              unstyled
              aria-current={isActive ? "page" : undefined}
              className={`focus-visible:outline-primary/40 relative inline-flex min-w-0 items-center justify-center px-2 leading-5 transition-colors duration-200 focus-visible:z-10 focus-visible:outline-3 focus-visible:outline-offset-[-3px] ${
                variant === "account" ? "text-sm font-medium" : "text-base font-semibold"
              } ${isActive ? "text-primary font-semibold" : "text-on-surface-var"}`}
              key={tab.id}
              onClick={() => onChange(tab.id)}
              type="button"
            >
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="relative z-10 inline-flex min-w-0 items-center justify-center gap-1"
              >
                {tab.id === "received" && hasReceivedIndicator ? (
                  <Typography
                    as="span"
                    variant="body"
                    size="medium"
                    weight="regular"
                    aria-hidden="true"
                    className="bg-error h-1.5 w-1.5 shrink-0 rounded-full"
                  />
                ) : null}
                <Typography as="span" variant="label" size="large" weight="medium">
                  {tab.label}
                </Typography>
              </Typography>
            </Button>
          );
        })}
      </div>
    </section>
  );
}

function RequestEditBottomSheet({
  isOpen,
  onClose,
  onConfirm,
  onValueChange,
  value,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onValueChange: (value: string) => void;
  value: string;
}) {
  return (
    <BottomSheet
      ariaLabel="ویرایش درخواست"
      contentClassName="px-4 pb-4"
      heightClassName="h-auto pb-[max(0.25rem,env(safe-area-inset-bottom,0px))]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-4"
      showHandle={false}
      showHeader={false}
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onConfirm();
        }}
      >
        <input
          aria-label="نام درخواست"
          autoFocus
          className="border-primary bg-surface-container-lowest text-on-surface placeholder:text-outline focus:ring-primary/20 h-14 w-full rounded-xl border-2 px-3 text-right text-base leading-6 font-normal transition outline-none focus:ring-3"
          onChange={(event) => onValueChange(event.target.value)}
          placeholder="نام درخواست"
          type="text"
          value={value}
        />

        <div className="grid grid-cols-2 gap-4">
          <Button
            unstyled
            className="border-primary bg-surface-container-lowest text-primary focus-visible:outline-primary/40 active:bg-surface-container h-10 rounded-xl border text-sm leading-5 font-semibold transition focus-visible:outline-3 focus-visible:outline-offset-[-3px]"
            onClick={onClose}
            type="button"
          >
            انصراف
          </Button>
          <Button
            unstyled
            className="bg-primary text-on-primary focus-visible:outline-primary/40 h-10 rounded-xl text-sm leading-5 font-semibold transition focus-visible:outline-3 focus-visible:outline-offset-2 active:opacity-80"
            type="submit"
          >
            تایید
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
}

function CriteriaRequestCard({
  onCancel,
  onEdit,
  request,
}: {
  onCancel: () => void;
  onEdit: () => void;
  request: PropertySearchRequest;
}) {
  const { hiddenCount, visibleDetails } = getCollapsedPropertyRequestDetails(request, 6);

  return (
    <article className="bg-surface-container-lowest min-h-[148px] overflow-hidden p-4 text-right">
      <div className="flex min-h-7 items-center justify-between gap-3 [direction:ltr]">
        <Button
          unstyled
          className="text-error focus-visible:outline-error/40 active:bg-error-container/30 inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-lg px-0.5 leading-4 font-medium focus-visible:outline-3 focus-visible:outline-offset-[-3px]"
          onClick={onCancel}
          type="button"
        >
          <Typography as="span" variant="label" size="medium" weight="medium">
            لغو
          </Typography>
          <LinearCancel className="text-on-surface-var h-5 w-5" />
        </Button>

        <Button
          unstyled
          aria-label={`ویرایش ${request.title}`}
          className="focus-visible:outline-primary/40 flex min-w-0 flex-1 items-center justify-end gap-1.5 rounded-lg text-right [direction:ltr] focus-visible:outline-3 focus-visible:outline-offset-4"
          onClick={onEdit}
          type="button"
        >
          <LinearEdit2 className="text-on-surface-var h-4 w-4" />
          <Typography
            as="span"
            variant="title"
            size="medium"
            weight="semibold"
            className="text-on-surface text-right [direction:rtl]"
          >
            {request.title}
          </Typography>
        </Button>
      </div>

      {visibleDetails.length ? (
        <div className="mt-3 flex flex-wrap justify-start gap-2 [direction:rtl]">
          {visibleDetails.map((detail) => (
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="semibold"
              className="border-outline-var bg-surface-container-lowest text-on-surface-var inline-flex max-w-full items-center rounded-lg border text-sm leading-4 font-semibold"
              title={detail}
              key={detail}
            >
              <Typography
                as="span"
                variant="label"
                size="medium"
                weight="semibold"
                className="px-2 py-1.5"
              >
                {detail}
              </Typography>
            </Typography>
          ))}
          {hiddenCount > 0 ? (
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="border-outline-var bg-surface-container text-on-surface-var inline-flex h-[25px] items-center rounded-[7px] border px-2 text-[11px] leading-4 font-medium"
            >
              و {toPersianDigits(hiddenCount)} مورد بیشتر
            </Typography>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function ReceivedRequestsGuide({ onClose }: { onClose: () => void }) {
  return (
    <section className="border-surface-container bg-surface-container-lowest border-b-8 px-4 py-4">
      <div className="bg-primary-container text-primary rounded-2xl px-4 pt-5 pb-4">
        <div className="flex items-center justify-between [direction:ltr]">
          <Button
            unstyled
            aria-label="بستن راهنما"
            className="text-on-surface-var focus-visible:outline-primary/40 active:bg-surface-container-lowest/60 grid h-8 w-8 place-items-center rounded-full transition focus-visible:outline-3 focus-visible:outline-offset-[-3px]"
            onClick={onClose}
            type="button"
          >
            <LinearCancel className="h-5 w-5" />
          </Button>

          <div className="text-primary flex items-center gap-2 [direction:rtl]">
            <LinearInfoCircle className="h-6 w-6 shrink-0" />
            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="semibold"
              className="m-0 text-base leading-6 font-semibold"
            >
              راهنما
            </Typography>
          </div>
        </div>

        <Typography
          as="p"
          variant="body"
          size="large"
          weight="regular"
          className="m-0 mt-3 text-right text-[15px] leading-7 font-normal [direction:rtl]"
        >
          در این بخش، درخواست‌های ملکی کاربران نمایش داده می‌شود. شما می‌توانید براساس نیازهای
          اعلام‌شده، ملک مناسب را پیدا کرده و فایل مرتبط را برای مشتری منتشر کنید. این بخش به شما
          کمک می‌کند سریع‌تر و دقیق‌تر نیاز مشتری را برطرف کنید.
        </Typography>
      </div>
    </section>
  );
}

function ReceivedRequestCard({
  isNew,
  onDelete,
  request,
}: {
  isNew: boolean;
  onDelete: () => void;
  request: PropertySearchRequest;
}) {
  const { hiddenCount, visibleDetails } = getReceivedRequestDetails(request, 6);
  const requestDate = formatReceivedRequestDate(request);

  return (
    <article className="border-surface-container bg-surface-container-lowest relative border-b-8 px-4 pt-7 pb-6 text-right">
      {isNew ? (
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="medium"
          className="bg-error text-on-error absolute top-2 left-4 inline-flex h-6 items-center rounded-full px-2.5 text-xs leading-6 font-medium"
        >
          جدید
        </Typography>
      ) : null}

      <div className="flex items-start justify-between gap-4 [direction:ltr]">
        <Button
          unstyled
          aria-label={`حذف ${request.title}`}
          className="text-on-surface-var focus-visible:outline-primary/40 active:bg-surface-container grid h-10 w-10 shrink-0 place-items-center rounded-lg transition focus-visible:outline-3 focus-visible:outline-offset-[-3px]"
          onClick={onDelete}
          type="button"
        >
          <LinearDelete className="h-6 w-6" />
        </Button>

        <div className="min-w-0 flex-1 [direction:rtl]">
          <div className="flex min-h-10 flex-wrap items-center gap-2">
            <LinearCity className="text-on-surface-var h-6 w-6 shrink-0" />
            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="semibold"
              className="text-on-surface m-0 min-w-0 text-[17px] leading-7 font-bold"
            >
              {request.title}
            </Typography>
            {requestDate ? (
              <time
                className="bg-surface-container text-on-surface inline-flex h-8 shrink-0 items-center rounded-[10px] px-3 text-xs leading-5 font-normal"
                dateTime={request.createdAt}
              >
                {requestDate}
              </time>
            ) : null}
          </div>

          {visibleDetails.length ? (
            <div className="mt-3 flex flex-wrap justify-start gap-2 [direction:rtl]">
              {visibleDetails.map((detail) => (
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="semibold"
                  className="border-outline-var bg-surface-container-lowest text-on-surface-var inline-flex max-w-full items-center rounded-[9px] border px-2.5 py-1.5 text-sm leading-5 font-semibold"
                  key={detail}
                  title={detail}
                >
                  {detail}
                </Typography>
              ))}
              {hiddenCount > 0 ? (
                <Typography
                  as="span"
                  variant="label"
                  size="small"
                  weight="medium"
                  className="border-outline-var bg-surface-container text-on-surface-var inline-flex items-center rounded-[9px] border px-2.5 py-1.5 text-xs leading-5 font-medium"
                >
                  و {toPersianDigits(hiddenCount)} مورد بیشتر
                </Typography>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function CriteriaRequestsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="bg-surface-container space-y-2" aria-label="در حال دریافت درخواست‌ها">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="bg-surface-container-lowest min-h-[148px] overflow-hidden p-4 text-right"
        >
          <div className="flex min-h-7 items-center justify-between gap-3 [direction:ltr]">
            <div className="animate-skeleton h-6 w-12 rounded-lg" />
            <div className="flex items-center gap-2">
              <div className="animate-skeleton h-5 w-32 rounded-md" />
              <div className="animate-skeleton h-5 w-5 rounded-md" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 [direction:rtl]">
            <div className="animate-skeleton h-8 w-20 rounded-[10px]" />
            <div className="animate-skeleton h-8 w-28 rounded-[10px]" />
            <div className="animate-skeleton h-8 w-24 rounded-[10px]" />
            <div className="animate-skeleton h-8 w-32 rounded-[10px]" />
          </div>
        </article>
      ))}
    </div>
  );
}

function ReceivedRequestsSkeleton() {
  return (
    <div aria-label="در حال بارگذاری درخواست‌های دریافتی" aria-live="polite">
      {Array.from({ length: 3 }, (_, index) => (
        <article
          className="border-surface-container bg-surface-container-lowest border-b-8 px-4 pt-7 pb-6"
          key={index}
        >
          <div className="flex items-start justify-between gap-4 [direction:ltr]">
            <div className="animate-skeleton h-10 w-10 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 [direction:rtl]">
              <div className="flex items-center gap-2">
                <div className="animate-skeleton h-6 w-6 shrink-0 rounded" />
                <div className="animate-skeleton h-6 w-36 rounded" />
                <div className="animate-skeleton h-8 w-16 rounded-[10px]" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="animate-skeleton h-8 w-24 rounded-[9px]" />
                <div className="animate-skeleton h-8 w-32 rounded-[9px]" />
                <div className="animate-skeleton h-8 w-28 rounded-[9px]" />
                <div className="animate-skeleton h-8 w-40 rounded-[9px]" />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function EmptyRequestState({
  description,
  title,
  variant,
}: {
  description: string;
  title: string;
  variant: "account" | "default";
}) {
  const isAccount = variant === "account";

  return (
    <section
      className={`bg-surface-container-lowest mx-auto flex w-full flex-col items-center justify-center text-center ${
        isAccount
          ? "min-h-[calc(100dvh-112px)] px-5 pb-10"
          : "min-h-[calc(100dvh-183px)] px-8 pb-16"
      }`}
    >
      <img src="/vectors/NoRequest.svg" className="h-16.5 w-16.5" alt="" aria-hidden="true" />
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="text-on-surface m-0 mt-4 text-base font-semibold"
      >
        {title}
      </Typography>
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface-var m-0 mt-2 max-w-[320px] text-sm font-normal"
      >
        {description}
      </Typography>
    </section>
  );
}
